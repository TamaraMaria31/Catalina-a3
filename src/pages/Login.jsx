import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

export default function Login() {
  usePageTitle("Entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate("/minha-conta");
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-catalina-cream text-catalina-text  px-5 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-[24px] mb-1 text-center">Entrar</h1>
        <p className="text-[13px] text-catalina-muted text-center mb-8">Acesse sua conta Catalina Marriage</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" autoComplete="email" className="border border-catalina-border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-catalina-green" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" autoComplete="current-password" className="border border-catalina-border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-catalina-green" />
          {error && <p className="text-[12px] text-[#B23A3A]">{error}</p>}
          <button type="submit" disabled={submitting} className="bg-catalina-green text-white text-[13px] tracking-wide py-3 rounded-xl hover:bg-catalina-greenDark transition-colors mt-2 disabled:opacity-60">
            {submitting ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>

        <p className="text-[13px] text-catalina-muted text-center mt-6">
          Ainda não tem conta? <Link to="/cadastro" className="text-catalina-sage underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
