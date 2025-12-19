
import React, { useState } from 'react';
import { Heart, X, Star, MapPin, ShieldCheck } from 'lucide-react';
import { UserProfile, Match } from '../../types';

interface DiscoveryProps {
  users?: UserProfile[];
  onLike?: (user: UserProfile) => Promise<boolean> | boolean;
  onAction?: (userId: string) => void;
  onOpenChat?: (match: Match) => void;
}

// Mock users para demo/autocontenida
const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'Carolina',
    age: 24,
    bio: 'Amo el mofongo y bailar bachata en la Zona Colonial. Busco a alguien para ir de aventura a Samaná.',
    location: 'Santo Domingo',
    distance: '3km',
    images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600'],
    interests: ['Bachata', 'Playa', 'Gastronomía'],
    job: 'Arquitecta',
    isVerified: true
  },
  {
    id: '2',
    name: 'Marcos',
    age: 27,
    bio: 'Emprendedor digital. Fanático de las Águilas Cibaeñas. Si no estamos viendo pelota, estamos en la playa.',
    location: 'Santiago de los Caballeros',
    distance: '15km',
    images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600'],
    interests: ['Béisbol', 'Tecnología', 'Café'],
    job: 'Desarrollador',
    isVerified: true
  }
];

const Discovery: React.FC<DiscoveryProps> = ({ 
  users = MOCK_USERS, 
  onLike, 
  onAction, 
  onOpenChat 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);

  const currentUser = users[currentIndex] || null;

  const handleAction = async (action: 'like' | 'pass') => {
    if (!currentUser) return;
    
    if (action === 'like' && onLike) {
      const isMatch = await onLike(currentUser);
      if (isMatch) {
        setMatchedUser(currentUser);
        setShowMatch(true);
        return;
      }
    }
    
    // Call onAction callback if provided
    if (onAction) {
      onAction(currentUser.id);
    }
    
    // Avanza al siguiente usuario
    if (currentIndex < users.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleMatchClose = () => {
    setShowMatch(false);
    setMatchedUser(null);
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center mb-6">
          <Heart className="text-white" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">¡No hay más perfiles!</h2>
        <p className="text-slate-600 mb-6">Vuelve más tarde para descubrir nuevas personas.</p>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Profile Card */}
      <div className="flex-1 p-4">
        <div className="relative h-full bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Image */}
          <div className="relative h-full">
            <img 
              src={currentUser.images[0]} 
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
            
            {/* Profile Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl font-bold">{currentUser.name}, {currentUser.age}</h2>
                {currentUser.isVerified && (
                  <ShieldCheck className="text-blue-400" size={24} />
                )}
              </div>
              
              <div className="flex items-center gap-1 mb-3 text-white/90">
                <MapPin size={16} />
                <span className="text-sm">{currentUser.location} • {currentUser.distance}</span>
              </div>
              
              <p className="text-sm text-white/90 mb-4 line-clamp-3">{currentUser.bio}</p>
              
              {/* Interests */}
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.slice(0, 3).map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-6 pb-6 px-4">
        <button
          onClick={() => handleAction('pass')}
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <X className="text-slate-400" size={28} />
        </button>
        
        <button
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Star className="text-blue-500" size={24} />
        </button>
        
        <button
          onClick={() => handleAction('like')}
          className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart className="text-white" size={28} />
        </button>
      </div>

      {/* Match Modal */}
      {showMatch && matchedUser && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 mx-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">¡Es un Match!</h3>
            <p className="text-slate-600 mb-6">A ti y a {matchedUser.name} también le gustas.</p>
            <div className="flex gap-3">
              <button
                onClick={handleMatchClose}
                className="flex-1 py-3 px-6 border border-slate-200 rounded-full text-slate-600 font-medium"
              >
                Seguir viendo
              </button>
              <button
                onClick={handleMatchClose}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full font-medium"
              >
                Enviar mensaje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discovery;