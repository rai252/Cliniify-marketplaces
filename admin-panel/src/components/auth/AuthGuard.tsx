// AuthGuard.tsx
import React, { useEffect, ReactNode } from "react"; 
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode; 
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const auth = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const adminPanel_accessToken = localStorage.getItem("adminPanel_accessToken");
    if (!auth.adminPanel_accessToken && !adminPanel_accessToken) {
      navigate("/login");
    }
  }, [auth.adminPanel_accessToken , navigate]);

  return <>{children}</>; 
};

export default AuthGuard;
