import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import WebDAVPanel from '@components/WebDAVPanel';
import FileViewer from '@components/FileViewer';
import { useTheme } from '@context/ThemeContext';

export default function FilesPage() {
  const [client, setClient] = useState(null);
  const [connectionInfo, setConnectionInfo] = useState(null);
  const [viewingFile, setViewingFile] = useState(null);
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Session storage'dan bağlantı bilgilerini yükle
    const storedConnection = sessionStorage.getItem('webdav_connection');
    if (storedConnection) {
      const connectionData = JSON.parse(storedConnection);
      setClient(connectionData);
      setConnectionInfo(connectionData);
    } else if (router.isReady) {
      // Oturum açılmamışsa ve router hazırsa, giriş sayfasına yönlendir
      router.replace('/');
    }
  }, [router.isReady, router]);

  // Logic to open file viewer based on URL query
  useEffect(() => {
    if (!router.isReady) return; // Wait for router to be ready

    const { view: fileToViewName } = router.query;
    if (fileToViewName && client) {
      const path = router.query.slug ? `/${router.query.slug.join('/')}` : '/';
      const fullPath = `${path === '/' ? '' : path}/${fileToViewName}`;
      
      // Set the file object directly without making an API call
      setViewingFile({
          basename: fileToViewName,
          filename: fullPath
      });
    } else if (!fileToViewName) {
      setViewingFile(null);
    }
  }, [router.isReady, router.query, client]);

  const handleDisconnect = () => {
    setClient(null);
    setConnectionInfo(null);
    sessionStorage.removeItem('webdav_connection');
    router.push('/');
  };

  const handlePathChange = (newPath) => {
    router.push(`/files${newPath}`);
  };

  const handleFileClick = (file) => {
    const isImage = (/\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/i).test(file.basename);
    const isText = (/\.(txt|md|json|xml|html|css|js|log|ini|cfg|py|sh|bat)$/i).test(file.basename);

    if (isImage || isText) {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, view: file.basename },
        }, undefined, { shallow: true });
    } else {
        // Handle other file types, e.g., download
        // Maybe trigger download here directly as a fallback
    }
  };

  const handleCloseViewer = () => {
      const query = { ...router.query };
      delete query.view;
      router.push({
          pathname: router.pathname,
          query: query,
      }, undefined, { shallow: true });
  };
  
    const handleDelete = async (filePath) => {
        if (window.confirm(`Are you sure you want to delete ${filePath.split('/').pop()}?`)) {
            try {
                const response = await fetch('/api/webdav/file-handler?action=delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...client, path: filePath })
                });
                if (!response.ok) throw new Error('Delete failed');
                handleCloseViewer();
                router.reload(); // Easiest way to refresh file list
            } catch (err) {
                alert(err.message);
            }
        }
    };
    
    const handleRename = async (file, newName) => {
        const oldPath = file.filename;
        const parentPath = oldPath.substring(0, oldPath.lastIndexOf('/'));
        const newPath = `${parentPath}/${newName}`;

        try {
            const response = await fetch('/api/webdav/file-handler?action=rename', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ client, oldPath, newPath })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Rename failed.');
            }
            
            handleCloseViewer();
            router.reload(); // Easiest way to refresh
            
        } catch(err) {
            console.error(err);
            alert(err.message);
        }
    };

  const { slug } = router.query;
  const currentPath = slug ? `/${slug.join('/')}` : '/';
  
  // Oturum bilgisi veya router hazır değilse bir yükleme ekranı göster
  if (!client || !router.isReady) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            Yükleniyor...
        </div>
    );
  }

  return (
    <div className={`container ${theme}-theme`}>
      <Head>
        <title>WebDAV Panel - {currentPath}</title>
        <meta name="description" content="WebDAV Panel" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main>
        <WebDAVPanel
            client={client}
            onDisconnect={handleDisconnect}
            connectionInfo={connectionInfo}
            path={currentPath}
            onPathChange={handlePathChange}
            onFileClick={handleFileClick}
        />
        {viewingFile && (
            <FileViewer
                file={viewingFile}
                client={client}
                onClose={handleCloseViewer}
                onDelete={handleDelete}
                onRename={handleRename}
            />
        )}
      </main>
    </div>
  );
}
