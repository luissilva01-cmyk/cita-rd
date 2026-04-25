import React, { useState } from 'react';
import { Edit3, MapPin, Briefcase, Heart, Settings, Camera, BarChart3, LogOut, X, Plus, Flag, Shield } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { UserProfile } from '../../types';
import PhotoUploader from '../../components/PhotoUploader';
import ProfileScore from '../../components/ProfileScore';
import AccountSettings from '../../components/AccountSettings';
import ReportProfileModal from '../../components/ReportProfileModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { logger } from '../../utils/logger';
import { useAdmin } from '../../hooks/useAdmin';

// 🇩🇴 Provincias de República Dominicana organizadas por región
const DOMINICAN_PROVINCES = {
  'Región Metropolitana': [
    'Distrito Nacional',
    'Santo Domingo Norte',
    'Santo Domingo Este',
    'Santo Domingo Oeste'
  ],
  'Región Norte (Cibao)': [
    'Santiago',
    'La Vega',
    'Duarte',
    'Monseñor Nouel',
    'Espaillat',
    'Puerto Plata',
    'Hermanas Mirabal',
    'Valverde',
    'Sánchez Ramírez',
    'Santiago Rodríguez',
    'Dajabón',
    'Monte Cristi'
  ],
  'Región Este': [
    'La Altagracia',
    'La Romana',
    'San Pedro de Macorís',
    'El Seibo',
    'Hato Mayor',
    'Monte Plata'
  ],
  'Región Sur': [
    'San Cristóbal',
    'Peravia',
    'Azua',
    'San José de Ocoa',
    'Barahona',
    'Bahoruco',
    'Independencia',
    'Pedernales',
    'San Juan',
    'Elías Piña'
  ]
};

// Lista plana de todas las provincias para validación
const ALL_PROVINCES = Object.values(DOMINICAN_PROVINCES).flat();

// Intereses sugeridos
const SUGGESTED_INTERESTS = [
  'Música', 'Deportes', 'Viajes', 'Cine', 'Lectura', 'Cocina',
  'Fotografía', 'Arte', 'Tecnología', 'Fitness', 'Yoga', 'Baile',
  'Playa', 'Montaña', 'Café', 'Vino', 'Mascotas', 'Gaming',
  'Senderismo', 'Ciclismo', 'Natación', 'Correr', 'Meditación',
  'Voluntariado', 'Emprendimiento', 'Moda', 'Diseño', 'Música en vivo'
];

interface ProfileViewProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  currentUserId?: string; // ID del usuario que está viendo el perfil
  isOwnProfile?: boolean; // Si es el perfil propio o de otro usuario
  onNavigateToAdmin?: () => void; // Función para navegar al panel de admin
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  onUpdate,
  currentUserId,
  isOwnProfile = true,
  onNavigateToAdmin
}) => {
  const { t } = useLanguage();
  const { isAdmin } = useAdmin(user.id);
  
  console.log('👤 ProfileView - Props:', { 
    userId: user.id, 
    isOwnProfile, 
    hasNavigateFunction: !!onNavigateToAdmin 
  });
  console.log('🔐 ProfileView - Admin status:', isAdmin);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const [showProfileScore, setShowProfileScore] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [showInterestSuggestions, setShowInterestSuggestions] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Detectar si el perfil está incompleto
  const isProfileIncomplete = !user.images || user.images.length === 0 || 
                               !user.bio || user.bio.trim() === '' ||
                               !user.location || user.location.trim() === '';

  // Auto-activar modo edición si el perfil está incompleto
  React.useEffect(() => {
    if (isProfileIncomplete && !isEditing) {
      setIsEditing(true);
      setShowPhotoUploader(true); // Mostrar uploader automáticamente
    }
  }, [isProfileIncomplete, isEditing]);

  const handleLogout = async () => {
    if (window.confirm(t('confirmLogout') || '¿Estás seguro de que quieres cerrar sesión?')) {
      setIsLoggingOut(true);
      try {
        // IMPORTANTE: Actualizar presencia ANTES de cerrar sesión
        if (user?.id) {
          const { setUserOffline } = await import('../../services/presenceService');
          await setUserOffline(user.id);
          logger.auth.info('User presence set to offline before logout', { userId: user.id });
        }
        
        // Cerrar sesión
        // Nota: Puede aparecer un mensaje "Firestore shutting down" en consola - es esperado y benigno
        await signOut(auth);
        logger.auth.success('User logged out successfully');
        // El AuthProvider se encargará de limpiar el estado y redirigir
      } catch (error) {
        logger.auth.error('Error al cerrar sesión', error);
        alert(t('logoutError') || 'Error al cerrar sesión. Inténtalo de nuevo.');
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handlePhotosUpdate = (photos: string[]) => {
    const updatedUser = { ...editedUser, images: photos };
    setEditedUser(updatedUser);
    onUpdate(updatedUser);
    
    // Force ProfileScore to re-analyze when photos change
    if (showProfileScore) {
      // The ProfileScore component will automatically re-analyze due to useEffect dependency on photos
      console.log('📊 Fotos actualizadas, ProfileScore se recalculará automáticamente');
    }
  };

  const handleAddInterest = (interest: string) => {
    const trimmedInterest = interest.trim();
    if (trimmedInterest && !editedUser.interests.includes(trimmedInterest)) {
      setEditedUser({
        ...editedUser,
        interests: [...editedUser.interests, trimmedInterest]
      });
      setNewInterest('');
      setShowInterestSuggestions(false);
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setEditedUser({
      ...editedUser,
      interests: editedUser.interests.filter(i => i !== interestToRemove)
    });
  };

  const filteredSuggestions = SUGGESTED_INTERESTS.filter(
    interest => 
      !editedUser.interests.includes(interest) &&
      interest.toLowerCase().includes(newInterest.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Responsive */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center border-b border-slate-100 safe-area-top">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">Mi Perfil</h3>
          <p className="text-slate-600 text-xs sm:text-sm">Gestiona tu información personal</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Botón de reportar (solo si NO es perfil propio) */}
          {!isOwnProfile && currentUserId && (
            <button
              onClick={() => setShowReportModal(true)}
              className="p-2 rounded-full hover:bg-red-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center group"
              title="Reportar perfil"
            >
              <Flag className="text-slate-600 group-hover:text-red-600" size={18} />
            </button>
          )}
          
          {/* Botones solo para perfil propio */}
          {isOwnProfile && (
            <>
              <button
                onClick={() => setShowAccountSettings(true)}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Configuración de cuenta"
              >
                <Settings className="text-slate-600" size={18} />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                title={isEditing ? 'Cancelar edición' : 'Editar perfil'}
              >
                <Edit3 className="text-slate-600" size={18} />
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-2 rounded-full hover:bg-red-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center group disabled:opacity-50"
                title={t('logout') || 'Cerrar sesión'}
              >
                {isLoggingOut ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <LogOut className="text-red-500 group-hover:text-red-600" size={18} />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 safe-area-bottom">
        {/* Welcome Banner for New Users */}
        {isProfileIncomplete && (
          <div className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-start gap-3">
              <div className="text-3xl">👋</div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  ¡Bienvenido a Ta' Pa' Ti!
                </h3>
                <p className="text-sm sm:text-base mb-3 opacity-90">
                  Para empezar a conocer personas increíbles, completa tu perfil:
                </p>
                <ul className="space-y-2 text-sm">
                  {(!user.images || user.images.length === 0) && (
                    <li className="flex items-center gap-2">
                      <span className="text-xl">📸</span>
                      <span>Sube al menos una foto</span>
                    </li>
                  )}
                  {(!user.bio || user.bio.trim() === '') && (
                    <li className="flex items-center gap-2">
                      <span className="text-xl">✍️</span>
                      <span>Escribe una bio que te describa</span>
                    </li>
                  )}
                  {(!user.location || user.location.trim() === '') && (
                    <li className="flex items-center gap-2">
                      <span className="text-xl">📍</span>
                      <span>Selecciona tu provincia</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Admin Panel Access Button */}
        {(() => {
          console.log('🎨 Renderizando botón admin - Condiciones:', {
            isOwnProfile,
            isAdmin,
            hasNavigateFunction: !!onNavigateToAdmin,
            shouldShow: isOwnProfile && isAdmin && onNavigateToAdmin
          });
          return null;
        })()}
        {isOwnProfile && isAdmin && onNavigateToAdmin && (
          <button
            onClick={onNavigateToAdmin}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Shield className="text-white" size={24} />
              <div className="text-left">
                <p className="font-bold text-lg">Panel de Administración</p>
                <p className="text-sm opacity-90">Gestionar reportes y usuarios</p>
              </div>
            </div>
            <div className="text-2xl group-hover:translate-x-1 transition-transform">→</div>
          </button>
        )}

        {/* Profile Score Section - Responsive */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800">{t('profileScore')}</h3>
            <button
              onClick={() => setShowProfileScore(!showProfileScore)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors min-h-[44px] text-sm"
            >
              <BarChart3 size={14} className="sm:w-4 sm:h-4" />
              {showProfileScore ? t('hide') : t('viewScore')}
            </button>
          </div>

          {showProfileScore && (
            <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
              <ProfileScore
                photos={user.images || []}
                userId={user.id}
              />
            </div>
          )}
        </div>

        {/* Profile Photos Section - Responsive */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800">{t('myPhotos')}</h3>
            <button
              onClick={() => setShowPhotoUploader(!showPhotoUploader)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors min-h-[44px] text-sm"
            >
              <Camera size={14} className="sm:w-4 sm:h-4" />
              {t('managePhotos')}
            </button>
          </div>

          {/* Current profile image preview - Responsive */}
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={user.images[0] || 'https://via.placeholder.com/150'}
                alt={user.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full lg:rounded-xl profile-image-smart mx-auto border-4 border-white shadow-lg"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">{t('mainPhoto')}</p>
          </div>

          {/* Photo uploader - Responsive */}
          {showPhotoUploader && (
            <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
              <PhotoUploader
                userId={user.id}
                currentPhotos={user.images || []}
                onPhotosUpdate={handlePhotosUpdate}
                maxPhotos={6}
                showAnalysis={true}
              />
            </div>
          )}
        </div>

        {/* Basic Info - Responsive */}
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('name')}</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
              />
            ) : (
              <p className="text-base sm:text-lg font-semibold text-slate-800">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('age')}</label>
            {isEditing ? (
              <input
                type="number"
                value={editedUser.age}
                onChange={(e) => setEditedUser({ ...editedUser, age: parseInt(e.target.value) })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
              />
            ) : (
              <p className="text-base sm:text-lg text-slate-800">{t('yearsOld', { age: user.age.toString() })}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Soy</label>
            {isEditing ? (
              <div className="flex gap-3">
                {(['hombre', 'mujer'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setEditedUser({ ...editedUser, gender: g })}
                    className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${
                      editedUser.gender === g
                        ? 'border-rose-500 bg-rose-50 text-rose-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {g === 'hombre' ? '👨 Hombre' : '👩 Mujer'}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-base sm:text-lg text-slate-800">
                {user.gender === 'hombre' ? '👨 Hombre' : user.gender === 'mujer' ? '👩 Mujer' : 'No especificado'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Me interesan</label>
            {isEditing ? (
              <div className="flex gap-3">
                {(['hombres', 'mujeres', 'ambos'] as const).map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setEditedUser({ ...editedUser, interestedIn: pref })}
                    className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${
                      editedUser.interestedIn === pref
                        ? 'border-rose-500 bg-rose-50 text-rose-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pref.charAt(0).toUpperCase() + pref.slice(1)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-base sm:text-lg text-slate-800">
                {user.interestedIn ? user.interestedIn.charAt(0).toUpperCase() + user.interestedIn.slice(1) : 'No especificado'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <MapPin className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              {t('location')} (Provincia)
            </label>
            {isEditing ? (
              <select
                value={editedUser.location}
                onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base min-h-[44px] bg-white"
              >
                <option value="">Selecciona tu provincia</option>
                {Object.entries(DOMINICAN_PROVINCES).map(([region, provinces]) => (
                  <optgroup key={region} label={region}>
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ) : (
              <p className="text-slate-600 text-sm sm:text-base flex items-center gap-1">
                📍 {user.location || 'No especificada'}
              </p>
            )}
            {isEditing && (
              <p className="text-xs text-slate-500 mt-1">
                💡 Selecciona tu provincia para encontrar personas cerca de ti
              </p>
            )}
          </div>

          {user.job && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Briefcase className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                {t('job')}
              </label>
              <p className="text-slate-600 text-sm sm:text-base">{user.job}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('bio')}</label>
            {isEditing ? (
              <textarea
                value={editedUser.bio}
                onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                rows={4}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none text-sm sm:text-base"
                placeholder={t('tellUsAboutYou')}
              />
            ) : (
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{user.bio}</p>
            )}
          </div>

          {/* Qué Busca - Relationship Goal */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              💘 ¿Qué buscas?
            </label>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'relacion_seria', label: 'Relación seria', emoji: '❤️' },
                  { value: 'algo_casual', label: 'Algo casual', emoji: '🔥' },
                  { value: 'amistad', label: 'Amistad', emoji: '🤝' },
                  { value: 'no_se_aun', label: 'No sé aún', emoji: '🤷' },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setEditedUser({ ...editedUser, relationshipGoal: opt.value })}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95"
                    style={{
                      background: editedUser.relationshipGoal === opt.value
                        ? 'linear-gradient(135deg, #ff8052, #ffc107)'
                        : 'white',
                      color: editedUser.relationshipGoal === opt.value ? 'white' : '#475569',
                      border: editedUser.relationshipGoal === opt.value ? 'none' : '1px solid #e2e8f0'
                    }}
                  >
                    <span>{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-sm sm:text-base">
                {user.relationshipGoal === 'relacion_seria' && '❤️ Relación seria'}
                {user.relationshipGoal === 'algo_casual' && '🔥 Algo casual'}
                {user.relationshipGoal === 'amistad' && '🤝 Amistad'}
                {user.relationshipGoal === 'no_se_aun' && '🤷 No sé aún'}
                {!user.relationshipGoal && '—'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Heart className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              {t('interests')}
            </label>
            
            {/* Interests display/edit */}
            <div className="flex flex-wrap gap-2 mb-3">
              {editedUser.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-2.5 sm:px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1"
                >
                  {interest}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-1 hover:bg-rose-200 rounded-full p-0.5 transition-colors"
                      type="button"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
              {editedUser.interests.length === 0 && (
                <p className="text-slate-400 text-sm">{isEditing ? 'Agrega tus intereses' : 'Sin intereses'}</p>
              )}
            </div>

            {/* Add interest input (only in edit mode) */}
            {isEditing && (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => {
                      setNewInterest(e.target.value);
                      setShowInterestSuggestions(e.target.value.length > 0);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInterest(newInterest);
                      }
                    }}
                    placeholder="Escribe un interés..."
                    className="w-full p-3 pr-12 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                  />
                  <button
                    onClick={() => handleAddInterest(newInterest)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Suggestions dropdown */}
                {showInterestSuggestions && filteredSuggestions.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddInterest(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 transition-colors text-sm border-b border-slate-100 last:border-b-0"
                        type="button"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick add suggestions */}
                <div className="flex flex-wrap gap-2">
                  <p className="text-xs text-slate-500 w-full">Sugerencias:</p>
                  {SUGGESTED_INTERESTS.filter(s => !editedUser.interests.includes(s)).slice(0, 6).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddInterest(suggestion)}
                      className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs hover:bg-rose-100 hover:text-rose-700 transition-colors"
                      type="button"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prompts de conversación (tipo Hinge) */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            💬 Conóceme mejor
            <span className="text-[10px] font-normal text-slate-400">(elige hasta 3)</span>
          </h3>
          {(() => {
            const PROMPT_OPTIONS = [
              'La forma de conquistarme es...',
              'Un domingo perfecto para mí es...',
              'Mi guilty pleasure es...',
              'Lo que más valoro en una persona es...',
              'Si pudiera viajar a cualquier lugar sería...',
              'Mi canción favorita para bailar es...',
              'Algo que la gente no espera de mí es...',
              'Mi comida favorita dominicana es...',
              'El mejor plan para una primera cita es...',
              'Me río mucho cuando...',
            ];
            const currentPrompts = editedUser.prompts || [];

            if (!isEditing) {
              if (currentPrompts.length === 0) return <p className="text-slate-400 text-xs">Edita tu perfil para agregar prompts</p>;
              return (
                <div className="space-y-3">
                  {currentPrompts.map((p, i) => (
                    <div key={i} className="bg-gradient-to-br from-orange-50 to-rose-50 border border-orange-100 rounded-2xl p-4">
                      <p className="text-[11px] font-bold text-[#ff8052] uppercase tracking-wide mb-1">{p.question}</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{p.answer}</p>
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {currentPrompts.map((p, i) => (
                  <div key={i} className="bg-white border border-orange-200 rounded-2xl p-3 relative">
                    <p className="text-[10px] font-bold text-[#ff8052] mb-1">{p.question}</p>
                    <textarea
                      value={p.answer}
                      onChange={(e) => {
                        const updated = [...currentPrompts];
                        updated[i] = { ...updated[i], answer: e.target.value };
                        setEditedUser({ ...editedUser, prompts: updated });
                      }}
                      rows={2}
                      maxLength={150}
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm resize-none focus:ring-1 focus:ring-orange-300"
                      placeholder="Tu respuesta..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditedUser({ ...editedUser, prompts: currentPrompts.filter((_, idx) => idx !== i) });
                      }}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-xs"
                    >✕</button>
                  </div>
                ))}
                {currentPrompts.length < 3 && (
                  <div>
                    <p className="text-[10px] text-slate-500 mb-2">Elige un prompt:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {PROMPT_OPTIONS.filter(q => !currentPrompts.some(p => p.question === q)).map((q, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditedUser({ ...editedUser, prompts: [...currentPrompts, { question: q, answer: '' }] })}
                          className="px-2.5 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-[10px] font-medium text-[#ff8052] hover:bg-orange-100 transition-colors active:scale-95"
                        >
                          + {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Más sobre mí - Optional badges */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            ✨ Más sobre mí
            <span className="text-[10px] font-normal text-slate-400">(opcional)</span>
          </h3>
          
          {isEditing ? (
            <div className="space-y-3">
              {/* Altura */}
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">📏 Altura</label>
                <select
                  value={editedUser.height || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, height: e.target.value || undefined })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="">No especificar</option>
                  {Array.from({ length: 41 }, (_, i) => 150 + i).map(cm => (
                    <option key={cm} value={`${cm} cm`}>{cm} cm ({Math.floor(cm / 30.48)}'{Math.round((cm % 30.48) / 2.54)}")</option>
                  ))}
                </select>
              </div>

              {/* Signo zodiacal */}
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">♈ Signo zodiacal</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { v: 'aries', l: '♈ Aries' }, { v: 'tauro', l: '♉ Tauro' }, { v: 'geminis', l: '♊ Géminis' }, { v: 'cancer', l: '♋ Cáncer' },
                    { v: 'leo', l: '♌ Leo' }, { v: 'virgo', l: '♍ Virgo' }, { v: 'libra', l: '♎ Libra' }, { v: 'escorpio', l: '♏ Escorpio' },
                    { v: 'sagitario', l: '♐ Sagitario' }, { v: 'capricornio', l: '♑ Capricornio' }, { v: 'acuario', l: '♒ Acuario' }, { v: 'piscis', l: '♓ Piscis' },
                  ].map(s => (
                    <button key={s.v} type="button" onClick={() => setEditedUser({ ...editedUser, zodiacSign: editedUser.zodiacSign === s.v ? undefined : s.v })}
                      className="px-1.5 py-1.5 rounded-lg text-[10px] font-medium transition-all active:scale-95"
                      style={{ background: editedUser.zodiacSign === s.v ? 'linear-gradient(135deg, #ff8052, #ffc107)' : '#f1f5f9', color: editedUser.zodiacSign === s.v ? 'white' : '#475569' }}
                    >{s.l}</button>
                  ))}
                </div>
              </div>

              {/* Hijos */}
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">👶 Hijos</label>
                <div className="flex gap-2 flex-wrap">
                  {[{ v: 'no_tengo', l: 'No tengo' }, { v: 'tengo', l: 'Tengo' }, { v: 'quiero', l: 'Quiero tener' }, { v: 'no_quiero', l: 'No quiero' }].map(o => (
                    <button key={o.v} type="button" onClick={() => setEditedUser({ ...editedUser, kids: editedUser.kids === o.v ? undefined : o.v })}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
                      style={{ background: editedUser.kids === o.v ? 'linear-gradient(135deg, #ff8052, #ffc107)' : '#f1f5f9', color: editedUser.kids === o.v ? 'white' : '#475569' }}
                    >{o.l}</button>
                  ))}
                </div>
              </div>

              {/* Fuma / Toma */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">🚬 Fuma</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {[{ v: 'no', l: 'No' }, { v: 'social', l: 'Social' }, { v: 'si', l: 'Sí' }].map(o => (
                      <button key={o.v} type="button" onClick={() => setEditedUser({ ...editedUser, smoking: editedUser.smoking === o.v ? undefined : o.v })}
                        className="px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all active:scale-95"
                        style={{ background: editedUser.smoking === o.v ? 'linear-gradient(135deg, #ff8052, #ffc107)' : '#f1f5f9', color: editedUser.smoking === o.v ? 'white' : '#475569' }}
                      >{o.l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">🍺 Toma</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {[{ v: 'no', l: 'No' }, { v: 'social', l: 'Social' }, { v: 'si', l: 'Sí' }].map(o => (
                      <button key={o.v} type="button" onClick={() => setEditedUser({ ...editedUser, drinking: editedUser.drinking === o.v ? undefined : o.v })}
                        className="px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all active:scale-95"
                        style={{ background: editedUser.drinking === o.v ? 'linear-gradient(135deg, #ff8052, #ffc107)' : '#f1f5f9', color: editedUser.drinking === o.v ? 'white' : '#475569' }}
                      >{o.l}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mascotas */}
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">🐶 Mascotas</label>
                <div className="flex gap-2 flex-wrap">
                  {[{ v: 'perro', l: '🐶 Perro' }, { v: 'gato', l: '🐱 Gato' }, { v: 'ambos', l: '🐾 Ambos' }, { v: 'no', l: 'No tengo' }, { v: 'quiero', l: 'Quiero' }].map(o => (
                    <button key={o.v} type="button" onClick={() => setEditedUser({ ...editedUser, pets: editedUser.pets === o.v ? undefined : o.v })}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
                      style={{ background: editedUser.pets === o.v ? 'linear-gradient(135deg, #ff8052, #ffc107)' : '#f1f5f9', color: editedUser.pets === o.v ? 'white' : '#475569' }}
                    >{o.l}</button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.height && <span className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">📏 {user.height}</span>}
              {user.zodiacSign && <span className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">♈ {user.zodiacSign}</span>}
              {user.kids && <span className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">👶 {user.kids === 'no_tengo' ? 'Sin hijos' : user.kids === 'tengo' ? 'Tiene hijos' : user.kids === 'quiero' ? 'Quiere hijos' : 'No quiere hijos'}</span>}
              {user.smoking && <span className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">🚬 {user.smoking === 'no' ? 'No fuma' : user.smoking === 'social' ? 'Social' : 'Fuma'}</span>}
              {user.drinking && <span className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">🍺 {user.drinking === 'no' ? 'No toma' : user.drinking === 'social' ? 'Social' : 'Toma'}</span>}
              {user.pets && <span className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">{user.pets === 'perro' ? '🐶 Perro' : user.pets === 'gato' ? '🐱 Gato' : user.pets === 'ambos' ? '🐾 Perro y gato' : user.pets === 'quiero' ? '🐾 Quiere mascota' : '🚫 Sin mascotas'}</span>}
              {!user.height && !user.zodiacSign && !user.kids && !user.smoking && !user.drinking && !user.pets && (
                <p className="text-slate-400 text-xs">Edita tu perfil para agregar más detalles</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons - Responsive */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 px-6 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors min-h-[48px] text-sm sm:text-base"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all min-h-[48px] text-sm sm:text-base"
            >
              {t('save')}
            </button>
          </div>
        )}
      </div>

      {/* Account Settings Modal */}
      <AccountSettings
        isOpen={showAccountSettings}
        currentUserId={user.id}
        onClose={() => setShowAccountSettings(false)}
        onSettingsUpdated={() => {
          // Recargar datos del usuario si es necesario
          console.log('⚙️ Configuración actualizada');
        }}
        onAccountDeleted={async () => {
          // El usuario será redirigido automáticamente por el AuthProvider
          console.log('🗑️ Cuenta eliminada');
        }}
      />
      
      {/* Report Profile Modal */}
      {!isOwnProfile && currentUserId && (
        <ReportProfileModal
          isOpen={showReportModal}
          reportedUserId={user.id}
          reportedUserName={user.name}
          currentUserId={currentUserId}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};

export default ProfileView;