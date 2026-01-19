// Base de données des exercices du workshop
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
      content: `"Oye, quiero una imagen de una persona trabajando con su laptop en una playa bonita... algo moderno y cool."`,
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
  // Ajoutons quelques exercices supplémentaires pour avoir une base complète
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
      content: `"Anima la imagen con muchos efectos especiales, partículas brillantes, luces de neón, explosiones de color, todo muy espectacular y llamativo."`,
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
];
