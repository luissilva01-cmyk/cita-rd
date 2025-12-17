// src/components/comunes/Button.jsx
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary", 
  accent: "btn-accent",
  ghost: "glass text-white hover:bg-white/20",
  outline: "border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  xl: "px-12 py-5 text-xl"
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = "left",
  onClick,
  className = "",
  ...props
}) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  const widthClasses = fullWidth ? "w-full" : "";
  
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`}
      {...props}
    >
      {loading && (
        <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 28 : 20} />
      )}
      
      {!loading && Icon && iconPosition === "left" && (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 28 : 20} />
      )}
      
      {children}
      
      {!loading && Icon && iconPosition === "right" && (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 28 : 20} />
      )}
    </motion.button>
  );
}

// Variantes específicas para casos comunes
export function PrimaryButton(props) {
  return <Button variant="primary" {...props} />;
}

export function SecondaryButton(props) {
  return <Button variant="secondary" {...props} />;
}

export function AccentButton(props) {
  return <Button variant="accent" {...props} />;
}

export function GhostButton(props) {
  return <Button variant="ghost" {...props} />;
}

export function OutlineButton(props) {
  return <Button variant="outline" {...props} />;
}