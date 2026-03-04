/**
 * 加密工具
 */
import CryptoJS from 'crypto-js'

/**
 * MD5 加密
 */
export function md5(value: string): string {
  return CryptoJS.MD5(value).toString()
}
