import React from 'react';
import { getTrafficPrices, seasonFactors } from '../data/travelData';

export default function BudgetProgress({
  config,
  selectedTraffic,
  onChangeTraffic,
  attractionsCost,
  hotelsCost,
  onReset
}) {
  const { departure, destination, budget, days } = config;
  const currentMonth = new Date().getMonth() + 1; // 默认当前月份
  const factor = seasonFactors[currentMonth] || 1.0;

  // 获取交通数据
  const baseTraffic = getTrafficPrices(departure, destination);

  // 计算往返双人/单人价格（按单人算预算，这里按单人往返大交通算）
  const flightPrice = baseTraffic.flight ? Math.round(baseTraffic.flight * factor * 2) : null;
  const trainGPrice = baseTraffic.trainG ? Math.round(baseTraffic.trainG * 2) : null;
  const trainSPrice = baseTraffic.trainS ? Math.round(baseTraffic.trainS * 2) : null;

  const getTrafficCost = () => {
    if (selectedTraffic === 'flight' && flightPrice !== null) return flightPrice;
    if (selectedTraffic === 'trainG' && trainGPrice !== null) return trainGPrice;
    if (selectedTraffic === 'trainS' && trainSPrice !== null) return trainSPrice;
    return 0;
  };

  const trafficCost = getTrafficCost();
  const totalSpent = trafficCost + attractionsCost + hotelsCost;
  const remaining = budget - totalSpent;
  const spentPercentage = Math.min(Math.round((totalSpent / budget) * 100), 100);

  // 仪表盘颜色
  const getGaugeColorClass = () => {
    if (spentPercentage > 90) return 'danger';
    if (spentPercentage > 70) return 'warning';
    return 'success';
  };

  // 每日吃喝零花预算建议
  const nights = days - 1;
  const dailyPocketMoney = Math.max(Math.round(remaining / days), 0);

  const getPocketMoneyAdvice = () => {
    if (dailyPocketMoney <= 0) return { text: '预算已超支！请换乘便宜交通或精简行程。', class: 'danger' };
    if (dailyPocketMoney < 100) return { text: '资金较紧张，只够基础餐饮，建议多坐公交/地铁，少打车。', class: 'danger' };
    if (dailyPocketMoney < 300) return { text: '资金充裕，可打车、喝清补凉/吃椰子鸡，体验良好！', class: 'warning' };
    return { text: '预算极其豪爽！可以尽情品尝当地高档餐厅，任性打车！', class: 'success' };
  };

  const advice = getPocketMoneyAdvice();

  return (
    <div className="sidebar no-print">
      {/* 1. 预算仪表盘 */}
      <div className="glass-card budget-gauge">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>预算占比看板</h3>
        <svg viewBox="0 0 36 36" className="circular-chart">
          <path
            className="circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`circle ${getGaugeColorClass()}`}
            strokeDasharray={`${spentPercentage}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        
        <div className="gauge-label">
          <span className="amt">{spentPercentage}%</span>
          <span className="lbl">已用额度</span>
        </div>

        <div className="budget-stats">
          <div className="stat-item">
            <span className="label">总预算:</span>
            <span className="val">¥{budget}</span>
          </div>
          <div className="stat-item">
            <span className="label">往返交通:</span>
            <span className="val">{trafficCost > 0 ? `¥${trafficCost}` : '暂无直达 / 免费'}</span>
          </div>
          <div className="stat-item">
            <span className="label">景点门票:</span>
            <span className="val">¥{attractionsCost}</span>
          </div>
          <div className="stat-item">
            <span className="label">酒店住宿:</span>
            <span className="val">¥{hotelsCost}</span>
          </div>
          <div className="stat-item" style={{ borderTop: '1px dashed var(--card-border)', paddingTop: '0.8rem' }}>
            <span className="label" style={{ color: 'var(--text-dark)', fontWeight: 'bold' }}>剩余吃喝/零用:</span>
            <span className={`val ${remaining < 0 ? 'danger' : 'success'}`} style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              ¥{remaining}
            </span>
          </div>
          <div className="stat-item">
            <span className="label">日均零花建议:</span>
            <span className="val" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>¥{dailyPocketMoney}/天</span>
          </div>
        </div>

        <div style={{ marginTop: '1.2rem', textAlign: 'left', borderTop: '1px dashed var(--card-border)', paddingTop: '1rem' }}>
          <span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            往返大交通 (双程单人)
          </span>
          <div className="traffic-segmented-control">
            <button
              className={`traffic-segment-btn ${selectedTraffic === 'flight' ? 'active' : ''} ${flightPrice === null ? 'disabled' : ''}`}
              onClick={() => flightPrice !== null && onChangeTraffic('flight')}
              title={`飞机经济舱 (历史均价, ${currentMonth}月系数 ${factor}x)`}
              type="button"
            >
              <span className="icon">✈️</span>
              <span className="title">飞机</span>
              <span className="price">{flightPrice !== null ? `¥${flightPrice}` : '无'}</span>
            </button>
            <button
              className={`traffic-segment-btn ${selectedTraffic === 'trainG' ? 'active' : ''} ${trainGPrice === null ? 'disabled' : ''}`}
              onClick={() => trainGPrice !== null && onChangeTraffic('trainG')}
              title="高铁二等座 (固定票价)"
              type="button"
            >
              <span className="icon">🚄</span>
              <span className="title">高铁</span>
              <span className="price">{trainGPrice !== null ? `¥${trainGPrice}` : '无'}</span>
            </button>
            <button
              className={`traffic-segment-btn ${selectedTraffic === 'trainS' ? 'active' : ''} ${trainSPrice === null ? 'disabled' : ''}`}
              onClick={() => trainSPrice !== null && onChangeTraffic('trainS')}
              title="普通列车卧铺 (夕发朝至)"
              type="button"
            >
              <span className="icon">🚂</span>
              <span className="title">火车</span>
              <span className="price">{trainSPrice !== null ? `¥${trainSPrice}` : '无'}</span>
            </button>
          </div>
        </div>

        <div className={`disclaimer ${advice.class}`} style={{ marginTop: '1rem', textAlign: 'left', background: 'rgba(255, 255, 255, 0.02)' }}>
          <strong>吃喝出行建议：</strong>{advice.text}
          <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', opacity: 0.85 }}>
            💡 飞机票价随淡旺季波动，火车票价相对固定，出行前请通过官方渠道确认。
          </div>
        </div>

        <button onClick={onReset} className="btn-primary" style={{ background: 'none', color: 'var(--primary)', boxShadow: 'none', border: '1.5px solid var(--primary)', padding: '0.6rem', fontSize: '0.9rem', marginTop: '1.2rem' }}>
          修改目的地/预算
        </button>
      </div>
    </div>
  );
}

