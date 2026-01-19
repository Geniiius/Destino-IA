/**
 * @file index.ts
 * @description Barrel export para configuración
 * 
 * Uso: import { env, APP, LIMITS } from '@/config'
 */

export { env, validateEnv } from './env';
export { APP, UI, API, LIMITS, ROUTES, REALTIME_CHANNELS } from './constants';
