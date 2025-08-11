import SignUpForm from '@/components/SignUpForm/SignUpForm'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function SignUpPage() {
  const router = useRouter()

  // 회원가입 성공 후 로그인 페이지로 이동
  const handleSuccess = () => {
    router.push('/login')
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <SignUpForm onSuccess={handleSuccess} />
      <p style={{ marginTop: 16 }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
          Log In
        </Link>
      </p>
    </div>
  )
}