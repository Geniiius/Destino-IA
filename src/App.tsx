/**
 * @file App.tsx
 * @description Composant racine de l'application
 *
 * Responsabilités :
 * - Routing principal (home, admin, join, workshop)
 * - Auth Supabase (session persistante)
 * - Providers globaux
 * - Layout de base
 */

import React, { useState, useEffect } from "react";
import { AdminDashboard } from "@/features/admin/components/AdminDashboard";
import { AdminAuth } from "@/features/admin/components/AdminAuth";
import { JoinForm } from "@/features/auth/components/JoinForm";
import { HomePage } from "@/features/home/components/HomePage";
import { WorkshopView } from "@/features/workshop/components/WorkshopView";
import SplashCursor from "@/components/effects/SplashCursor";
import { MessageButton, MessagePanel } from "@/components/messaging";
import { useParticipantMessages } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";

type ViewType = 'home' | 'admin' | 'join' | 'workshop' | 'test';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>("home");
  const [participantName, setParticipantName] = useState<string>("");
  const [participantId, setParticipantId] = useState<string | null>(null);

  // Auth Supabase
  const auth = useAuth();

  // Hook de messagerie pour les participants
  const {
    messages,
    unreadCount,
    isOpen: isMessagePanelOpen,
    togglePanel: toggleMessagePanel,
    closePanel: closeMessagePanel,
  } = useParticipantMessages(participantId);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#admin") setView("admin");
      else if (hash === "#join") setView("join");
      else if (hash === "#workshop") setView("workshop");
      else if (hash === "#test") setView("test");
      else setView("home");
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Synchroniser l'auth Supabase avec l'état local
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      setParticipantId(auth.user.id);
      setParticipantName(auth.user.display_name || auth.user.email);
      localStorage.setItem("destino_participant_id", auth.user.id);
      localStorage.setItem("destino_participant_name", auth.user.display_name || auth.user.email);
    }
  }, [auth.isAuthenticated, auth.user]);

  // Récupérer depuis localStorage (fallback)
  useEffect(() => {
    if (!auth.isAuthenticated) {
      const storedParticipantId = localStorage.getItem("destino_participant_id");
      const storedName = localStorage.getItem("destino_participant_name");
      if (storedParticipantId) setParticipantId(storedParticipantId);
      if (storedName) setParticipantName(storedName);
    }
  }, [auth.isAuthenticated]);

  const handleJoin = (name: string, _email: string, id?: string) => {
    setParticipantName(name);
    if (id) {
      setParticipantId(id);
      localStorage.setItem("destino_participant_id", id);
      localStorage.setItem("destino_participant_name", name);
    }
    // Rediriger vers le workshop après l'inscription
    window.location.hash = "#workshop";
  };

  const handleLeaveWorkshop = () => {
    window.location.hash = "";
  };

  // Afficher le bouton de messagerie seulement dans le workshop
  const showMessaging = participantId && (view === "workshop" || view === "test");

  return (
    <div className="min-h-screen bg-[#050508] relative overflow-hidden flex flex-col items-center justify-center">
      {/* Effet curseur fluide uniquement sur home et join */}
      {(view === "home" || view === "join") && <SplashCursor />}

      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Views */}
      {view === "home" && <HomePage />}
      {view === "admin" && (
        <AdminAuth>
          <AdminDashboard />
        </AdminAuth>
      )}
      {view === "join" && <JoinForm onJoin={handleJoin} />}
      {view === "workshop" && (
        <WorkshopView
          participantName={participantName || "Participant"}
          participantId={participantId || "anonymous"}
          onLeave={handleLeaveWorkshop}
        />
      )}
      {view === "test" && (
        <WorkshopView
          participantName="Participant Test"
          participantId="test-participant-001"
          onLeave={handleLeaveWorkshop}
        />
      )}

      {/* Messagerie participant */}
      {showMessaging && (
        <>
          <MessageButton
            unreadCount={unreadCount}
            onClick={toggleMessagePanel}
          />
          {isMessagePanelOpen && (
            <MessagePanel messages={messages} onClose={closeMessagePanel} />
          )}
        </>
      )}
    </div>
  );
};

export default App;
