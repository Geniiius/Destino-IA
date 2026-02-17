/**
 * @file features/quiz/components/GamifiedQuiz.tsx
 * @description Quiz gamificado interactivo sobre la Estructura de 5 Pasos del Prompt
 *
 * Características:
 * - Animaciones fluidas entre preguntas
 * - Sistema de puntuación con multiplicadores
 * - Feedback visual inmediato
 * - Barra de progreso animada
 * - Pantalla de resultados con estadísticas
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Trophy,
  Star,
  Zap,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Target,
  Brain,
  Clock,
  Award,
  ChevronRight,
  Home,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: "R" | "C" | "T" | "F" | "General";
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

interface QuizState {
  currentQuestion: number;
  score: number;
  streak: number;
  answers: (number | null)[];
  showResult: boolean;
  isAnswered: boolean;
  selectedAnswer: number | null;
  timeLeft: number;
  isTimerActive: boolean;
}

// ============================================
// QUIZ DATA - Dominando el Prompt: La Estructura de 5 Pasos
// ============================================

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "¿Cuál prompt generará MEJORES resultados?",
    options: [
      "Hazme una foto de una playa bonita con palmeras y el mar azul",
      "Actúa como fotógrafo de viajes. Para promocionar un resort en Maldivas. Playa cristalina con palmeras al amanecer, sensación de paraíso exclusivo. Estilo cinematográfico, colores vibrantes. Formato 16:9.",
    ],
    correctAnswer: 1,
    explanation:
      "El Prompt B usa los 5 elementos de la fórmula: ROL + OBJETIVO + ESCENA/EMOCIÓN + ESTILO + SALIDA",
    category: "General",
    difficulty: "easy",
    points: 100,
  },
  {
    id: 2,
    question: "¿Cuál es el PRIMER elemento de la estructura de 5 pasos?",
    options: ["Objetivo", "Escena + Emoción", "ROL", "Estilo Visual"],
    correctAnswer: 2,
    explanation:
      "El ROL define QUIÉN es la IA: director creativo, fotógrafo, experto en publicidad...",
    category: "R",
    difficulty: "easy",
    points: 100,
  },
  {
    id: 3,
    question:
      "La estructura de 5 pasos funciona SOLO para generar imágenes estáticas",
    options: ["Verdadero", "Falso"],
    correctAnswer: 1,
    explanation: "¡La fórmula es ideal tanto para IMAGEN como para VIDEO!",
    category: "General",
    difficulty: "easy",
    points: 100,
  },
  {
    id: 4,
    question:
      "¿Qué elemento FALTA en este prompt?\n\n'Actúa como un chef italiano. Una pareja cenando en un restaurante romántico con velas, transmitiendo intimidad. Estilo cinematográfico, luz cálida. Formato cuadrado 1:1.'",
    options: ["ROL", "ESCENA + EMOCIÓN", "OBJETIVO", "ESTILO VISUAL"],
    correctAnswer: 2,
    explanation:
      "No dice PARA QUÉ es la imagen. ¿Menú? ¿Instagram? ¿Publicidad?",
    category: "C",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 5,
    question:
      "Quieres crear una imagen para promocionar un CAFÉ ARTESANAL en Instagram...\n\nActúa como un _______ [ROL]\n\n¿Qué ROL elegirías?",
    options: [
      "Chef de cocina",
      "Fotógrafo de producto",
      "Diseñador de interiores",
    ],
    correctAnswer: 1,
    explanation:
      "Un fotógrafo de producto sabe capturar objetos de forma atractiva y comercial",
    category: "R",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 6,
    question: "El elemento 'ESCENA + EMOCIÓN' combina dos aspectos. ¿Cuáles?",
    options: [
      "Colores y texturas",
      "Lo que VES + Lo que SIENTES",
      "Tamaño y resolución",
      "Rol y objetivo",
    ],
    correctAnswer: 1,
    explanation:
      "Descripción física (lo visible) + Impacto emocional (lo que transmite)",
    category: "C",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 7,
    question: "¿Qué especificamos en la SALIDA ESPERADA?",
    options: [
      "La emoción que queremos transmitir",
      "El rol de la IA",
      "Resolución, formato (16:9, 9:16), calidad",
      "El estilo artístico",
    ],
    correctAnswer: 2,
    explanation:
      "La salida define las especificaciones TÉCNICAS: formato, resolución, dimensiones",
    category: "F",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 8,
    question: "Selecciona el ORDEN CORRECTO de los 5 elementos",
    options: [
      "ROL → OBJETIVO → ESCENA+EMOCIÓN → ESTILO → SALIDA",
      "OBJETIVO → ROL → ESTILO → ESCENA+EMOCIÓN → SALIDA",
      "ROL → ESCENA+EMOCIÓN → OBJETIVO → SALIDA → ESTILO",
      "ESTILO → ROL → OBJETIVO → ESCENA+EMOCIÓN → SALIDA",
    ],
    correctAnswer: 0,
    explanation:
      "ROL → OBJETIVO → ESCENA+EMOCIÓN → ESTILO → SALIDA es el orden correcto de la estructura de 5 pasos",
    category: "General",
    difficulty: "hard",
    points: 200,
  },
  {
    id: 9,
    question:
      "¿Es correcto incluir la EMOCIÓN junto con la descripción visual de la ESCENA en un mismo elemento?",
    options: ["Sí", "No"],
    correctAnswer: 0,
    explanation:
      "¡Sí! 'ESCENA + EMOCIÓN' combina lo que se ve con lo que se siente",
    category: "C",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 10,
    question:
      "¿Qué elemento está MAL UBICADO o es INCORRECTO?\n\n'Actúa como fotógrafo de viajes [ROL]. Para formato vertical 9:16 [OBJETIVO]. Una familia en la playa al atardecer, felicidad [ESCENA]. Estilo cinematográfico [ESTILO]. Promocionar resort de lujo [SALIDA].'",
    options: [
      "ROL está mal definido",
      "OBJETIVO y SALIDA están intercambiados",
      "ESCENA no tiene emoción",
      "ESTILO es incorrecto",
    ],
    correctAnswer: 1,
    explanation:
      "'Promocionar resort' es el OBJETIVO, '9:16' es la SALIDA. ¡Están al revés!",
    category: "T",
    difficulty: "hard",
    points: 200,
  },
];

// ============================================
// CATEGORY STYLES
// ============================================

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; icon: React.ElementType }
> = {
  R: { bg: "bg-blue-500/20", text: "text-blue-400", icon: Brain },
  C: { bg: "bg-purple-500/20", text: "text-purple-400", icon: Target },
  T: { bg: "bg-amber-500/20", text: "text-amber-400", icon: Zap },
  F: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: Sparkles },
  General: { bg: "bg-pink-500/20", text: "text-pink-400", icon: Star },
};

const DIFFICULTY_STYLES = {
  easy: { label: "Fácil", color: "text-green-400", multiplier: 1 },
  medium: { label: "Medio", color: "text-yellow-400", multiplier: 1.5 },
  hard: { label: "Difícil", color: "text-red-400", multiplier: 2 },
};

// ============================================
// INITIAL STATE
// ============================================

const INITIAL_STATE: QuizState = {
  currentQuestion: 0,
  score: 0,
  streak: 0,
  answers: [],
  showResult: false,
  isAnswered: false,
  selectedAnswer: null,
  timeLeft: 30,
  isTimerActive: false,
};

// ============================================
// COMPONENT
// ============================================

interface GamifiedQuizProps {
  onClose?: () => void;
  participantName?: string;
}

export const GamifiedQuiz: React.FC<GamifiedQuizProps> = ({
  onClose,
  participantName = "Participante",
}) => {
  const [state, setState] = useState<QuizState>(INITIAL_STATE);
  const [showIntro, setShowIntro] = useState(true);
  const [animateQuestion, setAnimateQuestion] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState<{
    points: number;
    x: number;
    y: number;
  } | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState<string>("");
  const [showComboEffect, setShowComboEffect] = useState(false);

  // Refs for timer and timeouts cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Helper function to create tracked timeouts
  const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      callback();
      // Remove from tracking array after execution
      timeoutsRef.current = timeoutsRef.current.filter(
        (id) => id !== timeoutId,
      );
    }, delay);
    timeoutsRef.current.push(timeoutId);
    return timeoutId;
  }, []);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      // Clear main timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // Clear all tracked timeouts
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutsRef.current = [];
    };
  }, []);

  const currentQ = QUIZ_QUESTIONS[state.currentQuestion];
  const progress = ((state.currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  // Timer effect with proper cleanup
  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!state.isTimerActive || state.isAnswered || showIntro) return;

    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          // Time's up - auto submit wrong answer
          return {
            ...prev,
            isAnswered: true,
            isTimerActive: false,
            timeLeft: 0,
            streak: 0,
            answers: [...prev.answers, null],
          };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.isTimerActive, state.isAnswered, showIntro]);

  // Animation trigger for new questions
  useEffect(() => {
    if (!showIntro) {
      setAnimateQuestion(true);
      safeSetTimeout(() => setAnimateQuestion(false), 500);
    }
  }, [state.currentQuestion, showIntro, safeSetTimeout]);

  const handleStartQuiz = () => {
    setShowIntro(false);
    setState((prev) => ({ ...prev, isTimerActive: true }));
  };

  const handleSelectAnswer = useCallback(
    (answerIndex: number) => {
      if (state.isAnswered || !currentQ) return;

      const isCorrect = answerIndex === currentQ.correctAnswer;
      const streakBonus =
        state.streak >= 3 ? 1.5 : state.streak >= 2 ? 1.25 : 1;
      const difficultyMultiplier =
        DIFFICULTY_STYLES[currentQ.difficulty].multiplier;
      const earnedPoints = isCorrect
        ? Math.round(currentQ.points * streakBonus * difficultyMultiplier)
        : 0;

      if (isCorrect) {
        setShowConfetti(true);
        safeSetTimeout(() => setShowConfetti(false), 1500);

        // Puntos flotantes
        setFloatingPoints({ points: earnedPoints, x: 50, y: 50 });
        safeSetTimeout(() => setFloatingPoints(null), 2000);

        // Mensajes motivacionales
        const messages = [
          state.streak >= 4 ? "🔥 ¡IMPARABLE!" : "",
          state.streak === 3 ? "⚡ ¡RACHA DE FUEGO!" : "",
          state.streak === 2 ? "✨ ¡Vas Genial!" : "",
          earnedPoints >= 200 ? "💎 ¡RESPUESTA PERFECTA!" : "",
          state.timeLeft >= 25 ? "⚡ ¡Súper Rápido!" : "",
          currentQ.difficulty === "hard"
            ? "🎯 ¡PREGUNTA DIFÍCIL DOMINADA!"
            : "",
          "🌟 ¡Excelente!",
          "🚀 ¡Increíble!",
          "💪 ¡Así se hace!",
        ].filter((m) => m);

        setMotivationalMessage(
          messages[Math.floor(Math.random() * messages.length)] ?? "",
        );
        safeSetTimeout(() => setMotivationalMessage(""), 2000);

        // Efecto de combo para rachas largas
        if (state.streak >= 2) {
          setShowComboEffect(true);
          safeSetTimeout(() => setShowComboEffect(false), 1000);
        }
      } else {
        // Mensajes de ánimo cuando fallas
        const encouragement = [
          "💪 ¡No te rindas!",
          "🎯 La próxima es tuya",
          "✨ Sigue intentando",
        ];
        setMotivationalMessage(
          encouragement[Math.floor(Math.random() * encouragement.length)] ?? "",
        );
        safeSetTimeout(() => setMotivationalMessage(""), 2000);
      }

      setState((prev) => ({
        ...prev,
        isAnswered: true,
        selectedAnswer: answerIndex,
        isTimerActive: false,
        score: prev.score + earnedPoints,
        streak: isCorrect ? prev.streak + 1 : 0,
        answers: [...prev.answers, answerIndex],
      }));
    },
    [state.isAnswered, state.streak, state.timeLeft, currentQ],
  );

  const handleNextQuestion = () => {
    if (state.currentQuestion >= QUIZ_QUESTIONS.length - 1) {
      setState((prev) => ({ ...prev, showResult: true }));
    } else {
      setState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        isAnswered: false,
        selectedAnswer: null,
        timeLeft: 30,
        isTimerActive: true,
      }));
    }
  };

  const handleRestart = () => {
    setState(INITIAL_STATE);
    setShowIntro(true);
  };

  const correctAnswers = state.answers.filter(
    (answer, idx) => answer === QUIZ_QUESTIONS[idx]?.correctAnswer,
  ).length;

  const percentage = Math.round((correctAnswers / QUIZ_QUESTIONS.length) * 100);

  // ============================================
  // RENDER: INTRO SCREEN
  // ============================================
  if (showIntro) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="relative card-glass p-8 md:p-12 animate-slide-up-strong">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-3xl mb-6 animate-float shadow-2xl shadow-emerald-500/50">
                <Trophy className="w-12 h-12 text-white animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                Quiz 5 Pasos
              </h1>
              <div className="flex flex-wrap justify-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">🎭 ROL</span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">🎯 OBJETIVO</span>
                <span className="px-2 py-1 bg-pink-500/20 text-pink-400 text-xs rounded-full font-medium">🎬 ESCENA</span>
                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full font-medium">🎨 ESTILO</span>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">📐 FORMATO</span>
              </div>
              <p className="text-gray-300 text-xl font-semibold mb-2">
                🎯 Domina el arte del Prompt Engineering
              </p>
              <p className="text-emerald-400 text-sm font-medium animate-pulse">
                ✨ ¡Demuestra tu conocimiento y gana puntos! ✨
              </p>
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-400">
                  {QUIZ_QUESTIONS.length}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Preguntas
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">30s</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Por pregunta
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-400">2x</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Streak Bonus
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                Categorías
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CATEGORY_STYLES).map(([key, style]) => {
                  const Icon = style.icon;
                  return (
                    <span
                      key={key}
                      className={`${style.bg} ${style.text} px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {key === "R"
                        ? "Rol"
                        : key === "C"
                          ? "Contexto"
                          : key === "T"
                            ? "Tarea"
                            : key === "F"
                              ? "Formato"
                              : "General"}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Player Info */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {participantName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-emerald-400">Jugador</div>
                  <div className="text-lg font-bold text-white">
                    {participantName}
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartQuiz}
              className="w-full bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-500 hover:via-blue-500 hover:to-purple-500 py-6 text-xl font-black text-white rounded-2xl flex items-center justify-center gap-3 group transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] animate-pulse"
            >
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              🚀 ¡COMENZAR QUIZ! 🚀
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="w-full mt-4 py-3 text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Volver al inicio
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: RESULTS SCREEN
  // ============================================
  if (state.showResult) {
    const getRank = () => {
      if (percentage >= 90)
        return {
          title: "Maestro del Prompt",
          icon: Trophy,
          color: "text-yellow-400",
        };
      if (percentage >= 70)
        return { title: "Experto", icon: Award, color: "text-emerald-400" };
      if (percentage >= 50)
        return { title: "Aprendiz", icon: Star, color: "text-blue-400" };
      return { title: "Novato", icon: Brain, color: "text-gray-400" };
    };

    const rank = getRank();
    const RankIcon = rank.icon;

    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Celebration Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {percentage >= 70 && (
              <>
                <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-yellow-500/20 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] animate-pulse" />
              </>
            )}
          </div>

          <div className="relative card-glass p-8 md:p-12 animate-slide-up-strong">
            {/* Rank Display */}
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center justify-center w-32 h-32 mb-6 animate-bounce shadow-2xl ${
                  percentage >= 90
                    ? "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-yellow-500/50"
                    : percentage >= 70
                      ? "bg-gradient-to-br from-emerald-500 to-blue-500 shadow-emerald-500/50"
                      : percentage >= 50
                        ? "bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/50"
                        : "bg-gradient-to-br from-gray-600 to-gray-700"
                } rounded-full`}
              >
                <RankIcon className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {percentage >= 90
                  ? "🎉 ¡INCREÍBLE! 🎉"
                  : percentage >= 70
                    ? "🌟 ¡EXCELENTE! 🌟"
                    : percentage >= 50
                      ? "👏 ¡BIEN HECHO! 👏"
                      : "💪 ¡SIGUE INTENTANDO! 💪"}
              </h1>
              <p className={`text-3xl font-black ${rank.color} animate-pulse`}>
                {rank.title}
              </p>
              <p className="text-gray-400 mt-2 text-lg">
                {percentage >= 90
                  ? "¡Eres un verdadero maestro del Prompt!"
                  : percentage >= 70
                    ? "¡Dominas muy bien la Estructura de 5 Pasos!"
                    : percentage >= 50
                      ? "Vas por buen camino, ¡sigue practicando!"
                      : "No te desanimes, ¡la práctica hace al maestro!"}
              </p>
            </div>

            {/* Score Card */}
            <div className="bg-white/5 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-4xl font-black text-emerald-400">
                    {state.score}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Puntos
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-black text-blue-400">
                    {correctAnswers}/{QUIZ_QUESTIONS.length}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Correctas
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-black text-purple-400">
                    {percentage}%
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Precisión
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-black text-amber-400">
                    {Math.max(
                      ...state.answers.reduce((acc, ans, idx) => {
                        if (ans === QUIZ_QUESTIONS[idx]?.correctAnswer) {
                          acc.push((acc[acc.length - 1] || 0) + 1);
                        } else {
                          acc.push(0);
                        }
                        return acc;
                      }, [] as number[]),
                    )}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Mejor Racha
                  </div>
                </div>
              </div>
            </div>

            {/* Performance by Category */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">
                Rendimiento por Categoría
              </h3>
              <div className="space-y-3">
                {["R", "C", "T", "F", "General"].map((cat) => {
                  const catQuestions = QUIZ_QUESTIONS.filter(
                    (q) => q.category === cat,
                  );
                  const catCorrect = catQuestions.filter((q, _i) => {
                    const globalIdx = QUIZ_QUESTIONS.findIndex(
                      (gq) => gq.id === q.id,
                    );
                    return state.answers[globalIdx] === q.correctAnswer;
                  }).length;
                  const catPercentage = Math.round(
                    (catCorrect / catQuestions.length) * 100,
                  );
                  const style = CATEGORY_STYLES[cat] ?? CATEGORY_STYLES["General"];
                  const Icon = style?.icon ?? (() => null);

                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <div
                        className={`${style?.bg ?? ""} ${style?.text ?? ""} w-10 h-10 rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-white">
                            {cat === "R"
                              ? "Rol"
                              : cat === "C"
                                ? "Contexto"
                                : cat === "T"
                                  ? "Tarea"
                                  : cat === "F"
                                    ? "Formato"
                                    : "General"}
                          </span>
                          <span className={`text-sm font-bold ${style?.text ?? ""}`}>
                            {catCorrect}/{catQuestions.length}
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              cat === "R"
                                ? "bg-blue-500"
                                : cat === "C"
                                  ? "bg-purple-500"
                                  : cat === "T"
                                    ? "bg-amber-500"
                                    : cat === "F"
                                      ? "bg-emerald-500"
                                      : "bg-pink-500"
                            } transition-all duration-500`}
                            style={{ width: `${catPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 btn-elegant-primary py-4 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Intentar de Nuevo
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex-1 btn-elegant-secondary py-4 flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Volver
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: QUESTION SCREEN
  // ============================================

  // Validar que currentQ existe
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            No hay preguntas disponibles
          </h2>
          <p className="text-gray-400 mb-6">
            El quiz no tiene preguntas configuradas.
          </p>
          {onClose && (
            <button onClick={onClose} className="btn-elegant-primary px-6 py-3">
              Volver
            </button>
          )}
        </div>
      </div>
    );
  }

  const categoryStyle = CATEGORY_STYLES[currentQ.category] ?? CATEGORY_STYLES["General"];
  const CategoryIcon = categoryStyle?.icon ?? (() => null);
  const isCorrect = state.selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            >
              <Sparkles
                className={`w-4 h-4 ${
                  [
                    "text-emerald-400",
                    "text-blue-400",
                    "text-purple-400",
                    "text-yellow-400",
                  ][Math.floor(Math.random() * 4)]
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Floating Points Animation */}
      {floatingPoints && (
        <div
          className="fixed z-50 pointer-events-none animate-bounce"
          style={{
            left: "50%",
            top: "30%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="text-6xl font-black text-emerald-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.8)] animate-pulse">
            +{floatingPoints.points}
          </div>
        </div>
      )}

      {/* Motivational Message */}
      {motivationalMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-purple-500/50 animate-bounce">
            <span className="text-2xl font-black">{motivationalMessage}</span>
          </div>
        </div>
      )}

      {/* Combo Effect */}
      {showComboEffect && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <div className="text-8xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-ping">
            COMBO x{state.streak}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex-shrink-0 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Progress */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Pregunta{" "}
                <span className="text-white font-bold">
                  {state.currentQuestion + 1}
                </span>{" "}
                de {QUIZ_QUESTIONS.length}
              </span>
            </div>

            {/* Score & Streak */}
            <div className="flex items-center gap-4">
              {state.streak >= 2 && (
                <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full animate-pulse">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-bold">
                    {state.streak}x Racha
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full">
                <Star className="w-4 h-4" />
                <span className="text-sm font-bold">{state.score}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div
          className={`max-w-5xl w-full ${
            animateQuestion ? "animate-slide-up-strong" : ""
          }`}
        >
          <div className="card-glass p-4 md:p-6">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-4 lg:mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`${categoryStyle?.bg ?? ""} ${categoryStyle?.text ?? ""} w-9 h-9 lg:w-8 lg:h-8 rounded-xl flex items-center justify-center`}
                >
                  <CategoryIcon className="w-4 h-4" />
                </div>
                <div>
                  <span
                    className={`text-xs font-medium ${categoryStyle?.text ?? ""} uppercase tracking-wide`}
                  >
                    {currentQ.category === "R"
                      ? "Rol"
                      : currentQ.category === "C"
                        ? "Contexto"
                        : currentQ.category === "T"
                          ? "Tarea"
                          : currentQ.category === "F"
                            ? "Formato"
                            : "General"}
                  </span>
                  <div
                    className={`text-xs ${
                      DIFFICULTY_STYLES[currentQ.difficulty].color
                    }`}
                  >
                    {DIFFICULTY_STYLES[currentQ.difficulty].label} •{" "}
                    {currentQ.points} pts
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                  state.timeLeft <= 5
                    ? "bg-red-600 text-white scale-110 animate-bounce shadow-lg shadow-red-500/50"
                    : state.timeLeft <= 10
                      ? "bg-red-500/30 text-red-300 animate-pulse scale-105"
                      : "bg-white/5 text-gray-400"
                }`}
              >
                <Clock
                  className={`w-4 h-4 ${state.timeLeft <= 5 ? "animate-spin" : ""}`}
                />
                <span className="font-mono text-base">
                  {state.timeLeft <= 5 ? "⚠️ " : ""}
                  {state.timeLeft}s
                </span>
              </div>
            </div>
            {/* Time Warning Overlay */}
            {state.timeLeft <= 5 && !state.isAnswered && (
              <div className="absolute top-0 left-0 right-0 bg-red-500/10 py-2 text-center animate-pulse">
                <span className="text-red-400 font-bold text-sm">
                  ⏰ ¡TIEMPO CORRIENDO! ⏰
                </span>
              </div>
            )}
            {/* Question */}
            <h2 className="text-lg md:text-xl lg:text-lg font-bold text-white mb-4 lg:mb-3 leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Two-column layout: Options left, Feedback right */}
            <div className={`${state.isAnswered ? "lg:grid lg:grid-cols-[1fr,auto] lg:gap-6" : ""}`}>
              {/* Left: Options */}
              <div>
            {/* Options - Layout especial para comparación de prompts (pregunta 1) */}
            {currentQ.id === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 lg:mb-0">
                {currentQ.options.map((option, idx) => {
                  const isSelected = state.selectedAnswer === idx;
                  const isCorrectOption = idx === currentQ.correctAnswer;
                  const showCorrect = state.isAnswered && isCorrectOption;
                  const showWrong = state.isAnswered && isSelected && !isCorrectOption;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={state.isAnswered}
                      className={`group relative flex flex-col h-full p-4 lg:p-3 rounded-2xl transition-all duration-300 ${
                        showCorrect
                          ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-2 border-emerald-500 shadow-lg shadow-emerald-500/30"
                          : showWrong
                            ? "bg-gradient-to-br from-red-500/20 to-red-600/10 border-2 border-red-500 shadow-lg shadow-red-500/30"
                            : isSelected
                              ? "bg-white/10 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20"
                              : "bg-gradient-to-br from-white/5 to-white/[0.02] border-2 border-white/10 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.02]"
                      } ${state.isAnswered ? "cursor-default" : "cursor-pointer"}`}
                    >
                      {/* Label Prompt A/B */}
                      <div className="flex items-center justify-between mb-2 lg:mb-1">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            showCorrect
                              ? "bg-emerald-500 text-white"
                              : showWrong
                                ? "bg-red-500 text-white"
                                : idx === 0
                                  ? "bg-gray-500/30 text-gray-400"
                                  : "bg-purple-500/30 text-purple-400"
                          }`}
                        >
                          Prompt {String.fromCharCode(65 + idx)}
                        </div>
                        
                        {/* Indicador de resultado */}
                        {showCorrect && (
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <CheckCircle className="w-6 h-6" />
                            <span className="text-sm font-bold">CORRECTO</span>
                          </div>
                        )}
                        {showWrong && (
                          <div className="flex items-center gap-1.5 text-red-400">
                            <XCircle className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Contenido del prompt */}
                      <div className={`flex-1 text-left leading-relaxed ${
                        showCorrect 
                          ? "text-emerald-100" 
                          : showWrong 
                            ? "text-red-200" 
                            : "text-gray-300"
                      }`}>
                        {/* Estilo especial para prompt estructurado (opción B) */}
                        {idx === 1 ? (
                          <div className="space-y-2">
                            {option.split('. ').map((part, partIdx) => {
                              // Colorear cada parte según el elemento RCTF
                              const isRol = part.includes('Actúa como');
                              const isObjetivo = part.includes('Para ');
                              const isEstilo = part.includes('Estilo') || part.includes('colores');
                              const isFormato = part.includes('Formato');

                              return (
                                <span 
                                  key={partIdx} 
                                  className={`inline ${
                                    isRol ? "text-blue-400 font-semibold" :
                                    isObjetivo ? "text-purple-400 font-semibold" :
                                    isEstilo ? "text-amber-400 font-semibold" :
                                    isFormato ? "text-emerald-400 font-semibold" :
                                    ""
                                  }`}
                                >
                                  {part}{partIdx < option.split('. ').length - 1 ? '. ' : ''}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="italic opacity-80">{option}</p>
                        )}
                      </div>

                      {/* Badge indicador de calidad */}
                      {!state.isAnswered && (
                        <div className={`mt-4 pt-4 border-t ${idx === 1 ? "border-purple-500/20" : "border-white/10"}`}>
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            {idx === 0 ? (
                              <>
                                <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                                Prompt básico
                              </>
                            ) : (
                              <>
                                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                                Prompt estructurado
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Mostrar elementos RCTF si es correcto */}
                      {showCorrect && idx === 1 && (
                        <div className="mt-4 pt-4 border-t border-emerald-500/20">
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">🎭 ROL</span>
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">🎯 OBJETIVO</span>
                            <span className="px-2 py-1 bg-pink-500/20 text-pink-400 text-xs rounded-full font-medium">🎬 ESCENA</span>
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full font-medium">🎨 ESTILO</span>
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">📐 FORMATO</span>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Options - Layout normal para otras preguntas */
              <div
                className={`mb-4 lg:mb-0 ${currentQ.options.length === 2 ? "grid grid-cols-2 gap-3" : "space-y-2"}`}
              >
              {currentQ.options.map((option, idx) => {
                const isSelected = state.selectedAnswer === idx;
                const isCorrectOption = idx === currentQ.correctAnswer;
                const showCorrect = state.isAnswered && isCorrectOption;
                const showWrong =
                  state.isAnswered && isSelected && !isCorrectOption;

                // Estilos especiales para Verdadero/Falso
                const isTrueFalse = currentQ.options.length === 2;
                const isTrue =
                  isTrueFalse && option.toLowerCase().includes("verdadero");
                const isFalse =
                  isTrueFalse && option.toLowerCase().includes("falso");

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={state.isAnswered}
                    className={`w-full p-4 lg:p-3 rounded-xl ${isTrueFalse ? "text-center" : "text-left"} transition-all duration-300 flex ${isTrueFalse ? "flex-col" : "flex-row"} items-center gap-3 group ${
                      showCorrect
                        ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20"
                        : showWrong
                          ? "bg-red-500/20 border-2 border-red-500 text-red-400 shadow-lg shadow-red-500/20"
                          : isSelected
                            ? "bg-white/10 border-2 border-white/30 text-white"
                            : isTrueFalse && isTrue
                              ? "bg-emerald-500/5 border-2 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-300"
                              : isTrueFalse && isFalse
                                ? "bg-red-500/5 border-2 border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-300"
                                : "bg-white/5 border-2 border-transparent hover:border-white/20 hover:bg-white/10 text-gray-300"
                    } ${
                      state.isAnswered ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    <div
                      className={`${isTrueFalse ? "w-14 h-14 lg:w-12 lg:h-12" : "w-8 h-8 lg:w-7 lg:h-7"} rounded-lg flex items-center justify-center font-bold text-sm ${
                        showCorrect
                          ? "bg-emerald-500 text-white"
                          : showWrong
                            ? "bg-red-500 text-white"
                            : isTrueFalse && isTrue
                              ? "bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30"
                              : isTrueFalse && isFalse
                                ? "bg-red-500/20 text-red-400 group-hover:bg-red-500/30"
                                : "bg-white/10 text-gray-400 group-hover:bg-white/20"
                      }`}
                    >
                      {showCorrect ? (
                        <CheckCircle
                          className={`${isTrueFalse ? "w-8 h-8" : "w-5 h-5"}`}
                        />
                      ) : showWrong ? (
                        <XCircle
                          className={`${isTrueFalse ? "w-8 h-8" : "w-5 h-5"}`}
                        />
                      ) : isTrueFalse ? (
                        isTrue ? (
                          <CheckCircle className="w-8 h-8" />
                        ) : (
                          <XCircle className="w-8 h-8" />
                        )
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </div>
                    <span
                      className={`${isTrueFalse ? "flex-none text-2xl" : "flex-1"} font-bold`}
                    >
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
            )}
              </div>

              {/* Right side: Explanation + Next Button (side by side on desktop) */}
              {state.isAnswered && (
                <div className="lg:w-72 lg:flex-shrink-0 flex flex-col justify-center gap-3">
            {/* Explanation (shown after answering) */}
              <div
                className={`p-3 rounded-xl ${
                  isCorrect
                    ? "bg-emerald-500/10 border border-emerald-500/20"
                    : "bg-amber-500/10 border border-amber-500/20"
                }`}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-medium mb-1 text-sm ${
                        isCorrect ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {isCorrect ? "¡Correcto!" : "Respuesta incorrecta"}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              </div>
            {/* Next Button */}
              <button
                onClick={handleNextQuestion}
                className="w-full btn-elegant-primary py-3 flex items-center justify-center gap-2 group text-sm"
              >
                {state.currentQuestion >= QUIZ_QUESTIONS.length - 1 ? (
                  <>
                    <Trophy className="w-5 h-5" />
                    Ver Resultados
                  </>
                ) : (
                  <>
                    Siguiente Pregunta
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GamifiedQuiz;
