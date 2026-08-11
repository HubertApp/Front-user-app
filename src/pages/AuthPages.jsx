import React, { useState, useEffect, useCallback, useRef } from 'react';
import { gql } from "@apollo/client";
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { setToken } from './tokenStore';
import { useCurrentUser, useLogout } from '../services/userService';
import UserAvatar from '../components/user/UserAvatar';

const GOOGLE_WEB_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LOGIN_WITH_GOOGLE_MUTATION = gql`
  mutation LoginWithGoogle($idToken: String!) {
    loginWithGoogle(idToken: $idToken) {
      accessToken
    }
  }
`;


function AssetUser({ user, onLogout }) {
  return (
    <div style={styles.profileCard}>
      <UserAvatar user={user} size={48} />
      <div style={styles.profileDetails}>
        <h3 style={styles.profileName}>{user.pseudo || "Utilisateur"}</h3>
        <p style={styles.profileEmail}>{user.email}</p>
        <span style={styles.badge}>{user.role || "Membre"}</span>
      </div>
      <div>
        <button onClick={onLogout}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg style={styles.googleIcon} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function AuthPages({ onSuccess, redirectTo = '/' }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const isNative = Capacitor.isNativePlatform();
  const googleButtonRef = useRef(null);
  const navigate = useNavigate();

  const { user, loading, refetch } = useCurrentUser();
  const logout = useLogout();

  const [loginWithGoogle] = useMutation(LOGIN_WITH_GOOGLE_MUTATION);
  const isAuthenticated = !!user;

  const handleLogout = useCallback(async () => {
    await logout();
    await refetch();
  }, [logout, refetch]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, isAuthenticated, navigate, redirectTo]);

  const completeLogin = useCallback(async (idToken) => {
    setIsConnecting(true);
    setErrorMessage(null);
    try {
      const { data: result } = await loginWithGoogle({ variables: { idToken } });
      await setToken(result.loginWithGoogle.accessToken);
      await refetch();
      if (onSuccess) onSuccess();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error('Erreur lors de la connexion Google:', err);
      setErrorMessage("La connexion a échoué, merci de réessayer.");
    } finally {
      setIsConnecting(false);
    }
  }, [loginWithGoogle, refetch, onSuccess, navigate, redirectTo]);

  useEffect(() => {
    if (isNative) {
      SocialLogin.initialize({
        google: { webClientId: GOOGLE_WEB_CLIENT_ID },
      });
    }
  }, [isNative]);

  useEffect(() => {
    if (isNative || isAuthenticated) return;
    
    let cancelled = false;
    let attempts = 0;

    function initGoogle() {
      if (cancelled) return;

      if (window.google?.accounts?.id && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_WEB_CLIENT_ID,
          callback: (response) => completeLogin(response.credential),
        });

        googleButtonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 300,
          text: 'continue_with',
        });
        return;
      }

      attempts += 1;
      if (attempts > 50) { 
        console.error("Problème script Google Identity Services n'a pas pu être chargé. Vérifie qu'il est bien présent dans index.html.");
        return;
      }
      setTimeout(initGoogle, 100);
    }

    initGoogle();

    return () => { cancelled = true; };
  }, [isNative, isAuthenticated, completeLogin]);

  const handleLoginNative = async () => {
    setErrorMessage(null);
    try {
      const result = await SocialLogin.login({
        provider: 'google',
      });
      
      const idToken = result?.result?.idToken;
      if (!idToken) throw new Error('idToken manquant dans la réponse SocialLogin');
      
      await completeLogin(idToken);
    } catch (err) {
      console.warn('Connexion Google annulée ou échouée:', err);
    }
  };

  if (loading || isConnecting) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loader}>
            {isConnecting ? "Finalisation de la connexion..." : "Vérification de la session..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <svg style={styles.mainLogo} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 style={styles.title}>
            {isAuthenticated ? 'Bienvenue !' : 'Connexion'}
          </h1>
          <p style={styles.subtitle}>
            {isAuthenticated
              ? 'Vous êtes connecté avec succès à votre espace.'
              : 'Accédez à votre compte en toute sécurité.'}
          </p>
        </div>

        <div style={styles.body}>
          {!isAuthenticated ? (
            <>
              {isNative ? (
                <button onClick={handleLoginNative} style={styles.googleButton}>
                  <GoogleIcon />
                  <span>Continuer avec Google</span>
                </button>
              ) : (
                <div 
                  ref={googleButtonRef} 
                  style={{ display: 'flex', justifyContent: 'center', minHeight: '44px' }} 
                />
              )}
              {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
            </>
          ) : (
            <AssetUser user={user} onLogout={handleLogout} />
          )}
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>En continuant, vous acceptez nos conditions d'utilisation.</p>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '20px', boxSizing: 'border-box' },
  card: { backgroundColor: '#ffffff', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', width: '100%', maxWidth: '420px', textAlign: 'center', boxSizing: 'border-box' },
  header: { marginBottom: '32px' },
  logoContainer: { width: '56px', height: '56px', backgroundColor: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' },
  mainLogo: { width: '28px', height: '28px', color: '#3b82f6' },
  title: { fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' },
  subtitle: { fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' },
  body: { marginBottom: '24px' },
  googleButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 16px', fontSize: '15px', fontWeight: '600', color: '#374151', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
  googleIcon: { width: '18px', height: '18px' },
  errorText: { color: '#dc2626', fontSize: '13px', marginTop: '12px' },
  profileCard: { display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '12px', padding: '16px', textAlign: 'left' },
  avatar: { width: '48px', height: '48px', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700' },
  profileDetails: { flex: 1 },
  profileName: { fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 2px 0' },
  profileEmail: { fontSize: '13px', color: '#6b7280', margin: '0 0 6px 0' },
  badge: { display: 'inline-block', backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase' },
  loader: { fontSize: '14px', color: '#3b82f6', fontWeight: '500', padding: '20px' },
  footer: { borderTop: '1px solid #f3f4f6', paddingTop: '16px' },
  footerText: { fontSize: '12px', color: '#9ca3af', margin: 0 }
};