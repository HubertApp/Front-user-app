import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

export const GEO_ERRORS = {
  DENIED: 'denied', 
  DISABLED: 'disabled',
  UNAVAILABLE: 'unavailable',
  UNSUPPORTED: 'unsupported',
};

const OPTIONS = { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 };

export class GeolocationError extends Error {
  constructor(code, cause) {
    super(code);
    this.name = 'GeolocationError';
    this.code = code;
    this.cause = cause;
  }
}

function toPosition(pos) {
  return {
    lat: pos.coords.latitude,
    lon: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
  };
}

async function getNativePosition() {
  let permissions;
  try {
    permissions = await Geolocation.checkPermissions();
  } catch (err) {
    throw new GeolocationError(GEO_ERRORS.DISABLED, err);
  }

  if (permissions.location !== 'granted' && permissions.coarseLocation !== 'granted') {
    try {
      permissions = await Geolocation.requestPermissions();
    } catch (err) {
      throw new GeolocationError(GEO_ERRORS.DISABLED, err);
    }
    // Android 12+ : l'utilisateur peut n'accorder que la position approximative.
    if (permissions.location !== 'granted' && permissions.coarseLocation !== 'granted') {
      throw new GeolocationError(GEO_ERRORS.DENIED);
    }
  }

  try {
    return toPosition(await Geolocation.getCurrentPosition(OPTIONS));
  } catch (err) {
    const message = String(err?.message ?? '').toLowerCase();
    const code = message.includes('timeout') ? GEO_ERRORS.TIMEOUT : GEO_ERRORS.UNAVAILABLE;
    throw new GeolocationError(code, err);
  }
}

function getWebPosition() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new GeolocationError(GEO_ERRORS.UNSUPPORTED));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve(toPosition(pos)),
      err => {
        // Codes de l'API W3C : 1 = refus, 2 = indisponible, 3 = délai dépassé.
        const code = { 1: GEO_ERRORS.DENIED, 2: GEO_ERRORS.UNAVAILABLE, 3: GEO_ERRORS.TIMEOUT }[err?.code]
          ?? GEO_ERRORS.UNAVAILABLE;
        reject(new GeolocationError(code, err));
      },
      OPTIONS,
    );
  });
}

export function getCurrentPosition() {
  return Capacitor.isNativePlatform() ? getNativePosition() : getWebPosition();
}

export function geolocationErrorMessage(code) {
  switch (code) {
    case GEO_ERRORS.DENIED:
      return 'Localisation refusée. Autorisez-la dans les réglages pour voir ce qui vous entoure.';
    case GEO_ERRORS.DISABLED:
      return 'La localisation est désactivée sur votre appareil.';
    case GEO_ERRORS.TIMEOUT:
    case GEO_ERRORS.UNAVAILABLE:
      return 'Position introuvable pour le moment.';
    case GEO_ERRORS.UNSUPPORTED:
      return "Votre navigateur ne permet pas la localisation.";
    default:
      return 'Position indisponible.';
  }
}
