import React, { useState } from 'react';
import { hotelsData, attractionsData } from '../data/travelData';
import { getHotelImage } from '../utils/imageMapper';

export default function HotelRecommender({
  config,
  itinerary,
  selectedHotels, // 数组，长度为 days - 1
  onUpdateHotels,
  onAutoRecommendHotels
}) {
  const { destination, days, budget } = config;
  const hotels = hotelsData[destination] || [];
  const attractions = attractionsData[destination] || [];
  const nights = days - 1;

  // 当前正在为哪一晚选择酒店 (0-indexed)
  const [activeNightIndex, setActiveNightIndex] = useState(0);
  // 区域过滤状态
  const [selectedArea, setSelectedArea] = useState('All');
  // 价格过滤状态 ('All' | 'under200' | '200to400' | 'over400' | 'budgetFit')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  // 各酒店卡片中“避坑与反馈贴士”的折叠状态 (key 为 hotel.id)
  const [expandedComments, setExpandedComments] = useState({});
  // 筛选面板折叠状态 (默认为收起，保持界面清爽)
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
  // 酒店名称搜索状态
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCommentExpand = (hotelId) => {
    setExpandedComments(prev => ({
      ...prev,
      [hotelId]: !prev[hotelId]
    }));
  };

  // 获取所有在行程中被选中的景点
  const getAllSelectedSpotIds = () => {
    const ids = [];
    itinerary.forEach(day => {
      day.spotIds.forEach(id => {
        if (!ids.includes(id)) ids.push(id);
      });
    });
    return ids;
  };

  const selectedSpotIds = getAllSelectedSpotIds();

  // 核心智能推荐算法：分析路线并给出避坑/分段住宿建议
  const getSmartHotelAdvice = () => {
    if (selectedSpotIds.length === 0) {
      return {
        type: 'info',
        icon: '🧭',
        title: '开启智能住宿分析',
        text: '请先在“每日日程”中添加一些景点，系统将自动分析行程路线，为您算出最佳的住宿区域和避坑建议！'
      };
    }

    // 检查是否有偏远景点（如北京环球影城、古北水镇、八达岭长城，三亚蜈支洲岛）
    const hasUniversal = selectedSpotIds.includes('universal');
    const hasBadaling = selectedSpotIds.includes('badaling');
    const hasWuzhizhou = selectedSpotIds.includes('wuzhizhou');

    // 找出环球影城在第几天
    let universalDay = null;
    itinerary.forEach(day => {
      if (day.spotIds.includes('universal')) {
        universalDay = day.day;
      }
    });

    if (destination === '北京' && hasUniversal) {
      return {
        type: 'warning',
        icon: '💡',
        title: '黄金分段住宿建议 (北京环球影城专线)',
        text: `检测到您在第 ${universalDay} 天规划了【北京环球影城】。由于影城位于通州区，距离市区约25公里，早高峰挤地铁极其消耗体力。
        建议：前 ${universalDay - 1} 晚入住【东城区-南锣鼓巷/胡同商圈】（方便游玩故宫、天坛），在第 ${universalDay} 晚转住到【通州区-环球影城周边民宿】。我们为您精选的通州哈利波特民宿提供免费接送服务，省时省心！`
      };
    }

    if (destination === '北京' && hasBadaling) {
      return {
        type: 'warning',
        icon: '⛰️',
        title: '长城出行住宿建议',
        text: '检测到您的行程包含【八达岭长城】。长城位于郊外延庆区，路程较远（约75公里）。建议当天早起在东直门或积水潭乘坐旅游专车，住宿仍可保留在市区二环附近（东城区），无需特意更换酒店。'
      };
    }

    if (destination === '三亚' && hasWuzhizhou) {
      return {
        type: 'warning',
        icon: '🏝️',
        title: '分段海岛度假建议',
        text: '您的行程包含【蜈支洲岛】。蜈支洲岛位于海棠湾，水质极佳但离三亚市区较远。建议：前几天入住【大东海】享受高性价比和丰富的当地美食；倒数第一晚入住【海棠湾珊瑚酒店】，享受VIP免排队登岛资格，静享奢华海岛日出。'
      };
    }

    // 默认情况：计算景点分布最密集的区域
    const areaCounts = {};
    selectedSpotIds.forEach(id => {
      const spot = attractions.find(s => s.id === id);
      if (spot) {
        areaCounts[spot.area] = (areaCounts[spot.area] || 0) + 1;
      }
    });

    let maxArea = '';
    let maxCount = 0;
    Object.keys(areaCounts).forEach(area => {
      if (areaCounts[area] > maxCount) {
        maxCount = areaCounts[area];
        maxArea = area;
      }
    });

    return {
      type: 'success',
      icon: '✅',
      title: '路线地理中心推荐',
      text: `分析完毕！您的主要游玩景点集中在【${maxArea}】。建议全程入住【${maxArea}】附近的精品酒店/民宿，平均每日通勤时间在 15 分钟以内，能够极大减少舟车劳顿。`
    };
  };

  const advice = getSmartHotelAdvice();

  // 更新某晚的酒店
  const handleSelectHotel = (hotel) => {
    const updated = [...selectedHotels];
    updated[activeNightIndex] = hotel;
    onUpdateHotels(updated);
  };

  // 一键将当前酒店应用到所有夜晚
  const handleApplyToAllNights = (hotel) => {
    const updated = Array(nights).fill(hotel);
    onUpdateHotels(updated);
  };

  // 计算景点门票开销
  let attractionsCost = 0;
  itinerary.forEach(day => {
    day.spotIds.forEach(id => {
      const spot = attractions.find(s => s.id === id);
      if (spot) attractionsCost += spot.ticketPrice;
    });
  });

  // 过滤酒店区域与价格
  const areas = ['All', ...new Set(hotels.map(h => h.area))];
  const filteredHotels = hotels.filter(h => {
    // 1. 区域过滤
    const areaMatch = selectedArea === 'All' || h.area === selectedArea;
    // 2. 价格过滤
    let priceMatch = true;
    if (selectedPriceRange === 'under200') {
      priceMatch = h.price < 200;
    } else if (selectedPriceRange === '200to400') {
      priceMatch = h.price >= 200 && h.price <= 400;
    } else if (selectedPriceRange === 'over400') {
      priceMatch = h.price > 400;
    } else if (selectedPriceRange === 'budgetFit') {
      const maxTolerablePrice = Math.max((budget - attractionsCost) / nights, 0);
      priceMatch = h.price <= maxTolerablePrice;
    }
    // 3. 搜索过滤
    const searchMatch = !searchQuery.trim() || h.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return areaMatch && priceMatch && searchMatch;
  });

  // 一键智能匹配全程酒店住宿
  const handleAutoRecommendAll = () => {
    onAutoRecommendHotels(itinerary, false);
  };

  // 一键清空所有已选住宿
  const handleClearAllHotels = () => {
    if (window.confirm('您确定要清空所有晚的住宿选择吗？此操作不可撤销。')) {
      const cleared = Array(nights).fill(null);
      onUpdateHotels(cleared);
    }
  };

  return (
    <div className="tab-panel hotel-panel">
      {/* 1. 智能住宿规划建议 */}
      <div className="rec-advice-card" style={{
        borderColor: advice.type === 'warning' ? 'var(--warning)' : advice.type === 'success' ? 'var(--secondary)' : 'var(--primary)',
        background: advice.type === 'warning' ? 'rgba(245,158,11,0.08)' : advice.type === 'success' ? 'rgba(16,185,129,0.08)' : 'var(--primary-glow)'
      }}>
        <span className="icon">{advice.icon}</span>
        <div>
          <h4 style={{ color: advice.type === 'warning' ? 'var(--warning)' : advice.type === 'success' ? 'var(--secondary)' : 'var(--text-dark)' }}>
            {advice.title}
          </h4>
          <p>{advice.text}</p>
        </div>
      </div>

      {/* 2. 每日住宿概览与筛选过滤器 (悬浮固化面板) */}
      <div className="hotel-sticky-panel no-print">
        {/* 住宿时间线 */}
        <div className="hotel-timeline-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: 'var(--text-dark)', margin: 0 }}>
              🏨 安排你的住宿日程
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-muted)', marginLeft: '0.4rem', verticalAlign: 'middle' }}>
                （共 {nights} 晚）
              </span>
            </h3>
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* 🔍 搜索酒店框 */}
              <div className="hotel-search-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="搜索酒店名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="hotel-search-input"
                  style={{
                    padding: '0.45rem 1rem 0.45rem 2.2rem',
                    fontSize: '0.82rem',
                    borderRadius: '30px',
                    border: '1.2px solid rgba(45, 78, 63, 0.15)',
                    outline: 'none',
                    width: '165px',
                    transition: 'var(--transition-smooth)',
                    background: '#ffffff',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    position: 'absolute',
                    left: '0.9rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '0.8rem',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="清空搜索"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                onClick={handleAutoRecommendAll}
                className="workbench-action-btn"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                一键智能推荐住宿
              </button>
              <button
                onClick={handleClearAllHotels}
                style={{
                  background: 'none',
                  border: '1.2px solid rgba(201, 74, 41, 0.25)',
                  color: 'var(--danger)',
                  borderRadius: '30px',
                  padding: '0.55rem 1.2rem',
                  fontSize: '0.82rem',
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
                一键清空住宿
              </button>
              <button
                onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
                className={`workbench-action-btn toggle-filter-btn ${isFilterCollapsed ? '' : 'expanded'}`}
              >
                {isFilterCollapsed ? '展开筛选 ▾' : '收起筛选 ▴'}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {selectedHotels.map((hotel, index) => {
              const isActive = activeNightIndex === index;
              return (
                <div
                  key={`night-${index}`}
                  onClick={() => setActiveNightIndex(index)}
                  style={{
                    background: isActive ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                    border: isActive ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                    borderRadius: '10px',
                    padding: '0.8rem 1.2rem',
                    minWidth: '160px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: isActive ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 'bold' }}>
                    第 {index + 1} 晚住宿 {isActive && '👉'}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: hotel ? 'var(--text-dark)' : 'var(--danger)', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {hotel ? hotel.name : '未选择酒店'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: '0.1rem' }}>
                    {hotel ? `¥${hotel.price}/晚` : '-'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 筛选过滤 */}
        {!isFilterCollapsed && (
          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.2rem', marginTop: '1.2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: 'bold', margin: 0 }}>
                    筛选第 {activeNightIndex + 1} 晚的酒店
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.2rem', margin: 0 }}>
                    当前可支配吃住日均余额：约 <strong style={{ color: 'var(--primary)' }}>
                      ¥{Math.round((budget - attractionsCost) / days)}
                    </strong> 元
                  </p>
                </div>
              </div>

              {/* 过滤器容器 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(8px)', border: '1.5px solid var(--card-border)', padding: '1.2rem', borderRadius: '16px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.01)' }}>
                {/* 区域选择 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--text-dark)', minWidth: '80px' }}>🧭 按区域筛选:</span>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {areas.map(area => (
                      <button
                        key={`filter-${area}`}
                        onClick={() => setSelectedArea(area)}
                        className={`filter-btn ${selectedArea === area ? 'active' : ''}`}
                      >
                        {area === 'All' ? '全部区域' : area}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 价格筛选 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1.5px dashed var(--card-border)', paddingTop: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--text-dark)', minWidth: '80px' }}>💰 按价格筛选:</span>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {[
                      { value: 'All', label: '全部价格' },
                      { value: 'under200', label: '¥200以下' },
                      { value: '200to400', label: '¥200 - ¥400' },
                      { value: 'over400', label: '¥400以上' },
                      { value: 'budgetFit', label: '适合我的预算' }
                    ].map(item => (
                      <button
                        key={`price-${item.value}`}
                        onClick={() => setSelectedPriceRange(item.value)}
                        className={`filter-btn ${selectedPriceRange === item.value ? 'active' : ''}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. 酒店列表 */}
      <div className="hotel-list-section">
        <div className="hotels-grid">
          {filteredHotels.map(hotel => {
            const isSelectedForActiveNight = selectedHotels[activeNightIndex]?.id === hotel.id;
            const totalSelectNights = selectedHotels.filter(h => h?.id === hotel.id).length;

            return (
              <div className={`hotel-card ${isSelectedForActiveNight ? 'selected' : ''}`} key={`hotel-${hotel.id}`}>
                <div className="hotel-card-image-wrapper">
                  <img src={getHotelImage(hotel.id, destination)} alt={hotel.name} className="hotel-card-image" loading="lazy" />
                </div>
                <div>
                  <div className="hotel-header">
                    <span className="hotel-name">{hotel.name}</span>
                    <span className="tag tag-rating">🔥 {hotel.socialHotRating}</span>
                  </div>
                  {hotel.userVisited && (
                    <div className={`hotel-review-badge ${hotel.userVisited}`}>
                      {destination === '三亚' ? (
                        hotel.userVisited === 'recommended' ? '👑 阿曦入住 · 强烈推荐' : '⚠️ 避坑真实反馈'
                      ) : (
                        hotel.userVisited === 'recommended' ? '👑 网友推荐 · 口碑极佳' : '⚠️ 避坑真实反馈'
                      )}
                    </div>
                  )}
                  <div className="hotel-location-text">
                    📍 {hotel.area} · {hotel.subarea}
                  </div>
                  <div className="hotel-tags">
                    {hotel.tags.map(t => (
                      <span className="hotel-tag" key={t}>{t}</span>
                    ))}
                  </div>
                  <p className="hotel-desc">{hotel.recommendReason}</p>
                  {hotel.socialCommentFeedback && (
                    <div style={{
                      marginTop: '0.8rem',
                      background: 'rgba(255, 255, 255, 0.45)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(229, 109, 68, 0.15)',
                      borderLeft: '4px solid var(--primary)',
                      padding: '0.65rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      lineHeight: '1.45',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
                    }}>
                      <button
                        className="comment-accordion-btn"
                        onClick={() => toggleCommentExpand(hotel.id)}
                        type="button"
                      >
                        <span>💬 抖音/小红书避坑与真实反馈贴士</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                          {expandedComments[hotel.id] ? '▲ 收起' : '▼ 展开'}
                        </span>
                      </button>
                      <div className={`comment-accordion-content ${expandedComments[hotel.id] ? 'expanded' : ''}`}>
                        <div style={{ color: 'var(--text-dark)', paddingTop: '0.2rem' }}>
                           {hotel.socialCommentFeedback}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {/* OTA 比价框 */}
                  {hotel.platformPrices ? (
                    <div className="ota-compare">
                      <span>携程:<b>¥{hotel.platformPrices.ctrip}</b></span>
                      <span>去哪儿:<b>¥{hotel.platformPrices.qunar}</b></span>
                      <span>Agoda:<b>¥{hotel.platformPrices.agoda}</b></span>
                    </div>
                  ) : (
                    <div className="ota-compare">
                      <span>携程:<b>¥{Math.round(hotel.price * 0.96)}</b></span>
                      <span>去哪儿:<b>¥{Math.round(hotel.price * 0.95)}</b></span>
                      <span>Agoda:<b>¥{Math.round(hotel.price * 1.02)}</b></span>
                    </div>
                  )}

                  <div className="hotel-footer">
                    <div className="price-box">
                      <span className="num">¥{hotel.price}</span>
                      <span className="lbl">每晚单价</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="select-hotel-btn"
                        onClick={() => handleApplyToAllNights(hotel)}
                        style={{ borderStyle: 'dashed', fontSize: '0.8rem' }}
                      >
                        全程入住
                      </button>
                      <button
                        className="select-hotel-btn"
                        onClick={() => handleSelectHotel(hotel)}
                      >
                        {isSelectedForActiveNight ? '已选此晚' : '仅订此晚'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
