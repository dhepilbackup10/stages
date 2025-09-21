/**
 * Device detection and performance tier management
 */

import type { DeviceTier, RenderQuality } from './StagesTypes'

export class StagesDevice {
  private deviceTier: DeviceTier | null = null
  private forcedTier: 'low' | 'mid' | 'high' | null = null

  constructor() {
    this.detectDevice()
  }

  /**
   * Detect device performance tier
   */
  private detectDevice(): void {
    if (this.forcedTier) {
      this.deviceTier = this.getTierConfig(this.forcedTier)
      return
    }

    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null

    if (!gl) {
      this.deviceTier = this.getTierConfig('low')
      return
    }

    const renderer = gl.getParameter(gl.RENDERER) as string
    const vendor = gl.getParameter(gl.VENDOR) as string

    let detectedTier: 'low' | 'mid' | 'high' = 'mid'

    // Check for high-end GPUs
    if (renderer.includes('NVIDIA') || renderer.includes('AMD') || renderer.includes('Intel Arc')) {
      detectedTier = 'high'
    }
    // Check for integrated graphics
    else if (renderer.includes('Intel') || renderer.includes('Mali') || renderer.includes('Adreno')) {
      detectedTier = 'mid'
    }
    // Memory check as fallback
    else {
      const memory = (performance as any).memory
      if (memory && memory.jsHeapSizeLimit) {
        detectedTier = memory.jsHeapSizeLimit > 1000000000 ? 'mid' : 'low'
      }
    }

    this.deviceTier = this.getTierConfig(detectedTier)
  }

  /**
   * Get configuration for device tier
   */
  private getTierConfig(tier: 'low' | 'mid' | 'high'): DeviceTier {
    switch (tier) {
      case 'high':
        return {
          tier: 'high',
          maxDPR: 2.0,
          antialias: true,
          shadowsEnabled: true,
          textureQuality: 1.0,
          maxObjects: 1000
        }
      case 'mid':
        return {
          tier: 'mid',
          maxDPR: 1.5,
          antialias: true,
          shadowsEnabled: false,
          textureQuality: 0.8,
          maxObjects: 500
        }
      case 'low':
      default:
        return {
          tier: 'low',
          maxDPR: 1.0,
          antialias: false,
          shadowsEnabled: false,
          textureQuality: 0.5,
          maxObjects: 250
        }
    }
  }

  /**
   * Force specific device tier
   */
  setDeviceTier(tier: 'low' | 'mid' | 'high'): void {
    this.forcedTier = tier
    this.deviceTier = this.getTierConfig(tier)
  }

  /**
   * Get current device tier
   */
  getDeviceTier(): DeviceTier {
    return this.deviceTier!
  }

  /**
   * Get render quality settings
   */
  getRenderQuality(): RenderQuality {
    const tier = this.getDeviceTier()
    const actualDPR = Math.min(tier.maxDPR, window.devicePixelRatio || 1)

    return {
      dpr: actualDPR,
      antialias: tier.antialias,
      shadows: tier.shadowsEnabled,
      textureScale: tier.textureQuality
    }
  }

  /**
   * Check if device can handle specific object count
   */
  canHandle(objectCount: number): boolean {
    return objectCount <= this.getDeviceTier().maxObjects
  }
}