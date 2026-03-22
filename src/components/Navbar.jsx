import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/upload', label: 'Upload Doc' },
  ];

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>⬡ SignVault</Link>

      <div style={styles.links}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              ...styles.link,
              ...(location.pathname === link.path ? styles.activeLink : {}),
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div style={styles.right}>
        <span style={styles.userName}>👤 {user?.name}</span>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px', height: '64px',
    background: '#16161f', borderBottom: '1px solid #2a2a3a',
    position: 'sticky', top: 0, zIndex: 100,
  },
  logo: {
    fontSize: '20px', fontFamily: 'Syne, sans-serif',
    fontWeight: 800, color: '#00d4ff', textDecoration: 'none',
  },
  links: { display: 'flex', gap: '8px' },
  link: {
    padding: '8px 16px', borderRadius: '8px',
    fontSize: '14px', color: '#8888aa',
    textDecoration: 'none', fontFamily: 'Syne, sans-serif',
    fontWeight: 600, transition: 'all 0.2s',
  },
  activeLink: { background: '#1e1e2e', color: '#00d4ff' },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  userName: { fontSize: '13px', color: '#8888aa', fontFamily: 'DM Mono, monospace' },
  logoutBtn: {
    background: 'transparent', border: '1px solid #2a2a3a',
    borderRadius: '8px', padding: '7px 14px',
    color: '#ff4466', fontSize: '13px',
    fontFamily: 'Syne, sans-serif', fontWeight: 600,
    cursor: 'pointer',
  },
};