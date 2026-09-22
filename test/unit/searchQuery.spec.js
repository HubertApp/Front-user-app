import { describe, it, expect } from 'vitest';
import { normalizeForSearch, isSearchableQuery } from '../../src/utils/searchQuery';

// Ces cas doivent rester alignés sur normalize_for_search() et MIN_QUERY_LENGTH
// côté MS-aom-agregator : c'est sa ValueError qu'on cherche à ne jamais
// déclencher.
describe('normalizeForSearch', () => {
  it('should lowercase and strip accents', () => {
    expect(normalizeForSearch('Place du Marché')).toBe('placedumarche');
  });

  it('should drop spaces, hyphens and punctuation', () => {
    expect(normalizeForSearch('place-du-marche')).toBe('placedumarche');
  });

  it('should return an empty string for nullish or blank input', () => {
    expect(normalizeForSearch(undefined)).toBe('');
    expect(normalizeForSearch('   ')).toBe('');
  });
});

describe('isSearchableQuery', () => {
  it('should reject a query with fewer than 2 alphanumeric characters', () => {
    expect(isSearchableQuery('G')).toBe(false);
    expect(isSearchableQuery('é')).toBe(false);
    expect(isSearchableQuery('- ')).toBe(false);
  });

  it('should accept a query with 2 alphanumeric characters or more', () => {
    expect(isSearchableQuery('Ga')).toBe(true);
    expect(isSearchableQuery('é-e')).toBe(true);
  });
});
