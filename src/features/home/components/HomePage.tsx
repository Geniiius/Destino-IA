/**
 * @file features/home/components/HomePage.tsx
 * @description Página de inicio del taller
 */

import React from "react";
import { APP, ROUTES } from "@/config";

export const HomePage: React.FC = () => {
  return (
    <div className="relative z-10 w-full max-w-lg px-8 animate-slide-up-strong">
      <div className="flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-10">
          <img 
            src="/assets/logo.png" 
            alt="Destino IA" 
            className="w-[28rem] md:w-[34rem] h-auto animate-float drop-shadow-[0_0_60px_rgba(56,189,248,0.3)]"
          />
        </div>

        {/* Línea decorativa */}
        <div className="h-px w-40 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent mb-10" />

        {/* Descripción */}
        <p className="text-gray-400 text-lg md:text-xl font-medium tracking-tight max-w-sm mb-14 leading-relaxed">
          {APP.DESCRIPTION.split("IA Generativa")[0]}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400 font-bold">IA Generativa</span>
          {APP.DESCRIPTION.split("IA Generativa")[1]}
        </p>

        {/* Acciones */}
        <div className="grid grid-cols-2 gap-5 w-full mb-20">
          <button
            onClick={() => (window.location.hash = ROUTES.JOIN)}
            className="py-7 px-6 uppercase tracking-[0.3em] text-sm font-extrabold relative group rounded-xl
                       bg-gradient-to-br from-cyan-500 to-sky-600 text-white overflow-hidden
                       transition-all duration-300 ease-out
                       hover:from-cyan-400 hover:to-sky-500 hover:shadow-[0_0_40px_rgba(56,189,248,0.5),0_0_80px_rgba(56,189,248,0.25)]
                       hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 transition-all duration-300 group-hover:scale-105 inline-block font-black">
              Participar
            </span>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/30 via-sky-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>

          <button
            onClick={() => (window.location.hash = ROUTES.ADMIN)}
            className="py-7 px-6 uppercase tracking-[0.3em] text-sm font-extrabold relative group rounded-xl
                       border border-cyan-500/20 bg-white/[0.03] backdrop-blur-sm text-gray-300
                       transition-all duration-300 ease-out
                       hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white hover:shadow-[0_0_30px_rgba(56,189,248,0.3)]
                       hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 transition-all duration-300 group-hover:scale-105 inline-block">
              Admin
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-5 opacity-30">
          <div className="h-px w-48 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
          <div className="flex gap-8 items-center">
            <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-gray-500">
              Iteración
            </span>
            <div className="w-1 h-1 rounded-full bg-cyan-500/40" />
            <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-gray-500">
              Creatividad
            </span>
            <div className="w-1 h-1 rounded-full bg-cyan-500/40" />
            <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-gray-500">
              Futuro
            </span>
          </div>
          <p className="text-[8px] text-gray-700 font-medium uppercase tracking-[0.3em] mt-1">
            © {APP.YEAR} {APP.AUTHOR.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};
