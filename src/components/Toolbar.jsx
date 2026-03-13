import React from 'react'
import { NODE_TYPES } from '../data/nodeTypes'

export default function Toolbar({ onAddNode, onExport, onImport, onClear, nodeCount, edgeCount }) {
  const handleImportClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = e => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = ev => {
        try {
          onImport(JSON.parse(ev.target.result))
        } catch {
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: '52px',
      background: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '8px',
      zIndex: 50,
    }}>
      {/* Brand */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        fontWeight: '600',
        color: 'var(--accent-blue)',
        marginRight: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        letterSpacing: '0.05em',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
        HOMELAB
      </div>

      <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 4px' }} />

      {/* Add node buttons */}
      <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
        {Object.entries(NODE_TYPES).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => onAddNode(key)}
            title={`Add ${cfg.label}`}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '5px 10px',
              cursor: 'pointer',
              color: cfg.color,
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.12s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${cfg.color}18`
              e.currentTarget.style.borderColor = cfg.color
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-secondary)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <span style={{ fontSize: '14px', lineHeight: 1 }}>+</span>
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--text-muted)',
        display: 'flex',
        gap: '12px',
        padding: '0 12px',
      }}>
        <span>{nodeCount} <span style={{ color: 'var(--text-secondary)' }}>nodes</span></span>
        <span>{edgeCount} <span style={{ color: 'var(--text-secondary)' }}>edges</span></span>
      </div>

      <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 4px' }} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <ToolBtn onClick={handleImportClick}>Import</ToolBtn>
        <ToolBtn onClick={onExport}>Export</ToolBtn>
        <ToolBtn onClick={onClear} danger>Clear</ToolBtn>
      </div>
    </div>
  )
}

function ToolBtn({ children, onClick, danger }) {
  const [hover, setHover] = React.useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? (danger ? 'rgba(248,113,113,0.12)' : 'var(--bg-card)') : 'var(--bg-secondary)',
        border: `1px solid ${hover && danger ? 'rgba(248,113,113,0.4)' : 'var(--border)'}`,
        borderRadius: '6px',
        padding: '5px 10px',
        cursor: 'pointer',
        color: danger && hover ? 'var(--accent-red)' : 'var(--text-secondary)',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        transition: 'all 0.12s',
      }}
    >
      {children}
    </button>
  )
}