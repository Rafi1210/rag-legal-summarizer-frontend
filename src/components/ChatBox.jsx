import { useState } from 'react';
import axios from 'axios';

function ChatBox({ user }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      // Get the user's ID token
      const idToken = await user.getIdToken();

      // Make request to backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ask`,
        { question },
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setAnswer(response.data.answer);
      setQuestion(''); // Clear input after successful query
    } catch (err) {
      console.error('Error asking question:', err);
      setError(err.response?.data?.error || 'Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <form onSubmit={handleAsk} className="question-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            className="question-input"
          />
          <button type="submit" disabled={loading || !question.trim()}>
            {loading ? 'Searching...' : 'Ask'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-box">
          <strong>Error:</strong> {error}
        </div>
      )}

      {answer && (
        <div className="answer-box">
          <h3>Answer:</h3>
          <div className="answer-content">
            {answer.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Searching knowledge base...</p>
        </div>
      )}
    </div>
  );
}

export default ChatBox;