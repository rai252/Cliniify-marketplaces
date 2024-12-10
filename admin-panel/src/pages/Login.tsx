import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import { Label } from '@/components/ui/label'
import { useLoginMutation, useSendOtpMutation } from '@/services/auth'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { toast } from 'react-toastify'
import { login as doLogin } from '@/store/slices/authSlice'

function Login() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)

  const [login, { isLoading: isLoginLoading }] = useLoginMutation()
  const [sendOtp, { isLoading: isSendOtpLoading }] = useSendOtpMutation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await sendOtp({ phone }).unwrap()
      setIsOtpSent(true)
    } catch (error: any) {
      if (error?.data?.detail) {
        toast.error(error.data.detail)
      } else {
        toast.error('Something went wrong, please try again later.')
      }
    }
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const data = await login({
        phone,
        otp,
        login_type: 'CM-CRMS',
      }).unwrap()
      dispatch(doLogin(data))
      toast.success('Login successfu.')
      navigate('/')
    } catch (error: any) {
      if (error?.data?.detail) {
        toast.error(error.data.detail)
      } else {
        toast.error('Something went wrong, please try again later.')
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Admin Login
        </h1>
        {isOtpSent ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700">
                OTP
              </Label>
              <Input
                type="number"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6 digit OTP"
                className="mt-1 block w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <Button
                disabled={isLoginLoading}
                className="w-full py-3 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {isLoginLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Phone number
              </Label>
              <Input
                type="number"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="mt-1 block w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <Button
                disabled={isSendOtpLoading}
                className="w-full py-3 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {isSendOtpLoading ? 'Sending OTP...' : 'Get OTP'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
