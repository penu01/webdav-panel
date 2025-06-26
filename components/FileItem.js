import { useEffect, useState, useRef } from 'react';
import styles from './WebDAVPanel.module.css'; // Reuse the same styles
import { FaFolder, FaFile, FaFileImage, FaFileVideo, FaFilePdf, FaFileArchive, FaFileAudio, FaFileWord, FaFileCode } from 'react-icons/fa';
import { useSettings } from '@context/SettingsContext';

// Dosya boyutunu formatlayan yardımcı fonksiyon
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  if (bytes === null || bytes === undefined) return '-';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (file, styles, thumbnailUrl) => {
    if (thumbnailUrl) {
        return <img src={thumbnailUrl} alt={file.basename} className={styles.thumbnail} />;
    }
    
    if (file.type === 'directory') {
        return <FaFolder />;
    }
    
    const extension = file.basename.split('.').pop().toLowerCase();
    const iconMap = {
        'jpg': <FaFileImage />, 'jpeg': <FaFileImage />, 'png': <FaFileImage />, 'gif': <FaFileImage />, 'bmp': <FaFileImage />, 'webp': <FaFileImage />, 'svg': <FaFileImage />,
        'mp4': <FaFileVideo />, 'mov': <FaFileVideo />, 'avi': <FaFileVideo />, 'mkv': <FaFileVideo />,
        'mp3': <FaFileAudio />, 'wav': <FaFileAudio />, 'ogg': <FaFileAudio />,
        'pdf': <FaFilePdf />,
        'zip': <FaFileArchive />, 'rar': <FaFileArchive />, '7z': <FaFileArchive />, 'tar': <FaFileArchive />, 'gz': <FaFileArchive />,
        'doc': <FaFileWord />, 'docx': <FaFileWord />,
        'js': <FaFileCode />, 'jsx': <FaFileCode />, 'ts': <FaFileCode />, 'tsx': <FaFileCode />, 'html': <FaFileCode />, 'css': <FaFileCode />, 'json': <FaFileCode />, 'py': <FaFileCode />
    };

    if (iconMap[extension]) {
        return iconMap[extension];
    }
    
    return (
        <div className={styles.genericFileContainer}>
            <FaFile />
            <span className={styles.extensionBadge}>{extension.length > 4 ? extension.substring(0,3) : extension}</span>
        </div>
    );
};


export default function FileItem({ 
  file, 
  client, 
  handleItemClick, 
  onRename, 
  onContextMenu,
  isRenaming, // Controlled by parent
  onRenameEnd 
}) {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [renameValue, setRenameValue] = useState(file.basename);
  const { thumbnailMode } = useSettings();
  const hoverTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isImage = (/\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/i).test(file.basename);
  const renameInputRef = useRef(null);

  const fetchThumbnail = async () => {
      if (thumbnailUrl || !isImage) return; // Already fetched or not an image
      
      // Cancel any ongoing request
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
      }
      
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      try {
          const response = await fetch(`/api/webdav/file-handler?action=stream&path=${encodeURIComponent(file.filename)}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(client),
              signal: abortControllerRef.current.signal
          });
          if (!response.ok) {
            // Handle error silently
            return;
          }
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setThumbnailUrl(url);
      } catch (error) {
        // Handle error silently
      }
  };
  
  useEffect(() => {
    if (isImage && thumbnailMode === 'immediate') {
        fetchThumbnail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, client, thumbnailMode, isImage]);
  
  const handleMouseEnter = () => {
    if (thumbnailMode === 'onHover') {
        fetchThumbnail();
    } else if (thumbnailMode === 'onDelayedHover') {
        hoverTimeoutRef.current = setTimeout(() => {
            fetchThumbnail();
        }, 500); // 500ms bekle
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
    }
  };

  // Focus the input when renaming starts
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      
      const input = renameInputRef.current;
      const value = input.value;
      const lastDotIndex = value.lastIndexOf('.');
      
      // If there is an extension, select only the name part
      if (lastDotIndex > 0) {
        input.setSelectionRange(0, lastDotIndex);
      } else {
        // Otherwise, select the whole text
        input.select();
      }
    }
  }, [isRenaming]);
  
  const handleRenameSubmit = () => {
    if (renameValue && renameValue !== file.basename) {
      onRename(file, renameValue);
    }
    onRenameEnd(); // Notify parent that renaming is done
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setRenameValue(file.basename); // Revert changes
      onRenameEnd(); // Notify parent
    }
  };

  // Cleanup the object URL and abort any ongoing requests when the component unmounts
  useEffect(() => {
    return () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        if (thumbnailUrl) {
            URL.revokeObjectURL(thumbnailUrl);
        }
    };
  }, [thumbnailUrl]);

  return (
    <div 
      className={`${styles.fileItem} ${isRenaming ? styles.renaming : ''}`}
      onClick={() => !isRenaming && handleItemClick(file)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(e) => onContextMenu(e, file)}
    >
      <div className={styles.fileIcon}>
          {getFileIcon(file, styles, thumbnailUrl)}
      </div>
      <div className={styles.fileName} title={file.basename}>
        {isRenaming ? (
          <input
            ref={renameInputRef}
            type="text"
            value={renameValue}
            className={styles.renameInput}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={handleRenameKeyDown}
            onBlur={handleRenameSubmit} // Save when focus is lost
            onClick={(e) => e.stopPropagation()} // Prevent item click
          />
        ) : (
          file.basename
        )}
      </div>
      {file.type !== 'directory' && (
        <div className={styles.fileSize}>
          {formatFileSize(file.size)}
        </div>
      )}
    </div>
  );
} 