import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Base Node structure with coordinates
const BASE_NODES = [
  { id: 'research', label: 'Research', x: 220, y: 85, size: 9, color: '#0070F3' },
  { id: 'project', label: 'Project Alpha', x: 380, y: 160, size: 10, color: '#4F46E5' },
  { id: 'battery', label: 'Battery Storage', x: 330, y: 320, size: 8, color: '#06B6D4' },
  { id: 'note', label: 'Note: Specs', x: 120, y: 220, size: 7, color: '#8B5CF6' },
  { id: 'person', label: 'Team Lead', x: 200, y: 340, size: 6, color: '#0070F3' },
  { id: 'source', label: 'Knowledge Base', x: 240, y: 210, size: 13, color: '#3B82F6', isCenter: true }
];

const CONNECTIONS = [
  { source: 'research', target: 'source' },
  { source: 'note', target: 'source' },
  { source: 'project', target: 'source' },
  { source: 'battery', target: 'project' },
  { source: 'battery', target: 'source' },
  { source: 'person', target: 'source' },
  { source: 'note', target: 'research' },
  { source: 'person', target: 'battery' }
];

// Which paths will have animated flow particles
const PARTICLE_PATHS = [
  { source: 'research', target: 'source' },
  { source: 'battery', target: 'project' },
  { source: 'source', target: 'person' }
];

const KnowledgeGraph = () => {
  const [positions, setPositions] = useState(BASE_NODES);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [activeNeighbors, setActiveNeighbors] = useState([]);
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  // Set up float animation and keep connections updated dynamically
  useEffect(() => {
    let frameId;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setPositions(
        BASE_NODES.map((node, i) => {
          // Central node floats less, outer nodes float more
          const amplitudeX = node.isCenter ? 3 : 7 + (i % 3) * 2;
          const amplitudeY = node.isCenter ? 3 : 7 + (i % 2) * 2;
          const freqX = node.isCenter ? 0.4 : 0.6 + i * 0.08;
          const freqY = node.isCenter ? 0.3 : 0.5 + i * 0.05;

          const dx = Math.sin(elapsed * freqX) * amplitudeX;
          const dy = Math.cos(elapsed * freqY) * amplitudeY;

          return {
            ...node,
            x: node.x + dx,
            y: node.y + dy
          };
        })
      );
      frameId = requestAnimationFrame(animate);
    };

    animate();
    
    // Set a timer to enable flow particles and full interactions after entrance finishes
    const timer = setTimeout(() => {
      setIsIntroComplete(true);
    }, 2500);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, []);

  // Update neighbors on hover
  useEffect(() => {
    if (hoveredNode) {
      const neighbors = [];
      CONNECTIONS.forEach(conn => {
        if (conn.source === hoveredNode) neighbors.push(conn.target);
        if (conn.target === hoveredNode) neighbors.push(conn.source);
      });
      setActiveNeighbors(neighbors);
    } else {
      setActiveNeighbors([]);
    }
  }, [hoveredNode]);

  // Create lookup for current positions
  const posMap = {};
  positions.forEach(p => {
    posMap[p.id] = p;
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px' }}>
      <svg
        viewBox="0 0 500 420"
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Subtle radial glow definitions */}
          {BASE_NODES.map(node => (
            <radialGradient key={`glow-${node.id}`} id={`glow-${node.id}`}>
              <stop offset="0%" stopColor={node.color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={node.color} stopOpacity={0} />
            </radialGradient>
          ))}
          {/* Subtle center active glow */}
          <radialGradient id="center-active-glow">
            <stop offset="0%" stopColor="#0070F3" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#0070F3" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* 1. DRAW CONNECTIONS */}
        <g>
          {CONNECTIONS.map((conn, idx) => {
            const p1 = posMap[conn.source];
            const p2 = posMap[conn.target];
            if (!p1 || !p2) return null;

            // Determine line highlight based on hover
            const isHighlighted =
              hoveredNode === conn.source || hoveredNode === conn.target;
            const isMuted =
              hoveredNode &&
              hoveredNode !== conn.source &&
              hoveredNode !== conn.target;

            return (
              <motion.line
                key={`line-${idx}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isHighlighted ? '#3B82F6' : 'rgba(255, 255, 255, 0.08)'}
                strokeWidth={isHighlighted ? 1.5 : 1}
                opacity={isMuted ? 0.3 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: isMuted ? 0.3 : 1
                }}
                transition={{
                  pathLength: {
                    delay: 0.5 + idx * 0.15,
                    duration: 1.2,
                    ease: 'easeOut'
                  },
                  opacity: {
                    delay: 0.5 + idx * 0.15,
                    duration: 0.8
                  }
                }}
              />
            );
          })}
        </g>

        {/* 2. FLOW PARTICLES (along select paths) */}
        {isIntroComplete && (
          <g>
            {PARTICLE_PATHS.map((path, idx) => {
              const p1 = posMap[path.source];
              const p2 = posMap[path.target];
              if (!p1 || !p2) return null;

              return (
                <motion.circle
                  key={`particle-${idx}`}
                  r={2.5}
                  fill="#E0F2FE"
                  style={{ filter: 'drop-shadow(0 0 4px #0284C7)' }}
                  animate={{
                    cx: [p1.x, p2.x],
                    cy: [p1.y, p2.y]
                  }}
                  transition={{
                    duration: 4.5 + idx * 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: idx * 1.2
                  }}
                />
              );
            })}
          </g>
        )}

        {/* 3. DRAW GLOW REGIONS */}
        <g>
          {positions.map(node => {
            const isHovered = hoveredNode === node.id;
            const isCenterActive = node.isCenter && !hoveredNode;
            const isBrightened = activeNeighbors.includes(node.id) || isHovered;

            return (
              <motion.circle
                key={`glow-circle-${node.id}`}
                cx={node.x}
                cy={node.y}
                r={node.size * 3.5}
                fill={node.isCenter ? 'url(#center-active-glow)' : `url(#glow-${node.id})`}
                opacity={isCenterActive || isBrightened ? 0.8 : 0.3}
                animate={{
                  scale: isCenterActive || isHovered ? [1, 1.15, 1] : 1
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            );
          })}
        </g>

        {/* 4. DRAW NODES */}
        <g>
          {positions.map((node, idx) => {
            const isHovered = hoveredNode === node.id;
            const isCenterActive = node.isCenter && !hoveredNode;
            const isNeighbor = activeNeighbors.includes(node.id);
            const isMuted = hoveredNode && !isHovered && !isNeighbor;

            return (
              <g
                key={`node-group-${node.id}`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Visual node representation */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size}
                  fill={isHovered || isCenterActive ? '#FFFFFF' : node.color}
                  stroke={node.isCenter ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={1.5}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: isMuted ? 0.4 : 1,
                    scale: isHovered ? 1.25 : 1
                  }}
                  transition={{
                    opacity: {
                      delay: idx * 0.12,
                      duration: 0.5
                    },
                    scale: {
                      duration: 0.3,
                      ease: 'easeOut'
                    }
                  }}
                />

                {/* Outer Ring on Hover or Center Active */}
                {(isHovered || isCenterActive) && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size + 6}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={0.8}
                    opacity={0.3}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.05, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                )}

                {/* Node labels - styled elegantly */}
                <motion.text
                  x={node.x}
                  y={node.y + node.size + 16}
                  textAnchor="middle"
                  fill={isHovered || isCenterActive ? '#E0F2FE' : '#94A3B8'}
                  fontSize="10"
                  fontFamily="'Inter', sans-serif"
                  fontWeight={node.isCenter || isHovered ? 500 : 400}
                  opacity={isMuted ? 0.35 : 0.9}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isMuted ? 0.35 : 0.9
                  }}
                  transition={{ delay: idx * 0.12 + 0.3 }}
                >
                  {node.label}
                </motion.text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default KnowledgeGraph;
