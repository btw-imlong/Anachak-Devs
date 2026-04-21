import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router";
import { getMe } from "../service/api";

interface Props {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then((user) => {
        if (!user) {
          navigate("/login");
          return;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
          navigate("/login");
          return;
        }

        localStorage.setItem("role", user.role);
        localStorage.setItem("email", user.email);
        setAllowed(true);
        setChecking(false);
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children ?? <Outlet />}</>;
}
