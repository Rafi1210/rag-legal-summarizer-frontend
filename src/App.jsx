import { useState, useEffect } from 'react';
import { onAuthChange } from './firebase';
import Login from './components/Login';
import ChatBox from './components/ChatBox';
import History from './components/History';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app">
        <Login />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>RAG Assistant</h1>
        <div className="user-info">
          <span>{user.email}</span>
          <button onClick={() => auth.signOut()}>Logout</button>
        </div>
      </header>
      
      <nav className="tab-nav">
        <button 
          className={activeTab === 'chat' ? 'active' : ''} 
          onClick={() => setActiveTab('chat')}
        >
          Ask Questions
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''} 
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'chat' && <ChatBox user={user} />}
        {activeTab === 'history' && <History user={user} />}
      </main>
    </div>
  );
}

export default App;