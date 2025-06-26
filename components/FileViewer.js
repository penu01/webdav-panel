import { useState, useEffect, useRef } from 'react';
import { FaDownload, FaTrash, FaPencilAlt, FaTimes, FaSave } from 'react-icons/fa';
import styles from './FileViewer.module.css';

const isTextFile = (filename) => {
    const textExtensions = ['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'log', 'ini', 'cfg', 'py', 'sh', 'bat'];
    const extension = filename.split('.').pop().toLowerCase();
    return textExtensions.includes(extension);
};

const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const extension = filename.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
};

export default function FileViewer({ file, client, onClose, onRename, onDelete }) {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [fileContent, setFileContent] = useState(''); // Initialize with empty string
  const [originalContent, setOriginalContent] = useState(''); // To track changes
  const [error, setError] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(file.basename);
  const renameInputRef = useRef(null);
  const objectUrlRef = useRef(null); // Ref to hold the object URL for cleanup
  
  useEffect(() => {
    if (!file || !client) {
      setStatus('error');
      setError('Gerekli dosya veya bağlantı bilgisi eksik.');
      return;
    }

    const fetchFile = async () => {
      setStatus('loading');
      const abortController = new AbortController();
      try {
        const response = await fetch(`/api/webdav/file-handler?action=stream&path=${encodeURIComponent(file.filename)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(client),
          signal: abortController.signal
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({ message: 'Sunucudan JSON olmayan bir hata yanıtı alındı.' }));
          throw new Error(errData.message || `Sunucu hatası: ${response.status}`);
        }
        
        if (isImageFile(file.basename)) {
          const blob = await response.blob();
          objectUrlRef.current = URL.createObjectURL(blob);
          setFileContent(objectUrlRef.current);
        } else if (isTextFile(file.basename)) {
          const text = await response.text();
          setFileContent(text);
          setOriginalContent(text); // Store the original content
        } else {
            const unsupportedError = 'Bu dosya türü önizleme için desteklenmiyor.';
            setError(unsupportedError);
            setStatus('error');
            return;
        }
        setStatus('success');
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        setError('Dosya yüklenirken hata oluştu.');
        setStatus('error');
      }
    };
    
    fetchFile();
    
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [file, client]);

  // Yeniden adlandırma modundayken input'a odaklan ve metni akıllıca seç
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      const input = renameInputRef.current;
      input.focus();
      
      const value = input.value;
      const lastDotIndex = value.lastIndexOf('.');
      
      if (lastDotIndex > 0) {
        input.setSelectionRange(0, lastDotIndex);
      } else {
        input.select();
      }
    }
  }, [isRenaming]);

  // Arka plana tıklandığında görüntüleyiciyi kapat
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Yeniden adlandırmayı gönder
  const handleRenameSubmit = () => {
    if (renameValue && renameValue !== file.basename) {
      onRename(file, renameValue);
    }
    setIsRenaming(false);
  };
  
  // Klavye olaylarını dinle
  const handleRenameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setRenameValue(file.basename); // Değişiklikleri geri al
      setIsRenaming(false);
    }
  };

  // Silme işlemini onayla ve gerçekleştir
  const handleDeleteClick = () => {
     onDelete(file.filename);
  };

  const handleDownload = () => {
    if (fileContent) {
        let url;
        if (isImageFile(file.basename)) {
            url = fileContent;
        } else if (isTextFile(file.basename)) {
            const blob = new Blob([fileContent], { type: 'text/plain' });
            url = URL.createObjectURL(blob);
        }

        if (url) {
            const a = document.createElement('a');
            a.href = url;
            a.download = file.basename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            if (isTextFile(file.basename)) {
                URL.revokeObjectURL(url); // Clean up blob URL for text files
            }
        }
    }
  };

  const handleContentChange = (e) => {
    setFileContent(e.target.value);
  };

  const handleSave = async () => {
    setStatus('loading');
    try {
      const response = await fetch(`/api/webdav/file-handler?action=save&path=${encodeURIComponent(file.filename)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client, content: fileContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Dosya kaydedilemedi.');
      }
      
      setOriginalContent(fileContent); // Update original content after save
      setStatus('success');
      // Optionally show a success message to the user
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const isDirty = fileContent !== originalContent;

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <div className={styles.centeredMessage}>Yükleniyor...</div>;
      case 'error':
        return <div className={styles.centeredMessage}>{error}</div>;
      case 'success':
        if (isImageFile(file.basename)) {
          return <img src={fileContent} alt={file.basename} className={styles.image} />;
        }
        if (isTextFile(file.basename)) {
          return (
            <textarea
              className={styles.textContent}
              value={fileContent}
              onChange={handleContentChange}
              spellCheck="false"
            />
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.viewer}>
        <div className={styles.header}>
            <div className={styles.fileNameContainer}>
              {!isRenaming ? (
                <span className={styles.fileName} onDoubleClick={() => setIsRenaming(true)}>{file.basename}</span>
              ) : (
                <input
                  ref={renameInputRef}
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={handleRenameKeyDown}
                  onBlur={handleRenameSubmit}
                  className={styles.renameInput}
                />
              )}
            </div>
            <div className={styles.actions}>
                {isTextFile(file.basename) && (
                  <button onClick={handleSave} disabled={!isDirty || status === 'loading'} className={styles.actionButton} title="Kaydet">
                    <FaSave />
                  </button>
                )}
                <button onClick={handleDownload} className={styles.actionButton} title="İndir">
                  <FaDownload />
                </button>
                <button onClick={() => setIsRenaming(true)} disabled={isRenaming} className={styles.actionButton} title="Yeniden Adlandır">
                  <FaPencilAlt />
                </button>
                <button onClick={handleDeleteClick} className={styles.actionButton} title="Sil">
                  <FaTrash />
                </button>
                <button onClick={onClose} className={styles.actionButton} title="Kapat">
                  <FaTimes />
                </button>
            </div>
        </div>
        <div className={styles.content}>
            {renderContent()}
        </div>
      </div>
    </div>
  );
} 