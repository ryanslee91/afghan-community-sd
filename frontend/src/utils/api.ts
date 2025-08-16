import { SignUpDto } from '@/types/SIgnUp';
import { User } from '@/types/User';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // NestJS 백엔드 주소
  withCredentials: true,           // 쿠키 전송 허용 (CORS 설정 연계됨)
});

export async function getCurrentUser(): Promise<User | null> {
  const res = await api.get<User | null>('/user/me');
  return res.data;
}

export async function login(
  email: string,
  password: string
): Promise<void> {
  await api.post('/auth/login', { email, password });
}

export async function logout() {
  const res = await api.post('/auth/logout');
  return res.data;
}

export async function signup(dto: SignUpDto): Promise<User> {
  const res = await api.post<User>('/auth/signup', dto);
  return res.data;
}


// // 요청 인터셉터 (필요 시 Authorization 헤더 등 추가 가능)
// api.interceptors.request.use(
//   config => {
//     return config;
//   },
//   error => Promise.reject(error)
// );

// // 응답 인터셉터 (예: 401 Unauthorized 공통 처리)
// api.interceptors.response.use(
//   res => res,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       console.warn('🔒 Session expired or authorization failed');
//       // 로그인 페이지로 리디렉션하거나 전역 상태 초기화 처리 가능
//     }
//     return Promise.reject(error);
//   }
// );

export default api;