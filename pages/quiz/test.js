import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from '@context/ThemeContext';
import quizQuestions from '../../quiz/data/quiz-questions.json';

export default function QuizTest() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeStarted, setTimeStarted] = useState(null);

  useEffect(() => {
    // Soruları karıştır ve rastgele 2 tanesini bonus yap
    const questionsCopy = [...quizQuestions];
    
    // Rastgele 2 soru seç ve bonus yap
    const randomIndices = [];
    while (randomIndices.length < 2) {
      const randomIndex = Math.floor(Math.random() * questionsCopy.length);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
    
    // Seçilen soruları bonus yap
    questionsCopy.forEach((question, index) => {
      question.is_bonus = randomIndices.includes(index);
    });
    
    // Soruları karıştır
    const shuffled = questionsCopy.sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setTimeStarted(new Date());
    
    // İlk sorunun şıklarını karıştır
    if (shuffled.length > 0) {
      const options = [...shuffled[0].options];
      const correctIndex = shuffled[0].options.indexOf(
        shuffled[0].options[ord(shuffled[0].correct) - 65]
      );
      const correctOption = shuffled[0].options[correctIndex];
      const shuffledOpts = options.sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffledOpts);
    }
  }, []);

  useEffect(() => {
    if (shuffledQuestions.length > 0 && currentQuestionIndex < shuffledQuestions.length) {
      const currentQuestion = shuffledQuestions[currentQuestionIndex];
      const options = [...currentQuestion.options];
      const shuffledOpts = options.sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffledOpts);
      setShowExplanation(false);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [currentQuestionIndex, shuffledQuestions]);

  const ord = (str) => str.charCodeAt(0);

  const getCorrectLetter = (question, shuffledOpts) => {
    const correctOption = question.options[ord(question.correct) - 65];
    return String.fromCharCode(65 + shuffledOpts.indexOf(correctOption));
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const correctLetter = getCorrectLetter(currentQuestion, shuffledOptions);
    const isCorrect = answer === correctLetter;
    
    if (isCorrect && !currentQuestion.is_bonus) {
      setScore(score + 4);
    }
    
    setUserAnswers([...userAnswers, {
      questionId: currentQuestion.id,
      questionNumber: currentQuestionIndex + 1,
      userAnswer: answer,
      correctAnswer: correctLetter,
      isCorrect,
      isBonus: currentQuestion.is_bonus,
      explanation: currentQuestion.explanation
    }]);
    
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz bitti, sonuçları kaydet ve sonuç sayfasına git
      const timeEnded = new Date();
      const duration = Math.round((timeEnded - timeStarted) / 1000);
      
      const quizResult = {
        id: Date.now(),
        date: new Date().toISOString(),
        duration,
        score,
        maxScore: 100,
        totalQuestions: shuffledQuestions.length,
        normalQuestions: shuffledQuestions.filter(q => !q.is_bonus).length,
        bonusQuestions: shuffledQuestions.filter(q => q.is_bonus).length,
        answers: userAnswers,
        percentage: Math.round((score / 100) * 100)
      };
      
      // LocalStorage'a kaydet
      const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
      existingResults.unshift(quizResult);
      localStorage.setItem('quizResults', JSON.stringify(existingResults));
      
      // Sonuç sayfasına yönlendir
      router.push('/quiz/results');
    }
  };

  if (shuffledQuestions.length === 0) {
    return (
      <div className="quiz-loading">
        <div className="quiz-loading-spinner"></div>
        <p>Quiz yükleniyor...</p>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  return (
    <>
      <Head>
        <title>Quiz Test - WebDAV Panel</title>
      </Head>
      
      <div className={`quiz-test-container ${theme}-theme`}>
        <div className="quiz-test-content">
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
            <Link href="/quiz" className="quiz-back-link">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quiz Ana Sayfasına Dön
            </Link>
            
            <div className="quiz-header-info">
              <h1 className="quiz-title">
                Soru {currentQuestionIndex + 1} / {shuffledQuestions.length}
              </h1>
              <div className="quiz-score">
                <div className="quiz-score-value">
                  Puan: {score}/100
                </div>
                <div className="quiz-score-type">
                  {currentQuestion.is_bonus ? '🎁 Ek Soru' : '📝 Normal Soru'}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="quiz-progress">
              <div 
                className="quiz-progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="quiz-question-card">
            <div className="quiz-question-content">
              <h2 className="quiz-question-text">
                {currentQuestion.question}
              </h2>
              
              <div className="quiz-options">
                {shuffledOptions.map((option, index) => {
                  const letter = String.fromCharCode(65 + index);
                  const isSelected = selectedAnswer === letter;
                  const correctLetter = getCorrectLetter(currentQuestion, shuffledOptions);
                  const isCorrect = letter === correctLetter;
                  
                  let optionClass = "quiz-option";
                  
                  if (isAnswered) {
                    if (isCorrect) {
                      optionClass += " correct";
                    } else if (isSelected) {
                      optionClass += " incorrect";
                    }
                  } else if (isSelected) {
                    optionClass += " selected";
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(letter)}
                      disabled={isAnswered}
                      className={optionClass}
                    >
                      <span className="quiz-option-letter">{letter})</span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="quiz-explanation">
                <div className="quiz-explanation-content">
                  <h3 className="quiz-explanation-title">
                    {selectedAnswer === getCorrectLetter(currentQuestion, shuffledOptions) ? '✅ Doğru!' : '❌ Yanlış!'}
                  </h3>
                  <p className="quiz-explanation-text">
                    <strong>Açıklama:</strong> {currentQuestion.explanation}
                  </p>
                  {selectedAnswer !== getCorrectLetter(currentQuestion, shuffledOptions) && (
                    <p className="quiz-explanation-text">
                      <strong>Doğru cevap:</strong> {getCorrectLetter(currentQuestion, shuffledOptions)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          {showExplanation && (
            <div className="quiz-actions">
              <button
                onClick={handleNextQuestion}
                className="quiz-next-button"
              >
                {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Sonraki Soru' : 'Sonuçları Görüntüle'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 