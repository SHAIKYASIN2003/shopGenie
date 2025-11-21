import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { getShoppingAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: 'Hi! I\'m ShopGenie. Looking for a specific gift or need a recommendation?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    const history = messages.map(m => `${m.role}: ${m.text}`);
    const response = await getShoppingAdvice(userMsg.text, history);

    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: response };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-indigo-100 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold">ShopGenie AI</h3>
        </div>
        <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-200' : 'bg-indigo-100 text-indigo-600'}`}>
                {msg.role === 'user' ? <UserIcon className="w-5 h-5 text-gray-600" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-3 rounded-xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="flex gap-2 bg-white p-3 rounded-xl border border-gray-200 shadow-sm items-center">
               <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
               <span className="text-xs text-gray-500">Thinking...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for recommendations..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !query.trim()}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
