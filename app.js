import {
  APP_VERSION,
  APP_BUILD,
  STATIONS,
  NETWORK_LINES,
  COPY,
  SERVICE_ALERTS,
  getStation,
  findStationByName,
  searchStations
} from './data.js';
import { createStore } from './store.js';

const store = createStore();
const mainView = document.getElementById('mainView');
const modalRoot = document.getElementById('modalRoot');
const toastRoot = document.getElementById('toastRoot');
const updateBanner = document.getElementById('updateBanner');
const installButton = document.getElementById('installButton');
const networkStatus = document.getElementById('networkStatus');

let currentResults = [];
let resultFilter = 'all';
let selectedJourney = null;
let selectedFare = 'flex';
let liveTimer = null;
let modalReturnFocus = null;
let deferredInstallPrompt = null;
let newServiceWorker = null;

const DATE_LOCALES = { de: 'de-DE', es: 'es-MX', en: 'en-GB' };

function state() {
  return store.getState();
}

function t(key, variables = {}) {
  const language = state().language;
  let value = COPY[language]?.[key] ?? COPY.de[key] ?? key;
  for (const [name, replacement] of Object.entries(variables)) {
    value = value.replaceAll(`{${name}}`, String(replacement));
  }
  return value;
}

function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function icon(name, size = 22, strokeWidth = 1.9) {
  const paths = {
    home: '<path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    network: '<path d="M4 6.5 9 3l6 3.5L20 3v14.5L15 21l-6-3.5L4 21Z"/><path d="M9 3v14.5M15 6.5V21"/>',
    ticket: '<path d="M4 5h16v4a3 3 0 0 0 0 6v4H4v-4a3 3 0 0 0 0-6Z"/><path d="M12 7v2m0 2v2m0 2v2"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
    install: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 19v2h16v-2"/>',
    swap: '<path d="M7 7h11l-3-3"/><path d="m18 7-3 3"/><path d="M17 17H6l3 3"/><path d="m6 17 3-3"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
    starFill: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" fill="currentColor"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    alert: '<path d="M12 3 2.8 20h18.4Z"/><path d="M12 9v5m0 3h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
    train: '<rect x="5" y="3" width="14" height="15" rx="4"/><path d="M8 7h8M7 14h10M8 21l2-3m6 3-2-3"/><circle cx="9" cy="11" r="1" fill="currentColor"/><circle cx="15" cy="11" r="1" fill="currentColor"/>',
    live: '<circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M8.5 8.5a5 5 0 0 0 0 7m7-7a5 5 0 0 1 0 7"/><path d="M5.5 5.5a9 9 0 0 0 0 13m13-13a9 9 0 0 1 0 13"/>',
    arrowRight: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    share: '<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5m-8 7 8 5"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    reset: '<path d="M4 8V3m0 0h5M4 3l4 4a8 8 0 1 1-2 9"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    wifiOff: '<path d="m2 8 4.5 4.5M22 8a16 16 0 0 0-11.4-4.6M5 5a16 16 0 0 0-3 3m5.5 7.5A6.5 6.5 0 0 1 12 14c1.2 0 2.4.3 3.3.9M9.5 18.5A3.5 3.5 0 0 1 12 17c.7 0 1.3.2 1.8.5M12 22h.01M3 3l18 18"/>',
    mapPin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0m2-13a3 3 0 0 1 0 6m4 7a5 5 0 0 0-5-5"/>',
    seat: '<path d="M7 3v9h9a4 4 0 0 1 4 4v3H7a3 3 0 0 1-3-3V8"/><path d="M7 19v2m11-2v2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    route: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h3a3 3 0 0 1 3 3v6a3 3 0 0 0 3 3"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    wallet: '<path d="M4 6h14a2 2 0 0 1 2 2v11H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h11"/><path d="M15 11h6v5h-6a2.5 2.5 0 0 1 0-5Z"/>',
    external: '<path d="M14 4h6v6M10 14 20 4M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/>'
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.info}</svg>`;
}

function setStaticIcons() {
  document.querySelectorAll('[data-icon]').forEach(element => {
    element.innerHTML = icon(element.dataset.icon);
  });
  installButton.innerHTML = icon('install', 20);
}

function setStaticCopy() {
  document.documentElement.lang = state().language;
  document.querySelectorAll('[data-copy]').forEach(element => {
    element.textContent = t(element.dataset.copy);
  });
}

function applyTheme() {
  const theme = state().theme;
  const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#19191d' : '#7e1731');
}

function formatDate(dateString, options = { weekday: 'short', day: '2-digit', month: 'short' }) {
  return new Intl.DateTimeFormat(DATE_LOCALES[state().language], options).format(new Date(`${dateString}T12:00:00`));
}

function formatDateLong(dateString) {
  return formatDate(dateString, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

function dateAt(dateString, timeString) {
  return new Date(`${dateString}T${timeString}:00`);
}

function addMinutes(timeString, minutes) {
  const [hours, minutesPart] = timeString.split(':').map(Number);
  const total = ((hours * 60 + minutesPart + minutes) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function durationLabel(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours} h ${String(mins).padStart(2, '0')} min` : `${mins} min`;
}

function seededNumber(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seedText) {
  let value = seededNumber(seedText) || 1;
  return () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (value >>> 0) / 4294967296;
  };
}

function distanceBetween(first, second) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function pointLineDistance(point, from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return distanceBetween(point, from);
  const projection = Math.max(0, Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSquared));
  const projected = { x: from.x + projection * dx, y: from.y + projection * dy };
  return distanceBetween(point, projected);
}

function normalizeRoute(route) {
  const allowed = ['home', 'search', 'network', 'tickets', 'profile'];
  return allowed.includes(route) ? route : 'home';
}

function routeFromHash() {
  return normalizeRoute(location.hash.replace(/^#\/?/, '').split('?')[0]);
}

function navigate(route, options = {}) {
  const normalized = normalizeRoute(route);
  store.setState(current => ({ ...current, route: normalized }));
  const hash = `#/${normalized}`;
  if (location.hash !== hash) {
    if (options.replace) history.replaceState(null, '', hash);
    else location.hash = hash;
  } else {
    renderRoute(normalized, options);
  }
}

function renderRoute(route, options = {}) {
  stopLiveTimer();
  closeSuggestions();
  document.querySelectorAll('.nav-button').forEach(button => {
    button.classList.toggle('active', button.dataset.route === route);
    button.setAttribute('aria-current', button.dataset.route === route ? 'page' : 'false');
  });

  if (route === 'home') renderHome();
  else if (route === 'search') renderSearch(options);
  else if (route === 'network') renderNetwork();
  else if (route === 'tickets') renderTickets();
  else if (route === 'profile') renderProfile();

  window.scrollTo({ top: 0, behavior: options.instant ? 'auto' : 'smooth' });
  mainView.focus({ preventScroll: true });
}

function activeTicket() {
  const current = state();
  return current.tickets.find(ticket => ticket.id === current.activeTicketId) || current.tickets[0] || null;
}

function demoJourney() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: 'DEMO-ICE-102',
    train: 'ICE 102',
    type: 'ICE',
    fromId: 'GUA',
    toId: 'LOW',
    from: getStation('GUA').name,
    to: getStation('LOW').name,
    date: today,
    departure: '09:15',
    arrival: '10:58',
    duration: 103,
    delay: 0,
    platform: '4',
    coach: '5',
    seat: '18A',
    price: 89,
    distance: 342,
    travelClass: '1',
    changes: 0,
    intermediate: ['ELB', 'MAR']
  };
}

function renderHome() {
  const current = state();
  const ticket = activeTicket();
  const journey = ticket || demoJourney();
  const visibleAlerts = SERVICE_ALERTS.filter(alert => !current.ui.dismissedAlerts.includes(alert.id));

  mainView.innerHTML = `
    <section class="page-header">
      <p class="eyebrow">GBahn ${escapeHTML(APP_VERSION)}</p>
      <h1>${escapeHTML(t('greeting'))}, David.</h1>
      <p class="subtitle">${escapeHTML(t('tagline'))}</p>
    </section>

    ${renderHero(journey, Boolean(ticket))}

    <section class="section">
      <div class="quick-grid">
        ${quickAction('search', 'search', t('searchConnection'))}
        ${quickAction('network', 'network', t('railNetwork'))}
        ${quickAction('tickets', 'ticket', t('myTickets'))}
        ${quickAction('live', 'live', t('openLive'))}
      </div>
    </section>

    <section class="section">
      <div class="section-heading">
        <h2>${escapeHTML(t('favorites'))}</h2>
        <button class="text-button" type="button" data-nav="network">${escapeHTML(t('seeAll'))}</button>
      </div>
      <div class="station-list">
        ${current.favorites.slice(0, 4).map(id => stationRow(getStation(id))).join('')}
      </div>
    </section>

    ${visibleAlerts.length ? `
      <section class="section">
        <div class="section-heading"><h2>${escapeHTML(t('serviceUpdates'))}</h2></div>
        <div class="notice-list">
          ${visibleAlerts.map(renderNotice).join('')}
        </div>
      </section>
    ` : ''}
  `;

  bindPageNavigation();
  bindStationRows();
  bindFavoriteButtons();
  document.querySelectorAll('[data-quick]').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.quick;
      if (action === 'live') openLiveTracking(activeTicket() || demoJourney());
      else navigate(action);
    });
  });
  document.querySelectorAll('[data-dismiss-alert]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.dismissAlert;
      store.setState(currentState => ({
        ...currentState,
        ui: { ...currentState.ui, dismissedAlerts: [...new Set([...currentState.ui.dismissedAlerts, id])] }
      }));
      renderHome();
    });
  });
  document.querySelector('[data-open-live]')?.addEventListener('click', () => openLiveTracking(journey));
  document.querySelector('[data-open-ticket]')?.addEventListener('click', () => ticket && openTicket(ticket));
}

function renderHero(journey, hasTicket) {
  const status = journey.delay ? `+${journey.delay} min` : t('onTime');
  return `
    <article class="hero-card">
      <div class="hero-top">
        <span class="badge badge-glass">${escapeHTML(journey.train)}</span>
        <span class="status-badge ${journey.delay ? 'delay' : 'on-time'}">${escapeHTML(status)}</span>
      </div>
      <h2>${escapeHTML(hasTicket ? t('activeTrip') : t('nextJourney'))}</h2>
      <div class="hero-route">
        <div>
          <strong>${escapeHTML(journey.departure)}</strong>
          <small>${escapeHTML(journey.from)}</small>
        </div>
        <div class="route-track"></div>
        <div style="text-align:right">
          <strong>${escapeHTML(journey.arrival)}</strong>
          <small>${escapeHTML(journey.to)}</small>
        </div>
      </div>
      <div class="hero-footer">
        <span>${escapeHTML(t('platform'))} ${escapeHTML(journey.platform)}${journey.coach ? ` · ${escapeHTML(t('coach'))} ${escapeHTML(journey.coach)} · ${escapeHTML(t('seat'))} ${escapeHTML(journey.seat)}` : ''}</span>
        <button class="text-button hero-link" type="button" ${hasTicket ? 'data-open-ticket' : 'data-open-live'}>${escapeHTML(hasTicket ? t('openTicket') : t('openLive'))}</button>
      </div>
    </article>
  `;
}

function quickAction(action, iconName, label) {
  return `<button class="quick-action" type="button" data-quick="${escapeHTML(action)}"><span class="quick-action-icon">${icon(iconName, 20)}</span><strong>${escapeHTML(label)}</strong></button>`;
}

function renderNotice(alert) {
  const iconName = alert.severity === 'warning' ? 'alert' : 'info';
  return `
    <article class="card notice-card ${escapeHTML(alert.severity)}">
      <span class="notice-icon">${icon(iconName, 19)}</span>
      <div><h3>${escapeHTML(t(alert.titleKey))}</h3><p>${escapeHTML(t(alert.textKey))}</p></div>
      <button class="notice-dismiss" type="button" data-dismiss-alert="${escapeHTML(alert.id)}" aria-label="${escapeHTML(t('close'))}">${icon('close', 17)}</button>
    </article>
  `;
}

function stationRow(station) {
  if (!station) return '';
  const favorite = state().favorites.includes(station.id);
  return `
    <article class="card station-row">
      <button class="station-action" type="button" data-station="${escapeHTML(station.id)}">
        <span class="station-code">${escapeHTML(station.id)}</span>
        <span class="station-copy"><strong>${escapeHTML(station.name)}</strong><small>${escapeHTML(station.region)} · ${station.platforms} ${escapeHTML(t('platform'))}</small></span>
        <span aria-hidden="true">${icon('chevronRight', 18)}</span>
      </button>
      <button class="favorite-button ${favorite ? 'active' : ''}" type="button" data-favorite="${escapeHTML(station.id)}" aria-label="${escapeHTML(t('favorites'))}">${icon(favorite ? 'starFill' : 'star', 19)}</button>
    </article>
  `;
}

function bindStationRows(root = document) {
  root.querySelectorAll('[data-station]').forEach(button => {
    button.addEventListener('click', () => openStation(getStation(button.dataset.station)));
  });
}

function bindFavoriteButtons(root = document) {
  root.querySelectorAll('[data-favorite]').forEach(button => {
    button.addEventListener('click', () => {
      const stationId = button.dataset.favorite;
      const wasFavorite = state().favorites.includes(stationId);
      store.setState(current => ({
        ...current,
        favorites: wasFavorite ? current.favorites.filter(id => id !== stationId) : [...current.favorites, stationId]
      }));
      button.classList.toggle('active', !wasFavorite);
      button.innerHTML = icon(!wasFavorite ? 'starFill' : 'star', 19);
      toast(t(wasFavorite ? 'favoriteRemoved' : 'favoriteAdded'));
    });
  });
}

function renderSearch(options = {}) {
  const search = state().search;
  const from = getStation(search.fromId) || getStation('GUA');
  const to = getStation(search.toId) || getStation('LOW');

  mainView.innerHTML = `
    <section class="page-header">
      <p class="eyebrow">${escapeHTML(t('navSearch'))}</p>
      <h1>${escapeHTML(t('searchConnection'))}</h1>
      <p class="subtitle">ICE, IC, RE, S-Bahn und Küstenbahn.</p>
    </section>

    <article class="card search-panel">
      <form id="journeyForm" class="form-stack" novalidate>
        ${stationInput('from', t('from'), from)}
        <button id="swapButton" class="swap-button" type="button" aria-label="${escapeHTML(t('swap'))}">${icon('swap', 20)}</button>
        ${stationInput('to', t('to'), to)}

        <div class="two-columns">
          <label class="field"><span class="field-label">${escapeHTML(t('date'))}</span><span class="field-control"><input id="travelDate" type="date" value="${escapeHTML(search.date)}" required></span></label>
          <label class="field"><span class="field-label">${escapeHTML(t('time'))}</span><span class="field-control"><input id="travelTime" type="time" value="${escapeHTML(search.time)}" required></span></label>
        </div>

        <div class="two-columns">
          <label class="field"><span class="field-label">${escapeHTML(t('passengers'))}</span><span class="field-control"><select id="passengerCount">${[1,2,3,4,5,6].map(count => `<option value="${count}" ${Number(search.passengers) === count ? 'selected' : ''}>${escapeHTML(count === 1 ? t('onePassenger') : t('passengersCount', { count }))}</option>`).join('')}</select><span class="select-chevron">${icon('chevronDown', 18)}</span></span></label>
          <label class="field"><span class="field-label">${escapeHTML(t('travelClass'))}</span><span class="field-control"><select id="travelClass"><option value="2" ${search.travelClass === '2' ? 'selected' : ''}>${escapeHTML(t('secondClass'))}</option><option value="1" ${search.travelClass === '1' ? 'selected' : ''}>${escapeHTML(t('firstClass'))}</option></select><span class="select-chevron">${icon('chevronDown', 18)}</span></span></label>
        </div>

        <button class="primary-button full" type="submit">${escapeHTML(t('search'))}</button>
      </form>
    </article>

    <section id="resultsSection" class="section" ${options.showResults || currentResults.length ? '' : 'hidden'}>
      <div class="section-heading"><h2>${escapeHTML(t('connections'))}</h2><span id="resultsCount" class="muted small"></span></div>
      <div class="filter-row" id="resultFilters">
        ${filterChip('all', t('all'))}
        ${filterChip('direct', t('direct'))}
        ${filterChip('fastest', t('fastest'))}
        ${filterChip('cheapest', t('cheapest'))}
      </div>
      <div id="resultsList" class="results-list"></div>
    </section>

    ${state().recentSearches.length ? `
      <section class="section">
        <div class="section-heading"><h2>${escapeHTML(t('recentSearches'))}</h2></div>
        <div class="station-list">
          ${state().recentSearches.slice(0, 4).map((recent, index) => {
            const recentFrom = getStation(recent.fromId);
            const recentTo = getStation(recent.toId);
            if (!recentFrom || !recentTo) return '';
            return `<article class="card station-row"><button class="station-action" type="button" data-recent="${index}"><span class="station-code">${icon('route', 18)}</span><span class="station-copy"><strong>${escapeHTML(recentFrom.city)} → ${escapeHTML(recentTo.city)}</strong><small>${escapeHTML(formatDate(recent.date))} · ${escapeHTML(recent.time)}</small></span><span>${icon('chevronRight', 18)}</span></button></article>`;
          }).join('')}
        </div>
      </section>
    ` : ''}
  `;

  setupAutocomplete('from', from);
  setupAutocomplete('to', to);

  document.getElementById('swapButton').addEventListener('click', () => {
    const fromInput = document.getElementById('fromInput');
    const toInput = document.getElementById('toInput');
    const oldFromId = fromInput.dataset.stationId;
    const oldFromValue = fromInput.value;
    fromInput.dataset.stationId = toInput.dataset.stationId;
    fromInput.value = toInput.value;
    toInput.dataset.stationId = oldFromId;
    toInput.value = oldFromValue;
  });

  document.getElementById('journeyForm').addEventListener('submit', event => {
    event.preventDefault();
    performSearch();
  });

  document.querySelectorAll('[data-result-filter]').forEach(button => {
    button.addEventListener('click', () => {
      resultFilter = button.dataset.resultFilter;
      document.querySelectorAll('[data-result-filter]').forEach(chip => chip.classList.toggle('active', chip.dataset.resultFilter === resultFilter));
      renderResultList();
    });
  });

  document.querySelectorAll('[data-recent]').forEach(button => {
    button.addEventListener('click', () => {
      const recent = state().recentSearches[Number(button.dataset.recent)];
      if (!recent) return;
      store.setState(current => ({ ...current, search: { ...current.search, ...recent } }));
      currentResults = generateJourneys(recent);
      renderSearch({ showResults: true });
      requestAnimationFrame(() => document.getElementById('resultsSection')?.scrollIntoView({ behavior: 'smooth' }));
    });
  });

  if (options.showResults && !currentResults.length) currentResults = generateJourneys(search);
  if (currentResults.length) renderResultList();
}

function stationInput(prefix, label, station) {
  return `
    <label class="field autocomplete">
      <span class="field-label">${escapeHTML(label)}</span>
      <span class="field-control"><input id="${prefix}Input" type="text" value="${escapeHTML(station.name)}" data-station-id="${escapeHTML(station.id)}" autocomplete="off" autocapitalize="words" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${prefix}Suggestions" required></span>
      <div id="${prefix}Suggestions" class="suggestions" role="listbox" hidden></div>
    </label>
  `;
}

function filterChip(value, label) {
  return `<button class="chip ${resultFilter === value ? 'active' : ''}" type="button" data-result-filter="${escapeHTML(value)}">${escapeHTML(label)}</button>`;
}

function setupAutocomplete(prefix, initialStation) {
  const input = document.getElementById(`${prefix}Input`);
  const suggestionBox = document.getElementById(`${prefix}Suggestions`);
  let activeIndex = -1;
  let suggestions = [];

  const renderSuggestions = () => {
    suggestions = searchStations(input.value, 8);
    activeIndex = -1;
    suggestionBox.innerHTML = suggestions.length
      ? suggestions.map((station, index) => `<button class="suggestion-row" type="button" role="option" data-suggestion-index="${index}" aria-selected="false"><span class="suggestion-dot"></span><span class="suggestion-copy"><strong>${escapeHTML(station.name)}</strong><small>${escapeHTML(station.city)} · ${escapeHTML(station.region)} · ${escapeHTML(station.id)}</small></span></button>`).join('')
      : `<div class="suggestions-empty">${escapeHTML(t('noMatches'))}</div>`;
    suggestionBox.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    suggestionBox.querySelectorAll('[data-suggestion-index]').forEach(button => {
      button.addEventListener('mousedown', event => event.preventDefault());
      button.addEventListener('click', () => selectSuggestion(Number(button.dataset.suggestionIndex)));
    });
  };

  const selectSuggestion = index => {
    const station = suggestions[index];
    if (!station) return;
    input.value = station.name;
    input.dataset.stationId = station.id;
    input.setAttribute('aria-invalid', 'false');
    suggestionBox.hidden = true;
    input.setAttribute('aria-expanded', 'false');
  };

  const setActive = index => {
    activeIndex = Math.max(-1, Math.min(index, suggestions.length - 1));
    suggestionBox.querySelectorAll('[data-suggestion-index]').forEach((button, buttonIndex) => {
      button.setAttribute('aria-selected', buttonIndex === activeIndex ? 'true' : 'false');
      if (buttonIndex === activeIndex) button.scrollIntoView({ block: 'nearest' });
    });
  };

  input.addEventListener('focus', renderSuggestions);
  input.addEventListener('input', () => {
    input.dataset.stationId = '';
    input.setAttribute('aria-invalid', 'false');
    renderSuggestions();
  });
  input.addEventListener('keydown', event => {
    if (suggestionBox.hidden && ['ArrowDown', 'ArrowUp'].includes(event.key)) renderSuggestions();
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive(activeIndex + 1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive(activeIndex <= 0 ? suggestions.length - 1 : activeIndex - 1); }
    else if (event.key === 'Enter' && !suggestionBox.hidden && activeIndex >= 0) { event.preventDefault(); selectSuggestion(activeIndex); }
    else if (event.key === 'Escape') { suggestionBox.hidden = true; input.setAttribute('aria-expanded', 'false'); }
  });
  input.addEventListener('blur', () => {
    setTimeout(() => {
      const exact = findStationByName(input.value);
      if (exact) {
        input.dataset.stationId = exact.id;
        input.value = exact.name;
        input.setAttribute('aria-invalid', 'false');
      } else if (!input.dataset.stationId) {
        input.dataset.stationId = initialStation.id;
        input.value = initialStation.name;
      }
      suggestionBox.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }, 90);
  });
}

function closeSuggestions() {
  document.querySelectorAll('.suggestions').forEach(box => { box.hidden = true; });
  document.querySelectorAll('[role="combobox"]').forEach(input => input.setAttribute('aria-expanded', 'false'));
}

function performSearch() {
  const fromInput = document.getElementById('fromInput');
  const toInput = document.getElementById('toInput');
  const fromId = fromInput.dataset.stationId || findStationByName(fromInput.value)?.id;
  const toId = toInput.dataset.stationId || findStationByName(toInput.value)?.id;

  if (!fromId) fromInput.setAttribute('aria-invalid', 'true');
  if (!toId) toInput.setAttribute('aria-invalid', 'true');
  if (!fromId || !toId) {
    toast(t('chooseStation'));
    return;
  }
  if (fromId === toId) {
    fromInput.setAttribute('aria-invalid', 'true');
    toInput.setAttribute('aria-invalid', 'true');
    toast(t('invalidRoute'));
    return;
  }

  const search = {
    fromId,
    toId,
    date: document.getElementById('travelDate').value,
    time: document.getElementById('travelTime').value,
    passengers: Number(document.getElementById('passengerCount').value),
    travelClass: document.getElementById('travelClass').value
  };
  currentResults = generateJourneys(search);
  resultFilter = 'all';
  store.setState(current => ({
    ...current,
    search,
    recentSearches: [search, ...current.recentSearches.filter(item => JSON.stringify(item) !== JSON.stringify(search))].slice(0, 8)
  }));
  document.getElementById('resultsSection').hidden = false;
  document.querySelectorAll('[data-result-filter]').forEach(chip => chip.classList.toggle('active', chip.dataset.resultFilter === 'all'));
  renderResultList();
  document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generateJourneys(search) {
  const from = getStation(search.fromId);
  const to = getStation(search.toId);
  if (!from || !to) return [];
  const rand = seededRandom(`${from.id}-${to.id}-${search.date}-${search.time}`);
  const networkDistance = Math.max(62, Math.round(distanceBetween(from, to) * 2.12));
  const hubs = from.lines.includes('ICE') && to.lines.includes('ICE');
  const baseDuration = Math.max(42, Math.round(networkDistance / (hubs ? 2.75 : 2.25)));
  const basePrice = Math.max(24, Math.round(networkDistance * .205));
  const passengerFactor = Number(search.passengers || 1);
  const classFactor = String(search.travelClass) === '1' ? 1.48 : 1;
  const specs = [
    { type: hubs ? 'ICE' : 'IC', offset: 0, duration: baseDuration, changes: 0, multiplier: 1.14, number: 102 },
    { type: 'IC', offset: 27 + Math.round(rand() * 5), duration: baseDuration + 24, changes: 0, multiplier: .88, number: 604 },
    { type: 'RE', offset: 51 + Math.round(rand() * 8), duration: baseDuration + 54, changes: 1, multiplier: .64, number: 7412 },
    { type: hubs ? 'ICE' : 'IC', offset: 86 + Math.round(rand() * 9), duration: baseDuration + 8, changes: 0, multiplier: 1.04, number: 208 },
    { type: 'IC', offset: 126 + Math.round(rand() * 10), duration: baseDuration + 31, changes: 1, multiplier: .79, number: 618 },
    { type: 'RE', offset: 171 + Math.round(rand() * 12), duration: baseDuration + 67, changes: 2, multiplier: .58, number: 7438 }
  ];

  return specs.map((spec, index) => {
    const delayRoll = rand();
    const delay = delayRoll > .78 ? 4 + Math.floor(rand() * 9) : 0;
    const departure = addMinutes(search.time, spec.offset);
    const arrival = addMinutes(departure, spec.duration + delay);
    const price = Math.round(basePrice * spec.multiplier * classFactor * passengerFactor);
    const intermediate = nearestIntermediateStops(from, to, spec.changes ? 3 : 2, index);
    return {
      id: `J-${seededNumber(`${from.id}${to.id}${search.date}${departure}${index}`).toString(36).toUpperCase()}`,
      train: `${spec.type} ${spec.number + (seededNumber(from.id + to.id) % 20)}`,
      type: spec.type,
      fromId: from.id,
      toId: to.id,
      from: from.name,
      to: to.name,
      date: search.date,
      departure,
      arrival,
      duration: spec.duration,
      delay,
      changes: spec.changes,
      platform: String(1 + ((spec.number + index + seededNumber(from.id)) % Math.min(12, from.platforms))),
      price,
      basePrice,
      distance: networkDistance,
      travelClass: String(search.travelClass),
      passengers: passengerFactor,
      intermediate
    };
  });
}

function nearestIntermediateStops(from, to, count, variant) {
  return STATIONS
    .filter(station => station.id !== from.id && station.id !== to.id)
    .map(station => ({ station, score: pointLineDistance(station, from, to) + ((seededNumber(station.id + variant) % 12) / 5) }))
    .sort((first, second) => first.score - second.score)
    .slice(0, count)
    .map(item => item.station.id)
    .sort((firstId, secondId) => distanceBetween(from, getStation(firstId)) - distanceBetween(from, getStation(secondId)));
}

function filteredResults() {
  const list = [...currentResults];
  if (resultFilter === 'direct') return list.filter(journey => journey.changes === 0);
  if (resultFilter === 'fastest') return list.sort((a, b) => a.duration - b.duration);
  if (resultFilter === 'cheapest') return list.sort((a, b) => a.price - b.price);
  return list;
}

function renderResultList() {
  const container = document.getElementById('resultsList');
  const count = document.getElementById('resultsCount');
  if (!container || !count) return;
  const results = filteredResults();
  count.textContent = t('connectionFound', { count: results.length });
  container.innerHTML = results.map(journey => `
    <button class="result-card" type="button" data-journey="${escapeHTML(journey.id)}">
      <span class="result-head"><span class="line-badge ${escapeHTML(journey.type)}">${escapeHTML(journey.train)}</span><span class="result-status ${journey.delay ? 'delay' : ''}">${escapeHTML(journey.delay ? `+${journey.delay} min` : t('onTime'))}</span></span>
      <span class="result-route">
        <span><time>${escapeHTML(journey.departure)}</time><small>${escapeHTML(journey.from)}</small></span>
        <span class="route-track"></span>
        <span style="text-align:right"><time>${escapeHTML(journey.arrival)}</time><small>${escapeHTML(journey.to)}</small></span>
      </span>
      <span class="result-footer"><span>${escapeHTML(durationLabel(journey.duration))} · ${journey.changes ? `${journey.changes} ${escapeHTML(t('changes'))}` : escapeHTML(t('direct'))} · ${escapeHTML(t('platform'))} ${escapeHTML(journey.platform)}</span><span class="result-price"><strong>${journey.price} GM</strong>${escapeHTML(journey.travelClass === '1' ? t('firstClass') : t('secondClass'))}</span></span>
    </button>
  `).join('');
  container.querySelectorAll('[data-journey]').forEach(button => {
    button.addEventListener('click', () => {
      const journey = currentResults.find(item => item.id === button.dataset.journey);
      if (journey) openJourneyDetails(journey);
    });
  });
}

function openJourneyDetails(journey) {
  selectedJourney = journey;
  selectedFare = 'flex';
  const stops = buildTimeline(journey);
  const saverPrice = Math.max(19, journey.price - Math.max(12, Math.round(journey.price * .18)));
  showModal(t('journeyDetails'), `
    <article>
      <div class="result-head"><span class="line-badge ${escapeHTML(journey.type)}">${escapeHTML(journey.train)}</span><span class="result-status ${journey.delay ? 'delay' : ''}">${escapeHTML(journey.delay ? `+${journey.delay} min` : t('onTime'))}</span></div>
      <div class="timeline">
        ${stops.map(stop => `<div class="timeline-stop"><time class="timeline-time">${escapeHTML(stop.time)}</time><span class="timeline-track"><span class="timeline-dot"></span></span><span class="timeline-copy"><strong>${escapeHTML(stop.station.name)}</strong><small>${escapeHTML(stop.note)}</small></span></div>`).join('')}
      </div>
      <h3>${escapeHTML(t('fare'))}</h3>
      <div class="fare-list">
        <button class="fare-option active" type="button" data-fare="flex"><strong>${escapeHTML(t('flexFare'))}</strong><small>${escapeHTML(t('flexibleFareDesc'))}</small><span class="fare-price">${journey.price} GM</span></button>
        <button class="fare-option" type="button" data-fare="saver"><strong>${escapeHTML(t('saverFare'))}</strong><small>${escapeHTML(t('saverFareDesc'))}</small><span class="fare-price">${saverPrice} GM</span></button>
      </div>
      <div class="inline-actions"><button id="routeFavoriteButton" class="ghost-button" type="button">${icon('star', 18)} ${escapeHTML(t('favorites'))}</button><button id="bookButton" class="primary-button" type="button">${escapeHTML(t('bookFor', { price: journey.price }))}</button></div>
    </article>
  `);

  document.querySelectorAll('[data-fare]').forEach(button => {
    button.addEventListener('click', () => {
      selectedFare = button.dataset.fare;
      document.querySelectorAll('[data-fare]').forEach(option => option.classList.toggle('active', option === button));
      document.getElementById('bookButton').textContent = t('bookFor', { price: selectedFare === 'saver' ? saverPrice : journey.price });
    });
  });
  document.getElementById('routeFavoriteButton').addEventListener('click', () => {
    store.setState(current => ({ ...current, favorites: [...new Set([...current.favorites, journey.fromId, journey.toId])] }));
    toast(t('saved'));
  });
  document.getElementById('bookButton').addEventListener('click', () => bookJourney(journey, selectedFare, saverPrice));
}

function buildTimeline(journey) {
  const stationIds = [journey.fromId, ...journey.intermediate, journey.toId];
  return stationIds.map((stationId, index) => {
    const ratio = index / (stationIds.length - 1);
    const time = addMinutes(journey.departure, Math.round(journey.duration * ratio) + (index === stationIds.length - 1 ? journey.delay : 0));
    let note = t('intermediateStop');
    if (index === 0) note = `${t('platform')} ${journey.platform}`;
    else if (index === stationIds.length - 1) note = journey.delay ? `+${journey.delay} min` : t('onTime');
    else if (journey.changes && index === Math.ceil((stationIds.length - 1) / 2)) note = t('recommendedChange');
    return { station: getStation(stationId), time, note };
  });
}

function bookJourney(journey, fare, saverPrice) {
  const price = fare === 'saver' ? saverPrice : journey.price;
  const seed = seededNumber(`${journey.id}-${Date.now()}`);
  const ticket = {
    ...journey,
    id: `GBT-${Date.now().toString(36).toUpperCase()}-${(seed % 10000).toString().padStart(4, '0')}`,
    fare,
    price,
    coach: String(2 + (seed % 7)),
    seat: `${10 + (seed % 49)}${['A','B','C','D'][seed % 4]}`,
    passenger: 'David J. Martínez',
    bookedAt: new Date().toISOString()
  };
  store.setState(current => ({ ...current, tickets: [ticket, ...current.tickets], activeTicketId: ticket.id }));
  closeModal();
  toast(t('ticketBooked'));
  navigate('tickets');
}

function renderTickets() {
  const current = state();
  const filter = current.ui.ticketFilter;
  const now = new Date();
  const upcoming = current.tickets.filter(ticket => dateAt(ticket.date, ticket.arrival) >= now || ticket.date === now.toISOString().slice(0, 10));
  const past = current.tickets.filter(ticket => !upcoming.includes(ticket));
  const tickets = filter === 'past' ? past : upcoming;

  mainView.innerHTML = `
    <section class="page-header"><p class="eyebrow">${escapeHTML(t('navTickets'))}</p><h1>${escapeHTML(t('myTickets'))}</h1><p class="subtitle">${escapeHTML(t('storageLocal'))}</p></section>
    <div class="filter-row"><button class="chip ${filter === 'upcoming' ? 'active' : ''}" type="button" data-ticket-filter="upcoming">${escapeHTML(t('upcoming'))}</button><button class="chip ${filter === 'past' ? 'active' : ''}" type="button" data-ticket-filter="past">${escapeHTML(t('past'))}</button></div>
    ${tickets.length ? `<div class="results-list">${tickets.map(ticketSummary).join('')}</div>` : `<article class="card empty-state"><span class="empty-icon">${icon('ticket', 32)}</span><h2>${escapeHTML(t('noTickets'))}</h2><p>${escapeHTML(t('noTicketsDesc'))}</p><button class="primary-button" type="button" data-nav="search">${escapeHTML(t('searchConnection'))}</button></article>`}
  `;

  bindPageNavigation();
  document.querySelectorAll('[data-ticket-filter]').forEach(button => {
    button.addEventListener('click', () => {
      store.setState(currentState => ({ ...currentState, ui: { ...currentState.ui, ticketFilter: button.dataset.ticketFilter } }));
      renderTickets();
    });
  });
  document.querySelectorAll('[data-ticket-id]').forEach(button => {
    button.addEventListener('click', () => {
      const ticket = state().tickets.find(item => item.id === button.dataset.ticketId);
      if (ticket) openTicket(ticket);
    });
  });
}

function ticketSummary(ticket) {
  return `
    <button class="result-card" type="button" data-ticket-id="${escapeHTML(ticket.id)}">
      <span class="ticket-head"><span class="line-badge ${escapeHTML(ticket.type)}">${escapeHTML(ticket.train)}</span><span class="ticket-brand">${ticket.price} GM</span></span>
      <span class="ticket-route"><span><time>${escapeHTML(ticket.departure)}</time><small>${escapeHTML(ticket.from)}</small></span><span class="ticket-arrow">${icon('arrowRight', 24)}</span><span style="text-align:right"><time>${escapeHTML(ticket.arrival)}</time><small>${escapeHTML(ticket.to)}</small></span></span>
      <span class="result-footer"><span>${escapeHTML(formatDate(ticket.date))}</span><span>${escapeHTML(t('coach'))} ${escapeHTML(ticket.coach)} · ${escapeHTML(t('seat'))} ${escapeHTML(ticket.seat)}</span></span>
    </button>
  `;
}

function openTicket(ticket) {
  showModal(t('digitalTicket'), `
    <article class="ticket-card">
      <div class="ticket-head"><span class="ticket-brand">GALIZISCHES BAHN</span><span class="line-badge ${escapeHTML(ticket.type)}">${escapeHTML(ticket.train)}</span></div>
      <div class="ticket-route"><span><time>${escapeHTML(ticket.departure)}</time><small>${escapeHTML(ticket.from)}</small></span><span class="ticket-arrow">${icon('arrowRight', 24)}</span><span style="text-align:right"><time>${escapeHTML(ticket.arrival)}</time><small>${escapeHTML(ticket.to)}</small></span></div>
      <div class="ticket-meta">
        <div><small>${escapeHTML(t('date'))}</small><strong>${escapeHTML(formatDate(ticket.date))}</strong></div>
        <div><small>${escapeHTML(t('coach'))}</small><strong>${escapeHTML(ticket.coach)}</strong></div>
        <div><small>${escapeHTML(t('seat'))}</small><strong>${escapeHTML(ticket.seat)}</strong></div>
        <div><small>${escapeHTML(t('travelClass'))}</small><strong>${escapeHTML(ticket.travelClass === '1' ? t('firstClass') : t('secondClass'))}</strong></div>
        <div><small>${escapeHTML(t('platform'))}</small><strong>${escapeHTML(ticket.platform)}</strong></div>
        <div><small>${escapeHTML(t('price'))}</small><strong>${escapeHTML(ticket.price)} GM</strong></div>
      </div>
      <div class="matrix-wrap"><canvas id="securityMatrix" class="security-matrix" width="210" height="210" aria-label="${escapeHTML(t('validationCode'))}"></canvas></div>
      <p class="ticket-id">${escapeHTML(ticket.id)}</p>
      <div class="inline-actions"><button id="deleteTicket" class="ghost-button" type="button">${icon('trash', 17)} ${escapeHTML(t('delete'))}</button><button id="shareTicket" class="ghost-button" type="button">${icon('share', 17)} ${escapeHTML(t('share'))}</button><button id="liveTicket" class="primary-button" type="button">${escapeHTML(t('openLive'))}</button></div>
    </article>
  `);
  drawSecurityMatrix(document.getElementById('securityMatrix'), `${ticket.id}|${ticket.fromId}|${ticket.toId}|${ticket.date}|${ticket.departure}`);
  document.getElementById('deleteTicket').addEventListener('click', () => deleteTicket(ticket));
  document.getElementById('shareTicket').addEventListener('click', () => shareTicket(ticket));
  document.getElementById('liveTicket').addEventListener('click', () => openLiveTracking(ticket));
}

function drawSecurityMatrix(canvas, seedText) {
  const context = canvas.getContext('2d');
  const matrixSize = 29;
  const cell = canvas.width / matrixSize;
  const random = seededRandom(seedText);
  const reserved = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#111';

  function finder(startX, startY) {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        reserved[startY + y][startX + x] = true;
        const border = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        if (border || core) context.fillRect((startX + x) * cell, (startY + y) * cell, Math.ceil(cell), Math.ceil(cell));
      }
    }
  }
  finder(1, 1);
  finder(matrixSize - 8, 1);
  finder(1, matrixSize - 8);
  for (let y = 0; y < matrixSize; y += 1) {
    for (let x = 0; x < matrixSize; x += 1) {
      if (!reserved[y][x] && random() > .52) context.fillRect(x * cell, y * cell, Math.ceil(cell), Math.ceil(cell));
    }
  }
}

function deleteTicket(ticket) {
  store.setState(current => {
    const tickets = current.tickets.filter(item => item.id !== ticket.id);
    return { ...current, tickets, activeTicketId: current.activeTicketId === ticket.id ? tickets[0]?.id || null : current.activeTicketId };
  });
  closeModal();
  renderTickets();
}

async function shareTicket(ticket) {
  const text = t('shareTicketText', { train: ticket.train, from: ticket.from, to: ticket.to, date: formatDateLong(ticket.date), time: ticket.departure });
  if (navigator.share) {
    try { await navigator.share({ title: t('digitalTicket'), text }); } catch (error) { if (error.name !== 'AbortError') toast(text); }
  } else if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    toast(t('copied'));
  } else {
    prompt(t('share'), text);
  }
}

function renderNetwork() {
  const current = state();
  const filter = current.ui.networkFilter;
  const mapStations = STATIONS.filter(station => station.tier !== 'local' || station.lines.includes('S'));
  const ticket = activeTicket() || demoJourney();

  mainView.innerHTML = `
    <section class="page-header"><p class="eyebrow">${escapeHTML(t('navNetwork'))}</p><h1>${escapeHTML(t('railNetwork'))}</h1><p class="subtitle">${escapeHTML(t('networkHint'))}</p></section>
    <article class="card network-card">
      <div class="network-toolbar">
        ${['ALL','ICE','IC','RE','K','S'].map(type => `<button class="chip ${filter === type ? 'active' : ''}" type="button" data-network-filter="${type}">${type === 'ALL' ? escapeHTML(t('all')) : type}</button>`).join('')}
      </div>
      <div class="network-viewport" id="networkViewport">
        <svg class="network-map" viewBox="55 15 630 525" role="img" aria-label="${escapeHTML(t('railNetwork'))}">
          ${NETWORK_LINES.map(line => networkLineSVG(line, filter)).join('')}
          ${mapStations.map(station => networkStationSVG(station, filter)).join('')}
          <circle id="networkTrainMarker" class="train-marker" cx="${getStation(ticket.fromId)?.x || 308}" cy="${getStation(ticket.fromId)?.y || 300}" r="8"></circle>
        </svg>
      </div>
      <div class="map-legend">${NETWORK_LINES.map(line => `<span class="service-tag"><span style="width:9px;height:9px;border-radius:50%;background:${line.color}"></span>${escapeHTML(line.name)}</span>`).join('')}</div>
    </article>
    <section class="section"><div class="section-heading"><h2>${escapeHTML(t('liveTracking'))}</h2></div>${renderLiveCard(ticket)}</section>
    <section class="section"><div class="section-heading"><h2>${escapeHTML(t('stations'))}</h2></div><div class="station-list">${current.favorites.slice(0,5).map(id => stationRow(getStation(id))).join('')}</div></section>
  `;

  document.querySelectorAll('[data-network-filter]').forEach(button => {
    button.addEventListener('click', () => {
      store.setState(currentState => ({ ...currentState, ui: { ...currentState.ui, networkFilter: button.dataset.networkFilter } }));
      renderNetwork();
    });
  });
  bindStationRows();
  bindFavoriteButtons();
  document.querySelectorAll('[data-map-station]').forEach(element => {
    const open = () => openStation(getStation(element.dataset.mapStation));
    element.addEventListener('click', open);
    element.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
  });
  document.querySelector('[data-live-card]')?.addEventListener('click', () => openLiveTracking(ticket));
  const viewport = document.getElementById('networkViewport');
  requestAnimationFrame(() => { if (viewport) viewport.scrollLeft = Math.max(0, (viewport.scrollWidth - viewport.clientWidth) / 2); });
  startNetworkSimulation(ticket);
}

function networkLineSVG(line, filter) {
  const points = line.stationIds.map(id => getStation(id)).filter(Boolean).map(station => `${station.x},${station.y}`).join(' ');
  const dimmed = filter !== 'ALL' && filter !== line.type;
  return `<polyline class="network-line ${dimmed ? 'dimmed' : 'highlighted'}" points="${points}" stroke="${line.color}" data-line="${escapeHTML(line.id)}"></polyline>`;
}

function networkStationSVG(station, filter) {
  const visible = filter === 'ALL' || station.lines.includes(filter);
  const color = station.lines.includes('ICE') ? '#a71938' : station.lines.includes('IC') ? '#3b485f' : station.lines.includes('K') ? '#2e67a1' : station.lines.includes('S') ? '#704bb5' : '#3d7b58';
  const radius = station.tier === 'hub' ? 9 : station.tier === 'major' ? 7 : 5;
  const textAnchor = station.x > 535 ? 'end' : 'start';
  const textX = station.x > 535 ? -10 : 10;
  const textY = station.y < 75 ? 20 : -10;
  return `<g class="network-station" data-map-station="${escapeHTML(station.id)}" transform="translate(${station.x} ${station.y})" opacity="${visible ? 1 : .16}" tabindex="0" role="button" aria-label="${escapeHTML(station.name)}"><circle r="${radius}" stroke="${color}"></circle>${station.tier !== 'local' ? `<text x="${textX}" y="${textY}" text-anchor="${textAnchor}">${escapeHTML(station.name.replace(' Hbf', '').replace(' Zentrum', ''))}</text>` : ''}</g>`;
}

function renderLiveCard(ticket) {
  return `
    <button class="card live-card full" type="button" data-live-card>
      <span class="live-head"><span><span class="live-train">${escapeHTML(ticket.train)}</span><span class="muted small" style="display:block">${escapeHTML(ticket.from)} → ${escapeHTML(ticket.to)}</span></span><span class="live-indicator">● LIVE</span></span>
      <span class="progress-track"><span id="inlineProgress" class="progress-bar" style="width:38%"></span></span>
      <span class="live-stations"><span>${escapeHTML(getStation(ticket.fromId)?.city || ticket.from)}</span><span>${escapeHTML(getStation(ticket.toId)?.city || ticket.to)}</span></span>
      <span class="live-stats"><span class="live-stat"><small>${escapeHTML(t('speed'))}</small><strong id="inlineSpeed">286 km/h</strong></span><span class="live-stat"><small>${escapeHTML(t('nextStop'))}</small><strong id="inlineNext">Karlsburg</strong></span><span class="live-stat"><small>${escapeHTML(t('arrival'))}</small><strong>${escapeHTML(ticket.arrival)}</strong></span></span>
    </button>
  `;
}

function startNetworkSimulation(ticket) {
  stopLiveTimer();
  const marker = document.getElementById('networkTrainMarker');
  const from = getStation(ticket.fromId) || getStation('GUA');
  const to = getStation(ticket.toId) || getStation('LOW');
  const seedOffset = (seededNumber(ticket.id) % 480) / 480;

  const update = () => {
    const progress = ((Date.now() / 1000 / 240) + seedOffset) % 1;
    const eased = progress < .5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const x = from.x + (to.x - from.x) * eased;
    const y = from.y + (to.y - from.y) * eased - Math.sin(Math.PI * eased) * 14;
    marker?.setAttribute('cx', x.toFixed(1));
    marker?.setAttribute('cy', y.toFixed(1));
    const bar = document.getElementById('inlineProgress');
    const speed = document.getElementById('inlineSpeed');
    if (bar) bar.style.width = `${Math.max(4, progress * 100)}%`;
    if (speed) speed.textContent = `${Math.round(258 + Math.sin(progress * Math.PI * 2) * 34)} km/h`;
  };
  update();
  liveTimer = setInterval(update, 850);
}

function openLiveTracking(ticket) {
  const from = getStation(ticket.fromId) || getStation('GUA');
  const to = getStation(ticket.toId) || getStation('LOW');
  const next = getStation(ticket.intermediate?.[0]) || getStation('KAR');
  showModal(t('liveTracking'), `
    <article class="live-card">
      <div class="live-head"><div><span class="live-train">${escapeHTML(ticket.train)}</span><span class="muted small" style="display:block">${escapeHTML(ticket.from)} → ${escapeHTML(ticket.to)}</span></div><span class="live-indicator">● LIVE</span></div>
      <svg class="network-map" viewBox="0 0 600 245" style="min-width:0;min-height:245px;margin-top:13px;border-radius:18px;background:var(--surface-muted)">
        <path d="M60 160 C190 48 410 48 540 160" fill="none" stroke="#a71938" stroke-width="8" stroke-linecap="round"></path>
        <circle cx="60" cy="160" r="8" fill="var(--surface)" stroke="#a71938" stroke-width="4"></circle>
        <circle cx="300" cy="79" r="7" fill="var(--surface)" stroke="#a71938" stroke-width="4"></circle>
        <circle cx="540" cy="160" r="8" fill="var(--surface)" stroke="#a71938" stroke-width="4"></circle>
        <text x="60" y="191" text-anchor="middle" fill="var(--text)" font-size="12" font-weight="750">${escapeHTML(from.city)}</text>
        <text x="300" y="52" text-anchor="middle" fill="var(--text)" font-size="12" font-weight="750">${escapeHTML(next.city)}</text>
        <text x="540" y="191" text-anchor="middle" fill="var(--text)" font-size="12" font-weight="750">${escapeHTML(to.city)}</text>
        <circle id="modalTrainMarker" class="train-marker" cx="230" cy="92" r="9"></circle>
      </svg>
      <div class="progress-track"><div id="modalProgress" class="progress-bar" style="width:41%"></div></div>
      <div class="live-stations"><span>${escapeHTML(ticket.from)}</span><span>${escapeHTML(ticket.to)}</span></div>
      <div class="live-stats"><div class="live-stat"><small>${escapeHTML(t('speed'))}</small><strong id="modalSpeed">292 km/h</strong></div><div class="live-stat"><small>${escapeHTML(t('nextStop'))}</small><strong>${escapeHTML(next.city)}</strong></div><div class="live-stat"><small>${escapeHTML(t('arrival'))}</small><strong>${escapeHTML(ticket.arrival)}</strong></div></div>
      <article class="card notice-card info" style="margin-top:14px;padding-right:14px"><span class="notice-icon">${icon('info',19)}</span><div><h3>${escapeHTML(ticket.delay ? `+${ticket.delay} min` : t('onTime'))}</h3><p>${escapeHTML(t('simulatedNotice'))}</p></div></article>
    </article>
  `);

  stopLiveTimer();
  const seedOffset = (seededNumber(ticket.id) % 500) / 500;
  const update = () => {
    const progress = ((Date.now() / 1000 / 210) + seedOffset) % 1;
    const x = 60 + 480 * progress;
    const y = 160 - Math.sin(Math.PI * progress) * 93;
    document.getElementById('modalTrainMarker')?.setAttribute('cx', x.toFixed(1));
    document.getElementById('modalTrainMarker')?.setAttribute('cy', y.toFixed(1));
    const bar = document.getElementById('modalProgress');
    const speed = document.getElementById('modalSpeed');
    if (bar) bar.style.width = `${Math.max(3, progress * 100)}%`;
    if (speed) speed.textContent = `${Math.round(270 + Math.sin(progress * Math.PI * 2) * 36)} km/h`;
  };
  update();
  liveTimer = setInterval(update, 850);
}

function openStation(station) {
  if (!station) return;
  const favorite = state().favorites.includes(station.id);
  const departures = stationDepartures(station);
  showModal(t('stationInformation'), `
    <article>
      <div class="station-header"><div><p class="eyebrow">${escapeHTML(station.id)}</p><h2>${escapeHTML(station.name)}</h2><p class="muted small" style="margin:0">${escapeHTML(station.region)} · ${station.platforms} ${escapeHTML(t('platform'))}</p></div><button id="modalFavorite" class="favorite-button ${favorite ? 'active' : ''}" type="button">${icon(favorite ? 'starFill' : 'star', 19)}</button></div>
      <section class="section"><h3>${escapeHTML(t('departures'))}</h3><div class="departures-board">${departures.map(departure => `<div class="departure-row"><time class="departure-time">${escapeHTML(departure.time)}</time><span class="line-badge ${escapeHTML(departure.type)}">${escapeHTML(departure.train)}</span><span class="departure-copy"><strong>${escapeHTML(departure.destination.name)}</strong><small>${escapeHTML(departure.delay ? `+${departure.delay} min` : t('onTime'))}</small></span><span class="departure-platform">${escapeHTML(t('platform'))} ${escapeHTML(departure.platform)}</span></div>`).join('')}</div></section>
      <section class="section"><h3>${escapeHTML(t('amenities'))}</h3><div class="service-tags">${station.amenities.map(amenity => `<span class="service-tag">${escapeHTML(amenity)}</span>`).join('')}</div></section>
      <button id="searchFromStation" class="primary-button full" type="button" style="margin-top:20px">${escapeHTML(t('searchConnection'))}</button>
    </article>
  `);
  document.getElementById('modalFavorite').addEventListener('click', event => {
    const wasFavorite = state().favorites.includes(station.id);
    store.setState(current => ({ ...current, favorites: wasFavorite ? current.favorites.filter(id => id !== station.id) : [...current.favorites, station.id] }));
    event.currentTarget.classList.toggle('active', !wasFavorite);
    event.currentTarget.innerHTML = icon(!wasFavorite ? 'starFill' : 'star', 19);
    toast(t(wasFavorite ? 'favoriteRemoved' : 'favoriteAdded'));
  });
  document.getElementById('searchFromStation').addEventListener('click', () => {
    store.setState(current => ({ ...current, search: { ...current.search, fromId: station.id } }));
    closeModal();
    navigate('search');
  });
}

function stationDepartures(station) {
  const now = new Date();
  const random = seededRandom(`${station.id}-${now.toISOString().slice(0, 13)}`);
  const destinations = STATIONS.filter(item => item.id !== station.id && (item.tier === 'hub' || item.tier === 'major'));
  return [8, 17, 29, 43, 58].map((offset, index) => {
    const departureTime = new Date(now.getTime() + offset * 60000);
    const type = station.lines[index % station.lines.length] || 'RE';
    const numberBase = type === 'ICE' ? 100 : type === 'IC' ? 600 : type === 'RE' ? 7400 : type === 'S' ? 1 : 70;
    return {
      time: departureTime.toTimeString().slice(0, 5),
      type,
      train: `${type} ${numberBase + Math.floor(random() * 90)}`,
      destination: destinations[Math.floor(random() * destinations.length)],
      platform: String(1 + Math.floor(random() * Math.max(2, station.platforms))),
      delay: index === 2 && random() > .45 ? 5 : 0
    };
  });
}

function renderProfile() {
  const current = state();
  const distance = 36000 + current.tickets.reduce((sum, ticket) => sum + Number(ticket.distance || 0), 0);
  mainView.innerHTML = `
    <section class="page-header"><p class="eyebrow">${escapeHTML(t('navProfile'))}</p><h1>${escapeHTML(t('profile'))}</h1></section>
    <article class="card profile-card">
      <div class="profile-identity"><span class="profile-avatar">DJ</span><span><h2>David J. Martínez</h2><p class="muted" style="margin:0">${escapeHTML(t('member'))}</p></span></div>
      <div class="member-card"><div class="member-level">${escapeHTML(t('member'))}</div><div class="member-number">GB 2048 8361 0917</div></div>
      <div class="stats-grid"><article class="card stat-card"><strong>${124 + current.tickets.length}</strong><small>${escapeHTML(t('journeys'))}</small></article><article class="card stat-card"><strong>${distance.toLocaleString(DATE_LOCALES[current.language])}</strong><small>${escapeHTML(t('kilometres'))}</small></article><article class="card stat-card"><strong>${(8420 + current.tickets.length * 230).toLocaleString(DATE_LOCALES[current.language])}</strong><small>${escapeHTML(t('points'))}</small></article></div>
    </article>
    <section class="section"><div class="section-heading"><h2>${escapeHTML(t('settings'))}</h2></div><article class="card settings-list">
      ${settingRow('languageSetting', 'globe', t('language'), current.language.toUpperCase(), 'Deutsch · Español · English')}
      ${settingRow('themeSetting', current.theme === 'dark' ? 'moon' : 'sun', t('appearance'), themeLabel(current.theme), `${t('automatic')} · ${t('light')} · ${t('dark')}`)}
      ${toggleRow('notificationSetting', 'bell', t('notifications'), current.notifications, current.notifications ? t('enabled') : t('disabled'))}
      ${settingRow('installSetting', 'install', t('installApp'), '', `PWA · ${t('offlineReady')}`)}
      ${settingRow('resetSetting', 'reset', t('resetDemo'), '', t('storageLocal'))}
    </article></section>
    <section class="section"><article class="card station-row"><span class="station-code">GB</span><span class="station-copy"><strong>Galizisches Bahn</strong><small>${escapeHTML(t('version'))} ${escapeHTML(APP_VERSION)} · ${escapeHTML(APP_BUILD)}</small></span><span class="pill pill-green">PWA</span></article></section>
  `;
  document.getElementById('languageSetting').addEventListener('click', openLanguageSettings);
  document.getElementById('themeSetting').addEventListener('click', openThemeSettings);
  document.getElementById('notificationSetting').addEventListener('click', toggleNotifications);
  document.getElementById('installSetting').addEventListener('click', installApp);
  document.getElementById('resetSetting').addEventListener('click', resetDemoData);
}

function settingRow(id, iconName, title, value, detail) {
  return `<button id="${id}" class="setting-row" type="button"><span style="color:var(--brand)">${icon(iconName,20)}</span><span class="setting-copy"><strong>${escapeHTML(title)}</strong><small>${escapeHTML(detail)}</small></span><span class="setting-value">${escapeHTML(value)} ${icon('chevronRight',16)}</span></button>`;
}

function toggleRow(id, iconName, title, enabled, detail) {
  return `<button id="${id}" class="setting-row" type="button"><span style="color:var(--brand)">${icon(iconName,20)}</span><span class="setting-copy"><strong>${escapeHTML(title)}</strong><small>${escapeHTML(detail)}</small></span><span class="toggle ${enabled ? 'on' : ''}" aria-hidden="true"></span></button>`;
}

function themeLabel(theme) {
  if (theme === 'light') return t('light');
  if (theme === 'dark') return t('dark');
  return t('automatic');
}

function openLanguageSettings() {
  showModal(t('language'), `<article class="card settings-list">${[['de','Deutsch'],['es','Español'],['en','English']].map(([code,label]) => `<button class="setting-row" type="button" data-language="${code}"><span class="setting-copy"><strong>${label}</strong></span><span class="setting-value">${state().language === code ? icon('check',18) : ''}</span></button>`).join('')}</article>`);
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => {
    store.setState(current => ({ ...current, language: button.dataset.language }));
    setStaticCopy();
    closeModal();
    renderProfile();
  }));
}

function openThemeSettings() {
  showModal(t('appearance'), `<article class="card settings-list">${[['system',t('automatic'),'sun'],['light',t('light'),'sun'],['dark',t('dark'),'moon']].map(([code,label,iconName]) => `<button class="setting-row" type="button" data-theme-choice="${code}"><span style="color:var(--brand)">${icon(iconName,20)}</span><span class="setting-copy"><strong>${escapeHTML(label)}</strong></span><span class="setting-value">${state().theme === code ? icon('check',18) : ''}</span></button>`).join('')}</article>`);
  document.querySelectorAll('[data-theme-choice]').forEach(button => button.addEventListener('click', () => {
    store.setState(current => ({ ...current, theme: button.dataset.themeChoice }));
    applyTheme();
    closeModal();
    renderProfile();
  }));
}

async function toggleNotifications() {
  if (!('Notification' in window)) { toast(t('notificationUnsupported')); return; }
  if (state().notifications) {
    store.setState(current => ({ ...current, notifications: false }));
  } else {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') store.setState(current => ({ ...current, notifications: true }));
      else toast(t('notificationPermissionDenied'));
    } catch { toast(t('notificationUnsupported')); }
  }
  renderProfile();
}

async function installApp() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installButton.hidden = true;
    return;
  }
  showModal(t('installIosTitle'), `<article class="empty-state" style="padding:15px 4px"><span class="empty-icon">${icon('install',32)}</span><h2>${escapeHTML(t('installIosTitle'))}</h2><p>${escapeHTML(t('installIosText'))}</p></article>`);
}

function resetDemoData() {
  if (!confirm(t('resetConfirm'))) return;
  store.reset();
  currentResults = [];
  applyTheme();
  setStaticCopy();
  toast(t('resetDone'));
  navigate('home', { replace: true });
}

function showModal(title, content) {
  stopLiveTimer();
  modalReturnFocus = document.activeElement;
  modalRoot.innerHTML = `<div id="modalBackdrop" class="modal-backdrop"><section class="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><header class="modal-header"><h2 id="modalTitle">${escapeHTML(title)}</h2><button id="closeModal" class="close-button" type="button" aria-label="${escapeHTML(t('close'))}">${icon('close',19)}</button></header><div class="modal-content">${content}</div></section></div>`;
  const closeButton = document.getElementById('closeModal');
  closeButton.addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', event => { if (event.target.id === 'modalBackdrop') closeModal(); });
  document.addEventListener('keydown', modalKeydown);
  requestAnimationFrame(() => closeButton.focus());
}

function modalKeydown(event) {
  if (event.key === 'Escape') closeModal();
}

function closeModal() {
  stopLiveTimer();
  modalRoot.innerHTML = '';
  document.removeEventListener('keydown', modalKeydown);
  modalReturnFocus?.focus?.();
  modalReturnFocus = null;
  if (state().route === 'network' && document.getElementById('networkTrainMarker')) {
    startNetworkSimulation(activeTicket() || demoJourney());
  }
}

function stopLiveTimer() {
  if (liveTimer) clearInterval(liveTimer);
  liveTimer = null;
}

function bindPageNavigation(root = document) {
  root.querySelectorAll('[data-nav]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.nav)));
}

function toast(message) {
  const element = document.createElement('div');
  element.className = 'toast';
  element.textContent = message;
  toastRoot.appendChild(element);
  setTimeout(() => element.remove(), 2800);
}

function updateNetworkStatus() {
  const online = navigator.onLine;
  networkStatus.classList.toggle('offline', !online);
  networkStatus.title = online ? 'Online' : 'Offline';
}

function registerGlobalEvents() {
  document.querySelectorAll('.nav-button').forEach(button => button.addEventListener('click', () => navigate(button.dataset.route)));
  document.getElementById('brandButton').addEventListener('click', () => navigate('home'));
  document.getElementById('avatarButton').addEventListener('click', () => navigate('profile'));
  installButton.addEventListener('click', installApp);
  window.addEventListener('hashchange', () => {
    const route = routeFromHash();
    store.setState(current => ({ ...current, route }));
    renderRoute(route);
  });
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.hidden = false;
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (state().theme === 'system') applyTheme(); });
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;
  try {
    const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
    if (registration.waiting) showUpdate(registration.waiting);
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate(worker);
      });
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
  } catch (error) {
    console.warn('Service worker registration failed:', error);
  }
}

function showUpdate(worker) {
  newServiceWorker = worker;
  updateBanner.hidden = false;
  updateBanner.innerHTML = `<div class="update-banner-inner"><span class="update-banner-copy">${escapeHTML(t('updateAvailable'))}</span><button id="reloadUpdate" class="secondary-button" type="button">${escapeHTML(t('reload'))}</button></div>`;
  document.getElementById('reloadUpdate').addEventListener('click', () => newServiceWorker?.postMessage({ type: 'SKIP_WAITING' }));
}

function initialize() {
  setStaticIcons();
  setStaticCopy();
  applyTheme();
  updateNetworkStatus();
  registerGlobalEvents();
  registerServiceWorker();
  const initialRoute = routeFromHash() || state().route;
  if (!location.hash) history.replaceState(null, '', `#/${normalizeRoute(initialRoute)}`);
  renderRoute(normalizeRoute(initialRoute), { instant: true });
  window.__GBAHN_TEST__ = {
    version: APP_VERSION,
    stationCount: STATIONS.length,
    route: () => state().route,
    generateJourneys: (fromId = 'GUA', toId = 'LOW') => generateJourneys({ fromId, toId, date: new Date().toISOString().slice(0,10), time: '09:15', passengers: 1, travelClass: '2' })
  };
}

initialize();
