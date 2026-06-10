import React, { useState, useEffect } from 'react';
import TripConfigForm from './components/TripConfigForm';
import BudgetProgress from './components/BudgetProgress';
import ItineraryBuilder from './components/ItineraryBuilder';
import HotelRecommender from './components/HotelRecommender';
import ExportPanel from './components/ExportPanel';
import PackingList from './components/PackingList';
import DestinationExplore from './components/DestinationExplore';
import { attractionsData, hotelsData, getTrafficPrices } from './data/travelData';
import './App.css';

// 智能地理距离近邻判定：如果目的地内的两个区域属于同一市区核心圈，则判定为“不远”，尽量避免每天折腾换房
const areAreasFar = (city, area1, area2) => {
  if (!area1 || !area2) return false;
  if (area1 === area2) return false;

  if (city === '三亚') {
    const central = ['吉阳区', '天涯区'];
    if (central.includes(area1) && central.includes(area2)) return false;
  }
  if (city === '北京') {
    const central = ['东城区', '西城区', '朝阳区'];
    if (central.includes(area1) && central.includes(area2)) return false;
  }
  if (city === '成都') {
    const central = ['青羊区', '武侯区', '锦江区', '成华区', '金牛区'];
    if (central.includes(area1) && central.includes(area2)) return false;
  }

  return true; // 视为相对较远（如三亚海棠湾与三亚湾，北京通州与东城等），需要换房
};

export default function App() {
  const [step, setStep] = useState(1); // 1: 表单配置页, 2: 攻略工作台
  const [config, setConfig] = useState(null);
  const [selectedTraffic, setSelectedTraffic] = useState('flight');
  const [itinerary, setItinerary] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [packingState, setPackingState] = useState({ checkedNames: [], customItems: [] });
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'itinerary' | 'hotel' | 'packing' | 'export'

  // 1. 初始化时尝试从 localStorage 恢复数据
  useEffect(() => {
    const savedState = localStorage.getItem('roamplanner_state');
    if (savedState) {
      try {
        const { savedConfig, savedTraffic, savedItinerary, savedHotels, savedPacking, savedTab } = JSON.parse(savedState);
        if (savedConfig && savedItinerary) {
          setConfig(savedConfig);
          setSelectedTraffic(savedTraffic || 'flight');
          setItinerary(savedItinerary);
          setSelectedHotels(savedHotels || []);
          setPackingState(savedPacking || { checkedNames: [], customItems: [] });
          setActiveTab(savedTab || 'explore');
          setStep(2);
        }
      } catch (e) {
        console.error('无法读取本地缓存的行程数据:', e);
      }
    }
  }, []);

  // 2. 状态改变时自动写入本地缓存 (实现第一重保障：自动保存)
  useEffect(() => {
    if (step === 2 && config) {
      const stateToSave = {
        savedConfig: config,
        savedTraffic: selectedTraffic,
        savedItinerary: itinerary,
        savedHotels: selectedHotels,
        savedPacking: packingState,
        savedTab: activeTab
      };
      localStorage.setItem('roamplanner_state', JSON.stringify(stateToSave));
    }
  }, [config, selectedTraffic, itinerary, selectedHotels, packingState, activeTab, step]);

  // 2.5 检查并自动同步可用大交通工具
  useEffect(() => {
    if (config) {
      const baseTraffic = getTrafficPrices(config.departure, config.destination);
      if (selectedTraffic === 'flight' && baseTraffic.flight === null) {
        if (baseTraffic.trainG !== null) setSelectedTraffic('trainG');
        else if (baseTraffic.trainS !== null) setSelectedTraffic('trainS');
      } else if (selectedTraffic === 'trainG' && baseTraffic.trainG === null) {
        if (baseTraffic.flight !== null) setSelectedTraffic('flight');
        else if (baseTraffic.trainS !== null) setSelectedTraffic('trainS');
      } else if (selectedTraffic === 'trainS' && baseTraffic.trainS === null) {
        if (baseTraffic.trainG !== null) setSelectedTraffic('trainG');
        else if (baseTraffic.flight !== null) setSelectedTraffic('flight');
      }
    }
  }, [config, selectedTraffic]);

  // 3. 处理配置提交
  const handleConfigSubmit = (newConfig) => {
    setConfig(newConfig);
    
    // 自动选择第一个可用的交通方式
    const baseTraffic = getTrafficPrices(newConfig.departure, newConfig.destination);
    let defaultTraffic = 'flight';
    if (baseTraffic.flight === null) {
      if (baseTraffic.trainG !== null) defaultTraffic = 'trainG';
      else if (baseTraffic.trainS !== null) defaultTraffic = 'trainS';
    }
    setSelectedTraffic(defaultTraffic);
    
    // 初始化空日程
    const initialItinerary = Array.from({ length: newConfig.days }, (_, i) => ({
      day: i + 1,
      title: `第 ${i + 1} 天行程规划`,
      spotIds: [],
      desc: '自由探索时间'
    }));
    setItinerary(initialItinerary);

    // 初始化空酒店
    const initialHotels = Array(Math.max(1, newConfig.days - 1)).fill(null);
    setSelectedHotels(initialHotels);

    // 初始化行李清单
    setPackingState({ checkedNames: [], customItems: [] });

    setStep(2);
    setActiveTab('explore');
  };

  // 4. 重置/返回配置页
  const handleReset = () => {
    if (window.confirm('您确定要重新配置目的地和预算吗？当前定制的行程将会被清除。')) {
      localStorage.removeItem('roamplanner_state');
      setConfig(null);
      setItinerary([]);
      setSelectedHotels([]);
      setPackingState({ checkedNames: [], customItems: [] });
      setStep(1);
    }
  };

  // 5. 计算辅助成本
  const calculateCosts = () => {
    if (!config) return { attractionsCost: 0, hotelsCost: 0 };
    const attractions = attractionsData[config.destination] || [];

    // 计算门票
    let attractionsCost = 0;
    itinerary.forEach(day => {
      day.spotIds.forEach(id => {
        const spot = attractions.find(s => s.id === id);
        if (spot) attractionsCost += spot.ticketPrice;
      });
    });

    // 计算酒店住宿费 (selectedHotels 中可能有 null)
    const hotelsCost = selectedHotels.reduce((acc, h) => acc + (h ? h.price : 0), 0);

    return { attractionsCost, hotelsCost };
  };

  const { attractionsCost, hotelsCost } = calculateCosts();

  // 6. 一键智能匹配全程酒店住宿
  const handleAutoRecommendHotels = (currentItinerary = itinerary, silent = false) => {
    if (!config) return;
    const { destination, days, budget } = config;
    const nights = Math.max(1, days - 1);
    if (nights <= 0) {
      if (!silent) alert('您当前没有安排任何住宿晚数，无需智能匹配住宿！');
      return;
    }

    const hotels = hotelsData[destination] || [];
    const attractions = attractionsData[destination] || [];

    // 6.1 计算当前游玩景点的总门票开销
    let ticketCost = 0;
    currentItinerary.forEach(day => {
      day.spotIds.forEach(id => {
        const spot = attractions.find(s => s.id === id);
        if (spot) ticketCost += spot.ticketPrice;
      });
    });

    // 6.2 计算日均吃住可支配余额
    const maxTolerablePrice = Math.max((budget - ticketCost) / nights, 0);

    // 6.3 找出整个行程中最常去的区域，作为兜底默认区域
    const allSelectedSpotIds = [];
    currentItinerary.forEach(day => {
      day.spotIds.forEach(id => {
        if (!allSelectedSpotIds.includes(id)) allSelectedSpotIds.push(id);
      });
    });

    const allAreas = allSelectedSpotIds.map(id => {
      const spot = attractions.find(s => s.id === id);
      return spot ? spot.area : null;
    }).filter(Boolean);

    let fallbackArea = '';
    if (allAreas.length > 0) {
      const counts = {};
      allAreas.forEach(a => counts[a] = (counts[a] || 0) + 1);
      fallbackArea = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    } else {
      fallbackArea = destination === '三亚' ? '吉阳区' : destination === '北京' ? '东城区' : '青羊区';
    }

    // 6.4 为每一晚智能匹配酒店
    const matchedHotels = [];
    for (let index = 0; index < nights; index++) {
      const currentDaySpots = currentItinerary[index]?.spotIds || [];
      
      let targetArea = '';
      if (currentDaySpots.length > 0) {
        const counts = {};
        currentDaySpots.forEach(id => {
          const spot = attractions.find(s => s.id === id);
          if (spot) counts[spot.area] = (counts[spot.area] || 0) + 1;
        });
        const areas = Object.keys(counts);
        if (areas.length > 0) {
          targetArea = areas.reduce((a, b) => counts[a] > counts[b] ? a : b);
        }
      }
      if (!targetArea) targetArea = fallbackArea;

      // 如果不是第一晚，且上一晚的酒店区域距离当前区域“不太远”，则尽量继续留宿在上一晚的酒店，避免换房折腾
      if (index > 0) {
        const prevHotel = matchedHotels[index - 1];
        if (prevHotel && !areAreasFar(destination, prevHotel.area, targetArea)) {
          matchedHotels.push(prevHotel);
          continue;
        }
      }

      // 匹配当前区域的酒店
      const areaHotels = hotels.filter(h => h.area === targetArea);
      if (areaHotels.length === 0) {
        matchedHotels.push(hotels[0] || null);
        continue;
      }

      // 排除 avoid 的酒店，并且尽量在 budget 限制内挑选
      const validHotels = areaHotels.filter(h => h.userVisited !== 'avoid');
      const budgetHotels = validHotels.filter(h => h.price <= maxTolerablePrice);
      
      let candidateHotels = budgetHotels.length > 0 ? budgetHotels : validHotels;
      if (candidateHotels.length === 0) candidateHotels = areaHotels;

      // 优先权排序：1. 优先推荐 300-500 元区间的酒店 -> 2. 用户推荐 -> 3. 高评分 -> 4. 低价格
      candidateHotels.sort((a, b) => {
        const aInPriceRange = a.price >= 300 && a.price <= 500 ? 1 : 0;
        const bInPriceRange = b.price >= 300 && b.price <= 500 ? 1 : 0;
        if (aInPriceRange !== bInPriceRange) return bInPriceRange - aInPriceRange;

        const aRec = a.userVisited === 'recommended' ? 1 : 0;
        const bRec = b.userVisited === 'recommended' ? 1 : 0;
        if (aRec !== bRec) return bRec - aRec;

        const aRate = parseFloat(a.socialHotRating) || 0;
        const bRate = parseFloat(b.socialHotRating) || 0;
        if (aRate !== bRate) return bRate - aRate;

        return a.price - b.price;
      });

      matchedHotels.push(candidateHotels[0] || null);
    }

    setSelectedHotels(matchedHotels);

    if (!silent) {
      alert(`✨ 已成功为您一键智能推荐全程酒店住宿！\n\n当前行程安排了游玩景点，我们将基于路线距离、价格偏好和网友口碑，为您匹配最优的酒店住宿！\n\n推荐原则：\n1. 防折腾留宿：如果相邻天数的游玩区域距离不远（属于同一市区核心圈，如北京东城区与朝阳区），系统会尽量让您留宿在同一酒店，免去每天打包行李、更换酒店的麻烦；\n2. 价格区间优先：优先为您筛选和推荐每晚 300-500 元之间的高性价比酒店；\n3. 预算余额把控：根据当前吃行支配余额智能控价，不超预算；\n4. 智能排雷避坑：自动为您过滤网友或达人标注的避坑差评酒店，优先匹配高评分推荐款！`);
      setActiveTab('hotel');
    }
  };

  // 增加一天日程
  const handleAddDay = () => {
    if (!config) return;
    const newDays = config.days + 1;
    setConfig(prev => ({ ...prev, days: newDays }));
    
    const newDay = {
      day: newDays,
      title: `第 ${newDays} 天行程规划`,
      spotIds: [],
      desc: '自由探索时间'
    };
    setItinerary(prev => [...prev, newDay]);
  };

  // 删除一天日程
  const handleDeleteDay = (dayNum) => {
    if (!config) return;
    if (config.days <= 1) {
      alert('您的行程至少需要 1 天！');
      return;
    }
    const newDays = config.days - 1;
    setConfig(prev => ({ ...prev, days: newDays }));

    const filtered = itinerary.filter(d => d.day !== dayNum);
    const updated = filtered.map((d, idx) => ({
      ...d,
      day: idx + 1,
      title: d.title.startsWith('第 ') && (d.title.endsWith(' 天行程规划') || d.title.endsWith(' 天行程'))
        ? `第 ${idx + 1} 天行程规划`
        : d.title
    }));
    setItinerary(updated);
  };

  // 应用经典路线模板，自动适配天数并重新初始化酒店列表
  const handleApplyTemplate = (template) => {
    if (!config) return;
    const templateDays = template.schedule.length;
    
    // 1. 同步更新配置中的天数
    setConfig(prev => ({ ...prev, days: templateDays }));
    
    // 2. 将模板数据格式化并写入日程状态
    const formatted = template.schedule.map(d => ({
      day: d.day,
      title: d.title,
      spotIds: [...d.spotIds],
      desc: d.desc || '自由探索时间'
    }));
    setItinerary(formatted);
    
    // 3. 酒店房间同步扩充为 templateDays - 1 晚 (最少 1 晚) 并全部初始化为 null
    const newNights = Math.max(1, templateDays - 1);
    setSelectedHotels(Array(newNights).fill(null));
  };


  const steps = [
    { key: 'explore', label: '探索目的地', icon: '🧭' },
    { key: 'itinerary', label: '规划每日日程', icon: '📅' },
    { key: 'hotel', label: '筛选智能住宿', icon: '🏨' },
    { key: 'packing', label: '准备行李清单', icon: '🎒' },
    { key: 'export', label: '导出行程攻略', icon: '📤' }
  ];
  const stepKeys = steps.map(s => s.key);
  const activeIndex = stepKeys.indexOf(activeTab);

  return (
    <div className="app-container">
      {/* 顶栏 Header */}
      <header className="app-header no-print">
        <div className="logo-container" onClick={handleReset} style={{ cursor: step === 2 ? 'pointer' : 'default' }}>
          <div className="logo-badge">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
          </div>
          <span className="logo-text">RoamPlanner</span>
        </div>
        <nav className="header-nav">
          {step === 2 ? (
            <span className="nav-link-back-header" onClick={handleReset}>
              ⬅️ 修改目的地与预算
            </span>
          ) : (
            <>
              <span className="nav-link" onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}>功能介绍</span>
              <span className="nav-link" onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}>使用指南</span>
              <span className="nav-link" onClick={() => document.getElementById('recent-trips-section')?.scrollIntoView({ behavior: 'smooth' })}>关于</span>
            </>
          )}
        </nav>
      </header>

      {step === 1 ? (
        /* 步骤一：输入表单 */
        <TripConfigForm onSubmit={handleConfigSubmit} initialValues={config} />
      ) : (
        /* 步骤二：攻略主工作台 */
        <div className="dashboard-grid">
          {/* 左侧：预算状态和交通看板 */}
          <BudgetProgress
            config={config}
            selectedTraffic={selectedTraffic}
            onChangeTraffic={setSelectedTraffic}
            attractionsCost={attractionsCost}
            hotelsCost={hotelsCost}
            onReset={handleReset}
          />

          {/* 右侧：标签导航与构建面板 */}
          <div className="main-content glass-card">
            <div className="tab-navigation no-print">
              <div className="stepper-progress-line">
                <div 
                  className="stepper-progress-fill" 
                  style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                />
              </div>
              {steps.map((s, idx) => {
                const isCompleted = idx < activeIndex;
                const isActive = s.key === activeTab;
                const isFuture = idx > activeIndex;
                
                return (
                  <button
                    key={s.key}
                    className={`tab-btn stepper-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isFuture ? 'future' : ''}`}
                    onClick={() => setActiveTab(s.key)}
                  >
                    <div className="step-circle">
                      {isCompleted ? (
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <span className="step-num">{idx + 1}</span>
                      )}
                    </div>
                    <span className="step-label">
                      {s.icon} {s.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeTab === 'explore' && (
              <DestinationExplore
                config={config}
                onStartPlanning={() => setActiveTab('itinerary')}
              />
            )}

            {activeTab === 'itinerary' && (
              <ItineraryBuilder
                config={config}
                itinerary={itinerary}
                onChangeItinerary={setItinerary}
                onAutoRecommendHotels={handleAutoRecommendHotels}
                onApplyTemplate={handleApplyTemplate}
                selectedHotels={selectedHotels}
                onAddDay={handleAddDay}
                onDeleteDay={handleDeleteDay}
              />
            )}

            {activeTab === 'hotel' && (
              <HotelRecommender
                config={config}
                itinerary={itinerary}
                selectedHotels={selectedHotels}
                onUpdateHotels={setSelectedHotels}
                onAutoRecommendHotels={handleAutoRecommendHotels}
              />
            )}

            {activeTab === 'packing' && (
              <PackingList
                config={config}
                packingState={packingState}
                onUpdatePacking={setPackingState}
              />
            )}

            {activeTab === 'export' && (
              <ExportPanel
                config={config}
                selectedTraffic={selectedTraffic}
                itinerary={itinerary}
                selectedHotels={selectedHotels}
                packingState={packingState}
              />
            )}
          </div>
        </div>
      )}
      <footer className="app-footer-disclaimer no-print">
        声明：本平台所展示的景点与酒店图片均来源于公开网络，仅供个人规划参考；所有交通、门票及住宿价格均为网络公开估算值，请以实际预订为准。
      </footer>
    </div>
  );
}
