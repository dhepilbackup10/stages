/**
 * Performance monitoring and adaptive quality system
 */

import type { PerformanceMetrics, RenderQuality } from './StagesTypes'

export class StagesPerformance {
  private frameCount = 0
  private lastTime = 0
  private fpsHistory: number[] = []
  private renderCalls = 0
  private objectCount = 0

  private metrics: PerformanceMetrics = {
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    renderCalls: 0,
    objectCount: 0
  }

  private targetFPS = 60
  private minFPS = 45 // Threshold for quality reduction

  /**
   * Update performance metrics (call every frame)
   */
  update(): void {
    const now = performance.now()
    const deltaTime = now - this.lastTime

    if (deltaTime >= 1000) { // Update every second
      const fps = (this.frameCount * 1000) / deltaTime
      this.fpsHistory.push(fps)

      // Keep only last 30 samples (30 seconds)
      if (this.fpsHistory.length > 30) {
        this.fpsHistory.shift()
      }

      this.metrics.fps = fps
      this.metrics.frameTime = 1000 / fps
      this.metrics.renderCalls = this.renderCalls
      this.metrics.objectCount = this.objectCount

      // Update memory usage if available
      const memory = (performance as any).memory
      if (memory) {
        this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
      }

      this.frameCount = 0
      this.renderCalls = 0
      this.lastTime = now
    }

    this.frameCount++
  }

  /**
   * Track render call
   */
  trackRenderCall(): void {
    this.renderCalls++
  }

  /**
   * Update object count
   */
  setObjectCount(count: number): void {
    this.objectCount = count
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Get average FPS over time
   */
  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return this.targetFPS
    return this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
  }

  /**
   * Check if quality should be reduced
   */
  shouldReduceQuality(): boolean {
    const avgFPS = this.getAverageFPS()
    return avgFPS < this.minFPS && this.fpsHistory.length >= 5
  }

  /**
   * Check if quality can be increased
   */
  canIncreaseQuality(): boolean {
    const avgFPS = this.getAverageFPS()
    return avgFPS > (this.targetFPS - 5) && this.fpsHistory.length >= 10
  }

  /**
   * Get recommended quality adjustment
   */
  getQualityAdjustment(currentQuality: RenderQuality): Partial<RenderQuality> {
    if (this.shouldReduceQuality()) {
      return {
        dpr: Math.max(0.5, currentQuality.dpr * 0.8),
        antialias: false,
        shadows: false,
        textureScale: Math.max(0.3, currentQuality.textureScale * 0.8)
      }
    }

    if (this.canIncreaseQuality()) {
      return {
        dpr: Math.min(2.0, currentQuality.dpr * 1.1),
        textureScale: Math.min(1.0, currentQuality.textureScale * 1.1)
      }
    }

    return {}
  }

  /**
   * Check if performance is stable
   */
  isPerformanceStable(): boolean {
    if (this.fpsHistory.length < 5) return true

    const recent = this.fpsHistory.slice(-5)
    const variance = this.calculateVariance(recent)
    return variance < 100 // Low variance means stable performance
  }

  /**
   * Calculate variance of FPS samples
   */
  private calculateVariance(samples: number[]): number {
    const mean = samples.reduce((sum, val) => sum + val, 0) / samples.length
    const squaredDiffs = samples.map(val => Math.pow(val - mean, 2))
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / samples.length
  }

  /**
   * Reset performance history
   */
  reset(): void {
    this.frameCount = 0
    this.lastTime = 0
    this.fpsHistory = []
    this.renderCalls = 0
    this.metrics = {
      fps: 60,
      frameTime: 16.67,
      memoryUsage: 0,
      renderCalls: 0,
      objectCount: 0
    }
  }

  /**
   * Get performance grade
   */
  getPerformanceGrade(): 'excellent' | 'good' | 'fair' | 'poor' {
    const avgFPS = this.getAverageFPS()
    
    if (avgFPS >= 55) return 'excellent'
    if (avgFPS >= 45) return 'good'
    if (avgFPS >= 30) return 'fair'
    return 'poor'
  }
}