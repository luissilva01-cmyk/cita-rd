// cita-rd/src/pages/Auth/Register.tsx - DISEÑO MODERNO UNIFICADO CON CONSENT MODAL
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import ConsentModal from "../../components/Legal/ConsentModal";
import { consentService, ConsentData } from "../../services/consentService";
import { createOrUpdateProfile } from "../../../../services/profileService";
import { UserProfile } from "../../../../types";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const navigate = useNavigate();

  // Función para calcular edad desde fecha de nacimiento
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword, birthDate } = formData;
    
    if (!name || !email || !password || !confirmPassword || !birthDate) {
      setError("Por favor completa todos los campos obligatorios.");
      return false;
    }
    
    if (name.length < 2) {
      setError("El nombre debe tener al menos 2 caracteres.");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Correo electrónico no válido.");
      return false;
    }
    
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    
    // Validar edad mínima (18 años)
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    if (age < 18) {
      setError("Debes ser mayor de 18 años para registrarte.");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Show consent modal instead of directly registering
    setShowConsentModal(true);
  };

  const handleConsentAccepted = async (consentData: ConsentData) => {
    setLoading(true);
    setError("");
    setShowConsentModal(false);
    
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      console.log("✅ Usuario registrado:", user.uid);

      // Crear perfil del usuario con datos del formulario
      const userProfile: UserProfile = {
        id: user.uid,
        name: formData.name, // ✅ Usar nombre del formulario
        age: calculateAge(formData.birthDate), // ✅ Calcular edad real
        bio: '',
        location: '',
        images: [],
        interests: [],
        isVerified: false
      };

      console.log("📝 Creando perfil:", userProfile);
      await createOrUpdateProfile(user.uid, userProfile);
      console.log("✅ Perfil creado exitosamente");

      // Save consent data to Firestore
      await consentService.saveConsent(user.uid, {
        ...consentData,
        userEmail: formData.email
      });

      console.log("✅ Consent data saved successfully");

      // Navigate to app (not profile, since profile is already created)
      navigate("/");
    } catch (firebaseErr: any) {
      let friendlyMessage = "Error al crear la cuenta.";
      
      switch (firebaseErr.code) {
        case 'auth/email-already-in-use':
          friendlyMessage = "Este correo ya está registrado. ¿Quieres iniciar sesión?";
          break;
        case 'auth/weak-password':
          friendlyMessage = "La contraseña es muy débil. Usa al menos 6 caracteres.";
          break;
        case 'auth/invalid-email':
          friendlyMessage = "El formato del correo no es válido.";
          break;
        case 'auth/operation-not-allowed':
          friendlyMessage = "El registro con email/contraseña no está habilitado. Contacta a soporte.";
          break;
        case 'auth/network-request-failed':
          friendlyMessage = "Error de conexión. Verifica tu internet e intenta de nuevo.";
          break;
        default:
          friendlyMessage = "Error al crear la cuenta. Por favor intenta de nuevo.";
      }
      
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          
          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
          }
          
          body {
            font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      
      <div 
        className="relative flex h-full min-h-screen w-full max-w-md mx-auto flex-col overflow-x-hidden shadow-xl"
        style={{ 
          backgroundColor: '#f8f6f6',
          fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
          color: '#1b110d',
          minHeight: 'max(884px, 100dvh)'
        }}
      >
        {/* TopAppBar */}
        <div 
          className="flex items-center px-4 py-4 justify-between sticky top-0 z-10 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(248, 246, 246, 0.95)' }}
        >
          <button 
            onClick={() => navigate(-1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            style={{ color: '#1b110d' }}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 
            className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10"
            style={{ color: '#1b110d' }}
          >
            Ta' Pa' Ti
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 flex flex-col px-6 pb-8">
          {/* HeadlineText */}
          <h1 
            className="tracking-tight text-[28px] md:text-[32px] font-extrabold leading-tight text-center pt-4 pb-2"
            style={{ color: '#1b110d' }}
          >
            ¿Quién ta' pa' ti? 💕
          </h1>
          
          {/* BodyText */}
          <p 
            className="text-base font-medium leading-normal pb-8 text-center"
            style={{ color: '#9a5f4c' }}
          >
            Únete a Ta' Pa' Ti y encuentra quien sí te elige.
          </p>



          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Form Fields */}
          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <label 
                className="text-sm font-semibold leading-normal"
                style={{ color: '#1b110d' }}
              >
                Nombre completo
              </label>
              <input
                className="form-input flex w-full rounded-xl border h-12 px-4 text-base focus:outline-none focus:ring-2 transition-all focus:ring-orange-200 focus:border-orange-500"
                style={{
                  borderColor: '#e7d5cf',
                  backgroundColor: '#ffffff',
                  color: '#1b110d'
                }}
                placeholder="Ej. María Rodriguez"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label 
                className="text-sm font-semibold leading-normal"
                style={{ color: '#1b110d' }}
              >
                Correo electrónico
              </label>
              <input
                className="form-input flex w-full rounded-xl border h-12 px-4 text-base focus:outline-none focus:ring-2 transition-all focus:ring-orange-200 focus:border-orange-500"
                style={{
                  borderColor: '#e7d5cf',
                  backgroundColor: '#ffffff',
                  color: '#1b110d'
                }}
                placeholder="ejemplo@correo.com"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            {/* Birth Date Field */}
            <div className="flex flex-col gap-2">
              <label 
                className="text-sm font-semibold leading-normal"
                style={{ color: '#1b110d' }}
              >
                Fecha de nacimiento
              </label>
              <input
                className="form-input flex w-full rounded-xl border h-12 px-4 text-base focus:outline-none focus:ring-2 transition-all focus:ring-orange-200 focus:border-orange-500"
                style={{
                  borderColor: '#e7d5cf',
                  backgroundColor: '#ffffff',
                  color: '#1b110d'
                }}
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                required
              />
              <p 
                className="text-xs mt-1"
                style={{ color: '#9a5f4c' }}
              >
                Debes ser mayor de 18 años
              </p>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label 
                className="text-sm font-semibold leading-normal"
                style={{ color: '#1b110d' }}
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  className="form-input flex w-full rounded-xl border h-12 px-4 pr-12 text-base focus:outline-none focus:ring-2 transition-all focus:ring-orange-200 focus:border-orange-500"
                  style={{
                    borderColor: '#e7d5cf',
                    backgroundColor: '#ffffff',
                    color: '#1b110d'
                  }}
                  placeholder="Mínimo 8 caracteres"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70"
                  style={{ color: '#9a5f4c' }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-2">
              <label 
                className="text-sm font-semibold leading-normal"
                style={{ color: '#1b110d' }}
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  className="form-input flex w-full rounded-xl border h-12 px-4 pr-12 text-base focus:outline-none focus:ring-2 transition-all focus:ring-orange-200 focus:border-orange-500"
                  style={{
                    borderColor: '#e7d5cf',
                    backgroundColor: '#ffffff',
                    color: '#1b110d'
                  }}
                  placeholder="Repite tu contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70"
                  style={{ color: '#9a5f4c' }}
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div 
              className="mt-2 text-xs text-center px-2"
              style={{ color: '#9a5f4c' }}
            >
              Al crear una cuenta, confirmo que soy mayor de 18 años y acepto los{" "}
              <Link 
                className="hover:underline"
                style={{ color: '#ec4913' }}
                to="/terms-of-service"
              >
                Términos de Servicio
              </Link>{" "}
              y la{" "}
              <Link 
                className="hover:underline"
                style={{ color: '#ec4913' }}
                to="/privacy-policy"
              >
                Política de Privacidad
              </Link>{" "}
              de Ta' Pa' Ti.
            </div>

            {/* Submit Button */}
            <button
              className="mt-4 w-full h-12 rounded-xl text-white font-bold text-base shadow-lg active:scale-[0.98] transition-all hover:bg-opacity-90"
              style={{ 
                backgroundColor: '#ec4913',
                boxShadow: '0 10px 25px rgba(236, 73, 19, 0.3)'
              }}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p 
              className="text-sm"
              style={{ color: '#9a5f4c' }}
            >
              ¿Ya tienes una cuenta?{" "}
              <Link 
                className="font-bold hover:underline ml-1"
                style={{ color: '#ec4913' }}
                to="/login"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
          <div className="h-10"></div>
        </div>

        {/* Consent Modal */}
        <ConsentModal
          isOpen={showConsentModal}
          onClose={() => setShowConsentModal(false)}
          onAccept={handleConsentAccepted}
          userEmail={formData.email}
        />
      </div>
    </>
  );
}