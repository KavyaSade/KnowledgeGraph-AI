import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Color map for node types
const TYPE_COLORS = {
  note: '#3B82F6',       
  person: '#EA580C',    
  topic: '#8B5CF6',     
  project: '#EC4899',   
  document: '#06B6D4', 
  bookmark: '#10B981',  
  idea: '#F59E0B'       
};

const InteractiveKnowledgeGraph = ({
  nodes = [],
  links = [],
  onNodeClick = null,
  selectedNodeId = null,
  highlightedNodeIds = null, 
  height = 420
}) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(500);
  const [positions, setPositions] = useState([]);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [activeNeighbors, setActiveNeighbors] = useState([]);
  const [draggingNodeId, setDraggingNodeId] = useState(null);

  // References for simulation loop
  const simPositionsRef = useRef({});
  const requestRef = useRef(null);

  
  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.clientWidth || 500);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth || 500);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize node positions
  useEffect(() => {
    const newPos = {};
    const center = { x: width / 2, y: height / 2 };

    nodes.forEach((node, i) => {
      // Keep existing positions if node already existed
      if (simPositionsRef.current[node.id]) {
        newPos[node.id] = simPositionsRef.current[node.id];
      } else {
        // Lay out the new nodes in a spiral pattern around the center
        const angle = i * 0.85;
        const radius = 40 + i * 15;
        newPos[node.id] = {
          id: node.id,
          title: node.title,
          type: node.type,
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius,
          vx: 0,
          vy: 0
        };
      }
    });

    simPositionsRef.current = newPos;
  }, [nodes, width, height]);

  // Force-directed simulation loop
  useEffect(() => {
    const runSimulation = () => {
      const posMap = simPositionsRef.current;
      const ids = Object.keys(posMap);
      if (ids.length === 0) {
        requestRef.current = requestAnimationFrame(runSimulation);
        return;
      }

      const center = { x: width / 2, y: height / 2 };

      // Force Constants
      const kRepel = 2400; 
      const kAttract = 0.04; 
      const kGravity = 0.015; 
      const restLength = 100; 
      const damping = 0.85; 

      // 1. Initialize forces to 0 or gravity pull
      ids.forEach(id => {
        const node = posMap[id];
        if (id === draggingNodeId) return; 

        // Gravity pull towards center
        node.vx += (center.x - node.x) * kGravity;
        node.vy += (center.y - node.y) * kGravity;
      });

      // 2. Apply Repulsion forces between every pair of nodes
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const idA = ids[i];
          const idB = ids[j];
          if (idA === draggingNodeId || idB === draggingNodeId) continue;

          const nodeA = posMap[idA];
          const nodeB = posMap[idB];

          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distSq = dx * dx + dy * dy + 0.1; 
          const dist = Math.sqrt(distSq);

          if (dist < 280) {
            const force = kRepel / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            nodeA.vx -= fx;
            nodeA.vy -= fy;
            nodeB.vx += fx;
            nodeB.vy += fy;
          }
        }
      }

      // 3. Apply Attraction forces along connected links
      links.forEach(link => {
        const sourceId = link.source;
        const targetId = link.target;
        const nodeA = posMap[sourceId];
        const nodeB = posMap[targetId];

        if (!nodeA || !nodeB) return;

        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;

        
        const force = kAttract * (dist - restLength);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (sourceId !== draggingNodeId) {
          nodeA.vx += fx;
          nodeA.vy += fy;
        }
        if (targetId !== draggingNodeId) {
          nodeB.vx -= fx;
          nodeB.vy -= fy;
        }
      });

      // 4. Update coordinates using velocity
      ids.forEach(id => {
        const node = posMap[id];
        if (id === draggingNodeId) return;

        node.vx *= damping;
        node.vy *= damping;

        
        node.vx = Math.max(-15, Math.min(15, node.vx));
        node.vy = Math.max(-15, Math.min(15, node.vy));

        node.x += node.vx;
        node.y += node.vy;

        // Keep inside bounds
        const padding = 20;
        node.x = Math.max(padding, Math.min(width - padding, node.x));
        node.y = Math.max(padding, Math.min(height - padding, node.y));
      });

      // Render positions to trigger React update
      setPositions(ids.map(id => ({ ...posMap[id] })));
      requestRef.current = requestAnimationFrame(runSimulation);
    };

    requestRef.current = requestAnimationFrame(runSimulation);
    return () => cancelAnimationFrame(requestRef.current);
  }, [links, width, height, draggingNodeId]);

  
  useEffect(() => {
    const focusNodeId = selectedNodeId || hoveredNodeId;
    if (focusNodeId) {
      const neighbors = [];
      links.forEach(link => {
        if (link.source === focusNodeId) neighbors.push(link.target);
        if (link.target === focusNodeId) neighbors.push(link.source);
      });
      setActiveNeighbors(neighbors);
    } else {
      setActiveNeighbors([]);
    }
  }, [hoveredNodeId, selectedNodeId, links]);

  // Handle Drag Events
  const handleMouseDown = (nodeId, e) => {
    setDraggingNodeId(nodeId);
  };

  const handleMouseMove = (e) => {
    if (!draggingNodeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (simPositionsRef.current[draggingNodeId]) {
      const node = simPositionsRef.current[draggingNodeId];
      node.x = Math.max(20, Math.min(width - 20, mouseX));
      node.y = Math.max(20, Math.min(height - 20, mouseY));
      node.vx = 0;
      node.vy = 0;
      setPositions(Object.keys(simPositionsRef.current).map(id => ({ ...simPositionsRef.current[id] })));
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  
  const posMap = {};
  positions.forEach(p => {
    posMap[p.id] = p;
  });

  // Determines focus active conditions
  const activeFocusId = selectedNodeId || hoveredNodeId;

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: `${height}px`, 
        borderRadius: '12px', 
        border: '1px solid var(--border-color)', 
        backgroundColor: 'var(--bg-surface)', 
        overflow: 'hidden', 
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
        cursor: draggingNodeId ? 'grabbing' : 'default'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {nodes.length === 0 ? (
        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          No knowledge nodes captured yet. Capture ideas to draw relationships.
        </div>
      ) : (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
          <defs>
           
            {nodes.map(node => (
              <radialGradient key={`gradient-${node.id}`} id={`grad-${node.id}`}>
                <stop offset="0%" stopColor={TYPE_COLORS[node.type] || '#3B82F6'} stopOpacity={0.35} />
                <stop offset="100%" stopColor={TYPE_COLORS[node.type] || '#3B82F6'} stopOpacity={0} />
              </radialGradient>
            ))}
          </defs>

          {/* 1. Draw Links */}
          <g>
            {links.map((link, idx) => {
              const source = posMap[link.source];
              const target = posMap[link.target];
              if (!source || !target) return null;

              // Check if this connection is highlighted
              const isHighlighted = activeFocusId === link.source || activeFocusId === link.target;
              const isSearchMatch = highlightedNodeIds && 
                                    highlightedNodeIds.includes(link.source) && 
                                    highlightedNodeIds.includes(link.target);

              // Dim logic
              const isDimmed = activeFocusId && !isHighlighted;

              return (
                <g key={`link-group-${idx}`}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isSearchMatch ? 'var(--accent-indigo)' : (isHighlighted ? TYPE_COLORS[source.type] : 'var(--border-color)')}
                    strokeWidth={isHighlighted || isSearchMatch ? 2 : 1}
                    opacity={isDimmed ? 0.15 : 0.65}
                    style={{ transition: 'stroke 0.2s, stroke-width 0.2s, opacity 0.2s' }}
                  />
                  {/* Link Label representation */}
                  {isHighlighted && link.label && link.label !== 'connected_to' && (
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 - 4}
                      fill="var(--text-muted)"
                      fontSize="8"
                      textAnchor="middle"
                      fontWeight="700"
                      style={{ pointerEvents: 'none', textTransform: 'uppercase', letterSpacing: '0.02em' }}
                    >
                      {link.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* 2. Draw Glow rings */}
          <g>
            {positions.map(node => {
              const isHovered = hoveredNodeId === node.id;
              const isSelected = selectedNodeId === node.id;
              const isNeighbor = activeNeighbors.includes(node.id);
              const isSearchHighlight = highlightedNodeIds && highlightedNodeIds.includes(node.id);
              const shouldGlow = isSelected || isHovered || isNeighbor || isSearchHighlight;

              return (
                <circle
                  key={`glow-${node.id}`}
                  cx={node.x}
                  cy={node.y}
                  r={32}
                  fill={`url(#grad-${node.id})`}
                  opacity={shouldGlow ? 1.0 : 0.1}
                  style={{ transition: 'opacity 0.3s ease' }}
                />
              );
            })}
          </g>

          {/* 3. Draw Nodes */}
          <g>
            {positions.map(node => {
              const isHovered = hoveredNodeId === node.id;
              const isSelected = selectedNodeId === node.id;
              const isNeighbor = activeNeighbors.includes(node.id);
              const isSearchHighlight = highlightedNodeIds && highlightedNodeIds.includes(node.id);

              // Dim unless matched
              const isDimmed = activeFocusId && (selectedNodeId !== node.id && hoveredNodeId !== node.id && !isNeighbor);

              const color = TYPE_COLORS[node.type] || '#3B82F6';

              return (
                <g
                  key={`node-${node.id}`}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onMouseDown={(e) => handleMouseDown(node.id, e)}
                  onClick={() => onNodeClick && onNodeClick(node)}
                  style={{ cursor: draggingNodeId === node.id ? 'grabbing' : 'pointer' }}
                >
                  {/* Outer circle rings for highlights */}
                  {(isSelected || isSearchHighlight) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={14}
                      fill="none"
                      stroke={color}
                      strokeWidth={1.5}
                      opacity={0.8}
                    />
                  )}

                  {/* Primary Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 10 : 8}
                    fill={isHovered || isSelected ? '#FFFFFF' : color}
                    stroke={isSelected ? color : 'var(--bg-surface)'}
                    strokeWidth={2}
                    opacity={isDimmed ? 0.3 : 1}
                    style={{ transition: 'r 0.2s, opacity 0.2s, fill 0.2s' }}
                  />

                  
                  <text
                    x={node.x}
                    y={node.y + 22}
                    textAnchor="middle"
                    fill={isSelected ? 'var(--text-primary)' : (isDimmed ? 'var(--text-muted)' : 'var(--text-secondary)')}
                    fontSize={isSelected ? '10px' : '9px'}
                    fontWeight={isSelected ? '800' : '600'}
                    opacity={isDimmed ? 0.35 : 1}
                    style={{ transition: 'font-weight 0.2s, fill 0.2s, opacity 0.2s', pointerEvents: 'none' }}
                  >
                    {node.title.length > 15 ? node.title.slice(0, 12) + '...' : node.title}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      )}
    </div>
  );
};

export default InteractiveKnowledgeGraph;
