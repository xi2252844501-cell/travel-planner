import React, { useState } from 'react';
import { attractionsData, itineraryTemplates } from '../data/travelData';
import { getTransitAdvice as getTransitAdviceApi } from '../utils/transitRouter';

export default function ItineraryBuilder({
  config,
  itinerary,
  onChangeItinerary,
  onAutoRecommendHotels,
  selectedHotels
}) {
  const { destination, days } = config;
  const attractions = attractionsData[destination] || [];

  // 展开指南的景点 ID
  const [expandedSpotId, setExpandedSpotId] = useState(null);
  // 景点指南内部选中的 Tab (photo, food, activities)
  const [guideTab, setGuideTab] = useState('photo');
  // 控制路线模板选择弹窗的显示状态
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  // 控制可选景点库滑动抽屉的展开状态
  const [isPoolOpen, setIsPoolOpen] = useState(false);

  // 智能交通路由推荐：调用 shared transitRouter
  const getTransitAdvice = (spot1Id, spot2Id) => {
    return getTransitAdviceApi(destination, spot1Id, spot2Id);
  };

  // 添加景点到某一天
  const handleAddSpot = (spotId, dayNum) => {
    const updated = itinerary.map(day => {
      if (day.day === dayNum) {
        // 避免重复添加
        if (day.spotIds.includes(spotId)) {
          alert('该景点已在此天行程中！');
          return day;
        }
        return { ...day, spotIds: [...day.spotIds, spotId] };
      }
      return day;
    });
    onChangeItinerary(updated);
  };

  // 从某一天移除景点
  const handleRemoveSpot = (spotId, dayNum) => {
    const updated = itinerary.map(day => {
      if (day.day === dayNum) {
        return { ...day, spotIds: day.spotIds.filter(id => id !== spotId) };
      }
      return day;
    });
    onChangeItinerary(updated);
  };

  // 加载经典预设模板
  const handleLoadTemplate = () => {
    setShowTemplateModal(true);
  };

  // 应用选中的模板到行程中
  const handleApplyTemplate = (template) => {
    // 将模板格式化为当前行程天数大小的数组
    const formatted = Array.from({ length: days }, (_, i) => {
      const dayNum = i + 1;
      const templateDay = template.schedule.find(d => d.day === dayNum);
      if (templateDay) {
        return {
          day: dayNum,
          title: templateDay.title,
          spotIds: [...templateDay.spotIds],
          desc: templateDay.desc
        };
      } else {
        return {
          day: dayNum,
          title: `第 ${dayNum} 天行程`,
          spotIds: [],
          desc: '自由探索时间'
        };
      }
    });
    onChangeItinerary(formatted);
    setShowTemplateModal(false);
  };

  // 一键清空日程
  const handleClearAll = () => {
    if (window.confirm('您确定要清空所有天的日程景点吗？此操作不可撤销。')) {
      const cleared = itinerary.map(day => ({
        ...day,
        spotIds: []
      }));
      onChangeItinerary(cleared);
    }
  };

  return (
    <div className="tab-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', color: 'var(--text-dark)' }}>编辑每日玩乐日程</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>定制你每天想去的景点，系统会自动为您规划交通路线与指南</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleClearAll}
            style={{
              background: 'none',
              border: '1.5px solid var(--danger)',
              color: 'var(--danger)',
              borderRadius: '10px',
              padding: '0.6rem 1.2rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--danger)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = 'var(--danger)';
            }}
          >
            🗑️ 一键清空日程
          </button>
          <button className="btn-primary" onClick={handleLoadTemplate} style={{ width: 'auto', marginTop: 0, padding: '0.6rem 1.2rem', fontSize: '0.9rem', background: 'linear-gradient(135deg, #0ea5e9, #10b981)' }}>
            🎒 导入经典路线模板
          </button>
          <button
            className="btn-primary"
            onClick={() => onAutoRecommendHotels(itinerary, false)}
            style={{
              width: 'auto',
              marginTop: 0,
              padding: '0.6rem 1.2rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, var(--secondary), #207a70)',
              boxShadow: '0 2px 8px rgba(42, 157, 143, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(42, 157, 143, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(42, 157, 143, 0.2)';
            }}
          >
            🏠 一键推荐住宿
          </button>
          <button
            className="btn-primary"
            onClick={() => setIsPoolOpen(!isPoolOpen)}
            style={{
              width: 'auto',
              marginTop: 0,
              padding: '0.6rem 1.2rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              background: isPoolOpen ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--primary), var(--warning))',
              boxShadow: '0 2px 8px rgba(231, 111, 81, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              if (!isPoolOpen) {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(231, 111, 81, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              if (!isPoolOpen) {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(231, 111, 81, 0.2)';
              }
            }}
          >
            💡 {isPoolOpen ? '收起景点库' : '展开景点库'}
          </button>
        </div>
      </div>

      {/* 智能住宿推荐入口横幅：当用户已规划景点但还没有任何已选酒店时显示 */}
      {itinerary.some(day => day.spotIds.length > 0) && (!selectedHotels || !selectedHotels.some(h => h !== null)) && (
        <div style={{
          background: 'rgba(42, 157, 143, 0.08)',
          border: '1.5px solid rgba(42, 157, 143, 0.25)',
          borderRadius: '16px',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(42, 157, 143, 0.05)',
          animation: 'fadeInDown 0.5s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🧭</span>
            <div>
              <h5 style={{ color: 'var(--secondary)', margin: 0, fontSize: '0.98rem', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}>
                智能住宿推荐助手
              </h5>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.82rem', marginTop: '0.2rem' }}>
                您已规划了每日游玩景点！系统可以自动根据您每天游玩景点的地理分布（如 Day 1 在三亚湾，Day 4 在海棠湾），一键智能生成最省通勤时间的推荐住宿！
              </p>
            </div>
          </div>
          <button
            onClick={() => onAutoRecommendHotels(itinerary, false)}
            style={{
              background: 'linear-gradient(135deg, var(--secondary), #207a70)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(42, 157, 143, 0.2)',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(42, 157, 143, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(42, 157, 143, 0.2)';
            }}
          >
            ✨ 一键生成推荐住宿
          </button>
        </div>
      )}

      <div className="builder-layout">
        {/* 左侧：每日行程时间轴 */}
        <div className="timeline-column">
          {itinerary.map((day, dIdx) => {
            const hasSpots = day.spotIds.length > 0;
            return (
              <div className="day-container" key={`day-${day.day}`}>
                <div className="day-header">
                  <div>
                    <h3>Day {day.day}</h3>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => {
                        const updated = [...itinerary];
                        updated[dIdx].title = e.target.value;
                        onChangeItinerary(updated);
                      }}
                      style={{ background: 'none', border: 'none', borderBottom: '1px dashed var(--card-border)', color: 'var(--text-muted)', fontSize: '0.85rem', width: '220px', padding: '0.1rem 0', outline: 'none' }}
                      placeholder="修改这一天的主题..."
                    />
                  </div>
                  <span className="subtitle">共 {day.spotIds.length} 个打卡点</span>
                </div>

                <div className="day-spots">
                  {hasSpots ? (
                    day.spotIds.map((spotId, sIdx) => {
                      const spot = attractions.find(s => s.id === spotId);
                      if (!spot) return null;

                      // 计算到下一个景点的交通建议
                      const nextSpotId = day.spotIds[sIdx + 1];
                      const transit = nextSpotId ? getTransitAdvice(spotId, nextSpotId) : null;
                      const isExpanded = expandedSpotId === `${day.day}_${spotId}`;

                      return (
                        <React.Fragment key={`day-${day.day}-spot-${spotId}`}>
                          <div className="spot-card">
                            <div className="header">
                              <div
                                className="title"
                                onClick={() => {
                                  setExpandedSpotId(isExpanded ? null : `${day.day}_${spotId}`);
                                  setGuideTab('photo');
                                }}
                              >
                                {spot.name}
                                <span style={{ fontSize: '0.75rem', color: '#10b981', marginLeft: '0.6rem', background: 'rgba(16,185,129,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                  ⭐ {spot.socialHotRating}
                                </span>
                              </div>
                              <button
                                className="remove-btn"
                                onClick={() => handleRemoveSpot(spotId, day.day)}
                                title="从行程中移除"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="meta">
                              <span className="tag primary">{spot.area}</span>
                              <span className="tag warning">门票: {spot.ticketPrice === 0 ? '免费' : `¥${spot.ticketPrice}`}</span>
                              <span className="tag">玩 {spot.playTime}</span>
                            </div>
                            <p className="desc">{spot.description}</p>

                            {/* 景点折叠指南 (小红书/抖音风) */}
                            {isExpanded && (
                              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--card-border)', paddingTop: '0.8rem' }}>
                                <div className="guide-tabs">
                                  <button
                                    className={`guide-tab ${guideTab === 'photo' ? 'active' : ''}`}
                                    onClick={() => setGuideTab('photo')}
                                  >
                                    📸 小红书机位
                                  </button>
                                  <button
                                    className={`guide-tab ${guideTab === 'food' ? 'active' : ''}`}
                                    onClick={() => setGuideTab('food')}
                                  >
                                    🍤 附近美食
                                  </button>
                                  <button
                                    className={`guide-tab ${guideTab === 'activities' ? 'active' : ''}`}
                                    onClick={() => setGuideTab('activities')}
                                  >
                                    ⛵ 游玩项目
                                  </button>
                                </div>

                                <div className="guide-content">
                                  {guideTab === 'photo' && spot.guide.photoSpots.map((item, idx) => (
                                    <div className="guide-item" key={`photo-${idx}`}>
                                      <div className="title">📍 {item.location}</div>
                                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.tip}</p>
                                    </div>
                                  ))}

                                  {guideTab === 'food' && spot.guide.food.map((item, idx) => (
                                    <div className="guide-item" key={`food-${idx}`} style={{ borderLeftColor: '#f59e0b' }}>
                                      <div className="title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>🍲 {item.name}</span>
                                        <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>人均 ¥{item.perCapita}</span>
                                      </div>
                                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>推荐: {item.recommend}</p>
                                    </div>
                                  ))}

                                  {guideTab === 'activities' && (
                                    <div>
                                      {spot.guide.activities.free.map((item, idx) => (
                                        <div className="guide-item" key={`act-free-${idx}`} style={{ borderLeftColor: '#10b981' }}>
                                          <div className="title">🏖️ 免费体验</div>
                                          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item}</p>
                                        </div>
                                      ))}
                                      {spot.guide.activities.paid.map((item, idx) => (
                                        <div className="guide-item" key={`act-paid-${idx}`} style={{ borderLeftColor: '#ef4444' }}>
                                          <div className="title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>⛵ 收费项目: {item.project}</span>
                                            <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{item.price}</span>
                                          </div>
                                          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>⚠️ 避坑: {item.tip}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 景点间交通连接器 */}
                          {transit && (
                            <div className="transit-connector">
                              <span className="icon">{transit.icon}</span>
                              <div>
                                <strong>交通推荐：</strong>
                                <span>{transit.text}</span>
                                <div className="tip">{transit.tip}</div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', border: '1.5px dashed var(--card-border)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      还没有添加景点，点击右上角“💡 展开景点库”来定制你的日程吧 ✨
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 右侧：可选景点池滑动抽屉 */}
      {isPoolOpen && (
        <div className="pool-drawer-overlay no-print" onClick={() => setIsPoolOpen(false)} />
      )}
      <div className={`pool-drawer no-print ${isPoolOpen ? 'open' : ''}`}>
        <div className="pool-header">
          <div>
            <h4 style={{ margin: 0, fontFamily: 'var(--font-title)', fontSize: '1.35rem', color: 'var(--text-dark)' }}>
              💡 {destination}热门打卡景点
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem', margin: 0 }}>
              点击底部的 +Dx 将其添加进指定日程中
            </p>
          </div>
          <button className="pool-close-btn" onClick={() => setIsPoolOpen(false)}>✕</button>
        </div>
        <div className="pool-list">
          {attractions.map(spot => (
            <div className="pool-item" key={`pool-${spot.id}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                <div className="title">{spot.name}</div>
                <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>🔥 {spot.socialHotRating}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                {spot.description}
              </div>
              <div className="meta-row">
                <span>¥{spot.ticketPrice === 0 ? '免费' : spot.ticketPrice} | {spot.playTime}</span>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {Array.from({ length: days }, (_, i) => i + 1).map(dayNum => (
                    <button
                      key={`add-to-d-${dayNum}`}
                      className="add-btn"
                      onClick={() => handleAddSpot(spot.id, dayNum)}
                    >
                      +D{dayNum}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 路线模板选择 Modal Overlay */}
      {showTemplateModal && (
        <div className="modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: 'var(--text-dark)', margin: 0 }}>选择经典游玩路线模板</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem', margin: 0 }}>
                  为 {destination} 适配经典行程方案 (您当前设置的行程为 {days} 天)
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowTemplateModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              {itineraryTemplates[destination] && itineraryTemplates[destination].length > 0 ? (
                itineraryTemplates[destination].map((tpl, index) => {
                  const dayDiff = tpl.days - days;
                  
                  // Helper function to resolve attraction names
                  const getSpotNames = (spotIds) => {
                    return spotIds
                      .map(id => {
                        const spot = attractions.find(s => s.id === id);
                        return spot ? spot.name : id;
                      })
                      .join(' → ');
                  };

                  return (
                    <div className="template-card" key={`tpl-${index}`} onClick={() => handleApplyTemplate(tpl)}>
                      <div className="template-header">
                        <span className="template-title">{tpl.name}</span>
                        <span className="template-days-badge">{tpl.days}天游</span>
                      </div>

                      {/* Day count compatibility warning */}
                      {dayDiff === 0 ? (
                        <div className="template-warning success-theme" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>🟢</span>
                          <span>完美契合您当前配置的 {days} 天行程！</span>
                        </div>
                      ) : dayDiff < 0 ? (
                        <div className="template-warning warning-theme" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>💡</span>
                          <span>此模板为 {tpl.days} 天，应用后 Day {tpl.days + 1} 到 Day {days} 将自动保留为“自由探索”时间。</span>
                        </div>
                      ) : (
                        <div className="template-warning danger-theme" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>⚠️</span>
                          <span>此模板为 {tpl.days} 天，由于您当前只设置了 {days} 天行程，应用后仅会加载模板前 {days} 天的打卡计划。</span>
                        </div>
                      )}

                      {/* Day-by-Day schedule preview */}
                      <div className="template-schedule-preview">
                        <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                          📅 路线概览：
                        </strong>
                        {tpl.schedule.map((schDay) => (
                          <div className="template-preview-day" key={`tpl-${index}-d-${schDay.day}`}>
                            <span style={{ fontWeight: '600', color: 'var(--primary)', marginRight: '0.4rem' }}>
                              D{schDay.day}:
                            </span>
                            <span style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{schDay.title}</span>
                            {schDay.spotIds && schDay.spotIds.length > 0 && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                                ({getSpotNames(schDay.spotIds)})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-primary" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyTemplate(tpl);
                          }}
                          style={{
                            width: 'auto',
                            margin: 0,
                            padding: '0.5rem 1.2rem',
                            fontSize: '0.85rem',
                            background: 'linear-gradient(135deg, var(--primary), var(--warning))'
                          }}
                        >
                          应用此路线模板
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                  暂无此城市的经典路线模板
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
