import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

export default function Register() {
  usePageTitle("Criar conta");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setError("");
    setSubmitting(true);
    const result = await register(name.trim(), email, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.needsConfirmation) {
      setNeedsConfirmation(true);
      return;
    }
    navigate("/minha-conta");
  };

  if (needsConfirmation) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-catalina-cream text-catalina-text  px-5 py-16">
        <div className="w-full max-w-sm text-center">
          <MailCheck size={44} strokeWidth={1.25} className="text-catalina-sage mx-auto mb-4" />
          <h1 className="text-[22px] mb-2">Confirme seu e-mail</h1>
          <p className="text-[14px] text-catalina-muted mb-6">
            Enviamos um link para {email}. Depois de confirmar, é só entrar com sua senha.
          </p>
          <Link to="/login" className="bg-catalina-green text-white text-[13px] tracking-wide px-7 py-3 rounded-xl hover:bg-catalina-greenDark transition-colors inline-block">
            IR PARA O LOGIN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-catalina-cream text-catalina-text  px-5 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-[24px] mb-1 text-center">Criar conta</h1>
        <p className="text-[13px] text-catalina-muted text-center mb-8">Comece a planejar o seu grande dia</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" autoComplete="name" className="border border-catalina-border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-catalina-green" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" autoComplete="email" className="border border-catalina-border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-catalina-green" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha (mínimo 6 caracteres)" autoComplete="new-password" className="border border-catalina-border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-catalina-green" />
          {error && <p className="text-[12px] text-[#B23A3A]">{error}</p>}
          <button type="submit" disabled={submitting} className="bg-catalina-green text-white text-[13px] tracking-wide py-3 rounded-xl hover:bg-catalina-greenDark transition-colors mt-2 disabled:opacity-60">
            {submitting ? "CRIANDO..." : "CRIAR CONTA"}
          </button>
        </form>

        <p className="text-[13px] text-catalina-muted text-center mt-6">
          Já tem conta? <Link to="/login" className="text-catalina-sage underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
