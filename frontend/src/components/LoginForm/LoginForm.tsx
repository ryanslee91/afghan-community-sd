import { useState } from 'react';
import styles from './LoginForm.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginForm({ onSubmit }: { onSubmit: (data: { email: string; password: string }) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const continueAsGuest = () => {
    // 1. 포커스 해제
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // 2. 페이지 이동
    router.push('/dashboard');
  };


  return (
    <div className={styles.loginContainer}>
    <form
      className={styles.loginForm}
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ email, password });
      }}
    >
      <h2>Afghan Community in San Diego</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button className={styles.logInButton} type="submit">Log In</button>
       <div className={styles.signUpPrompt}>
          Do not have an account?{' '}
          <Link href="/signup" className={styles.signUpLink}>
            Sign up here
          </Link>
        </div>

            <div className={styles.guestButtonWrapper}>
        <button
          className={styles.guestButton}
          type="button"
          onClick={continueAsGuest}
        >
          Continue as a guest
        </button>
      </div>
    </form>
    </div>
  );
}