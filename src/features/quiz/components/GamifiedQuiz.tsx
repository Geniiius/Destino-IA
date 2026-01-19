/**
 * @file features/quiz/components/GamifiedQuiz.tsx
 * @description Quiz gamificado interactivo sobre la metodología RCTF
 *
 * Características:
 * - Animaciones fluidas entre preguntas
 * - Sistema de puntuación con multiplicadores
 * - Feedback visual inmediato
 * - Barra de progreso animada
 * - Pantalla de resultados con estadísticas
 */

import React, { useState, useEffect, useCallback } from "react";
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
// QUIZ DATA - Preguntas RCTF
// ============================================

const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Preguntas sobre ROL (R)
  {
    id: 1,
    question: "¿Qué representa la 'R' en la metodología RCTF?",
    options: ["Resultado", "Rol", "Respuesta", "Recurso"],
    correctAnswer: 1,
    explanation:
      "La 'R' representa el ROL que debe asumir la IA para responder de manera especializada.",
    category: "R",
    difficulty: "easy",
    points: 100,
  },
  {
    id: 2,
    question: "¿Cuál es el propósito principal de definir un ROL en un prompt?",
    options: [
      "Hacer el prompt más largo",
      "Dar personalidad a la IA",
      "Orientar la respuesta hacia una perspectiva experta específica",
      "Limitar las respuestas de la IA",
    ],
    correctAnswer: 2,
    explanation:
      "El ROL orienta a la IA para que responda desde una perspectiva experta específica, mejorando la calidad y relevancia de la respuesta.",
    category: "R",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 3,
    question: "¿Cuál de estos es el MEJOR ejemplo de un ROL bien definido?",
    options: [
      "Eres una IA",
      "Actúa como experto",
      "Eres un diseñador UX senior con 10 años de experiencia en apps móviles",
      "Sé creativo",
    ],
    correctAnswer: 2,
    explanation:
      "Un ROL bien definido incluye la profesión, nivel de experiencia y área de especialización específica.",
    category: "R",
    difficulty: "medium",
    points: 150,
  },

  // Preguntas sobre CONTEXTO (C)
  {
    id: 4,
    question: "¿Qué representa la 'C' en RCTF?",
    options: ["Creatividad", "Contexto", "Comando", "Calidad"],
    correctAnswer: 1,
    explanation:
      "La 'C' representa el CONTEXTO, la información de fondo necesaria para entender la situación.",
    category: "C",
    difficulty: "easy",
    points: 100,
  },
  {
    id: 5,
    question: "¿Por qué es importante incluir contexto en un prompt?",
    options: [
      "Para hacer el prompt más interesante",
      "Para que la IA entienda la situación específica y genere respuestas relevantes",
      "Para cumplir con un requisito técnico",
      "Para que el prompt sea más largo",
    ],
    correctAnswer: 1,
    explanation:
      "El contexto permite a la IA entender la situación específica, el público objetivo y las circunstancias, generando respuestas más relevantes.",
    category: "C",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 6,
    question: "¿Qué información NO es típicamente parte del contexto?",
    options: [
      "El público objetivo",
      "La industria o sector",
      "El formato de salida deseado",
      "Antecedentes del proyecto",
    ],
    correctAnswer: 2,
    explanation:
      "El formato de salida pertenece a la 'F' (Formato) de RCTF, no al Contexto.",
    category: "C",
    difficulty: "hard",
    points: 200,
  },

  // Preguntas sobre TAREA (T)
  {
    id: 7,
    question: "¿Qué representa la 'T' en RCTF?",
    options: ["Tiempo", "Tarea", "Técnica", "Texto"],
    correctAnswer: 1,
    explanation:
      "La 'T' representa la TAREA, la acción específica que queremos que la IA realice.",
    category: "T",
    difficulty: "easy",
    points: 100,
  },
  {
    id: 8,
    question:
      "¿Cuál es la característica más importante de una buena TAREA en un prompt?",
    options: [
      "Que sea muy larga y detallada",
      "Que sea clara, específica y accionable",
      "Que incluya muchas opciones",
      "Que sea ambigua para dar libertad a la IA",
    ],
    correctAnswer: 1,
    explanation:
      "Una buena tarea debe ser clara, específica y accionable para que la IA sepa exactamente qué se espera.",
    category: "T",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 9,
    question: "¿Cuál de estos es el MEJOR ejemplo de una TAREA bien definida?",
    options: [
      "Escribe algo sobre marketing",
      "Haz contenido",
      "Redacta 5 títulos de email con gancho emocional para una campaña de Black Friday",
      "Ayúdame con mi negocio",
    ],
    correctAnswer: 2,
    explanation:
      "Una tarea bien definida especifica la acción (redactar), la cantidad (5), el tipo (títulos de email), el estilo (gancho emocional) y el contexto (Black Friday).",
    category: "T",
    difficulty: "medium",
    points: 150,
  },

  // Preguntas sobre FORMATO (F)
  {
    id: 10,
    question: "¿Qué representa la 'F' en RCTF?",
    options: ["Función", "Frecuencia", "Formato", "Fórmula"],
    correctAnswer: 2,
    explanation:
      "La 'F' representa el FORMATO, cómo queremos que la IA estructure y presente su respuesta.",
    category: "F",
    difficulty: "easy",
    points: 100,
  },
  {
    id: 11,
    question: "¿Cuál de estos NO es un elemento típico del formato?",
    options: [
      "Lista con viñetas",
      "Tabla comparativa",
      "El rol del experto",
      "Longitud de la respuesta",
    ],
    correctAnswer: 2,
    explanation:
      "El rol del experto pertenece a la 'R' de RCTF. El formato incluye estructura, longitud y estilo de presentación.",
    category: "F",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 12,
    question: "¿Por qué es útil especificar el formato de salida?",
    options: [
      "Para que la respuesta sea más corta",
      "Para obtener la información en una estructura lista para usar",
      "Para confundir a la IA",
      "No es realmente útil",
    ],
    correctAnswer: 1,
    explanation:
      "Especificar el formato permite obtener respuestas en una estructura directamente utilizable, ahorrando tiempo de reformateo.",
    category: "F",
    difficulty: "medium",
    points: 150,
  },

  // Preguntas Generales / Integración
  {
    id: 13,
    question: "¿Cuál es el orden correcto de los elementos RCTF?",
    options: [
      "Resultado, Contexto, Técnica, Formato",
      "Rol, Contexto, Tarea, Formato",
      "Respuesta, Comando, Texto, Función",
      "Recurso, Contenido, Tiempo, Fórmula",
    ],
    correctAnswer: 1,
    explanation:
      "RCTF significa: Rol, Contexto, Tarea y Formato - en ese orden para estructurar prompts efectivos.",
    category: "General",
    difficulty: "easy",
    points: 100,
  },
  {
    id: 14,
    question: "¿Es obligatorio usar TODOS los elementos RCTF en cada prompt?",
    options: [
      "Sí, siempre deben estar los 4 elementos",
      "No, son guías flexibles que se adaptan según la necesidad",
      "Solo R y T son obligatorios",
      "Solo C y F son obligatorios",
    ],
    correctAnswer: 1,
    explanation:
      "RCTF es un framework flexible. Dependiendo de la situación, algunos elementos pueden ser más importantes que otros.",
    category: "General",
    difficulty: "medium",
    points: 150,
  },
  {
    id: 15,
    question: "¿Qué ventaja principal ofrece usar la metodología RCTF?",
    options: [
      "Hace los prompts más largos",
      "Garantiza respuestas perfectas siempre",
      "Estructura el pensamiento y mejora la calidad de las respuestas",
      "Reduce el costo de usar IA",
    ],
    correctAnswer: 2,
    explanation:
      "RCTF ayuda a estructurar el pensamiento de manera clara, lo que resulta en prompts más efectivos y respuestas de mayor calidad.",
    category: "General",
    difficulty: "medium",
    points: 150,
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

  const currentQ = QUIZ_QUESTIONS[state.currentQuestion];
  const progress = ((state.currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  // Timer effect
  useEffect(() => {
    if (!state.isTimerActive || state.isAnswered || showIntro) return;

    const timer = setInterval(() => {
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

    return () => clearInterval(timer);
  }, [state.isTimerActive, state.isAnswered, showIntro]);

  // Animation trigger for new questions
  useEffect(() => {
    if (!showIntro) {
      setAnimateQuestion(true);
      const timeout = setTimeout(() => setAnimateQuestion(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [state.currentQuestion, showIntro]);

  const handleStartQuiz = () => {
    setShowIntro(false);
    setState((prev) => ({ ...prev, isTimerActive: true }));
  };

  const handleSelectAnswer = useCallback(
    (answerIndex: number) => {
      if (state.isAnswered) return;

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
        setTimeout(() => setShowConfetti(false), 1500);
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
    [state.isAnswered, state.streak, currentQ]
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
    (answer, idx) => answer === QUIZ_QUESTIONS[idx].correctAnswer
  ).length;

  const maxPossibleScore = QUIZ_QUESTIONS.reduce(
    (sum, q) => sum + q.points * DIFFICULTY_STYLES[q.difficulty].multiplier,
    0
  );

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
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl mb-6 animate-float">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                Quiz <span className="text-emerald-400">RCTF</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Domina el arte del Prompt Engineering
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
              className="w-full btn-elegant-primary py-5 text-lg font-black flex items-center justify-center gap-3 group"
            >
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
              ¡Comenzar Quiz!
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
          title: "Maestro RCTF",
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
                className={`inline-flex items-center justify-center w-24 h-24 ${
                  percentage >= 70
                    ? "bg-gradient-to-br from-yellow-500 to-amber-500"
                    : "bg-gradient-to-br from-gray-600 to-gray-700"
                } rounded-full mb-6 animate-float`}
              >
                <RankIcon className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                ¡Quiz Completado!
              </h1>
              <p className={`text-2xl font-bold ${rank.color}`}>{rank.title}</p>
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
                        if (ans === QUIZ_QUESTIONS[idx].correctAnswer) {
                          acc.push((acc[acc.length - 1] || 0) + 1);
                        } else {
                          acc.push(0);
                        }
                        return acc;
                      }, [] as number[])
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
                    (q) => q.category === cat
                  );
                  const catCorrect = catQuestions.filter((q, i) => {
                    const globalIdx = QUIZ_QUESTIONS.findIndex(
                      (gq) => gq.id === q.id
                    );
                    return state.answers[globalIdx] === q.correctAnswer;
                  }).length;
                  const catPercentage = Math.round(
                    (catCorrect / catQuestions.length) * 100
                  );
                  const style = CATEGORY_STYLES[cat];
                  const Icon = style.icon;

                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <div
                        className={`${style.bg} ${style.text} w-10 h-10 rounded-lg flex items-center justify-center`}
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
                          <span className={`text-sm font-bold ${style.text}`}>
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
  const categoryStyle = CATEGORY_STYLES[currentQ.category];
  const CategoryIcon = categoryStyle.icon;
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
      <main className="flex-1 flex items-center justify-center p-4">
        <div
          className={`max-w-2xl w-full ${
            animateQuestion ? "animate-slide-up-strong" : ""
          }`}
        >
          <div className="card-glass p-6 md:p-8">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`${categoryStyle.bg} ${categoryStyle.text} w-10 h-10 rounded-xl flex items-center justify-center`}
                >
                  <CategoryIcon className="w-5 h-5" />
                </div>
                <div>
                  <span
                    className={`text-xs font-medium ${categoryStyle.text} uppercase tracking-wide`}
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
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  state.timeLeft <= 10
                    ? "bg-red-500/20 text-red-400"
                    : "bg-white/5 text-gray-400"
                } ${
                  state.timeLeft <= 10 && !state.isAnswered
                    ? "animate-pulse"
                    : ""
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">{state.timeLeft}s</span>
              </div>
            </div>

            {/* Question */}
            <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, idx) => {
                const isSelected = state.selectedAnswer === idx;
                const isCorrectOption = idx === currentQ.correctAnswer;
                const showCorrect = state.isAnswered && isCorrectOption;
                const showWrong =
                  state.isAnswered && isSelected && !isCorrectOption;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={state.isAnswered}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 flex items-center gap-4 group ${
                      showCorrect
                        ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400"
                        : showWrong
                        ? "bg-red-500/20 border-2 border-red-500 text-red-400"
                        : isSelected
                        ? "bg-white/10 border-2 border-white/30 text-white"
                        : "bg-white/5 border-2 border-transparent hover:border-white/20 hover:bg-white/10 text-gray-300"
                    } ${
                      state.isAnswered ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        showCorrect
                          ? "bg-emerald-500 text-white"
                          : showWrong
                          ? "bg-red-500 text-white"
                          : "bg-white/10 text-gray-400 group-hover:bg-white/20"
                      }`}
                    >
                      {showCorrect ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : showWrong ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </div>
                    <span className="flex-1 font-medium">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation (shown after answering) */}
            {state.isAnswered && (
              <div
                className={`p-4 rounded-xl mb-6 ${
                  isCorrect
                    ? "bg-emerald-500/10 border border-emerald-500/20"
                    : "bg-amber-500/10 border border-amber-500/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-medium mb-1 ${
                        isCorrect ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {isCorrect ? "¡Correcto!" : "Respuesta incorrecta"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Button */}
            {state.isAnswered && (
              <button
                onClick={handleNextQuestion}
                className="w-full btn-elegant-primary py-4 flex items-center justify-center gap-2 group"
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GamifiedQuiz;
