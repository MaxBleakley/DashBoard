import React, { useState, useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import LabNode from './nodes/LabNode'
import NodePanel from './components/NodePanel'
import Toolbar from './components/Toolbar'
import { SAMPLE_NODES, SAMPLE_EDGES } from './data/sampleTopology'
import { NODE_TYPES } from './data/nodeTypes'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'homelab-topology'

const nodeTypes = {
  proxmox:   LabNode,
  vm:        LabNode,
  lxc:       LabNode,
  baremetal: LabNode,
  network:   LabNode,
  storage:   LabNode,
}

function loadTopology() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return { nodes: SAMPLE_NODES, edges: SAMPLE_EDGES }
}

function saveTopology(nodes, edges) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }))
  } catch {}
}

export default function App() {
  const initial = loadTopology()
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges)
  const [selectedNode, setSelectedNode] = useState(null)
  const [panelMode, setPanelMode] = useState(null)
  const [createType, setCreateType] = useState(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)

  const onConnect = useCallback((params) => {
    setEdges(eds => {
      const newEdges = addEdge({ ...params, animated: false }, eds)
      setNodes(nds => { saveTopology(nds, newEdges); return nds })
      return newEdges
    })
  }, [])

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node)
    setPanelMode('edit')
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setPanelMode(null)
  }, [])

  const handleAddNode = useCallback((type) => {
    setCreateType(type)
    setPanelMode('create')
    setSelectedNode(null)
  }, [])

  const handleCreate = useCallback((formData) => {
    const viewport = reactFlowInstance?.getViewport() || { x: 0, y: 0, zoom: 1 }
    const x = (window.innerWidth  / 2 - viewport.x) / viewport.zoom - 90
    const y = (window.innerHeight / 2 - viewport.y) / viewport.zoom - 60

    const newNode = {
      id: `${formData.nodeType}-${uuidv4().slice(0, 8)}`,
      type: formData.nodeType,
      position: { x, y },
      data: formData,
    }

    setNodes(nds => {
      const updated = [...nds, newNode]
      saveTopology(updated, edges)
      return updated
    })
    setPanelMode(null)
  }, [reactFlowInstance, edges])

  const handleUpdate = useCallback((id, data) => {
    setNodes(nds => {
      const updated = nds.map(n => n.id === id ? { ...n, data } : n)
      saveTopology(updated, edges)
      return updated
    })
    setPanelMode(null)
    setSelectedNode(null)
  }, [edges])

  const handleDelete = useCallback((id) => {
    setNodes(nds => {
      const updatedNodes = nds.filter(n => n.id !== id)
      const updatedEdges = edges.filter(e => e.source !== id && e.target !== id)
      setEdges(updatedEdges)
      saveTopology(updatedNodes, updatedEdges)
      return updatedNodes
    })
    setPanelMode(null)
    setSelectedNode(null)
  }, [edges])

  const handleExport = useCallback(() => {
    const data = { nodes, edges, exportedAt: new Date().toISOString(), version: '1' }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `homelab-topology-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [nodes, edges])

  const handleImport = useCallback((data) => {
    if (!data.nodes || !data.edges) { alert('Invalid topology file'); return }
    setNodes(data.nodes)
    setEdges(data.edges)
    saveTopology(data.nodes, data.edges)
    setPanelMode(null)
  }, [])

  const handleClear = useCallback(() => {
    if (!confirm('Clear all nodes and edges?')) return
    setNodes([])
    setEdges([])
    saveTopology([], [])
    setPanelMode(null)
  }, [])

  const minimapNodeColor = useCallback((node) => {
    return NODE_TYPES[node.data?.nodeType]?.color || '#374151'
  }, [])

  const panelNode = panelMode === 'edit'   ? selectedNode
                 : panelMode === 'create'  ? { data: { nodeType: createType } }
                 : null

  return (
    <div style={{ width: '100vw', height: '100vh', paddingTop: '52px' }}>
      <Toolbar
        onAddNode={handleAddNode}
        onExport={handleExport}
        onImport={handleImport}
        onClear={handleClear}
        nodeCount={nodes.length}
        edgeCount={edges.length}
      />

      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            onNodesChange(changes)
            const hasMoves = changes.some(c => c.type === 'position' && !c.dragging)
            if (hasMoves) {
              setTimeout(() => {
                setNodes(nds => { saveTopology(nds, edges); return nds })
              }, 50)
            }
          }}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.1}
          maxZoom={2}
          deleteKeyCode="Delete"
          style={{ background: 'var(--bg-primary)' }}
        >
          <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#1e2a3a" />
          <Controls style={{ bottom: 24, left: 16 }} />
          <MiniMap
            nodeColor={minimapNodeColor}
            maskColor="rgba(10,14,20,0.7)"
            style={{ bottom: 24, right: panelMode ? 316 : 16 }}
          />
        </ReactFlow>
      </div>

      {nodes.length === 0 && (
        <div style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.15 }}>⬡</div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}>NO NODES — USE TOOLBAR TO ADD</div>
        </div>
      )}

      {panelMode && panelNode && (
        <NodePanel
          node={panelNode}
          mode={panelMode}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onClose={() => { setPanelMode(null); setSelectedNode(null) }}
          onCreate={handleCreate}
        />
      )}

      <div style={{
        position: 'fixed',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--text-muted)',
        pointerEvents: 'none',
        letterSpacing: '0.06em',
      }}>
        CLICK node to edit · DRAG handles to connect · DEL to remove selected edge
      </div>
    </div>
  )
}