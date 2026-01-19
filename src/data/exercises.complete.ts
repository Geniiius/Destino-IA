// Base de données complète des exercices du workshop (11 exercices)
export interface Exercise {
  id: string;
  title: string;
  part: string;
  type: string;
  typeColor: string;
  time: string;
  level: string;
  emoji: string;
  objective: string;
  learns: string[];
  badPrompt: {
    title: string;
    content: string;
    result: string;
  };
  goodPrompt: {
    title: string;
    content: string;
    result: string;
  };
  keyMessage: string;
  instructions: string[];
}

export const exercises: Exercise[] = [
  {
    id: "01",
    title: "La Fórmula RCTF — Imagen Básica",
    part: "PARTE 1: FUNDAMENTOS",
    type: "FUNDAMENTO",
    typeColor: "bg-blue-500",
    time: "5 min",
    level: "Principiante",
    emoji: "🎯",
    objective:
      "Comprender la diferencia entre un prompt vago y un prompt estructurado RCTF generando imágenes con ambos métodos.",
    learns: [
      "La estructura básica de un prompt profesional",
      "Cómo el RCTF mejora el control sobre el resultado",
      "La importancia de ser específico con la IA",
    ],
    badPrompt: {
      title: "PROMPTS INFORMALES (Sin estructura)",
      content: `OPCIÓN A (Tropical):
"Quiero una imagen de una persona viajando en un lugar bonito."

OPCIÓN B (Aventura en México):
"4 personas haciendo kayak en un río de la selva en México bajando por una cascada, que se vea espectacular."`,
      result:
        "Imagen con composición plana, falta de escala real, el agua de la cascada parece una mancha blanca y no se siente la inmensidad de la selva.",
    },
    goodPrompt: {
      title: "PROMPT RCTF (Profesional)",
      content: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPCIÓN A: DESTINO TROPICAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rol: Fotógrafo de viajes profesional de National Geographic.

Contexto: Destino tropical paradisíaco, playa de arena blanca al atardecer, ambiente relajado y aspiracional.

Tarea: Captura una imagen ultra realista de una persona caminando descalza por la orilla del mar con una maleta de viaje, transmitiendo libertad, aventura y el inicio de una nueva experiencia.

Formato: Imagen vertical 9:16, estilo cinematográfico, luz dorada de hora mágica, alta resolución, profundidad de campo suave.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPCIÓN B: EXPEDICIÓN ÉPICA — CASCADAS DE MÉXICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rol: Fotógrafo de expediciones de aventura para Red Bull Media House.

Contexto: La selva profunda de la Huasteca Potosina, México. Un río de color azul turquesa intenso que desemboca en una cascada monumental rodeada de vegetación selvática exuberante y paredes de roca caliza.

Tarea: Una toma de acción a gran escala de un grupo de 4 personas en kayaks de colores vibrantes descendiendo por el borde de una cascada impresionante. La escena debe capturar la magnitud del paisaje, mostrando la pequeñez de los humanos frente a la fuerza del agua. Se deben apreciar detalles de agua pulverizada, bruma y la luz del sol filtrándose entre los árboles.

Formato: Gran angular (wide angle) para enfatizar la inmensidad del entorno, vertical 9:16, alta velocidad de obturación para congelar el movimiento del agua, colores vibrantes y saturados, calidad cinematográfica 8k.`,
      result:
        "Imagen de impacto profesional: composición equilibrada, sensación de escala épica y una atmósfera selvática inmersiva y realista.",
    },
    keyMessage:
      "Para paisajes espectaculares, usa el Formato 'Gran Angular'. RCTF te permite pasar de una 'foto de vacaciones' a una 'producción publicitaria'.",
    instructions: [
      "Genera imágenes con los prompts informales",
      "Genera las versiones profesionales con RCTF",
      "Observa cómo el 'Gran Angular' y el 'Rol' de fotógrafo de aventura cambian la escala del paisaje",
      "Comparte tu mejor resultado en el chat",
    ],
  },
  {
    id: "02",
    title: "Comparativo: Prompt Normal vs RCTF",
    part: "PARTE 1: FUNDAMENTOS",
    type: "DEMOSTRACIÓN",
    typeColor: "bg-gray-500",
    time: "5 min",
    level: "Principiante",
    emoji: "⚖️",
    objective:
      "Demostrar visualmente el impacto de la estructura RCTF mediante una comparación directa de resultados.",
    learns: [
      "Analizar críticamente un resultado de IA",
      "Identificar qué falta en un prompt débil",
      "Valorar la importancia de cada elemento RCTF",
    ],
    badPrompt: {
      title: "PROMPT INFORMAL",
      content:
        '"Oye, quiero una imagen de una persona trabajando con su laptop en una playa bonita... algo moderno y cool."',
      result:
        "Poco control, estilo inconsistente, no profesional, inutilizable para marketing serio.",
    },
    goodPrompt: {
      title: "PROMPT RCTF",
      content: `Rol: Director creativo de agencia de lifestyle premium.

Contexto: Campaña para agencia digital promoviendo el equilibrio trabajo-vida en playa tropical caribeña, hora dorada.

Tarea: Crear una imagen de una persona profesional trabajando con su laptop en una mesa elegante frente al mar, transmitiendo calma, éxito y bienestar, con una sonrisa sutil de satisfacción.

Formato: Imagen realista, luz cálida de atardecer, estética premium minimalista, vertical 9:16, calidad publicitaria.`,
      result:
        "Imagen coherente, storytelling controlado, emoción definida, lista para campaña de marketing.",
    },
    keyMessage:
      "Clara y estructurada = Mayor control y calidad. La IA no adivina, OBEDECE.",
    instructions: [
      "Observa las dos imágenes proyectadas",
      "Identifica 3 diferencias clave",
      "Explica qué elemento RCTF causó cada mejora",
    ],
  },
  {
    id: "03",
    title: "Image → Video (Animación Simple)",
    part: "PARTE 2: IMAGEN Y ANIMACIÓN",
    type: "PRÁCTICA",
    typeColor: "bg-emerald-500",
    time: "7 min",
    level: "Principiante-Intermedio",
    emoji: "🎬",
    objective:
      "Aprender a animar una imagen fija describiendo el MOVIMIENTO, no el contenido visual que ya existe.",
    learns: [
      "La diferencia entre describir una imagen y dirigir un movimiento",
      "Vocabulario de dirección cinematográfica (push-in, pan, zoom)",
      'El principio: "La imagen da el ESPACIO, el prompt da el TIEMPO"',
    ],
    badPrompt: {
      title: "PROMPT DE ANIMACIÓN INCORRECTO",
      content: `"Haz que esta imagen se mueva un poco."

O peor:

"Anima esta imagen de una mujer en la playa con palmeras y mar azul y cielo bonito..."`,
      result:
        "Movimiento aleatorio, sin dirección, posibles deformaciones, resultado amateur.",
    },
    goodPrompt: {
      title: "PROMPT DE ANIMACIÓN PROFESIONAL",
      content: `Animate the image into a cinematic video.

MOVIMIENTO DE CÁMARA:
- Slow push-in suave hacia el sujeto principal
- Velocidad lenta y elegante

ELEMENTOS ANIMADOS:
- Respiración natural y sutil del personaje
- Cabello moviéndose suavemente con la brisa
- Pequeñas olas del mar en movimiento
- Nubes desplazándose lentamente en el cielo

ATMÓSFERA:
- Luz del atardecer cambiando sutilmente (más cálida)
- Ambiente tranquilo y cinematográfico

FORMATO:
- Duración: 6-8 segundos
- Estilo: cinematográfico premium
- Sin deformaciones del rostro`,
      result:
        "Video con movimiento intencional, profesional, listo para redes sociales.",
    },
    keyMessage:
      "NUNCA repitas lo que ya se ve en la imagen. Solo describe lo que CAMBIA y cómo se MUEVE.",
    instructions: [
      "Toma una imagen que generaste antes",
      "Escribe SOLO instrucciones de movimiento",
      "Generar image to video",
      "Duración objetivo: 6-8 segundos",
    ],
  },
  {
    id: "04",
    title: "Image → Video con Efecto Especial",
    part: "PARTE 2: IMAGEN Y ANIMACIÓN",
    type: "AVANZADO",
    typeColor: "bg-violet-500",
    time: "8 min",
    level: "Intermedio",
    emoji: "✨",
    objective:
      "Añadir UN efecto especial controlado a una animación sin perder profesionalismo ni crear caos visual.",
    learns: [
      "Cuándo y cómo usar efectos especiales",
      'La regla: "Un efecto bien usado se SIENTE, no grita"',
      "Control de intensidad para mantener realismo",
    ],
    badPrompt: {
      title: "PROMPT CON EFECTOS EXCESIVOS",
      content:
        '"Anima la imagen con muchos efectos especiales, partículas brillantes, luces de neón, explosiones de color, todo muy espectacular y llamativo."',
      result:
        "Caos visual, aspecto amateur, distracción del mensaje, video inutilizable.",
    },
    goodPrompt: {
      title: "PROMPT CON EFECTO CONTROLADO",
      content: `Animate the image into a cinematic video.

MOVIMIENTO BASE:
- Slow push-in muy suave hacia el personaje
- Respiración natural del sujeto

UN SOLO EFECTO ESPECIAL (elegir uno):
- Opción A: Partículas de luz dorada flotando suavemente
- Opción B: Resplandor cálido suave apareciendo gradualmente
- Opción C: Destellos sutiles de lens flare del sol

REGLAS DEL EFECTO:
- Intensidad: SUTIL (30% de lo que imaginas)
- Debe complementar, no competir con el sujeto
- Coherente con la iluminación existente

FORMATO:
- 6-8 segundos
- Calidad cinematográfica
- El efecto aparece gradualmente, no de golpe`,
      result:
        "Video premium con toque mágico controlado, profesional, memorable sin ser excesivo.",
    },
    keyMessage:
      "Un solo efecto = Impacto. Muchos efectos = Caos. El efecto debe SENTIRSE, no VERSE.",
    instructions: [
      "Elige UNA imagen generada anteriormente",
      "Decide UN solo efecto especial",
      "Anímala con intensidad SUTIL",
      "Compara: ¿mejoró o empeoró?",
    ],
  },
  {
    id: "05",
    title: "3 Escenas, 1 Personaje (Ancla Visual)",
    part: "PARTE 2: IMAGEN Y ANIMACIÓN",
    type: "STORYTELLING",
    typeColor: "bg-amber-500",
    time: "20 min",
    level: "Intermedio-Avanzado",
    emoji: "⚓",
    objective:
      "Mantener la identidad visual de un mismo personaje a través de múltiples escenas usando una descripción ANCLA.",
    learns: [
      "El concepto de ANCLA VISUAL para consistencia",
      "Cómo crear una mini-historia con coherencia de personaje",
      "Storytelling visual profesional con IA",
    ],
    badPrompt: {
      title: "SIN ANCLA VISUAL",
      content: `Escena 1: "Una mujer viajando en un aeropuerto"
Escena 2: "Una mujer en un hotel de lujo"
Escena 3: "Una mujer en la naturaleza"`,
      result:
        "3 mujeres completamente diferentes. No hay historia. No hay reconocimiento.",
    },
    goodPrompt: {
      title: "CON ANCLA VISUAL (3 ESCENAS)",
      content: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANCLA VISUAL (COPIAR EN TODAS LAS ESCENAS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Una joven mujer mestiza de 28-30 años, cabello castaño rizado recogido en un chongo alto elegante, vistiendo una camisa de lino blanco, con un distintivo brazalete tecnológico azul luminoso en la muñeca derecha."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENA 1 — LA LLEGADA (Emoción: Expectativa)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rol: Fotógrafo lifestyle de revista de viajes.
Contexto: Aeropuerto internacional moderno, luz natural de mañana.
Tarea: [ANCLA VISUAL] caminando con elegancia tirando de una maleta premium, mirando hacia los aviones con expresión de emoción.
Formato: Vertical 9:16, cinematográfico, realista.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENA 2 — EL DESTINO (Emoción: Plenitud)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rol: Fotógrafo de revista de lujo y bienestar.
Contexto: Terraza privada de villa tropical, hora dorada, vista al mar.
Tarea: [ANCLA VISUAL] sentada en un sofá elegante disfrutando un cóctel, expresión serena.
Formato: Vertical 9:16, cinematográfico, luz dorada.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENA 3 — LA AVENTURA (Emoción: Asombro)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rol: Director de documentales de naturaleza.
Contexto: Gran cascada tropical, neblina natural, atmósfera mística.
Tarea: [ANCLA VISUAL] de pie sobre una roca, observando la cascada con expresión de asombro.
Formato: Vertical 9:16, atmosférico, dramático.`,
      result:
        "3 escenas con el MISMO personaje reconocible. Una historia visual coherente.",
    },
    keyMessage:
      "El brazalete azul y la camisa blanca son FIRMAS VISUALES. El espectador reconoce al personaje inmediatamente.",
    instructions: [
      "Crea tu propia ANCLA VISUAL (describe un personaje único)",
      "Genera las 3 escenas manteniendo el ancla",
      "Verifica: ¿Es reconocible en las 3?",
    ],
  },
  {
    id: "06A",
    title: "Text → Video Marketing (Crear desde cero)",
    part: "PARTE 3: MARKETING Y VIDEO",
    type: "MARKETING",
    typeColor: "bg-amber-600",
    time: "15 min",
    level: "Intermedio",
    emoji: "📱",
    objective:
      "Transformar un concepto de viaje en una estructura narrativa de 3 actos (Hook → Deseo → CTA) optimizada para Reels/TikTok.",
    learns: [
      "Estructura narrativa de video marketing (3 actos)",
      "El concepto de HOOK para detener el scroll",
      "Cómo crear urgencia con el CTA (Call To Action)",
    ],
    badPrompt: {
      title: "PROMPT SIN ESTRUCTURA NARRATIVA",
      content:
        '"Quiero un video promocional de un viaje a Japón, que se vea bonito y profesional, con música y que la gente quiera comprar."',
      result:
        "Video genérico, sin gancho inicial, sin dirección emocional, sin call-to-action claro.",
    },
    goodPrompt: {
      title: "ESTRUCTURA DE 3 ACTOS CON RCTF",
      content: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTO 1 — EL HOOK (0-3 segundos)
Objetivo: DETENER el scroll en menos de 3 segundos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rol: Director de cine publicitario de alto impacto visual.
Contexto: Amanecer rosado con silueta del Monte Fuji.
Tarea: Video de un ojo abriéndose lentamente, reflejando pétalos de sakura cayendo.
Formato: Vertical 9:16, cinematográfico, 3 segundos exactos, dramático.

🎙️ VOZ: "¿Y si este fuera el viaje... que lo cambia todo?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTO 2 — EL DESEO (3-12 segundos)
Objetivo: CREAR deseo y hacer que se proyecten
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rol: Director de documentales de viajes de lujo.
Contexto: Montaje de los momentos más icónicos de Japón.
Tarea: Secuencia fluida de: torii gates de Fushimi Inari, templos de Kioto, ryokan con onsen, luces de Shibuya.
Formato: Vertical 9:16, cinematográfico, 8K.

🎙️ VOZ: "14 días descubriendo Japón. Templos milenarios, sakura en flor, gastronomía legendaria..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTO 3 — EL CTA (12-18 segundos)
Objetivo: PROVOCAR acción inmediata
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rol: Director creativo publicitario especializado en urgencia.
Contexto: Cierre de campaña, estética japonesa minimalista y zen.
Tarea: Texto animado elegante sobre jardín zen con arena rastrillada.
Formato: Vertical 9:16, tipografía elegante, pétalos de sakura.

🎙️ VOZ: "El Ofertón Japón. Solo 20 lugares. Reserva ahora."`,
      result:
        "Video estructurado: Hook que atrapa, desarrollo que enamora, cierre que convierte.",
    },
    keyMessage:
      "RCTF se aplica a CADA escena. Hook = Atención. Deseo = Emoción. CTA = Acción.",
    instructions: [
      "Elige un destino (puede ser ficticio)",
      "Escribe los 3 actos con RCTF",
      "Genera las imágenes/videos de cada acto",
      "Define la voz en off para cada momento",
    ],
  },
  {
    id: "06B",
    title: "Image → Estrategia (ChatGPT como Cerebro)",
    part: "PARTE 3: MARKETING Y VIDEO",
    type: "ESTRATEGIA",
    typeColor: "bg-purple-600",
    time: "12 min",
    level: "Intermedio-Avanzado",
    emoji: "🧠",
    objective:
      "Usar ChatGPT para analizar una imagen publicitaria existente y generar automáticamente toda la estructura narrativa con prompts listos.",
    learns: [
      'ChatGPT como "cerebro estratégico" del workflow',
      "Cómo delegar el análisis y la estructura a la IA",
      "Workflow profesional: Análisis → Estructura → Prompts → Ejecución",
    ],
    badPrompt: {
      title: "DELEGACIÓN DÉBIL",
      content:
        '"Analiza esta imagen y dime qué puedo hacer con ella para un video."',
      result:
        "Respuesta genérica, sugerencias vagas, sin prompts utilizables, pérdida de tiempo.",
    },
    goodPrompt: {
      title: "SUPER PROMPT — DELEGACIÓN ESTRATÉGICA COMPLETA",
      content: `Actúa como un experto en marketing estratégico, director creativo de campañas premium y especialista en storytelling audiovisual para redes sociales.

Analiza la imagen que te he subido y TODA la información visual y textual que contiene (destino, precio, oferta, duración, visual principal).

Tu objetivo es transformar esta imagen estática en una HISTORIA CINEMATOGRÁFICA de alto impacto emocional.

Estructura la narrativa en 3 ESCENAS CINEMATOGRÁFICAS:

ESCENA 1 — EL LLAMADO (Hook)
Debe impactar, generar curiosidad y presentar el destino.

ESCENA 2 — LA EXPERIENCIA (Desarrollo)  
Debe mostrar el valor, la aventura, los beneficios.

ESCENA 3 — LA OPORTUNIDAD (CTA)
Debe cerrar con emoción, urgencia y conexión.

Para CADA escena entrégame:
• Descripción visual cinematográfica detallada
• Narración exacta (voz en off)
• Texto en pantalla
• Emoción principal a transmitir
• PROMPT RCTF para generar la imagen
• PROMPT para animar en video (Kling/Hailuo)
• Variaciones de estilo: cine / comercial / documental
• Variaciones de mood: épico / romántico / aventurero / lujo

📎 IMAGEN ADJUNTA: [Subir imagen publicitaria]`,
      result:
        "Guion completo con 3 escenas, prompts RCTF listos, variaciones de estilo, todo para ejecutar.",
    },
    keyMessage:
      "ChatGPT es tu CEREBRO estratégico. Tú le das la imagen, él te devuelve el guion completo con prompts listos para copiar y pegar.",
    instructions: [
      "Busca o crea una imagen publicitaria de viaje",
      "Sube la imagen a ChatGPT con el Super Prompt",
      "Revisa el guion generado",
      "Ejecuta al menos 1 escena con los prompts recibidos",
    ],
  },
  {
    id: "07",
    title: "Logo en Objeto (Integración Realista)",
    part: "PARTE 4: BRANDING E IDENTIDAD",
    type: "BRANDING",
    typeColor: "bg-blue-600",
    time: "10 min",
    level: "Intermedio",
    emoji: "🏷️",
    objective:
      "Integrar un logo de marca sobre un objeto real (valija, laptop, carnet) de forma realista, respetando textura, perspectiva e iluminación.",
    learns: [
      "Cómo hacer que un logo parezca PARTE del objeto",
      "La importancia de respetar luz, textura y perspectiva",
      "Crear contenido de branding profesional con IA",
    ],
    badPrompt: {
      title: "INTEGRACIÓN AMATEUR",
      content: '"Pon el logo de Rebollar Travel en una maleta."',
      result:
        'Logo "pegado" artificialmente, sin respetar perspectiva, luz incorrecta, aspecto amateur.',
    },
    goodPrompt: {
      title: "INTEGRACIÓN PROFESIONAL",
      content: `Rol: Fotógrafo publicitario premium especializado en branding de marcas de viajes de lujo.

Contexto: Escena cinematográfica elegante en aeropuerto internacional moderno. Una mujer profesional está sentada en un lounge VIP junto a un gran ventanal con vista a la pista.

Tarea: Integrar el logo "REBOLLAR TRAVEL" de forma REALISTA sobre la valija de cuero premium. El logo debe:
- Respetar EXACTAMENTE la perspectiva del objeto
- Recibir la MISMA iluminación que el entorno
- Tener la TEXTURA coherente con el material (cuero)
- Verse como parte ORIGINAL del diseño, no añadido

La escena debe transmitir lujo, confianza y viaje internacional de élite.

Formato: Imagen vertical 9:16, estilo cinematográfico publicitario, iluminación natural suave de ventanal, alta resolución, realismo fotográfico absoluto.`,
      result:
        "Logo perfectamente integrado, parece parte original del producto, imagen de branding profesional.",
    },
    keyMessage:
      "Un logo bien integrado NO se nota... se SIENTE. Si parece pegado, el prompt está incompleto.",
    instructions: [
      "Elige tu logo (o usa uno ficticio)",
      "Elige un objeto: valija, laptop, o carnet",
      "Genera la imagen con integración realista",
      "Criterio de éxito: ¿Parece original o pegado?",
    ],
  },
  {
    id: "08",
    title: "Logo Animado con Efecto Premium",
    part: "PARTE 4: BRANDING E IDENTIDAD",
    type: "BRANDING AVANZADO",
    typeColor: "bg-indigo-600",
    time: "8 min",
    level: "Intermedio",
    emoji: "💫",
    objective:
      "Animar una escena con logo integrado, añadiendo movimiento y UN efecto especial que realce la marca sin crear caos visual.",
    learns: [
      "El logo debe permanecer ESTABLE mientras el mundo se mueve",
      "Efectos que realzan vs efectos que distraen",
      "Animación de branding de nivel publicitario",
    ],
    badPrompt: {
      title: "ANIMACIÓN SIN CONTROL",
      content:
        '"Anima la imagen con el logo y haz algo cool y llamativo con efectos."',
      result:
        "Logo deformado, efectos excesivos, aspecto amateur, daño a la marca.",
    },
    goodPrompt: {
      title: "ANIMACIÓN DE BRANDING PROFESIONAL",
      content: `Animate the image into a cinematic brand video.

REGLA FUNDAMENTAL:
El logo debe permanecer COMPLETAMENTE ESTABLE y sin deformaciones durante toda la animación.

MOVIMIENTO DE CÁMARA:
- Slow push-in muy suave (casi imperceptible) hacia la escena
- Movimiento elegante y controlado

ELEMENTOS ANIMADOS DEL ENTORNO:
- Respiración natural sutil de la persona
- Reflejos de luz moviéndose suavemente en las superficies
- Actividad sutil del aeropuerto en el fondo (fuera de foco)

EFECTO ESPECIAL PARA EL LOGO (UN SOLO EFECTO):
- Resplandor cálido y suave que pasa sutilmente sobre el logo
- Como un reflejo de luz natural del ventanal
- Intensidad: MUY SUTIL (apenas perceptible)
- Aparece una sola vez, hacia el segundo 4-5

FORMATO:
- Duración: 6-8 segundos
- Estilo: publicitario premium de marca de lujo
- Calidad: cinematográfica
- El logo NUNCA se deforma ni se mueve`,
      result:
        "Video de branding premium: el entorno vive, el logo permanece sólido y realzado sutilmente.",
    },
    keyMessage:
      "El logo NO se mueve. El MUNDO se mueve alrededor. Un efecto bien hecho se SIENTE, no GRITA.",
    instructions: [
      "Usa la imagen del ejercicio 07 (logo en objeto)",
      "Anímala con las reglas de estabilidad",
      "Añade UN efecto sutil sobre el logo",
      "Verifica: ¿El logo se deformó? Si sí, reintenta",
    ],
  },
  {
    id: "09",
    title: "Escena Corporativa con Logo",
    part: "PARTE 4: BRANDING E IDENTIDAD",
    type: "CORPORATIVO",
    typeColor: "bg-teal-600",
    time: "15 min",
    level: "Intermedio-Avanzado",
    emoji: "👥",
    objective:
      "Crear una escena de ambiente laboral/capacitación donde el logo de la empresa aparece integrado en el entorno, transmitiendo profesionalismo y calidad de vida.",
    learns: [
      "Crear contenido corporativo con identidad de marca",
      "Transmitir valores de empresa a través de imágenes",
      "Integrar logo en contextos de equipo y trabajo",
    ],
    badPrompt: {
      title: "ESCENA CORPORATIVA GENÉRICA",
      content:
        '"Una oficina con gente trabajando feliz y el logo en la pared."',
      result:
        "Escena stock genérica, sin personalidad, logo flotando, sin emoción real.",
    },
    goodPrompt: {
      title: "ESCENA CORPORATIVA CON STORYTELLING",
      content: `Rol: Fotógrafo corporativo premium especializado en cultura empresarial y employer branding para el sector turismo.

Contexto: Sala de capacitación moderna y luminosa dentro de las oficinas de una agencia de viajes innovadora. Espacio con diseño contemporáneo, paredes claras, plantas naturales, grandes ventanales con luz natural. En la pared principal del fondo, el logo "REBOLLAR TRAVEL" aparece como elemento arquitectónico: retroiluminado con una luz cálida tipo halo elegante.

Tarea: Capturar una escena de capacitación en progreso que transmita ENERGÍA POSITIVA, CRECIMIENTO y CALIDAD DE VIDA LABORAL:

PERSONAJE PRINCIPAL:
- Mujer formadora profesional (30-35 años) con laptop abierta
- Expresión de confianza, calidez y liderazgo

EQUIPO:
- 4-5 personas diversas alrededor de una mesa colaborativa
- Sonrisas genuinas, posturas de engagement
- Algunos tomando notas, otros mirando una pantalla
- Ambiente de aprendizaje activo y positivo

ATMÓSFERA EMOCIONAL:
- Colaboración auténtica
- Crecimiento profesional
- Bienestar laboral
- Propósito compartido

Formato: Imagen ultra realista vertical 9:16, iluminación natural combinada con luz ambiental cálida, estilo corporativo moderno premium.`,
      result:
        "Escena corporativa auténtica con identidad de marca, transmitiendo los valores de la empresa.",
    },
    keyMessage:
      "Una imagen corporativa efectiva no muestra SOLO trabajo. Muestra PROPÓSITO, EQUIPO y CALIDAD DE VIDA.",
    instructions: [
      "Imagina tu empresa ideal (o usa la tuya)",
      "Define los valores a transmitir",
      "Genera la escena con el logo integrado",
      "Opcional: Anímala con interacciones de equipo",
    ],
  },
  {
    id: "10",
    title: "Voz Off + Narrativa Publicitaria",
    part: "PARTE 5: AUDIO Y PROYECTO FINAL",
    type: "AUDIO",
    typeColor: "bg-orange-500",
    time: "10 min",
    level: "Intermedio",
    emoji: "🎙️",
    objective:
      "Crear un guion de voz en off profesional y generar el audio con IA, sincronizado con el video para crear una pieza publicitaria completa.",
    learns: [
      "Escribir guiones de voz en off para marketing",
      "Usar herramientas de IA para generar voz (ElevenLabs)",
      "Sincronizar audio con video para máximo impacto",
    ],
    badPrompt: {
      title: "VOZ SIN ESTRUCTURA",
      content:
        '"Añade una voz que diga algo sobre viajes y que suene profesional."',
      result:
        "Mensaje genérico, sin ritmo, sin emoción, desconectado del video.",
    },
    goodPrompt: {
      title: "GUION DE VOZ PROFESIONAL",
      content: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESPECIFICACIONES DE VOZ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Idioma: Español mexicano
Voz: Femenina
Tono: Cálido, profesional, inspirador
Ritmo: Medio, con pausas dramáticas
Duración total: 12-15 segundos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GUION (sincronizado con los 3 actos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ACTO 1 - HOOK | 0-3 seg]
"¿Y si este fuera el viaje... que lo cambia todo?"
(pausa dramática de 0.5 seg)

[ACTO 2 - DESEO | 3-10 seg]
"En Rebollar Travel creemos que viajar transforma.
Creamos experiencias que elevan tu forma de vivir."
(tono cálido, ritmo fluido)

[ACTO 3 - CTA | 10-15 seg]
"Tu próxima aventura te espera.
Reserva hoy... y empieza a soñar."
(tono de urgencia suave, cierre inspirador)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPT PARA ELEVENLABS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Voice: Female, Mexican Spanish
Tone: Warm, professional, inspiring, trustworthy
Style: Marketing commercial, premium brand
Pace: Medium with dramatic pauses
Emotion: Hopeful, confident, inviting`,
      result:
        "Voz profesional sincronizada que amplifica el impacto emocional del video.",
    },
    keyMessage:
      "La imagen genera ATENCIÓN. La animación crea EMOCIÓN. La voz construye CONFIANZA. Las tres juntas = Marketing profesional.",
    instructions: [
      "Escribe un guion de 3 frases (una por acto)",
      "Genera la voz en ElevenLabs",
      "Importa en CapCut y sincroniza",
      "Ajusta volúmenes: Voz -6dB, Música -18dB",
    ],
  },
  {
    id: "11",
    title: "Proyecto Final: Video Completo",
    part: "PARTE 5: AUDIO Y PROYECTO FINAL",
    type: "INTEGRACIÓN",
    typeColor: "bg-emerald-600",
    time: "25 min",
    level: "Avanzado",
    emoji: "🏆",
    objective:
      "Integrar TODOS los aprendizajes del taller en un video completo de 20-30 segundos, listo para publicar en redes sociales.",
    learns: [
      "Flujo de trabajo profesional completo",
      "Integración de todos los elementos aprendidos",
      "Exportación optimizada para redes sociales",
    ],
    badPrompt: {
      title: "PRODUCCIÓN SIN METODOLOGÍA",
      content:
        '"Voy a hacer un video bonito de viajes improvisando sobre la marcha."',
      result:
        "Resultado inconsistente, pérdida de tiempo, calidad impredecible, frustración.",
    },
    goodPrompt: {
      title: "WORKFLOW PROFESIONAL COMPLETO",
      content: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE 1: PLANIFICACIÓN (2 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Definir el destino/producto
□ Definir el mensaje central
□ Definir el ancla visual (si hay personaje)
□ Definir la estructura de 3 actos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE 2: GENERACIÓN DE IMÁGENES (10 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Escena 1: Hook (impacto visual)
□ Escena 2: Desarrollo (experiencia emocional)
□ Escena 3: CTA (cierre con logo/marca)
□ Verificar consistencia visual entre escenas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE 3: ANIMACIÓN (8 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Animar cada escena (6-8 seg c/u)
□ Movimientos de cámara coherentes
□ Efecto especial SOLO en escena 3 (si aplica)
□ Verificar que el logo NO se deforme

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE 4: AUDIO (3 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Generar voz en off (o grabar)
□ Seleccionar música de fondo
□ Preparar archivos de audio

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE 5: MONTAJE EN CAPCUT (5 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Importar todos los clips
□ Silenciar audio original de IA (Volumen 0%)
□ Ordenar: Escena 1 → 2 → 3
□ Añadir transiciones suaves
□ Insertar voz en off sincronizada
□ Añadir música de fondo
□ Ajustar niveles: Voz -6dB, Música -18dB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE 6: EXPORTACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Resolución: 1080p (Full HD)
□ Tasa de cuadros: 30 fps
□ Formato: Vertical 9:16
□ Duración total: 18-25 segundos`,
      result:
        "Video profesional completo, listo para Instagram Reels, TikTok o YouTube Shorts.",
    },
    keyMessage:
      "Hoy dejaste de crear imágenes bonitas. Hoy empezaste a crear CONTENIDO QUE VENDE.",
    instructions: [
      "Sigue el workflow fase por fase",
      "No te saltes pasos",
      "Verifica cada checkpoint antes de avanzar",
      "¡Comparte tu obra maestra al final!",
    ],
  },
];
