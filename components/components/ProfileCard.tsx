
import React from 'react';
import { MapPin, Briefcase, Info } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileCardProps {
  user: UserProfile;
  style?: React.CSSProperties;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, style }) => {
  return (
    <div 
      style={style}
      className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl bg-slate-900 group"
    >
      {/* Background Image */}
      <img 
        src={user.images[0]} 
        alt={user.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-end gap-2 mb-2">
          <h2 className="text-3xl font-bold">{user.name}, {user.age}</h2>
        </div>

        <div className="flex flex-col gap-1 text-sm opacity-90 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-rose-400" />
            <span>{user.location} • {user.distance} de distancia</span>
          </div>
          {user.job && (
            <div className="flex items-center gap-1.5">
              <Briefcase size={14} className="text-rose-400" />
              <span>{user.job}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {user.interests.slice(0, 3).map((interest, idx) => (
            <span 
              key={idx}
              className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium border border-white/10"
            >
              {interest}
            </span>
          ))}
        </div>

        <p className="text-sm line-clamp-2 text-slate-200 font-light leading-relaxed">
          {user.bio}
        </p>
      </div>

      <button className="absolute top-6 right-6 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/10 text-white">
        <Info size={20} />
      </button>
    </div>
  );
};

export default ProfileCard;