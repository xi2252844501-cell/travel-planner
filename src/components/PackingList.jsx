import React, { useState } from 'react';
import { packingListData } from '../data/travelData';

export default function PackingList({
  config,
  packingState, // { checkedNames: [], customItems: [] }
  onUpdatePacking
}) {
  const { destination } = config;
  const defaultCategories = packingListData[destination] || [];
  
  const checkedNames = packingState?.checkedNames || [];
  const customItems = packingState?.customItems || [];

  const [newItemName, setNewItemName] = useState('');

  // 默认清单 Checkbox 切换
  const handleToggleDefault = (itemName) => {
    let newCheckedNames;
    if (checkedNames.includes(itemName)) {
      newCheckedNames = checkedNames.filter(name => name !== itemName);
    } else {
      newCheckedNames = [...checkedNames, itemName];
    }
    onUpdatePacking({
      checkedNames: newCheckedNames,
      customItems
    });
  };

  // 自定义清单 Checkbox 切换
  const handleToggleCustom = (index) => {
    const newCustomItems = customItems.map((item, idx) => {
      if (idx === index) return { ...item, checked: !item.checked };
      return item;
    });
    onUpdatePacking({
      checkedNames,
      customItems: newCustomItems
    });
  };

  // 添加自定义物品
  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    // 检查是否重复
    if (customItems.some(item => item.name === newItemName.trim())) {
      alert('该物品已在自定义清单中！');
      return;
    }

    const newCustomItems = [...customItems, { name: newItemName.trim(), checked: false }];
    onUpdatePacking({
      checkedNames,
      customItems: newCustomItems
    });
    setNewItemName('');
  };

  // 删除自定义物品
  const handleRemoveCustomItem = (index) => {
    const newCustomItems = customItems.filter((_, idx) => idx !== index);
    onUpdatePacking({
      checkedNames,
      customItems: newCustomItems
    });
  };

  return (
    <div className="tab-panel">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', color: 'var(--text-dark)' }}>
          🎒 出行准备与行李清单 ({destination})
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
          系统已根据【{destination}】的气候、人文及游玩特色，为您定制了专属备忘清单。支持手动勾选与自定义添加。
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* 左侧：分类必带物品展示 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {defaultCategories.map((cat, cIdx) => (
            <div
              key={`cat-${cIdx}`}
              style={{
                background: '#ffffff',
                border: '1.5px solid var(--card-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(74, 62, 61, 0.01)'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-dark)', marginBottom: '1rem', borderBottom: '1px solid rgba(74,62,61,0.05)', paddingBottom: '0.5rem', fontWeight: 'bold' }}>
                {cat.category}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cat.items.map((item, iIdx) => {
                  const isChecked = checkedNames.includes(item.name);
                  return (
                    <div
                      key={`item-${cIdx}-${iIdx}`}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleToggleDefault(item.name)}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // 代理给父级div点击，防止双击冲突
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: 'var(--primary)',
                          marginTop: '0.15rem',
                          cursor: 'pointer'
                        }}
                      />
                      <div style={{ textAlign: 'left' }}>
                        <span style={{
                          fontWeight: '600',
                          color: isChecked ? 'var(--text-muted)' : 'var(--text-dark)',
                          textDecoration: isChecked ? 'line-through' : 'none',
                          transition: 'var(--transition-smooth)'
                        }}>
                          {item.name}
                        </span>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: '1.4' }}>
                          {item.tip}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：自定义随身清单 */}
        <div
          style={{
            background: '#ffffff',
            border: '1.5px dashed var(--card-border)',
            borderRadius: '16px',
            padding: '1.5rem',
            position: 'sticky',
            top: '2rem'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '0.8rem', fontWeight: 'bold' }}>
            ➕ 我的自定义清单
          </h3>
          
          <form onSubmit={handleAddCustomItem} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
            <input
              type="text"
              className="custom-input"
              style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', borderRadius: '8px' }}
              placeholder="添加防晒霜、照相机等..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{
                width: 'auto',
                marginTop: 0,
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              添加
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '300px', overflowY: 'auto' }}>
            {customItems.length > 0 ? (
              customItems.map((item, index) => (
                <div
                  key={`custom-${index}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.8rem',
                    background: '#fdfbf8',
                    border: '1px solid var(--card-border)',
                    borderRadius: '8px'
                  }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', flex: 1, textAlign: 'left' }}
                    onClick={() => handleToggleCustom(index)}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {}}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: 'var(--primary)',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{
                      fontSize: '0.85rem',
                      color: item.checked ? 'var(--text-muted)' : 'var(--text-dark)',
                      textDecoration: item.checked ? 'line-through' : 'none',
                      fontWeight: '500'
                    }}>
                      {item.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveCustomItem(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: '0 0.2rem'
                    }}
                    title="删除"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                暂无自定义行李，在上方输入并添加吧 🎒
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
