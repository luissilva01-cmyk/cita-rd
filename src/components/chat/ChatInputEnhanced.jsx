import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Image, 
  Mic, 
  Smile, 
  Paperclip,
  X,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { enviarMensaje, enviarFoto, enviarGif, enviarMensajeVoz } from '../../services/chatServiceEnhanced';
import GifPicker from '../GifPicker';

const ChatInputEnhanced = ({ 
  chatId, 
  userId, 
  onMessageSent,
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageCaption, setImageCaption] = useState('');
  const [sending, setSending] = useState(false);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      await enviarMensaje(chatId, {
        uid: userId,
        text: message.trim()
      });
      
      setMessage('');
      if (onMessageSent) onMessageSent();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  };

  const handleSendImage = async () => {
    if (!selectedImage || sending) return;

    setSending(true);
    try {
      await enviarFoto(chatId, userId, selectedImage, imageCaption);
      
      setSelectedImage(null);
      setImageCaption('');
      if (onMessageSent) onMessageSent();
    } catch (error) {
      console.error('Error sending image:', error);
    } finally {
      setSending(false);
    }
  };

  const handleGifSelect = async (gifUrl, gifTitle) => {
    if (sending) return;

    setSending(true);
    try {
      await enviarGif(chatId, userId, gifUrl, gifTitle);
      
      setShowGifPicker(false);
      if (onMessageSent) onMessageSent();
    } catch (error) {
      console.error('Error sending GIF:', error);
    } finally {
      setSending(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        if (recordingTime >= 1) { // Mínimo 1 segundo
          setSending(true);
          try {
            await enviarMensajeVoz(chatId, userId, audioBlob, recordingTime);
            if (onMessageSent) onMessageSent();
          } catch (error) {
            console.error('Error sending voice message:', error);
          } finally {
            setSending(false);
          }
        }
        
        // Limpiar
        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Contador de tiempo
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (disabled) {
    return (
      <div className="p-4 bg-gray-100 text-center text-gray-500">
        Chat no disponible
      </div>
    );
  }

  return (
    <div className="bg-white border-t border-gray-200">
      {/* Image Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-b border-gray-200"
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                >
                  <X size={12} />
                </button>
              </div>
              
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Agregar descripción..."
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSendImage}
                    disabled={sending}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
                  >
                    {sending ? 'Enviando...' : 'Enviar Foto'}
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Interface */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-red-50 border-b border-red-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 font-medium">
                  Grabando: {formatRecordingTime(recordingTime)}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={cancelRecording}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={stopRecording}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Enviar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input */}
      <div className="p-4">
        <div className="flex items-end gap-3">
          {/* Attachment Button */}
          <div className="relative">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={sending || isRecording}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <Paperclip size={20} />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Image Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={sending || isRecording}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <Image size={20} />
          </button>

          {/* GIF Button */}
          <button
            onClick={() => setShowGifPicker(!showGifPicker)}
            disabled={sending || isRecording}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <Smile size={20} />
          </button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe un mensaje..."
              disabled={sending || isRecording}
              className="w-full p-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
            />
          </div>

          {/* Send/Voice Button */}
          {message.trim() ? (
            <button
              onClick={handleSendMessage}
              disabled={sending}
              className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors disabled:opacity-50"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          ) : (
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={sending}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50 ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>

      {/* GIF Picker */}
      <AnimatePresence>
        {showGifPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 300 }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200"
          >
            <GifPicker
              onGifSelect={handleGifSelect}
              onClose={() => setShowGifPicker(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInputEnhanced;