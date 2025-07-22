// src/pages/login.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import LoginForm from '@/components/LoginForm/LoginForm';
import api, { getCurrentUser } from '@/utils/api';
import { clearUser, setUser } from '@/store/authSlice';   // Redux 액션
import { User } from '@/types/User';

export default function LoginPage() {
  // 로컬 상태는 setLocalUser 으로만 업데이트
  const [localUser, setLocalUser] = useState<User | null | undefined>(undefined);

  const router = useRouter();
  const dispatch = useDispatch();

  // 앱 시작 시 한 번만 현재 유저 정보 조회
  useEffect(() => {
    getCurrentUser()
      .then(data => {
        if (data) {
          // 유저 정보가 있으면 Redux에 저장 후 대시보드로 이동
          dispatch(setUser(data));
          router.replace('/dashboard');
        } else {
          // 게스트(로그인 안 한 상태)
          setLocalUser(null);
        }
      })
      .catch(() => {
        setLocalUser(null);
      });
  }, [dispatch, router]);

  // 로그인 버튼 클릭 시
  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      // 1) 로그인 API 호출 (쿠키 저장)
      await api.post('/auth/login', { email, password }, { withCredentials: true });
      // 2) 로그인 직후 현재 유저 정보 다시 가져오기
      const me = await getCurrentUser();
      // 3) Redux에 저장
      if (!me) {
        alert('logged in, but cannot retrieve the user information');
        dispatch(clearUser());
        router.replace('/login');
        return;
      }
      dispatch(setUser(me));
      // 4) 대시보드로 이동
      router.push('/dashboard');
    } catch {
      alert('Login Failed');
    }
  };

  // 아직 로컬 상태가 결정되지 않았다면 로딩 표시
  if (localUser === undefined) {
    return <p>Loading…</p>;
  }

  // LoginForm 컴포넌트에 onSubmit만 넘겨줌
  return <LoginForm onSubmit={handleLogin} />;
}