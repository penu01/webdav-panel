import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function QuizHome() {
  const [isStarting, setIsStarting] = useState(false);

  const startQuiz = () => {
    setIsStarting(true);
    // Quiz sayfasına yönlendir
    window.location.href = '/quiz/test';
  };

  return (
    <>
      <Head>
        <title>Toplu Ulaşım Quiz - WebDAV Panel</title>
        <meta name="description" content="2 Temmuz sınavına hazırlık quiz sistemi" />
      </Head>
      
      <div className="quiz-container">
        <div className="quiz-content">
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

          {/* Quiz Info Cards */}
          <div className="quiz-cards">
            <div className="quiz-card blue">
              <div className="quiz-card-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="quiz-card-title">Soru Sayısı</h3>
              <p className="quiz-card-value">27 Soru</p>
              <p className="quiz-card-subtitle">25 normal + 2 ek soru</p>
            </div>

            <div className="quiz-card green">
              <div className="quiz-card-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="quiz-card-title">Puan Sistemi</h3>
              <p className="quiz-card-value">100 Puan</p>
              <p className="quiz-card-subtitle">Her normal soru 4 puan</p>
            </div>

            <div className="quiz-card purple">
              <div className="quiz-card-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="quiz-card-title">Süre</h3>
              <p className="quiz-card-value">Sınırsız</p>
              <p className="quiz-card-subtitle">Kendi hızınızda çözün</p>
            </div>
          </div>

          {/* Quiz Rules */}
          <div className="quiz-rules">
            <h2 className="quiz-rules-title">📋 Quiz Kuralları</h2>
            <div className="quiz-rules-grid">
              <ul className="quiz-rules-list">
                <li>Her normal soru 4 puan değerindedir</li>
                <li>2 ek soru puan eklemez</li>
                <li>Şıklar her seferinde karıştırılır</li>
              </ul>
              <ul className="quiz-rules-list">
                <li>Her sorudan sonra açıklama gösterilir</li>
                <li>Sonuçlarınız kaydedilir</li>
                <li>İstediğiniz kadar tekrar edebilirsiniz</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="quiz-actions">
            <button
              onClick={startQuiz}
              disabled={isStarting}
              className="quiz-start-button"
            >
              {isStarting ? (
                <>
                  <div className="quiz-loading-spinner"></div>
                  Quiz Başlatılıyor...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Teste Başla
                </>
              )}
            </button>

            <div>
              <Link 
                href="/quiz/results"
                className="quiz-results-link"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Önceki Sonuçları Görüntüle
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 