import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import DocumentCard from '../components/DocumentCard';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data.documents);
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(documents.filter(d => d.id !== id));
      toast.success('Document deleted');
    } catch {
      toast.error('Failed to delete document');
    }
  };

  const filtered = filter === 'all'
    ? documents
    : documents.filter(d => d.status === filter);

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    signed: documents.filter(d => d.status === 'signed').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Good day, {user?.name?.split(' ')[0]} 👋</h1>
            <p style={styles.subtitle}>Manage and track your documents</p>
          </div>
          <Link to="/upload" style={styles.uploadBtn}>+ Upload Document</Link>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total', value: stats.total, color: '#00d4ff' },
            { label: 'Pending', value: stats.pending, color: '#ffaa00' },
            { label: 'Signed', value: stats.signed, color: '#00ff88' },
            { label: 'Rejected', value: stats.rejected, color: '#ff4466' },
          ].map((stat) => (
            <div key={stat.label} style={styles.statCard}>
              <div style={{ ...styles.statValue, color: stat.color }}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={styles.tabs}>
          {['all', 'pending', 'signed', 'rejected'].map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)}
              style={{ ...styles.tab, ...(filter === tab ? styles.activeTab : {}) }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div style={styles.empty}>Loading documents...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <p style={styles.emptyText}>No documents found</p>
            <Link to="/upload" style={styles.emptyBtn}>Upload your first document</Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '32px', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0f5' },
  subtitle: { fontSize: '14px', color: '#8888aa', marginTop: '4px' },
  uploadBtn: {
    background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
    border: 'none', borderRadius: '10px', padding: '12px 24px',
    color: '#fff', fontSize: '14px', fontWeight: 700,
    fontFamily: 'Syne, sans-serif', textDecoration: 'none',
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' },
  statCard: {
    background: '#16161f', border: '1px solid #2a2a3a',
    borderRadius: '12px', padding: '24px', textAlign: 'center',
  },
  statValue: { fontSize: '36px', fontFamily: 'Syne, sans-serif', fontWeight: 800 },
  statLabel: { fontSize: '12px', color: '#8888aa', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: {
    padding: '8px 20px', borderRadius: '8px', border: '1px solid #2a2a3a',
    background: 'transparent', color: '#8888aa',
    fontSize: '14px', fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer',
  },
  activeTab: { background: '#1e1e2e', color: '#00d4ff', borderColor: '#00d4ff' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  empty: { textAlign: 'center', color: '#8888aa', padding: '60px', fontFamily: 'DM Mono, monospace' },
  emptyState: { textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { fontSize: '64px', marginBottom: '16px' },
  emptyText: { color: '#8888aa', fontSize: '16px', marginBottom: '24px', fontFamily: 'DM Mono, monospace' },
  emptyBtn: {
    display: 'inline-block', padding: '12px 24px',
    background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
    borderRadius: '10px', color: '#fff',
    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px',
  },
};