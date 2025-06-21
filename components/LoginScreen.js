import { useState, useEffect } from 'react';
import styles from './LoginScreen.module.css';
import QuickAccessCard from './QuickAccessCard';
import { FaCloud, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginScreen({ onConnect }) {
  const [formData, setFormData] = useState({
    protocol: 'https',
    domain: '',
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [savedConnection, setSavedConnection] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    try {
      const lastConnection = localStorage.getItem('webdav-connection');
      if (lastConnection) {
        setSavedConnection(JSON.parse(lastConnection));
      }
    } catch (e) {
      console.error("Kaydedilmiş bağlantı okunurken hata oluştu:", e);
      // Hatalı veriyi temizle
      localStorage.removeItem('webdav-connection');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        const url = `${formData.protocol}://${formData.domain}/webdav`;
        await onConnect(url, formData.username, formData.password);
    } catch (err) {
      setError(err.message || 'Bağlantı başarısız oldu. Bilgileri kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'domain' && (value.startsWith('http://') || value.startsWith('https://'))) {
      try {
        const url = new URL(value);
        setFormData(prev => ({
          ...prev,
          protocol: url.protocol.replace(':', ''),
          domain: url.hostname,
        }));
        return;
      } catch (error) {
        console.warn("Could not parse pasted URL, treating as plain text:", error);
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuickLogin = async (connection) => {
    if (!connection) return;
    setLoading(true);
    setError('');
    try {
        await onConnect(connection.url, connection.username, connection.password);
    } catch (err) {
        setError(err.message || 'Hızlı giriş başarısız. Lütfen bilgileri kontrol edip tekrar deneyin.');
        // Hatalıysa localStorage'dan silelim ki bir daha denenmesin
        localStorage.removeItem('webdav_last_connection');
        setSavedConnection(null);
    } finally {
        setLoading(false);
    }
  };

  const handleForgetConnection = () => {
    localStorage.removeItem('webdav_last_connection');
    setSavedConnection(null);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {savedConnection && !loading && (
          <QuickAccessCard
            connectionInfo={savedConnection}
            onQuickLogin={() => handleQuickLogin(savedConnection)}
            onForget={handleForgetConnection}
          />
        )}

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
              <div className={styles.protocolBlock}>
                <select
                  value={formData.protocol}
                  onChange={(e) => handleInputChange({ target: { name: 'protocol', value: e.target.value } })}
                  className={styles.protocolSelect}
                >
                  <option value="https">https</option>
                  <option value="http">http</option>
                </select>
                <span className={styles.urlSeparator}>://</span>
              </div>
              
              <input
                type="text"
                placeholder="sunucu-adresi.com"
                value={formData.domain}
                onChange={(e) => handleInputChange({ target: { name: 'domain', value: e.target.value } })}
                className={styles.domainInput}
                required
              />
              
              <div className={styles.pathStatic}>/webdav</div>
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

        <div className={styles.examples}>
          <div className={styles.examplesHeader} onClick={() => setExamplesOpen(!examplesOpen)}>
            <h3>Örnek Sunucular</h3>
            <div className={styles.headerActions}>
              <div className={styles.infoIconWrapper}>
                <span className={styles.infoIcon}>ⓘ</span>
                <div className={styles.tooltip}>
                  Bu sunucu adresleri sadece örnektir. Kendi sunucu bilgilerinizi kullanmanız gerekmektedir.
                </div>
              </div>
              <span className={`${styles.chevron} ${examplesOpen ? styles.open : ''}`}></span>
            </div>
          </div>
          <div className={`${styles.exampleList} ${examplesOpen ? styles.open : ''}`}>
            <div className={styles.example}>
              <strong>Nextcloud:</strong> your-nextcloud.com
            </div>
            <div className={styles.example}>
              <strong>OwnCloud:</strong> your-owncloud.com
            </div>
            <div className={styles.example}>
              <strong>Box:</strong> dav.box.com
            </div>
            <div className={styles.example}>
              <strong>Dropbox:</strong> dav.dropdav.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 