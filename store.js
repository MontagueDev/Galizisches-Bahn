import { APP_VERSION } from './data.js';

const STORAGE_KEY = 'gbahn-state';
const SCHEMA_VERSION = 2;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export const DEFAULT_STATE = Object.freeze({
  schemaVersion: SCHEMA_VERSION,
  appVersion: APP_VERSION,
  route: 'home',
  language: 'de',
  theme: 'system',
  notifications: false,
  favorites: ['GUA', 'LOW', 'KAR', 'PAZ'],
  recentSearches: [],
  tickets: [],
  activeTicketId: null,
  search: {
    fromId: 'GUA',
    toId: 'LOW',
    date: todayISO(),
    time: '09:15',
    passengers: 1,
    travelClass: '1'
  },
  ui: {
    dismissedAlerts: [],
    networkFilter: 'ALL',
    ticketFilter: 'upcoming'
  }
});

function sanitizeState(raw) {
  const base = clone(DEFAULT_STATE);
  if (!raw || typeof raw !== 'object') return base;

  const result = {
    ...base,
    ...raw,
    schemaVersion: SCHEMA_VERSION,
    appVersion: APP_VERSION,
    search: { ...base.search, ...(raw.search || {}) },
    ui: { ...base.ui, ...(raw.ui || {}) },
    favorites: Array.isArray(raw.favorites) ? raw.favorites.filter(Boolean) : base.favorites,
    recentSearches: Array.isArray(raw.recentSearches) ? raw.recentSearches.slice(0, 8) : [],
    tickets: Array.isArray(raw.tickets) ? raw.tickets.filter(ticket => ticket && ticket.id) : []
  };

  if (!['de', 'es', 'en'].includes(result.language)) result.language = 'de';
  if (!['system', 'light', 'dark'].includes(result.theme)) result.theme = 'system';
  if (!['1', '2'].includes(String(result.search.travelClass))) result.search.travelClass = '2';
  result.search.passengers = Math.min(6, Math.max(1, Number(result.search.passengers) || 1));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result.search.date)) result.search.date = todayISO();
  if (!/^\d{2}:\d{2}$/.test(result.search.time)) result.search.time = '09:15';
  return result;
}

export function loadState() {
  try {
    return sanitizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'));
  } catch {
    return clone(DEFAULT_STATE);
  }
}

export function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeState(state)));
  } catch {
    // The app remains usable when storage is unavailable (for example, restricted browser modes).
  }
}

export function resetState() {
  const fresh = clone(DEFAULT_STATE);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)); } catch {}
  return fresh;
}

export function createStore() {
  let state = loadState();
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(updater, options = {}) {
    const candidate = typeof updater === 'function' ? updater(clone(state)) : updater;
    state = sanitizeState(candidate);
    if (options.persist !== false) persistState(state);
    listeners.forEach(listener => listener(state));
    return state;
  }

  function patch(patchObject, options = {}) {
    return setState(current => ({ ...current, ...patchObject }), options);
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function reset() {
    state = resetState();
    listeners.forEach(listener => listener(state));
    return state;
  }

  return { getState, setState, patch, subscribe, reset };
}
