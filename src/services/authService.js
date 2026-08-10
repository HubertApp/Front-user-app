import { clearToken } from '../pages/tokenStore';

const AUTH_BASE_URL = 'http://localhost:3000';

export async function logout() {
  try {
    await fetch(`${AUTH_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } finally {
    // Le natif stocke son propre token (Preferences) ; le web s'appuie sur
    // les cookies httpOnly effacés côté serveur ci-dessus. On nettoie les
    // deux dans tous les cas.
    await clearToken();
  }
}
