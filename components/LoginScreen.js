import { useState } from 'react';
import styles from './LoginScreen.module.css';
import { FaCloud, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginScreen({ onConnect }) {
  const [formData, setFormData] = useState({
    domain: '',
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        const url = formData.domain;
        await onConnect(url, formData.username, formData.password);
    } catch (err) {
      setError(err.message || 'Bağlantı başarısız oldu. Bilgileri kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <FaCloud className={styles.icon} />
            <h1>WebDAV Panel</h1>
          </div>
          <p className={styles.subtitle}>Dosyalarınızı güvenle yönetin</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.urlSection}>
            <label className={styles.label}>WebDAV Sunucu Adresi</label>
            <div className={styles.urlInputs}>
              <input
                type="text"
                placeholder="https://sunucu-adresi.com"
                value={formData.domain}
                onChange={(e) => handleInputChange({ target: { name: 'domain', value: e.target.value } })}
                className={styles.domainInput}
                required
              />
            </div>
          </div>

          <div className={styles.credentialsSection}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Kullanıcı Adı</label>
              <input
                type="text"
                placeholder="Kullanıcı adınızı girin"
                value={formData.username}
                onChange={(e) => handleInputChange({ target: { name: 'username', value: e.target.value } })}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Şifre</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrenizi girin"
                  value={formData.password}
                  onChange={(e) => handleInputChange({ target: { name: 'password', value: e.target.value } })}
                  className={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.showPasswordButton}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !formData.domain || !formData.username || !formData.password}
            className={styles.loginButton}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Bağlanıyor...
              </>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 