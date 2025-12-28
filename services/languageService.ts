// cita-rd/services/languageService.ts
export type Language = 'es' | 'en' | 'pt' | 'fr';

export interface Translations {
  // Stories
  createStory: string;
  privacy: string;
  stories: string;
  
  // Create Story Modal
  createStoryTitle: string;
  whatTypeOfStory: string;
  text: string;
  photo: string;
  writeMessage: string;
  uploadImage: string;
  writeYourMessage: string;
  backgroundColor: string;
  textColor: string;
  back: string;
  publish: string;
  creating: string;
  changePhoto: string;
  
  // Privacy Settings
  storiesPrivacyTitle: string;
  whoCanSeeStories: string;
  everyone: string;
  everyoneDesc: string;
  matchesOnly: string;
  matchesOnlyDesc: string;
  closeFriends: string;
  closeFriendsDesc: string;
  comingSoon: string;
  storyReplies: string;
  allowReplies: string;
  allowRepliesDesc: string;
  onlineStatus: string;
  showOnlineStatus: string;
  showOnlineStatusDesc: string;
  privacyImportant: string;
  privacyImportantDesc: string;
  ready: string;
  saving: string;
  
  // Stories Viewer
  sendMessage: string;
  repliesDisabled: string;
  replyTo: string;
  
  // General
  loading: string;
  error: string;
  close: string;
  cancel: string;
  save: string;
  
  // Discovery
  optimizingProfiles: string;
  calculatingCompatibility: string;
  noProfilesAvailable: string;
  comeBackLater: string;
  errorLoadingProfile: string;
  technicalProblem: string;
  restart: string;
  pass: string;
  restartProfiles: string;
  like: string;
  
  // Match Modal
  itsAMatch: string;
  youAndUserLikedEachOther: string;
  keepWatching: string;
  
  // Language Settings
  language: string;
  selectLanguage: string;
  spanish: string;
  english: string;
  portuguese: string;
  french: string;
  
  // Identity Verification
  identityVerification: string;
  verifyIdentity: string;
  verified: string;
  verify: string;
  alreadyVerified: string;
  verificationSuccessful: string;
  verificationFailed: string;
  takeASelfie: string;
  cameraAccess: string;
  capture: string;
  processing: string;
  increasesVisibility: string;
  verificationBadge: string;
  greaterTrust: string;
  quickAndSecure: string;
  startVerification: string;
  activateCamera: string;
  positionYourFace: string;
  goodSelfieTitle: string;
  goodLighting: string;
  lookDirectly: string;
  neutralExpression: string;
  noSunglasses: string;
  processingVerification: string;
  analyzingPhoto: string;
  detectingFace: string;
  verifyingQuality: string;
  verifyingAuthenticity: string;
  comparingWithProfile: string;
  congratulations: string;
  identityVerified: string;
  verificationBadgeEarned: string;
  confidence: string;
  canTryAgain: string;
  followRecommendations: string;
  tryAgain: string;
  tooManyAttempts: string;
  tryLater: string;
  
  // Navigation & Main Views
  discover: string;
  matches: string;
  messages: string;
  profile: string;
  account: string;
  settings: string;
  
  // Profile & Account
  editProfile: string;
  myProfile: string;
  accountSettings: string;
  privacyAndSecurity: string;
  configurePrivacy: string;
  
  // Chat & Messages
  typeMessage: string;
  sendPhoto: string;
  sendGif: string;
  online: string;
  offline: string;
  lastSeen: string;
  typing: string;
  
  // Swipe Actions
  superLike: string;
  rewind: string;
  boost: string;
  
  // Common Actions
  edit: string;
  delete: string;
  report: string;
  block: string;
  unblock: string;
  
  // Time & Date
  now: string;
  today: string;
  yesterday: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
  
  // Notifications
  newMatch: string;
  newMessage: string;
  profileVisit: string;
  
  // Errors & Status
  connectionError: string;
  tryAgainLater: string;
  somethingWentWrong: string;
  noInternetConnection: string;
  
  // Messages & Matches
  noMatchesYet: string;
  whenYouMatch: string;
  newMatch: string;
  matchesCount: string;
  
  // Profile
  myPhotos: string;
  managePhotos: string;
  yearsOld: string;
  job: string;
  interests: string;
  bio: string;
  location: string;
  age: string;
  
  // Chat
  newMatchExclamation: string;
  sendFirstMessage: string;
  typeSomethingCool: string;
  
  // AI Coach
  aiCoachTitle: string;
  makeProfileAwesome: string;
  improveProfile: string;
  analyzing: string;
  feedback: string;
  improvedBio: string;
  icebreakers: string;
  copyBio: string;
  copied: string;
  tryAgain: string;
  
  // Account Settings - Missing translations
  yourStory: string;
  whyImportant: string;
  verificationIncreases: string;
  privacyControls: string;
  languagePersonalizes: string;
  yourAccountVerified: string;
  verifyForTrust: string;
  seeVerification: string;
  verifyNow: string;
  clearTestVerification: string;
  clearTestConfirm: string;
  testVerificationCleared: string;
  controlWhoSees: string;
  currentLanguage: string;
  changeLanguage: string;
}

const translations: Record<Language, Translations> = {
  es: {
    // Stories
    createStory: 'Crear Story',
    privacy: 'Privacidad',
    stories: 'Stories',
    
    // Create Story Modal
    createStoryTitle: 'Crear Story',
    whatTypeOfStory: '¿Qué tipo de story quieres crear?',
    text: 'Texto',
    photo: 'Foto',
    writeMessage: 'Escribe un mensaje',
    uploadImage: 'Sube una imagen',
    writeYourMessage: 'Escribe tu mensaje...',
    backgroundColor: 'Color de fondo',
    textColor: 'Color de texto',
    back: 'Atrás',
    publish: 'Publicar',
    creating: 'Creando...',
    changePhoto: 'Cambiar foto',
    
    // Privacy Settings
    storiesPrivacyTitle: 'Privacidad de Stories',
    whoCanSeeStories: '¿Quién puede ver tus Stories?',
    everyone: 'Todos',
    everyoneDesc: 'Cualquier usuario de la app puede ver tus Stories',
    matchesOnly: 'Solo Matches',
    matchesOnlyDesc: 'Solo personas con las que hiciste match pueden ver tus Stories',
    closeFriends: 'Amigos Cercanos',
    closeFriendsDesc: 'Solo tu lista de amigos cercanos puede ver tus Stories',
    comingSoon: 'Próximamente',
    storyReplies: 'Respuestas a Stories',
    allowReplies: 'Permitir respuestas',
    allowRepliesDesc: 'Los usuarios pueden responder a tus Stories con mensajes',
    onlineStatus: 'Estado en línea',
    showOnlineStatus: 'Mostrar cuando estoy en línea',
    showOnlineStatusDesc: 'Otros usuarios pueden ver si estás activo',
    privacyImportant: 'Tu privacidad es importante',
    privacyImportantDesc: 'Puedes cambiar estas configuraciones en cualquier momento. Los cambios se aplican inmediatamente a todas tus Stories futuras.',
    ready: 'Listo',
    saving: 'Guardando...',
    
    // Stories Viewer
    sendMessage: 'Enviar mensaje',
    repliesDisabled: 'Respuestas deshabilitadas',
    replyTo: 'Responder a',
    
    // General
    loading: 'Cargando...',
    error: 'Error',
    close: 'Cerrar',
    cancel: 'Cancelar',
    save: 'Guardar',
    
    // Discovery
    optimizingProfiles: 'Optimizando perfiles...',
    calculatingCompatibility: 'Calculando compatibilidad y calidad de perfiles',
    noProfilesAvailable: '¡No hay perfiles disponibles!',
    comeBackLater: 'Vuelve más tarde para descubrir nuevas personas.',
    errorLoadingProfile: 'Error cargando perfil',
    technicalProblem: 'Hay un problema técnico.',
    restart: 'Reiniciar',
    pass: 'Pasar',
    restartProfiles: 'Reiniciar perfiles',
    like: 'Me gusta',
    
    // Match Modal
    itsAMatch: '¡Es un Match!',
    youAndUserLikedEachOther: 'A ti y a {user} se gustaron mutuamente.',
    keepWatching: 'Seguir viendo',
    
    // Language Settings
    language: 'Idioma',
    selectLanguage: 'Seleccionar idioma',
    spanish: 'Español',
    english: 'English',
    portuguese: 'Português',
    french: 'Français',
    
    // Identity Verification
    identityVerification: 'Verificación de Identidad',
    verifyIdentity: 'Verifica tu identidad',
    verified: 'Verificado',
    verify: 'Verificar',
    alreadyVerified: '¡Ya estás verificado!',
    verificationSuccessful: '¡Verificación exitosa!',
    verificationFailed: 'Verificación fallida',
    takeASelfie: 'Toma una selfie para confirmar que eres una persona real',
    cameraAccess: 'Acceso a la cámara',
    capture: 'Capturar',
    processing: 'Procesando verificación',
    increasesVisibility: 'Aumenta tu visibilidad en un 300%',
    verificationBadge: 'Badge de verificación visible',
    greaterTrust: 'Mayor confianza de otros usuarios',
    quickAndSecure: 'Proceso rápido y seguro',
    startVerification: 'Comenzar verificación',
    activateCamera: 'Activar cámara',
    positionYourFace: 'Posiciona tu rostro dentro del círculo y presiona el botón para capturar',
    goodSelfieTitle: 'Consejos para una buena selfie:',
    goodLighting: 'Asegúrate de tener buena iluminación',
    lookDirectly: 'Mira directamente a la cámara',
    neutralExpression: 'Mantén una expresión neutral',
    noSunglasses: 'No uses lentes oscuros o sombreros',
    processingVerification: 'Procesando verificación',
    analyzingPhoto: 'Estamos analizando tu foto y comparándola con tu perfil',
    detectingFace: 'Detectando rostro',
    verifyingQuality: 'Verificando calidad',
    verifyingAuthenticity: 'Verificando autenticidad',
    comparingWithProfile: 'Comparando con perfil',
    congratulations: '¡Felicidades!',
    identityVerified: 'Tu identidad ha sido verificada exitosamente',
    verificationBadgeEarned: 'Ahora tienes un badge de verificación y mayor visibilidad',
    confidence: 'Confianza',
    canTryAgain: 'Puedes intentar nuevamente',
    followRecommendations: 'Asegúrate de seguir las recomendaciones para obtener una mejor foto',
    tryAgain: 'Intentar de nuevo',
    tooManyAttempts: 'Demasiados intentos. Inténtalo más tarde.',
    tryLater: 'Vuelve más tarde',
    
    // Navigation & Main Views
    discover: 'Descubrir',
    matches: 'Matches',
    messages: 'Mensajes',
    profile: 'Perfil',
    account: 'Cuenta',
    settings: 'Configuración',
    
    // Profile & Account
    editProfile: 'Editar Perfil',
    myProfile: 'Mi Perfil',
    accountSettings: 'Configuración de Cuenta',
    privacyAndSecurity: 'Privacidad y Seguridad',
    configurePrivacy: 'Configurar Privacidad',
    
    // Chat & Messages
    typeMessage: 'Escribe un mensaje...',
    sendPhoto: 'Enviar foto',
    sendGif: 'Enviar GIF',
    online: 'En línea',
    offline: 'Desconectado',
    lastSeen: 'Visto por última vez',
    typing: 'escribiendo...',
    
    // Swipe Actions
    superLike: 'Super Like',
    rewind: 'Rebobinar',
    boost: 'Impulsar',
    
    // Common Actions
    edit: 'Editar',
    delete: 'Eliminar',
    report: 'Reportar',
    block: 'Bloquear',
    unblock: 'Desbloquear',
    
    // Time & Date
    now: 'ahora',
    today: 'hoy',
    yesterday: 'ayer',
    minutesAgo: 'hace {minutes} min',
    hoursAgo: 'hace {hours}h',
    daysAgo: 'hace {days}d',
    
    // Notifications
    newMatch: 'Nuevo match',
    newMessage: 'Nuevo mensaje',
    profileVisit: 'Visitó tu perfil',
    
    // Errors & Status
    connectionError: 'Error de conexión',
    tryAgainLater: 'Inténtalo más tarde',
    somethingWentWrong: 'Algo salió mal',
    noInternetConnection: 'Sin conexión a internet',
    
    // Messages & Matches
    noMatchesYet: 'No tienes matches aún',
    whenYouMatch: 'Cuando hagas match con alguien, podrás chatear aquí.',
    newMatch: 'Nuevo match',
    matchesCount: '{count} matches',
    
    // Profile
    myPhotos: 'Mis Fotos',
    managePhotos: 'Gestionar Fotos',
    yearsOld: '{age} años',
    job: 'Trabajo',
    interests: 'Intereses',
    bio: 'Biografía',
    location: 'Ubicación',
    age: 'Edad',
    
    // Chat
    newMatchExclamation: '¡Nuevo Match!',
    sendFirstMessage: 'Envía el primer mensaje a {name}',
    typeSomethingCool: 'Escribe algo bacano...',
    
    // AI Coach
    aiCoachTitle: 'AI Coach RD',
    makeProfileAwesome: 'Hagamos que tu perfil sea lo más bacano de todo el país.',
    improveProfile: 'Mejorar Perfil',
    analyzing: 'Analizando...',
    feedback: 'Retroalimentación',
    improvedBio: 'Biografía Mejorada',
    icebreakers: 'Rompehielos',
    copyBio: 'Copiar Biografía',
    copied: '¡Copiado!',
    tryAgain: 'Intentar de nuevo',
    
    // Account Settings - Missing translations
    yourStory: 'Tu Story',
    whyImportant: '¿Por qué es importante?',
    verificationIncreases: 'La verificación aumenta tu visibilidad y confianza',
    privacyControls: 'La privacidad te permite controlar tu experiencia',
    languagePersonalizes: 'El idioma personaliza la interfaz a tu preferencia',
    yourAccountVerified: 'Tu cuenta está verificada',
    verifyForTrust: 'Verifica tu identidad para mayor confianza',
    seeVerification: 'Ver Verificación',
    verifyNow: 'Verificar Ahora',
    clearTestVerification: 'Limpiar Verificación de Prueba',
    clearTestConfirm: '¿Estás seguro de que quieres limpiar la verificación de prueba?',
    testVerificationCleared: '✅ Verificación de prueba limpiada exitosamente',
    controlWhoSees: 'Controla quién puede ver tu contenido',
    currentLanguage: 'Idioma actual',
    changeLanguage: 'Cambiar Idioma'
  },
  
  en: {
    // Stories
    createStory: 'Create Story',
    privacy: 'Privacy',
    stories: 'Stories',
    
    // Create Story Modal
    createStoryTitle: 'Create Story',
    whatTypeOfStory: 'What type of story do you want to create?',
    text: 'Text',
    photo: 'Photo',
    writeMessage: 'Write a message',
    uploadImage: 'Upload an image',
    writeYourMessage: 'Write your message...',
    backgroundColor: 'Background color',
    textColor: 'Text color',
    back: 'Back',
    publish: 'Publish',
    creating: 'Creating...',
    changePhoto: 'Change photo',
    
    // Privacy Settings
    storiesPrivacyTitle: 'Stories Privacy',
    whoCanSeeStories: 'Who can see your Stories?',
    everyone: 'Everyone',
    everyoneDesc: 'Any app user can see your Stories',
    matchesOnly: 'Matches Only',
    matchesOnlyDesc: 'Only people you matched with can see your Stories',
    closeFriends: 'Close Friends',
    closeFriendsDesc: 'Only your close friends list can see your Stories',
    comingSoon: 'Coming Soon',
    storyReplies: 'Story Replies',
    allowReplies: 'Allow replies',
    allowRepliesDesc: 'Users can reply to your Stories with messages',
    onlineStatus: 'Online status',
    showOnlineStatus: 'Show when I\'m online',
    showOnlineStatusDesc: 'Other users can see if you\'re active',
    privacyImportant: 'Your privacy is important',
    privacyImportantDesc: 'You can change these settings anytime. Changes apply immediately to all your future Stories.',
    ready: 'Done',
    saving: 'Saving...',
    
    // Stories Viewer
    sendMessage: 'Send message',
    repliesDisabled: 'Replies disabled',
    replyTo: 'Reply to',
    
    // General
    loading: 'Loading...',
    error: 'Error',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    
    // Discovery
    optimizingProfiles: 'Optimizing profiles...',
    calculatingCompatibility: 'Calculating compatibility and profile quality',
    noProfilesAvailable: 'No profiles available!',
    comeBackLater: 'Come back later to discover new people.',
    errorLoadingProfile: 'Error loading profile',
    technicalProblem: 'There\'s a technical problem.',
    restart: 'Restart',
    pass: 'Pass',
    restartProfiles: 'Restart profiles',
    like: 'Like',
    
    // Match Modal
    itsAMatch: 'It\'s a Match!',
    youAndUserLikedEachOther: 'You and {user} liked each other.',
    keepWatching: 'Keep swiping',
    
    // Language Settings
    language: 'Language',
    selectLanguage: 'Select language',
    spanish: 'Español',
    english: 'English',
    portuguese: 'Português',
    french: 'Français',
    
    // Identity Verification
    identityVerification: 'Identity Verification',
    verifyIdentity: 'Verify your identity',
    verified: 'Verified',
    verify: 'Verify',
    alreadyVerified: 'Already verified!',
    verificationSuccessful: 'Verification successful!',
    verificationFailed: 'Verification failed',
    takeASelfie: 'Take a selfie to confirm you are a real person',
    cameraAccess: 'Camera access',
    capture: 'Capture',
    processing: 'Processing verification',
    increasesVisibility: 'Increases your visibility by 300%',
    verificationBadge: 'Visible verification badge',
    greaterTrust: 'Greater trust from other users',
    quickAndSecure: 'Quick and secure process',
    startVerification: 'Start verification',
    activateCamera: 'Activate camera',
    positionYourFace: 'Position your face within the circle and press the button to capture',
    goodSelfieTitle: 'Tips for a good selfie:',
    goodLighting: 'Make sure you have good lighting',
    lookDirectly: 'Look directly at the camera',
    neutralExpression: 'Keep a neutral expression',
    noSunglasses: 'Don\'t wear sunglasses or hats',
    processingVerification: 'Processing verification',
    analyzingPhoto: 'We are analyzing your photo and comparing it with your profile',
    detectingFace: 'Detecting face',
    verifyingQuality: 'Verifying quality',
    verifyingAuthenticity: 'Verifying authenticity',
    comparingWithProfile: 'Comparing with profile',
    congratulations: 'Congratulations!',
    identityVerified: 'Your identity has been successfully verified',
    verificationBadgeEarned: 'You now have a verification badge and greater visibility',
    confidence: 'Confidence',
    canTryAgain: 'You can try again',
    followRecommendations: 'Make sure to follow the recommendations to get a better photo',
    tryAgain: 'Try again',
    tooManyAttempts: 'Too many attempts. Try again later.',
    tryLater: 'Come back later',
    
    // Navigation & Main Views
    discover: 'Discover',
    matches: 'Matches',
    messages: 'Messages',
    profile: 'Profile',
    account: 'Account',
    settings: 'Settings',
    
    // Profile & Account
    editProfile: 'Edit Profile',
    myProfile: 'My Profile',
    accountSettings: 'Account Settings',
    privacyAndSecurity: 'Privacy and Security',
    configurePrivacy: 'Configure Privacy',
    
    // Chat & Messages
    typeMessage: 'Type a message...',
    sendPhoto: 'Send photo',
    sendGif: 'Send GIF',
    online: 'Online',
    offline: 'Offline',
    lastSeen: 'Last seen',
    typing: 'typing...',
    
    // Swipe Actions
    superLike: 'Super Like',
    rewind: 'Rewind',
    boost: 'Boost',
    
    // Common Actions
    edit: 'Edit',
    delete: 'Delete',
    report: 'Report',
    block: 'Block',
    unblock: 'Unblock',
    
    // Time & Date
    now: 'now',
    today: 'today',
    yesterday: 'yesterday',
    minutesAgo: '{minutes}m ago',
    hoursAgo: '{hours}h ago',
    daysAgo: '{days}d ago',
    
    // Notifications
    newMatch: 'New match',
    newMessage: 'New message',
    profileVisit: 'Visited your profile',
    
    // Errors & Status
    connectionError: 'Connection error',
    tryAgainLater: 'Try again later',
    somethingWentWrong: 'Something went wrong',
    noInternetConnection: 'No internet connection',
    
    // Messages & Matches
    noMatchesYet: 'No matches yet',
    whenYouMatch: 'When you match with someone, you can chat here.',
    newMatch: 'New match',
    matchesCount: '{count} matches',
    
    // Profile
    myPhotos: 'My Photos',
    managePhotos: 'Manage Photos',
    yearsOld: '{age} years old',
    job: 'Job',
    interests: 'Interests',
    bio: 'Bio',
    location: 'Location',
    age: 'Age',
    
    // Chat
    newMatchExclamation: 'New Match!',
    sendFirstMessage: 'Send the first message to {name}',
    typeSomethingCool: 'Type something cool...',
    
    // AI Coach
    aiCoachTitle: 'AI Coach RD',
    makeProfileAwesome: 'Let\'s make your profile the most awesome in the whole country.',
    improveProfile: 'Improve Profile',
    analyzing: 'Analyzing...',
    feedback: 'Feedback',
    improvedBio: 'Improved Bio',
    icebreakers: 'Icebreakers',
    copyBio: 'Copy Bio',
    copied: 'Copied!',
    tryAgain: 'Try Again',
    
    // Account Settings - Missing translations
    yourStory: 'Your Story',
    whyImportant: 'Why is it important?',
    verificationIncreases: 'Verification increases your visibility and trust',
    privacyControls: 'Privacy allows you to control your experience',
    languagePersonalizes: 'Language personalizes the interface to your preference',
    yourAccountVerified: 'Your account is verified',
    verifyForTrust: 'Verify your identity for greater trust',
    seeVerification: 'See Verification',
    verifyNow: 'Verify Now',
    clearTestVerification: 'Clear Test Verification',
    clearTestConfirm: 'Are you sure you want to clear the test verification?',
    testVerificationCleared: '✅ Test verification cleared successfully',
    controlWhoSees: 'Control who can see your content',
    currentLanguage: 'Current language',
    changeLanguage: 'Change Language'
  },
  
  pt: {
    // Stories
    createStory: 'Criar Story',
    privacy: 'Privacidade',
    stories: 'Stories',
    
    // Create Story Modal
    createStoryTitle: 'Criar Story',
    whatTypeOfStory: 'Que tipo de story você quer criar?',
    text: 'Texto',
    photo: 'Foto',
    writeMessage: 'Escreva uma mensagem',
    uploadImage: 'Envie uma imagem',
    writeYourMessage: 'Escreva sua mensagem...',
    backgroundColor: 'Cor de fundo',
    textColor: 'Cor do texto',
    back: 'Voltar',
    publish: 'Publicar',
    creating: 'Criando...',
    changePhoto: 'Trocar foto',
    
    // Privacy Settings
    storiesPrivacyTitle: 'Privacidade dos Stories',
    whoCanSeeStories: 'Quem pode ver seus Stories?',
    everyone: 'Todos',
    everyoneDesc: 'Qualquer usuário do app pode ver seus Stories',
    matchesOnly: 'Apenas Matches',
    matchesOnlyDesc: 'Apenas pessoas com quem você deu match podem ver seus Stories',
    closeFriends: 'Amigos Próximos',
    closeFriendsDesc: 'Apenas sua lista de amigos próximos pode ver seus Stories',
    comingSoon: 'Em breve',
    storyReplies: 'Respostas aos Stories',
    allowReplies: 'Permitir respostas',
    allowRepliesDesc: 'Usuários podem responder aos seus Stories com mensagens',
    onlineStatus: 'Status online',
    showOnlineStatus: 'Mostrar quando estou online',
    showOnlineStatusDesc: 'Outros usuários podem ver se você está ativo',
    privacyImportant: 'Sua privacidade é importante',
    privacyImportantDesc: 'Você pode alterar essas configurações a qualquer momento. As mudanças se aplicam imediatamente a todos os seus Stories futuros.',
    ready: 'Pronto',
    saving: 'Salvando...',
    
    // Stories Viewer
    sendMessage: 'Enviar mensagem',
    repliesDisabled: 'Respostas desabilitadas',
    replyTo: 'Responder para',
    
    // General
    loading: 'Carregando...',
    error: 'Erro',
    close: 'Fechar',
    cancel: 'Cancelar',
    save: 'Salvar',
    
    // Discovery
    optimizingProfiles: 'Otimizando perfis...',
    calculatingCompatibility: 'Calculando compatibilidade e qualidade dos perfis',
    noProfilesAvailable: 'Nenhum perfil disponível!',
    comeBackLater: 'Volte mais tarde para descobrir novas pessoas.',
    errorLoadingProfile: 'Erro carregando perfil',
    technicalProblem: 'Há um problema técnico.',
    restart: 'Reiniciar',
    pass: 'Passar',
    restartProfiles: 'Reiniciar perfis',
    like: 'Curtir',
    
    // Match Modal
    itsAMatch: 'É um Match!',
    youAndUserLikedEachOther: 'Você e {user} se curtiram.',
    keepWatching: 'Continuar vendo',
    
    // Language Settings
    language: 'Idioma',
    selectLanguage: 'Selecionar idioma',
    spanish: 'Español',
    english: 'English',
    portuguese: 'Português',
    french: 'Français',
    
    // Identity Verification (Portuguese)
    identityVerification: 'Verificação de Identidade',
    verifyIdentity: 'Verifique sua identidade',
    verified: 'Verificado',
    verify: 'Verificar',
    alreadyVerified: 'Já verificado!',
    verificationSuccessful: 'Verificação bem-sucedida!',
    verificationFailed: 'Verificação falhou',
    takeASelfie: 'Tire uma selfie para confirmar que você é uma pessoa real',
    cameraAccess: 'Acesso à câmera',
    capture: 'Capturar',
    processing: 'Processando verificação',
    increasesVisibility: 'Aumenta sua visibilidade em 300%',
    verificationBadge: 'Badge de verificação visível',
    greaterTrust: 'Maior confiança de outros usuários',
    quickAndSecure: 'Processo rápido e seguro',
    startVerification: 'Iniciar verificação',
    activateCamera: 'Ativar câmera',
    positionYourFace: 'Posicione seu rosto dentro do círculo e pressione o botão para capturar',
    goodSelfieTitle: 'Dicas para uma boa selfie:',
    goodLighting: 'Certifique-se de ter boa iluminação',
    lookDirectly: 'Olhe diretamente para a câmera',
    neutralExpression: 'Mantenha uma expressão neutra',
    noSunglasses: 'Não use óculos escuros ou chapéus',
    processingVerification: 'Processando verificação',
    analyzingPhoto: 'Estamos analisando sua foto e comparando com seu perfil',
    detectingFace: 'Detectando rosto',
    verifyingQuality: 'Verificando qualidade',
    verifyingAuthenticity: 'Verificando autenticidade',
    comparingWithProfile: 'Comparando com perfil',
    congratulations: 'Parabéns!',
    identityVerified: 'Sua identidade foi verificada com sucesso',
    verificationBadgeEarned: 'Agora você tem um badge de verificação e maior visibilidade',
    confidence: 'Confiança',
    canTryAgain: 'Você pode tentar novamente',
    followRecommendations: 'Certifique-se de seguir as recomendações para obter uma foto melhor',
    tryAgain: 'Tentar novamente',
    tooManyAttempts: 'Muitas tentativas. Tente mais tarde.',
    tryLater: 'Volte mais tarde',
    
    // Navigation & Main Views
    discover: 'Descobrir',
    matches: 'Matches',
    messages: 'Mensagens',
    profile: 'Perfil',
    account: 'Conta',
    settings: 'Configurações',
    
    // Profile & Account
    editProfile: 'Editar Perfil',
    myProfile: 'Meu Perfil',
    accountSettings: 'Configurações da Conta',
    privacyAndSecurity: 'Privacidade e Segurança',
    configurePrivacy: 'Configurar Privacidade',
    
    // Chat & Messages
    typeMessage: 'Digite uma mensagem...',
    sendPhoto: 'Enviar foto',
    sendGif: 'Enviar GIF',
    online: 'Online',
    offline: 'Offline',
    lastSeen: 'Visto por último',
    typing: 'digitando...',
    
    // Swipe Actions
    superLike: 'Super Like',
    rewind: 'Rebobinar',
    boost: 'Impulsionar',
    
    // Common Actions
    edit: 'Editar',
    delete: 'Excluir',
    report: 'Denunciar',
    block: 'Bloquear',
    unblock: 'Desbloquear',
    
    // Time & Date
    now: 'agora',
    today: 'hoje',
    yesterday: 'ontem',
    minutesAgo: '{minutes}min atrás',
    hoursAgo: '{hours}h atrás',
    daysAgo: '{days}d atrás',
    
    // Notifications
    newMatch: 'Novo match',
    newMessage: 'Nova mensagem',
    profileVisit: 'Visitou seu perfil',
    
    // Errors & Status
    connectionError: 'Erro de conexão',
    tryAgainLater: 'Tente mais tarde',
    somethingWentWrong: 'Algo deu errado',
    noInternetConnection: 'Sem conexão com a internet',
    
    // Messages & Matches
    noMatchesYet: 'Ainda não há matches',
    whenYouMatch: 'Quando você der match com alguém, poderá conversar aqui.',
    newMatch: 'Novo match',
    matchesCount: '{count} matches',
    
    // Profile
    myPhotos: 'Minhas Fotos',
    managePhotos: 'Gerenciar Fotos',
    yearsOld: '{age} anos',
    job: 'Trabalho',
    interests: 'Interesses',
    bio: 'Bio',
    location: 'Localização',
    age: 'Idade',
    
    // Chat
    newMatchExclamation: 'Novo Match!',
    sendFirstMessage: 'Envie a primeira mensagem para {name}',
    typeSomethingCool: 'Digite algo legal...',
    
    // AI Coach
    aiCoachTitle: 'AI Coach RD',
    makeProfileAwesome: 'Vamos fazer seu perfil ser o mais incrível de todo o país.',
    improveProfile: 'Melhorar Perfil',
    analyzing: 'Analisando...',
    feedback: 'Feedback',
    improvedBio: 'Bio Melhorada',
    icebreakers: 'Quebra-gelos',
    copyBio: 'Copiar Bio',
    copied: 'Copiado!',
    tryAgain: 'Tentar Novamente',
    
    // Account Settings - Missing translations
    yourStory: 'Sua Story',
    whyImportant: 'Por que é importante?',
    verificationIncreases: 'A verificação aumenta sua visibilidade e confiança',
    privacyControls: 'A privacidade permite controlar sua experiência',
    languagePersonalizes: 'O idioma personaliza a interface à sua preferência',
    yourAccountVerified: 'Sua conta está verificada',
    verifyForTrust: 'Verifique sua identidade para maior confiança',
    seeVerification: 'Ver Verificação',
    verifyNow: 'Verificar Agora',
    clearTestVerification: 'Limpar Verificação de Teste',
    clearTestConfirm: 'Tem certeza de que deseja limpar a verificação de teste?',
    testVerificationCleared: '✅ Verificação de teste limpa com sucesso',
    controlWhoSees: 'Controle quem pode ver seu conteúdo',
    currentLanguage: 'Idioma atual',
    changeLanguage: 'Alterar Idioma'
  },
  
  fr: {
    // Stories
    createStory: 'Créer Story',
    privacy: 'Confidentialité',
    stories: 'Stories',
    
    // Create Story Modal
    createStoryTitle: 'Créer Story',
    whatTypeOfStory: 'Quel type de story voulez-vous créer?',
    text: 'Texte',
    photo: 'Photo',
    writeMessage: 'Écrire un message',
    uploadImage: 'Télécharger une image',
    writeYourMessage: 'Écrivez votre message...',
    backgroundColor: 'Couleur de fond',
    textColor: 'Couleur du texte',
    back: 'Retour',
    publish: 'Publier',
    creating: 'Création...',
    changePhoto: 'Changer la photo',
    
    // Privacy Settings
    storiesPrivacyTitle: 'Confidentialité des Stories',
    whoCanSeeStories: 'Qui peut voir vos Stories?',
    everyone: 'Tout le monde',
    everyoneDesc: 'Tout utilisateur de l\'app peut voir vos Stories',
    matchesOnly: 'Matches seulement',
    matchesOnlyDesc: 'Seules les personnes avec qui vous avez matché peuvent voir vos Stories',
    closeFriends: 'Amis proches',
    closeFriendsDesc: 'Seule votre liste d\'amis proches peut voir vos Stories',
    comingSoon: 'Bientôt disponible',
    storyReplies: 'Réponses aux Stories',
    allowReplies: 'Autoriser les réponses',
    allowRepliesDesc: 'Les utilisateurs peuvent répondre à vos Stories avec des messages',
    onlineStatus: 'Statut en ligne',
    showOnlineStatus: 'Montrer quand je suis en ligne',
    showOnlineStatusDesc: 'Les autres utilisateurs peuvent voir si vous êtes actif',
    privacyImportant: 'Votre confidentialité est importante',
    privacyImportantDesc: 'Vous pouvez modifier ces paramètres à tout moment. Les changements s\'appliquent immédiatement à toutes vos Stories futures.',
    ready: 'Terminé',
    saving: 'Sauvegarde...',
    
    // Stories Viewer
    sendMessage: 'Envoyer message',
    repliesDisabled: 'Réponses désactivées',
    replyTo: 'Répondre à',
    
    // General
    loading: 'Chargement...',
    error: 'Erreur',
    close: 'Fermer',
    cancel: 'Annuler',
    save: 'Sauvegarder',
    
    // Discovery
    optimizingProfiles: 'Optimisation des profils...',
    calculatingCompatibility: 'Calcul de la compatibilité et de la qualité des profils',
    noProfilesAvailable: 'Aucun profil disponible!',
    comeBackLater: 'Revenez plus tard pour découvrir de nouvelles personnes.',
    errorLoadingProfile: 'Erreur de chargement du profil',
    technicalProblem: 'Il y a un problème technique.',
    restart: 'Redémarrer',
    pass: 'Passer',
    restartProfiles: 'Redémarrer les profils',
    like: 'J\'aime',
    
    // Match Modal
    itsAMatch: 'C\'est un Match!',
    youAndUserLikedEachOther: 'Vous et {user} vous êtes plu mutuellement.',
    keepWatching: 'Continuer à regarder',
    
    // Language Settings
    language: 'Langue',
    selectLanguage: 'Sélectionner la langue',
    spanish: 'Español',
    english: 'English',
    portuguese: 'Português',
    french: 'Français',
    
    // Identity Verification (French)
    identityVerification: 'Vérification d\'Identité',
    verifyIdentity: 'Vérifiez votre identité',
    verified: 'Vérifié',
    verify: 'Vérifier',
    alreadyVerified: 'Déjà vérifié!',
    verificationSuccessful: 'Vérification réussie!',
    verificationFailed: 'Vérification échouée',
    takeASelfie: 'Prenez un selfie pour confirmer que vous êtes une vraie personne',
    cameraAccess: 'Accès à la caméra',
    capture: 'Capturer',
    processing: 'Traitement de la vérification',
    increasesVisibility: 'Augmente votre visibilité de 300%',
    verificationBadge: 'Badge de vérification visible',
    greaterTrust: 'Plus grande confiance des autres utilisateurs',
    quickAndSecure: 'Processus rapide et sécurisé',
    startVerification: 'Commencer la vérification',
    activateCamera: 'Activer la caméra',
    positionYourFace: 'Positionnez votre visage dans le cercle et appuyez sur le bouton pour capturer',
    goodSelfieTitle: 'Conseils pour un bon selfie:',
    goodLighting: 'Assurez-vous d\'avoir un bon éclairage',
    lookDirectly: 'Regardez directement la caméra',
    neutralExpression: 'Gardez une expression neutre',
    noSunglasses: 'Ne portez pas de lunettes de soleil ou de chapeaux',
    processingVerification: 'Traitement de la vérification',
    analyzingPhoto: 'Nous analysons votre photo et la comparons avec votre profil',
    detectingFace: 'Détection du visage',
    verifyingQuality: 'Vérification de la qualité',
    verifyingAuthenticity: 'Vérification de l\'authenticité',
    comparingWithProfile: 'Comparaison avec le profil',
    congratulations: 'Félicitations!',
    identityVerified: 'Votre identité a été vérifiée avec succès',
    verificationBadgeEarned: 'Vous avez maintenant un badge de vérification et une plus grande visibilité',
    confidence: 'Confiance',
    canTryAgain: 'Vous pouvez réessayer',
    followRecommendations: 'Assurez-vous de suivre les recommandations pour obtenir une meilleure photo',
    tryAgain: 'Réessayer',
    tooManyAttempts: 'Trop de tentatives. Réessayez plus tard.',
    tryLater: 'Revenez plus tard',
    
    // Navigation & Main Views
    discover: 'Découvrir',
    matches: 'Matches',
    messages: 'Messages',
    profile: 'Profil',
    account: 'Compte',
    settings: 'Paramètres',
    
    // Profile & Account
    editProfile: 'Modifier le Profil',
    myProfile: 'Mon Profil',
    accountSettings: 'Paramètres du Compte',
    privacyAndSecurity: 'Confidentialité et Sécurité',
    configurePrivacy: 'Configurer la Confidentialité',
    
    // Chat & Messages
    typeMessage: 'Tapez un message...',
    sendPhoto: 'Envoyer photo',
    sendGif: 'Envoyer GIF',
    online: 'En ligne',
    offline: 'Hors ligne',
    lastSeen: 'Vu pour la dernière fois',
    typing: 'en train d\'écrire...',
    
    // Swipe Actions
    superLike: 'Super Like',
    rewind: 'Rembobiner',
    boost: 'Booster',
    
    // Common Actions
    edit: 'Modifier',
    delete: 'Supprimer',
    report: 'Signaler',
    block: 'Bloquer',
    unblock: 'Débloquer',
    
    // Time & Date
    now: 'maintenant',
    today: 'aujourd\'hui',
    yesterday: 'hier',
    minutesAgo: 'il y a {minutes}min',
    hoursAgo: 'il y a {hours}h',
    daysAgo: 'il y a {days}j',
    
    // Notifications
    newMatch: 'Nouveau match',
    newMessage: 'Nouveau message',
    profileVisit: 'A visité votre profil',
    
    // Errors & Status
    connectionError: 'Erreur de connexion',
    tryAgainLater: 'Réessayez plus tard',
    somethingWentWrong: 'Quelque chose s\'est mal passé',
    noInternetConnection: 'Pas de connexion internet',
    
    // Messages & Matches
    noMatchesYet: 'Pas encore de matches',
    whenYouMatch: 'Quand vous matcherez avec quelqu\'un, vous pourrez discuter ici.',
    newMatch: 'Nouveau match',
    matchesCount: '{count} matches',
    
    // Profile
    myPhotos: 'Mes Photos',
    managePhotos: 'Gérer les Photos',
    yearsOld: '{age} ans',
    job: 'Travail',
    interests: 'Intérêts',
    bio: 'Bio',
    location: 'Localisation',
    age: 'Âge',
    
    // Chat
    newMatchExclamation: 'Nouveau Match!',
    sendFirstMessage: 'Envoyez le premier message à {name}',
    typeSomethingCool: 'Tapez quelque chose de cool...',
    
    // AI Coach
    aiCoachTitle: 'AI Coach RD',
    makeProfileAwesome: 'Rendons votre profil le plus génial de tout le pays.',
    improveProfile: 'Améliorer le Profil',
    analyzing: 'Analyse...',
    feedback: 'Commentaires',
    improvedBio: 'Bio Améliorée',
    icebreakers: 'Brise-glaces',
    copyBio: 'Copier la Bio',
    copied: 'Copié!',
    tryAgain: 'Réessayer',
    
    // Account Settings - Missing translations
    yourStory: 'Votre Story',
    whyImportant: 'Pourquoi est-ce important?',
    verificationIncreases: 'La vérification augmente votre visibilité et confiance',
    privacyControls: 'La confidentialité vous permet de contrôler votre expérience',
    languagePersonalizes: 'La langue personnalise l\'interface selon votre préférence',
    yourAccountVerified: 'Votre compte est vérifié',
    verifyForTrust: 'Vérifiez votre identité pour plus de confiance',
    seeVerification: 'Voir la Vérification',
    verifyNow: 'Vérifier Maintenant',
    clearTestVerification: 'Effacer la Vérification de Test',
    clearTestConfirm: 'Êtes-vous sûr de vouloir effacer la vérification de test?',
    testVerificationCleared: '✅ Vérification de test effacée avec succès',
    controlWhoSees: 'Contrôlez qui peut voir votre contenu',
    currentLanguage: 'Langue actuelle',
    changeLanguage: 'Changer de Langue'
  }
};

class LanguageService {
  private currentLanguage: Language = 'es'; // Español por defecto
  private listeners: Array<(language: Language) => void> = [];

  constructor() {
    // Cargar idioma guardado del localStorage
    const savedLanguage = localStorage.getItem('citard-language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    }
  }

  // Obtener idioma actual
  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  // Cambiar idioma
  setLanguage(language: Language): void {
    console.log('🌍 Cambiando idioma a:', language);
    this.currentLanguage = language;
    localStorage.setItem('citard-language', language);
    
    // Notificar a todos los listeners
    this.listeners.forEach(listener => listener(language));
  }

  // Obtener traducciones del idioma actual
  getTranslations(): Translations {
    return translations[this.currentLanguage];
  }

  // Obtener traducción específica
  t(key: keyof Translations, params?: Record<string, string>): string {
    let translation = translations[this.currentLanguage][key];
    
    // Reemplazar parámetros si existen
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value);
      });
    }
    
    return translation;
  }

  // Suscribirse a cambios de idioma
  subscribe(listener: (language: Language) => void): () => void {
    this.listeners.push(listener);
    
    // Retornar función para desuscribirse
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Obtener lista de idiomas disponibles
  getAvailableLanguages(): Array<{ code: Language; name: string; nativeName: string }> {
    return [
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'fr', name: 'French', nativeName: 'Français' }
    ];
  }

  // Obtener nombre del idioma
  getLanguageName(languageCode: Language): string {
    const languages = this.getAvailableLanguages();
    const language = languages.find(lang => lang.code === languageCode);
    return language ? language.nativeName : 'Español';
  }
}

// Instancia singleton
export const languageService = new LanguageService();
export default languageService;