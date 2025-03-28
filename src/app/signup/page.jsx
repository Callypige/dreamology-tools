"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("✅ Compte créé avec succès ! Redirection...");
      router.push("/sign-in");
    } else {
      setError(data.message);
    }
  };

  const handleProviderSignIn = (provider) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-md p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
        <h2 className="text-center text-2xl font-bold text-white">Créer un compte</h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-md mt-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          <input
            type="email"
            placeholder="Email"
            disabled={loading}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 rounded bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            disabled={loading}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 rounded bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            disabled={loading}
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full p-3 rounded bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>

        {/* Boutons d'authentification sociale */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => handleProviderSignIn("github")}
            className="bg-white p-3 rounded-full hover:bg-gray-200 transition-all"
          >
            <FaGithub size={24} />
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Déjà un compte ?{" "}
          <Link href="/sign-in" className="text-indigo-400 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
