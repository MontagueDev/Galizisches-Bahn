export const APP_VERSION = '0.4.0';
export const APP_BUILD = '2026.08.04-r2';

export const STATIONS = [
  { id:'GUA', name:'Guadalajara Hbf', city:'Guadalajara', region:'Hauptstadtbezirk', x:308, y:300, tier:'hub', lines:['ICE','IC','RE','S'], platforms:22, amenities:['GB Lounge','Restaurants','Einkaufen','Mietwagen','Barrierefrei'] },
  { id:'LOW', name:'Löwenstadt Hbf', city:'Löwenstadt', region:'León', x:252, y:106, tier:'hub', lines:['ICE','IC','RE'], platforms:16, amenities:['GB Lounge','Restaurants','Hotel','Fahrradstation'] },
  { id:'BAD', name:'Badenquellen Hbf', city:'Badenquellen', region:'Aguascalientes', x:367, y:88, tier:'hub', lines:['ICE','IC','RE'], platforms:12, amenities:['Restaurants','Schließfächer','Taxi','Barrierefrei'] },
  { id:'SIL', name:'Silberstadt Hbf', city:'Silberstadt', region:'Zacatecas', x:443, y:48, tier:'major', lines:['IC','RE'], platforms:9, amenities:['Café','Schließfächer','Busbahnhof'] },
  { id:'KAR', name:'Karlsburg Hbf', city:'Karlsburg', region:'Querétaro', x:457, y:271, tier:'hub', lines:['ICE','IC','RE','S'], platforms:18, amenities:['GB Lounge','Restaurants','Einkaufen','Barrierefrei'] },
  { id:'SLU', name:'Sankt Ludwig Hbf', city:'Sankt Ludwig', region:'San Luis Potosí', x:526, y:158, tier:'major', lines:['IC','RE'], platforms:13, amenities:['Restaurants','Hotel','Taxi'] },
  { id:'GOL', name:'Golfhafen Hbf', city:'Golfhafen', region:'Tampico', x:617, y:211, tier:'hub', lines:['ICE','IC','RE','K'], platforms:11, amenities:['Hafenbus','Restaurants','Hotel','Fähre'] },
  { id:'PAZ', name:'Pazifikhafen Hbf', city:'Pazifikhafen', region:'Nayarit', x:111, y:283, tier:'major', lines:['IC','RE','K'], platforms:8, amenities:['Hafenbus','Fahrradstation','Café'] },
  { id:'VUL', name:'Vulkanstadt Hbf', city:'Vulkanstadt', region:'Colima', x:231, y:431, tier:'major', lines:['IC','RE','K'], platforms:7, amenities:['Busbahnhof','Café','Mietwagen'] },
  { id:'MAN', name:'Manzanillo Hafen', city:'Manzanillo', region:'Pazifikküste', x:157, y:497, tier:'major', lines:['RE','K'], platforms:6, amenities:['Fähre','Hafenbus','Restaurants'] },
  { id:'KAI', name:'Kaiserstadt Hbf', city:'Kaiserstadt', region:'Michoacán', x:378, y:431, tier:'hub', lines:['ICE','IC','RE'], platforms:13, amenities:['Restaurants','Einkaufen','Taxi','Barrierefrei'] },
  { id:'SEE', name:'Seeburg Zentrum', city:'Seeburg', region:'Michoacán', x:433, y:491, tier:'local', lines:['RE','S'], platforms:5, amenities:['Busbahnhof','Café'] },
  { id:'ALT', name:'Altstadt Mitte', city:'Guadalajara', region:'Hauptstadtbezirk', x:332, y:329, tier:'local', lines:['RE','S','U'], platforms:6, amenities:['U-Bahn','Tram','Einkaufen'] },
  { id:'FLU', name:'Flughafen Galizien', city:'Guadalajara', region:'Hauptstadtbezirk', x:385, y:347, tier:'major', lines:['IC','RE','S'], platforms:8, amenities:['Flughafen','Mietwagen','Hotel'] },
  { id:'ROS', name:'Rosenfeld', city:'Rosenfeld', region:'Jalisco', x:250, y:365, tier:'local', lines:['RE','S'], platforms:4, amenities:['Busbahnhof','Fahrradstation'] },
  { id:'BER', name:'Bergheim', city:'Bergheim', region:'Hochland', x:410, y:370, tier:'local', lines:['RE'], platforms:4, amenities:['Wanderbus','Café'] },
  { id:'SON', name:'Sonnenau', city:'Sonnenau', region:'Jalisco', x:198, y:235, tier:'local', lines:['RE'], platforms:5, amenities:['Busbahnhof','Café'] },
  { id:'MAR', name:'Marienfeld Hbf', city:'Marienfeld', region:'Guanajuato', x:302, y:187, tier:'major', lines:['IC','RE'], platforms:7, amenities:['Restaurants','Taxi'] },
  { id:'KRO', name:'Kronental', city:'Kronental', region:'Querétaro', x:407, y:226, tier:'local', lines:['RE','S'], platforms:5, amenities:['Busbahnhof','Café'] },
  { id:'EIC', name:'Eichenau', city:'Eichenau', region:'San Luis Potosí', x:489, y:209, tier:'local', lines:['RE'], platforms:4, amenities:['Busbahnhof','Fahrradstation'] },
  { id:'WAL', name:'Waldkirchen', city:'Waldkirchen', region:'Zacatecas', x:400, y:126, tier:'local', lines:['RE'], platforms:4, amenities:['Busbahnhof','Café'] },
  { id:'KUS', name:'Küstenstadt Hbf', city:'Küstenstadt', region:'Nayarit', x:124, y:368, tier:'major', lines:['IC','RE','K'], platforms:6, amenities:['Hafenbus','Restaurants'] },
  { id:'PAL', name:'Palmenhafen', city:'Palmenhafen', region:'Colima', x:113, y:451, tier:'local', lines:['RE','K'], platforms:5, amenities:['Fähre','Hotel','Restaurants'] },
  { id:'NEU', name:'Neustadt Süd', city:'Guadalajara', region:'Hauptstadtbezirk', x:348, y:392, tier:'local', lines:['RE','S'], platforms:6, amenities:['S-Bahn','Busbahnhof'] },
  { id:'DOM', name:'Domplatz', city:'Karlsburg', region:'Querétaro', x:490, y:307, tier:'local', lines:['RE','S'], platforms:4, amenities:['Tram','Einkaufen'] },
  { id:'RHE', name:'Rheintal', city:'Rheintal', region:'Golfregion', x:566, y:254, tier:'local', lines:['RE'], platforms:4, amenities:['Busbahnhof','Café'] },
  { id:'HOF', name:'Kaiserhof', city:'Kaiserstadt', region:'Michoacán', x:410, y:463, tier:'local', lines:['RE','S'], platforms:4, amenities:['Tram','Einkaufen'] },
  { id:'FRE', name:'Friedrichshöhe', city:'Friedrichshöhe', region:'Hochland', x:449, y:344, tier:'local', lines:['RE'], platforms:4, amenities:['Busbahnhof','Wanderbus'] },
  { id:'ELB', name:'Elbbrücke', city:'Elbbrücke', region:'Jalisco', x:276, y:260, tier:'local', lines:['RE','S'], platforms:4, amenities:['Busbahnhof','Fahrradstation'] },
  { id:'WEI', name:'Weinbergen', city:'Weinbergen', region:'Guanajuato', x:332, y:140, tier:'local', lines:['RE'], platforms:4, amenities:['Weinbus','Restaurants'] },
  { id:'STE', name:'Steinbach', city:'Steinbach', region:'Zacatecas', x:474, y:96, tier:'local', lines:['RE'], platforms:3, amenities:['Busbahnhof'] },
  { id:'KLA', name:'Klostersee', city:'Klostersee', region:'Michoacán', x:332, y:481, tier:'local', lines:['RE'], platforms:3, amenities:['Busbahnhof','Café'] },
  { id:'HAF', name:'Hafenviertel', city:'Golfhafen', region:'Tampico', x:635, y:248, tier:'local', lines:['RE','K'], platforms:4, amenities:['Fähre','Hafenbus'] },
  { id:'NOR', name:'Nordtor', city:'Löwenstadt', region:'León', x:222, y:74, tier:'local', lines:['RE','S'], platforms:4, amenities:['Busbahnhof','Parkhaus'] },
  { id:'SUD', name:'Südpark', city:'Guadalajara', region:'Hauptstadtbezirk', x:301, y:391, tier:'local', lines:['RE','S'], platforms:5, amenities:['S-Bahn','Parkhaus'] },
  { id:'FLO', name:'Florianstadt', city:'Florianstadt', region:'Jalisco', x:205, y:331, tier:'local', lines:['RE'], platforms:4, amenities:['Busbahnhof','Café'] },
  { id:'GRE', name:'Grenzmarkt Hbf', city:'Grenzmarkt', region:'Ostmark', x:580, y:125, tier:'major', lines:['IC','RE'], platforms:7, amenities:['Zollservice','Restaurants'] },
  { id:'KAS', name:'Kastanienhof', city:'Kastanienhof', region:'Guanajuato', x:278, y:155, tier:'local', lines:['RE'], platforms:3, amenities:['Busbahnhof'] },
  { id:'LIM', name:'Lindenmarkt', city:'Lindenmarkt', region:'Querétaro', x:425, y:296, tier:'local', lines:['RE','S'], platforms:4, amenities:['Tram','Café'] },
  { id:'BLA', name:'Blumenau', city:'Blumenau', region:'Jalisco', x:238, y:317, tier:'local', lines:['RE'], platforms:3, amenities:['Busbahnhof','Fahrradstation'] },
  { id:'ADE', name:'Adlerhöhe', city:'Adlerhöhe', region:'Guanajuato', x:347, y:220, tier:'local', lines:['RE'], platforms:4, amenities:['Busbahnhof','Aussichtspunkt'] },
  { id:'BRU', name:'Brunnenstadt', city:'Brunnenstadt', region:'Jalisco', x:354, y:271, tier:'local', lines:['RE','S'], platforms:5, amenities:['Tram','Café'] },
  { id:'MON', name:'Morgenau', city:'Morgenau', region:'Nayarit', x:162, y:306, tier:'local', lines:['RE','K'], platforms:4, amenities:['Busbahnhof','Café'] },
  { id:'TAN', name:'Tannenberg', city:'Tannenberg', region:'Hochland', x:454, y:397, tier:'local', lines:['RE'], platforms:3, amenities:['Wanderbus'] },
  { id:'SAL', name:'Salzbrücke', city:'Salzbrücke', region:'San Luis Potosí', x:538, y:199, tier:'local', lines:['RE'], platforms:4, amenities:['Busbahnhof'] },
  { id:'KON', name:'Königsfeld', city:'Königsfeld', region:'Zacatecas', x:431, y:83, tier:'local', lines:['RE'], platforms:4, amenities:['Busbahnhof','Café'] },
  { id:'HIM', name:'Himmelgarten', city:'Himmelgarten', region:'Jalisco', x:286, y:344, tier:'local', lines:['S'], platforms:3, amenities:['S-Bahn','Park'] },
  { id:'AUE', name:'Auenwald', city:'Auenwald', region:'Michoacán', x:292, y:423, tier:'local', lines:['RE'], platforms:3, amenities:['Busbahnhof','Naturpark'] },
  { id:'MUE', name:'Mühlenhof', city:'Mühlenhof', region:'Querétaro', x:513, y:284, tier:'local', lines:['RE'], platforms:3, amenities:['Busbahnhof'] },
  { id:'SEI', name:'Seidenstraße', city:'Seidenstraße', region:'Ostmark', x:552, y:164, tier:'local', lines:['RE'], platforms:4, amenities:['Busbahnhof','Markthalle'] },
  { id:'WES', name:'Westhafen', city:'Pazifikhafen', region:'Nayarit', x:86, y:323, tier:'local', lines:['K'], platforms:3, amenities:['Fähre','Hafenbus'] },
  { id:'OST', name:'Ostbahnhof', city:'Karlsburg', region:'Querétaro', x:508, y:249, tier:'local', lines:['S'], platforms:4, amenities:['S-Bahn','Parkhaus'] },
  { id:'ZIT', name:'Zitadelle', city:'Guadalajara', region:'Hauptstadtbezirk', x:286, y:305, tier:'local', lines:['S','U'], platforms:4, amenities:['U-Bahn','Museum'] },
  { id:'KUR', name:'Kurpark', city:'Badenquellen', region:'Aguascalientes', x:389, y:101, tier:'local', lines:['RE','S'], platforms:4, amenities:['Thermenbus','Hotel'] },
  { id:'HOC', name:'Hochwald', city:'Hochwald', region:'León', x:269, y:133, tier:'local', lines:['RE'], platforms:3, amenities:['Wanderbus'] },
  { id:'RAT', name:'Rathausplatz', city:'Sankt Ludwig', region:'San Luis Potosí', x:548, y:176, tier:'local', lines:['S'], platforms:3, amenities:['Tram','Einkaufen'] },
  { id:'DUE', name:'Dünenhafen', city:'Dünenhafen', region:'Tampico', x:650, y:192, tier:'local', lines:['K'], platforms:3, amenities:['Fähre','Strandbus'] },
  { id:'GLA', name:'Glashütte', city:'Glashütte', region:'Zacatecas', x:493, y:55, tier:'local', lines:['RE'], platforms:3, amenities:['Busbahnhof'] },
  { id:'KIR', name:'Kirschental', city:'Kirschental', region:'Michoacán', x:356, y:469, tier:'local', lines:['RE'], platforms:3, amenities:['Busbahnhof','Obstmarkt'] },
  { id:'GRA', name:'Grafenau', city:'Grafenau', region:'Guanajuato', x:319, y:111, tier:'local', lines:['RE'], platforms:3, amenities:['Busbahnhof'] }
];

export const NETWORK_LINES = [
  { id:'ICE-1', type:'ICE', name:'Nord–Ost Magistrale', color:'#a71938', stationIds:['LOW','MAR','ELB','GUA','BRU','KRO','KAR','MUE','RHE','GOL'] },
  { id:'ICE-2', type:'ICE', name:'Thermen–Kaiser Linie', color:'#c63a55', stationIds:['BAD','WEI','MAR','ELB','GUA','NEU','KAI'] },
  { id:'IC-3', type:'IC', name:'Silberlinie', color:'#3b485f', stationIds:['SIL','KON','BAD','WAL','SLU','SEI','GRE'] },
  { id:'IC-4', type:'IC', name:'Pazifik–Hochland', color:'#556174', stationIds:['PAZ','MON','FLO','GUA','BER','KAI','SEE'] },
  { id:'RE-5', type:'RE', name:'Vulkan Express', color:'#3d7b58', stationIds:['GUA','HIM','ROS','AUE','VUL','PAL','MAN'] },
  { id:'RE-6', type:'RE', name:'Karlsburger Ring', color:'#54a06d', stationIds:['GUA','ADE','KRO','KAR','DOM','FRE','BER','NEU','GUA'] },
  { id:'K-7', type:'K', name:'Küstenbahn', color:'#2e67a1', stationIds:['WES','PAZ','KUS','PAL','MAN'] },
  { id:'K-8', type:'K', name:'Golfküste', color:'#3c82c4', stationIds:['GRE','SLU','SAL','GOL','HAF','DUE'] },
  { id:'S-1', type:'S', name:'S-Bahn Hauptstadt', color:'#704bb5', stationIds:['ZIT','GUA','ALT','FLU','NEU','SUD','HIM','ZIT'] }
];

export const COPY = {
  de: {
    navHome:'Start', navSearch:'Reisen', navNetwork:'Netz', navTickets:'Tickets', navProfile:'Profil',
    greeting:'Guten Morgen', tagline:'Deine Reise durch die Bundesrepublik Galizien.',
    nextJourney:'Nächste Reise', searchConnection:'Verbindung suchen', from:'Von', to:'Nach', swap:'Tauschen',
    date:'Datum', time:'Zeit', passengers:'Reisende', travelClass:'Klasse', search:'Suchen',
    favorites:'Favoriten', recentSearches:'Letzte Suchen', serviceUpdates:'Verkehrsmeldungen', seeAll:'Alle anzeigen',
    connections:'Verbindungen', direct:'Direkt', cheapest:'Günstigste', fastest:'Schnellste', all:'Alle',
    onTime:'Pünktlich', delayed:'Verspätet', platform:'Gleis', changes:'Umstiege', duration:'Dauer',
    details:'Details', book:'Buchen', fare:'Tarif', flexFare:'Flexpreis', saverFare:'Sparpreis',
    flexibleFareDesc:'Umbuchung und Erstattung inklusive.', saverFareDesc:'Zugbindung, begrenzte Erstattung.',
    journeyDetails:'Reisedetails', intermediateStop:'Zwischenhalt', recommendedChange:'Empfohlener Umstieg',
    ticketBooked:'Ticket wurde gespeichert.', myTickets:'Meine Tickets', upcoming:'Bevorstehend', past:'Vergangen',
    noTickets:'Noch keine Tickets', noTicketsDesc:'Buche eine Verbindung und dein digitales Ticket erscheint hier.',
    digitalTicket:'Digitales Ticket', coach:'Wagen', seat:'Platz', price:'Preis', validationCode:'GB Sicherheitscode',
    liveTracking:'Live-Zugverfolgung', speed:'Geschwindigkeit', nextStop:'Nächster Halt', arrival:'Ankunft', progress:'Fortschritt',
    simulatedNotice:'Position, Geschwindigkeit und Verspätungen werden in dieser Demonstration simuliert.',
    railNetwork:'Streckennetz', networkHint:'Tippe auf eine Station für Abfahrten, Services und Verbindungen.',
    stationInformation:'Bahnhofsinformation', departures:'Nächste Abfahrten', amenities:'Services', favoriteAdded:'Zu Favoriten hinzugefügt.', favoriteRemoved:'Aus Favoriten entfernt.',
    profile:'Profil', member:'GB Card Gold', journeys:'Reisen', kilometres:'Kilometer', points:'Punkte', settings:'Einstellungen',
    language:'Sprache', appearance:'Darstellung', notifications:'Benachrichtigungen', installApp:'App installieren',
    automatic:'Automatisch', light:'Hell', dark:'Dunkel', enabled:'Aktiviert', disabled:'Deaktiviert',
    installIosTitle:'Zum Home-Bildschirm hinzufügen', installIosText:'Öffne diese Seite in Safari, tippe auf Teilen und dann auf „Zum Home-Bildschirm“.',
    close:'Schließen', delete:'Löschen', share:'Teilen', copied:'Kopiert', saved:'Gespeichert', resetDemo:'Demodaten zurücksetzen',
    invalidRoute:'Start und Ziel müssen verschieden sein.', chooseStation:'Bahnhof auswählen', noMatches:'Keine passenden Bahnhöfe.',
    offlineReady:'Offline bereit', updateAvailable:'Eine neue Version ist verfügbar.', reload:'Neu laden', today:'Heute', tomorrow:'Morgen',
    onePassenger:'1 Reisender', passengersCount:'{count} Reisende', firstClass:'1. Klasse', secondClass:'2. Klasse',
    bookFor:'Buchen für {price} GM', connectionFound:'{count} Verbindungen', departureAt:'Abfahrt {time}',
    demoJourney:'Demofahrt', openTicket:'Ticket öffnen', openLive:'Live ansehen', noActiveTrip:'Keine aktive Reise',
    notificationPermissionDenied:'Benachrichtigungen wurden nicht erlaubt.', notificationUnsupported:'Benachrichtigungen werden hier nicht unterstützt.',
    resetConfirm:'Alle gespeicherten Tickets, Favoriten und Einstellungen wirklich zurücksetzen?', resetDone:'Demodaten wurden zurückgesetzt.',
    shareTicketText:'Mein Ticket {train}: {from} nach {to}, {date} um {time}.',
    updateTitle:'Aktuelle Hinweise', worksTitle:'Bauarbeiten zwischen Karlsburg und Sankt Ludwig', worksText:'Einige IC-Züge verkehren mit 8–12 Minuten Verspätung. ICE-Verbindungen sind nicht betroffen.',
    stormTitle:'Küstenbahn: starker Wind', stormText:'Zwischen Palmenhafen und Manzanillo gilt vorübergehend eine reduzierte Geschwindigkeit.',
    account:'Konto', privacy:'Datenschutz', about:'Über die App', version:'Version', storageLocal:'Daten werden nur auf diesem Gerät gespeichert.',
    activeTrip:'Aktive Reise', selectLine:'Linie auswählen', stations:'Bahnhöfe', resetFilters:'Filter zurücksetzen'
  },
  es: {
    navHome:'Inicio', navSearch:'Viajes', navNetwork:'Red', navTickets:'Boletos', navProfile:'Perfil',
    greeting:'Buenos días', tagline:'Tu viaje por la República Federal de Galizia.',
    nextJourney:'Próximo viaje', searchConnection:'Buscar conexión', from:'Origen', to:'Destino', swap:'Intercambiar',
    date:'Fecha', time:'Hora', passengers:'Pasajeros', travelClass:'Clase', search:'Buscar',
    favorites:'Favoritos', recentSearches:'Búsquedas recientes', serviceUpdates:'Avisos de servicio', seeAll:'Ver todo',
    connections:'Conexiones', direct:'Directos', cheapest:'Más baratos', fastest:'Más rápidos', all:'Todos',
    onTime:'Puntual', delayed:'Retrasado', platform:'Andén', changes:'Transbordos', duration:'Duración',
    details:'Detalles', book:'Reservar', fare:'Tarifa', flexFare:'Tarifa flexible', saverFare:'Tarifa ahorro',
    flexibleFareDesc:'Incluye cambios y reembolso.', saverFareDesc:'Ligada al tren y con reembolso limitado.',
    journeyDetails:'Detalles del viaje', intermediateStop:'Parada intermedia', recommendedChange:'Transbordo recomendado',
    ticketBooked:'El boleto quedó guardado.', myTickets:'Mis boletos', upcoming:'Próximos', past:'Anteriores',
    noTickets:'Todavía no hay boletos', noTicketsDesc:'Reserva una conexión y tu boleto digital aparecerá aquí.',
    digitalTicket:'Boleto digital', coach:'Coche', seat:'Asiento', price:'Precio', validationCode:'Código de seguridad GB',
    liveTracking:'Seguimiento en vivo', speed:'Velocidad', nextStop:'Próxima estación', arrival:'Llegada', progress:'Progreso',
    simulatedNotice:'La posición, velocidad y los retrasos se simulan en esta demostración.',
    railNetwork:'Red ferroviaria', networkHint:'Toca una estación para ver salidas, servicios y conexiones.',
    stationInformation:'Información de la estación', departures:'Próximas salidas', amenities:'Servicios', favoriteAdded:'Añadida a favoritos.', favoriteRemoved:'Eliminada de favoritos.',
    profile:'Perfil', member:'GB Card Gold', journeys:'Viajes', kilometres:'Kilómetros', points:'Puntos', settings:'Configuración',
    language:'Idioma', appearance:'Apariencia', notifications:'Notificaciones', installApp:'Instalar aplicación',
    automatic:'Automático', light:'Claro', dark:'Oscuro', enabled:'Activadas', disabled:'Desactivadas',
    installIosTitle:'Añadir a la pantalla de inicio', installIosText:'Abre esta página en Safari, pulsa Compartir y luego “Añadir a pantalla de inicio”.',
    close:'Cerrar', delete:'Eliminar', share:'Compartir', copied:'Copiado', saved:'Guardado', resetDemo:'Restablecer datos de prueba',
    invalidRoute:'El origen y el destino deben ser distintos.', chooseStation:'Seleccionar estación', noMatches:'No hay estaciones coincidentes.',
    offlineReady:'Lista para usarse sin conexión', updateAvailable:'Hay una nueva versión disponible.', reload:'Recargar', today:'Hoy', tomorrow:'Mañana',
    onePassenger:'1 pasajero', passengersCount:'{count} pasajeros', firstClass:'1.ª clase', secondClass:'2.ª clase',
    bookFor:'Reservar por {price} GM', connectionFound:'{count} conexiones', departureAt:'Salida {time}',
    demoJourney:'Viaje de demostración', openTicket:'Abrir boleto', openLive:'Ver en vivo', noActiveTrip:'No hay un viaje activo',
    notificationPermissionDenied:'No se concedió permiso para notificaciones.', notificationUnsupported:'Las notificaciones no son compatibles aquí.',
    resetConfirm:'¿Seguro que quieres borrar boletos, favoritos y ajustes guardados?', resetDone:'Se restablecieron los datos de prueba.',
    shareTicketText:'Mi boleto {train}: de {from} a {to}, {date} a las {time}.',
    updateTitle:'Avisos actuales', worksTitle:'Obras entre Karlsburg y Sankt Ludwig', worksText:'Algunos trenes IC circulan con 8–12 minutos de retraso. Los ICE no se ven afectados.',
    stormTitle:'Línea costera: viento fuerte', stormText:'Entre Palmenhafen y Manzanillo se aplica temporalmente una velocidad reducida.',
    account:'Cuenta', privacy:'Privacidad', about:'Acerca de la app', version:'Versión', storageLocal:'Los datos se guardan únicamente en este dispositivo.',
    activeTrip:'Viaje activo', selectLine:'Seleccionar línea', stations:'Estaciones', resetFilters:'Restablecer filtros'
  },
  en: {
    navHome:'Home', navSearch:'Travel', navNetwork:'Network', navTickets:'Tickets', navProfile:'Profile',
    greeting:'Good morning', tagline:'Your journey across the Federal Republic of Galizia.',
    nextJourney:'Next journey', searchConnection:'Find a connection', from:'From', to:'To', swap:'Swap',
    date:'Date', time:'Time', passengers:'Passengers', travelClass:'Class', search:'Search',
    favorites:'Favorites', recentSearches:'Recent searches', serviceUpdates:'Service updates', seeAll:'See all',
    connections:'Connections', direct:'Direct', cheapest:'Cheapest', fastest:'Fastest', all:'All',
    onTime:'On time', delayed:'Delayed', platform:'Platform', changes:'Changes', duration:'Duration',
    details:'Details', book:'Book', fare:'Fare', flexFare:'Flexible fare', saverFare:'Saver fare',
    flexibleFareDesc:'Changes and refunds included.', saverFareDesc:'Train-specific with limited refunds.',
    journeyDetails:'Journey details', intermediateStop:'Intermediate stop', recommendedChange:'Recommended change',
    ticketBooked:'The ticket was saved.', myTickets:'My tickets', upcoming:'Upcoming', past:'Past',
    noTickets:'No tickets yet', noTicketsDesc:'Book a connection and your digital ticket will appear here.',
    digitalTicket:'Digital ticket', coach:'Coach', seat:'Seat', price:'Price', validationCode:'GB security code',
    liveTracking:'Live train tracking', speed:'Speed', nextStop:'Next stop', arrival:'Arrival', progress:'Progress',
    simulatedNotice:'Position, speed and delays are simulated in this demonstration.',
    railNetwork:'Rail network', networkHint:'Tap a station for departures, facilities and connections.',
    stationInformation:'Station information', departures:'Next departures', amenities:'Facilities', favoriteAdded:'Added to favorites.', favoriteRemoved:'Removed from favorites.',
    profile:'Profile', member:'GB Card Gold', journeys:'Journeys', kilometres:'Kilometres', points:'Points', settings:'Settings',
    language:'Language', appearance:'Appearance', notifications:'Notifications', installApp:'Install app',
    automatic:'Automatic', light:'Light', dark:'Dark', enabled:'Enabled', disabled:'Disabled',
    installIosTitle:'Add to Home Screen', installIosText:'Open this page in Safari, tap Share, then “Add to Home Screen”.',
    close:'Close', delete:'Delete', share:'Share', copied:'Copied', saved:'Saved', resetDemo:'Reset demo data',
    invalidRoute:'Origin and destination must be different.', chooseStation:'Choose station', noMatches:'No matching stations.',
    offlineReady:'Ready offline', updateAvailable:'A new version is available.', reload:'Reload', today:'Today', tomorrow:'Tomorrow',
    onePassenger:'1 passenger', passengersCount:'{count} passengers', firstClass:'First class', secondClass:'Second class',
    bookFor:'Book for {price} GM', connectionFound:'{count} connections', departureAt:'Departure {time}',
    demoJourney:'Demo journey', openTicket:'Open ticket', openLive:'View live', noActiveTrip:'No active journey',
    notificationPermissionDenied:'Notification permission was not granted.', notificationUnsupported:'Notifications are not supported here.',
    resetConfirm:'Are you sure you want to erase saved tickets, favorites and settings?', resetDone:'Demo data was reset.',
    shareTicketText:'My ticket {train}: {from} to {to}, {date} at {time}.',
    updateTitle:'Current notices', worksTitle:'Engineering works between Karlsburg and Sankt Ludwig', worksText:'Some IC trains are running 8–12 minutes late. ICE services are not affected.',
    stormTitle:'Coastal line: strong winds', stormText:'A temporary speed restriction applies between Palmenhafen and Manzanillo.',
    account:'Account', privacy:'Privacy', about:'About the app', version:'Version', storageLocal:'Data is stored only on this device.',
    activeTrip:'Active journey', selectLine:'Select line', stations:'Stations', resetFilters:'Reset filters'
  }
};

export const SERVICE_ALERTS = [
  { id:'works-kar-slu', severity:'warning', titleKey:'worksTitle', textKey:'worksText', affected:['KAR','SLU'], lines:['IC'] },
  { id:'coast-wind', severity:'info', titleKey:'stormTitle', textKey:'stormText', affected:['PAL','MAN'], lines:['K'] }
];

export function getStation(id) {
  return STATIONS.find(station => station.id === id) || null;
}

export function findStationByName(name) {
  const normalized = String(name || '').trim().toLocaleLowerCase();
  return STATIONS.find(station => station.name.toLocaleLowerCase() === normalized) || null;
}

export function searchStations(query, limit = 8) {
  const normalized = String(query || '').trim().toLocaleLowerCase();
  if (!normalized) return STATIONS.slice(0, limit);
  return STATIONS
    .map(station => {
      const haystack = `${station.name} ${station.city} ${station.region} ${station.id}`.toLocaleLowerCase();
      let score = 100;
      if (station.id.toLocaleLowerCase() === normalized) score = 0;
      else if (station.name.toLocaleLowerCase().startsWith(normalized)) score = 1;
      else if (station.city.toLocaleLowerCase().startsWith(normalized)) score = 2;
      else if (haystack.includes(normalized)) score = 3;
      return { station, score };
    })
    .filter(item => item.score < 100)
    .sort((a,b) => a.score - b.score || a.station.name.localeCompare(b.station.name))
    .slice(0, limit)
    .map(item => item.station);
}
