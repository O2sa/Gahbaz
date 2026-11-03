import { createEmotionCache } from '@mantine/core'
import rtlPlugin from 'stylis-plugin-rtl'

export const rtlCache = createEmotionCache({
  key: 'mantine-rtl',
  stylisPlugins: [rtlPlugin],
})

export const ltrCache = createEmotionCache({
  key: 'mantine-ltr',
})

export const getEmotionCache = (isRtl) => (isRtl ? rtlCache : ltrCache)

export default getEmotionCache
