import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { createChatSession, sendMessageToChat } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Chat } from '@google/genai';

export const MentorChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'model',
      text: 'Chào bạn trẻ! Ta là Người Dẫn Đường. Bạn đang trăn trở điều gì về con đường lập nghiệp hay học tập của mình? Hãy chia sẻ, ta sẽ cùng bạn tìm lời giải dựa trên những bài học của cha ông.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session
  useEffect(() => {
    try {
      const session = createChatSession();
      setChatSession(session);
    } catch (e) {
      console.error("Failed to init chat", e);
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'model',
        text: 'Hiện tại kết nối tri thức đang gặp gián đoạn (Thiếu API Key).',
        timestamp: new Date()
      }]);
    }
  }, []);

  const scrollToBottom = () => {
    // Add a small delay to ensure DOM is updated (especially with Markdown rendering)
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToChat(chatSession, userMsg.text);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-xl overflow-hidden border border-parchment-dark">
      <div className="bg-vn-red p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-md z-10 shrink-0">
        <div className="bg-vn-gold p-1.5 sm:p-2 rounded-full">
          <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-vn-red" />
        </div>
        <div>
          <h2 className="text-white font-serif font-bold text-base sm:text-lg">Người Dẫn Đường</h2>
          <p className="text-white/80 text-[10px] sm:text-xs">Tri thức Hồ Chí Minh & Thời đại số</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-parchment/30 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3 sm:p-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-ink border border-parchment-dark rounded-bl-none'
              }`}
            >
              {msg.role === 'model' ? (
                 <div className="prose prose-sm max-w-none text-ink prose-p:leading-relaxed prose-li:marker:text-vn-red prose-headings:text-ink prose-p:text-sm sm:prose-p:text-base">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                 </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm sm:text-base">{msg.text}</p>
              )}
              <span className={`text-[9px] sm:text-[10px] block mt-1.5 sm:mt-2 opacity-70 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 sm:p-4 rounded-2xl rounded-bl-none shadow-sm border border-parchment-dark flex items-center gap-2">
              <RefreshCw className="animate-spin text-vn-red w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm text-gray-500 italic">Đang suy ngẫm...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <div className="p-3 sm:p-4 bg-white border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 sm:p-2 rounded-full border border-gray-200 focus-within:border-vn-red focus-within:ring-1 focus-within:ring-vn-red transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Hỏi về khởi nghiệp, học tập, rèn luyện..."
            className="flex-1 bg-transparent px-3 sm:px-4 py-1.5 sm:py-2 outline-none text-ink placeholder-gray-400 text-sm sm:text-base"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-vn-red text-white p-2 sm:p-3 rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
};