import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  RotateCcw, 
  Zap, 
  Eye, 
  MapPin, 
  Heart,
  Star,
  X,
  Check,
  Sparkles
} from 'lucide-react';
import { obtenerEstadoPremium, activarBoost } from '../services/premiumService';

const PremiumFeatures = ({ userId, onClose }) => {
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [boostLoading, setBoostLoading] = useState(false);

  useEffect(() => {
    loadPremiumStatus();
  }, [userId]);

  const loadPremiumStatus = async () => {
    if (!userId) return;
    
    try {
      const status = await obtenerEstadoPremium(userId);
      setPremiumStatus(status);
    } catch (error) {
      console.error('Error loading premium status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBoost = async (type = 'normal') => {
    setBoostLoading(true);
    
    try {
      const result = await activarBoost(userId, type);
      
      if (result.success) {
        // Mostrar éxito y actualizar estado
        await loadPremiumStatus();
      } else {
        console.error('Error activating boost:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setBoostLoading(false);
    }
  };

  const features = [
    {
      id: 'unlimited-likes',
      icon: Heart,
      title: 'Likes Ilimitados',
      description: 'Da todos los likes que quieras sin límites diarios',
      available: premiumStatus?.features.unlimitedLikes,
      color: 'text-pink-500'
    },
    {
      id: 'rewind',
      icon: RotateCcw,
      title: 'Rewind',
      description: 'Deshaz tu último swipe y recupera perfiles',
      available: premiumStatus?.features.rewind,
      usage: `${premiumStatus?.usage.rewindsUsed || 0}/${premiumStatus?.limits.monthlyRewinds || 0}`,
      color: 'text-yellow-500'
    },
    {
      id: 'boost',
      icon: Zap,
      title: 'Boost',
      description: 'Sé uno de los perfiles más vistos en tu área por 30 minutos',
      available: premiumStatus?.features.boost,
      usage: `${premiumStatus?.usage.boostsUsed || 0}/${premiumStatus?.limits.monthlyBoosts || 0}`,
      color: 'text-purple-500',
      action: () => handleBoost('normal')
    },
    {
      id: 'super-boost',
      icon: Sparkles,
      title: 'Super Boost',
      description: 'Máxima visibilidad por 3 horas - Solo Gold',
      available: premiumStatus?.features.superBoost,
      usage: `${premiumStatus?.usage.superBoostsUsed || 0}/1`,
      color: 'text-orange-500',
      action: () => handleBoost('super')
    },
    {
      id: 'likes-you',
      icon: Eye,
      title: 'Ver Quién Te Gusta',
      description: 'Ve todos los perfiles que te dieron like',
      available: premiumStatus?.features.seeWhoLikesYou,
      color: 'text-blue-500'
    },
    {
      id: 'passport',
      icon: MapPin,
      title: 'Passport',
      description: 'Cambia tu ubicación y conoce gente de cualquier lugar',
      available: premiumStatus?.features.passport,
      color: 'text-green-500'
    }
  ];

  const plans = [
    {
      id: 'plus',
      name: 'CitaRD Plus',
      price: '$9.99',
      period: '/mes',
      color: 'from-pink-500 to-purple-600',
      features: ['Likes Ilimitados', 'Rewind', 'Boost Mensual', 'Ver Quién Te Gusta'],
      popular: false
    },
    {
      id: 'gold',
      name: 'CitaRD Gold',
      price: '$19.99',
      period: '/mes',
      color: 'from-yellow-500 to-orange-600',
      features: ['Todo de Plus', 'Super Boost', 'Passport', 'Top Picks', 'Prioridad en Matches'],
      popular: true
    }
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando funciones premium...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <Crown className="text-yellow-300" size={32} />
              <div>
                <h2 className="text-2xl font-bold">Funciones Premium</h2>
                <p className="text-white/90">
                  {premiumStatus?.isPremium 
                    ? `Plan ${premiumStatus.plan.toUpperCase()} activo`
                    : 'Desbloquea todo el potencial de CitaRD'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Current Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tus Funciones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.id}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        feature.available
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${feature.available ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Icon className={feature.available ? 'text-green-600' : 'text-gray-400'} size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{feature.title}</h4>
                            {feature.available && <Check className="text-green-500" size={16} />}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                          
                          {feature.usage && (
                            <div className="text-xs text-gray-500 mb-2">
                              Usado: {feature.usage}
                            </div>
                          )}
                          
                          {feature.action && feature.available && (
                            <button
                              onClick={feature.action}
                              disabled={boostLoading}
                              className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full hover:shadow-lg transition-all disabled:opacity-50"
                            >
                              {boostLoading ? 'Activando...' : 'Activar'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subscription Plans */}
            {!premiumStatus?.isPremium && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Planes de Suscripción</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative p-6 rounded-2xl border-2 ${
                        plan.popular ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Más Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center mb-4">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                          <span className="text-gray-600">{plan.period}</span>
                        </div>
                      </div>
                      
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <Check className="text-green-500" size={16} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <button className={`w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r ${plan.color} hover:shadow-lg transition-all`}>
                        Suscribirse
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PremiumFeatures;