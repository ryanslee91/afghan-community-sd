import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUpForm from '@/components/SignUpForm/SignUpForm'
import api from '@/utils/api'
import axios from 'axios'

// 1) api.post 모킹
jest.mock('@/utils/api')
const mockedApi = api as jest.Mocked<typeof api>

// 2) window.alert 모킹
beforeAll(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {})
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('SignUpForm', () => {
  it('renders all inputs and has disabled Sign Up button initially', () => {
    render(<SignUpForm onSuccess={jest.fn()} />)
    // 이메일, 비밀번호, 비밀번호 확인, 닉네임, 언어 체크박스, 버튼이 있는지
    expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password:$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Confirm Password/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/nickname/i)).toBeInTheDocument()
    expect(screen.getByText(/dari/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled()
  })

  it('shows error when passwords do not match', async () => {
    render(<SignUpForm onSuccess={jest.fn()} />)

    fireEvent.change(screen.getByLabelText(/^Password:/i), {
      target: { value: 'foo12345' },
    })
    fireEvent.change(screen.getByLabelText(/^Confirm password:/i), {
      target: { value: 'bar54321' },
    })

    // 2) Submit the form directly
    const form = screen.getByTestId('signup-form')
    fireEvent.submit(form)

    // 3) Assert the alert is shown
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/passwords do not match/i)
  })

  it('enables Sign Up button when all fields are valid and passwords match', () => {
    render(<SignUpForm onSuccess={jest.fn()} />)

    fireEvent.change(screen.getByPlaceholderText(/e-mail/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Password:/i), {
      target: { value: 'Abc123!@#' },
    })
    fireEvent.change(screen.getByLabelText(/^Confirm password:/i), {
      target: { value: 'Abc123!@#' },
    })
    fireEvent.change(screen.getByPlaceholderText(/nickname/i), {
      target: { value: 'tester' },
    })
    // 언어 하나 체크
    fireEvent.click(screen.getByLabelText(/dari/i))

    expect(screen.getByRole('button', { name: /sign up/i })).toBeEnabled()
  })

  it('calls api.post and onSuccess when form is submitted validly', async () => {
    const onSuccess = jest.fn()
    mockedApi.post.mockResolvedValue({ data: {} })  // 성공 응답

    render(<SignUpForm onSuccess={onSuccess} />)

    fireEvent.change(screen.getByPlaceholderText(/e-mail/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: 'Abc123!@#' },
    })
    fireEvent.change(screen.getByLabelText(/confirm password:/i), {
      target: { value: 'Abc123!@#' },
    })
    fireEvent.change(screen.getByPlaceholderText(/nickname/i), {
      target: { value: 'tester' },
    })
    fireEvent.click(screen.getByLabelText(/dari/i))

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      // api.post가 올바른 endpoint + payload로 호출됐는지 검사
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/sign-up', {
        email: 'test@example.com',
        password: 'Abc123!@#',
        confirmPassword: 'Abc123!@#',  // form state에 confirmPassword도 포함돼 있을 경우
        nickname: 'tester',
        languages: ['DARI'],
      })

      // onSuccess 콜백이 호출됐는지
      expect(onSuccess).toHaveBeenCalled()
    })
  })

it('initially disables the Sign Up button', () => {
  render(<SignUpForm onSuccess={jest.fn()} />)
  expect(
    screen.getByRole('button', { name: /sign up/i })
  ).toBeDisabled()
})

 it('모든 필수 필드를 채우고 비밀번호가 일치하면 Sign Up 버튼이 enabled 상태가 된다', () => {
    const onSuccess = jest.fn()
    render(<SignUpForm onSuccess={onSuccess} />)

    // 1) Email 입력
    const emailInput = screen.getByPlaceholderText(/e-mail/i)
    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    })

    // 2) Password 입력
    const passwordInput = screen.getByLabelText(/^Password:$/i)
    fireEvent.change(passwordInput, {
      target: { value: 'Abc123!@#' },
    })

    // 3) Confirm Password 입력
    const confirmInput = screen.getByLabelText(/^Confirm Password:$/i)
    fireEvent.change(confirmInput, {
      target: { value: 'Abc123!@#' },
    })

    // 4) Nickname 입력
    const nicknameInput = screen.getByPlaceholderText(/nickname/i)
    fireEvent.change(nicknameInput, {
      target: { value: 'tester' },
    })

    // 5) 언어 하나 이상 체크
    const dariCheckbox = screen.getByLabelText(/dari/i)
    fireEvent.click(dariCheckbox)

    // 6) 버튼 상태 확인
    const submitButton = screen.getByRole('button', { name: /sign up/i })
    expect(submitButton).toBeEnabled()
  })

})