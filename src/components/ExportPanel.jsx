import React from 'react';
import { getTrafficPrices, seasonFactors, attractionsData, packingListData } from '../data/travelData';
import { getHotelToSpotAdvice, getTransitAdvice, getSpotToHotelAdvice } from '../utils/transitRouter';

export default function ExportPanel({
  config,
  selectedTraffic,
  itinerary,
  selectedHotels,
  packingState
}) {
  const { departure, destination, budget, days } = config;
  const currentMonth = new Date().getMonth() + 1;
  const factor = seasonFactors[currentMonth] || 1.0;
  const attractions = attractionsData[destination] || [];
  
  const defaultCategories = packingListData[destination] || [];
  const checkedNames = packingState?.checkedNames || [];
  const customItems = packingState?.customItems || [];

  // 计算大交通费用
  const baseTraffic = getTrafficPrices(departure, destination);
  const flightPrice = baseTraffic.flight ? Math.round(baseTraffic.flight * factor * 2) : null;
  const trainGPrice = baseTraffic.trainG ? Math.round(baseTraffic.trainG * 2) : null;
  const trainSPrice = baseTraffic.trainS ? Math.round(baseTraffic.trainS * 2) : null;

  const getTrafficCost = () => {
    if (selectedTraffic === 'flight' && flightPrice !== null) return flightPrice;
    if (selectedTraffic === 'trainG' && trainGPrice !== null) return trainGPrice;
    if (selectedTraffic === 'trainS' && trainSPrice !== null) return trainSPrice;
    return 0;
  };

  const getTrafficName = () => {
    if (selectedTraffic === 'flight' && flightPrice !== null) return `飞机经济舱往返 (¥${flightPrice})`;
    if (selectedTraffic === 'trainG' && trainGPrice !== null) return `高铁二等座往返 (¥${trainGPrice})`;
    if (selectedTraffic === 'trainS' && trainSPrice !== null) return `普通列车卧铺往返 (¥${trainSPrice})`;
    return '暂无直达 / 自行前往';
  };

  const trafficCost = getTrafficCost();

  // 计算门票总额
  let attractionsCost = 0;
  const selectedSpotsList = [];
  itinerary.forEach(day => {
    day.spotIds.forEach(id => {
      const spot = attractions.find(s => s.id === id);
      if (spot) {
        attractionsCost += spot.ticketPrice;
        selectedSpotsList.push(spot);
      }
    });
  });

  // 计算住宿总额
  const hotelsCost = selectedHotels.reduce((acc, h) => acc + (h ? h.price : 0), 0);
  const totalSpent = trafficCost + attractionsCost + hotelsCost;
  const remaining = budget - totalSpent;

  // 1. 触发浏览器打印 (保存为 PDF)
  const handlePrintPDF = () => {
    window.print();
  };

  // 2. 复制微信纯文本
  const handleCopyText = () => {
    let text = `📅 【RoamPlanner】${departure} ➔ ${destination} ${days}日游行程攻略单\n`;
    text += `===============================\n`;
    text += `💰 预算看板：总预算 ¥${budget} | 已用 ¥${totalSpent} | 剩余吃喝零用 ¥${remaining}\n`;
    text += `✈️ 大交通：${getTrafficName()} (¥${trafficCost})\n`;
    text += `🏨 住宿：\n`;
    
    selectedHotels.forEach((hotel, idx) => {
      text += `   第 ${idx + 1} 晚: ${hotel ? `${hotel.name} (¥${hotel.price}/晚)` : '未定'}\n`;
    });
    text += `===============================\n\n`;

    itinerary.forEach(day => {
      text += `☀️ Day ${day.day}：${day.title}\n`;
      if (day.spotIds.length > 0) {
        // Prepend starting hotel if selected
        const hotel = day.day === 1 ? selectedHotels[0] : selectedHotels[day.day - 2];
        const firstSpotId = day.spotIds[0];
        if (hotel && firstSpotId) {
          const advice = getHotelToSpotAdvice(destination, hotel, firstSpotId);
          if (advice) {
            text += `   🏨 起点 [住处]: ${hotel.name}\n`;
            text += `   ${advice.icon} 出发交通推荐：${advice.text}\n`;
          }
        }

        day.spotIds.forEach((spotId, sIdx) => {
          const spot = attractions.find(s => s.id === spotId);
          if (spot) {
            text += `   📍 [第 ${sIdx + 1} 站] ${spot.name} (${spot.playTime} | 门票: ${spot.ticketPrice === 0 ? '免费' : `¥${spot.ticketPrice}`})\n`;
            
            // Add nearby food recommendations
            if (spot.guide?.food && spot.guide.food.length > 0) {
              text += `      🍲 周边美食推荐：\n`;
              spot.guide.food.forEach(item => {
                text += `         - ${item.name} (${item.tag} | 人均 ¥${item.perCapita})：推荐 ${item.recommend}\n`;
              });
            }

            // Generate transit advice to the next attraction if there is one
            const nextSpotId = day.spotIds[sIdx + 1];
            if (nextSpotId) {
              const advice = getTransitAdvice(destination, spotId, nextSpotId);
              if (advice) {
                text += `      ${advice.icon} 交通推荐：${advice.text}\n`;
              }
            }

            // 若为当天最后一个景点，推荐回酒店/住处的交通
            if (sIdx === day.spotIds.length - 1) {
              const endHotel = selectedHotels[day.day - 1] || selectedHotels[day.day - 2];
              if (endHotel) {
                const advice = getSpotToHotelAdvice(destination, spotId, endHotel);
                if (advice) {
                  text += `      🏨 终点 [${day.day === days ? '回住处取行李' : '回住处休息'}]: ${endHotel.name}\n`;
                  text += `      ${advice.icon} 返程交通推荐：${advice.text}\n`;
                }
              }
            }
          }
        });
      } else {
        text += `   🎒 自由活动，探索周边\n`;
      }
      text += `\n`;
    });

    // 附带旅行随身行李清单
    if (defaultCategories.length > 0 || customItems.length > 0) {
      text += `🎒 旅行行李备忘清单：\n`;
      defaultCategories.forEach(cat => {
        text += `   【${cat.category}】\n`;
        cat.items.forEach(item => {
          const isChecked = checkedNames.includes(item.name);
          text += `     ${isChecked ? '☑️' : '⬜'} ${item.name} (${item.tip})\n`;
        });
      });
      if (customItems.length > 0) {
        text += `   【自定义物品清单】\n`;
        customItems.forEach(item => {
          text += `     ${item.checked ? '☑️' : '⬜'} ${item.name}\n`;
        });
      }
      text += `===============================\n\n`;
    }

    text += `💡 攻略生成自 RoamPlanner。祝旅途愉快！`;

    navigator.clipboard.writeText(text)
      .then(() => {
        alert('📋 行程文本已成功复制到剪贴板，可以直接发送给微信好友啦！');
      })
      .catch(err => {
        console.error('复制失败: ', err);
        alert('复制失败，请手动选择下方预览区的文字进行复制。');
      });
  };

  return (
    <div className="tab-panel export-panel-layout">
      {/* 顶部操作卡片 */}
      <div className="no-print">
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
          📤 导出与备份你的旅行攻略
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          攻略数据将永久保存在此浏览器中。您可以选择以下方式导出或分享给同行好友。
        </p>
        
        <div className="export-actions">
          <div className="export-card" onClick={handlePrintPDF}>
            <span className="icon">📄</span>
            <h4>生成 PDF 电子行程单</h4>
            <p>调用系统打印，支持保存为 PDF 文件，方便无网离线查看。</p>
          </div>

          <div className="export-card" onClick={handleCopyText}>
            <span className="icon">📋</span>
            <h4>复制微信纯文本</h4>
            <p>一键复制规整的行程详情，可直接黏贴发至微信聊天群。</p>
          </div>

          <div className="export-card" style={{ cursor: 'default' }}>
            <span className="icon">📸</span>
            <h4>手机截图卡片预览</h4>
            <p>下方已为你生成手机排版长卡，可以直接在手机上截屏保存至相册。</p>
          </div>
        </div>
      </div>

      {/* 截图/打印预览区 (模拟精美长图卡片) */}
      <div>
        <h3 className="no-print" style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '1rem', textAlign: 'center' }}>
          📱 攻略长卡预览 (支持截图/打印)
        </h3>
        
        <div className="print-preview-container">
          <div className="print-header">
            <h2>{departure} ✈️ {destination}</h2>
            <div className="meta">
              <span>漫游规划家 · {days} 天定制行程</span>
            </div>
          </div>

          {/* 预算总计栏 */}
          <div className="print-summary">
            <div className="item">
              <span className="lbl">总预算</span>
              <span className="val">¥{budget}</span>
            </div>
            <div className="item">
              <span className="lbl">交通/住宿费</span>
              <span className="val">¥{trafficCost + hotelsCost}</span>
            </div>
            <div className="item">
              <span className="lbl">景点门票</span>
              <span className="val">¥{attractionsCost}</span>
            </div>
            <div className="item">
              <span className="lbl">剩余吃喝玩乐</span>
              <span className="val" style={{ color: '#10b981' }}>¥{remaining}</span>
            </div>
          </div>

          {/* 住宿说明 */}
          <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>🏨 住宿安排清单：</h4>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', lineHeight: '1.5' }}>
              {selectedHotels.map((hotel, idx) => (
                <li key={`print-hotel-${idx}`}>
                  第 {idx + 1} 晚：{hotel ? `${hotel.name} (单价 ¥${hotel.price}/晚，位于 ${hotel.area})` : '自由行未定'}
                </li>
              ))}
            </ul>
          </div>

          {/* 每日详细行程 */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.3rem' }}>
              📅 详细玩乐行程安排
            </h4>
            {itinerary.map(day => (
              <div className="print-day" key={`print-day-${day.day}`}>
                <h3>Day {day.day}：{day.title}</h3>
                {day.spotIds.length > 0 ? (
                  day.spotIds.map((spotId, sIdx) => {
                    const spot = attractions.find(s => s.id === spotId);
                    if (!spot) return null;
                    
                    const hotel = day.day === 1 ? selectedHotels[0] : selectedHotels[day.day - 2];
                    const hotelTransit = (sIdx === 0 && hotel) ? getHotelToSpotAdvice(destination, hotel, spotId) : null;
                    const nextSpotId = day.spotIds[sIdx + 1];
                    const nextSpotTransit = nextSpotId ? getTransitAdvice(destination, spotId, nextSpotId) : null;
                    
                    return (
                      <React.Fragment key={`print-day-${day.day}-${spotId}`}>
                        {sIdx === 0 && hotel && (
                          <div style={{
                            padding: '0.6rem 0.8rem',
                            background: 'rgba(42, 157, 143, 0.05)',
                            borderRadius: '8px',
                            borderLeft: '4px solid var(--secondary)',
                            marginBottom: '0.8rem',
                            fontSize: '0.82rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.4rem',
                            boxSizing: 'border-box'
                          }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span>🏨 起点 [住处]：</span>
                              <span>{hotel.name}</span>
                            </div>
                            {hotelTransit && (
                              <div style={{ color: '#4b5563', paddingLeft: '0.6rem', borderLeft: '1.5px dashed #9ca3af', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <div>
                                  <span style={{ marginRight: '0.3rem' }}>{hotelTransit.icon}</span>
                                  <strong>出发交通推荐：</strong>
                                  <span>{hotelTransit.text}</span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>{hotelTransit.tip}</div>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="spot-item" style={{ marginBottom: nextSpotTransit ? '0.5rem' : '1.5rem' }}>
                          <div className="spot-title">
                            📍 {spot.name} 
                            <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#6b7280', marginLeft: '0.5rem' }}>
                              (建议玩: {spot.playTime} | 门票: {spot.ticketPrice === 0 ? '免费' : `¥${spot.ticketPrice}`})
                            </span>
                          </div>
                          <p className="spot-desc">{spot.description}</p>
                          
                          {/* 美食推荐 */}
                          {spot.guide?.food && spot.guide.food.length > 0 && (
                            <div style={{
                              marginTop: '0.8rem',
                              padding: '0.6rem 0.8rem',
                              background: 'rgba(244, 162, 97, 0.05)',
                              borderRadius: '8px',
                              borderLeft: '3px solid var(--warning)',
                              fontSize: '0.8rem'
                            }}>
                              <div style={{ fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                                <span>🍲</span>
                                <strong>附近美食推荐 (小红书/抖音热推)：</strong>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {spot.guide.food.map((item, idx) => (
                                  <div key={`food-rec-${idx}`} style={{ borderBottom: idx < spot.guide.food.length - 1 ? '1px dashed #ebdcd0' : 'none', paddingBottom: idx < spot.guide.food.length - 1 ? '0.4rem' : '0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', fontWeight: '600', color: 'var(--text-dark)' }}>
                                      <span>{item.name}</span>
                                      <span style={{ color: 'var(--primary)', fontSize: '0.78rem' }}>人均 ¥{item.perCapita} | {item.tag}</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '0.15rem' }}>
                                      <strong>招牌推荐：</strong>{item.recommend}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {nextSpotTransit && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            margin: '0.2rem 0 1rem 1.5rem',
                            fontSize: '0.8rem',
                            color: '#4b5563',
                            borderLeft: '2px dashed #d1d5db',
                            paddingLeft: '0.8rem'
                          }}>
                            <span style={{ fontSize: '1.1rem' }}>{nextSpotTransit.icon}</span>
                            <div>
                              <strong>交通推荐：</strong>
                              <span>{nextSpotTransit.text}</span>
                              <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontStyle: 'italic', marginTop: '0.1rem' }}>{nextSpotTransit.tip}</div>
                            </div>
                          </div>
                        )}
                        {sIdx === day.spotIds.length - 1 && (() => {
                          const endHotel = selectedHotels[day.day - 1] || selectedHotels[day.day - 2];
                          if (!endHotel) return null;
                          const transit = getSpotToHotelAdvice(destination, spotId, endHotel);
                          return (
                            <div style={{
                              padding: '0.6rem 0.8rem',
                              background: 'rgba(244, 162, 97, 0.05)',
                              borderRadius: '8px',
                              borderLeft: '4px solid var(--primary)',
                              marginTop: '0.8rem',
                              marginBottom: '0.5rem',
                              fontSize: '0.82rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.4rem',
                              boxSizing: 'border-box'
                            }}>
                              <div style={{ fontWeight: 'bold', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span>🏨 终点 [{day.day === days ? '回住处取行李' : '回住处休息'}]：</span>
                                <span>{endHotel.name}</span>
                              </div>
                              {transit && (
                                <div style={{ color: '#4b5563', paddingLeft: '0.6rem', borderLeft: '1.5px dashed #9ca3af', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                  <div>
                                    <span style={{ marginRight: '0.3rem' }}>{transit.icon}</span>
                                    <strong>返程交通推荐：</strong>
                                    <span>{transit.text}</span>
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>{transit.tip}</div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic', paddingLeft: '1rem' }}>
                    暂无安排景点，自由探索当地风土人情。
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* 旅行行李清单 */}
          {(defaultCategories.length > 0 || customItems.length > 0) && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fdfbf7', borderRadius: '12px', border: '1.5px dashed var(--card-border)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1.5px dashed var(--card-border)', paddingBottom: '0.4rem', color: 'var(--text-dark)' }}>
                🎒 旅行准备与行李清单
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {defaultCategories.map((cat, cIdx) => (
                  <div key={`print-cat-${cIdx}`} style={{ textAlign: 'left' }}>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                      {cat.category}
                    </h5>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {cat.items.map((item, iIdx) => {
                        const isChecked = checkedNames.includes(item.name);
                        return (
                          <li key={`print-item-${cIdx}-${iIdx}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: isChecked ? '#9ca3af' : 'var(--text-main)' }}>
                            <span>{isChecked ? '☑️' : '⬜'}</span>
                            <div>
                              <span style={{ textDecoration: isChecked ? 'line-through' : 'none', fontWeight: '600' }}>{item.name}</span>
                              <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginTop: '0.1rem', lineHeight: '1.3' }}>{item.tip}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                {customItems.length > 0 && (
                  <div style={{ textAlign: 'left' }}>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                      自定义随身物品
                    </h5>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {customItems.map((item, index) => (
                        <li key={`print-custom-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: item.checked ? '#9ca3af' : 'var(--text-main)' }}>
                          <span>{item.checked ? '☑️' : '⬜'}</span>
                          <span style={{ textDecoration: item.checked ? 'line-through' : 'none', fontWeight: '500' }}>{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.75rem', color: '#9ca3af', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            © RoamPlanner 漫游规划家 · 祝您旅行安全顺利，探索无限美好！
          </div>
        </div>
      </div>
    </div>
  );
}
