import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, Eye, EyeOff, Lock, Mail, User, ChevronRight, ShieldCheck, BarChart3, Globe } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (!terms) {
      return setError('You must accept the terms and conditions');
    }

    setLoading(true);
    try {
      const res = await register(name, email, password);
      if (res.data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex bg-[#f8f9fa]">
      {/* Left Section - Branding & Info */}
      <div className="hidden lg:flex w-1/2 bg-white flex-col justify-center items-start px-20 border-r border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-600"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-gold-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>

        <div className="mb-12 flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg shadow-gray-200">
            <TrendingUp className="text-gold-500 w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Smart Trade</h1>
        </div>

        <h2 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Start Your Journey.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-yellow-600">Join the Elite.</span>
        </h2>
        
        <p className="text-lg text-gray-500 mb-12 max-w-md leading-relaxed">
          Create an account today to access professional trading tools, advanced portfolio management, and real-time market data.
        </p>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <ShieldCheck className="w-6 h-6 text-gold-600" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold">Secure & Private</h3>
              <p className="text-sm text-gray-500">Your data is protected with enterprise-grade security.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex flex-col items-center mt-8">
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <TrendingUp className="text-gold-500 w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Smart Trade</h1>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 my-8 lg:my-0">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-500">Enter your details to get started.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all outline-none text-gray-900" 
                    placeholder="John Doe"
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all outline-none text-gray-900" 
                    placeholder="you@example.com"
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all outline-none text-gray-900" 
                    placeholder="••••••••"
                    required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div 
                        key={level} 
                        className={`h-1 flex-1 rounded-full ${
                          strength >= level 
                            ? strength <= 2 ? 'bg-amber-400' : strength === 3 ? 'bg-blue-400' : 'bg-green-500' 
                            : 'bg-gray-200'
                        }`} 
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all outline-none text-gray-900" 
                    placeholder="••••••••"
                    required 
                  />
                </div>
              </div>

              <div className="flex items-center mt-2">
                <label className="flex items-start text-sm text-gray-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={terms}
                    onChange={e => setTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-gold-600 focus:ring-gold-500 mr-2" 
                  />
                  <span>I agree to the <a href="#" className="text-gray-900 font-medium hover:underline">Terms & Conditions</a> and <a href="#" className="text-gray-900 font-medium hover:underline">Privacy Policy</a></span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-xl font-medium transition-colors shadow-lg shadow-gray-900/20 disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Create Account
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-gray-900 hover:text-gold-600 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}