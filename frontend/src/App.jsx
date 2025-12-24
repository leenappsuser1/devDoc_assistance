import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';

function App() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm your Dev Docs assistant. Ask me anything about the documentation." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = question.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!response.ok) throw new Error('Failed to get answer');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'error',
        text: "Sorry, I encountered an error while processing your request. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="flex items-center gap-3 mb-6 animate-fade-in">
        <div className="p-3 bg-linear-to-br from-emerald-400 to-cyan-500 rounded-2xl shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-400 to-cyan-400">
            DevDocs Assistant
          </h1>
          <p className="text-slate-400 text-sm">Powered by AI & Vector Search</p>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${msg.role === 'user'
                ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30'
                : msg.role === 'error'
                  ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                }`}>
                {msg.role === 'user' ? <User size={20} /> : msg.role === 'error' ? <AlertCircle size={20} /> : <Bot size={20} />}
              </div>

              <div className={`max-w-[80%] p-4 rounded-2xl leading-relaxed ${msg.role === 'user'
                ? 'bg-blue-600/10 border border-blue-500/20 text-blue-50 rounded-tr-none'
                : msg.role === 'error'
                  ? 'bg-red-600/10 border border-red-500/20 text-red-100 rounded-tl-none'
                  : 'bg-white/5 border border-white/10 text-slate-100 rounded-tl-none'
                }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <Bot size={20} />
              </div>
              <div className="flex gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-none">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the docs..."
              className="w-full pl-6 pr-14 py-4 rounded-2xl glass-input bg-slate-900/50 text-white placeholder-slate-400 outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="absolute right-2 p-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95"
            >
              <Send size={20} />
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-xs text-slate-500">AI responses can be inaccurate. Please verify important information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
