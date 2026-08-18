import { useEffect } from 'react';

const BASE = 'Hubert';
const BASE_DESCRIPTION = 'Votre compagnon de voyage pour organiser vos trajets et suivre l\'info trafic.';
const BASE_URL = 'https://hubertapp.fr';

function setMeta(name, content, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(path) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', `${BASE_URL}${path}`);
}

export function usePageMeta({ title, description, path = '/', noIndex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${BASE}` : `${BASE} — Votre compagnon de voyage`;
    const desc = description || BASE_DESCRIPTION;

    document.title = fullTitle;

    setMeta('description', desc);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:url', `${BASE_URL}${path}`, 'property');

    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);

    setCanonical(path);
  }, [title, description, path, noIndex]);
}
