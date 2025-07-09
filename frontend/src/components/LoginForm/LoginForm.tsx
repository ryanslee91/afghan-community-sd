import { useState } from 'react';
import './LoginForm.css';
import { useRouter } from 'next/router';

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
    <div className="login-container">
    <form
      className="login-form"
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ email, password });
      }}
    >
      <h2>Neighborhood Gamers</h2>
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
      <button className="log-in-button" type="submit">Log In</button>
            <div className="guest-button-wrapper">
        <button
          className="guest-button"
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