import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Lock, Mail, ArrowRight, UserPlus, CheckCircle } from 'lucide-react';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
        if (isRegistering) {
            // Inscription : On crée le compte puis on bascule vers le login
            await register(name, email, password);
            setIsRegistering(false);
            setSuccess("Compte créé avec succès ! Veuillez vous connecter.");
            setPassword(''); // On vide le mot de passe par sécurité
        } else {
            // Connexion : On vérifie le rôle pour la redirection
            const role = await login(email, password);
            
            // Check redirect param first
            const params = new URLSearchParams(location.search);
            const redirect = params.get('redirect');

            if (redirect) {
                navigate(`/${redirect}`);
            } else if (role === UserRole.ADMIN) {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        }

    } catch (err: any) {
        setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center mb-8">
            <Link to="/" className="inline-block p-3 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30 mb-4">
                <span className="text-white font-bold text-2xl">Y</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isRegistering ? "Créer un compte" : "Bon retour parmi nous"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
            {isRegistering ? "Rejoignez la communauté Yayou Baye Niass" : "Connectez-vous pour accéder à votre espace"}
            </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 sm:rounded-3xl sm:px-10">
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start">
                <span className="font-bold mr-2">Erreur:</span> {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" /> {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {isRegistering && (
                <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 ml-1 mb-1">
                    Nom complet
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserPlus className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all duration-200 outline-none sm:text-sm text-gray-900 placeholder-gray-400"
                    placeholder="Votre nom"
                    />
                </div>
                </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 ml-1 mb-1">
                Adresse Email
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all duration-200 outline-none sm:text-sm text-gray-900 placeholder-gray-400"
                  placeholder="nom@exemple.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 ml-1 mb-1">
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm group">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all duration-200 outline-none sm:text-sm text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/30 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isLoading ? 'Chargement...' : (isRegistering ? "S'inscrire" : "Se connecter")} <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
             <button 
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                    setSuccess('');
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
             >
                {isRegistering ? "Déjà un compte ? Connectez-vous" : "Pas de compte ? Inscrivez-vous gratuitement"}
             </button>
          </div>

          <div className="mt-8">
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                
             </div>
             
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;