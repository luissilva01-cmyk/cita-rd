import React, { useState } from 'react';
import { Edit3, MapPin, Briefcase, Heart, Settings } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileViewProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Mi Perfil</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          {isEditing ? <Settings className="text-slate-600" size={20} /> : <Edit3 className="text-slate-600" size={20} />}
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Image */}
        <div className="text-center">
          <div className="relative inline-block">
            <img
              src={user.images[0] || 'https://via.placeholder.com/150'}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <Edit3 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Edad</label>
            {isEditing ? (
              <input
                type="number"
                value={editedUser.age}
                onChange={(e) => setEditedUser({ ...editedUser, age: parseInt(e.target.value) })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            ) : (
              <p className="text-lg text-slate-800">{user.age} años</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Ubicación
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
                Trabajo
              </label>
              <p className="text-slate-600">{user.job}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Biografía</label>
            {isEditing ? (
              <textarea
                value={editedUser.bio}
                onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                rows={4}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                placeholder="Cuéntanos sobre ti..."
              />
            ) : (
              <p className="text-slate-600 leading-relaxed">{user.bio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Heart className="inline w-4 h-4 mr-1" />
              Intereses
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
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;