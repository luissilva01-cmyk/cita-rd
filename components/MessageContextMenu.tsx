import React from 'react';
import { Trash2, UserX, Copy } from 'lucide-react';

interface MessageContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  isOwnMessage: boolean;
  onDeleteForMe: () => void;
  onDeleteForEveryone: () => void;
  onCopy: () => void;
  onClose: () => void;
}

const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  isOpen,
  position,
  isOwnMessage,
  onDeleteForMe,
  onDeleteForEveryone,
  onCopy,
  onClose
}) => {
  if (!isOpen) return null;

  // Calcular si el menú debe aparecer arriba o abajo
  const menuHeight = isOwnMessage ? 180 : 140; // Altura aproximada del menú
  const spaceAbove = position.y;
  const spaceBelow = window.innerHeight - position.y;
  const showBelow = spaceAbove < menuHeight && spaceBelow > menuHeight;

  // Ajustar posición horizontal para que no se salga de la pantalla
  let adjustedX = position.x;
  const menuWidth = 220;
  const halfWidth = menuWidth / 2;
  
  if (adjustedX - halfWidth < 10) {
    adjustedX = halfWidth + 10;
  } else if (adjustedX + halfWidth > window.innerWidth - 10) {
    adjustedX = window.innerWidth - halfWidth - 10;
  }

  return (
    <>
      {/* Overlay para cerrar el menú */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Menú contextual */}
      <div 
        className="fixed z-50 bg-white rounded-2xl py-2 min-w-[220px] animate-in fade-in zoom-in-95 duration-200"
        style={{
          top: showBelow ? `${position.y + 8}px` : 'auto',
          bottom: showBelow ? 'auto' : `${window.innerHeight - position.y + 8}px`,
          left: `${adjustedX}px`,
          transform: 'translateX(-50%)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(0, 0, 0, 0.15)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Copiar mensaje */}
        <button
          onClick={() => {
            onCopy();
            onClose();
          }}
          className="w-full px-5 py-3.5 text-left text-base font-medium text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors flex items-center gap-3"
        >
          <Copy size={20} className="text-slate-600" />
          Copiar mensaje
        </button>

        {/* Borrar para mí */}
        <button
          onClick={() => {
            onDeleteForMe();
            onClose();
          }}
          className="w-full px-5 py-3.5 text-left text-base font-medium text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors flex items-center gap-3"
        >
          <UserX size={20} className="text-slate-600" />
          Borrar para mí
        </button>

        {/* Borrar para todos (solo si es mensaje propio) */}
        {isOwnMessage && (
          <button
            onClick={() => {
              onDeleteForEveryone();
              onClose();
            }}
            className="w-full px-5 py-3.5 text-left text-base font-bold text-red-700 hover:bg-red-50 active:bg-red-100 transition-colors flex items-center gap-3 border-t-2 border-slate-200"
          >
            <Trash2 size={20} className="text-red-600" />
            Borrar para todos
          </button>
        )}
      </div>
    </>
  );
};

export default MessageContextMenu;
