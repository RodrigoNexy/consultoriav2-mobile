const getApiBaseURL = () => {
  if (__DEV__) {
    return 'http://172.26.192.1:3000/api/mobile';
  }
  return 'https://your-production-url.com/api/mobile';
};

export const API_CONFIG = {
  baseURL: getApiBaseURL(),
  timeout: 30000,
};

