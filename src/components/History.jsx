import { useState, useEffect } from 'react';
import axios from 'axios';

function History({ user }) {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');

    try {
      const idToken = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/history`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        }
      );

      setQueries(response.data.queries);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading history...</div>;
  }

  if (error) {
    return <div className="error-box">{error}</div>;
  }

  if (queries.length === 0) {
    return (
      <div className="empty-state">
        <p>No questions asked yet. Start by asking a question in the Chat tab!</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2>Your Question History</h2>
      <div className="history-list">
        {queries.map((query) => (
          <div key={query.id} className="history-item">
            <div className="history-header">
              <span className="history-date">
                {new Date(query.asked_at).toLocaleString()}
              </span>
            </div>
            <div className="history-question">
              <strong>Q:</strong> {query.question}
            </div>
            {query.answer && (
  <div className="history-answer">
    <strong>A:</strong>
    <div className="mt-2 space-y-2">
      {query.answer.split("\n").map((doc, index) => (
        <div key={index} className="p-2 rounded bg-gray-50 border">
          <span>{doc}</span>
        </div>
      ))}
    </div>
  </div>
)}

          </div>
        ))}
      </div>
    </div>
  );
}

export default History;