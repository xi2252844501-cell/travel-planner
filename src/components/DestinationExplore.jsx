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
          backgroundImage: `linear-gradient(90deg, rgba(30, 46, 38, 0.85) 0%, rgba(30, 46, 38, 0.45) 55%, rgba(0, 0, 0, 0) 100%), url(${
            destination === '三亚' ? '/sanya_bg.png' :
            destination === '成都' ? '/chengdu_bg.png' :
            '/beijing_bg.png'
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          borderRadius: '20px',
          padding: '5rem 4rem',
          textAlign: 'left',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: '0 12px 36px rgba(45, 78, 63, 0.12)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '550px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--secondary)' }}>
            Explore Destination
          </span>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '3.4rem', fontWeight: '700', color: '#ffffff', margin: '0.6rem 0 0.8rem 0', letterSpacing: '0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            探索 · {destination}
          </h2>
          <p style={{ fontSize: '1.25rem', fontWeight: '300', color: 'rgba(255,255,255,0.95)', fontStyle: 'italic', letterSpacing: '0.05em' }}>
            「 {data.slogan} 」
          </p>
        </div>
        
        {/* 背景装饰微动效球 */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
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


        <div style={{ textAlign: 'center', marginTop: '2.5rem', marginBottom: '1rem' }}>
          <button
            onClick={onStartPlanning}
            className="explore-start-btn"
          >
            开始定制行程日程 ➔
          </button>
        </div>
      </div>
    </div>
  );
}
