import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { login, getMe } from "../service/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const redirectByRole = (role: string) => {
    if (role === "ADMIN" || role === "ROLE_ADMIN") navigate("/admin");
    else if (role === "TEACHER") navigate("/teacher");
    else if (role === "STUDENT") navigate("/student");
    else navigate("/");
  };

  // Auto-login: check cookie on page load
  useEffect(() => {
    getMe()
      .then((user) => {
        if (user) {
          redirectByRole(user.role);
        } else {
          setChecking(false); // no session → show login form
        }
      })
      .catch(() => {
        setChecking(false); // error → show login form
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(email, password);
      redirectByRole(data.role);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // While checking session cookie
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
          <span className="text-sm">Checking your session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — login form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 bg-white border-r border-gray-100">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 20 20"
                fill="none"
              >
                <rect x="3" y="3" width="6" height="6" rx="1.5" fill="white" />
                <rect
                  x="11"
                  y="3"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="white"
                  opacity="0.6"
                />
                <rect
                  x="3"
                  y="11"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="white"
                  opacity="0.6"
                />
                <rect
                  x="11"
                  y="11"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="white"
                  opacity="0.3"
                />
              </svg>
            </div>
            <span className="text-base font-semibold text-gray-900">
              AttendanceMS
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-gray-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-gray-400 transition-all"
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo credentials for portfolio visitors */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Demo credentials — feel free to explore
            </p>
            <div className="space-y-1 text-xs text-gray-500 font-mono">
              <p>Admin: admin@school.com / password123</p>
              <p>Teacher: sophea@school.com / password123</p>
              <p>Student: visal@school.com / password123</p>
            </div>
            <p className="mt-3 text-[11px] text-amber-600 leading-relaxed">
              ⏱ First sign-in may take up to a minute — the backend is on free
              hosting that spins down when idle.
            </p>
          </div>
        </div>
      </div>

      {/* Right — branding panel (hidden on mobile) */}
      <div className="hidden md:flex flex-1 flex-col justify-center px-16 bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Manage attendance with ease
        </h2>
        <p className="text-sm text-gray-500 mb-10">
          Everything your institution needs, in one place.
        </p>

        {[
          {
            title: "Real-time tracking",
            desc: "Mark and view attendance instantly across all classes and rooms.",
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm.75 4a.75.75 0 00-1.5 0v3.25l-1.6 1.6a.75.75 0 101.06 1.06l1.79-1.79V5z" />
              </svg>
            ),
          },
          {
            title: "Role-based access",
            desc: "Separate dashboards for admins, teachers, and students.",
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a5 5 0 100 10A5 5 0 008 1zM6.5 6.75a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM3.5 13.25C3.5 11.317 5.567 10 8 10s4.5 1.317 4.5 3.25v.25H3.5v-.25z" />
              </svg>
            ),
          },
          {
            title: "Persistent sessions",
            desc: "Stay signed in securely — no need to log in every visit.",
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11 5V4a3 3 0 10-6 0v1H3.5A1.5 1.5 0 002 6.5v7A1.5 1.5 0 003.5 15h9a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0012.5 5H11zm-4-1a1 1 0 112 0v1H7V4zm1 6.5a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            ),
          },
        ].map((f) => (
          <div key={f.title} className="flex items-start gap-4 mb-6">
            <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-700">
              {f.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-0.5">
                {f.title}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}