import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function Header({ onDisconnect, onShowSettings }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => router.push('/files')} style={{cursor:'pointer'}}>
        Filestash
      </div>
      <div className={styles.profileMenu} ref={menuRef}>
        <button 
          className={styles.profileButton} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaUserCircle />
        </button>
        {isMenuOpen && (
          <div className={styles.dropdownMenu}>
            <button onClick={() => { onShowSettings(); setIsMenuOpen(false); }}>
              {/* Placeholder for the removed FaCog icon */}
              <span>Settings</span>
            </button>
            <button onClick={onDisconnect}>
              {/* Placeholder for the removed FaPowerOff icon */}
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
