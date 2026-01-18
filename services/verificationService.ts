// cita-rd/services/verificationService.ts
export interface VerificationAttempt {
  id: string;
  userId: string;
  selfieUrl: string;
  profilePhotos: string[];
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  confidence: number; // 0-100
  createdAt: Date;
  processedAt?: Date;
  rejectionReason?: string;
  verificationSteps: VerificationStep[];
}

export interface VerificationStep {
  step: 'face_detection' | 'face_comparison' | 'liveness_check' | 'quality_check';
  status: 'pending' | 'passed' | 'failed';
  confidence: number;
  details?: string;
}

export interface UserVerification {
  userId: string;
  isVerified: boolean;
  verifiedAt?: Date;
  verificationLevel: 'none' | 'basic';
  attempts: number;
  lastAttemptAt?: Date;
  badge: {
    type: 'verified' | 'premium_verified';
    color: string;
    icon: string;
  };
}

class VerificationService {
  private verifications: Map<string, UserVerification> = new Map();
  private attempts: VerificationAttempt[] = [];

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Usuarios demo con diferentes estados de verificación
    const demoVerifications: UserVerification[] = [
      {
        userId: 'demo-user',
        isVerified: false,
        verificationLevel: 'none',
        attempts: 0,
        badge: {
          type: 'verified',
          color: '#3B82F6',
          icon: 'verified'
        }
      },
      {
        userId: 'user1',
        isVerified: true,
        verifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
        verificationLevel: 'basic',
        attempts: 1,
        lastAttemptAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        badge: {
          type: 'verified',
          color: '#3B82F6',
          icon: 'verified'
        }
      },
      {
        userId: 'user2',
        isVerified: false,
        verificationLevel: 'none',
        attempts: 2,
        lastAttemptAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        badge: {
          type: 'verified',
          color: '#3B82F6',
          icon: 'verified'
        }
      },
      {
        userId: 'user3',
        isVerified: true,
        verifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        verificationLevel: 'basic',
        attempts: 1,
        lastAttemptAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        badge: {
          type: 'verified',
          color: '#3B82F6',
          icon: 'shield_check'
        }
      }
    ];

    demoVerifications.forEach(verification => {
      this.verifications.set(verification.userId, verification);
    });
  }

  // Obtener estado de verificación de un usuario
  async getUserVerification(userId: string): Promise<UserVerification> {
    console.log('🔍 Obteniendo verificación para usuario:', userId);
    
    let verification = this.verifications.get(userId);
    
    if (!verification) {
      // Crear verificación por defecto
      verification = {
        userId,
        isVerified: false,
        verificationLevel: 'none',
        attempts: 0,
        badge: {
          type: 'verified',
          color: '#3B82F6',
          icon: 'verified'
        }
      };
      this.verifications.set(userId, verification);
    }

    console.log('✅ Verificación obtenida:', verification);
    return verification;
  }

  // Iniciar proceso de verificación
  async startVerification(userId: string, selfieBlob: Blob, profilePhotos: string[]): Promise<VerificationAttempt> {
    console.log('🚀 Iniciando verificación para usuario:', userId);
    
    // Convertir blob a URL (en producción se subiría a un servidor)
    const selfieUrl = URL.createObjectURL(selfieBlob);
    
    const attempt: VerificationAttempt = {
      id: `verification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      selfieUrl,
      profilePhotos,
      status: 'processing',
      confidence: 0,
      createdAt: new Date(),
      verificationSteps: [
        { step: 'face_detection', status: 'pending', confidence: 0 },
        { step: 'quality_check', status: 'pending', confidence: 0 },
        { step: 'liveness_check', status: 'pending', confidence: 0 },
        { step: 'face_comparison', status: 'pending', confidence: 0 }
      ]
    };

    this.attempts.push(attempt);
    
    // Actualizar contador de intentos
    const userVerification = await this.getUserVerification(userId);
    userVerification.attempts += 1;
    userVerification.lastAttemptAt = new Date();
    this.verifications.set(userId, userVerification);

    // Simular procesamiento
    this.processVerification(attempt);
    
    console.log('✅ Verificación iniciada:', attempt.id);
    return attempt;
  }

  // Procesar verificación (simulado)
  private async processVerification(attempt: VerificationAttempt): Promise<void> {
    console.log('⚙️ Procesando verificación:', attempt.id);
    
    // Simular procesamiento paso a paso
    const steps = attempt.verificationSteps;
    
    // Paso 1: Detección de rostro
    await this.delay(1000);
    steps[0].status = 'passed';
    steps[0].confidence = 95;
    steps[0].details = 'Rostro detectado correctamente';
    
    // Paso 2: Verificación de calidad
    await this.delay(1500);
    steps[1].status = 'passed';
    steps[1].confidence = 88;
    steps[1].details = 'Imagen de alta calidad';
    
    // Paso 3: Verificación de vida (liveness)
    await this.delay(2000);
    steps[2].status = 'passed';
    steps[2].confidence = 92;
    steps[2].details = 'Persona real detectada';
    
    // Paso 4: Comparación facial
    await this.delay(2500);
    const comparisonSuccess = Math.random() > 0.2; // 80% de éxito
    
    if (comparisonSuccess) {
      steps[3].status = 'passed';
      steps[3].confidence = 89;
      steps[3].details = 'Coincidencia facial confirmada';
      
      // Calcular confianza general
      const avgConfidence = steps.reduce((sum, step) => sum + step.confidence, 0) / steps.length;
      attempt.confidence = Math.round(avgConfidence);
      attempt.status = 'approved';
      attempt.processedAt = new Date();
      
      // Marcar usuario como verificado
      await this.approveVerification(attempt.userId);
      
    } else {
      steps[3].status = 'failed';
      steps[3].confidence = 45;
      steps[3].details = 'No se pudo confirmar la coincidencia facial';
      
      attempt.status = 'rejected';
      attempt.confidence = 45;
      attempt.rejectionReason = 'La foto no coincide con las imágenes del perfil';
      attempt.processedAt = new Date();
    }
    
    console.log('✅ Verificación procesada:', attempt.status);
  }

  // Aprobar verificación
  private async approveVerification(userId: string): Promise<void> {
    const verification = await this.getUserVerification(userId);
    verification.isVerified = true;
    verification.verifiedAt = new Date();
    verification.verificationLevel = 'basic';
    verification.badge = {
      type: 'verified',
      color: '#3B82F6',
      icon: 'shield_check'
    };
    
    this.verifications.set(userId, verification);
  }

  // Obtener intento de verificación
  async getVerificationAttempt(attemptId: string): Promise<VerificationAttempt | null> {
    return this.attempts.find(attempt => attempt.id === attemptId) || null;
  }

  // Obtener historial de intentos de un usuario
  async getUserAttempts(userId: string): Promise<VerificationAttempt[]> {
    return this.attempts
      .filter(attempt => attempt.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Verificar si un usuario puede intentar verificarse
  async canAttemptVerification(userId: string): Promise<{ canAttempt: boolean; reason?: string; nextAttemptAt?: Date }> {
    const verification = await this.getUserVerification(userId);
    
    if (verification.isVerified) {
      return {
        canAttempt: false,
        reason: 'Ya estás verificado'
      };
    }
    
    if (verification.attempts >= 3) {
      const nextAttempt = new Date(verification.lastAttemptAt!.getTime() + 24 * 60 * 60 * 1000); // 24 horas
      if (new Date() < nextAttempt) {
        return {
          canAttempt: false,
          reason: 'Demasiados intentos. Inténtalo más tarde.',
          nextAttemptAt: nextAttempt
        };
      }
    }
    
    return { canAttempt: true };
  }

  // Obtener estadísticas de verificación
  async getVerificationStats(): Promise<{
    totalUsers: number;
    verifiedUsers: number;
    verificationRate: number;
    pendingAttempts: number;
  }> {
    const totalUsers = this.verifications.size;
    const verifiedUsers = Array.from(this.verifications.values())
      .filter(v => v.isVerified).length;
    const verificationRate = totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0;
    const pendingAttempts = this.attempts.filter(a => a.status === 'pending' || a.status === 'processing').length;

    return {
      totalUsers,
      verifiedUsers,
      verificationRate: Math.round(verificationRate),
      pendingAttempts
    };
  }

  // Función auxiliar para delays
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Verificar si un usuario está verificado (función rápida)
  isUserVerified(userId: string): boolean {
    const verification = this.verifications.get(userId);
    return verification?.isVerified || false;
  }

  // Obtener badge de verificación
  getVerificationBadge(userId: string): { type: string; color: string; icon: string } | null {
    const verification = this.verifications.get(userId);
    return verification?.isVerified ? verification.badge : null;
  }

  // 🧪 MÉTODO DE DESARROLLO: Limpiar verificación de prueba
  resetUserVerification(userId: string): void {
    console.log('🔄 Limpiando verificación de prueba para usuario:', userId);
    
    // Eliminar verificación del usuario
    this.verifications.delete(userId);
    
    // Eliminar intentos del usuario
    this.attempts = this.attempts.filter(attempt => attempt.userId !== userId);
    
    // Limpiar localStorage si existe
    try {
      localStorage.removeItem(`verification_${userId}`);
      localStorage.removeItem(`verification_attempts_${userId}`);
    } catch (error) {
      console.warn('No se pudo limpiar localStorage:', error);
    }
    
    console.log('✅ Verificación limpiada exitosamente');
  }

  // 🧪 MÉTODO DE DESARROLLO: Limpiar todas las verificaciones
  resetAllVerifications(): void {
    console.log('🔄 Limpiando TODAS las verificaciones de prueba...');
    
    this.verifications.clear();
    this.attempts = [];
    
    // Reinicializar datos demo
    this.initializeDemoData();
    
    // Limpiar localStorage
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('verification_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('No se pudo limpiar localStorage:', error);
    }
    
    console.log('✅ Todas las verificaciones limpiadas');
  }
}

// Instancia singleton
export const verificationService = new VerificationService();
export default verificationService;