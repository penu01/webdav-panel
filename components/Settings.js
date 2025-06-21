import { useState, useEffect } from 'react';
import styles from './Settings.module.css';
import { FaCheckCircle, FaChevronLeft, FaPaintBrush, FaBolt, FaCog } from 'react-icons/fa';
import { useTheme } from '@context/ThemeContext';
import { useSettings } from '@context/SettingsContext';

export default function Settings({ onBack }) {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    showHiddenFiles: false,
    defaultView: 'grid', // 'grid' veya 'list'
    language: 'tr',
  });
  const { theme, toggleTheme } = useTheme();
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved
  const { thumbnailMode, setThumbnailMode } = useSettings();

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    localStorage.setItem('webdav-settings', JSON.stringify(settings));
    
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 500);
  };

  useEffect(() => {
    // Ayarları localStorage'dan oku
    const storedSettings = localStorage.getItem('webdav-settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  return (
    <div className={styles.settingsPage}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          <FaChevronLeft />
        </button>
        <h1>Ayarlar</h1>
      </div>
      <div className={styles.settingsContent}>

        {/* Card: Görünüm */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}><FaPaintBrush /> Görünüm</h3>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>Tema</label>
              <p>Uygulama için açık veya koyu modu seçin.</p>
            </div>
            <div className={styles.themeOptions}>
              <button onClick={() => toggleTheme('dark')} className={theme === 'dark' ? styles.active : ''}>Karanlık</button>
              <button onClick={() => toggleTheme('light')} className={theme === 'light' ? styles.active : ''}>Aydınlık</button>
            </div>
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>Varsayılan Görünüm</label>
              <p>Dosyaların varsayılan olarak nasıl gösterileceği.</p>
            </div>
            <select value={settings.defaultView} onChange={(e) => handleSettingChange('defaultView', e.target.value)} className={styles.select}>
              <option value="grid">Grid (Kare)</option>
              <option value="list">Liste</option>
            </select>
          </div>
           <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>Dil</label>
              <p>Uygulama dilini seçin.</p>
            </div>
            <select value={settings.language} onChange={(e) => handleSettingChange('language', e.target.value)} className={styles.select}>
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Card: Performans */}
        <div className={styles.card}>
            <h3 className={styles.cardTitle}><FaBolt /> Performans</h3>
            <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
                <label>Önizleme Yükleme Davranışı</label>
                <p>Resim önizlemelerinin yüklenme şekli.</p>
            </div>
            <div className={styles.radioGroup}>
                <label><input type="radio" name="thumbnailMode" value="immediate" checked={thumbnailMode === 'immediate'} onChange={(e) => setThumbnailMode(e.target.value)} /> Anında</label>
                <label><input type="radio" name="thumbnailMode" value="onHover" checked={thumbnailMode === 'onHover'} onChange={(e) => setThumbnailMode(e.target.value)} /> Üzerine Gelince</label>
                <label><input type="radio" name="thumbnailMode" value="onDelayedHover" checked={thumbnailMode === 'onDelayedHover'} onChange={(e) => setThumbnailMode(e.target.value)} /> Bekleyince</label>
                <label><input type="radio" name="thumbnailMode" value="none" checked={thumbnailMode === 'none'} onChange={(e) => setThumbnailMode(e.target.value)} /> Yükleme</label>
            </div>
            </div>
        </div>

        {/* Card: Genel */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}><FaCog /> Genel Ayarlar</h3>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>Otomatik Yenileme</label>
              <p>Dosya listesini otomatik olarak yeniler.</p>
            </div>
            <label className={styles.switch}><input type="checkbox" checked={settings.autoRefresh} onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)} /><span className={styles.slider}></span></label>
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>Gizli Dosyaları Göster</label>
              <p>Nokta ile başlayan dosyaları listeler.</p>
            </div>
            <label className={styles.switch}><input type="checkbox" checked={settings.showHiddenFiles} onChange={(e) => handleSettingChange('showHiddenFiles', e.target.checked)} /><span className={styles.slider}></span></label>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleSave} className={`${styles.saveButton} ${saveStatus === 'saved' ? styles.saved : ''}`} disabled={saveStatus !== 'idle'}>
            {saveStatus === 'idle' && 'Ayarları Kaydet'}
            {saveStatus === 'saving' && 'Kaydediliyor...'}
            {saveStatus === 'saved' && (<><FaCheckCircle /> Kaydedildi!</>)}
          </button>
        </div>
      </div>
    </div>
  );
} 