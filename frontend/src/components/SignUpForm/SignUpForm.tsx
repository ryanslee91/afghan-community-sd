import { useState } from 'react';
import api from '@/utils/api';
import { Language, LANGUAGES } from '@/types/Languages';
import axios from 'axios';

interface SignUpFormProps {
  onSuccess?: () => void
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nickname: '',
    languages: [] as Language[],
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleLanguageToggle = (lang: Language) => {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/sign-up', form)
      onSuccess?.()
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || 'Sign Up Failed.')
        }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="E-mail"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <input
        name="nickname"
        value={form.nickname}
        onChange={handleChange}
        placeholder="Nickname"
      />

      <fieldset>
        <legend>Select your languages</legend>
        {LANGUAGES.map(lang => (
          <label key={lang}>
            <input
              type="checkbox"
              checked={form.languages.includes(lang)}
              onChange={() => handleLanguageToggle(lang)}
            />
            {lang}
          </label>
        ))}
      </fieldset>

      <button type="submit">Sign Up</button>
    </form>
  )
}