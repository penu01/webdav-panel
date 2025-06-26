import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LoginScreen from '@components/LoginScreen';
import { useTheme } from '@context/ThemeContext';

export default function LoginPage() {
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Zaten bir oturum varsa, doğrudan dosya yöneticisine yönlendir
    const storedConnection = sessionStorage.getItem('webdav_connection');
    if (storedConnection) {
      router.replace('/files');
    }
  }, [router]);

  const handleConnect = async (url, username, password) => {
      try {
        const clientData = { url, username, password };
        const response = await fetch('/api/webdav/file-handler?action=connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Bağlantı hatası: ${response.status}`);
        }
        
        sessionStorage.setItem('webdav_connection', JSON.stringify(clientData));
        localStorage.setItem('webdav_last_connection', JSON.stringify({ url, username }));

        router.push('/files');

      } catch (error) {
        setError('Bağlantı başarısız. Lütfen bilgilerinizi kontrol edin.');
        setIsLoading(false);
      }
  };

  return (
    <div className={`container ${theme}-theme`}>
      <Head>
        <title>WebDAV Panel - Giriş</title>
        <meta name="description" content="WebDAV Panel" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main>
        <LoginScreen onConnect={handleConnect} />
      </main>
    </div>
  );
} 