import { useState, useEffect } from 'react';
import { onAuthChange, logoutUser } from './firebase'; // Add logoutUser to the import
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

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

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
        <h1>RAG Summarizer</h1>     
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
        <div className="user-info">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      
     

      <main className="app-main">
        {activeTab === 'chat' && <ChatBox user={user} />}
        {activeTab === 'history' && <History user={user} />}
      </main>
    </div>
  );
}

export default App;