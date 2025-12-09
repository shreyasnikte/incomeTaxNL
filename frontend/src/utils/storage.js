/**
 * LocalStorage utility for persisting user data.
 * Uses a namespace prefix to avoid key collisions.
 */

const STORAGE_PREFIX = 'dutch_tax'
const SCHEMA_VERSION = 1

/**
 * Safely parse JSON, returning null on failure.
 */
const safeJsonParse = (str) => {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

/**
 * Build a namespaced key for localStorage.
 */
const buildKey = (key) => `${STORAGE_PREFIX}:${key}`

/**
 * Storage utility with versioned keys.
 */
export const storage = {
  /**
   * Get a value from localStorage.
   * @param {string} key - The key to retrieve.
   * @returns {*} The parsed value, or null if not found/invalid.
   */
  get(key) {
    try {
      const raw = localStorage.getItem(buildKey(key))
      return raw ? safeJsonParse(raw) : null
    } catch (error) {
      console.warn(`[storage] Failed to get "${key}":`, error)
      return null
    }
  },

  /**
   * Set a value in localStorage.
   * @param {string} key - The key to set.
   * @param {*} value - The value to store (will be JSON-serialized).
   */
  set(key, value) {
    try {
      localStorage.setItem(buildKey(key), JSON.stringify(value))
    } catch (error) {
      console.warn(`[storage] Failed to set "${key}":`, error)
    }
  },

  /**
   * Remove a key from localStorage.
   * @param {string} key - The key to remove.
   */
  remove(key) {
    try {
      localStorage.removeItem(buildKey(key))
    } catch (error) {
      console.warn(`[storage] Failed to remove "${key}":`, error)
    }
  },

  /**
   * Clear all app-namespaced keys from localStorage.
   */
  clear() {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(`${STORAGE_PREFIX}:`))
        .forEach((k) => localStorage.removeItem(k))
    } catch (error) {
      console.warn('[storage] Failed to clear storage:', error)
    }
  },

  /**
   * Get the current schema version.
   */
  getSchemaVersion() {
    return SCHEMA_VERSION
  },
}

// Storage keys used by the app
export const STORAGE_KEYS = {
  FORM_VALUES: 'form.values.v1',
  BOX3_SELECTED_YEAR: 'form.box3.year.v1',
  BOX1_SELECTED_YEAR: 'form.box1.year.v1',
  BOX3_CONFIG: 'form.config.v1',
  SELECTED_BOX_TYPE: 'form.boxType.v1',
  BOX1_FORM_VALUES: 'form.box1.values.v1',
}

export default storage
