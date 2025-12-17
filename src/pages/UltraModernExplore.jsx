import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { obtenerPerfilesRecomendados } from '../services/perfilesService';
// Like service import removed for now since this is just browsing
// import { crearLike } from '../services/likesService';
import { useDatingGeolocation } from '../hooks/useGeolocation';

export default function UltraModernExplore() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados principales
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Geolocalización
  const { 
    location, 
    calculateDistancesToProfiles,
    formatDistance 
  } = useDatingGeolocation();

  // Función para cargar perfiles
  const loadProfiles = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      
      // Intentar cargar perfiles reales, si falla usar datos de prueba
      let recommendedProfiles = [];
      try {
        recommendedProfiles = await obtenerPerfilesRecomendados(user.uid);
      } catch (error) {
        console.log('Using demo profiles:', error);
        // Datos de prueba mejorados para la vista de explorar
        recommendedProfiles = [
          {
            id: 'demo1',
            nombre: 'Ana',
            edad: 24,
            ciudad: 'Santo Domingo',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9LYl-u9IENbs_smhBieLwBp-mFgCtBtLJbagtVhJH89pfRHN_6YKxQ2PhSOTtC2cMhhBE2JkhbrxPaXJxdn2a8tpxoXMxeGXl1MINUKhHHHNH4_J3NTMVs5h8RF8nFlMH45VFne2tCuBiL378S4kOOFGP9x-Qmnm82Yeh2CKzcTQX5YKaq6yYiEuQteW0YTyemnC2WCWvuuTErf1qYtQoyIiO9Cb0CzTcng_5rgadY-1-sEuAJNJVvskDg_ZMzJjtYN8XSxeuIeUI',
            intereses: ['Viajar', 'Café'],
            verificado: true,
            enLinea: true,
            distance: 5
          },
          {
            id: 'demo2',
            nombre: 'Carlos',
            edad: 28,
            ciudad: 'Santiago',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqw4CB4YHAFdhYYwzZ3ziU2HX1WnFmMNgwoPcD5D13Rb_v5NueJBCNTkC4Sf1HQ3CmdyFYELt1TAHJFIE-A1kJVo9-DHbxYCQNx3e6PY2nvyYD7-RHERWdo716HmNQT6oY3VK_1NmsmE_oSYmBhAeNjlGQRsSnm8wtQcejCwGK0zZhBglHLpNeFgdavmTquF6oqo7rgcuPsF4tbqA10vZ5Nn70lVF6Q9jCrymEcBgzN0PKgB_oFIyzeJ58v84XvHZd0c_qlsXQLejj',
            intereses: ['Música'],
            verificado: false,
            enLinea: false,
            distance: 12
          },
          {
            id: 'demo3',
            nombre: 'Elena',
            edad: 22,
            ciudad: 'Punta Cana',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFN4MTD-6ID4Vsxpu8tGHF0_ngO0xXd70ipl2wkFArMoBEDMCGnJQrpB_2hJD0PpADiU9y6WYhp-3mZlq6X84NGdJzUSU8WMWQShhiAxBUlGMO92egAwv0E5qTrzWzIs3vVr8Gqhzu3ZOrW3Sqgb_obGsyZcu03Gjvrny8Zr3a1tbWThbMqQB202OF2NpHU8gGZ9NLIk-7nOWLLglGwgoYq-8GxO5tyfmxZJGKWgj2kbUOjNzSDLOKF_Sv97MuCjjXJ14Zy00OpjPa',
            intereses: ['Playa', 'Yoga'],
            verificado: false,
            enLinea: true,
            distance: 45
          },
          {
            id: 'demo4',
            nombre: 'David',
            edad: 30,
            ciudad: 'La Romana',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5JESAY-f3Z6w4QWuIlGTLdgt84Ax7gAv9_m8srnXTPo1-4AlG0kYZ7bHtMA3CaLjIchXb9Zfc2XhRuRUUXgbRzZifkkJUF7wQh0w6GWvTUO37VsoUQLtKObc9skUnt-KyT4mAlhmq4vgA9mntIBgZiepwNj9d1oVZ0g81lJ8xehBWdDqgh6NG_wKm8AkR2Tq-5nfjoosGMe7kVaCu_u-qP4se0-jKEXlc4gAVQc8IcEwk87vPZy7bQAGbvh0r-DdQ8OdLzTJoZPzo',
            intereses: ['Deportes'],
            verificado: true,
            enLinea: false,
            distance: 25
          },
          {
            id: 'demo5',
            nombre: 'Sofia',
            edad: 25,
            ciudad: 'Puerto Plata',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV6rGGe_9IpNK7Sj5mU16XpJd7MUcQjWDscmRr-pqfSbQ7I1GJfOjkQOZ7K5tdFa_n765Z3CQU1Bqxem8Yd5LHUtYq2o8hQ5wBYSKPNtXJSyCaiPUUqhFaqmd7L5FaMijlUhYapwTb5B0DicH0_LXXVoEhx1URxbyCC9WqCs6zOFuhTP39xwDJbjt4Yidos25scehu7vS13so0fGJnXlp6f4OkSA67h1_ENyg-7GKRJdU-h4WQjP6Y3Boh646Xk-qxEioCj59ACx4z',
            intereses: ['Arte', 'Lectura'],
            verificado: false,
            enLinea: false,
            distance: 35
          },
          {
            id: 'demo6',
            nombre: 'Miguel',
            edad: 29,
            ciudad: 'Bani',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKxAAaCBSInyDHVORD0U6PZUz9gMs5ZY3RuLQq8H4wUwAvlk5oIG-JHuHEayQ5Q4hKkgXP95-mmfoehAHG_LQ-eAHESfLi5RK1XFe3Y9dYdXBTz1ZxoBjRAuMM40Lx6CZ_4PdyLMBpdH6c-6rVYNDriQJS8Cj6GQIzJlnn7p2P7C63d0k_3hn6h7eawTx0dR3qIqWxefra1_M0gK2vhj_imZZP-xsmFHRACA32j1e8ym-jTtWZ7gYZTFlWEf1Z5CznQq3dzZD4C6ij',
            intereses: ['Cine'],
            verificado: false,
            enLinea: true,
            distance: 18
          }
        ];
      }
      
      // Agregar distancias si tenemos geolocalización
      if (location) {
        recommendedProfiles = calculateDistancesToProfiles(recommendedProfiles);
      }
      
      setProfiles(recommendedProfiles);
      setFilteredProfiles(recommendedProfiles);
      
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, location, calculateDistancesToProfiles]);

  // Cargar perfiles al montar el componente
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // Filtrar perfiles basado en búsqueda y filtros
  useEffect(() => {
    let filtered = profiles;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(profile => 
        profile.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.intereses?.some(interes => 
          interes.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Aplicar filtros adicionales
    if (activeFilter !== 'Todos') {
      switch (activeFilter) {
        case 'Edad':
          filtered = filtered.sort((a, b) => a.edad - b.edad);
          break;
        case 'Distancia':
          filtered = filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
          break;
        case 'Intereses':
          filtered = filtered.filter(profile => profile.intereses && profile.intereses.length > 0);
          break;
        case 'Ubicación':
          filtered = filtered.sort((a, b) => a.ciudad.localeCompare(b.ciudad));
          break;
      }
    }

    setFilteredProfiles(filtered);
  }, [profiles, searchTerm, activeFilter]);

  // Verificar autenticación
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleProfileClick = (profile) => {
    // Navegar al perfil detallado o abrir modal
    navigate(`/perfil/${profile.id}`);
  };

  const filters = ['Todos', 'Edad', 'Distancia', 'Intereses', 'Ubicación'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando perfiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 font-display text-gray-900 dark:text-white h-screen w-full overflow-hidden flex flex-col relative antialiased">
      {/* Mobile Container */}
      <div className="relative flex h-full min-h-screen w-full flex-col mx-auto max-w-md bg-gray-50 dark:bg-gray-900 overflow-hidden shadow-2xl">
        
        {/* Header Section: Search & Title */}
        <header className="flex flex-col px-4 pt-6 pb-2 bg-gray-50 dark:bg-gray-900 z-10 sticky top-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Explorar</h1>
            <button 
              onClick={() => navigate('/ultra-profile')}
              className="h-8 w-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <img 
                alt="User Profile" 
                className="h-full w-full object-cover" 
                src={user?.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
              />
            </button>
          </div>

          {/* Search Bar + Filter Button */}
          <div className="flex gap-3 mb-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input 
                className="block w-full p-3 pl-10 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white placeholder-gray-400 shadow-sm transition-all" 
                placeholder="Buscar por nombre o interés..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center justify-center w-12 h-[46px] rounded-xl bg-gray-900 text-white hover:bg-opacity-90 transition-colors shadow-sm dark:ring-1 dark:ring-gray-700">
              <span className="material-symbols-outlined text-[24px]">tune</span>
            </button>
          </div>

          {/* Chips / Quick Filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {filters.map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 shadow-sm border transition-all ${
                  activeFilter === filter
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 active:scale-95'
                }`}
              >
                <p className="text-sm font-medium whitespace-nowrap">{filter}</p>
                {filter !== 'Todos' && (
                  <span className="material-symbols-outlined text-[18px] text-gray-500">keyboard_arrow_down</span>
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Main Content: Grid */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-4 pt-2">
          <div className="grid grid-cols-2 gap-4 pb-20">
            {filteredProfiles.map((profile) => (
              <div 
                key={profile.id}
                onClick={() => handleProfileClick(profile)}
                className="group relative flex flex-col gap-2 cursor-pointer active:scale-95 transition-transform duration-200"
              >
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                    style={{ backgroundImage: `url("${profile.fotoUrl}")` }}
                  />
                  
                  {/* Online Status */}
                  {profile.enLinea && (
                    <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm"></div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-none">
                      {profile.nombre}, {profile.edad}
                    </h3>
                    {profile.verificado && (
                      <span className="material-symbols-outlined text-blue-500 text-[16px]" title="Verified">verified</span>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
                    {profile.ciudad}
                    {profile.distance && ` • ${formatDistance(profile.distance)}`}
                  </p>
                  {profile.intereses && profile.intereses.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {profile.intereses.slice(0, 2).map((interes, index) => (
                        <span 
                          key={index}
                          className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-800 text-[10px] font-semibold text-gray-600 dark:text-gray-400"
                        >
                          {interes}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-gray-400 text-2xl">search_off</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No se encontraron perfiles
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Intenta ajustar tus filtros o búsqueda
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('Todos');
                }}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 pb-6 pt-3 flex justify-between items-center z-20">
          <button 
            onClick={() => navigate('/ultra-home')}
            className="flex flex-col items-center gap-1 group"
          >
            <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-[26px]">home</span>
            <span className="text-[10px] font-medium text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">Inicio</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <span className="material-symbols-outlined text-gray-900 dark:text-white text-[26px] fill-current" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
            <span className="text-[10px] font-medium text-gray-900 dark:text-white">Explorar</span>
          </button>

          <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center -mt-6 shadow-lg shadow-gray-900/30 border-4 border-white dark:border-gray-900">
            <span className="material-symbols-outlined text-white text-[28px]">favorite</span>
          </div>

          <button 
            onClick={() => navigate('/ultra-chats')}
            className="flex flex-col items-center gap-1 group relative"
          >
            <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-[26px]">chat_bubble</span>
            <span className="text-[10px] font-medium text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">Chats</span>
            <div className="absolute top-0 right-3 h-2.5 w-2.5 rounded-full bg-pink-500 border-2 border-white dark:border-gray-900"></div>
          </button>

          <button 
            onClick={() => navigate('/ultra-profile')}
            className="flex flex-col items-center gap-1 group"
          >
            <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-[26px]">person</span>
            <span className="text-[10px] font-medium text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">Perfil</span>
          </button>
        </nav>
      </div>
    </div>
  );
}