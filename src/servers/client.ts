// 🌐 HTTP 客户端配置

import axios from 'axios'
import { API_BASE_URL, REQUEST_TIMEOUT } from '@/constants'
import { setupInterceptors } from './interceptors'
import { mockBackend } from '../../backend'

/**
 * 创建 Axios 实例
 */
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  // 使用自定义适配器拦截请求，使用模拟后端
  adapter: async (config) => {
    const token = config.headers?.Authorization as string | undefined;
    
    try {
      let result;
      if (config.method?.toLowerCase() === 'get') {
        result = await mockBackend.get(config.url || '', config.params, token);
      } else {
        result = await mockBackend.post(config.url || '', config.data, token);
      }
      
      return {
        data: result,
        status: 200,
        statusText: 'OK',
        headers: config.headers || {},
        config,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  },
})

// 设置拦截器
setupInterceptors(httpClient)

export { httpClient }