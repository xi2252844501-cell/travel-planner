import React, { useState, useEffect, useRef } from 'react';
import { cities, departures } from '../data/travelData';
import { defaultImages } from '../utils/imageMapper';

function SearchableSelect({ label, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  // 根据搜索关键字过滤选项
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  // 点击外部时自动关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="searchable-select-container" ref={containerRef}>
      <div
        className={`searchable-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch('');
        }}
      >
        <span>{value || '请选择...'}</span>
        <span className="arrow">▼</span>
      </div>
      
      {isOpen && (
        <div className="searchable-select-dropdown">
          <input
            type="text"
            className="search-input"
            placeholder="输入城市搜索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className={`option-item ${option === value ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="no-options">暂无匹配城市</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TripConfigForm({ onSubmit, initialValues }) {
  const [departure, setDeparture] = useState(initialValues?.departure || '北京');
  const [destination, setDestination] = useState(initialValues?.destination || '三亚');
  const [budget, setBudget] = useState(initialValues?.budget || 5000);
  const [days, setDays] = useState(initialValues?.days || 5);
  
  const formRef = useRef(null);
  const [highlightActive, setHighlightActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (departure === destination) {
      alert('出发地和目的地不能相同，请重新选择！');
      return;
    }
    onSubmit({ departure, destination, budget: Number(budget), days: Number(days) });
  };

  const handleRecentTripClick = (trip) => {
    setDeparture('北京'); // 最近行程默认出发地为北京
    setDestination(trip.city);
    setDays(trip.days);
    setBudget(trip.budget);
    
    // 平滑滚动回表单
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // 触发呼吸灯高亮动画
    setHighlightActive(true);
    setTimeout(() => {
      setHighlightActive(false);
    }, 1500);
  };

  // 预置最近生成的行程数据 (墨绿、鼠尾草绿、香槟金配色渐变)
  const recentTrips = [
    {
      city: '三亚',
      days: 5,
      budget: 5000,
      emoji: '🌴',
      gradient: 'linear-gradient(135deg, #2D4E3F 0%, #406956 100%)'
    },
    {
      city: '成都',
      days: 3,
      budget: 3500,
      emoji: '🐼',
      gradient: 'linear-gradient(135deg, #406956 0%, #719382 100%)'
    },
    {
      city: '北京',
      days: 4,
      budget: 4200,
      emoji: '🏯',
      gradient: 'linear-gradient(135deg, #A88F6C 0%, #C5A880 100%)'
    }
  ];

  return (
    <div className="minimalist-config-container">
      {/* 居中大字标语 */}
      <div className="minimalist-header">
        <h2 className="minimalist-title">RoamPlanner</h2>
        <p className="minimalist-subtitle">BUDGET & ROUTE DRIVEN</p>
        <p className="minimalist-hint">选择目的地，开启规划</p>
      </div>

      {/* 横向宽版表单卡片 */}
      <div className="minimalist-card-wrapper" ref={formRef}>
        <div className={`glass-card config-form-horizontal ${highlightActive ? 'highlight-pulse' : ''}`}>
          <form onSubmit={handleSubmit}>
            {/* 第一行：出发地与目的地 */}
            <div className="form-row form-row-destinations">
              <div className="form-group flex-1" style={{ position: 'relative' }}>
                <label>出发地</label>
                <SearchableSelect
                  value={departure}
                  onChange={setDeparture}
                  options={departures}
                />
              </div>
              <div className="route-arrow">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--secondary)" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
              <div className="form-group flex-1" style={{ position: 'relative' }}>
                <label>目的地</label>
                <SearchableSelect
                  value={destination}
                  onChange={setDestination}
                  options={cities}
                />
              </div>
            </div>

            {/* 第二行：行程天数与人均预算 */}
            <div className="form-row form-row-inputs">
              <div className="form-group flex-1">
                <label htmlFor="days">行程天数</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    id="days"
                    min="2"
                    max="15"
                    step="1"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="custom-input text-center"
                    required
                  />
                  <span className="unit-text">天</span>
                </div>
              </div>
              
              <div className="form-group flex-1">
                <label htmlFor="budget">人均预算 (元)</label>
                <div className="input-with-unit prefix-mode">
                  <span className="prefix-text">¥</span>
                  <input
                    type="number"
                    id="budget"
                    min="500"
                    max="100000"
                    step="100"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="custom-input budget-input"
                    required
                  />
                </div>
                <span className="budget-helper">约 ¥{Math.round(budget / days)}/人天</span>
              </div>
            </div>

            {/* 生成按钮 */}
            <button type="submit" className="btn-primary btn-generate">
              ✨ 生成智能行程方案
            </button>
          </form>
        </div>
      </div>

      {/* 规划旅程的每一步 (4 栏介绍) */}
      <section className="features-section" id="features-section">
        <h3 className="section-title">规划旅程的每一步</h3>
        <div className="feature-card-grid">
          <div className="feature-card">
            <div className="feature-icon-badge">🎯</div>
            <h4>探索目的地</h4>
            <p>深入了解当地人文、热门区域与特色体验</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-badge">📅</div>
            <h4>规划每日日程</h4>
            <p>智能安排景点顺序，优化路线与时间分配</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-badge">🏨</div>
            <h4>筛选智能住宿</h4>
            <p>根据预算与位置，推荐最适合的住宿方案</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-badge">📋</div>
            <h4>完整行程攻略</h4>
            <p>一键导出详细攻略，含交通美食与实用贴士</p>
          </div>
        </div>
      </section>

      {/* 最近生成的行程 (3 栏交互卡片) */}
      <section className="recent-trips-section" id="recent-trips-section">
        <div className="section-header">
          <h3 className="section-title">最近生成的行程</h3>
          <span className="see-all-link" onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}>
            查看全部 &rarr;
          </span>
        </div>
        <div className="trip-card-grid">
          {recentTrips.map((trip) => (
            <div key={trip.city} className="trip-card" onClick={() => handleRecentTripClick(trip)}>
              <div className="trip-card-header-img-wrapper">
                <img 
                  src={defaultImages[trip.city]} 
                  alt={trip.city} 
                  className="trip-card-header-img" 
                  loading="lazy" 
                />
                <div className="trip-card-header-overlay" />
              </div>
              <div className="trip-card-body">
                <h4>{trip.city}</h4>
                <p>{trip.days}天 · ¥{trip.budget}/人</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
