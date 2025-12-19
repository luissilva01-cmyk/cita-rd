
import React, { useState } from 'react';
import { Settings, Camera, Shield, CreditCard, LogOut, ChevronRight, Check, X } from 'lucide-react';
import { UserProfile } from '../../../types';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

const ProfileView: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-50 min-h-full">
      {/* Header Profile */}
      <div className="bg-white px-6 pt-10 pb-8 text-center rounded-b-[40px] shadow-sm transition-all">
        <div className="relative inline-block mb-4">
          <img 
            src={user.images[0]} 
            className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
            alt="My Profile"
          />
          <button className="absolute bottom-1 right-1 bg-rose-500 p-2 rounded-full text-white shadow-lg border-2 border-white active:scale-90">
            <Camera size={18} />
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <input 
              className="w-full text-center text-2xl font-bold bg-slate-50 rounded-lg p-1 outline-none border-b-2 border-rose-500"
              value={editedUser.name}
              onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
            />
            <textarea 
              className="w-full text-sm text-slate-600 bg-slate-50 rounded-lg p-2 outline-none resize-none"
              value={editedUser.bio}
              rows={3}
              onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
            />
            <div className="flex gap-2 justify-center">
              <button onClick={handleSave} className="bg-emerald-500 text-white p-2 rounded-full shadow-lg"><Check size={20}/></button>
              <button onClick={() => setIsEditing(false)} className="bg-slate-200 text-slate-600 p-2 rounded-full shadow-lg"><X size={20}/></button>
            </div>
          </div>
        ) : (
          <div onClick={() => setIsEditing(true)} className="cursor-pointer group">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
              {user.name}, {user.age}
              <Settings size={16} className="text-slate-300 group-hover:text-rose-500 transition-colors" />
            </h2>
            <p className="text-slate-500 text-sm mt-1">{user.location}</p>
            <p className="text-slate-500 text-sm mt-2 px-6 italic line-clamp-2">"{user.bio}"</p>
          </div>
        )}
        
        <div className="flex justify-center gap-8 mt-6">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-800">85%</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Perfil</p>
          </div>
          <div className="w-[1px] bg-slate-100" />
          <div className="text-center">
            <p className="text-xl font-bold text-slate-800">12</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Matches</p>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="px-6 py-8 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Configuración</h3>
        
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <ProfileMenuItem icon={<Settings className="text-slate-400" size={20}/>} label="Preferencias" />
          <ProfileMenuItem icon={<Shield className="text-emerald-400" size={20}/>} label="Seguridad y Privacidad" />
          <ProfileMenuItem icon={<CreditCard className="text-rose-400" size={20}/>} label="CitaRD Premium" />
        </div>

        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mt-6">Ayuda</h3>
        
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <ProfileMenuItem icon={<LogOut className="text-rose-500" size={20}/>} label="Cerrar Sesión" showArrow={false} />
        </div>
      </div>
    </div>
  );
};

const ProfileMenuItem = ({ icon, label, showArrow = true }: { icon: React.ReactNode, label: string, showArrow?: boolean }) => (
  <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
    {showArrow && <ChevronRight size={16} className="text-slate-300" />}
  </button>
);

export default ProfileView;
