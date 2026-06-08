import React, { useState, useEffect, useRef } from 'react';
import { cities, departures } from '../data/travelData';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (departure === destination) {
      alert('出发地和目的地不能相同，请重新选择！');
      return;
    }
    onSubmit({ departure, destination, budget: Number(budget), days: Number(days) });
  };

  // 预算评级
  const getBudgetTier = () => {
    const daily = budget / days;
    if (daily < 200) return { label: '勤俭持家/特种兵 🎒', color: '#ef4444' };
    if (daily < 500) return { label: '经济舒适型 🚕', color: '#f59e0b' };
    if (daily < 1500) return { label: '高品质度假 ✈️', color: '#0ea5e9' };
    return { label: '豪华享乐派 👑', color: '#10b981' };
  };

  const tier = getBudgetTier();

  return (
    <div className="hero-split-container">
      {/* 左侧：品牌展示与美学海报 */}
      <div className="hero-branding-section">
        <div className="hero-badge">✨ 预算及线路双驱动智能分析</div>
        <h2 className="hero-title">遇见下一个远方<br />从精准路线与预算开始</h2>
        <p className="hero-subtitle">
          漫游规划家能够智能解析景点几何中心，精细估算交通里程，智能排除社交媒体避坑酒店，并严格精算每日剩余吃喝玩乐水位，让您的旅行不仅好玩、少走冤枉路，而且预算尽在掌握。
        </p>
        <div className="hero-cities-gallery">
          <div className="gallery-item bg-beijing">
            <div className="gallery-card-content">
              <span className="city-tag">📍 北京</span>
              <span className="city-desc">皇家历史与现代影城</span>
            </div>
          </div>
          <div className="gallery-item bg-sanya">
            <div className="gallery-card-content">
              <span className="city-tag">📍 三亚</span>
              <span className="city-desc">椰林海风与奢华海岛</span>
            </div>
          </div>
          <div className="gallery-item bg-chengdu">
            <div className="gallery-card-content">
              <span className="city-tag">📍 成都</span>
              <span className="city-desc">安逸宽窄与烟火火锅</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧：表单配置卡片 */}
      <div className="hero-form-section">
        <div className="glass-card config-form">
          <h3 className="form-title">开始配置您的定制行程</h3>
          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <div className="form-group" style={{ position: 'relative' }}>
                <label>出发地</label>
                <SearchableSelect
                  value={departure}
                  onChange={setDeparture}
                  options={departures}
                />
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label>目的地</label>
                <SearchableSelect
                  value={destination}
                  onChange={setDestination}
                  options={cities}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="days">游玩天数</label>
              <div className="slider-container">
                <input
                  type="range"
                  id="days"
                  min="2"
                  max="15"
                  step="1"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                />
                <span className="slider-val">{days} 天</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="budget">旅行总预算 (元)</label>
              <input
                type="number"
                id="budget"
                className="custom-input"
                min="500"
                max="100000"
                step="100"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                required
              />
              <div style={{ marginTop: '0.6rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>日均预算: <strong style={{ color: 'var(--primary)' }}>¥{Math.round(budget / days)}</strong> /天</span>
                <span style={{ color: 'var(--text-muted)' }}>预算等级: <strong style={{ color: tier.color }}>{tier.label}</strong></span>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              生成智能行程预案
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
