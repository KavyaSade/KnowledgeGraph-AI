/**
 * Dynamic PNG Icon Generator
 * Generates premium, high-resolution neon icons as PNG Data URLs.
 * This ensures all icons in the app are strictly PNG format without external dependencies.
 */

const drawIcon = (type, ctx, w, h) => {
  ctx.clearRect(0, 0, w, h);
  
  // Set up neon shadow/glow
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#45F3FF';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (type === 'logo') {
    // Interconnected Double Ring Node Network
    ctx.strokeStyle = '#45F3FF';
    ctx.shadowColor = '#45F3FF';
    ctx.beginPath();
    ctx.arc(w * 0.35, h * 0.5, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#6C5CE7';
    ctx.shadowColor = '#6C5CE7';
    ctx.beginPath();
    ctx.arc(w * 0.65, h * 0.5, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#FFFFFF';
    ctx.shadowColor = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(w * 0.45, h * 0.5);
    ctx.lineTo(w * 0.55, h * 0.5);
    ctx.stroke();
  } 
  else if (type === 'entity') {
    // Glow box and target dots
    ctx.strokeStyle = '#45F3FF';
    ctx.strokeRect(w * 0.25, h * 0.25, w * 0.5, h * 0.5);
    
    ctx.fillStyle = '#6C5CE7';
    ctx.shadowColor = '#6C5CE7';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(w * 0.35, h * 0.35, 4, 0, Math.PI * 2);
    ctx.arc(w * 0.65, h * 0.65, 4, 0, Math.PI * 2);
    ctx.fill();
  } 
  else if (type === 'graph') {
    // 3-node connected network
    ctx.strokeStyle = '#45F3FF';
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.25);
    ctx.lineTo(w * 0.25, h * 0.7);
    ctx.lineTo(w * 0.75, h * 0.7);
    ctx.closePath();
    ctx.stroke();

    // Nodes
    ctx.fillStyle = '#6C5CE7';
    ctx.shadowColor = '#6C5CE7';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.25, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#45F3FF';
    ctx.shadowColor = '#45F3FF';
    ctx.beginPath();
    ctx.arc(w * 0.25, h * 0.7, 7, 0, Math.PI * 2);
    ctx.arc(w * 0.75, h * 0.7, 7, 0, Math.PI * 2);
    ctx.fill();
  } 
  else if (type === 'search') {
    // Magnifying glass focusing on a node
    ctx.strokeStyle = '#6C5CE7';
    ctx.shadowColor = '#6C5CE7';
    ctx.beginPath();
    ctx.arc(w * 0.45, h * 0.45, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#45F3FF';
    ctx.shadowColor = '#45F3FF';
    ctx.beginPath();
    ctx.moveTo(w * 0.53, h * 0.53);
    ctx.lineTo(w * 0.75, h * 0.75);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(w * 0.45, h * 0.45, 4, 0, Math.PI * 2);
    ctx.fill();
  } 
  else if (type === 'connect') {
    // Pulsing connected rings
    ctx.strokeStyle = '#45F3FF';
    ctx.beginPath();
    ctx.arc(w * 0.35, h * 0.4, 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#6C5CE7';
    ctx.beginPath();
    ctx.arc(w * 0.65, h * 0.6, 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#FFFFFF';
    ctx.shadowColor = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(w * 0.45, h * 0.45);
    ctx.bezierCurveTo(w * 0.5, h * 0.4, w * 0.5, h * 0.6, w * 0.55, h * 0.55);
    ctx.stroke();
  } 
  else if (type === 'summary') {
    // Text list outline
    ctx.strokeStyle = '#45F3FF';
    ctx.strokeRect(w * 0.25, h * 0.2, w * 0.5, h * 0.6);

    ctx.strokeStyle = '#6C5CE7';
    ctx.shadowColor = '#6C5CE7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Lines
    ctx.moveTo(w * 0.35, h * 0.35); ctx.lineTo(w * 0.65, h * 0.35);
    ctx.moveTo(w * 0.35, h * 0.5);   ctx.lineTo(w * 0.65, h * 0.5);
    ctx.moveTo(w * 0.35, h * 0.65);  ctx.lineTo(w * 0.55, h * 0.65);
    ctx.stroke();
  } 
  else if (type === 'organize') {
    // Folder hierarchy
    ctx.strokeStyle = '#6C5CE7';
    ctx.shadowColor = '#6C5CE7';
    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * 0.3);
    ctx.lineTo(w * 0.45, h * 0.3);
    ctx.lineTo(w * 0.52, h * 0.4);
    ctx.lineTo(w * 0.75, h * 0.4);
    ctx.lineTo(w * 0.75, h * 0.75);
    ctx.lineTo(w * 0.25, h * 0.75);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = '#45F3FF';
    ctx.shadowColor = '#45F3FF';
    ctx.beginPath();
    ctx.arc(w * 0.4, h * 0.55, 4, 0, Math.PI * 2);
    ctx.arc(w * 0.6, h * 0.55, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  else if (type === 'google') {
    // Official Google logo
    ctx.save();
    ctx.shadowBlur = 0;
    // Scale standard 18x18 viewBox to canvas dimensions
    ctx.scale(w / 18, h / 18);

    // Red sector
    ctx.fillStyle = '#ea4335';
    ctx.beginPath();
    const redPath = new Path2D("M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.85.87-3.05.87-2.34 0-4.33-1.58-5.04-3.71H.92v2.3C2.4 15.96 5.48 18 9 18z");
    ctx.fill(redPath);

    // Green sector
    ctx.fillStyle = '#34a853';
    ctx.beginPath();
    const greenPath = new Path2D("M3.96 10.72A5.4 5.4 0 0 1 3.6 9c0-.6.1-1.18.36-1.72v-2.3H.92A9 9 0 0 0 0 9c0 1.63.44 3.16 1.2 4.48l2.76-2.76z");
    ctx.fill(greenPath);

    // Yellow sector
    ctx.fillStyle = '#fbbc05';
    ctx.beginPath();
    const yellowPath = new Path2D("M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.4A9 9 0 0 0 9 0C5.48 0 2.4 2.04.92 5.02l3.04 2.3C4.67 5.18 6.66 3.58 9 3.58z");
    ctx.fill(yellowPath);

    // Blue sector
    ctx.fillStyle = '#4285f4';
    ctx.beginPath();
    const bluePath = new Path2D("M17.64 9c0-.64-.06-1.26-.16-1.86H9v3.54h4.86c-.21 1.1-.83 2.04-1.77 2.66l2.91 2.26C16.7 14.28 18 11.83 18 9v-.02z");
    ctx.fill(bluePath);

    ctx.restore();
  }
  else if (type === 'eye') {
    // Elegant eye outline + pupil (dark grey/graphite for light theme forms)
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = w * 0.06;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Eye contour
    ctx.beginPath();
    ctx.moveTo(w * 0.15, h * 0.5);
    ctx.quadraticCurveTo(w * 0.5, h * 0.18, w * 0.85, h * 0.5);
    ctx.quadraticCurveTo(w * 0.5, h * 0.82, w * 0.15, h * 0.5);
    ctx.closePath();
    ctx.stroke();

    // Pupil
    ctx.fillStyle = '#666666';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, w * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  else if (type === 'eye-off') {
    // Slashed eye outline + pupil
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = w * 0.06;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Eye contour
    ctx.beginPath();
    ctx.moveTo(w * 0.15, h * 0.5);
    ctx.quadraticCurveTo(w * 0.5, h * 0.18, w * 0.85, h * 0.5);
    ctx.quadraticCurveTo(w * 0.5, h * 0.82, w * 0.15, h * 0.5);
    ctx.closePath();
    ctx.stroke();

    // Pupil
    ctx.fillStyle = '#666666';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, w * 0.14, 0, Math.PI * 2);
    ctx.fill();

    // Slash line
    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * 0.25);
    ctx.lineTo(w * 0.75, h * 0.75);
    ctx.stroke();
    ctx.restore();
  }
  else if (type === 'arrow-right') {
    // Premium arrow pointing right (white for buttons, can be scaled)
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = w * 0.08;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(w * 0.15, h * 0.5);
    ctx.lineTo(w * 0.85, h * 0.5);
    ctx.moveTo(w * 0.55, h * 0.22);
    ctx.lineTo(w * 0.85, h * 0.5);
    ctx.lineTo(w * 0.55, h * 0.78);
    ctx.stroke();
    ctx.restore();
  }
  else if (type === 'logo-node') {
    // Connected node logo mark
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#0070F3';
    ctx.lineWidth = w * 0.05;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Nodes and connections
    const nodeA = { x: w * 0.3, y: h * 0.35 };
    const nodeB = { x: w * 0.7, y: h * 0.35 };
    const nodeC = { x: w * 0.5, y: h * 0.7 };

    // Draw connection lines
    ctx.strokeStyle = 'rgba(0, 112, 243, 0.4)';
    ctx.beginPath();
    ctx.moveTo(nodeA.x, nodeA.y);
    ctx.lineTo(nodeB.x, nodeB.y);
    ctx.lineTo(nodeC.x, nodeC.y);
    ctx.closePath();
    ctx.stroke();

    // Draw nodes
    ctx.fillStyle = '#0070F3';
    ctx.shadowColor = '#0070F3';
    ctx.beginPath();
    ctx.arc(nodeA.x, nodeA.y, w * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4F46E5';
    ctx.shadowColor = '#4F46E5';
    ctx.beginPath();
    ctx.arc(nodeB.x, nodeB.y, w * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#06B6D4';
    ctx.shadowColor = '#06B6D4';
    ctx.beginPath();
    ctx.arc(nodeC.x, nodeC.y, w * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  else if (type === 'sun') {
    // Sun icon for light theme toggle
    ctx.save();
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#D97706';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = w * 0.07;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, w * 0.18, 0, Math.PI * 2);
    ctx.stroke();

    const numRays = 8;
    const rStart = w * 0.28;
    const rEnd = w * 0.41;
    for (let i = 0; i < numRays; i++) {
      const angle = (i * Math.PI * 2) / numRays;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(w * 0.5 + rStart * cos, h * 0.5 + rStart * sin);
      ctx.lineTo(w * 0.5 + rEnd * cos, h * 0.5 + rEnd * sin);
      ctx.stroke();
    }
    ctx.restore();
  }
  else if (type === 'moon') {
    //moon icon for dark theme toggle
    ctx.save();
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#6366F1';
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = w * 0.07;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#6366F1';

    ctx.beginPath();
    ctx.arc(w * 0.45, h * 0.5, w * 0.25, -Math.PI * 0.4, Math.PI * 0.6);
    ctx.arc(w * 0.55, h * 0.5, w * 0.25, Math.PI * 0.6, -Math.PI * 0.4, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  else if (type === 'capture') {
    //Plus icon for capturing knowledge
    ctx.save();
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#4F46E5';
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = w * 0.08;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.25);
    ctx.lineTo(w * 0.5, h * 0.75);
    ctx.moveTo(w * 0.25, h * 0.5);
    ctx.lineTo(w * 0.75, h * 0.5);
    ctx.stroke();
    ctx.restore();
  }
  else if (type === 'resource') {
    //Document icon for managing resources
    ctx.save();
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#059669';
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = w * 0.07;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.25);
    ctx.lineTo(w * 0.55, h * 0.25);
    ctx.lineTo(w * 0.7, h * 0.4);
    ctx.lineTo(w * 0.7, h * 0.75);
    ctx.lineTo(w * 0.3, h * 0.75);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w * 0.55, h * 0.25);
    ctx.lineTo(w * 0.55, h * 0.4);
    ctx.lineTo(w * 0.7, h * 0.4);
    ctx.stroke();

    ctx.lineWidth = w * 0.05;
    ctx.beginPath();
    ctx.moveTo(w * 0.4, h * 0.52);
    ctx.lineTo(w * 0.6, h * 0.52);
    ctx.moveTo(w * 0.4, h * 0.64);
    ctx.lineTo(w * 0.55, h * 0.64);
    ctx.stroke();
    ctx.restore();
  }
  else if (type === 'insight') {
    ctx.save();
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#DB2777';
    ctx.strokeStyle = '#DB2777';
    ctx.lineWidth = w * 0.07;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.4, w * 0.22, -Math.PI * 0.2, -Math.PI * 0.8, true);
    ctx.lineTo(w * 0.42, h * 0.68);
    ctx.lineTo(w * 0.58, h * 0.68);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w * 0.44, h * 0.74);
    ctx.lineTo(w * 0.56, h * 0.74);
    ctx.moveTo(w * 0.46, h * 0.8);
    ctx.lineTo(w * 0.54, h * 0.8);
    ctx.stroke();

    ctx.lineWidth = w * 0.05;
    ctx.beginPath();
    ctx.moveTo(w * 0.47, h * 0.48);
    ctx.lineTo(w * 0.49, h * 0.4);
    ctx.lineTo(w * 0.51, h * 0.4);
    ctx.lineTo(w * 0.53, h * 0.48);
    ctx.stroke();
    ctx.restore();
  }
  else if (type === 'trash') {
    ctx.save();
    ctx.shadowBlur = 3;
    ctx.shadowColor = '#EF4444';
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = w * 0.07;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * 0.3);
    ctx.lineTo(w * 0.75, h * 0.3);
    ctx.moveTo(w * 0.4, h * 0.3);
    ctx.lineTo(w * 0.4, h * 0.22);
    ctx.lineTo(w * 0.6, h * 0.22);
    ctx.lineTo(w * 0.6, h * 0.3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w * 0.31, h * 0.3);
    ctx.lineTo(w * 0.35, h * 0.78);
    ctx.lineTo(w * 0.65, h * 0.78);
    ctx.lineTo(w * 0.69, h * 0.3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w * 0.46, h * 0.42);
    ctx.lineTo(w * 0.46, h * 0.68);
    ctx.moveTo(w * 0.54, h * 0.42);
    ctx.lineTo(w * 0.54, h * 0.68);
    ctx.stroke();
    ctx.restore();
  }
  else if (type === 'logout') {
    ctx.save();
    ctx.shadowBlur = 3;
    ctx.shadowColor = '#475569';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = w * 0.07;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(w * 0.52, h * 0.24);
    ctx.lineTo(w * 0.26, h * 0.24);
    ctx.lineTo(w * 0.26, h * 0.76);
    ctx.lineTo(w * 0.52, h * 0.76);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w * 0.42, h * 0.5);
    ctx.lineTo(w * 0.78, h * 0.5);
    ctx.lineTo(w * 0.64, h * 0.36);
    ctx.moveTo(w * 0.78, h * 0.5);
    ctx.lineTo(w * 0.64, h * 0.64);
    ctx.stroke();
    ctx.restore();
  }
  else if (type === 'user') {
    ctx.save();
    ctx.shadowBlur = 3;
    ctx.shadowColor = '#4F46E5';
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = w * 0.08;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Head
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.38, w * 0.16, 0, Math.PI * 2);
    ctx.stroke();

    // Shoulders
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.82, w * 0.3, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  else if (type === 'home') {
    ctx.save();
    ctx.shadowBlur = 3;
    ctx.shadowColor = '#6366F1';
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = w * 0.08;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';


    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.5);
    ctx.lineTo(w * 0.5, h * 0.22);
    ctx.lineTo(w * 0.8, h * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w * 0.28, h * 0.46);
    ctx.lineTo(w * 0.28, h * 0.78);
    ctx.lineTo(w * 0.72, h * 0.78);
    ctx.lineTo(w * 0.72, h * 0.46);
    ctx.stroke();

  
    ctx.beginPath();
    ctx.moveTo(w * 0.44, h * 0.78);
    ctx.lineTo(w * 0.44, h * 0.6);
    ctx.lineTo(w * 0.56, h * 0.6);
    ctx.lineTo(w * 0.56, h * 0.78);
    ctx.stroke();

    ctx.restore();
  }
  else if (type === 'network') {
    ctx.save();
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#06B6D4';
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = w * 0.05;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const center = { x: w * 0.5, y: h * 0.5 };
    const orbitA = { x: w * 0.25, y: h * 0.35 };
    const orbitB = { x: w * 0.75, y: h * 0.35 };
    const orbitC = { x: w * 0.5, y: h * 0.75 };

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(orbitA.x, orbitA.y);
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(orbitB.x, orbitB.y);
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(orbitC.x, orbitC.y);
    ctx.stroke();

    // Center node
    ctx.fillStyle = '#6366F1';
    ctx.shadowColor = '#6366F1';
    ctx.beginPath();
    ctx.arc(center.x, center.y, w * 0.07, 0, Math.PI * 2);
    ctx.fill();

    // Orbit nodes
    ctx.fillStyle = '#06B6D4';
    ctx.shadowColor = '#06B6D4';
    ctx.beginPath();
    ctx.arc(orbitA.x, orbitA.y, w * 0.06, 0, Math.PI * 2);
    ctx.arc(orbitB.x, orbitB.y, w * 0.06, 0, Math.PI * 2);
    ctx.arc(orbitC.x, orbitC.y, w * 0.06, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  else if (type === 'brain') {
    // Elegant brain hemisphere outline representing AI insights
    ctx.save();
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#EC4899';
    ctx.strokeStyle = '#EC4899';
    ctx.lineWidth = w * 0.07;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Left hemisphere outline
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.22);
    ctx.bezierCurveTo(w * 0.25, h * 0.15, w * 0.18, h * 0.45, w * 0.35, h * 0.58);
    ctx.bezierCurveTo(w * 0.2, h * 0.72, w * 0.45, h * 0.88, w * 0.5, h * 0.78);
    ctx.stroke();

    // Right hemisphere outline
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.22);
    ctx.bezierCurveTo(w * 0.75, h * 0.15, w * 0.82, h * 0.45, w * 0.65, h * 0.58);
    ctx.bezierCurveTo(w * 0.8, h * 0.72, w * 0.55, h * 0.88, w * 0.5, h * 0.78);
    ctx.stroke();

    // Central dividing line
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.25);
    ctx.lineTo(w * 0.5, h * 0.75);
    ctx.stroke();

    ctx.restore();
  }
  else if (type === 'shield') {
    ctx.save();
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#059669';
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = w * 0.08;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.2);
    ctx.lineTo(w * 0.8, h * 0.25);
    ctx.quadraticCurveTo(w * 0.8, h * 0.55, w * 0.5, h * 0.82);
    ctx.quadraticCurveTo(w * 0.2, h * 0.55, w * 0.2, h * 0.25);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }
  else if (type === 'chart') {
    ctx.save();
    ctx.strokeStyle = '#3B82F6';
    ctx.shadowColor = '#3B82F6';
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.8);
    ctx.lineTo(w * 0.8, h * 0.8);
    ctx.moveTo(w * 0.2, h * 0.8);
    ctx.lineTo(w * 0.2, h * 0.2);
    ctx.stroke();
    
    ctx.strokeStyle = '#10B981';
    ctx.shadowColor = '#10B981';
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.7);
    ctx.lineTo(w * 0.4, h * 0.45);
    ctx.lineTo(w * 0.6, h * 0.55);
    ctx.lineTo(w * 0.8, h * 0.3);
    ctx.stroke();
    ctx.restore();
  }
  else if (type === 'users') {
    ctx.save();
    ctx.strokeStyle = '#45F3FF';
    ctx.shadowColor = '#45F3FF';
    ctx.beginPath();
    ctx.arc(w * 0.38, h * 0.38, w * 0.12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w * 0.38, h * 0.85, w * 0.22, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#6C5CE7';
    ctx.shadowColor = '#6C5CE7';
    ctx.beginPath();
    ctx.arc(w * 0.62, h * 0.38, w * 0.12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w * 0.62, h * 0.85, w * 0.22, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  else if (type === 'gear') {
    ctx.save();
    ctx.strokeStyle = '#FBBF24';
    ctx.shadowColor = '#FBBF24';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, w * 0.22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, w * 0.1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x1 = w * 0.5 + Math.cos(angle) * (w * 0.2);
      const y1 = h * 0.5 + Math.sin(angle) * (h * 0.2);
      const x2 = w * 0.5 + Math.cos(angle) * (w * 0.3);
      const y2 = h * 0.5 + Math.sin(angle) * (h * 0.3);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.stroke();
    ctx.restore();
  }
  else if (type === 'terminal') {
    ctx.save();
    ctx.strokeStyle = '#10B981';
    ctx.shadowColor = '#10B981';
    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * 0.3);
    ctx.lineTo(w * 0.45, h * 0.5);
    ctx.lineTo(w * 0.25, h * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.52, h * 0.7);
    ctx.lineTo(w * 0.75, h * 0.7);
    ctx.stroke();
    ctx.restore();
  }
};

export const getPngIcon = (type) => {
  // If window is defined (browser environment), create an offscreen canvas to export PNG
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawIcon(type, ctx, 128, 128);
      return canvas.toDataURL('image/png');
    }
  }
  return '';
};
