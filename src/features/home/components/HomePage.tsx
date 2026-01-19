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
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-black font-black text-3xl mb-14 animate-float shadow-[0_0_40px_rgba(16,185,129,0.4)]">
          D
        </div>

        {/* Título */}
        <div className="mb-14">
          <h1 className="text-8xl font-black italic tracking-tighter leading-[0.8] flex flex-col items-center">
            <span className="text-white">Destino</span>
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent mt-2 animate-gradient-x">
              IA
            </span>
          </h1>
          <div className="h-1 w-32 bg-emerald-500 rounded-full mx-auto mt-6 opacity-80 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
        </div>

        {/* Descripción */}
        <p className="text-gray-400 text-lg md:text-xl font-medium tracking-tight max-w-xs mb-16 leading-tight">
          {APP.DESCRIPTION.split("IA Generativa")[0]}
          <span className="text-white font-bold">IA Generativa</span>
          {APP.DESCRIPTION.split("IA Generativa")[1]}
        </p>

        {/* Acciones */}
        <div className="grid grid-cols-2 gap-5 w-full mb-24">
          <button
            onClick={() => (window.location.hash = ROUTES.JOIN)}
            className="py-8 px-6 uppercase tracking-[0.3em] text-sm font-extrabold relative group rounded-xl
                       bg-emerald-500 text-black overflow-hidden
                       transition-all duration-300 ease-out
                       hover:bg-emerald-400 hover:shadow-[0_0_50px_rgba(16,185,129,0.8),0_0_100px_rgba(16,185,129,0.5)]
                       hover:scale-110 active:scale-95"
          >
            <span className="relative z-10 transition-all duration-300 group-hover:scale-105 inline-block font-black">
              Participar
            </span>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 via-teal-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>

          <button
            onClick={() => (window.location.hash = ROUTES.ADMIN)}
            className="py-8 px-6 uppercase tracking-[0.3em] text-sm font-extrabold relative group rounded-xl
                       border-3 border-white/20 bg-white/5 backdrop-blur-sm text-white
                       transition-all duration-300 ease-out
                       hover:border-emerald-400 hover:bg-emerald-500/30 hover:shadow-[0_0_40px_rgba(16,185,129,0.8),0_0_80px_rgba(16,185,129,0.4)]
                       hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 transition-all duration-300 group-hover:scale-110 inline-block group-hover:text-emerald-200">
              Admin
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400/40 to-teal-400/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-6 opacity-40">
          <div className="h-px w-48 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="flex gap-10 items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.6em] text-gray-400">
              Iteración
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.6em] text-gray-400">
              Creatividad
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.6em] text-gray-400">
              Futuro
            </span>
          </div>
          <p className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.3em] mt-2">
            © {APP.YEAR} {APP.AUTHOR.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};
