/**
 * @file AdminHeader.tsx
 * @description Barre de navigation supérieure du dashboard admin
 */

import React from "react";
import {
  Home,
  Users,
  Presentation,
  BookOpen,
  HelpCircle,
  Trophy,
} from "lucide-react";
import type { ActiveTab } from "@/types";

interface AdminHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onBack: () => void;
  onlineCount: number;
}

const TABS: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
  { id: "slides", label: "Slides", icon: Presentation },
  { id: "exercises", label: "Ejercicios", icon: BookOpen },
  { id: "quiz", label: "Quiz", icon: HelpCircle },
  { id: "challenge", label: "Défi", icon: Trophy },
];

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onTabChange,
  onBack,
  onlineCount,
}) => {
  return (
    <header className="flex-shrink-0 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo et titre */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title="Retour à l'accueil"
          >
            <Home className="w-4 h-4 text-gray-400" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">
              Atelier de Marketing Visuel
            </h1>
            <p className="text-gray-500 text-xs">Panel d'administration</p>
          </div>
        </div>

        {/* Navigation par onglets */}
        <nav className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Compteur de participants */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full">
          <Users className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-white text-xs font-medium">
            {onlineCount} connectés
          </span>
        </div>
      </div>
    </header>
  );
};
