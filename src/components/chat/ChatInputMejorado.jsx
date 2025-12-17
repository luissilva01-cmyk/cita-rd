// src/components/chat/ChatInputMejorado.jsx
import React, { useState, useRef } from "react";
import { Send, Smile, Paperclip, Mic, MicOff, Image } from "lucide-react";
import { enviarMensaje } from "../../services/chatService";
import { subirImagenCloudinary } from "../../services/uploadService";
import GifPicker from "../GifPicker";
import toast from "react-hot-toast";

export default function ChatInputMejorado({ chatId, currentUser, onMensajeEnviado }) {
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [tipoGifPicker, setTipoGifPicker] = useState("stickers");
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const enviarMensajeTexto = async () => {
    if (!mensaje.trim() || enviando) return;

    const textoMensaje = mensaje.trim();
    setMensaje("");
    setEnviando(true);

    try {
      await enviarMensaje(chatId, {
        senderId: currentUser.uid,
        tipo: "texto",
        contenido: textoMensaje,
        timestamp: new Date()
      });

      onMensajeEnviado?.();
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      toast.error("Error al enviar mensaje");
      setMensaje(textoMensaje); // Restaurar mensaje
    } finally {
      setEnviando(false);
    }
  };

  const enviarImagen = async (file) => {
    setEnviando(true);

    try {
      const resultado = await subirImagenCloudinary(file, "citard/chat");
      
      if (resultado.ok) {
        await enviarMensaje(chatId, {
          senderId: currentUser.uid,
          tipo: "imagen",
          contenido: resultado.url,
          timestamp: new Date()
        });

        onMensajeEnviado?.();
        toast.success("Imagen enviada");
      } else {
        toast.error("Error al subir imagen");
      }
    } catch (error) {
      console.error("Error enviando imagen:", error);
      toast.error("Error al enviar imagen");
    } finally {
      setEnviando(false);
    }
  };

  const iniciarGrabacion = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
        
        await enviarAudio(audioFile);
        
        // Detener stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setGrabando(true);
    } catch (error) {
      console.error("Error accediendo al micrófono:", error);
      toast.error("No se pudo acceder al micrófono");
    }
  };

  const detenerGrabacion = () => {
    if (mediaRecorderRef.current && grabando) {
      mediaRecorderRef.current.stop();
      setGrabando(false);
    }
  };

  const enviarAudio = async (audioFile) => {
    setEnviando(true);

    try {
      const resultado = await subirImagenCloudinary(audioFile, "citard/audio");
      
      if (resultado.ok) {
        await enviarMensaje(chatId, {
          senderId: currentUser.uid,
          tipo: "audio",
          contenido: resultado.url,
          timestamp: new Date()
        });

        onMensajeEnviado?.();
        toast.success("Audio enviado");
      } else {
        toast.error("Error al subir audio");
      }
    } catch (error) {
      console.error("Error enviando audio:", error);
      toast.error("Error al enviar audio");
    } finally {
      setEnviando(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        enviarImagen(file);
      } else {
        toast.error("Solo se permiten imágenes");
      }
    }
  };

  const handleGifSelect = async (gif) => {
    setEnviando(true);

    try {
      await enviarMensaje(chatId, {
        senderId: currentUser.uid,
        tipo: gif.tipo, // "sticker" o "gif"
        contenido: gif.contenido,
        metadata: {
          nombre: gif.nombre || gif.titulo
        },
        timestamp: new Date()
      });

      onMensajeEnviado?.();
    } catch (error) {
      console.error("Error enviando sticker/gif:", error);
      toast.error("Error al enviar");
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensajeTexto();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-end gap-2 p-4 bg-white border-t">
        
        {/* Botón adjuntar */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={enviando}
          className="p-2 text-gray-500 hover:text-orange-500 transition disabled:opacity-50"
        >
          <Paperclip size={20} />
        </button>

        {/* Input de archivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Área de texto */}
        <div className="flex-1 relative">
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent max-h-32"
            rows={1}
            disabled={enviando}
          />
          
          {/* Botón stickers/emojis */}
          <button
            onClick={() => {
              setTipoGifPicker("stickers");
              setShowGifPicker(true);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition"
          >
            <Smile size={20} />
          </button>
        </div>

        {/* Botón GIFs */}
        <button
          onClick={() => {
            setTipoGifPicker("gifs");
            setShowGifPicker(true);
          }}
          disabled={enviando}
          className="p-2 text-gray-500 hover:text-orange-500 transition disabled:opacity-50"
        >
          <Image size={20} />
        </button>

        {/* Botón micrófono */}
        <button
          onMouseDown={iniciarGrabacion}
          onMouseUp={detenerGrabacion}
          onMouseLeave={detenerGrabacion}
          disabled={enviando}
          className={`p-2 transition disabled:opacity-50 ${
            grabando 
              ? "text-red-500 bg-red-50 rounded-full" 
              : "text-gray-500 hover:text-orange-500"
          }`}
        >
          {grabando ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Botón enviar */}
        <button
          onClick={enviarMensajeTexto}
          disabled={!mensaje.trim() || enviando}
          className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>

      {/* Indicador de grabación */}
      {grabando && (
        <div className="absolute bottom-full left-0 right-0 bg-red-500 text-white text-center py-2 text-sm">
          🎤 Grabando audio... Suelta para enviar
        </div>
      )}

      {/* Picker de GIFs/Stickers */}
      <GifPicker
        isOpen={showGifPicker}
        onClose={() => setShowGifPicker(false)}
        onSelect={handleGifSelect}
        tipo={tipoGifPicker}
      />
    </div>
  );
}