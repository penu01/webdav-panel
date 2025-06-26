import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Header from '@components/Header';
import Settings from '@components/Settings';
import Explorer from '@components/Explorer';
import styles from './WebDAVPanel.module.css';
import { FaFolder, FaFile, FaDownload, FaTrash, FaUpload, FaFileImage, FaFileVideo, FaFileAudio, FaFilePdf, FaFileArchive, FaFileWord, FaFileCode, FaFolderPlus, FaPencilAlt, FaChevronLeft, FaChevronRight, FaSignOutAlt, FaCog, FaEye, FaEyeSlash } from 'react-icons/fa';
import FileItem from './FileItem';
import ContextMenu from './ContextMenu';
import { useTheme } from '@context/ThemeContext';

export default function WebDAVPanel({ client, onDisconnect, path, onFileClick }) {
  const [files, setFiles] = useState([]);
  const [directoryTree, setDirectoryTree] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const abortControllerRef = useRef(null);
  
  const router = useRouter();

  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [isManuallyResized, setIsManuallyResized] = useState(false);
  const mainContentRef = useRef(null);
  const sidebarRef = useRef(null);

  const fileInputRef = useRef(null);

  const [contextMenu, setContextMenu] = useState(null);
  const [renamingFile, setRenamingFile] = useState(null);

  const findNode = useCallback((tree, path) => {
    for (const node of tree) {
      if (node.filename === path) return node;
      if (node.children) {
        const found = findNode(node.children, path);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setIsManuallyResized(true);
  };
  
  const handleResizeMouseMove = useCallback((e) => {
    if (isResizing && sidebarRef.current && mainContentRef.current) {
      const newWidth = e.clientX - mainContentRef.current.getBoundingClientRect().left;
      if (newWidth > 200 && newWidth < 800) {
        sidebarRef.current.style.width = `${newWidth}px`;
      }
    }
  }, [isResizing]);
  
  const handleResizeMouseUp = useCallback(() => {
    if (isResizing && sidebarRef.current) {
      setSidebarWidth(sidebarRef.current.offsetWidth);
    }
    setIsResizing(false);
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', handleResizeMouseMove);
    window.addEventListener('mouseup', handleResizeMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup',handleResizeMouseUp);
    };
  }, [handleResizeMouseMove, handleResizeMouseUp]);

  const fetchDirectory = useCallback(async (dirPath, signal) => {
    const response = await fetch(`/api/webdav/file-handler?action=files&path=${encodeURIComponent(dirPath)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
      signal,
    });
    if (!response.ok) {
      if (response.name === 'AbortError') {
        return null;
      }
      throw new Error(`'${dirPath}' dizini yüklenemedi`);
    }
    return response.json();
  }, [client]);

  const buildInitialTree = useCallback(async (currentPath, signal) => {
    setLoading(true);
    setError('');
    try {
      const rootDirs = await fetchDirectory('/', signal);
      if (signal.aborted) return;

      const pathSegments = currentPath.split('/').filter(Boolean);
      let currentTree = rootDirs.filter(f => f.type === 'directory');
      
      const newFiles = await fetchDirectory(currentPath, signal);
      if (signal.aborted) return;
      setFiles(newFiles);

      for (let i = 0; i < pathSegments.length; i++) {
        if (signal.aborted) return;
        const segmentPath = '/' + pathSegments.slice(0, i + 1).join('/');
        const parentNode = findNode(currentTree, segmentPath);
        if (parentNode && !parentNode.children) {
          const children = await fetchDirectory(segmentPath, signal);
          if (signal.aborted) return;
          parentNode.children = children.filter(f => f.type === 'directory');
        }
      }
      setDirectoryTree(currentTree);
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError(e.message);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [fetchDirectory, findNode]);

  useEffect(() => {
    if (client && path) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      
      buildInitialTree(path, signal);
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [client, path, buildInitialTree]);

  const handleItemClick = (file) => {
    if (file.type === 'directory') {
      router.push(`/files${file.filename}`);
    } else {
      onFileClick(file);
    }
  };

  const handleDownload = async (filename) => {
    try {
        const response = await fetch(`/api/webdav/file-handler?action=download&path=${encodeURIComponent(filename)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Dosya indirilemedi');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.split('/').pop();
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (err) {
        setError(`İndirme hatası: ${err.message}`);
    }
  };

  const handleDelete = async (filename) => {
    if (confirm(`'${filename.split('/').pop()}' silinecek. Emin misiniz?`)) {
        try {
            const response = await fetch(`/api/webdav/file-handler?action=delete&path=${encodeURIComponent(filename)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(client)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Dosya silinemedi');
            }
            // Refresh both the file list and the directory tree
            await buildInitialTree(path);
        } catch (err) {
            setError(`Silme hatası: ${err.message}`);
        }
    }
  };

  const handleRename = async (file, newName) => {
    const oldPath = file.filename;
    // Dizindeki son '/' karakterinden önceki kısmı alarak üst dizin yolunu bul
    const parentPath = oldPath.substring(0, oldPath.lastIndexOf('/'));
    const newPath = parentPath ? `${parentPath}/${newName}` : `/${newName}`;

    try {
        const response = await fetch(`/api/webdav/file-handler?action=rename`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ client, oldPath, newPath })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Dosya yeniden adlandırılamadı.');
        }

        // Listeyi yenile
        await buildInitialTree(path, abortControllerRef.current?.signal);

    } catch (err) {
        setError(`Yeniden adlandırma hatası: ${err.message}`);
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt("Yeni klasör adını girin:");
    if (!folderName) return;

    setLoading(true);
    setError('');

    const newFolderPath = path === '/' ? `/${folderName}` : `${path}/${folderName}`;

    try {
        const response = await fetch(`/api/webdav/file-handler?action=create-folder&path=${encodeURIComponent(newFolderPath)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Klasör oluşturulamadı.');
        }

        // Refresh file list
        await buildInitialTree(path, abortControllerRef.current?.signal);

    } catch (err) {
        setError(`Klasör oluşturma hatası: ${err.message}`);
    } finally {
        setLoading(false);
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
  };
  
  const breadcrumbParts = path.split('/').filter(Boolean);

  const updateSidebarWidth = useCallback((nodes) => {
      if (isManuallyResized || !nodes || nodes.length === 0) return;

      const FONT_SIZE = 14; // Yaklaşık font boyutu (px)
      const CHARACTER_WIDTH = FONT_SIZE * 0.6; // Ortalama karakter genişliği
      const PADDING_AND_ICONS = 80; // İkonlar, chevron, padding için toplam genişlik

      let maxPathLength = 0;
      const findMaxLength = (nodes, level = 0) => {
          nodes.forEach(node => {
              const currentPathLength = (level * 25) + (node.basename.length * CHARACTER_WIDTH) + PADDING_AND_ICONS;
              if (currentPathLength > maxPathLength) {
                  maxPathLength = currentPathLength;
              }
              if (node.children && node.children.length > 0) {
                  findMaxLength(node.children, level + 1);
              }
          });
      };

      findMaxLength(nodes);
      
      const newWidth = Math.max(240, Math.min(600, maxPathLength));
      setSidebarWidth(newWidth);

  }, [isManuallyResized]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    formData.append('client', JSON.stringify(client));

    try {
      const response = await fetch('/api/webdav/file-handler?action=upload', {
        method: 'POST',
        body: formData,
        // 'Content-Type' header'ını ayarlamayın, tarayıcı FormData ile bunu otomatik yapar
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Dosya yüklenemedi');
      }

      // Refresh file list after successful upload
      await buildInitialTree(path);

    } catch (err) {
      setError(`Yükleme hatası: ${err.message}`);
    } finally {
      setLoading(false);
      // Reset the file input
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Sadece tarayıcı penceresinin dışına çıkıldığında overlay'i gizle
    if (e.relatedTarget === null) {
        setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = [...e.dataTransfer.files];
    if (!files || files.length === 0) return;

    // Her dosyayı mevcut yükleme mantığıyla yükle
    setLoading(true);
    setError('');
    
    // Tüm dosyaları sırayla yükle
    for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);
        formData.append('client', JSON.stringify(client));

        try {
            const response = await fetch('/api/webdav/file-handler?action=upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`'${file.name}' yüklenemedi: ${errorData.message}`);
            }
        } catch (err) {
            setError(err.message); // Show error for the failed file
            // Stop on first error or continue? For now, we stop.
            break; 
        }
    }
    
    // Refresh list after all uploads are attempted
    await buildInitialTree(path, abortControllerRef.current?.signal);
    setLoading(false);
  };

  const handleContextMenu = (e, file) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file: file });
  };

  const closeContextMenu = () => setContextMenu(null);

  const startRenaming = (file) => {
    setRenamingFile(file.filename);
  };

  if (isSettingsVisible) {
    return <Settings onBack={() => setIsSettingsVisible(false)} />;
  }

  return (
    <div 
        className={styles.panelContainer}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
    >
      <Header 
        onDisconnect={handleDisconnect} 
        onShowSettings={() => setIsSettingsVisible(true)}
      />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        style={{ display: 'none' }} 
      />
      <div className={styles.mainContent} ref={mainContentRef}>
        <div 
          ref={sidebarRef}
          className={styles.explorerContainer} 
          style={{ width: `${sidebarWidth}px` }}
        >
           <Explorer 
              files={directoryTree} 
              onNavigate={handleItemClick} 
              currentPath={path}
              onTreeUpdate={updateSidebarWidth}
            />
        </div>
        <div 
          className={styles.resizeHandle}
          onMouseDown={handleResizeMouseDown}
        />
        <div className={styles.contentArea}>
          <div className={styles.toolbar}>
            <div className={styles.breadcrumb}>
              <span 
                className={styles.breadcrumbItem} 
                onClick={() => router.push('/files/')}
              >
                Ana Dizin
              </span>
              {breadcrumbParts.map((part, index) => (
                <span key={index}>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <span 
                    className={styles.breadcrumbItem}
                    onClick={() => {
                      const targetPath = '/' + breadcrumbParts.slice(0, index + 1).join('/');
                      router.push(`/files${targetPath}`);
                    }}
                  >
                    {part}
                  </span>
                </span>
              ))}
            </div>
            <div className={styles.toolbarActions}>
              <button onClick={handleCreateFolder} className={styles.actionButton}>
                  <FaFolderPlus />
                  <span>Yeni Klasör</span>
              </button>
              <button onClick={triggerFileUpload} className={styles.actionButton}>
                  <FaUpload />
                  <span>Yükle</span>
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className={styles.loadingMessage}>Dosyalar yükleniyor...</div>
          ) : error ? (
            <div className={styles.errorMessage}>{error}</div>
          ) : (
            <div className={styles.fileGrid}>
              {files.map((file) => (
                <FileItem
                  key={file.filename}
                  file={file}
                  client={client}
                  handleItemClick={handleItemClick}
                  handleDownload={handleDownload}
                  handleDelete={handleDelete}
                  onRename={handleRename}
                  onContextMenu={handleContextMenu}
                  isRenaming={renamingFile === file.filename}
                  onRenameStart={() => setRenamingFile(file.filename)}
                  onRenameEnd={() => setRenamingFile(null)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isDragging && (
          <div 
              className={styles.dropOverlay}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
          >
              <div className={styles.dropMessage}>
                  <FaUpload />
                  <p>Dosyaları buraya bırakın</p>
              </div>
          </div>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          items={[
            { label: 'İndir', icon: <FaDownload />, onClick: () => handleDownload(contextMenu.file.filename) },
            { label: 'Yeniden Adlandır', icon: <FaPencilAlt />, onClick: () => startRenaming(contextMenu.file) },
            { isSeparator: true },
            { label: 'Sil', icon: <FaTrash />, onClick: () => handleDelete(contextMenu.file.filename) },
          ]}
        />
      )}
    </div>
  );
} 