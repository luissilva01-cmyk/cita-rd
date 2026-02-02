import React, { useState } from 'react';
import { Edit3, MapPin, Briefcase, Heart, Settings, Camera, BarChart3, LogOut, X, Plus } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { UserProfile } from '../../types';
import PhotoUploader from '../../components/PhotoUploader';
import ProfileScore from '../../components/ProfileScore';
import { useLanguage } from '../../contexts/LanguageContext';

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
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const [showProfileScore, setShowProfileScore] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [showInterestSuggestions, setShowInterestSuggestions] = useState(false);

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
        if (user?.uid) {
          const { setUserOffline } = await import('../../services/presenceService');
          await setUserOffline(user.uid);
        }
        
        // Terminar conexión de Firestore para evitar errores de reconexión
        const { terminate } = await import('firebase/firestore');
        const { db } = await import('../../services/firebase');
        try {
          await terminate(db);
        } catch (error) {
          // Ignorar errores al terminar Firestore (puede ya estar terminado)
          console.log('Firestore termination (expected)');
        }
        
        // Ahora sí cerrar sesión
        await signOut(auth);
        // El AuthProvider se encargará de limpiar el estado y redirigir
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
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
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t('myProfile')}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {isEditing ? <Settings className="text-slate-600" size={18} /> : <Edit3 className="text-slate-600" size={18} />}
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
    </div>
  );
};

export default ProfileView;