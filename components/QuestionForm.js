import { useState, useRef, useEffect } from 'react';
import styles from './QuestionForm.module.css';

export default function QuestionForm() {
  const [question, setQuestion] = useState('');
  const [qaList, setQaList] = useState([]); // store multiple Q&A pairs
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSubmit = async () => {
    if (!question.trim()) return alert('Please enter a question.');

    const currentQuestion = question.trim();
    setIsLoading(true);
    setQuestion(''); // clear textbox immediately

    const fileId = localStorage.getItem('fileId'); // use latest uploaded file
    if (!fileId) {
      alert('Please upload a PDF first.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/askQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: currentQuestion, fileId }), // include fileId
      });

      const data = await response.json();

      const newQA = {
        question: currentQuestion,
        answer: response.ok
          ? data.answer
          : `❌ ${data.error || 'Error retrieving answer.'}`,
      };

      // append to list
      setQaList((prev) => [...prev, newQA]);
    } catch (error) {
      setQaList((prev) => [
        ...prev,
        { question: currentQuestion, answer: '❌ Error asking the question.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // auto-scroll when new Q&A added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [qaList]);

  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>Ask a Question</h2>

      {/* input box for new question */}
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="💬 Type your question about the PDF here..."
        rows={3}
        className={styles.textarea}
      />

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={styles.button}>
        {isLoading ? (
          <>
            <span className={styles.spinner}></span> Getting Answer...
          </>
        ) : (
          '💬 Ask Question'
        )}
      </button>

      {/* Q&A history - scrollable */}
      <div
        style={{
          marginTop: '1.5rem',
          textAlign: 'left',
          maxHeight: '300px', // fixed height
          overflowY: 'auto', // scroll when too long
          paddingRight: '0.5rem',
        }}
      >
        {qaList.map((qa, idx) => (
          <div
            key={idx}
            className={`${styles.answerBox} ${
              qa.answer.startsWith('❌')
                ? styles.answerError
                : styles.answerSuccess
            }`}
            style={{ marginBottom: '1rem' }}
          >
            <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
              Q{idx + 1}: {qa.question}
            </p>
            <p>
              <strong>Answer:</strong> {qa.answer}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}
