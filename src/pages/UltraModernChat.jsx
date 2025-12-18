import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIIcebreakerSuggestions from '../components/chat/AIIcebreakerSuggestions';

export default function UltraModernChat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(true);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Simular carga de chat
    const loadChat = () => {
      // Demo chat data
      const demoOtherUser = {
        id: 'user1',
        nombre: 'Ana',
        edad: 24,
        fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL2aQZeP8CNnH46b0cdS47jSm0jgvmIjShTFLetrpQBMwozFg3EKLPWfWwb29Qwkn-VYI73dqCBkPF6CRMYqORAUApZKcaMcmX01MkvI4K0GrgFmX5iK2ciFmVKV09fiMXVtVxO_jxwB3hmj6x-ICUHzDguWxH3WRhfSfMdFlI-b6YKypdv0rXm5VF77kLZFMpie8neBHyD46aHtz0EnxIttw7n4OnGOvRtPe77Qarg6PoV5ezcZww_y3GdJ_JULEwj_hZE9p9-Dlk',
        enLinea: true
      };

      const demoMessages = [
        {
          id: '1',
          texto: 'Hola! Me encantó tu foto en la playa. ¿Dónde es?',
          senderId: demoOtherUser.id,
          timestamp: new Date(Date.now() - 180000), // 3 min ago
          leido: true
        },
        {
          id: '2',
          texto: 'Hola Ana! Gracias 😊 Es en Samaná.',
          senderId: user?.uid,
          timestamp: new Date(Date.now() - 60000), // 1 min ago
          leido: true
        },
        {
          id: '3',
          texto: '¿Has ido alguna vez?',
          senderId: user?.uid,
          timestamp: new Date(Date.now() - 30000), // 30 sec ago
          leido: false
        }
      ];
      
      setOtherUser(demoOtherUser);
      setMessages(demoMessages);
      
      // Demo user profile for AI suggestions
      setUserProfile({
        nombre: user?.displayName || 'Usuario',
        edad: 25,
        intereses: ['Música', 'Viajes', 'Fotografía']
      });
      
      // Show AI suggestions if this is a new conversation (few messages)
      setShowAISuggestions(demoMessages.length <= 3);
      
      setLoading(false);
    };

    loadChat();
  }, [chatId, user?.uid, user?.displayName]);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      texto: newMessage,
      senderId: user.uid,
      timestamp: new Date(),
      leido: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowAISuggestions(false); // Hide AI suggestions after sending a message
    
    // Simulate typing stop and new message from other user
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDateDivider = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return `Hoy ${formatTime(timestamp)}`;
    }
    
    return messageDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-display bg-white dark:bg-gray-900 text-gray-900 dark:text-white h-screen flex flex-col overflow-hidden">
      
      {/* Header Navigation Bar */}
      <header className="flex-none bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-20 shadow-sm relative">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back & Avatar */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/ultra-chats')}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">chevron_left</span>
            </button>
            
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-full bg-center bg-cover border border-gray-200 dark:border-gray-700"
                  style={{ backgroundImage: `url("${otherUser?.fotoUrl}")` }}
                />
                {otherUser?.enLinea && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                )}
              </div>
              
              <div className="flex flex-col">
                <h2 className="text-base font-bold leading-tight text-gray-900 dark:text-white">
                  {otherUser?.nombre}, {otherUser?.edad}
                </h2>
                <span className="text-xs font-normal text-green-600 dark:text-green-400 leading-none mt-0.5">
                  {otherUser?.enLinea ? 'En línea' : 'Desconectado'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center">
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
              <span className="material-symbols-outlined text-[24px]">more_vert</span>
            </button>
          </div>
        </div>
      </header>

      {/* Chat Stream (Scrollable Area) */}
      <main 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 bg-white dark:bg-gray-900 no-scrollbar"
      >
        {/* Timestamp Divider */}
        <div className="flex justify-center w-full my-4">
          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
            {messages.length > 0 && formatDateDivider(messages[0].timestamp)}
          </span>
        </div>

        {/* Messages */}
        {messages.map((message) => (
          <div key={message.id}>
            {message.senderId === user.uid ? (
              // Sent Message
              <div className="flex items-end gap-2 justify-end group">
                <div className="flex flex-col items-end gap-1 max-w-[75%]">
                  <div className="relative px-4 py-3 bg-gray-900 dark:bg-white rounded-md rounded-br-none text-white dark:text-gray-900 text-[16px] leading-relaxed shadow-sm">
                    {message.texto}
                  </div>
                  <div className="flex items-center gap-1 mr-1">
                    <span className="text-[11px] text-gray-400">{formatTime(message.timestamp)}</span>
                    <span className={`material-symbols-outlined text-[14px] ${
                      message.leido 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`}>
                      {message.leido ? 'done_all' : 'check'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // Received Message
              <div className="flex items-end gap-2 group">
                <div 
                  className="w-8 h-8 rounded-full bg-center bg-cover shrink-0 mb-1"
                  style={{ backgroundImage: `url("${otherUser?.fotoUrl}")` }}
                />
                <div className="flex flex-col items-start gap-1 max-w-[75%]">
                  <div className="relative px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-md rounded-bl-none text-gray-900 dark:text-gray-200 text-[16px] leading-relaxed shadow-sm">
                    {message.texto}
                  </div>
                  <span className="text-[11px] text-gray-400 ml-1">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-end gap-2">
            <div 
              className="w-8 h-8 rounded-full bg-center bg-cover shrink-0 mb-1"
              style={{ backgroundImage: `url("${otherUser?.fotoUrl}")` }}
            />
            <div className="flex flex-col gap-1">
              {/* Visual Bubble */}
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-md rounded-bl-none w-16 h-[46px] flex items-center justify-center gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              {/* Text Meta */}
              <p className="text-gray-400 text-xs font-normal ml-1 animate-pulse">
                {otherUser?.nombre} está escribiendo...
              </p>
            </div>
          </div>
        )}

        {/* Spacer for scrolling comfort */}
        <div className="h-2"></div>
      </main>

      {/* Input Bar (Fixed Bottom) */}
      <footer className="flex-none bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-2 pb-6 px-4">
        <div className="flex items-end gap-3 w-full max-w-4xl mx-auto">
          {/* Add Media/Stickers Button */}
          <button className="flex items-center justify-center w-10 h-10 shrink-0 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors mb-0.5">
            <span className="material-symbols-outlined text-[24px]">add_circle</span>
          </button>

          {/* Input Field Container */}
          <div className="flex-1 relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-full border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-600 transition-all">
            <input 
              className="w-full bg-transparent border-none text-[16px] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-4 py-3 rounded-full focus:ring-0 focus:outline-none"
              placeholder="Escribe un mensaje..."
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className={`flex items-center justify-center p-2 mr-1 transition-colors ${
                showAISuggestions 
                  ? 'text-pink-500' 
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Sugerencias de AI"
            >
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </button>
            <button className="flex items-center justify-center p-2 mr-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px] filled">mood</span>
            </button>
          </div>

          {/* Send Button */}
          <button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`flex items-center justify-center w-11 h-11 shrink-0 rounded-full transition-all mb-0.5 active:scale-95 ${
              newMessage.trim()
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] ml-0.5 filled">send</span>
          </button>
        </div>
      </footer>

      {/* AI Icebreaker Suggestions */}
      <AIIcebreakerSuggestions
        targetProfile={otherUser}
        userProfile={userProfile}
        onSelectIcebreaker={(icebreaker) => {
          setNewMessage(icebreaker);
          setShowAISuggestions(false);
        }}
        isVisible={showAISuggestions}
      />
    </div>
  );
}