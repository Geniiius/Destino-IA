/**
 * @file ParticipantManageModal.tsx
 * @description Modal d'administration d'un participant
 *
 * Permet :
 * - Voir les informations détaillées
 * - Forcer la déconnexion
 * - Réinitialiser / générer un nouveau mot de passe
 * - Envoyer un message direct
 */

import React, { useState } from "react";
import {
  X,
  LogOut,
  KeyRound,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Mail,
  User,
  Clock,
  Shield,
} from "lucide-react";
import type { Participant } from "@/types";
import {
  forceDisconnectParticipant,
  adminResetPassword,
  generatePassword,
} from "@/services/adminUsers";

interface ParticipantManageModalProps {
  participant: Participant;
  onClose: () => void;
  onDisconnected: () => void;
  onSendMessage: (participant: Participant) => void;
  onPasswordGenerated?: (entry: {
    participantName: string;
    email: string;
    password: string;
  }) => void;
}

export const ParticipantManageModal: React.FC<ParticipantManageModalProps> = ({
  participant,
  onClose,
  onDisconnected,
  onSendMessage,
  onPasswordGenerated,
}) => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [disconnectDone, setDisconnectDone] = useState(false);
  const [resetResult, setResetResult] = useState<{
    success: boolean;
    password?: string;
    emailSent?: boolean;
    error?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const email = participant.assigned_email;
  const isOnline = participant.status === "online";

  // ── Déconnexion forcée ──

  const handleDisconnect = async () => {
    if (!confirmDisconnect) {
      setConfirmDisconnect(true);
      return;
    }

    setIsDisconnecting(true);
    const result = await forceDisconnectParticipant(participant.id);

    if (result.success) {
      setDisconnectDone(true);
      setConfirmDisconnect(false);
      // Notifier le parent pour rafraîchir la liste
      setTimeout(() => onDisconnected(), 1200);
    }

    setIsDisconnecting(false);
  };

  // ── Reset mot de passe ──

  const handleResetWithNewPassword = async () => {
    if (!email) return;
    setIsResetting(true);
    setResetResult(null);

    const newPwd = generatePassword(10);

    // Toujours afficher le mot de passe immédiatement
    setResetResult({
      success: true,
      password: newPwd,
    });

    // Notifier le dashboard pour garder un historique
    if (onPasswordGenerated && email) {
      onPasswordGenerated({
        participantName: participant.name,
        email,
        password: newPwd,
      });
    }

    // Tenter de mettre à jour côté serveur (en arrière-plan)
    try {
      const result = await adminResetPassword(email, newPwd);
      if (!result.success) {
        console.warn(
          "[ParticipantManage] Server password update failed, but password is shown to admin:",
          result.error,
        );
      }
    } catch (err) {
      console.warn(
        "[ParticipantManage] Server error during password reset:",
        err,
      );
    }

    setIsResetting(false);
  };

  const handleResetViaEmail = async () => {
    if (!email) return;
    setIsResetting(true);
    setResetResult(null);

    const result = await adminResetPassword(email);

    if (result.success) {
      setResetResult({ success: true, emailSent: true });
    } else {
      setResetResult({
        success: false,
        error: result.error || "Erreur inconnue",
      });
    }

    setIsResetting(false);
  };

  // ── Copier le mot de passe ──

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#12121a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#12121a] ${
                  isOnline && !disconnectDone ? "bg-emerald-500" : "bg-gray-500"
                }`}
              />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">
                {participant.name}
              </h2>
              <p className="text-gray-400 text-xs flex items-center gap-1">
                {email ? (
                  <>
                    <Mail className="w-3 h-3" />
                    {email}
                  </>
                ) : (
                  <span className="italic">Pas d&apos;email</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Infos */}
        <div className="p-5 space-y-3 border-b border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              Statut
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                isOnline && !disconnectDone
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {isOnline && !disconnectDone ? "Connecté" : "Hors ligne"}
            </span>
          </div>
          {participant.joined_at && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Rejoint le
              </span>
              <span className="text-white text-xs">
                {new Date(participant.joined_at).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 space-y-3">
          {/* ── Déconnexion forcée ── */}
          {isOnline && !disconnectDone && (
            <div className="space-y-2">
              <button
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  confirmDisconnect
                    ? "bg-red-500/30 border border-red-500/50 text-red-300 hover:bg-red-500/40"
                    : "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                }`}
              >
                {isDisconnecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                {confirmDisconnect
                  ? "Confirmer la déconnexion"
                  : "Forcer la déconnexion"}
              </button>
              {confirmDisconnect && (
                <p className="text-xs text-red-400/70 text-center flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Le participant sera déconnecté immédiatement
                </p>
              )}
            </div>
          )}

          {disconnectDone && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
              <Check className="w-4 h-4" />
              Participant déconnecté avec succès
            </div>
          )}

          {/* ── Gestion mot de passe ── */}
          {email && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Gestion du mot de passe
              </p>

              {/* Générer un nouveau mot de passe */}
              <button
                onClick={handleResetWithNewPassword}
                disabled={isResetting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 rounded-xl text-sm font-medium transition-all"
              >
                {isResetting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                Générer un nouveau mot de passe
              </button>

              {/* Envoyer un email de reset */}
              <button
                onClick={handleResetViaEmail}
                disabled={isResetting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 rounded-xl text-sm font-medium transition-all"
              >
                {isResetting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                Envoyer un email de réinitialisation
              </button>

              {/* Résultat */}
              {resetResult && (
                <div
                  className={`p-3 rounded-xl text-sm space-y-2 ${
                    resetResult.success
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  {resetResult.success && resetResult.password && (
                    <>
                      <p className="text-emerald-400 font-medium">
                        Nouveau mot de passe généré :
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-black/40 rounded-lg text-white font-mono text-base tracking-wider select-all">
                          {resetResult.password}
                        </code>
                        <button
                          onClick={() => handleCopy(resetResult.password || "")}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          title="Copier"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">
                        Communiquez ce mot de passe au participant. Il pourra le
                        changer ensuite.
                      </p>
                    </>
                  )}
                  {resetResult.success && resetResult.emailSent && (
                    <p className="text-emerald-400 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Email de réinitialisation envoyé à {email}
                    </p>
                  )}
                  {!resetResult.success && (
                    <p className="text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {resetResult.error}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {!email && (
            <div className="px-4 py-3 bg-gray-500/10 border border-gray-500/20 rounded-xl">
              <p className="text-gray-400 text-xs text-center">
                Ce participant n&apos;a pas d&apos;email associé. La gestion du
                mot de passe n&apos;est pas disponible.
              </p>
            </div>
          )}

          {/* ── Envoyer un message ── */}
          <button
            onClick={() => {
              onSendMessage(participant);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 rounded-xl text-sm font-medium transition-all"
          >
            <Mail className="w-4 h-4" />
            Envoyer un message direct
          </button>
        </div>
      </div>
    </div>
  );
};
