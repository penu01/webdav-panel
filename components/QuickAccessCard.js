import { useState } from 'react';
import styles from './QuickAccessCard.module.css';

export default function QuickAccessCard({ connectionInfo, onQuickLogin, onForget }) {
  let displayHost = connectionInfo.url;
  if (displayHost.startsWith('https://')) {
    displayHost = displayHost.substring(8);
  } else if (displayHost.startsWith('http://')) {
    displayHost = displayHost.substring(7);
  }

  const handleForget = () => {
    onForget();
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>⚡️</span>
        <h3>Hızlı Erişim</h3>
      </div>
      <div className={styles.info}>
        <p className={styles.server} title={connectionInfo.url}>{displayHost}</p>
        <p className={styles.user}>{connectionInfo.username}</p>
        <div className={styles.passwordSection}>
          <span className={styles.passwordLabel}>Şifre:</span>
          <span className={styles.passwordValue}>
            {showPassword ? connectionInfo.password : '********'}
          </span>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className={styles.showPasswordButton}
            title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
          >
            {showPassword ? "Gizle" : "Göster"}
          </button>
        </div>
      </div>
      <div className={styles.actions}>
        <button 
          className={styles.loginButton} 
          onClick={onQuickLogin}
        >
          Hızlı Giriş
        </button>
        <button className={styles.forgetButton} onClick={handleForget}>Unut</button>
      </div>
    </div>
  );
} 