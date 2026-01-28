
import React, { useState } from 'react';
import { Sparkles, Wand2, Lightbulb, MessageSquareQuote, Loader2, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { getAIProfileFeedback } from '../../services/geminiService';
import { UserProfile } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface AICoachProps {
  profile: UserProfile;
}

const AICoach: React.FC<AICoachProps> = ({ profile }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleImprove = async () => {
    setLoading(true);
    try {
      const feedback = await getAIProfileFeedback(profile.bio, profile.interests);
      setResult(feedback);
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      // Fallback response
      const feedback = {
        feedback: "Tu perfil tiene potencial. Intenta ser más específico sobre tus pasiones y lo que buscas en una pareja.",
        improvedBio: "Amante del merengue y la buena comida dominicana. Disfruto de las noches de bachata y los domingos de playa. Busco a alguien auténtico para compartir aventuras y crear memorias juntos. 🇩🇴✨",
        icebreakers: [
          "¡Hola! Vi que también te gusta bailar, ¿cuál es tu ritmo favorito?",
          "¿Qué tal? Me encantó tu perfil, ¿conoces algún lugar bueno para comer mofongo?",
          "Hey! Veo que eres de Santo Domingo, ¿cuál es tu spot favorito en la Zona Colonial?"
        ]
      };
      setResult(feedback);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.improvedBio);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full pb-20">
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-rose-600 rounded-[32px] p-8 text-white mb-8 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Sparkles className="text-yellow-300" size={24} />
            </div>
            <h2 className="text-2xl font-black tracking-tight">{t('aiCoachTitle')}</h2>
          </div>
          <p className="text-sm text-indigo-100 opacity-90 leading-relaxed max-w-[240px]">
            {t('makeProfileAwesome')}
          </p>
        </div>
        <Sparkles className="absolute -bottom-6 -right-6 opacity-10 text-white group-hover:scale-110 transition-transform duration-700" size={160} />
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-rose-500 rounded-full"></div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado de tu Bio</label>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm text-slate-600 italic leading-relaxed">"{profile.bio}"</p>
          </div>
        </div>

        <button 
          onClick={handleImprove}
          disabled={loading}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-95"
        >
          {loading ? <RefreshCw className="animate-spin" size={20} /> : <Wand2 size={20} />}
          {loading ? t('analyzing') : t('improveProfile')}
        </button>
      </div>

      {result ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="bg-white rounded-3xl p-6 shadow-sm border-t-4 border-indigo-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Lightbulb size={20} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">{t('feedback')}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{result.feedback}</p>
          </section>

          <section className="bg-white rounded-3xl p-6 shadow-sm border-t-4 border-emerald-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Sparkles size={20} />
                </div>
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">{t('improvedBio')}</h3>
              </div>
              <button 
                onClick={copyToClipboard}
                className={`p-2 rounded-lg transition-colors ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 hover:text-emerald-500'}`}
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl italic text-slate-700 text-sm leading-relaxed border border-slate-100">
              "{result.improvedBio}"
            </div>
          </section>

          <section className="bg-white rounded-3xl p-6 shadow-sm border-t-4 border-rose-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <MessageSquareQuote size={20} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">{t('icebreakers')}</h3>
            </div>
            <div className="space-y-3">
              {result.icebreakers.map((ice: string, i: number) => (
                <div key={i} className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-snug">
                  {ice}
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : !loading && (
        <div className="text-center py-12 px-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-slate-300" size={32} />
          </div>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            Pulsa el botón de arriba y deja que la IA transforme tu presencia en Ta' Pa' Ti.
          </p>
        </div>
      )}
    </div>
  );
};

export default AICoach;
