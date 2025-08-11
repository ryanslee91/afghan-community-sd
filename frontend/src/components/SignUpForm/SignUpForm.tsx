import { useState } from 'react';
import api from '@/utils/api';
import { Language, LANGUAGES } from '@/types/Languages';
import axios from 'axios';
import styles from './SignUpForm.module.css';
import Link from 'next/link';

interface SignUpFormProps {
  onSuccess?: () => void
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
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
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!form.email.trim()) {
        alert('You are missing an e-mail!');
        return;
    }
    if (!form.password) {
        alert('You are missing a password!')
    }
    if (!form.nickname.trim()) {
        alert('You are missing a nickname!')
    }
    if (form.languages.length === 0) {
        alert('Please select at least one language!');
        return; 
    }

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
    <div className={styles.container}>
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <label className={styles.inputGroup}>
      <span>Email: </span>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="E-mail"
        required
      />
      </label>
      <label className={styles.inputGroup}>
      <span>Password: </span>
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      </label>
     <label className={styles.inputGroup}>
      <span>Confirm Password: </span>
      <input
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        required
      />
      </label>
      <label className={styles.inputGroup}>
      <span>Nickname: </span>
      <input
        name="nickname"
        value={form.nickname}
        onChange={handleChange}
        placeholder="Nickname"
        required
      />
      </label>
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
     <div className={styles.buttonGroup}>
      <button 
        type="submit"
        className={styles.submitButton}
        disabled={
          !form.email.trim() ||
          !form.password ||
          !form.nickname.trim() ||
          form.languages.length === 0 ||
          form.password !== form.confirmPassword
        }
      >
        Sign Up
        </button>
        <Link href="/login" className={styles.cancelButton}>
          Cancel
        </Link>
        </div>
    </form>
    </div>
  )
}