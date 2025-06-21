import { useState, useEffect } from 'react';
import { FaFolder, FaFolderOpen, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import styles from './Explorer.module.css';

const TreeNode = ({ node, onNavigate, currentPath }) => {
    // a node is open if the current path starts with the node's path
    // but we also want to maintain the open/closed state locally
    const [isOpen, setIsOpen] = useState(currentPath.startsWith(node.filename));

    // When the current path changes, re-evaluate if this node should be open
    useEffect(() => {
        setIsOpen(currentPath.startsWith(node.filename));
    }, [currentPath, node.filename]);

    const isSelected = currentPath === node.filename;
    
    // hasChildren should be true if the children array exists and has items
    const hasChildren = node.children && node.children.length > 0;

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleNavigate = (e) => {
        e.stopPropagation();
        onNavigate(node);
        if (!hasChildren) {
             setIsOpen(false);
        } else {
             setIsOpen(true);
        }
    };

    return (
        <div className={styles.treeNode}>
            <div 
                className={`${styles.nodeLabel} ${isSelected ? styles.selected : ''}`}
                onClick={handleNavigate}
            >
                <span className={styles.chevron} onClick={hasChildren ? handleToggle : undefined}>
                    {hasChildren && (
                        isOpen ? <FaChevronDown /> : <FaChevronRight />
                    )}
                </span>
                <span className={styles.folderIcon}>
                    {isOpen && hasChildren ? <FaFolderOpen /> : <FaFolder />}
                </span>
                <span className={styles.nodeName}>{node.basename}</span>
            </div>
            {isOpen && hasChildren && (
                <div className={styles.children}>
                    {node.children.map(child => (
                        <TreeNode 
                            key={child.filename} 
                            node={child} 
                            onNavigate={onNavigate} 
                            currentPath={currentPath}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function Explorer({ files, onNavigate, currentPath, onTreeUpdate }) {
    // The 'files' prop is now assumed to be a pre-built hierarchical tree
    const fileTree = files;

    useEffect(() => {
        if (onTreeUpdate) {
            onTreeUpdate(fileTree);
        }
    }, [fileTree, onTreeUpdate]);

    return (
        <div className={styles.explorer}>
            <h2 className={styles.title}>Your Files</h2>
            <div className={styles.treeContainer}>
                {fileTree.map(node => (
                    <TreeNode 
                        key={node.filename} 
                        node={node} 
                        onNavigate={onNavigate}
                        currentPath={currentPath}
                    />
                ))}
            </div>
        </div>
    );
} 