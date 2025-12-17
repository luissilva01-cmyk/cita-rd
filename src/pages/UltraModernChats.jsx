import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { obtenerConversaciones } from '../services/chatService';
import { obtenerMatches } from '../services/likesService';

export default function UltraModernChats() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados principales
  const [conversations, setConversations] = useState([]);
  const [newMatches, setNewMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar conversaciones y matches
  const loadChatsAndMatches = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      
      // Intentar cargar datos reales, si falla usar datos de prueba
      let userConversations = [];
      let userMatches = [];
      
      try {
        userConversations = await obtenerConversaciones(user.uid);
        userMatches = await obtenerMatches(user.uid);
      } catch (error) {
        console.log('Using demo data:', error);
        
        // Datos de prueba para nuevos matches
        userMatches = [
          {
            id: 'match1',
            nombre: 'Ana',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU0FdvPi49w8ftAPQYEuPwgZpVNpFdmTdu_ZlXHcKkeBVWApDwngRIP5BDGPgLbwIhcB1BNEPPbQ6V8X7FPzi-wBoyHBgF2pzlghNuYJIJ8UTzSDOJZbFrSH8PfRE90u-Zr1G9v87vQBPzRbu07d4o5TGsrzHtD3vzIWpel8SBbsU4AvR5Wnyi1dS2uQ1NLVRH7edG0wTpjvKknHwZe2pJLR5lZrsy8URhX2cgMcnJf_ggJVzDhKYxS8DUsP1Tiu4dq1ZOptEnVGPw',
            tipo: 'superlike',
            esNuevo: true
          },
          {
            id: 'match2',
            nombre: 'Carla',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-OVgdVTpIs52u6Vu46BSXGZAPAglDRIOeW1fM8tnptca13av4pikn-6ZZS-qEoSu73S79g9CUQGRlz9kFV-PNLhqr4WmGZux0-s8TRsmFpOzuqnOsn1oX4Vexw7Twqvd8iM_KHkWjiWoiyaSM4QT02V178QOEn3PMWr-Dh84W4HB5BVMQwWmDwizJGOMxiU6ELMmF8UYQGOZkcAZguVC7lNEnNhpR57nHRSuZCKgRAeZZTgFBIHBuG9jiXXKry3zRFM1ZoCDrzdnO',
            tipo: 'like',
            esNuevo: true
          },
          {
            id: 'match3',
            nombre: 'Sofía',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvc2uAwdO6TvICi7kx1H8uPhUO3XHGekc9PL2qGRvx-zLqRbdiIjCKUZG8lj0sDlJtkDM_tzXaTWNm70o6zHvI7zNb0jyL09TVslikLWP8qGmooQiCaXAj-cZFhsVWE6kHvmh5huP2UHLCWANkMEAqBH8j71lf8ahAAeW1TSmGDh7KUWaRCxMH0cqttQZrJapwwTfrPVKOqxCxv6QYTCQnDZLyBZC17JRmZfPmDsJHjkzGMatlVy1uvFU2PxxfU6grvVkK2UjUFvQR',
            tipo: 'like',
            esNuevo: true
          },
          {
            id: 'match4',
            nombre: 'Lucía',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDaCrbPMV696CUkw8ebIQXIiYJ3LLYELurt4C1CxyCTPlfSDW8B9Zql3U5npUxYG6RIKKdUGV9taM4SU17-SXoTUVZe8mHfs65cLnUtZkmYEZLzg5qKFxSgnJmiTf-9-KiB3uxVPX2_9rD4yRmB0guK6ZjoatG3OVi8lAa6q3r64wUoCcnse2hwToZNj7vmg0F5fS28wczL7_eG1rMmRu2w0BlpL9OFtaSjza_z7UFdpB8PDMSYDp8OjTF-ylSJdXeh0_t5ecWpQ1U',
            tipo: 'like',
            esNuevo: true
          },
          {
            id: 'match5',
            nombre: 'Elena',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgwCx-P8Tyuucp4Dt8RpiZUNen8qOTVqnikL7Csh_wl30Kt6h1Y7HgttM4KZ9idV0FbMXQ7OUEvtKrfZrPZRUOICS3WPbzSc5XhaZ00mraFGzGQ6G3TEim9v_TNd8mCYbJGZF2E0ubkoRp7ueHxVzkGOZmheSHmWAxsyB6sRiGLzrtTHFFLSAgRzl8dNaKSwYhAdANiL3fGDWKcnIjzGK2iJybFE9fMUbhO6CFls9_I4qPliWK2Af4g8afXKO5eJimDhsq9Xo2y95_',
            tipo: 'like',
            esNuevo: true
          }
        ];

        // Datos de prueba para conversaciones
        userConversations = [
          {
            id: 'chat1',
            otherUser: {
              id: 'user1',
              nombre: 'Laura',
              fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW05SBOkbYZF7IUNZxodlWmIpyrQZ2ra2ocPVNxIorDPtLKrMG4xrSZwVpbRGijvGlwzkVm5XUh589_2La2254wzYTR5vil0HFKAszUP59w3UlxwBistYg4ACYYp6hm3s6aXXcRfP92o4KnTGZVGNjUTfrKYz9tg6KN-cEqLMlPP5qjH2gUlcm_OODR2l4V8ASwCSV5Kclgw-lj_U7oueYkZKspccSW5LSH7zSJr5qve6-lIAUZVtje-JqS7rfdSQNXF2HrQ8N0HcV',
              enLinea: true
            },
            ultimoMensaje: {
              texto: 'Me encanta ese lugar! 🍕 ¿Vamos?',
              timestamp: new Date(Date.now() - 300000), // 5 min ago
              leido: false,
              senderId: 'user1'
            },
            noLeidos: 2
          },
          {
            id: 'chat2',
            otherUser: {
              id: 'user2',
              nombre: 'Gabriela',
              fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1SaUaVpUaxhbJ0YFG-rtfcrYfR6LlknlRK3L8za9dRSR_oN67UAe1aRCP5PTxzTNFeAeGSCgiJ0D5VCDJpwBoj6PhMExZttArX3wQnO9ElsrAKvawQb8_Kfttex2uJP1LuR4Sn6tEQcETgjo318AUiWsjckBc_S_1I2yreGvJQaWVhpWgsMf_RuDhkN1IeM-3yseZd3yY62UhUvJf0sroytsdruxbE2fRnTqy657LD3XvIHGmOHwlNRqXAJ01ufw-SeMAlCUcIVL6',
              enLinea: true
            },
            ultimoMensaje: null,
            noLeidos: 0,
            escribiendo: true
          },
          {
            id: 'chat3',
            otherUser: {
              id: 'user3',
              nombre: 'Maria',
              fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN4sJmFu2d0lQUkGXhZ0l5HBVijNla6jOHsAu1mZbSJURuzeMq4pCsDF4GzJCnYzBck9IjxENlMOIkyYY9ZHMagUESRaGmtMY8ShD1Lt2H1k7htEBhaA4VyTGhj6uYeUTzHDYUBG9Ktea7KdjCfJ0t-gq8m6xTC4jzGztrlZz8YasbwxsPl6m6xtywSDEO_3zb59nSopnkHDld0cKvWeBIX66xD3UzLUKac3qZr5sXM4BCK8i1wkg9cnhTaxZm2EFm5C1ldUR4V-o6',
              enLinea: false
            },
            ultimoMensaje: {
              texto: 'Nos vemos el viernes entonces!',
              timestamp: new Date(Date.now() - 86400000), // 1 day ago
              leido: true,
              senderId: 'user3'
            },
            noLeidos: 0
          },
          {
            id: 'chat4',
            otherUser: {
              id: 'user4',
              nombre: 'Andrea',
              fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdxlJ7shtx0Lpb6qG4TwlU2vKHWrns6Iju8H8OuBpKsl7ztMtGi1kPtc0P5pl0Eequ497_tWTUsN1e4g_X_qTR56YYlg2rNu7E34CYd0qR-zJIJOEN8MAQnvQhiegvzJCdU-DwW8FemI3C1KMM8U2L8Bouzt2tU-DS9zVS7HrCglHW2OBRru6vtFn76UGddhjSG3I9iSLP7GuyHxbGcr7uSoDSDRzEVZZcy0V6XZ1yZc2UEpLkz-ttV9M4hBGqYCk0bFpPKsfjzlcq',
              enLinea: false
            },
            ultimoMensaje: {
              texto: 'Jajaja claro que sí 😂',
              timestamp: new Date(Date.now() - 259200000), // 3 days ago
              leido: true,
              senderId: user?.uid
            },
            noLeidos: 0
          },
          {
            id: 'chat5',
            otherUser: {
              id: 'user5',
              nombre: 'Valentina',
              fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJEQcOz_47uR4TcRkVSZ06aJfXHm29ofNigrt-t8X1sjVt7_N5mpPaH9FyJ0oiuIClIKDjdnYyia-_d7LDrK619fd9JVNCS2MtZsJrCoxC66ofxcOIYPV_-5OAycss6tvqgGS00RCQK7ftWrQNOu1nLfttFM48zI9Ez3JECdFefrZpTtBdezyY0HCSuNv-GkmPlrBQiMlIiuqt_hYHZWWBLQnocA3-ny1TVqqFsBFh2kzy-hoKpTlXG-xG-wASgfWAK86RDqJ4kM4J',
              enLinea: false
            },
            ultimoMensaje: {
              texto: 'Te envío la ubicación',
              timestamp: new Date(Date.now() - 432000000), // 5 days ago
              leido: true,
              senderId: 'user5'
            },
            noLeidos: 0
          }
        ];
      }
      
      setNewMatches(userMatches.filter(m => m.esNuevo));
      setConversations(userConversations);
      
    } catch (error) {
      console.error('Error loading chats and matches:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadChatsAndMatches();
  }, [loadChatsAndMatches]);

  // Verificar autenticación
  if (!user) {
    navigate('/login');
    return null;
  }

  // Funciones de utilidad
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return 'Ayer';
    if (days < 7) return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][timestamp.getDay()];
    
    return timestamp.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleMatchClick = (match) => {
    navigate(`/ultra-chat/${[user.uid, match.id].sort().join('_')}`);
  };

  const handleChatClick = (chat) => {
    navigate(`/ultra-chat/${chat.id}`);
  };

  const totalUnreadMessages = conversations.reduce((total, chat) => total + chat.noLeidos, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 font-display text-gray-900 dark:text-white overflow-x-hidden antialiased">
      <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
        
        {/* Top App Bar */}
        <div className="sticky top-0 z-20 flex items-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-tight flex-1">
            Mensajes
          </h2>
          <div className="flex items-center justify-end gap-2">
            <button className="flex items-center justify-center rounded-full h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="material-symbols-outlined text-gray-900 dark:text-white text-2xl">search</span>
            </button>
            <button className="flex items-center justify-center rounded-full h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="material-symbols-outlined text-gray-900 dark:text-white text-2xl">tune</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          
          {/* New Matches Section */}
          {newMatches.length > 0 && (
            <div className="pt-4">
              <div className="flex items-center justify-between px-4 pb-3">
                <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight">
                  Nuevos Matches
                </h3>
                <span className="text-pink-500 text-sm font-semibold">{newMatches.length}</span>
              </div>

              {/* Horizontal Scroll Container */}
              <div className="flex overflow-x-auto gap-4 px-4 pb-4 no-scrollbar snap-x">
                {newMatches.map((match) => (
                  <div 
                    key={match.id}
                    onClick={() => handleMatchClick(match)}
                    className="flex flex-col items-center gap-2 snap-start shrink-0 cursor-pointer"
                  >
                    <div className={`relative p-[3px] rounded-full ${
                      match.tipo === 'superlike' 
                        ? 'bg-gradient-to-tr from-yellow-400 to-amber-600' 
                        : 'bg-pink-500'
                    }`}>
                      <div 
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-16 h-16 border-2 border-white dark:border-gray-800"
                        style={{ backgroundImage: `url("${match.fotoUrl}")` }}
                      />
                      {match.tipo === 'superlike' && (
                        <div className="absolute bottom-0 right-0 bg-yellow-500 rounded-full p-1 border-2 border-white dark:border-gray-800">
                          <span className="material-symbols-outlined text-white text-[10px] font-bold block">star</span>
                        </div>
                      )}
                      {match.tipo === 'like' && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-pink-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <h2 className="text-gray-900 dark:text-white text-sm font-bold leading-tight">
                      {match.nombre}
                    </h2>
                  </div>
                ))}
              </div>
            </div>
          )}

          {newMatches.length > 0 && (
            <div className="h-2 bg-gray-50 dark:bg-gray-900/50"></div>
          )}

          {/* Messages List */}
          <div className="pt-4">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight px-4 pb-2">
              Conversaciones
            </h3>
            
            <div className="flex flex-col">
              {conversations.map((chat) => (
                <div 
                  key={chat.id}
                  onClick={() => handleChatClick(chat)}
                  className={`group flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative ${
                    chat.noLeidos > 0 ? '' : 'opacity-80'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border border-gray-200 dark:border-gray-600"
                      style={{ backgroundImage: `url("${chat.otherUser.fotoUrl}")` }}
                    />
                    {chat.otherUser.enLinea && (
                      <div className="absolute bottom-0 right-1 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-gray-900 dark:text-white text-base font-bold leading-tight">
                        {chat.otherUser.nombre}
                      </h4>
                      <span className={`text-xs font-medium ${
                        chat.escribiendo 
                          ? 'text-pink-500 font-bold' 
                          : chat.noLeidos > 0 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-400'
                      }`}>
                        {chat.escribiendo 
                          ? 'Ahora' 
                          : chat.ultimoMensaje 
                            ? formatTimeAgo(chat.ultimoMensaje.timestamp)
                            : ''
                        }
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      {chat.escribiendo ? (
                        <div className="flex items-center gap-1 text-pink-500 text-sm font-medium">
                          <span className="material-symbols-outlined text-[18px] animate-pulse">more_horiz</span>
                          <span>Escribiendo...</span>
                        </div>
                      ) : chat.ultimoMensaje ? (
                        <>
                          <p className={`text-sm leading-normal truncate ${
                            chat.noLeidos > 0 
                              ? 'text-gray-900 dark:text-gray-200 font-semibold' 
                              : 'text-gray-500 dark:text-gray-400 font-normal'
                          }`}>
                            {chat.ultimoMensaje.texto}
                          </p>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            {chat.noLeidos > 0 ? (
                              <div className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-pink-500 px-1.5">
                                <span className="text-[10px] font-bold text-white">{chat.noLeidos}</span>
                              </div>
                            ) : (
                              <span className={`material-symbols-outlined text-[18px] ${
                                chat.ultimoMensaje.senderId === user.uid 
                                  ? 'text-gray-900 dark:text-white' 
                                  : 'text-gray-300'
                              }`}>
                                done_all
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal truncate">
                          Nuevo match - ¡Saluda!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {conversations.length === 0 && (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-gray-400 text-2xl">chat_bubble_outline</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No tienes conversaciones aún
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Cuando tengas matches, aparecerán aquí para que puedas chatear
                  </p>
                  <button
                    onClick={() => navigate('/ultra-home')}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Empezar a hacer swipe
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Spacer for Tab Bar */}
          <div className="h-24"></div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 pb-6 flex justify-between items-center z-30">
          <button 
            onClick={() => navigate('/ultra-profile')}
            className="flex flex-col items-center gap-1 group"
          >
            <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">person</span>
            <span className="text-[10px] font-medium text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Perfil</span>
          </button>

          <button 
            onClick={() => navigate('/ultra-home')}
            className="flex flex-col items-center gap-1 group"
          >
            <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">style</span>
            <span className="text-[10px] font-medium text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Swipe</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="relative">
              <span className="material-symbols-outlined text-gray-900 dark:text-white filled">chat_bubble</span>
              {totalUnreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white border-2 border-white dark:border-gray-800">
                  {totalUnreadMessages > 9 ? '9+' : totalUnreadMessages}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium text-gray-900 dark:text-white">Chats</span>
          </button>

          <button 
            onClick={() => navigate('/configuracion')}
            className="flex flex-col items-center gap-1 group"
          >
            <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">settings</span>
            <span className="text-[10px] font-medium text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Ajustes</span>
          </button>
        </div>
      </div>
    </div>
  );
}