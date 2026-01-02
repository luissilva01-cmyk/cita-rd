import React, { useState } from 'react';
import { Edit3, MapPin, Briefcase, Heart, Settings, Camera, BarChart3 } from 'lucide-react';
import { UserProfile } from '../../types';
import PhotoUploader from '../../components/PhotoUploader';
import ProfileScore from '../../components/ProfileScore';
import { useLanguage } from '../../contexts/LanguageContext';

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

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">{t('myProfile')}</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          {isEditing ? <Settings className="text-slate-600" size={20} /> : <Edit3 className="text-slate-600" size={20} />}
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Score Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{t('profileScore')}</h3>
            <button
              onClick={() => setShowProfileScore(!showProfileScore)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <BarChart3 size={16} />
              {showProfileScore ? t('hide') : t('viewScore')}
            </button>
          </div>

          {showProfileScore && (
            <div className="bg-slate-50 rounded-lg p-4">
              <ProfileScore
                photos={user.images || []}
                userId={user.id}
              />
            </div>
          )}
        </div>

        {/* Profile Photos Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{t('myPhotos')}</h3>
            <button
              onClick={() => setShowPhotoUploader(!showPhotoUploader)}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              <Camera size={16} />
              {t('managePhotos')}
            </button>
          </div>

          {/* Current profile image preview */}
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={user.images[0] || 'https://via.placeholder.com/150'}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
              />
            </div>
            <p className="text-sm text-slate-600 mt-2">{t('mainPhoto')}</p>
          </div>

          {/* Photo uploader */}
          {showPhotoUploader && (
            <div className="bg-slate-50 rounded-lg p-4">
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

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('name')}</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            ) : (
              <p className="text-lg font-semibold text-slate-800">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('age')}</label>
            {isEditing ? (
              <input
                type="number"
                value={editedUser.age}
                onChange={(e) => setEditedUser({ ...editedUser, age: parseInt(e.target.value) })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            ) : (
              <p className="text-lg text-slate-800">{t('yearsOld', { age: user.age.toString() })}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              {t('location')}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.location}
                onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            ) : (
              <p className="text-slate-600">{user.location}</p>
            )}
          </div>

          {user.job && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Briefcase className="inline w-4 h-4 mr-1" />
                {t('job')}
              </label>
              <p className="text-slate-600">{user.job}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('bio')}</label>
            {isEditing ? (
              <textarea
                value={editedUser.bio}
                onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                rows={4}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                placeholder={t('tellUsAboutYou')}
              />
            ) : (
              <p className="text-slate-600 leading-relaxed">{user.bio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Heart className="inline w-4 h-4 mr-1" />
              {t('interests')}
            </label>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 px-6 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
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