-- ============================================================
-- SEED : Création des comptes initiaux
-- ============================================================
-- Ce script crée le compte administrateur et un participant test.
-- À exécuter APRÈS la migration 005_complete_system.sql.
--
-- IMPORTANT : Les utilisateurs sont créés via l'interface Supabase
-- (Authentication > Users > Add User) car le SQL n'a pas accès
-- à la fonction de hashing des mots de passe.
--
-- Comptes à créer manuellement dans Supabase Dashboard :
-- ──────────────────────────────────────────────────────
--
-- 1. ADMINISTRATEUR
--    Email    : admin@destino-ia.com
--    Password : Destino-IA-Admin-2026!
--    Metadata : {"display_name": "Admin Destino IA", "role": "admin"}
--
-- 2. PARTICIPANT TEST
--    Email    : test@destino-ia.com
--    Password : Test-Participant-2026!
--    Metadata : {"display_name": "Participant Test", "role": "participant"}
--
-- ──────────────────────────────────────────────────────
-- Après avoir créé ces utilisateurs dans le dashboard,
-- exécutez le script ci-dessous pour mettre à jour les profils.

-- Mettre à jour le profil admin (après création via dashboard)
UPDATE public.profiles 
SET 
  role = 'admin',
  display_name = 'Admin Destino IA'
WHERE email = 'admin@destino-ia.com';

-- Vérifier le profil test (créé automatiquement par le trigger)
UPDATE public.profiles 
SET 
  display_name = 'Participant Test'
WHERE email = 'test@destino-ia.com';

-- Vérification
SELECT id, email, display_name, role, created_at 
FROM public.profiles 
ORDER BY created_at;
