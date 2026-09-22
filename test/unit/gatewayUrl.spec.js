import { describe, it, expect, afterEach, vi } from 'vitest';

// GATEWAY_URL est calculé une seule fois à l'import du module (voir
// config/gatewayUrl.js) : window.__RUNTIME_CONFIG__.GATEWAY_URL > .env
// (VITE_AOM_API_URL) > 'http://localhost:4000'. Comme pour le fallback
// RABBITMQ_URL côté MS-User, il faut vi.resetModules() + import() dynamique
// pour forcer une réévaluation entre chaque scénario.
describe('config/gatewayUrl', () => {
  afterEach(() => {
    delete window.__RUNTIME_CONFIG__;
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('should fall back to http://localhost:4000 when nothing is configured', async () => {
    // Ce repo a toujours un .env local avec VITE_AOM_API_URL (dev) : on la
    // stub explicitement à vide pour simuler l'absence totale de config,
    // plutôt que vi.unstubAllEnvs() qui ne retire pas une valeur déjà
    // injectée par le chargement .env de Vite lui-même.
    vi.stubEnv('VITE_AOM_API_URL', '');
    vi.resetModules();

    const { GATEWAY_URL } = await import('../../src/config/gatewayUrl.js');

    expect(GATEWAY_URL).toBe('http://localhost:4000');
  });

  it('should use VITE_AOM_API_URL when set and no runtime config is present', async () => {
    vi.stubEnv('VITE_AOM_API_URL', 'https://dev.hubertapp.fr/graphql');
    vi.resetModules();

    const { GATEWAY_URL } = await import('../../src/config/gatewayUrl.js');

    expect(GATEWAY_URL).toBe('https://dev.hubertapp.fr/graphql');
  });

  it('should prioritize window.__RUNTIME_CONFIG__.GATEWAY_URL over VITE_AOM_API_URL (prod nginx image)', async () => {
    vi.stubEnv('VITE_AOM_API_URL', 'https://dev.hubertapp.fr/graphql');
    window.__RUNTIME_CONFIG__ = { GATEWAY_URL: 'https://prod.hubertapp.fr/graphql' };
    vi.resetModules();

    const { GATEWAY_URL } = await import('../../src/config/gatewayUrl.js');

    expect(GATEWAY_URL).toBe('https://prod.hubertapp.fr/graphql');
  });
});
