import SignUpForm from '@/components/SignUpForm/SignUpForm'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './styles/signup.module.css';

export default function SignUpPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/login')
  }

  return (
    <div className={styles.pageContainer}>
      <p className={styles.intro}>
        Please fill the following fields to sign up.
      </p>

      <SignUpForm onSuccess={handleSuccess} />

      <p className={styles.bottomText}>
        Already have an account?{' '}
        <Link href="/login" className={styles.loginLink}>
          Log In
        </Link>
      </p>
    </div>
  )

}