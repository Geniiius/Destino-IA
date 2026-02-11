/**
 * @file Supabase Edge Function: admin-reset-password
 * @description Réinitialise le mot de passe d'un utilisateur via l'API Admin Supabase.
 *
 * Cette fonction tourne côté serveur avec le service_role key,
 * ce qui permet de changer le mot de passe d'un autre utilisateur
 * sans que la clé soit exposée dans le frontend.
 *
 * Déploiement :
 *   npx supabase functions deploy admin-reset-password
 *
 * Ou via Dashboard Supabase → Edge Functions → New Function
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Vérifier la méthode
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Récupérer les paramètres
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Email et newPassword requis" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({
          error: "Le mot de passe doit contenir au moins 6 caractères",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Vérifier que l'appelant est un admin authentifié
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Client Supabase avec anon key pour vérifier le JWT de l'appelant
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Vérifier que l'utilisateur appelant est admin
    const {
      data: { user: caller },
      error: callerError,
    } = await anonClient.auth.getUser();

    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Vérifier le rôle admin dans les profils
    const { data: profile } = await anonClient
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Accès réservé aux administrateurs" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Client admin avec service_role pour modifier le mot de passe
    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Trouver l'utilisateur cible par email
    const { data: userList, error: listError } =
      await adminClient.auth.admin.listUsers({ perPage: 1000 });

    if (listError) {
      console.error("Erreur listUsers:", listError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la recherche de l'utilisateur" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const targetUser = userList.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase().trim(),
    );

    if (!targetUser) {
      return new Response(
        JSON.stringify({ error: `Utilisateur non trouvé: ${email}` }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Mettre à jour le mot de passe
    const { error: updateError } =
      await adminClient.auth.admin.updateUserById(targetUser.id, {
        password: newPassword,
      });

    if (updateError) {
      console.error("Erreur updateUser:", updateError);
      return new Response(
        JSON.stringify({
          error: `Erreur mise à jour: ${updateError.message}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(
      `[admin-reset-password] Mot de passe mis à jour pour ${email} par admin ${caller.email}`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: `Mot de passe mis à jour pour ${email}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Erreur serveur",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
