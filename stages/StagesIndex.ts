/**
 * Main export file for Stages Library
 */

// Main engine
export { StagesEngine } from './StagesEngine'

// Core modules (for advanced usage)
export { StagesDevice } from './StagesDevice'
export { StagesTransform, STAGE_WIDTH, STAGE_HEIGHT } from './StagesTransform'
export { StagesRenderer } from './StagesRenderer'
export { StagesPerformance } from './StagesPerformance'

// Child modules (AI can modify these)
export { StagesEngineObjects } from './StagesEngineObjects'
export { StagesEngineEvents } from './StagesEngineEvents'
export { StagesRendererMesh } from './StagesRendererMesh'
export { StagesRendererMaterial } from './StagesRendererMaterial'

// Types
export type {
  StageObject,
  StageConfig,
  DeviceTier,
  PerformanceMetrics,
  StageCoordinates,
  ViewportTransform,
  StageEvent,
  RenderQuality
} from './StagesTypes'

// Default export
export default StagesEngine

/**
 * Create a new Stages Engine instance
 */
export function createStages(config?: import('./StagesTypes').StageConfig) {
  return new StagesEngine(config)
}

/**
 * Library version
 */
export const VERSION = '1.0.0'

/**
 * Library constants
 */
export const CONSTANTS = {
  STAGE_WIDTH: 2048,
  STAGE_HEIGHT: 2048,
  VERSION: '1.0.0'
} as const