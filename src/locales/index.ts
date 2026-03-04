// 🌍 国际化配置入口

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { STORAGE_KEYS } from '@/constants'

// 导入翻译资源
import zhCNCommon from './zh-CN/common.json'
import zhCNMenu from './zh-CN/menu.json'
import enUSCommon from './en-US/common.json'
import enUSMenu from './en-US/menu.json'

const resources = {
  'zh-CN': {
    common: zhCNCommon,
    menu: zhCNMenu,
  },
  'en-US': {
    common: enUSCommon,
    menu: enUSMenu,
  },
}

// 获取默认语言
const getDefaultLanguage = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE)
  if (stored && ['zh-CN', 'en-US'].includes(stored)) {
    return stored
  }
  return 'zh-CN'
}

i18n.use(initReactI18next).init({
  resources,
  lng: getDefaultLanguage(),
  fallbackLng: 'zh-CN',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

// 监听语言变化，保存到本地存储
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lng)
})

export default i18n