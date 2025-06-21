import { useEffect, useRef } from 'react';
import styles from './ContextMenu.module.css';

export default function ContextMenu({ x, y, items, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{ top: y, left: x }}
    >
      <ul>
        {items.map((item, index) => (
          !item.hidden && (
            <li
              key={index}
              className={`${styles.menuItem} ${item.isSeparator ? styles.separator : ''} ${item.disabled ? styles.disabled : ''}`}
              onClick={(e) => {
                if (!item.disabled && !item.isSeparator) {
                  e.stopPropagation();
                  item.onClick();
                  onClose();
                }
              }}
            >
              {item.isSeparator ? null : (
                <>
                  {item.icon && <span className={styles.icon}>{item.icon}</span>}
                  <span>{item.label}</span>
                </>
              )}
            </li>
          )
        ))}
      </ul>
    </div>
  );
} 