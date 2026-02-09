/**
 * @file services/index.ts
 * @description Barrel export para todos los servicios
 */

// Supabase
export * from "./supabase";

// Auth
export * from "./auth";

// Direct Messages
export * from "./directMessages";

// Session State (temps réel)
export * from "./sessionState";

// Exercises (persistance)
export * from "./exercises";

// Quiz (réponses + scores)
export * from "./quiz";

// Broadcast messages
export * from "./broadcast";
