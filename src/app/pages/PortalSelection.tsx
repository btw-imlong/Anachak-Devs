import { useState } from "react";
import { login, User } from "../service/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUser(null);

    try {
      // 1️⃣ Call login API
      const loginData = await login(email, password);
      localStorage.setItem("token", loginData.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-10 border border-gray-100">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {user ? `Welcome, ${user.name}` : "Welcome Back"}
          </h1>
          {!user && (
            <p className="text-gray-500 mt-2 font-medium">
              Please enter your credentials to login
            </p>
          )}
        </div>

        {!user && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200"
                placeholder="hello@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg shadow-gray-900/20 transition-all active:scale-[0.98] mt-4"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {error && <p className="text-red-500 mt-3">{error}</p>}

        {user && (
          <div className="mt-5 text-center">
            <p className="text-gray-700">Name: {user.name}</p>
            <p className="text-gray-700">Email: {user.email}</p>
            <p className="text-gray-700">Role: {user.role}</p>
          </div>
        )}
      </div>
    </div>
  );
}
