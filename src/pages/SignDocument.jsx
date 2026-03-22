import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SignaturePad from '../components/SignaturePad';
import api from '../services/api';

export default function SignDocument() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [signature, setSignature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1=view doc, 2=sign, 3=done

  useEffect(() => {
    fetchDocument();
  }, [docId]);

  const fetchDocument = async () => {
    try {
      const res = await api.get(`/documents/${docId}`);
      setDocument(res.data.document);
    } catch {
      toast.error('Document not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureSave = (dataURL) => {
    setSignature(dataURL);
    toast.success('Signature captured!');
  };

  const handleSubmit = async () => {
    if (!signature) return toast.error('Please draw your signature first');
    setSubmitting(true);
    try {
      await api.post('/signatures', {
        document_id: docId,
        signature_image: signature,
      });
      setStep(3);
      toast.success('Document signed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sign document');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.loading}>Loading document...</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

        {/* Steps indicator */}
        <div style={styles.steps}>
          {['Review Document', 'Sign', 'Complete'].map((s, i) => (
            <div key={s} style={styles.stepWrap}>
              <div style={{
                ...styles.stepCircle,
                background: step > i + 1 ? '#00ff88' : step === i + 1 ? '#00d4ff' : '#2a2a3a',
                color: step >= i + 1 ? '#000' : '#555577',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{
                ...styles.stepLabel,
                color: step === i + 1 ? '#f0f0f5' : '#555577',
              }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step 1 — Review */}
        {step === 1 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📄 Review Document</h2>
            <div style={styles.docInfo}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Title</span>
                <span style={styles.infoValue}>{document?.title}</span>
              </div>
              {document?.description && (
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Description</span>
                  <span style={styles.infoValue}>{document?.description}</span>
                </div>
              )}
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Status</span>
                <span style={{ ...styles.infoValue, color: '#ffaa00', textTransform: 'uppercase' }}>
                  {document?.status}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Uploaded</span>
                <span style={styles.infoValue}>
                  {new Date(document?.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {document?.status === 'signed' ? (
              <div style={styles.alreadySigned}>
                ✅ This document has already been signed
              </div>
            ) : (
              <div style={styles.btnRow}>
                <a href={document?.firebase_url} target="_blank"
                  rel="noreferrer" style={styles.viewBtn}>
                  👁 View PDF
                </a>
                <button onClick={() => setStep(2)} style={styles.nextBtn}>
                  Proceed to Sign →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Sign */}
        {step === 2 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>✍️ Draw Your Signature</h2>
            <p style={styles.cardSub}>
              Use your mouse or touch to draw your signature in the box below
            </p>

            <SignaturePad
              onSave={handleSignatureSave}
              onClear={() => setSignature(null)}
            />

            {signature && (
              <div style={styles.previewWrap}>
                <p style={styles.previewLabel}>Signature Preview:</p>
                <img src={signature} alt="signature preview" style={styles.preview} />
              </div>
            )}

            <div style={styles.btnRow}>
              <button onClick={() => setStep(1)} style={styles.backBtn}>
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!signature || submitting}
                style={!signature || submitting ? styles.submitDisabled : styles.submitBtn}>
                {submitting ? 'Signing...' : '✓ Confirm & Sign Document'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Success */}
        {step === 3 && (
          <div style={{ ...styles.card, textAlign: 'center', padding: '60px 40px' }}>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.successTitle}>Document Signed!</h2>
            <p style={styles.successSub}>
              Your signature has been saved and the document status has been updated.
            </p>
            <div style={styles.btnRow}>
              <button onClick={() => navigate('/')} style={styles.nextBtn}>
                Go to Dashboard →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f' },
  container: { maxWidth: '700px', margin: '0 auto', padding: '40px 20px' },
  loading: { color: '#8888aa', textAlign: 'center', padding: '60px', fontFamily: 'DM Mono, monospace' },
  steps: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '40px' },
  stepWrap: { display: 'flex', alignItems: 'center', gap: '8px' },
  stepCircle: {
    width: '32px', height: '32px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif',
  },
  stepLabel: { fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: 600 },
  card: {
    background: '#16161f', border: '1px solid #2a2a3a',
    borderRadius: '16px', padding: '40px',
    display: 'flex', flexDirection: 'column', gap: '24px',
  },
  cardTitle: { fontSize: '22px', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#f0f0f5' },
  cardSub: { fontSize: '14px', color: '#8888aa', marginTop: '-12px' },
  docInfo: { display: 'flex', flexDirection: 'column', gap: '12px' },
  infoRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '12px 16px', background: '#0a0a0f',
    borderRadius: '8px', border: '1px solid #2a2a3a',
  },
  infoLabel: { fontSize: '12px', color: '#8888aa', textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue: { fontSize: '14px', color: '#f0f0f5', fontFamily: 'DM Mono, monospace' },
  alreadySigned: {
    background: '#001a0e', border: '1px solid #00ff88',
    borderRadius: '8px', padding: '16px', color: '#00ff88',
    fontSize: '14px', textAlign: 'center',
  },
  btnRow: { display: 'flex', gap: '12px' },
  viewBtn: {
    flex: 1, textAlign: 'center', padding: '12px',
    background: '#1e1e2e', border: '1px solid #2a2a3a',
    borderRadius: '8px', color: '#00d4ff',
    fontSize: '14px', fontFamily: 'Syne, sans-serif', fontWeight: 600,
  },
  nextBtn: {
    flex: 2, padding: '12px',
    background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
    border: 'none', borderRadius: '8px', color: '#fff',
    fontSize: '14px', fontFamily: 'Syne, sans-serif', fontWeight: 700, cursor: 'pointer',
  },
  backBtn: {
    flex: 1, padding: '12px', background: 'transparent',
    border: '1px solid #2a2a3a', borderRadius: '8px',
    color: '#8888aa', fontSize: '14px',
    fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer',
  },
  submitBtn: {
    flex: 2, padding: '12px',
    background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
    border: 'none', borderRadius: '8px', color: '#000',
    fontSize: '14px', fontFamily: 'Syne, sans-serif', fontWeight: 700, cursor: 'pointer',
  },
  submitDisabled: {
    flex: 2, padding: '12px', background: '#2a2a3a',
    border: 'none', borderRadius: '8px',
    color: '#555577', fontSize: '14px',
    fontFamily: 'Syne, sans-serif', fontWeight: 700,
  },
  previewWrap: {
    background: '#0a0a0f', border: '1px solid #2a2a3a',
    borderRadius: '8px', padding: '16px',
  },
  previewLabel: { fontSize: '11px', color: '#8888aa', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  preview: { maxWidth: '100%', maxHeight: '80px', display: 'block' },
  successIcon: { fontSize: '64px', marginBottom: '16px' },
  successTitle: { fontSize: '28px', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0f5' },
  successSub: { fontSize: '14px', color: '#8888aa', lineHeight: 1.6 },
};