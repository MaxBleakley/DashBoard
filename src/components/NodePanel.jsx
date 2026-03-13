// THis is for the modification and editing of node in the form of a sidebar. It modifies the selected node
import React, { useState, useEffect } from 'react'
import { NODE_TYPES, NODE_FIELDS, FIELD_LABELS, NETWORK_SUBTYPES } from '../data/nodeTypes'

const inputStyle = {
  width: '100%',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '6px 10px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const labelStyle = {
  display: 'block',
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--text-secondary)',
  marginBottom: '4px',
  fontFamily: 'var(--font-mono)',
}

export default function NodePanel({ node, onUpdate, onDelete, onClose, onCreate, mode = 'edit' }) {
  const [form, setForm] = useState(node?.data || {})
  const [nodeType, setNodeType] = useState(node?.data?.nodeType || 'proxmox')

  useEffect(() => {
    if (node) {
      setForm(node.data || {})
      setNodeType(node.data?.nodeType || 'proxmox')
    }
  }, [node?.id])

  const fields = NODE_FIELDS[nodeType] || []
  const typeConfig = NODE_TYPES[nodeType]

  const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = () => {
    if (mode === 'create') {
      onCreate({ ...form, nodeType })
    } else {
      onUpdate(node.id, { ...form, nodeType })
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '300px',
      height: '100vh',
      background: 'var(--bg-panel)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
    }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        input:focus, select:focus, textarea:focus {
          border-color: var(--accent-blue) !important;
        }
        .panel-btn:hover { opacity: 0.85; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            marginBottom: '2px',
          }}>
            {mode === 'create' ? 'Add Node' : 'Edit Node'}
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: typeConfig?.color || 'var(--text-primary)' }}>
            {typeConfig?.label}
          </div>
        </div>
        <button
          className="panel-btn"
          onClick={onClose}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}
        >×</button>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

        {/* Node type selector — create mode only */}
        {mode === 'create' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Node Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {Object.entries(NODE_TYPES).map(([key, cfg]) => (
                <button
                  key={key}
                  className="panel-btn"
                  onClick={() => { setNodeType(key); setForm({ nodeType: key }) }}
                  style={{
                    background: nodeType === key ? `${cfg.color}18` : 'var(--bg-secondary)',
                    border: `1px solid ${nodeType === key ? cfg.color : 'var(--border)'}`,
                    borderRadius: '6px',
                    padding: '7px 8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: nodeType === key ? cfg.color : 'var(--text-secondary)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    transition: 'all 0.12s',
                  }}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Accent divider */}
        <div style={{
          height: '2px',
          background: typeConfig?.color || 'var(--border)',
          borderRadius: '2px',
          marginBottom: '16px',
          opacity: 0.6,
        }} />

        {/* Dynamic fields */}
        {fields.map(field => (
          <div key={field} style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>{FIELD_LABELS[field] || field}</label>
            {field === 'notes' ? (
              <textarea
                value={form[field] || ''}
                onChange={e => handleChange(field, e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
              />
            ) : field === 'subtype' ? (
              <select
                value={form[field] || ''}
                onChange={e => handleChange(field, e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select type...</option>
                {Object.entries(NETWORK_SUBTYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={form[field] || ''}
                onChange={e => handleChange(field, e.target.value)}
                placeholder={FIELD_LABELS[field] || field}
                style={inputStyle}
              />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: '8px',
      }}>
        {mode === 'edit' && (
          <button
            className="panel-btn"
            onClick={() => onDelete(node.id)}
            style={{
              background: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: '6px',
              color: 'var(--accent-red)',
              padding: '8px 14px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
            }}
          >Delete</button>
        )}
        <button
          className="panel-btn"
          onClick={handleSave}
          style={{
            flex: 1,
            background: typeConfig?.color || 'var(--accent-blue)',
            border: 'none',
            borderRadius: '6px',
            color: '#0a0e14',
            padding: '8px 14px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {mode === 'create' ? 'Add Node' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}