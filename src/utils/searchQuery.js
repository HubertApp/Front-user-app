// Portage JS de `normalize_for_search()` (MS-aom-agregator, app/core/text.py).
//
// Le back refuse une recherche de moins de MIN_QUERY_LENGTH caractères
// alphanumériques normalisés, et le refus prend la forme d'une ValueError
// remontée en erreur GraphQL. Sans ce garde-fou côté front, l'utilisateur
// verrait donc un bandeau d'erreur dès la première lettre tapée : on
// reproduit la règle ici pour s'abstenir d'appeler plutôt que d'échouer.
const MIN_QUERY_LENGTH = 2;

export function normalizeForSearch(value) {
  if (!value) return '';

  return value
    .normalize('NFKD')
    // Marques diacritiques isolées par la décomposition NFKD.
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

export function isSearchableQuery(value) {
  return normalizeForSearch(value).length >= MIN_QUERY_LENGTH;
}
