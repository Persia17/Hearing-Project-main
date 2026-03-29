import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthModal({ isOpen, onClose, initialView = 'login', onLogin }) {
  const [view, setView] = useState(initialView);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup State
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Keep view in sync if initialView changes while modal is open (or reopened)
  useEffect(() => {
    setView(initialView);
    setError('');
    if (!isOpen) {
      setLoginEmail('');
      setLoginPassword('');
      setSignupData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [initialView, isOpen]);

  if (!isOpen) return null;

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        onLogin();
        onClose();
        navigate('/home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const response = await fetch('/api/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        onLogin();
        onClose();
        navigate('/home');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  const switchView = (newView) => {
    setView(newView);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center font-sans tracking-wide">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Box */}
      <div 
        className="relative bg-white w-full max-w-md m-4 rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 sm:p-10 z-10 max-h-[90vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors z-20"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-lime-400 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-green-500 opacity-10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative text-center mb-8 mt-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {view === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {view === 'login' 
              ? 'Sign in to continue your speech therapy journey.' 
              : 'Start your journey to clear, confident speech.'}
          </p>
          {error && <p className="mt-4 text-sm text-red-600 font-bold py-2.5 rounded-xl">{error}</p>}
        </div>

        {view === 'login' ? (
          <form className="relative space-y-5" onSubmit={handleLoginSubmit}>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 ml-1" htmlFor="email">Email Address</label>
              <input id="email" type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800" placeholder="you@example.com" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 ml-1" htmlFor="password">Password</label>
              <input id="password" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800" placeholder="••••••••" />
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-lime-600 focus:ring-lime-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">Remember me</label>
              </div>
              <a href="#" className="text-sm font-semibold text-lime-600 hover:text-green-500 transition-colors">Forgot password?</a>
            </div>

            <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-lime-500/30 text-base font-bold text-white bg-linear-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transform hover:-translate-y-0.5 transition-all duration-300 mt-6">
              Log In
            </button>
            <div className="text-center mt-6">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button type="button" onClick={() => switchView('signup')} className="font-bold text-lime-600 hover:text-green-500 transition-colors">Sign up today</button>
              </p>
            </div>
          </form>
        ) : (
          <form className="relative space-y-4" onSubmit={handleSignupSubmit}>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 ml-1" htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" required value={signupData.name} onChange={handleSignupChange} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800" placeholder="Your Name" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 ml-1" htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" required value={signupData.email} onChange={handleSignupChange} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800" placeholder="you@example.com" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 ml-1" htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" type="number" required value={signupData.phone} onChange={handleSignupChange} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800" placeholder="+91 XXXXXXXXXX" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700 ml-1" htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required value={signupData.password} onChange={handleSignupChange} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800" placeholder="••••••••" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700 ml-1" htmlFor="confirmPassword">Confirm</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required value={signupData.confirmPassword} onChange={handleSignupChange} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="w-full flex justify-center py-4 px-4 mt-8 border border-transparent rounded-2xl shadow-lg shadow-lime-500/30 text-base font-bold text-white bg-linear-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transform hover:-translate-y-0.5 transition-all duration-300">
              Sign Up
            </button>
            <div className="text-center mt-6 pb-2">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <button type="button" onClick={() => switchView('login')} className="font-bold text-lime-600 hover:text-green-500 transition-colors">Log in</button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
