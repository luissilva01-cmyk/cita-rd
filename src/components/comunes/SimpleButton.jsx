// src/components/comunes/SimpleButton.jsx
import { motion } from "framer-motion";

export default function SimpleButton({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md", 
  className = "",
  disabled = false,
  ...props 
}) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 shadow-lg hover:shadow-xl",
    accent: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl",
    ghost: "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm",
    outline: "border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base", 
    lg: "px-8 py-4 text-lg",
    xl: "px-12 py-5 text-xl"
  };

  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}