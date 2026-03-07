import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";
import Button from "~/components/ui/Button";

export default function AuthPage() {
  const { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle } =
    useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (isLogin) {
      const { error: authError } = await signInWithEmail(email, password);
      if (authError) setError(authError.message);
    } else {
      const { error: authError } = await signUpWithEmail(email, password);
      if (authError) {
        setError(authError.message);
      } else {
        setSignupSuccess(true);
      }
    }

    setSubmitting(false);
  };

  const handleGoogle = async () => {
    const { error: authError } = await signInWithGoogle();
    if (authError) setError(authError.message);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="cursor-default font-heading font-bold text-lg text-white">
            Bookshelf
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setIsLogin(true); setError(""); setSignupSuccess(false); }}
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors duration-200 ${
              isLogin
                ? "text-text-primary font-medium"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(""); setSignupSuccess(false); }}
            className={`px-4 py-1.5 text-sm rounded-lg border transition-colors duration-200 ${
              !isLogin
                ? "border-primary bg-primary text-white font-medium"
                : "border-navy-200 text-text-secondary hover:border-navy-300"
            }`}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex min-h-screen">
        {/* Left illustration panel */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          {/* Full-cover image */}
          <img
            src="/bookCover.jpg"
            alt=""
            className="absolute opacity-95 inset-0 w-full h-full object-cover"
          />
          {/* Dark gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {/* Text at bottom center */}
          <div className="flex justify-center items-center flex-col absolute bottom-0 left-0 right-0 px-12 pb-12 text-center animate-slide-up">
            <h2 className="font-display text-5xl font-bold text-white mb-3 leading-tight">
              Unlock Premium<br />Insights.
            </h2>
            <p className="text-white/80 max-w-xl text-md text-base">
              Dive into our curated editorial collection and elevate
              your reading experience today.
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-16">
          <div className="w-full max-w-2xl animate-slide-up">
            <h1 className="font-display text-5xl font-bold text-text-primary mb-1.5">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-text-secondary text-md mb-8">
              {isLogin
                ? "Log in to access your premium editorial content."
                : "Sign up to start organizing your books."}
            </p>

            {signupSuccess ? (
              <div className="bg-success/10 border border-success/20 rounded-xl p-6 text-center animate-scale-in">
                <svg className="w-10 h-10 text-success mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="font-semibold text-text-primary mb-1">Check your email</h3>
                <p className="text-sm text-text-secondary">
                  We sent a confirmation link to <span className="font-medium">{email}</span>. Click it to activate your account, then come back to log in.
                </p>
                <button
                  onClick={() => { setSignupSuccess(false); setIsLogin(true); }}
                  className="mt-4 text-sm text-primary font-medium hover:underline"
                >
                  Back to login
                </button>
              </div>
            ) : (
              <>
                {/* Google button first */}
                <button
                  onClick={handleGoogle}
                  type="button"
                  className="cursor-pointer w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-navy-200 rounded-lg text-sm font-medium text-text-primary hover:bg-surface transition-colors duration-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-navy-100" />
                  <span className="text-xs text-text-muted">
                    or {isLogin ? "log in" : "sign up"} with email
                  </span>
                  <div className="flex-1 h-px bg-navy-100" />
                </div>

                {error && (
                  <div className="bg-danger/10 text-danger text-sm px-4 py-2.5 rounded-lg mb-4 animate-scale-in">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-navy-200 rounded-lg text-sm text-text-primary placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                        Password
                      </label>
                      {isLogin && (
                        <button type="button" className="text-xs text-primary hover:underline">
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input
                        id="password"
                        type="password"
                        placeholder={isLogin ? "Enter your password" : "Min. 6 characters"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full pl-10 pr-4 py-2.5 border border-navy-200 rounded-lg text-sm text-text-primary placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                  </Button>
                </form>

                <p className="text-center text-sm text-text-muted mt-6">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError("");
                    }}
                    className="text-primary font-medium hover:underline"
                  >
                    {isLogin ? "Sign up now" : "Log in"}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
