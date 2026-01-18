// cita-rd/src/components/Legal/LegalFooter.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Shield, Eye, FileText } from "lucide-react";

interface LegalFooterProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function LegalFooter({ className = "", style = {} }: LegalFooterProps) {
  return (
    <div 
      className={`px-6 py-4 border-t ${className}`}
      style={{ 
        borderColor: '#e7d5cf',
        backgroundColor: '#f8f6f6',
        ...style 
      }}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Legal Links */}
        <div className="flex items-center gap-6 text-xs">
          <Link
            to="/terms-of-service"
            className="flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: '#9a5f4c' }}
          >
            <FileText size={12} />
            <span>Términos</span>
          </Link>
          
          <Link
            to="/privacy-policy"
            className="flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: '#9a5f4c' }}
          >
            <Eye size={12} />
            <span>Privacidad</span>
          </Link>
          
          <div className="flex items-center gap-1" style={{ color: '#9a5f4c' }}>
            <Shield size={12} />
            <span>Seguro</span>
          </div>
        </div>
        
        {/* Copyright */}
        <p 
          className="text-xs text-center"
          style={{ color: '#9a5f4c' }}
        >
          © 2026 Ta' Pa' Ti. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}