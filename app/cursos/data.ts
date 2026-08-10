export type Course = {
  slug: string;
  name: string;
  price: string;
  image: string;
  category: "Colorimetría" | "Barbería" | "Maquillaje";
  duration: string;
  mode: string;
  level: string;
  certificate: string;
  intro: string;
  overview: string;
  learn: string[];
  modules: { title: string; detail: string }[];
  requirements: string[];
  pagoparUrl?: string;
};

const baseLearn = {
  colorimetria: [
    "Fundamentos de teoría del color aplicada al cabello",
    "Lectura de reflejos, subtonos y neutralización",
    "Preparación segura de fórmulas y decoloración",
    "Técnicas de aplicación limpia y precisa",
    "Diagnóstico previo y protocolos de cuidado",
  ],
  barberia: [
    "Cortes clásicos y contemporáneos con máquina y tijera",
    "Diseño de barba y bigote profesional",
    "Técnicas de degradado (fade) y desvanecido",
    "Higiene, ergonomía y manejo de herramientas",
    "Atención al cliente y estilos según rostro",
  ],
  maquillaje: [
    "Preparación de piel y elección de bases",
    "Técnicas de cejas, ojos y contorno",
    "Maquillaje de día, noche y ocasiones especiales",
    "Uso profesional de pinceles y productos",
    "Fotografía y comunicación de tu trabajo",
  ],
};

export const courses: Course[] = [
  {
    slug: "colorimetria-inicial",
    name: "Colorimetría inicial",
    price: "Gs. 250.000",
    image: "/images/colorimetria-inicial.webp",
    category: "Colorimetría",
    duration: "4 semanas",
    mode: "100% online",
    level: "Inicial",
    certificate: "Certificado digital al finalizar",
    intro: "El punto de partida ideal para entender el color con base técnica y profesional.",
    overview:
      "En Colorimetría inicial vas a construir la base técnica que todo profesional de la belleza necesita: entender qué pasa en el cabello cuando aplicamos color. Trabajamos desde los fundamentos — reflejos, subtonos, neutralización — hasta las primeras aplicaciones prácticas con protocolo profesional.",
    learn: baseLearn.colorimetria,
    modules: [
      { title: "Módulo 1 — Fundamentos del color", detail: "Círculo cromático, reflejos, subtonos y cómo se combinan en el cabello." },
      { title: "Módulo 2 — Diagnóstico del cabello", detail: "Cómo leer el cabello del cliente antes de tocar el color: porosidad, historial, altura de tono." },
      { title: "Módulo 3 — Preparación y fórmulas", detail: "Mezclas seguras, proporciones y elección del oxidante correcto." },
      { title: "Módulo 4 — Aplicación práctica", detail: "Técnicas limpias de aplicación paso a paso con protocolo profesional." },
    ],
    requirements: [
      "Ganas de aprender desde cero",
      "Acceso a computadora o celular con internet",
      "Kit básico de práctica (opcional para las clases guiadas)",
    ],
  },
  {
    slug: "colorimetria-tecnico-1",
    name: "Colorimetría técnico 1",
    price: "Gs. 300.000",
    image: "/images/colorimetria-tecnico-1.webp",
    category: "Colorimetría",
    duration: "6 semanas",
    mode: "100% online",
    level: "Técnico",
    certificate: "Certificado digital al finalizar",
    intro: "Segundo nivel para consolidar la técnica con casos reales y clientas exigentes.",
    overview:
      "Ya conocés la base — ahora vamos a la técnica que se vende. Trabajamos casos reales de coloración, corrección y elaboración de mechas con protocolo profesional. Ideal para quienes ya trabajan en salón y quieren subir el nivel.",
    learn: [
      "Corrección de color y neutralización avanzada",
      "Técnicas de mechas: babylights, balayage y clásicas",
      "Fórmulas para coberturas de canas",
      "Cronograma capilar y cuidado post-color",
      "Precificación y comunicación con la clienta",
    ],
    modules: [
      { title: "Módulo 1 — Corrección de color", detail: "Cómo diagnosticar y corregir errores comunes en coloraciones previas." },
      { title: "Módulo 2 — Mechas modernas", detail: "Babylights, balayage y mechas clásicas con paso a paso." },
      { title: "Módulo 3 — Cobertura de canas", detail: "Fórmulas de larga duración para diferentes tipos de cana." },
      { title: "Módulo 4 — Cronograma capilar", detail: "Cómo cuidar el cabello después del proceso químico." },
      { title: "Módulo 5 — Negocio y precios", detail: "Cómo cobrar tu trabajo y comunicar el valor de la técnica." },
    ],
    requirements: [
      "Haber completado Colorimetría inicial o tener conocimientos equivalentes",
      "Acceso a computadora o celular con internet",
    ],
  },
  {
    slug: "colorimetria-tecnico-2",
    name: "Colorimetría técnico 2",
    price: "Gs. 350.000",
    image: "/images/colorimetria-tecnico-2.webp",
    category: "Colorimetría",
    duration: "8 semanas",
    mode: "100% online",
    level: "Técnico avanzado",
    certificate: "Certificado digital al finalizar",
    intro: "Especialización en color de alta complejidad y trabajo editorial.",
    overview:
      "Tercer nivel de colorimetría, orientado a especialización. Trabajamos rubios extremos, color creativo, editoriales y técnicas de alta complejidad. Para colorimetristas que quieren distinguirse en el mercado.",
    learn: [
      "Rubios extremos y decoloraciones controladas",
      "Color creativo: fantasía, colores directos y semi-permanentes",
      "Editorial y color para producciones",
      "Protocolos de reconstrucción capilar profesional",
      "Consultoría y diagnóstico para clientas complejas",
    ],
    modules: [
      { title: "Módulo 1 — Rubios de alta gama", detail: "Decoloración segura, matices platino, rubios cálidos y fríos." },
      { title: "Módulo 2 — Color creativo", detail: "Aplicación de colores fantasía y directos sobre cabello aclarado." },
      { title: "Módulo 3 — Reconstrucción", detail: "Protocolos profesionales para cabellos comprometidos." },
      { title: "Módulo 4 — Editorial y foto", detail: "Cómo pensar el color para producciones y redes." },
      { title: "Módulo 5 — Casos complejos", detail: "Diagnóstico y resolución de situaciones fuera del manual." },
    ],
    requirements: [
      "Haber completado Colorimetría técnico 1 o tener experiencia comprobable",
      "Kit profesional propio recomendado",
    ],
  },
  {
    slug: "tecnico-superior",
    name: "Técnico superior",
    price: "Gs. 400.000",
    image: "/images/tecnico-superior.webp",
    category: "Colorimetría",
    duration: "12 semanas",
    mode: "Online + workshops presenciales",
    level: "Avanzado",
    certificate: "Certificado técnico superior",
    intro: "Formación integral para posicionarte como especialista de referencia.",
    overview:
      "Una formación integral que combina toda la ruta técnica, casos clínicos, negocio y marca personal. Para quien quiere ser referencia en su ciudad.",
    learn: [
      "Ruta técnica completa: base + avanzada + editorial",
      "Diagnóstico integral y resolución de casos complejos",
      "Marca personal y comunicación profesional",
      "Precificación estratégica y captación de clientas",
      "Protocolos de excelencia y control de calidad",
    ],
    modules: [
      { title: "Módulo 1 — Consolidación técnica", detail: "Repaso y profundización de toda la ruta anterior." },
      { title: "Módulo 2 — Casos clínicos", detail: "Diagnóstico y tratamiento de casos reales complejos." },
      { title: "Módulo 3 — Marca personal", detail: "Cómo construir una marca profesional que atrae." },
      { title: "Módulo 4 — Negocio", detail: "Precios, agenda, retención y crecimiento sostenible." },
      { title: "Módulo 5 — Certificación", detail: "Trabajo final y evaluación integral." },
    ],
    requirements: [
      "Formación previa en colorimetría o experiencia demostrable",
      "Disponibilidad para prácticas guiadas",
    ],
  },
  {
    slug: "master-colorimetria",
    name: "Master en colorimetría",
    price: "Gs. 500.000",
    image: "/images/master-colorimetria.webp",
    category: "Colorimetría",
    duration: "6 meses",
    mode: "Online + workshops presenciales",
    level: "Master",
    certificate: "Certificado Master en alianza con HSB",
    intro: "El programa más completo de CHARME, en alianza con la Academia N°1 del mundo en color.",
    overview:
      "El Master en Colorimetría es la propuesta más ambiciosa de Academia CHARME. Un recorrido de 6 meses en alianza con HSB, la academia número 1 del mundo en color, para formar colorimetristas de altísimo nivel. Cupos limitados.",
    learn: [
      "Todos los contenidos de la ruta técnica CHARME",
      "Metodología HSB de nivel internacional",
      "Master classes con referentes de la industria",
      "Portfolio profesional y prácticas supervisadas",
      "Certificación reconocida a nivel internacional",
    ],
    modules: [
      { title: "Bloque 1 — Fundamentos y técnica", detail: "Consolidación completa de la base técnica." },
      { title: "Bloque 2 — Avanzado + editorial", detail: "Rubios extremos, color creativo y editorial." },
      { title: "Bloque 3 — Metodología HSB", detail: "Contenidos exclusivos de la academia internacional." },
      { title: "Bloque 4 — Master classes", detail: "Encuentros en vivo con referentes globales." },
      { title: "Bloque 5 — Práctica supervisada", detail: "Casos reales con acompañamiento de tutor." },
      { title: "Bloque 6 — Trabajo final", detail: "Portfolio profesional y evaluación integral." },
    ],
    requirements: [
      "Formación previa en colorimetría (mínimo nivel técnico)",
      "Compromiso con la práctica semanal",
      "Cupos limitados — postulación previa",
    ],
  },
  {
    slug: "barberia-inicial",
    name: "Barbería inicial",
    price: "Gs. 250.000",
    image: "/images/barberia-inicial.webp",
    category: "Barbería",
    duration: "4 semanas",
    mode: "100% online",
    level: "Inicial",
    certificate: "Certificado digital al finalizar",
    intro: "Base sólida en cortes clásicos, herramientas y atención al cliente.",
    overview:
      "Empezá a formarte en barbería con la base técnica que necesitás: manejo de herramientas, cortes clásicos, higiene y atención profesional. Ideal para arrancar de cero.",
    learn: baseLearn.barberia,
    modules: [
      { title: "Módulo 1 — Herramientas y ergonomía", detail: "Máquinas, tijeras, navajas y cuidado del kit." },
      { title: "Módulo 2 — Cortes clásicos", detail: "Corte de cabello con máquina y tijera paso a paso." },
      { title: "Módulo 3 — Barba y bigote", detail: "Diseño básico y mantenimiento profesional." },
      { title: "Módulo 4 — Cliente y salón", detail: "Higiene, atención y flujo de trabajo profesional." },
    ],
    requirements: [
      "Kit básico de barbería recomendado",
      "Acceso a computadora o celular con internet",
    ],
  },
  {
    slug: "barberia-intermedia",
    name: "Barbería intermedia",
    price: "Gs. 300.000",
    image: "/images/barberia-intermedia.webp",
    category: "Barbería",
    duration: "6 semanas",
    mode: "100% online",
    level: "Intermedio",
    certificate: "Certificado digital al finalizar",
    intro: "Refiná técnica y sumá degradados, diseños y estilos actuales.",
    overview:
      "Segundo nivel para barberos que ya tienen la base. Trabajamos degradados (fades), diseños y estilos modernos que se demandan hoy en día.",
    learn: [
      "Técnicas de fade y desvanecido",
      "Diseños de barba modernos",
      "Cortes con estructura y volumen",
      "Adaptación del corte al tipo de rostro",
      "Retoque y mantenimiento profesional",
    ],
    modules: [
      { title: "Módulo 1 — Fade paso a paso", detail: "Degradados low, mid y high con precisión." },
      { title: "Módulo 2 — Barba de nivel", detail: "Diseño y perfilado profesional de barba." },
      { title: "Módulo 3 — Cortes con estructura", detail: "Estilos con volumen, texture y forma." },
      { title: "Módulo 4 — Cliente y estilo", detail: "Consulta y adaptación al rostro del cliente." },
    ],
    requirements: [
      "Haber completado Barbería inicial o experiencia equivalente",
      "Kit propio de trabajo",
    ],
  },
  {
    slug: "barberia-avanzado",
    name: "Barbería avanzado",
    price: "Gs. 350.000",
    image: "/images/barberia-avanzado.webp",
    category: "Barbería",
    duration: "8 semanas",
    mode: "Online + workshops presenciales",
    level: "Avanzado",
    certificate: "Certificado digital al finalizar",
    intro: "Nivel senior: diseño creativo, técnica editorial y desarrollo de marca personal.",
    overview:
      "Para barberos con experiencia que quieren posicionarse como referencia. Diseño creativo, técnica editorial y desarrollo de marca personal.",
    learn: [
      "Diseños creativos y freehand",
      "Cortes editoriales y de producción",
      "Colorimetría aplicada a barbería",
      "Marca personal y redes",
      "Precificación y modelo de negocio",
    ],
    modules: [
      { title: "Módulo 1 — Diseño creativo", detail: "Freehand y patrones para diferenciarte." },
      { title: "Módulo 2 — Cortes editoriales", detail: "Trabajos de producción y foto." },
      { title: "Módulo 3 — Color en barbería", detail: "Aplicación de color y decoloración segura." },
      { title: "Módulo 4 — Marca y negocio", detail: "Cómo posicionarte y cobrar tu trabajo." },
    ],
    requirements: [
      "Experiencia previa comprobable en barbería",
      "Kit profesional propio",
    ],
  },
  {
    slug: "maquillaje-inicial",
    name: "Maquillaje inicial",
    price: "Gs. 250.000",
    image: "/images/maquillaje-inicial.webp",
    category: "Maquillaje",
    duration: "4 semanas",
    mode: "100% online",
    level: "Inicial",
    certificate: "Certificado digital al finalizar",
    intro: "Base técnica y práctica para arrancar en el mundo del maquillaje profesional.",
    overview:
      "Un curso pensado para quien empieza: fundamentos de preparación de piel, uso de productos, cejas, ojos y contorno. Todo lo que necesitás para tus primeros trabajos.",
    learn: baseLearn.maquillaje,
    modules: [
      { title: "Módulo 1 — Preparación de piel", detail: "Limpieza, hidratación y base para maquillaje." },
      { title: "Módulo 2 — Cejas y ojos", detail: "Diseño de cejas y técnicas básicas de ojos." },
      { title: "Módulo 3 — Rostro completo", detail: "Contorno, iluminado y rubor." },
      { title: "Módulo 4 — Práctica integral", detail: "Maquillaje de día y noche paso a paso." },
    ],
    requirements: [
      "Kit básico de maquillaje",
      "Acceso a computadora o celular con internet",
    ],
  },
  {
    slug: "maquillaje-intermedio",
    name: "Maquillaje intermedio",
    price: "Gs. 300.000",
    image: "/images/maquillaje-intermedio.webp",
    category: "Maquillaje",
    duration: "6 semanas",
    mode: "100% online",
    level: "Intermedio",
    certificate: "Certificado digital al finalizar",
    intro: "Sumá técnica de novias, sociales y trabajos de mayor exigencia.",
    overview:
      "Segundo nivel para maquilladoras que ya tienen la base. Trabajamos maquillaje de novias, sociales y técnicas de larga duración.",
    learn: [
      "Maquillaje de novia y sociales",
      "Cut crease y técnicas de ojos avanzadas",
      "Larga duración y fijación profesional",
      "Adaptación a diferentes tipos de piel",
      "Atención y protocolo con la clienta",
    ],
    modules: [
      { title: "Módulo 1 — Novia clásica y moderna", detail: "Estilos de novia según personalidad." },
      { title: "Módulo 2 — Ojos avanzados", detail: "Cut crease, halo eye y otras técnicas." },
      { title: "Módulo 3 — Larga duración", detail: "Productos y técnicas para 12+ horas." },
      { title: "Módulo 4 — Tipos de piel", detail: "Adaptación a cada piel y edad." },
    ],
    requirements: [
      "Haber completado Maquillaje inicial o experiencia equivalente",
      "Kit propio con paletas profesionales",
    ],
  },
  {
    slug: "maquillaje-avanzado",
    name: "Maquillaje avanzado",
    price: "Gs. 350.000",
    image: "/images/maquillaje-avanzado.webp",
    category: "Maquillaje",
    duration: "8 semanas",
    mode: "Online + workshops presenciales",
    level: "Avanzado",
    certificate: "Certificado digital al finalizar",
    intro: "Nivel senior: editorial, caracterización y trabajo de foto/video.",
    overview:
      "Para maquilladoras que quieren dar el salto al trabajo editorial, fotográfico y de caracterización. Técnicas de alto nivel y marca personal.",
    learn: [
      "Maquillaje editorial y de producción",
      "Técnicas para foto y video",
      "Caracterización y efectos",
      "Marca personal y portfolio",
      "Networking en la industria",
    ],
    modules: [
      { title: "Módulo 1 — Editorial", detail: "Piel de revista y looks vanguardistas." },
      { title: "Módulo 2 — Foto y video", detail: "Cómo adaptar el make a distintas cámaras." },
      { title: "Módulo 3 — Caracterización", detail: "Introducción a efectos y transformación." },
      { title: "Módulo 4 — Marca y portfolio", detail: "Construcción de imagen profesional." },
    ],
    requirements: [
      "Experiencia previa demostrable en maquillaje",
      "Kit profesional completo",
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getRelatedCourses(slug: string, limit = 3): Course[] {
  const current = getCourseBySlug(slug);
  if (!current) return courses.slice(0, limit);
  return courses.filter((c) => c.slug !== slug && c.category === current.category).slice(0, limit);
}
