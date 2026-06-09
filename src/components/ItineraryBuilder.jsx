import React, { useState } from 'react';
import { attractionsData, itineraryTemplates } from '../data/travelData';
import { getTransitAdvice as getTransitAdviceApi } from '../utils/transitRouter';
import { getAttractionImage } from '../utils/imageMapper';

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
              border: '1.5px solid rgba(201, 74, 41, 0.25)',
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
              gap: '0.4rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--danger)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'var(--danger)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = 'var(--danger)';
              e.currentTarget.style.borderColor = 'rgba(201, 74, 41, 0.25)';
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            一键清空日程
          </button>
          <button
            className="workbench-action-btn"
            onClick={handleLoadTemplate}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            导入经典路线模板
          </button>
          <button
            className="workbench-action-btn"
            onClick={() => onAutoRecommendHotels(itinerary, false)}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            一键推荐住宿
          </button>
          <button
            className={`workbench-action-btn ${isPoolOpen ? 'active' : ''}`}
            onClick={() => setIsPoolOpen(!isPoolOpen)}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            {isPoolOpen ? '收起景点库' : '展开景点库'}
          </button>
        </div>
      </div>

      {/* 智能住宿推荐入口横幅：当用户已规划景点但还没有任何已选酒店时显示 */}
      {itinerary.some(day => day.spotIds.length > 0) && (!selectedHotels || !selectedHotels.some(h => h !== null)) && (
        <div style={{
          background: 'rgba(45, 78, 63, 0.04)',
          border: '1.5px solid rgba(45, 78, 63, 0.12)',
          borderRadius: '16px',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(45, 78, 63, 0.02)',
          animation: 'fadeInDown 0.5s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🧭</span>
            <div>
              <h5 style={{ color: 'var(--primary)', margin: 0, fontSize: '0.98rem', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}>
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
              background: 'var(--primary)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(45, 78, 63, 0.15)',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1e362b';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 78, 63, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(45, 78, 63, 0.15)';
            }}
          >
            ✨ 一键智能推荐住宿
          </button>
        </div>
      )}

      <div className="builder-layout">
        {/* 左侧：每日行程时间轴 */}
        <div className="timeline-wrapper">
          <div className="timeline-line" />
          <div className="timeline-column">
            {itinerary.map((day, dIdx) => {
              const hasSpots = day.spotIds.length > 0;
              return (
                <div className="timeline-day-section" key={`day-${day.day}`}>
                  <div className="timeline-day-badge">D{day.day}</div>
                  
                  <div className="timeline-day-header">
                    <div>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => {
                          const updated = [...itinerary];
                          updated[dIdx].title = e.target.value;
                          onChangeItinerary(updated);
                        }}
                        className="timeline-day-title-input"
                        placeholder="修改这一天的主题..."
                      />
                    </div>
                    <span className="subtitle">共 {day.spotIds.length} 个打卡点</span>
                  </div>

                  <div className="timeline-day-spots">
                    {hasSpots ? (
                      day.spotIds.map((spotId, sIdx) => {
                        const spot = attractions.find(s => s.id === spotId);
                        if (!spot) return null;

                        // 计算到下一个景点的交通建议
                        const nextSpotId = day.spotIds[sIdx + 1];
                        const transit = nextSpotId ? getTransitAdvice(spotId, nextSpotId) : null;
                        const isExpanded = expandedSpotId === `${day.day}_${spotId}`;
                        const imageUrl = getAttractionImage(spot.id, destination);

                        return (
                          <React.Fragment key={`day-${day.day}-spot-${spotId}`}>
                            <div className="spot-card">
                              <div className="spot-card-main-content">
                                <div className="spot-card-thumbnail-wrapper" onClick={() => setExpandedSpotId(isExpanded ? null : `${day.day}_${spotId}`)}>
                                  <img src={imageUrl} alt={spot.name} className="spot-card-thumbnail" loading="lazy" />
                                </div>
                                <div className="spot-card-details">
                                  <div className="header">
                                    <div
                                      className="title"
                                      onClick={() => {
                                        setExpandedSpotId(isExpanded ? null : `${day.day}_${spotId}`);
                                        setGuideTab('photo');
                                      }}
                                    >
                                      {spot.name}
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
                                    <span className="tag tag-rating">⭐ {spot.socialHotRating}</span>
                                    <span className="tag tag-area">{spot.area}</span>
                                    <span className="tag tag-price">门票: {spot.ticketPrice === 0 ? '免费' : `¥${spot.ticketPrice}`}</span>
                                    <span className="tag tag-time">🕒 {spot.playTime}</span>
                                  </div>
                                  <p className="desc">{spot.description}</p>
                                </div>
                              </div>

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
                              <div className="timeline-transit-connector">
                                <span className="icon">{transit.icon}</span>
                                <div className="transit-details">
                                  <strong>交通推荐：{transit.text}</strong>
                                  {transit.tip && <span className="tip">{transit.tip}</span>}
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <div 
                        className="timeline-empty-state"
                        onClick={() => setIsPoolOpen(true)}
                        title="点击展开景点库"
                      >
                        暂无日程安排 · 点击此处或右上角“展开景点库”定制精彩行程
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
              <div className="pool-item-header">
                <div className="title">{spot.name}</div>
                <span className="pool-item-rating">🔥 {spot.socialHotRating}</span>
              </div>
              <div className="pool-item-desc">
                {spot.description}
              </div>
              <div className="pool-item-meta">
                <span className="pool-meta-tag">¥{spot.ticketPrice === 0 ? '免费' : spot.ticketPrice}</span>
                <span className="pool-meta-divider">•</span>
                <span className="pool-meta-tag">🕒 {spot.playTime}</span>
              </div>
              <div className="pool-item-actions">
                <span className="actions-label">添加到日程:</span>
                <div className="day-add-buttons">
                  {Array.from({ length: days }, (_, i) => i + 1).map(dayNum => (
                    <button
                      key={`add-to-d-${dayNum}`}
                      className="pool-day-add-btn"
                      onClick={() => handleAddSpot(spot.id, dayNum)}
                    >
                      D{dayNum}
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
                        <strong style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem' }}>
                          📅 路线概览：
                        </strong>
                        {tpl.schedule.map((schDay) => (
                          <div className="template-preview-day" key={`tpl-${index}-d-${schDay.day}`}>
                            <span className="template-day-tag">
                              D{schDay.day}
                            </span>
                            <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{schDay.title}</span>
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
                          className="template-apply-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyTemplate(tpl);
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
