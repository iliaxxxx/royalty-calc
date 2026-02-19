export type Language = 'ru' | 'en' | 'es'

export const translations = {
  ru: {
    // Header
    brand: 'VAUVISION',

    // Onboarding
    onboarding: {
      title: 'Караоке Тайминг',
      subtitle: 'Создавайте профессиональные тайминги для караоке за минуты',
      features: [
        'Загрузите аудио трек',
        'Введите текст песни',
        'Синхронизируйте зажатием кнопки',
        'Экспортируйте в TTML или LRC'
      ],
      start: 'Начать'
    },

    // Upload
    upload: {
      title: 'Загрузите трек',
      subtitle: 'WAV, MP3 или любой аудио файл',
      dropzone: 'Нажмите или перетащите',
      selected: 'Выбран файл',
      next: 'Далее'
    },

    // Info
    info: {
      title: 'Информация о треке',
      artist: 'Исполнитель',
      artistPlaceholder: 'Название артиста или группы',
      track: 'Название трека',
      trackPlaceholder: 'Название песни',
      lyrics: 'Текст песни',
      lyricsPlaceholder: 'Вставьте текст песни (каждая строка отдельно)',
      linesCount: 'строк',
      next: 'Далее',
      back: 'Назад'
    },

    // Sync
    sync: {
      score: 'Очки',
      lines: 'строк',
      tutorial: {
        title: '📖 Как синхронизировать',
        step1: 'Нажмите <accent>▶ Play</accent> чтобы включить песню',
        step2: 'Когда начинается строка — <accent>зажмите</accent> кнопку и держите',
        step3: 'Когда строка закончилась — <accent>отпустите</accent> кнопку',
        step4: 'Повторяйте для каждой строки до конца песни',
        step5: 'В конце можно <accent>подправить</accent> тайминги вручную',
        got_it: 'Понятно, начнём!'
      },
      hint: 'Нажмите Play, затем зажмите кнопку на время строки',
      undo: 'Отмена',
      complete: 'Готово! Экспортировать',
      back: 'Назад',
      tap: 'ЖАТЬ',
      hold: 'зажми',
      start: '▶ СТАРТ',
      stop: '■ СТОП'
    },

    // Export
    export: {
      done: 'Готово!',
      synced: 'Синхронизировано',
      of: 'из',
      lines: 'строк',
      preview: 'Превью',
      stop: 'Остановить',
      timings: 'Тайминги (начало → конец)',
      copy: 'Копировать',
      copied: 'Скопировано',
      download: 'Скачать',
      newProject: 'Новый проект'
    },

    // Settings
    settings: {
      title: 'Настройки',
      language: 'Язык',
      theme: 'Тема',
      light: 'Светлая',
      dark: 'Тёмная'
    }
  },

  en: {
    // Header
    brand: 'VAUVISION',

    // Onboarding
    onboarding: {
      title: 'Karaoke Timing',
      subtitle: 'Create professional karaoke timings in minutes',
      features: [
        'Upload audio track',
        'Enter song lyrics',
        'Sync by holding the button',
        'Export to TTML or LRC'
      ],
      start: 'Start'
    },

    // Upload
    upload: {
      title: 'Upload Track',
      subtitle: 'WAV, MP3 or any audio file',
      dropzone: 'Click or drag & drop',
      selected: 'Selected file',
      next: 'Next'
    },

    // Info
    info: {
      title: 'Track Information',
      artist: 'Artist',
      artistPlaceholder: 'Artist or band name',
      track: 'Track Name',
      trackPlaceholder: 'Song title',
      lyrics: 'Lyrics',
      lyricsPlaceholder: 'Paste song lyrics (each line separately)',
      linesCount: 'lines',
      next: 'Next',
      back: 'Back'
    },

    // Sync
    sync: {
      score: 'Score',
      lines: 'lines',
      tutorial: {
        title: '📖 How to Sync',
        step1: 'Press <accent>▶ Play</accent> to start the song',
        step2: 'When a line starts — <accent>hold</accent> the button',
        step3: 'When the line ends — <accent>release</accent> the button',
        step4: 'Repeat for each line until the end',
        step5: 'You can <accent>fine-tune</accent> timings at the end',
        got_it: 'Got it, let\'s go!'
      },
      hint: 'Press Play, then hold the button for each line',
      undo: 'Undo',
      complete: 'Done! Export',
      back: 'Back',
      tap: 'TAP',
      hold: 'hold',
      start: '▶ START',
      stop: '■ STOP'
    },

    // Export
    export: {
      done: 'Done!',
      synced: 'Synced',
      of: 'of',
      lines: 'lines',
      preview: 'Preview',
      stop: 'Stop',
      timings: 'Timings (start → end)',
      copy: 'Copy',
      copied: 'Copied',
      download: 'Download',
      newProject: 'New Project'
    },

    // Settings
    settings: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark'
    }
  },

  es: {
    // Header
    brand: 'VAUVISION',

    // Onboarding
    onboarding: {
      title: 'Karaoke Timing',
      subtitle: 'Crea tiempos profesionales de karaoke en minutos',
      features: [
        'Sube la pista de audio',
        'Ingresa la letra de la canción',
        'Sincroniza manteniendo el botón',
        'Exporta a TTML o LRC'
      ],
      start: 'Comenzar'
    },

    // Upload
    upload: {
      title: 'Subir Pista',
      subtitle: 'WAV, MP3 o cualquier archivo de audio',
      dropzone: 'Haz clic o arrastra',
      selected: 'Archivo seleccionado',
      next: 'Siguiente'
    },

    // Info
    info: {
      title: 'Información de la Pista',
      artist: 'Artista',
      artistPlaceholder: 'Nombre del artista o grupo',
      track: 'Nombre de la Pista',
      trackPlaceholder: 'Título de la canción',
      lyrics: 'Letra',
      lyricsPlaceholder: 'Pega la letra (cada línea por separado)',
      linesCount: 'líneas',
      next: 'Siguiente',
      back: 'Atrás'
    },

    // Sync
    sync: {
      score: 'Puntos',
      lines: 'líneas',
      tutorial: {
        title: '📖 Cómo Sincronizar',
        step1: 'Presiona <accent>▶ Play</accent> para iniciar la canción',
        step2: 'Cuando empiece una línea — <accent>mantén</accent> el botón',
        step3: 'Cuando termine la línea — <accent>suelta</accent> el botón',
        step4: 'Repite para cada línea hasta el final',
        step5: 'Puedes <accent>ajustar</accent> los tiempos al final',
        got_it: '¡Entendido, vamos!'
      },
      hint: 'Presiona Play, luego mantén el botón para cada línea',
      undo: 'Deshacer',
      complete: '¡Listo! Exportar',
      back: 'Atrás',
      tap: 'PULSA',
      hold: 'mantén',
      start: '▶ INICIO',
      stop: '■ FIN'
    },

    // Export
    export: {
      done: '¡Listo!',
      synced: 'Sincronizadas',
      of: 'de',
      lines: 'líneas',
      preview: 'Vista previa',
      stop: 'Detener',
      timings: 'Tiempos (inicio → fin)',
      copy: 'Copiar',
      copied: 'Copiado',
      download: 'Descargar',
      newProject: 'Nuevo Proyecto'
    },

    // Settings
    settings: {
      title: 'Ajustes',
      language: 'Idioma',
      theme: 'Tema',
      light: 'Claro',
      dark: 'Oscuro'
    }
  }
}

export interface Translations {
  brand: string
  onboarding: {
    title: string
    subtitle: string
    features: string[]
    start: string
  }
  upload: {
    title: string
    subtitle: string
    dropzone: string
    selected: string
    next: string
  }
  info: {
    title: string
    artist: string
    artistPlaceholder: string
    track: string
    trackPlaceholder: string
    lyrics: string
    lyricsPlaceholder: string
    linesCount: string
    next: string
    back: string
  }
  sync: {
    score: string
    lines: string
    tutorial: {
      title: string
      step1: string
      step2: string
      step3: string
      step4: string
      step5: string
      got_it: string
    }
    hint: string
    undo: string
    complete: string
    back: string
    tap: string
    hold: string
    start: string
    stop: string
  }
  export: {
    done: string
    synced: string
    of: string
    lines: string
    preview: string
    stop: string
    timings: string
    copy: string
    copied: string
    download: string
    newProject: string
  }
  settings: {
    title: string
    language: string
    theme: string
    light: string
    dark: string
  }
}
