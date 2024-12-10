import { useAppDispatch } from '@/hooks/reduxHooks'
import { logout } from '@/store/slices/authSlice'
import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

const Logout: React.FC = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(logout())
  }, [dispatch])

  return <Navigate to="/auth/login" replace />
}

export default Logout