// This is what is responsible for actually displaying and styling each node type as defined in
// nodeTypes.js
import React, { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { NODE_TYPES, NETWORK_SUBTYPES } from '../data/nodeTypes'

const ICONS = {
  server: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="8" rx="2"/>
      <rect x="2" y="14" width="20" height="8" rx="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/>
      <line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  ),
  monitor: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  box: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  cpu: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
      <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
    </svg>
  ),
  network: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="5" r="3"/>
      <circle cx="19" cy="19" r="3"/>
      <circle cx="5" cy="19" r="3"/>
      <line x1="12" y1="8" x2="5" y2="16"/>
      <line x1="12" y1="8" x2="19" y2="16"/>
      <line x1="5" y1="19" x2="19" y2="19"/>
    </svg>
  ),
  'hard-drive': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="22" y1="12" x2="2" y2="12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
      <line x1="6" y1="16" x2="6.01" y2="16"/>
      <line x1="10" y1="16" x2="10.01" y2="16"/>
    </svg>
  ),
}

function LabNode({ data, selected }) {
  const typeConfig = NODE_TYPES[data.nodeType] || NODE_TYPES.baremetal
  const icon = ICONS[typeConfig.icon]
  const color = typeConfig.color
  const glow = typeConfig.glow

  const primaryLabel = data.hostname || data.name || typeConfig.label
  const subLabel = data.ip || ''
  const subtypeLabel = data.subtype ? NETWORK_SUBTYPES[data.subtype]?.label : null

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1.5px solid ${selected ? color : 'var(--border)'}`,
      borderRadius: '10px',
      minWidth: '160px',
      maxWidth: '200px',
      boxShadow: selected
        ? `0 0 0 1px ${color}40, 0 4px 20px ${glow}`
        : '0 2px 12px rgba(0,0,0,0.4)',
      transition: 'all 0.15s ease',
      cursor: 'grab',
    }}>
      {/* Accent bar */}
      <div style={{
        height: '3px',
        background: color,
        borderRadius: '10px 10px 0 0',
        opacity: 0.9,
      }} />

      {/* Header */}
      <div style={{
        padding: '10px 12px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ color, display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.9 }}>
          {icon}
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11.5px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {primaryLabel}
          </div>
          <div style={{
            fontSize: '10px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            marginTop: '1px',
          }}>
            {subtypeLabel || typeConfig.label}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '8px 12px 10px' }}>
        {subLabel && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              minWidth: '20px',
            }}>IP</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color,
              opacity: 0.85,
            }}>{subLabel}</span>
          </div>
        )}
        {data.os && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              minWidth: '20px',
            }}>OS</span>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>{data.os}</span>
          </div>
        )}
        {(data.cores || data.ram || data.capacity) && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            {data.cores && (
              <span style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
              }}>{data.cores}c</span>
            )}
            {data.ram && (
              <span style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
              }}>{data.ram}GB</span>
            )}
            {data.capacity && (
              <span style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
              }}>{data.capacity}</span>
            )}
          </div>
        )}
        {data.vmid && (
          <div style={{
            marginTop: '4px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}>vmid: {data.vmid}</div>
        )}
        {data.ctid && (
          <div style={{
            marginTop: '4px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}>ctid: {data.ctid}</div>
        )}
      </div>

      <Handle type="target" position={Position.Top}    style={{ top: -4 }} />
      <Handle type="source" position={Position.Bottom} style={{ bottom: -4 }} />
      <Handle type="source" position={Position.Right}  style={{ right: -4 }} />
      <Handle type="target" position={Position.Left}   style={{ left: -4 }} />
    </div>
  )
}

export default memo(LabNode)