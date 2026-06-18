import React, { useState, useRef } from 'react';
import { gql } from "@apollo/client";
import { useQuery } from '@apollo/client/react';

function AssetUser() {
  const TEST_QUERY = gql`
    query GetMe {
      getMe {
        googleId
        email
        age
        pseudo
        role
        created_at
        updated_at
      }
    }
  `;

  const { loading, error, data } = useQuery(TEST_QUERY, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  const result = useQuery(TEST_QUERY, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  console.log("RESULT =", result);
  console.log("ERROR =", result.errors);

  console.log("Données GraphQL reçues :", data);

  if (loading) return <div style={styles.loader}>Chargement du profil...</div>;
  if (error) return <div style={styles.errorText}>Impossible de charger le profil : {error.message}</div>;

  const user = data?.getMe;

  if (!user) {
    return (
      <div style={styles.errorText}>
        Aucune donnée utilisateur reçue (Problème de validation du token).
      </div>
    );
  }

  return (
    <div style={styles.profileCard}>
      <div style={styles.avatar}>
        {user.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U'}
      </div>
      <div style={styles.profileDetails}>
        <h3 style={styles.profileName}>{user.pseudo || "Utilisateur"}</h3>
        <p style={styles.profileEmail}>{user.email}</p>
        <span style={styles.badge}>{user.role || "Membre"}</span>
      </div>
    </div>
  );
}

export default function AuthPages({ onSuccess }) {
  const timerRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleLogin = () => {
    setIsConnecting(true);
    
    // Centrer la popup au milieu de l'écran de l'utilisateur
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      'http://localhost:3007/auth/google',
      'Google Login',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );

    timerRef.current = setInterval(() => {
      if (popup?.closed) {
        clearInterval(timerRef.current);
        
        setTimeout(() => {
          setIsConnecting(false);
          setIsAuthenticated(true);
          if (onSuccess) onSuccess();
        }, 250);
      }
    }, 500);
  };

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

        {/* Corps changeant selon l'état de connexion */}
        <div style={styles.body}>
          {!isAuthenticated ? (
            <button 
              onClick={handleLogin} 
              disabled={isConnecting}
              style={{
                ...styles.googleButton,
                ...(isConnecting ? styles.googleButtonDisabled : {})
              }}
            >
              <svg style={styles.googleIcon} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>
                {isConnecting ? 'Authentification...' : 'Continuer avec Google'}
              </span>
            </button>
          ) : (
            <AssetUser />
          )}
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>En continuant, vous acceptez nos conditions d\'utilisation.</p>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px 32px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  header: {
    marginBottom: '32px',
  },
  logoContainer: {
    width: '56px',
    height: '56px',
    backgroundColor: '#eff6ff',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto',
  },
  mainLogo: {
    width: '28px',
    height: '28px',
    color: '#3b82f6',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.5',
  },
  body: {
    marginBottom: '24px',
  },
  googleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  googleButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  googleIcon: {
    width: '18px',
    height: '18px',
  },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: '#f9fafb',
    border: '1px solid #f3f4f6',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'left',
  },
  avatar: {
    width: '48px',
    height: '48px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 2px 0',
  },
  profileEmail: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 6px 0',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '20px',
    textTransform: 'uppercase',
  },
  loader: {
    fontSize: '14px',
    color: '#3b82f6',
    fontWeight: '500',
    padding: '20px',
  },
  errorText: {
    fontSize: '13px',
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    padding: '12px',
    borderRadius: '8px',
  },
  footer: {
    borderTop: '1px solid #f3f4f6',
    paddingTop: '16px',
  },
  footerText: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  }
};