import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function UploadDocument() {
  const [form, setForm] = useState({ title: '', description: '', signer_email: '', expires_at: '' });
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
    } else {
      toast.error('Please select a PDF file only');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a PDF file');
    if (!form.title) return toast.error('Please enter a title');

    setLoading(true);
    setProgress(30);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('signer_email', form.signer_email);
      formData.append('expires_at', form.expires_at);

      setProgress(60);

      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      setProgress(100);
      toast.success('Document uploaded successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Upload Document</h1>
          <p style={styles.subtitle}>Upload a PDF to send for digital signature</p>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleSubmit} style={styles.form}>

            <div style={styles.dropZone} onClick={() => document.getElementById('fileInput').click()}>
              {file ? (
                <div>
                  <div style={styles.fileIcon}>📄</div>
                  <p style={styles.fileName}>{file.name}</p>
                  <p style={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <div style={styles.uploadIcon}>⬆</div>
                  <p style={styles.dropText}>Click to select PDF</p>
                  <p style={styles.dropSubText}>Only PDF files supported · Max 10MB</p>
                </div>
              )}
              <input id="fileInput" type="file" accept=".pdf"
                onChange={handleFile} style={{ display: 'none' }} />
            </div>

            {loading && (
              <div style={styles.progressWrap}>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                </div>
                <span style={styles.progressText}>{progress}%</span>
              </div>
            )}

            <div style={styles.field}>
              <label style={styles.label}>Document Title *</label>
              <input style={styles.input} type="text"
                placeholder="e.g. Invoice #1042 - ABC Corp"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea style={{ ...styles.input, height: '80px', resize: 'vertical' }}
                placeholder="Optional description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Signer Email</label>
                <input style={styles.input} type="email"
                  placeholder="signer@example.com"
                  value={form.signer_email}
                  onChange={(e) => setForm({ ...form, signer_email: e.target.value })} />
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Expiry Date</label>
                <input style={styles.input} type="date"
                  value={form.expires_at}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
              </div>
            </div>

            <button style={loading ? styles.btnDisabled : styles.btn} disabled={loading}>
              {loading ? `Uploading... ${progress}%` : '⬆ Upload Document'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f' },
  container: { maxWidth: '700px', margin: '0 auto', padding: '40px 20px' },
  header: { marginBottom: '32px' },
  title: { fontSize: '32px', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0f5' },
  subtitle: { fontSize: '14px', color: '#8888aa', marginTop: '8px' },
  card: { background: '#16161f', border: '1px solid #2a2a3a', borderRadius: '16px', padding: '40px' },
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  dropZone: {
    border: '2px dashed #2a2a3a', borderRadius: '12px',
    padding: '40px', textAlign: 'center', cursor: 'pointer',
    background: '#0a0a0f',
  },
  uploadIcon: { fontSize: '40px', marginBottom: '12px' },
  fileIcon: { fontSize: '48px', marginBottom: '12px' },
  dropText: { color: '#f0f0f5', fontSize: '16px', fontFamily: 'Syne, sans-serif', fontWeight: 600 },
  dropSubText: { color: '#555577', fontSize: '13px', marginTop: '4px' },
  fileName: { color: '#00d4ff', fontSize: '15px', fontFamily: 'DM Mono, monospace' },
  fileSize: { color: '#555577', fontSize: '12px', marginTop: '4px' },
  progressWrap: { display: 'flex', alignItems: 'center', gap: '12px' },
  progressBar: { flex: 1, height: '6px', background: '#2a2a3a', borderRadius: '3px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #00d4ff, #8b5cf6)', borderRadius: '3px', transition: 'width 0.3s' },
  progressText: { fontSize: '12px', color: '#8888aa', minWidth: '35px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  row: { display: 'flex', gap: '16px' },
  label: { fontSize: '12px', color: '#8888aa', letterSpacing: '0.5px', textTransform: 'uppercase' },
  input: {
    background: '#0a0a0f', border: '1px solid #2a2a3a',
    borderRadius: '8px', padding: '12px 16px',
    color: '#f0f0f5', fontSize: '14px', fontFamily: 'DM Mono, monospace',
  },
  btn: {
    background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
    border: 'none', borderRadius: '8px', padding: '14px',
    color: '#fff', fontSize: '15px', fontWeight: 700,
    fontFamily: 'Syne, sans-serif',
  },
  btnDisabled: {
    background: '#2a2a3a', border: 'none', borderRadius: '8px',
    padding: '14px', color: '#8888aa', fontSize: '15px',
  },
};
