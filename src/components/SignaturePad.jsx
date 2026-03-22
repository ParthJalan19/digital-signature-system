import { useRef, useState, useEffect } from 'react';
import SignaturePadLib from 'signature_pad';

export default function SignaturePad({ onSave, onClear }) {
  const canvasRef = useRef(null);
  const padRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [penColor, setPenColor] = useState('#00d4ff');

  useEffect(() => {
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio, ratio);
      if (padRef.current) padRef.current.clear();
    };

    padRef.current = new SignaturePadLib(canvas, {
      backgroundColor: 'rgb(10, 10, 15)',
      penColor,
      minWidth: 1.5,
      maxWidth: 3,
    });

    padRef.current.addEventListener('beginStroke', () => setIsEmpty(false));

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    if (padRef.current) padRef.current.penColor = penColor;
  }, [penColor]);

  const handleSave = () => {
    if (padRef.current.isEmpty()) return;
    const dataURL = padRef.current.toDataURL('image/png');
    onSave(dataURL);
  };

  const handleClear = () => {
    padRef.current.clear();
    setIsEmpty(true);
    if (onClear) onClear();
  };

  const colors = ['#00d4ff', '#ffffff', '#00ff88', '#8b5cf6', '#ff4466'];

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.label}>Draw your signature below</span>
        <div style={styles.colors}>
          {colors.map((c) => (
            <div key={c} onClick={() => setPenColor(c)}
              style={{
                ...styles.colorDot,
                background: c,
                border: penColor === c ? '2px solid #fff' : '2px solid transparent',
              }} />
          ))}
        </div>
      </div>

      <div style={styles.canvasWrap}>
        <canvas ref={canvasRef} style={styles.canvas} />
        {isEmpty && (
          <div style={styles.placeholder}>Sign here...</div>
        )}
      </div>

      <div style={styles.actions}>
        <button onClick={handleClear} style={styles.clearBtn}>
          ✕ Clear
        </button>
        <button onClick={handleSave} disabled={isEmpty}
          style={isEmpty ? styles.saveDisabled : styles.saveBtn}>
          ✓ Use This Signature
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: '#0a0a0f', border: '1px solid #2a2a3a',
    borderRadius: '12px', overflow: 'hidden',
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '12px 16px',
    borderBottom: '1px solid #2a2a3a',
    background: '#16161f',
  },
  label: { fontSize: '12px', color: '#8888aa', textTransform: 'uppercase', letterSpacing: '0.5px' },
  colors: { display: 'flex', gap: '8px', alignItems: 'center' },
  colorDot: { width: '18px', height: '18px', borderRadius: '50%', cursor: 'pointer' },
  canvasWrap: { position: 'relative', width: '100%', height: '200px' },
  canvas: { width: '100%', height: '100%', display: 'block', cursor: 'crosshair' },
  placeholder: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#2a2a3a', fontSize: '18px',
    fontFamily: 'cursive', pointerEvents: 'none',
  },
  actions: {
    display: 'flex', gap: '10px', padding: '12px 16px',
    borderTop: '1px solid #2a2a3a', background: '#16161f',
  },
  clearBtn: {
    flex: 1, padding: '10px', background: 'transparent',
    border: '1px solid #2a2a3a', borderRadius: '8px',
    color: '#ff4466', fontSize: '13px',
    fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer',
  },
  saveBtn: {
    flex: 2, padding: '10px',
    background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
    border: 'none', borderRadius: '8px',
    color: '#fff', fontSize: '13px',
    fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer',
  },
  saveDisabled: {
    flex: 2, padding: '10px', background: '#2a2a3a',
    border: 'none', borderRadius: '8px',
    color: '#555577', fontSize: '13px',
    fontFamily: 'Syne, sans-serif', fontWeight: 600,
  },
};