import { useMemo } from 'react'
import { BOX3_DEFAULTS, getDefaultsForYear } from '../constants/box3Defaults.js'
import { computeBox3Summary } from '../utils/box3.js'

export function useBox3Calculator(inputs, config = BOX3_DEFAULTS) {
  return useMemo(() => {
    // If config has a year, merge with year-specific defaults as base
    const yearDefaults = config?.year ? getDefaultsForYear(config.year) : {}
    const mergedConfig = { ...yearDefaults, ...config }
    return computeBox3Summary(inputs, mergedConfig)
  }, [inputs, config])
}
