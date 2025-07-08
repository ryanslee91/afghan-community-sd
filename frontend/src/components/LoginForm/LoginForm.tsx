import { useState } from 'react';
import './LoginForm.css';

export default function LoginForm({ onSubmit }: { onSubmit: (data: { email: string; password: string }) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="login-container">
    <form
      className="login-form"
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ email, password });
      }}
    >
      <h2>Gamers from Neighborhood</h2>
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
    </div>
  );
}