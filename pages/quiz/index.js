import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from '@context/ThemeContext';

export default function QuizIndex() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0
  });
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // LocalStorage'dan quiz istatistiklerini al
    try {
      const storedResults = localStorage.getItem('quizResults');
      if (storedResults) {
        const results = JSON.parse(storedResults);
        const totalQuizzes = results.length;
        const averageScore = totalQuizzes > 0 
          ? Math.round(results.reduce((sum, result) => sum + result.percentage, 0) / totalQuizzes)
          : 0;
        const bestScore = totalQuizzes > 0 
          ? Math.max(...results.map(result => result.percentage))
          : 0;

        setStats({ totalQuizzes, averageScore, bestScore });
      }
    } catch {
      // Handle error silently
    }
  }, []);

  return (
    <>
      <Head>
        <title>Quiz - WebDAV Panel</title>
      </Head>
      
      <div className={`quiz-container ${theme}-theme`}>
        <div className="quiz-content">
          {/* Theme Toggle Button */}
          <div className="quiz-theme-toggle">
            <button
              onClick={() => toggleTheme(theme === 'light' ? 'dark' : 'light')}
              className="theme-toggle-button"
              title={theme === 'light' ? 'Karanlık temaya geç' : 'Aydınlık temaya geç'}
            >
              {theme === 'light' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Header */}
          <div className="quiz-header">
            <Link href="/" className="quiz-back-link">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ana Sayfaya Dön
            </Link>
            
            <h1 className="quiz-title">
              🚇 Toplu Ulaşım Sistemleri Quiz
            </h1>
            <p className="quiz-subtitle">
              2 Temmuz sınavınıza hazırlık için hazırlanmıştır!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="quiz-cards">
            <div className="quiz-card blue">
              <div className="quiz-card-icon">📊</div>
              <div className="quiz-card-title">Toplam Quiz</div>
              <div className="quiz-card-value">{stats.totalQuizzes}</div>
              <div className="quiz-card-subtitle">Tamamlanan quiz sayısı</div>
            </div>
            
            <div className="quiz-card green">
              <div className="quiz-card-icon">🎯</div>
              <div className="quiz-card-title">Ortalama Puan</div>
              <div className="quiz-card-value">%{stats.averageScore}</div>
              <div className="quiz-card-subtitle">Tüm quizlerin ortalaması</div>
            </div>
            
            <div className="quiz-card purple">
              <div className="quiz-card-icon">🏆</div>
              <div className="quiz-card-title">En İyi Puan</div>
              <div className="quiz-card-value">%{stats.bestScore}</div>
              <div className="quiz-card-subtitle">En yüksek quiz puanı</div>
            </div>
          </div>

          {/* Rules */}
          <div className="quiz-rules">
            <h2 className="quiz-rules-title">📋 Quiz Kuralları</h2>
            <div className="quiz-rules-grid">
              <ul className="quiz-rules-list">
                <li>Toplam 27 soru (25 normal + 2 ek soru)</li>
                <li>Her normal soru 4 puan değerindedir</li>
                <li>Ek sorular puan eklemez (sadece bilgi amaçlı)</li>
                <li>Maksimum puan: 100</li>
              </ul>
              <ul className="quiz-rules-list">
                <li>Sorular ve şıklar her quiz'de karıştırılır</li>
                <li>Her quiz'de farklı 2 soru bonus olur</li>
                <li>Sonuçlarınız otomatik olarak kaydedilir</li>
                <li>İstediğiniz kadar tekrar edebilirsiniz</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="quiz-actions">
            <Link href="/quiz/test" className="quiz-start-button">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quiz&apos;e Başla
            </Link>
            
            <Link href="/quiz/results" className="quiz-results-link">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Sonuçları Görüntüle
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 