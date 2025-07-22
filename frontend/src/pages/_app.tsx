import { AppProps } from 'next/app';
import { Provider, useDispatch } from 'react-redux';
import { useEffect, ReactNode } from 'react';
import { store } from '@/store';               
import { setUser, clearUser } from '@/store/authSlice';
import api from '@/utils/api';                 
import '@/styles/globals.css';                 

// 앱 전체를 감싸면서 한 번만 실행될 인증 초기화 컴포넌트
function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .get('/user/me', { withCredentials: true })
      .then(res => {
        if (res.data) dispatch(setUser(res.data));
        else dispatch(clearUser());
      })
      .catch(() => dispatch(clearUser()));
  }, [dispatch]);

  return <>{children}</>;
}


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <Component {...pageProps} />
      </AuthInitializer>
    </Provider>
  );
}