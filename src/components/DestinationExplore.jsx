import React from 'react';
import { destinationIntroData } from '../data/travelData';

export default function DestinationExplore({ config, onStartPlanning }) {
  const { destination } = config;
  const data = destinationIntroData[destination];

  if (!data) {
    return (
      <div className="tab-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>暂无该城市的详细介绍</h3>
      </div>
    );
  }

  return (
    <div className="tab-panel" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* 城市大横幅 Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--primary), var(--warning))',
          borderRadius: '20px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(231, 111, 81, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.9)' }}>
            EXPLORE DESTINATION
          </span>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '3rem', fontWeight: 'bold', color: '#ffffff', margin: '0.5rem 0' }}>
            探索 · {destination}
          </h2>
          <p style={{ fontSize: '1.25rem', fontWeight: '300', color: 'rgba(255,255,255,0.95)', fontStyle: 'italic' }}>
            「 {data.slogan} 」
          </p>
        </div>
        
        {/* 背景装饰微动效球 */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          zIndex: 1
        }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* 1. 历史人文介绍 */}
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid var(--card-border)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--glass-shadow)',
            textAlign: 'left'
          }}
        >
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            📜 历史底蕴与人文风情
          </h3>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-main)', lineHeight: '1.7', textIndent: '2em' }}>
            {data.historyCulture}
          </p>
        </div>

        {/* 2. 玩乐区域分布指南 */}
        <div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', fontWeight: 'bold', marginBottom: '1.2rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            🧭 热门玩乐区域分布指南
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {data.districts.map((dist, idx) => (
              <div
                key={`dist-${idx}`}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid var(--card-border)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: 'var(--glass-shadow)',
                  textAlign: 'left',
                  transition: 'var(--transition-smooth)'
                }}
                className="district-guide-card"
              >
                <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.6rem' }}>
                  {dist.name}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                  {dist.desc}
                </p>
              </div>
            ))}
          </div>
        </div>



        {/* 4. 底部行动呼吁 Button */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            className="btn-primary"
            onClick={onStartPlanning}
            style={{
              width: 'auto',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              boxShadow: '0 4px 20px rgba(42, 157, 143, 0.2)'
            }}
          >
            开始定制行程日程 ➔
          </button>
        </div>
      </div>
    </div>
  );
}
