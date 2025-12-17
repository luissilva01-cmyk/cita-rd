import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { obtenerMatches } from '../services/likesService';
import { obtenerConversaciones } from '../services/chatService';

export default function UltraModernMatches() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados principales
  const [matches, setMatches] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Función para cargar matches y conversaciones
  const loadMatchesAndChats = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      
      // Intentar cargar datos reales, si falla usar datos de prueba
      let userMatches = [];
      let userChats = [];
      
      try {
        userMatches = await obtenerMatches(user.uid);
        userChats = await obtenerConversaciones(user.uid);
      } catch (error) {
        console.log('Using demo data:', error);
        
        // Datos de prueba para matches
        userMatches = [
          {
            id: 'match1',
            nombre: 'Ana',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4d52eRF-vCrc55bD5alfA3uMNV7xzYu2xhXwrSqwmlFYobMT89RSb00IFwPOcTcB3nswHYVMNle3G7j9NB9yzS7YARSN_mU9jRU_TeFQkN3k-V-q5QcYoSmrgWOXXQiExNdomHyDugD8TPcXfnVxdUAmRQFT7vk54ofYMvAX634kTXaG7P9JQB3TM8MkWdJNOmhwH4MK07em-JZTe-oCRKXa5VC0XuYEKLXEzQKlyjLpq7mdf6tHwZr_s9DmcW13wFPVV-EWqQq10',
            enLinea: true,
            esNuevo: true,
            fechaMatch: new Date()
          },
          {
            id: 'match2',
            nombre: 'Carlos',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxJuRSV_KqR_hmU5S1uuufjnnHQh3p00muD3S6uWOEdxtQ67wT2p_ifSefHvAJ-6J9_o6VDhhDU1EY7Q2nzHxG_2-e7IMRiPhFMx8RwYtM8YocfpOvRGpIt3Nee0ZdcqMhvSErZD-n2bdFFQyj7ON-Uwsotauu2QoJk8QlW7X8dOoQ1cEJaN_lUxCZJiJbY6PjUgEp-0GwZhAPCl-tkCXYeHDILSZC-FTR8e96uNJrt_8wY-xQtSaRSqmc8SzGbGf16hUn0tOysGOt',
            enLinea: false,
            esNuevo: true,
            fechaMatch: new Date()
          },
          {
            id: 'match3',
            nombre: 'Laura',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-cbUfdJKxsf4ynzvfx2mRCR1tFoP2mdNAMrk_pZT9g4N-rogNR47U8t46okT4y2Gbj6M57dUm3X2fvjdiRwUV8HxIGIBRP0vSGNftyfjo9HvcD-G1ut5DweWruyk7Bo91CAegR_1-4l3akRUEYWHOulpYppsKQTr_B4LV5QznC5hkshZwNDCodMsd5AUIuUoNDwO4olkGt54KDPvaLcXCkjh2SWhj3LC25bwuRgDCIyJOgSfBg5ZjEc-p56BdkbE1niterN1EVhFP',
            enLinea: false,
            esNuevo: false,
            fechaMatch: new Date(Date.now() - 86400000) // 1 día atrás
          }
        ];

        // Datos de prueba para conversaciones
        userChats = [
          {
            id: 'chat1',
            participante: {
              id: 'user1',
              nombre: 'Isabella',
              edad: 24,
              fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbJM9he2qu--QlP_BdMyiOQtWq0VtkUT2KHpfNB_llkuXpiRzP_99CM6WmHz_0jgCx8rJtsEc7e9VTb3ztFhuW_J66FN1EHXcUEwgoLIzI1GUcOQwmPGJAI_8DBoGp6wbQ_NkYWqylHT9S9prlU2SDVnn_0YLBGoe1bLBzrT96vsKyJd78P3c5C7MuHMvUYVJgeAw57qb5RXTcTuWSjDKSGy0MSK8InBu1vlQnkkXQSeghc4rgE_CDYkkBY8lbLvr6qfSFbHYRdPkG',
              enLinea: true
            },
            ultimoMensaje: {
              texto: '¡Me encantó esa foto de tu viaje! 🌊',
              timestamp: new Date(Date.now() - 120000), // 2 minutos atrás
              leido: false
            }
          },
          {
            id: 'chat2',
            participante: {
              id: 'user2',
              nombre: 'David',
              edad: 28,
              fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbN5XselTsjfHl4yDmaQTLfOFqC5ypYJtLk6jZQ_jT4o13TSspxpLLhXdqJCRnZBwvdSa0se-haBV5GTemZDONtpY477C1l86NH1cpaMTPceZcAJXW7zoNRdYNpYSPL4AeunrgzZk0vCiXDTTGxTaFkDqvexBs6fkR0L1vvYgrN44rVx0m-xzb36i84DkZVh_edCmB5SxLP-hpRiWiLIq-C0pVZeZHUZ_R5t8O8dlv7F8RuINURkWlz_8T-X_8XgerpA5BjzIHQl-M',
              enLinea: false
            },
            ultimoMensaje: {
              texto: 'Tienes un match nuevo, ¡saluda! 👋',
              timestamp: new Date(Date.now() - 86400000), // 1 día atrás
              leido: false,
              esNuevoMatch: true
            }
          },
          {
            id: 'chat3',
            participante: {
              id: 'user3',
              nombre: 'Elena',
              edad: 25,
              fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFq0WsQThZ8XQKJsJtg2W_CYhlIB7UWRt24hpdIs4Err5Ri2br1tLo5SJj7flsLN-NvbFwr2ls0Y4ckYQ8v9lm12uihTv3hmpQlaqrDUqc1fIXmGWY9W0f3pI-ve7dl522wpMNYIS9msv-OX6A1IA_cI2WnQbaCN42aRf49YWPpBJbe23-Jym5Z6KquShIwiU2n4yRjbrXxQWjJcf9v-EBoRrQUv6xh_Q3i8Cyy1dgAbJQgN1RgZPlgCH5RKOKm7w3hLsUWvMp3nyC',
              enLinea: false
            },
            ultimoMensaje: {
              texto: 'El match ha expirado.',
              timestamp: new Date(Date.now() - 432000000), // 5 días atrás
              leido: true,
              expirado: true
            }
          },
          {
            id: 'chat4',
            participante: {
              id: 'user4',
              nombre: 'Javier',
              edad: 29,
              fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeADZFBYv4kPiN0Q1dcitFS8jHRqIvxFhzg4F5swtdWrRP4d2AtLLGM6Gs7L_3s_d2ppiT35zRpVMYgLm057HquXqicRsbWyZLjO4cAsI7UjNWefFhO5Fh-9ZQNIJgseIwq531OrM-SV1SoRY93mR9n9GWkuOxMwVMXIIYGlysrsAcCZsj-YOt_G2w-z2a0WVwWxAH0Ma_jfq0gTGaqMbKp5BJ8eGfJN-lJEMyPncnXp2rWIO39YqjHrYMsWjf9fHgIrfxMsyR2w0j',
              enLinea: true
            },
            ultimoMensaje: {
              texto: 'Jajaja totalmente de acuerdo 😂',
              timestamp: new Date(Date.now() - 604800000), // 7 días atrás
              leido: true
            }
          },
          {
            id: 'chat5',
            participante: {
              id: 'user5',
              nombre: 'Sofia',
              edad: 23,
              fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjWLv9m6osPL6Arhzv2AoYnU8LKJs7xhMuNW9U0pZfrjbwb83rWP1po_vjF8DpELOylyViVxO3crGJiBSaDS1-IPdHPNURW_j6SGv3j-I01bh2H99kdgum_kp2m8yFyV1bwqteFC2txIqmx2m6yyOe1FeNXsl0zjUaVwW9ANWronIE1DfMxwLTECNDvEbor9ZXXDqXPY7GulpBo7K0Cs2zKAxIBm3kSztBb4vQj_TOU7nTPK2SSdJIEREr3QKARFNBqVGzRP-l79Xn',
              enLinea: false
            },
            ultimoMensaje: {
              texto: '¿Te gusta el sushi?',
              timestamp: new Date(Date.now() - 1209600000), // 14 días atrás
              leido: true
            }
          }
        ];
      }
      
      setMatches(userMatches);
      setConversations(userChats);
      
    } catch (error) {
      console.error('Error loading matches and chats:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadMatchesAndChats();
  }, [loadMatchesAndChats]);

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
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return hours === 1 ? 'Hace 1 hora' : `Hace ${hours} horas`;
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    
    return timestamp.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleMatchClick = (match) => {
    // Navegar al chat o perfil del match
    navigate(`/ultra-chat/${[user.uid, match.id].sort().join('_')}`);
  };

  const handleChatClick = (chat) => {
    navigate(`/ultra-chat/${chat.id}`);
  };

  const newMatchesCount = matches.filter(m => m.esNuevo).length;
  const filters = ['Todos', 'Nuevos', 'Cercanos', 'Online'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-display overflow-x-hidden">
      <div className="relative flex h-full min-h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
        
        {/* Top App Bar */}
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center p-4 pb-2 justify-between">
            <button 
              onClick={() => navigate('/ultra-home')}
              className="text-gray-900 dark:text-white flex w-10 h-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
            </button>
            <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
              Tus Matches
            </h2>
            <button className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white">
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-3 px-4 py-2 overflow-x-auto no-scrollbar pb-3">
            {filters.map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-transform active:scale-95 ${
                  activeFilter === filter
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <p className="text-sm font-medium leading-normal">{filter}</p>
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          {/* New Matches Section (Horizontal Scroll) */}
          <section className="mt-2">
            <div className="flex justify-between items-center px-4 pt-4 pb-2">
              <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight">
                Nuevos Matches
              </h3>
              {newMatchesCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {newMatchesCount}
                </span>
              )}
            </div>
            
            <div className="flex overflow-x-auto no-scrollbar px-4 py-2 gap-4 snap-x">
              {/* New Match Items */}
              {matches.filter(m => m.esNuevo).map((match) => (
                <div 
                  key={match.id}
                  onClick={() => handleMatchClick(match)}
                  className="flex flex-col items-center gap-2 shrink-0 snap-start w-[72px] group cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-[72px] h-[72px] rounded-full p-[3px] bg-gradient-to-tr from-rose-500 to-orange-400">
                      <div 
                        className="w-full h-full rounded-full border-2 border-white dark:border-gray-900 bg-cover bg-center"
                        style={{ backgroundImage: `url('${match.fotoUrl}')` }}
                      />
                    </div>
                    {match.enLinea && (
                      <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900"></div>
                    )}
                  </div>
                  <span className="text-xs font-bold truncate w-full text-center">{match.nombre}</span>
                </div>
              ))}

              {/* Likes You Preview */}
              <div className="flex flex-col items-center gap-2 shrink-0 snap-start w-[72px] group cursor-pointer">
                <div className="relative flex items-center justify-center w-[72px] h-[72px] rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <span className="material-symbols-outlined text-gray-400">favorite</span>
                  <div className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    +99
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-400 truncate w-full text-center">Likes</span>
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-gray-100 dark:bg-gray-800 my-4"></div>

          {/* Recent Matches List */}
          <section className="flex flex-col">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight px-4 pb-2">
              Conversaciones
            </h3>

            {conversations.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className={`group relative flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border-b border-gray-50 dark:border-gray-800/50 ${
                  chat.ultimoMensaje.expirado ? 'opacity-60' : ''
                }`}
              >
                <div className="relative shrink-0">
                  <div 
                    className={`w-14 h-14 rounded-full bg-cover bg-center shadow-sm ${
                      chat.ultimoMensaje.expirado ? 'grayscale opacity-80' : ''
                    }`}
                    style={{ backgroundImage: `url('${chat.participante.fotoUrl}')` }}
                  />
                  {chat.participante.enLinea && !chat.ultimoMensaje.expirado && (
                    <div className="absolute bottom-0 right-0 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900"></div>
                  )}
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className={`font-bold text-base truncate ${
                      chat.ultimoMensaje.expirado 
                        ? 'text-gray-500 dark:text-gray-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {chat.participante.nombre}, {chat.participante.edad}
                    </span>
                    <span className="text-xs text-gray-400 font-medium shrink-0 ml-2">
                      {formatTimeAgo(chat.ultimoMensaje.timestamp)}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${
                    chat.ultimoMensaje.expirado 
                      ? 'text-gray-400'
                      : chat.ultimoMensaje.esNuevoMatch
                        ? 'text-gray-900 dark:text-white font-medium'
                        : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {chat.ultimoMensaje.texto}
                  </p>
                </div>

                <button className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                  chat.ultimoMensaje.expirado
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : chat.ultimoMensaje.esNuevoMatch
                      ? 'bg-gray-900 text-white shadow-md hover:bg-gray-800'
                      : 'bg-gray-900/5 hover:bg-gray-900 text-gray-900 hover:text-white'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">
                    {chat.ultimoMensaje.expirado 
                      ? 'timer_off' 
                      : chat.ultimoMensaje.esNuevoMatch 
                        ? 'send' 
                        : 'chat_bubble'
                    }
                  </span>
                </button>

                {/* New indicator dot */}
                {!chat.ultimoMensaje.leido && !chat.ultimoMensaje.expirado && (
                  <div className="absolute right-4 top-4 w-2 h-2 bg-gray-900 rounded-full"></div>
                )}
              </div>
            ))}

            {/* Empty State */}
            {conversations.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
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
          </section>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-around items-center h-20 pb-4 z-40">
          <button 
            onClick={() => navigate('/ultra-home')}
            className="flex flex-col items-center justify-center w-16 gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">style</span>
          </button>

          <button className="flex flex-col items-center justify-center w-16 gap-1 text-gray-900 dark:text-white font-medium">
            <div className="relative">
              <span className="material-symbols-outlined text-3xl filled">favorite</span>
              {newMatchesCount > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              )}
            </div>
          </button>

          <button 
            onClick={() => navigate('/ultra-chats')}
            className="flex flex-col items-center justify-center w-16 gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">chat_bubble_outline</span>
          </button>

          <button 
            onClick={() => navigate('/ultra-profile')}
            className="flex flex-col items-center justify-center w-16 gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">person</span>
          </button>
        </nav>
      </div>
    </div>
  );
}