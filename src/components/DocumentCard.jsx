import { Link } from 'react-router-dom';

const statusColors = {
  pending:  { bg: '#1a1400', border: '#ffaa00', text: '#ffaa00' },
  signed:   { bg: '#001a0e', border: '#00ff88', text: '#00ff88' },
  rejected: { bg: '#1a0008', border: '#ff4466', text: '#ff4466' },
  expired:  { bg: '#111118', border: '#555577', text: '#555577' },
};

export default function DocumentCard({ doc, onDelete }) {
  const colors = statusColors[doc.status] || statusColors.pending;
  const date = new Date(doc.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div style={styles.iconWrap}>📄</div>
        <span style={{ ...styles.status, background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}>
          {doc.status.toUpperCase()}
        </span>
      </div>

      <h3 style={styles.title}>{doc.title}</h3>
      {doc.description && <p style={styles.desc}>{doc.description}</p>}

      <div style={styles.meta}>
        <span style={styles.metaItem}>📅 {date}</span>
        {doc.signer_email && (
          <span style={styles.metaItem}>✉️ {doc.signer_email}</span>
        )}
      </div>

      <div style={styles.actions}>
        <a href={doc.firebase_url} target="_blank" rel="noreferrer" style={styles.btnView}>
          View PDF
        </a>
        {doc.status === 'pending' && (
          <Link to={`/sign/${doc.id}`} style={styles.btnSign}>
            Sign →
          </Link>
        )}
        <button onClick={() => onDelete(doc.id)} style={styles.btnDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#16161f', border: '1px solid #2a2a3a',
    borderRadius: '12px', padding: '24px',
    display: 'flex', flexDirection: 'column', gap: '12px',
    transition: 'border-color 0.2s, transform 0.2s',
  },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  iconWrap: { fontSize: '28px' },
  status: {
    fontSize: '10px', fontWeight: 700, padding: '4px 10px',
    borderRadius: '20px', letterSpacing: '1px',
    fontFamily: 'DM Mono, monospace',
  },
  title: {
    fontSize: '16px', fontFamily: 'Syne, sans-serif',
    fontWeight: 700, color: '#f0f0f5',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  desc: { fontSize: '13px', color: '#8888aa', lineHeight: 1.5 },
  meta: { display: 'flex', flexDirection: 'column', gap: '4px' },
  metaItem: { fontSize: '12px', color: '#555577', fontFamily: 'DM Mono, monospace' },
  actions: { display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' },
  btnView: {
    flex: 1, textAlign: 'center', padding: '8px 12px',
    background: '#1e1e2e', border: '1px solid #2a2a3a',
    borderRadius: '8px', color: '#00d4ff',
    fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: 600,
  },
  btnSign: {
    flex: 1, textAlign: 'center', padding: '8px 12px',
    background: 'linear-gradient(135deg, #00d4ff22, #8b5cf622)',
    border: '1px solid #8b5cf6',
    borderRadius: '8px', color: '#8b5cf6',
    fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: 600,
  },
  btnDelete: {
    padding: '8px 12px', background: 'transparent',
    border: '1px solid #2a2a3a', borderRadius: '8px',
    color: '#ff4466', fontSize: '13px',
    fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer',
  },
};