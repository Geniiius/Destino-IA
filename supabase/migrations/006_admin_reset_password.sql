-- ============================================================
-- FONCTION SQL : Réinitialisation de mot de passe par admin
-- ============================================================
-- Cette fonction permet à un admin de changer le mot de passe
-- d'un utilisateur directement via une RPC Supabase.
--
-- USAGE côté client :
--   supabase.rpc('admin_reset_user_password', {
--     target_email: 'user@email.com',
--     new_password: 'NouveauMotDePasse123'
--   })
--
-- À exécuter dans : Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Fonction sécurisée pour reset de mot de passe
-- SECURITY DEFINER = s'exécute avec les droits du propriétaire (postgres)
CREATE OR REPLACE FUNCTION public.admin_reset_user_password(
  target_email TEXT,
  new_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  target_user_id UUID;
  caller_role TEXT;
BEGIN
  -- 1. Vérifier que l'appelant est un admin
  SELECT role INTO caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF caller_role IS NULL OR caller_role != 'admin' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Accès réservé aux administrateurs'
    );
  END IF;

  -- 2. Vérifier les paramètres
  IF target_email IS NULL OR target_email = '' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Email requis'
    );
  END IF;

  IF new_password IS NULL OR length(new_password) < 6 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Le mot de passe doit contenir au moins 6 caractères'
    );
  END IF;

  -- 3. Trouver l'utilisateur cible par email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = lower(trim(target_email));

  IF target_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Utilisateur non trouvé: %s', target_email)
    );
  END IF;

  -- 4. Mettre à jour le mot de passe via la fonction interne de Supabase
  -- La colonne encrypted_password utilise bcrypt (extension pgcrypto)
  UPDATE auth.users
  SET
    encrypted_password = crypt(new_password, gen_salt('bf')),
    password_hash = NULL,
    updated_at = now()
  WHERE id = target_user_id;

  -- 5. Log (optionnel)
  RAISE NOTICE '[admin_reset_user_password] Mot de passe mis à jour pour % par admin %',
    target_email, auth.uid();

  RETURN jsonb_build_object(
    'success', true,
    'message', format('Mot de passe mis à jour pour %s', target_email)
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Erreur: %s', SQLERRM)
    );
END;
$$;

-- Sécurité : seuls les utilisateurs authentifiés peuvent appeler cette fonction
-- (la vérification admin est faite DANS la fonction)
REVOKE ALL ON FUNCTION public.admin_reset_user_password FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_reset_user_password TO authenticated;

-- Vérification
SELECT 'Fonction admin_reset_user_password créée avec succès' AS status;
