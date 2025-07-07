import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',  // 백엔드 주소
  withCredentials: true,             // 쿠키 전송 설정
});

export default api;