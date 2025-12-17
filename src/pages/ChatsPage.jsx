import React, { useState, useEffect } from 'react';
import { MessageCircle, Search, MoreVertical, Camera, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { obtenerConversaciones } from '../services/chatService';
import BottomNavigation from '../components/comunes/BottomNavigation';

export default function ChatsPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      cargarConversaciones();
    }
  }, [user?.uid]);

  const cargarConversaciones = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      const conversacionesData = await obtenerConversaciones(user.uid);
      setConversations(conversacionesData);
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="text-white" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Inicia sesión para chatear
          </h2>
          <p className="text-gray-600 mb-6">
            Necesitas una cuenta para acceder a tus conversaciones
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const messageTime = timestamp.toDate();
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando conversaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="text-gray-600" size={20} />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <MessageCircle className="text-gray-300 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No se encontraron conversaciones' : 'No tienes conversaciones'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Intenta con otro término de búsqueda'
                : 'Cuando tengas un match, podrás empezar a chatear aquí'
              }
            </p>
            {!searchQuery && (
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold">
                Encontrar matches
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {/* Profile Photo */}
                  <div className="relative">
                    <img
                      src={conversation.otherUser.fotoUrl}
                      alt={conversation.otherUser.nombre}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {conversation.otherUser.enLinea && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.otherUser.nombre}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatLastMessageTime(conversation.ultimoMensaje?.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600 text-sm truncate flex-1">
                        {conversation.ultimoMensaje?.tipo === 'imagen' ? (
                          <span className="flex items-center gap-1">
                            <Camera size={14} />
                            Foto
                          </span>
                        ) : (
                          conversation.ultimoMensaje?.texto || 'Nuevo match'
                        )}
                      </p>
                      
                      {/* Unread indicator */}
                      {conversation.noLeidos > 0 && (
                        <div className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {conversation.noLeidos > 9 ? '9+' : conversation.noLeidos}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match indicator for new matches */}
                {conversation.esNuevoMatch && (
                  <div className="mt-3 flex items-center gap-2 text-pink-500 text-sm">
                    <Heart size={14} />
                    <span>¡Nuevo match! Di hola</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}