import { AuthView } from "@neondatabase/auth/react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";

export default function AuthPage() {
  const { user } = useAuth();
  const { path } = useParams<{ path: string }>();

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center gap-2">
          <svg style={{ color: "#1a2533" }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="cursor-default font-heading font-bold text-lg text-white">
            Bookshelf
          </span>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex min-h-screen">
        {/* Left illustration panel */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img
            src="/bookCover.jpg"
            alt=""
            className="absolute opacity-95 inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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

        {/* Right form panel — Neon Auth handles sign-in/sign-up toggle */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-16">
          <div className="w-full max-w-md animate-slide-up">
            <AuthView pathname={path || "sign-in"} />
          </div>
        </div>
      </div>
    </div>
  );
}
