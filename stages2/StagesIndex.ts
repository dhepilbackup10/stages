/**
 * Main export file for Stages Library
 */

// Import constants
import { STAGE_WIDTH, STAGE_HEIGHT } from './StagesLogicTransform'

// Main engine
export { StagesEngine } from './StagesEngine'

// Logic coordination system
export { StagesLogic } from './StagesLogic'

// Logic child modules (AI can modify these)
export { StagesLogicDevice } from './StagesLogicDevice'
export { StagesLogicTransform } from './StagesLogicTransform'
export { StagesLogicPerformance } from './StagesLogicPerformance'

// Core modules (for advanced usage) - DEPRECATED: Use StagesLogic* modules instead
export { StagesRenderer } from './StagesRenderer'

// Constants for backward compatibility
export { STAGE_WIDTH, STAGE_HEIGHT } from './StagesLogicTransform'

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
 * Library constants (exported from StagesLogicTransform for consistency)
 */
export const CONSTANTS = {
  STAGE_WIDTH,
  STAGE_HEIGHT,
  VERSION: '1.0.0'
} as const