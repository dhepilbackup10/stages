/**
 * Stage coordinate transformation system
 */

import type { StageCoordinates, ViewportTransform } from './StagesTypes'

// Fixed stage dimensions
export const STAGE_WIDTH = 2048
export const STAGE_HEIGHT = 2048

export class StagesTransform {
  private transform: ViewportTransform | null = null
  private container: HTMLElement | null = null
  private canvas: HTMLCanvasElement | null = null
  private resizeObserver: ResizeObserver | null = null

  constructor() {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateTransform()
    })
  }

  /**
   * Initialize transform system
   */
  initialize(container: HTMLElement, canvas: HTMLCanvasElement): void {
    this.container = container
    this.canvas = canvas

    // Start observing resize events
    this.resizeObserver?.observe(container)

    // Initial transform calculation
    this.updateTransform()
  }

  /**
   * Calculate viewport transform for cover behavior
   */
  private calculateTransform(viewportWidth: number, viewportHeight: number): ViewportTransform {
    // Cover behavior: scale to fill viewport, maintain aspect ratio
    const scaleX = viewportWidth / STAGE_WIDTH
    const scaleY = viewportHeight / STAGE_HEIGHT
    const scale = Math.max(scaleX, scaleY) // Use larger scale for cover

    const scaledWidth = STAGE_WIDTH * scale
    const scaledHeight = STAGE_HEIGHT * scale

    // Center the scaled stage
    const offsetX = (viewportWidth - scaledWidth) / 2
    const offsetY = (viewportHeight - scaledHeight) / 2

    return { scale, offsetX, offsetY }
  }

  /**
   * Update transform based on current viewport size
   */
  updateTransform(): void {
    if (!this.container || !this.canvas) return

    const rect = this.container.getBoundingClientRect()
    const viewportWidth = rect.width
    const viewportHeight = rect.height

    this.transform = this.calculateTransform(viewportWidth, viewportHeight)

    // Apply CSS transforms to canvas
    this.canvas.style.transform = `translate(-50%, -50%) scale(${this.transform.scale})`
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '50%'
    this.canvas.style.left = '50%'
  }

  /**
   * Transform viewport coordinates to stage coordinates
   */
  transformCoordinates(clientX: number, clientY: number): StageCoordinates | null {
    if (!this.transform || !this.container) return null

    const rect = this.container.getBoundingClientRect()
    const viewportX = clientX - rect.left
    const viewportY = clientY - rect.top

    // Convert from viewport coordinates to stage coordinates
    const stageX = (viewportX - this.transform.offsetX) / this.transform.scale
    const stageY = (viewportY - this.transform.offsetY) / this.transform.scale

    return { stageX, stageY }
  }

  /**
   * Transform event to stage coordinates
   */
  transformEvent(event: PointerEvent | MouseEvent | TouchEvent): StageCoordinates | null {
    let clientX: number, clientY: number

    if ('touches' in event && event.touches.length > 0) {
      // Touch event
      const touch = event.touches[0]
      clientX = touch.clientX
      clientY = touch.clientY
    } else if ('clientX' in event) {
      // Mouse/pointer event
      clientX = event.clientX
      clientY = event.clientY
    } else {
      return null
    }

    return this.transformCoordinates(clientX, clientY)
  }

  /**
   * Check if coordinates are within stage bounds
   */
  isWithinStage(stageX: number, stageY: number): boolean {
    return stageX >= 0 && stageX <= STAGE_WIDTH && stageY >= 0 && stageY <= STAGE_HEIGHT
  }

  /**
   * Get current transform
   */
  getTransform(): ViewportTransform | null {
    return this.transform
  }

  /**
   * Convert stage coordinates to world coordinates (for Three.js)
   */
  stageToWorld(stageX: number, stageY: number): [number, number] {
    // Convert from 0-2048 range to centered coordinate system
    const worldX = stageX - STAGE_WIDTH / 2
    const worldY = -(stageY - STAGE_HEIGHT / 2) // Flip Y for Three.js
    return [worldX, worldY]
  }

  /**
   * Convert world coordinates to stage coordinates
   */
  worldToStage(worldX: number, worldY: number): [number, number] {
    const stageX = worldX + STAGE_WIDTH / 2
    const stageY = (-worldY) + STAGE_HEIGHT / 2 // Flip Y back
    return [stageX, stageY]
  }

  /**
   * Dispose transform system
   */
  dispose(): void {
    this.resizeObserver?.disconnect()
    this.container = null
    this.canvas = null
    this.transform = null
  }
}