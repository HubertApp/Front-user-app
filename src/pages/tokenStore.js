import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'jwt';

export async function setToken(token) {
  await Preferences.set({ key: TOKEN_KEY, value: token });
}

export async function getToken() {
  try {
    const { value } = await Preferences.get({ key: TOKEN_KEY });
    return value ?? null;
  } catch {
    return null;
  }
}

export async function clearToken() {
  await Preferences.remove({ key: TOKEN_KEY });
}
