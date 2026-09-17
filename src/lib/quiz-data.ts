export type QuizOption = {
  label: string;
  profile: ProfileKey;
};

export type QuizQuestion = {
  id: string;
  question: string;
  hint?: string;
  options: QuizOption[];
};

export type ProfileKey = "digital" | "servicios" | "creativo" | "comercial";

export const questions: QuizQuestion[] = [
  {
    id: "tiempo",
    question: "¿Cuánto tiempo libre tienes cada semana?",
    hint: "Piensa en las horas reales, no en las ideales.",
    options: [
      { label: "Menos de 4 horas", profile: "digital" },
      { label: "Entre 4 y 8 horas", profile: "digital" },
      { label: "Entre 8 y 15 horas", profile: "servicios" },
      { label: "Más de 15 horas", profile: "comercial" },
    ],
  },
  {
    id: "momento",
    question: "¿En qué momento del día rindes mejor?",
    options: [
      { label: "Temprano en la mañana", profile: "servicios" },
      { label: "Durante la tarde", profile: "comercial" },
      { label: "Por la noche", profile: "digital" },
      { label: "Depende de la semana", profile: "creativo" },
    ],
  },
  {
    id: "experiencia",
    question: "¿Qué experiencia tienes con trabajos por internet?",
    options: [
      { label: "Ninguna, empiezo desde cero", profile: "servicios" },
      { label: "He probado algo, sin continuidad", profile: "digital" },
      { label: "Ya hice trabajos puntuales", profile: "creativo" },
      { label: "Tengo experiencia constante", profile: "comercial" },
    ],
  },
  {
    id: "habilidad",
    question: "¿Cuál de estas habilidades sientes más cercana?",
    options: [
      { label: "Organizar y resolver tareas", profile: "servicios" },
      { label: "Escribir, diseñar o grabar", profile: "creativo" },
      { label: "Conversar y convencer", profile: "comercial" },
      { label: "Analizar datos y procesos", profile: "digital" },
    ],
  },
  {
    id: "modalidad",
    question: "¿Cómo prefieres trabajar?",
    options: [
      { label: "Solo desde casa", profile: "digital" },
      { label: "En casa y a veces fuera", profile: "servicios" },
      { label: "En contacto con personas", profile: "comercial" },
      { label: "Aún no lo tengo claro", profile: "creativo" },
    ],
  },
  {
    id: "herramientas",
    question: "¿Con qué equipo cuentas hoy?",
    options: [
      { label: "Solo celular", profile: "creativo" },
      { label: "Celular y computadora", profile: "digital" },
      { label: "Computadora e internet estable", profile: "servicios" },
      { label: "Equipo completo y espacio propio", profile: "comercial" },
    ],
  },
  {
    id: "objetivo",
    question: "¿Cuál es tu objetivo principal ahora mismo?",
    options: [
      { label: "Complementar mi ingreso actual", profile: "servicios" },
      { label: "Aprender una habilidad nueva", profile: "creativo" },
      { label: "Construir algo propio a largo plazo", profile: "digital" },
      { label: "Tener más autonomía sobre mi tiempo", profile: "comercial" },
    ],
  },
  {
    id: "ritmo",
    question: "¿Cómo te llevas con la constancia?",
    options: [
      { label: "Necesito una guía paso a paso", profile: "servicios" },
      { label: "Avanzo mejor con metas semanales", profile: "digital" },
      { label: "Me organizo bastante bien solo", profile: "comercial" },
      { label: "Voy por rachas de motivación", profile: "creativo" },
    ],
  },
  {
    id: "aprendizaje",
    question: "¿Cómo prefieres aprender algo nuevo?",
    options: [
      { label: "Videos cortos y prácticos", profile: "creativo" },
      { label: "Guías escritas que pueda releer", profile: "digital" },
      { label: "Ejemplos reales y plantillas", profile: "servicios" },
      { label: "Probando y ajustando sobre la marcha", profile: "comercial" },
    ],
  },
  {
    id: "inicio",
    question: "¿Cuándo te gustaría empezar?",
    options: [
      { label: "Esta misma semana", profile: "comercial" },
      { label: "En las próximas dos semanas", profile: "digital" },
      { label: "Dentro de un mes", profile: "servicios" },
      { label: "Estoy explorando sin prisa", profile: "creativo" },
    ],
  },
];

export type Profile = {
  name: string;
  summary: string;
  traits: { label: string; value: string }[];
  steps: string[];
};

export const profiles: Record<ProfileKey, Profile> = {
  digital: {
    name: "Perfil Digital Flexible",
    summary:
      "Tus respuestas apuntan a caminos que puedes manejar desde tu dispositivo, con horarios propios y avance gradual. El foco está en construir una base sólida antes de escalar.",
    traits: [
      { label: "Modalidad", value: "Remota" },
      { label: "Ritmo", value: "Gradual" },
      { label: "Enfoque", value: "Autonomía" },
    ],
    steps: [
      "Definir una sola habilidad digital para desarrollar primero",
      "Reservar bloques fijos de trabajo en tu semana",
      "Documentar tus avances para medir progreso real",
    ],
  },
  servicios: {
    name: "Perfil Servicios Prácticos",
    summary:
      "Encajas con actividades concretas y organizadas, donde cada tarea tiene un inicio y un final claros. Un método paso a paso te ayuda a mantener la constancia.",
    traits: [
      { label: "Modalidad", value: "Mixta" },
      { label: "Ritmo", value: "Estructurado" },
      { label: "Enfoque", value: "Método" },
    ],
    steps: [
      "Elegir un servicio simple que ya sepas resolver",
      "Preparar una presentación breve de lo que ofreces",
      "Definir tu disponibilidad semanal por escrito",
    ],
  },
  creativo: {
    name: "Perfil Creativo en Exploración",
    summary:
      "Tu perfil valora la expresión y la libertad para experimentar. Conviene empezar con formatos ligeros y avanzar según lo que despierte más interés.",
    traits: [
      { label: "Modalidad", value: "Remota" },
      { label: "Ritmo", value: "Exploratorio" },
      { label: "Enfoque", value: "Creatividad" },
    ],
    steps: [
      "Probar un formato de contenido durante dos semanas",
      "Guardar referencias de lo que te inspira",
      "Ajustar según lo que te resulte sostenible",
    ],
  },
  comercial: {
    name: "Perfil Comercial Directo",
    summary:
      "Te mueves bien en el contacto con personas y en la toma de decisiones rápida. Con una rutina clara, puedes avanzar sin depender de mucha preparación previa.",
    traits: [
      { label: "Modalidad", value: "Presencial o mixta" },
      { label: "Ritmo", value: "Ágil" },
      { label: "Enfoque", value: "Relaciones" },
    ],
    steps: [
      "Listar a quién podrías ayudar en tu entorno cercano",
      "Definir una propuesta clara en una sola frase",
      "Fijar metas semanales de conversaciones, no de resultados",
    ],
  },
};
