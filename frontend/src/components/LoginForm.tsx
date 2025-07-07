// src/components/auth/LoginForm.tsx
import { useState } from 'react';

export default function LoginForm({ onSubmit }: { onSubmit: (data: { email: string; password: string }) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ email, password });
      }}
    >
      <h1>Log In</h1>
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
      <button type="submit">Log In</button>
    </form>
  );
}