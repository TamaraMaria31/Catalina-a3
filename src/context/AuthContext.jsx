import { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

const AuthContext = createContext(null);

const NOT_CONFIGURED = "O banco de dados ainda não está configurado (veja o README).";

function translateError(error) {
  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (msg.includes("already registered") || msg.includes("already been registered")) return "Este e-mail já está cadastrado.";
  if (msg.includes("password") && msg.includes("6")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (msg.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (msg.includes("valid email") || msg.includes("invalid email")) return "Digite um e-mail válido.";
  if (msg.includes("rate limit")) return "Muitas tentativas. Aguarde um instante e tente de novo.";
  return "Não foi possível concluir. Tente novamente.";
}

async function buildUser(authUser) {
  const { data } = await supabase
    .from("profiles")
    .select("name, wedding_date")
    .eq("id", authUser.id)
    .maybeSingle();

  return {
    id: authUser.id,
    email: authUser.email,
    name: data?.name || authUser.user_metadata?.name || authUser.email.split("@")[0],
    weddingDate: data?.wedding_date || null,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;

    const apply = async (session) => {
      if (!session?.user) {
        if (active) setUser(null);
      } else {
        const built = await buildUser(session.user);
        if (active) setUser(built);
      }
      if (active) setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => apply(data.session));

    // O callback não deve chamar o Supabase direto (risco de travar); adia para o próximo tick.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => apply(session), 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: translateError(error) } : {};
  };

  const register = async (name, email, password) => {
    if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { error: translateError(error) };
    // Sem sessão = o projeto exige confirmação de e-mail antes do primeiro login.
    return { needsConfirmation: !data.session };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateWeddingDate = async (date) => {
    if (!user) return { error: "Faça login primeiro." };
    const { error } = await supabase
      .from("profiles")
      .update({ wedding_date: date || null })
      .eq("id", user.id);
    if (error) return { error: "Não foi possível salvar a data." };
    setUser((u) => ({ ...u, weddingDate: date || null }));
    return {};
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateWeddingDate }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
