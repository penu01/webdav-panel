import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from '@context/ThemeContext';

export default function QuizResults() {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    try {
      const storedResults = localStorage.getItem('quizResults');
      if (storedResults) {
        setResults(JSON.parse(storedResults));
      }
    } catch {
      // Handle error silently or show user-friendly message
      setResults([]);
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    return 'poor';
  };

  const getScoreEmoji = (percentage) => {
    if (percentage >= 80) return '🏆';
    if (percentage >= 60) return '👍';
    return '📚';
  };

  const getScoreText = (percentage) => {
    if (percentage >= 80) return 'MÜKEMMEL!';
    if (percentage >= 60) return 'İYİ!';
    return 'ÇALIŞMANIZ GEREKİYOR!';
  };

  const clearResults = () => {
    if (confirm('Tüm sonuçları silmek istediğinizden emin misiniz?')) {
      localStorage.removeItem('quizResults');
      setResults([]);
      setSelectedResult(null);
      setShowDetails(false);
    }
  };

  return (
    <>
      <Head>
        <title>Quiz Sonuçları - WebDAV Panel</title>
      </Head>
      
      <div className={`quiz-results-container ${theme}-theme`}>
        <div className="quiz-results-content">
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
          <div className="quiz-results-header">
            <Link href="/quiz" className="quiz-back-link">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quiz Ana Sayfasına Dön
            </Link>
            
            <h1 className="quiz-results-title">
              📊 Quiz Sonuçları
            </h1>
            <p className="quiz-results-subtitle">
              Önceki quiz sonuçlarınızı görüntüleyin
            </p>
          </div>

          {results.length === 0 ? (
            <div className="quiz-results-empty">
              <div className="quiz-results-empty-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="quiz-results-empty-title">Henüz Sonuç Yok</h3>
              <p className="quiz-results-empty-text">
                İlk quiz&apos;inizi tamamladığınızda sonuçlarınız burada görünecek.
              </p>
              <Link 
                href="/quiz"
                className="quiz-new-button"
              >
                Quiz&apos;e Başla
              </Link>
            </div>
          ) : (
            <>
              {/* Results List */}
              <div className="quiz-results-list">
                {results.map((result, index) => (
                  <div key={result.id} className="quiz-result-card">
                    <div className="quiz-result-header">
                      <div className="quiz-result-info">
                        <div className="quiz-result-emoji">
                          {getScoreEmoji(result.percentage)}
                        </div>
                        <div>
                          <h3 className="quiz-result-title">
                            Quiz #{results.length - index}
                          </h3>
                          <p className="quiz-result-date">
                            {formatDate(result.date)}
                          </p>
                        </div>
                      </div>
                      <div className="quiz-result-score">
                        <div className={`quiz-result-score-value ${getScoreColor(result.percentage)}`}>
                          {result.score}/{result.maxScore}
                        </div>
                        <div className="quiz-result-percentage">
                          %{result.percentage}
                        </div>
                      </div>
                    </div>
                    
                    <div className="quiz-result-stats">
                      <div className="quiz-result-stat">
                        <div className="quiz-result-stat-value blue">{result.totalQuestions}</div>
                        <div className="quiz-result-stat-label">Toplam Soru</div>
                      </div>
                      <div className="quiz-result-stat">
                        <div className="quiz-result-stat-value green">{result.normalQuestions}</div>
                        <div className="quiz-result-stat-label">Normal Soru</div>
                      </div>
                      <div className="quiz-result-stat">
                        <div className="quiz-result-stat-value purple">{result.bonusQuestions}</div>
                        <div className="quiz-result-stat-label">Ek Soru</div>
                      </div>
                      <div className="quiz-result-stat">
                        <div className="quiz-result-stat-value orange">{formatDuration(result.duration)}</div>
                        <div className="quiz-result-stat-label">Süre</div>
                      </div>
                    </div>
                    
                    <div className="quiz-result-status">
                      <div className={`quiz-result-status-text ${getScoreColor(result.percentage)}`}>
                        {getScoreText(result.percentage)}
                      </div>
                    </div>
                    
                    <div className="quiz-result-actions">
                      <button
                        onClick={() => {
                          setSelectedResult(result);
                          setShowDetails(!showDetails);
                        }}
                        className="quiz-result-details-button"
                      >
                        {showDetails && selectedResult?.id === result.id ? 'Detayları Gizle' : 'Detayları Göster'}
                      </button>
                    </div>
                    
                    {/* Detailed Results */}
                    {showDetails && selectedResult?.id === result.id && (
                      <div className="quiz-result-details">
                        <h4 className="quiz-result-details-title">Soru Detayları:</h4>
                        <div className="quiz-result-details-list">
                          {result.answers.map((answer, idx) => (
                            <div key={idx} className="quiz-result-detail-item">
                              <div className="quiz-result-detail-info">
                                <span className={`quiz-result-detail-status ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                                  {answer.isCorrect ? '✅' : '❌'}
                                </span>
                                <span className="quiz-result-detail-question">
                                  Soru {answer.questionNumber}
                                </span>
                                {answer.isBonus && (
                                  <span className="quiz-result-detail-bonus">
                                    EK SORU
                                  </span>
                                )}
                              </div>
                              <div className="quiz-result-detail-answers">
                                Sizin: <span className="quiz-result-detail-answer">{answer.userAnswer}</span> | 
                                Doğru: <span className="quiz-result-detail-answer">{answer.correctAnswer}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Actions */}
              <div className="quiz-actions-buttons">
                <button
                  onClick={clearResults}
                  className="quiz-clear-button"
                >
                  Tüm Sonuçları Sil
                </button>
                <Link 
                  href="/quiz"
                  className="quiz-new-button"
                >
                  Quiz&apos;e Başla
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
} 