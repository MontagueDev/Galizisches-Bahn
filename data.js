export const APP_VERSION = '0.6.1';
export const APP_BUILD = '2026.08.04-ux1';

export const STATIONS = [
  {id:'GUA',name:'Guadalajara Hbf',city:'Guadalajara',oldName:'Guadalajara',country:'GL',x:300,y:282,platforms:22,hub:true,amenities:['GB Lounge','U-Bahn','S-Bahn','Restaurants','Einkaufen','Barrierefrei']},
  {id:'FLU',name:'Flughafen Guadalajara',city:'Guadalajara',oldName:'Aeropuerto de Guadalajara',country:'GL',x:348,y:330,platforms:8,amenities:['Flughafen','S-Bahn','Airport Express','Mietwagen']},
  {id:'LOW',name:'Löwenstadt Hbf',city:'Löwenstadt',oldName:'León',country:'GL',x:242,y:93,platforms:16,hub:true,amenities:['GB Lounge','U-Bahn','S-Bahn','Restaurants']},
  {id:'SIL',name:'Silao Zentrum',city:'Löwenstadt',oldName:'Silao',country:'GL',x:270,y:122,platforms:7,amenities:['S-Bahn','Busbahnhof']},
  {id:'BAD',name:'Badenquellen Hbf',city:'Badenquellen',oldName:'Aguascalientes',country:'GL',x:356,y:72,platforms:12,hub:true,amenities:['U-Bahn','S-Bahn','Thermenbus','Restaurants']},
  {id:'ZAC',name:'Silberstadt Hbf',city:'Silberstadt',oldName:'Zacatecas',country:'GL',x:424,y:35,platforms:9,amenities:['Stadtbahn','S-Bahn','Café']},
  {id:'KAR',name:'Karlsburg Hbf',city:'Karlsburg',oldName:'Querétaro',country:'GL',x:442,y:252,platforms:18,hub:true,amenities:['GB Lounge','U-Bahn','S-Bahn','Restaurants']},
  {id:'SLU',name:'Sankt Ludwig Hbf',city:'Sankt Ludwig',oldName:'San Luis Potosí',country:'GL',x:509,y:139,platforms:13,hub:true,amenities:['U-Bahn','S-Bahn','Restaurants']},
  {id:'GRE',name:'Grenzmarkt Hbf',city:'Grenzmarkt',oldName:'Grenzmarkt',country:'GL',x:565,y:108,platforms:7,border:true,amenities:['Bundespolizei','Zoll','Dokumentenprüfung','Restaurants']},
  {id:'GOL',name:'Golfhafen Hbf',city:'Golfhafen',oldName:'Tampico',country:'GL',x:603,y:193,platforms:11,hub:true,amenities:['U-Bahn','S-Bahn','Hafenbus','Fähre']},
  {id:'PAZ',name:'Pazifikhafen Hbf',city:'Pazifikhafen',oldName:'Tepic',country:'GL',x:102,y:268,platforms:8,hub:true,amenities:['U-Bahn','S-Bahn','Hafenbus']},
  {id:'VUL',name:'Vulkanstadt Hbf',city:'Vulkanstadt',oldName:'Colima',country:'GL',x:221,y:411,platforms:7,hub:true,amenities:['U-Bahn','S-Bahn','Busbahnhof']},
  {id:'MAN',name:'Manzanillo Hafen',city:'Manzanillo',oldName:'Manzanillo',country:'GL',x:147,y:472,platforms:6,hub:true,amenities:['U-Bahn','S-Bahn','Fähre','Hafenbus']},
  {id:'KAI',name:'Kaiserstadt Hbf',city:'Kaiserstadt',oldName:'Morelia',country:'GL',x:368,y:411,platforms:13,hub:true,amenities:['U-Bahn','S-Bahn','Restaurants']},
  {id:'SEE',name:'Seeburg Hbf',city:'Seeburg',oldName:'Pátzcuaro',country:'GL',x:416,y:464,platforms:7,amenities:['S-Bahn','Tram','Café']},
  {id:'TEP',name:'Tepatitlan',city:'Tepatitlan',oldName:'Tepatitlán',country:'GL',x:344,y:230,platforms:5,amenities:['RE','Busbahnhof']},
  {id:'LAG',name:'Seenstadt',city:'Seenstadt',oldName:'Lagos de Moreno',country:'GL',x:292,y:155,platforms:5,amenities:['RE','Busbahnhof']},
  {id:'SJR',name:'Johannestal',city:'Johannestal',oldName:'San Juan del Río',country:'GL',x:478,y:286,platforms:6,amenities:['RE','Busbahnhof']},
  {id:'ALT',name:'Altstadt Mitte',city:'Guadalajara',oldName:'Centro Guadalajara',country:'GL',x:316,y:305,platforms:6,amenities:['U-Bahn','S-Bahn','Tram']},
  {id:'MEX',name:'Ciudad de México Buenavista',city:'Ciudad de México',oldName:'Buenavista',country:'MX',x:640,y:338,platforms:12,international:true,hub:true,amenities:['Migración','Aduana','Metro','Tren Suburbano','Taxi','Restaurants']}
];

export const RAIL_EDGES = [
  ['GUA','FLU',24,['S','AEX']],['GUA','TEP',38,['RE','IR']],['TEP','LAG',41,['RE','IR']],['LAG','LOW',46,['RE','IC','ICE']],
  ['LOW','SIL',18,['S','RE']],['SIL','BAD',54,['RE','IC']],['BAD','ZAC',38,['RE','IC']],['ZAC','SLU',66,['RE','IC']],
  ['GUA','KAR',68,['ICE','IC','RE']],['KAR','SJR',31,['S','RE']],['SJR','MEX',93,['EC','IC']],['KAR','SLU',73,['ICE','IC']],
  ['SLU','GRE',49,['IC','EC','RE']],['GRE','MEX',104,['EC','NJ']],['SLU','GOL',78,['IC','RE']],
  ['GUA','PAZ',69,['IC','RE']],['PAZ','MAN',113,['IR','RE']],['GUA','VUL',72,['IC','RE']],['VUL','MAN',84,['IR','RE']],
  ['GUA','KAI',88,['ICE','IC','RE']],['KAI','SEE',33,['S','RE']],['KAI','KAR',96,['ICE','IC']],['VUL','KAI',61,['RE']],
  ['GOL','MEX',132,['EC','IC']],['KAR','MEX',151,['EC','ICE']],['GUA','MEX',226,['EC','NJ']]
];

const city = (id,name,oldName,accent,modes,stops,lines) => ({id,name,oldName,accent,modes,stops,lines});
export const URBAN_NETWORKS = [
  city('GDL','Guadalajara','Guadalajara','#8b1735',['U','S'],
    ['Flughafen Guadalajara','Tlaquepaque','Guadalajara Hbf','Altstadt Mitte','Zapopan Zentrum','Zapopan Nord','Tonalá','El Salto','Tlajomulco','Südpark','Universität','Tesistán','Chapala'],[
      {id:'U1',mode:'U',color:'#d13b4f',minutes:4,stops:['Zapopan Nord','Zapopan Zentrum','Guadalajara Hbf','Altstadt Mitte','Tlaquepaque','Südpark']},
      {id:'U2',mode:'U',color:'#2473a6',minutes:5,stops:['Tonalá','Altstadt Mitte','Guadalajara Hbf','Universität','Zapopan Zentrum']},
      {id:'U3',mode:'U',color:'#8a5aa8',minutes:6,stops:['Tesistán','Zapopan Zentrum','Guadalajara Hbf','Tlaquepaque','El Salto']},
      {id:'S1',mode:'S',color:'#2e7c56',minutes:10,stops:['Flughafen Guadalajara','Tlaquepaque','Guadalajara Hbf','Zapopan Zentrum']},
      {id:'S2',mode:'S',color:'#c7831e',minutes:10,stops:['Tonalá','Guadalajara Hbf','Zapopan Nord']},
      {id:'S3',mode:'S',color:'#3f5fa5',minutes:15,stops:['El Salto','Tlaquepaque','Guadalajara Hbf','Tesistán']},
      {id:'S4',mode:'S',color:'#a44670',minutes:15,stops:['Tlajomulco','Südpark','Guadalajara Hbf','Zapopan Zentrum']},
      {id:'S7',mode:'S',color:'#3b8b8b',minutes:30,stops:['Chapala','Flughafen Guadalajara','Guadalajara Hbf']}
    ]),
  city('LOW','Löwenstadt','León','#6947a5',['U','S'],['Flughafen Löwenstadt','Silao','Löwenstadt Hbf','Nordtor','Industriezentrum','Universität','San Francisco','Purísima','Romita','Ostpark'],[
      {id:'U1',mode:'U',color:'#7650b4',minutes:5,stops:['Nordtor','Löwenstadt Hbf','Universität','Industriezentrum']},
      {id:'U2',mode:'U',color:'#ce4b57',minutes:6,stops:['Ostpark','Löwenstadt Hbf','San Francisco']},
      {id:'S1',mode:'S',color:'#2e7c56',minutes:15,stops:['Flughafen Löwenstadt','Silao','Löwenstadt Hbf','Nordtor']},
      {id:'S2',mode:'S',color:'#c7831e',minutes:15,stops:['San Francisco','Löwenstadt Hbf','Industriezentrum']},
      {id:'S3',mode:'S',color:'#3f5fa5',minutes:20,stops:['Purísima','Löwenstadt Hbf','Ostpark']},
      {id:'S4',mode:'S',color:'#a44670',minutes:30,stops:['Romita','Flughafen Löwenstadt','Silao','Löwenstadt Hbf']}
    ]),
  city('KAR','Karlsburg','Querétaro','#286f8e',['U','S'],['Flughafen Karlsburg','El Marqués','Karlsburg Hbf','Corregidora','Zibatá','Industriepark','Apaseo','Juriquilla','Universität','El Pueblito','San Juan del Río'],[
      {id:'U1',mode:'U',color:'#2879a5',minutes:5,stops:['Juriquilla','Universität','Karlsburg Hbf','El Pueblito']},
      {id:'U2',mode:'U',color:'#b54a65',minutes:6,stops:['Zibatá','El Marqués','Karlsburg Hbf','Corregidora']},
      {id:'S1',mode:'S',color:'#2e7c56',minutes:15,stops:['Flughafen Karlsburg','El Marqués','Karlsburg Hbf','Corregidora']},
      {id:'S2',mode:'S',color:'#c7831e',minutes:15,stops:['Zibatá','Karlsburg Hbf','Industriepark','Apaseo']},
      {id:'S3',mode:'S',color:'#3f5fa5',minutes:20,stops:['Juriquilla','Universität','Karlsburg Hbf','El Pueblito']},
      {id:'S4',mode:'S',color:'#a44670',minutes:30,stops:['San Juan del Río','Flughafen Karlsburg','Karlsburg Hbf']}
    ]),
  city('BAD','Badenquellen','Aguascalientes','#9a6b22',['U','S'],['Jesús María','Badenquellen Hbf','Industriepark Süd','San Francisco de los Romo','Flughafen Badenquellen','Pabellón','Calvillo','Badenquellen West'],[
      {id:'U1',mode:'U',color:'#b47a1f',minutes:6,stops:['Jesús María','Badenquellen Hbf','Industriepark Süd']},
      {id:'U2',mode:'U',color:'#4677a7',minutes:7,stops:['Badenquellen West','Badenquellen Hbf','Flughafen Badenquellen']},
      {id:'S1',mode:'S',color:'#2e7c56',minutes:15,stops:['Jesús María','Badenquellen Hbf','Industriepark Süd']},
      {id:'S2',mode:'S',color:'#c7831e',minutes:20,stops:['San Francisco de los Romo','Badenquellen Hbf','Flughafen Badenquellen']},
      {id:'S3',mode:'S',color:'#3f5fa5',minutes:30,stops:['Pabellón','Jesús María','Badenquellen Hbf']},
      {id:'S4',mode:'S',color:'#a44670',minutes:30,stops:['Calvillo','Badenquellen West','Badenquellen Hbf']}
    ]),
  city('SLU','Sankt Ludwig','San Luis Potosí','#4a6b9e',['U','S'],['Mexquitic','Sankt Ludwig Hbf','Soledad','Flughafen Sankt Ludwig','Villa de Reyes','Industriepark','Universität','Pozos','Cerro de San Pedro'],[
      {id:'U1',mode:'U',color:'#4e70a5',minutes:6,stops:['Universität','Sankt Ludwig Hbf','Soledad','Pozos']},
      {id:'U2',mode:'U',color:'#b34b5b',minutes:7,stops:['Industriepark','Sankt Ludwig Hbf','Cerro de San Pedro']},
      {id:'S1',mode:'S',color:'#2e7c56',minutes:15,stops:['Mexquitic','Sankt Ludwig Hbf','Soledad','Flughafen Sankt Ludwig']},
      {id:'S2',mode:'S',color:'#c7831e',minutes:20,stops:['Villa de Reyes','Industriepark','Sankt Ludwig Hbf']},
      {id:'S3',mode:'S',color:'#3f5fa5',minutes:15,stops:['Universität','Sankt Ludwig Hbf','Soledad']},
      {id:'S4',mode:'S',color:'#a44670',minutes:30,stops:['Cerro de San Pedro','Sankt Ludwig Hbf','Pozos']}
    ]),
  city('KAI','Kaiserstadt–Seeburg','Morelia–Pátzcuaro','#7f476d',['U','S'],['Tarímbaro','Kaiserstadt Hbf','Seeburg Hbf','Flughafen Kaiserstadt','Universität','Charo','Quiroga','Kaiserhof','Zinapécuaro'],[
      {id:'U1',mode:'U',color:'#8c4c73',minutes:6,stops:['Tarímbaro','Kaiserstadt Hbf','Universität','Kaiserhof']},
      {id:'U2',mode:'U',color:'#4677a7',minutes:7,stops:['Flughafen Kaiserstadt','Kaiserstadt Hbf','Charo']},
      {id:'S1',mode:'S',color:'#2e7c56',minutes:15,stops:['Tarímbaro','Kaiserstadt Hbf','Seeburg Hbf']},
      {id:'S2',mode:'S',color:'#c7831e',minutes:20,stops:['Flughafen Kaiserstadt','Kaiserstadt Hbf','Universität','Charo']},
      {id:'S3',mode:'S',color:'#3f5fa5',minutes:30,stops:['Quiroga','Seeburg Hbf','Kaiserstadt Hbf']},
      {id:'S4',mode:'S',color:'#a44670',minutes:30,stops:['Zinapécuaro','Flughafen Kaiserstadt','Kaiserstadt Hbf']}
    ]),
  city('GOL','Golfhafen','Tampico','#277b86',['U','S'],['Altamira','Golfhafen Hbf','Ciudad Madero','Hafenviertel','Flughafen Golfhafen','Hafen','Pánuco','Industriehafen'],[
      {id:'U1',mode:'U',color:'#25818e',minutes:6,stops:['Altamira','Golfhafen Hbf','Ciudad Madero','Hafenviertel']},
      {id:'U2',mode:'U',color:'#b34b5b',minutes:7,stops:['Flughafen Golfhafen','Golfhafen Hbf','Hafen']},
      {id:'S1',mode:'S',color:'#2e7c56',minutes:15,stops:['Altamira','Golfhafen Hbf','Ciudad Madero','Hafenviertel']},
      {id:'S2',mode:'S',color:'#c7831e',minutes:20,stops:['Flughafen Golfhafen','Golfhafen Hbf','Hafen']},
      {id:'S3',mode:'S',color:'#3f5fa5',minutes:30,stops:['Pánuco','Golfhafen Hbf','Ciudad Madero']},
      {id:'S4',mode:'S',color:'#a44670',minutes:30,stops:['Industriehafen','Altamira','Flughafen Golfhafen','Ciudad Madero']}
    ]),
  city('PAZ','Pazifikhafen','Tepic','#397a57',['U','S'],['Xalisco','Pazifikhafen Hbf','Flughafen Pazifikhafen','Bellavista','Universität','San Blas','Küstenstadt'],[
      {id:'U1',mode:'U',color:'#397f5b',minutes:7,stops:['Xalisco','Pazifikhafen Hbf','Flughafen Pazifikhafen']},
      {id:'U2',mode:'U',color:'#4677a7',minutes:8,stops:['Bellavista','Pazifikhafen Hbf','Universität']},
      {id:'S1',mode:'S',color:'#2e7c56',minutes:15,stops:['Xalisco','Pazifikhafen Hbf','Flughafen Pazifikhafen']},
      {id:'S2',mode:'S',color:'#c7831e',minutes:20,stops:['Bellavista','Pazifikhafen Hbf','Universität']},
      {id:'S3',mode:'S',color:'#3f5fa5',minutes:30,stops:['San Blas','Küstenstadt','Pazifikhafen Hbf']}
    ]),
  city('VUL','Vulkanstadt','Colima','#a14d3e',['U','S'],['Comala','Villa de Álvarez','Vulkanstadt Hbf','Flughafen Vulkanstadt','Cuauhtémoc','Universität','Coquimatlán'],[
      {id:'U1',mode:'U',color:'#a65141',minutes:7,stops:['Comala','Villa de Álvarez','Vulkanstadt Hbf','Flughafen Vulkanstadt']},
      {id:'U2',mode:'U',color:'#4677a7',minutes:8,stops:['Universität','Vulkanstadt Hbf','Coquimatlán']},
      {id:'S1',mode:'S',color:'#2e7c56',minutes:15,stops:['Comala','Villa de Álvarez','Vulkanstadt Hbf','Flughafen Vulkanstadt']},
      {id:'S2',mode:'S',color:'#c7831e',minutes:30,stops:['Cuauhtémoc','Flughafen Vulkanstadt','Vulkanstadt Hbf']},
      {id:'S3',mode:'S',color:'#3f5fa5',minutes:20,stops:['Coquimatlán','Universität','Vulkanstadt Hbf']}
    ]),
  city('MAN','Manzanillo','Manzanillo','#2f6f94',['U','S'],['Flughafen Manzanillo','Santiago','Manzanillo Hbf','Hafen','Brisas','Zentrum','Industriehafen','Cihuatlán'],[
      {id:'U1',mode:'U',color:'#33769b',minutes:7,stops:['Santiago','Manzanillo Hbf','Hafen']},
      {id:'U2',mode:'U',color:'#a64b62',minutes:8,stops:['Brisas','Zentrum','Industriehafen']},
      {id:'S1',mode:'S',color:'#2e7c56',minutes:15,stops:['Flughafen Manzanillo','Santiago','Manzanillo Hbf','Hafen']},
      {id:'S2',mode:'S',color:'#c7831e',minutes:20,stops:['Brisas','Zentrum','Industriehafen']},
      {id:'S3',mode:'S',color:'#3f5fa5',minutes:30,stops:['Cihuatlán','Flughafen Manzanillo','Manzanillo Hbf']}
    ])
];

export const SUBSCRIPTIONS = [
  {id:'JUGEND',name:'Galizien-Ticket Jugend',price:39,eligibility:'Bis 27 Jahre oder mit Studiennachweis',features:['Nahverkehr in ganz Galizien','2. Klasse','Monatlich kündbar']},
  {id:'STANDARD',name:'Galizien-Ticket Standard',price:59,eligibility:'Für alle Reisenden',features:['U-Bahn, S-Bahn, RB, RE, Tram und Bus','2. Klasse','Monatlich kündbar']},
  {id:'PLUS',name:'Galizien-Ticket Plus',price:79,eligibility:'Für flexible Freizeitmobilität',features:['Alle Standard-Leistungen','Fahrrad inklusive','Eine Begleitperson am Wochenende']},
  {id:'BUSINESS',name:'Galizien-Ticket Business',price:99,eligibility:'Für berufliche Mobilität',features:['Alle Standard-Leistungen','15 % Rabatt auf IC/ICE','Flexible Rechnungsadresse']}
];

export const FARES = [
  {id:'SUPER',name:'Super Sparpreis',factor:.72,refundable:false,changeable:false,seat:false},
  {id:'SAVER',name:'Sparpreis',factor:.86,refundable:'fee',changeable:'fee',seat:false},
  {id:'FLEX',name:'Flexpreis',factor:1,refundable:true,changeable:true,seat:false},
  {id:'BUSINESS',name:'Business Flex',factor:1.32,refundable:true,changeable:true,seat:true},
  {id:'INTL',name:'International Flex',factor:1.18,refundable:true,changeable:true,seat:true,international:true}
];

export const SERVICE_ALERTS = [
  {id:'IC-KAR-SLU',severity:'warning',modes:['IC'],title:'Bauarbeiten Karlsburg–Sankt Ludwig',text:'IC-Züge erhalten 8–12 Minuten zusätzliche Fahrzeit.',delay:10},
  {id:'RE-WEST',severity:'warning',modes:['RE'],title:'RE West: eingeschränkter Betrieb',text:'Einige Regionalzüge enden vorzeitig in Pazifikhafen.',delay:6},
  {id:'EC-MEX',severity:'info',modes:['EC','NJ'],title:'Verstärkte Grenzkontrollen nach Mexiko',text:'Bundespolizei und Zoll führen Dokumenten- und Identitätskontrollen durch.',delay:15},
  {id:'S-GDL',severity:'ok',modes:['S','U'],title:'Stadtverkehr Guadalajara',text:'Normalbetrieb auf allen U- und S-Bahn-Linien.',delay:0}
];

export const COPY = {
  de:{navHome:'Start',navTravel:'Reisen',navCity:'Stadt',navTickets:'Tickets',navProfile:'Profil',greeting:'Guten Tag',tagline:'Deine Mobilität in Galizien.',nextTrip:'Nächste Reise',search:'Verbindung suchen',cityTravel:'In der Stadt',network:'Streckennetz',operations:'Betriebslage',tickets:'Meine Tickets',profile:'Profil',from:'Von',to:'Nach',date:'Datum',time:'Zeit',passengers:'Reisende',travelClass:'Klasse',find:'Suchen',connections:'Verbindungen',direct:'Direkt',changes:'Umstiege',platform:'Gleis',duration:'Dauer',onTime:'Pünktlich',delayed:'Verspätet',fare:'Tarif',continue:'Weiter',back:'Zurück',book:'Buchen',seat:'Sitzplatz',traveler:'Reisende',extras:'Extras',payment:'Zahlung',confirm:'Bestätigen',demoPayment:'Demo-Zahlung — keine echten Kartendaten eingeben.',cardholder:'Karteninhaber',cardNumber:'Testkartennummer',expiry:'Gültig bis',cvv:'CVV',billingAddress:'Rechnungsadresse',country:'Land',pay:'Jetzt bezahlen',approved:'Zahlung genehmigt',declined:'Zahlung abgelehnt',processing:'Zahlung wird verarbeitet',contactingBank:'Bank wird kontaktiert',secureCheck:'3-D Secure wird geprüft',saved:'Gespeichert',ticketBooked:'Ticket wurde ausgestellt',urbanTickets:'Stadttickets',subscriptions:'Abonnements',galizienTicket:'Galizien-Ticket',subscribe:'Jetzt abonnieren',activeSubscription:'Aktives Abonnement',monthly:'pro Monat',validLocal:'Gültig in U-Bahn, S-Bahn, RB, RE, Tram und Bus.',notLongDistance:'Nicht gültig in ICE, IC, EC International oder NightJet.',mexicoLimit:'Nur bis Grenzmarkt gültig; für Mexiko ist ein separates internationales Ticket erforderlich.',departures:'Nächste Abfahrten',lines:'Linien',minutes:'Min.',frequency:'Takt',urbanPlanner:'Stadtverbindung planen',noRoute:'Keine Verbindung gefunden',buyTicket:'Ticket kaufen',singleTicket:'Einzelfahrt',dayTicket:'Tageskarte',seatSelection:'Sitzplatz auswählen',window:'Fenster',aisle:'Gang',table:'Tisch',quiet:'Ruhebereich',bike:'Fahrrad',firstClass:'1. Klasse',secondClass:'2. Klasse',international:'International',passportRequired:'Reisepass erforderlich',federalPolice:'Hinweis der Bundespolizei',borderText:'Bei Reisen nach Mexiko finden Grenz- und Identitätskontrollen statt. Reisepass sowie gegebenenfalls Visum oder Einreisegenehmigung bereithalten.',arriveEarly:'Bitte 30 Minuten vor Abfahrt am Bahnhof sein.',connectionSafe:'Anschluss gesichert',connectionRisk:'Anschluss gefährdet',connectionMissed:'Anschluss verpasst',alternative:'Alternative Verbindung',nightTrain:'Nachtzug',cabin:'Kabine',bed:'Liegeplatz',operationsTitle:'Aktuelle Betriebslage',normal:'Normalbetrieb',minor:'Geringe Störungen',disrupted:'Störung',account:'Konto',settings:'Einstellungen',language:'Sprache',appearance:'Darstellung',install:'App installieren',purchaseHistory:'Kaufverlauf',paymentMethods:'Zahlungsmethoden',demoOnly:'Nur Testdaten; keine echten Zahlungsinformationen werden gespeichert.',delete:'Löschen',open:'Öffnen',live:'Live',networkMap:'Netzplan',station:'Bahnhof',service:'Verkehrsmittel',validUntil:'Gültig bis',renewal:'Nächste Verlängerung',cancelSubscription:'Abo kündigen',subscriptionCancelled:'Abonnement gekündigt',noTickets:'Noch keine Tickets',noTicketsText:'Buche eine Verbindung oder ein Abonnement.',all:'Alle',longDistance:'Fernverkehr',urban:'Stadtverkehr',online:'Online',offline:'Offline',cancel:'Abbrechen',close:'Schließen',cancelPurchase:'Kauf abbrechen',cancelQuestion:'Möchtest du den Kauf wirklich abbrechen?',cancelWarning:'Deine Auswahl bleibt nur erhalten, wenn du zum Kauf zurückkehrst.',keepBuying:'Kauf fortsetzen',discardPurchase:'Kauf verwerfen',previousStep:'Vorheriger Schritt',selectLanguage:'Wähle die Sprache der App.',selected:'Ausgewählt',system:'Automatisch',light:'Hell',dark:'Dunkel',updateAvailable:'Eine neue Version ist verfügbar.',updateNow:'Jetzt aktualisieren',reviewOrder:'Bestellung prüfen',subtotal:'Zwischensumme',seatReservation:'Sitzplatzreservierung',occupied:'Besetzt',chosen:'Ausgewählt',nameRequired:'Name erforderlich',documentsConfirm:'Ich bestätige, dass gültige Einreisedokumente vorliegen.',passportDemo:'Reisepassnummer (Demo)',saveTestCard:'Testkarte merken (nur Marke und letzte 4 Ziffern)',cardHelp:'Nur Testkarten verwenden. Visa 4242…, Mastercard 5555…, 4000…0002 wird abgelehnt.',services:'Services',stations:'Stationen',arrival:'Ankunft',departure:'Abfahrt',speed:'Geschwindigkeit',simulatedLive:'Simulierte Position und Geschwindigkeit.',testCardMissing:'Keine Testkarte gespeichert',journeys:'Reisen',points:'Punkte',cancelled:'Abgebrochen',purchaseCancelled:'Kauf abgebrochen',price:'Preis'},
  es:{navHome:'Inicio',navTravel:'Viajes',navCity:'Ciudad',navTickets:'Boletos',navProfile:'Perfil',greeting:'Buenas tardes',tagline:'Tu movilidad en Galizia.',nextTrip:'Próximo viaje',search:'Buscar conexión',cityTravel:'En la ciudad',network:'Red ferroviaria',operations:'Estado de operación',tickets:'Mis boletos',profile:'Perfil',from:'Origen',to:'Destino',date:'Fecha',time:'Hora',passengers:'Pasajeros',travelClass:'Clase',find:'Buscar',connections:'Conexiones',direct:'Directo',changes:'Transbordos',platform:'Andén',duration:'Duración',onTime:'Puntual',delayed:'Retrasado',fare:'Tarifa',continue:'Continuar',back:'Atrás',book:'Reservar',seat:'Asiento',traveler:'Pasajero',extras:'Extras',payment:'Pago',confirm:'Confirmar',demoPayment:'Pago de demostración — no introduzcas datos reales de tarjeta.',cardholder:'Titular',cardNumber:'Número de tarjeta de prueba',expiry:'Vencimiento',cvv:'CVV',billingAddress:'Dirección de facturación',country:'País',pay:'Pagar ahora',approved:'Pago autorizado',declined:'Pago rechazado',processing:'Procesando pago',contactingBank:'Contactando al banco',secureCheck:'Verificando 3-D Secure',saved:'Guardado',ticketBooked:'Boleto emitido',urbanTickets:'Boletos urbanos',subscriptions:'Suscripciones',galizienTicket:'Galizien-Ticket',subscribe:'Suscribirse',activeSubscription:'Suscripción activa',monthly:'al mes',validLocal:'Válido en U-Bahn, S-Bahn, RB, RE, tranvía y autobús.',notLongDistance:'No válido en ICE, IC, EC International ni NightJet.',mexicoLimit:'Solo es válido hasta Grenzmarkt; para México se necesita un boleto internacional separado.',departures:'Próximas salidas',lines:'Líneas',minutes:'min',frequency:'Frecuencia',urbanPlanner:'Planear conexión urbana',noRoute:'No se encontró conexión',buyTicket:'Comprar boleto',singleTicket:'Viaje sencillo',dayTicket:'Pase diario',seatSelection:'Seleccionar asiento',window:'Ventana',aisle:'Pasillo',table:'Mesa',quiet:'Zona silenciosa',bike:'Bicicleta',firstClass:'1.ª clase',secondClass:'2.ª clase',international:'Internacional',passportRequired:'Pasaporte obligatorio',federalPolice:'Aviso de la Bundespolizei',borderText:'En viajes hacia México se realizan controles fronterizos y de identidad. Ten disponible el pasaporte y, cuando corresponda, visa o autorización de entrada.',arriveEarly:'Llega 30 minutos antes de la salida.',connectionSafe:'Conexión garantizada',connectionRisk:'Conexión en riesgo',connectionMissed:'Conexión perdida',alternative:'Conexión alternativa',nightTrain:'Tren nocturno',cabin:'Cabina',bed:'Litera',operationsTitle:'Estado actual de la red',normal:'Operación normal',minor:'Incidencias menores',disrupted:'Interrupción',account:'Cuenta',settings:'Configuración',language:'Idioma',appearance:'Apariencia',install:'Instalar app',purchaseHistory:'Historial de compras',paymentMethods:'Métodos de pago',demoOnly:'Solo datos de prueba; no se guardan datos reales de pago.',delete:'Eliminar',open:'Abrir',live:'En vivo',networkMap:'Mapa de red',station:'Estación',service:'Servicio',validUntil:'Válido hasta',renewal:'Próxima renovación',cancelSubscription:'Cancelar suscripción',subscriptionCancelled:'Suscripción cancelada',noTickets:'Todavía no hay boletos',noTicketsText:'Reserva una conexión o suscripción.',all:'Todos',longDistance:'Larga distancia',urban:'Transporte urbano',online:'En línea',offline:'Sin conexión',cancel:'Cancelar',close:'Cerrar',cancelPurchase:'Cancelar compra',cancelQuestion:'¿Quieres cancelar esta compra?',cancelWarning:'Tu selección solo se conservará si vuelves al proceso de compra.',keepBuying:'Continuar compra',discardPurchase:'Descartar compra',previousStep:'Paso anterior',selectLanguage:'Selecciona el idioma de la aplicación.',selected:'Seleccionado',system:'Automático',light:'Claro',dark:'Oscuro',updateAvailable:'Hay una nueva versión disponible.',updateNow:'Actualizar ahora',reviewOrder:'Revisar pedido',subtotal:'Subtotal',seatReservation:'Reserva de asiento',occupied:'Ocupado',chosen:'Seleccionado',nameRequired:'El nombre es obligatorio',documentsConfirm:'Confirmo que cuento con documentos válidos de entrada.',passportDemo:'Número de pasaporte (demo)',saveTestCard:'Recordar tarjeta de prueba (solo marca y últimos 4 dígitos)',cardHelp:'Usa únicamente tarjetas de prueba. Visa 4242…, Mastercard 5555…, 4000…0002 se rechaza.',services:'Servicios',stations:'Estaciones',arrival:'Llegada',departure:'Salida',speed:'Velocidad',simulatedLive:'Posición y velocidad simuladas.',testCardMissing:'No hay tarjeta de prueba guardada',journeys:'Viajes',points:'Puntos',cancelled:'Cancelado',purchaseCancelled:'Compra cancelada',price:'Precio'},
  en:{navHome:'Home',navTravel:'Travel',navCity:'City',navTickets:'Tickets',navProfile:'Profile',greeting:'Good afternoon',tagline:'Your mobility across Galizia.',nextTrip:'Next trip',search:'Find a connection',cityTravel:'In the city',network:'Rail network',operations:'Operations',tickets:'My tickets',profile:'Profile',from:'From',to:'To',date:'Date',time:'Time',passengers:'Passengers',travelClass:'Class',find:'Search',connections:'Connections',direct:'Direct',changes:'Changes',platform:'Platform',duration:'Duration',onTime:'On time',delayed:'Delayed',fare:'Fare',continue:'Continue',back:'Back',book:'Book',seat:'Seat',traveler:'Traveller',extras:'Extras',payment:'Payment',confirm:'Confirm',demoPayment:'Demo payment — do not enter real card details.',cardholder:'Cardholder',cardNumber:'Test card number',expiry:'Expiry',cvv:'CVV',billingAddress:'Billing address',country:'Country',pay:'Pay now',approved:'Payment approved',declined:'Payment declined',processing:'Processing payment',contactingBank:'Contacting bank',secureCheck:'Checking 3-D Secure',saved:'Saved',ticketBooked:'Ticket issued',urbanTickets:'City tickets',subscriptions:'Subscriptions',galizienTicket:'Galizien-Ticket',subscribe:'Subscribe now',activeSubscription:'Active subscription',monthly:'per month',validLocal:'Valid on U-Bahn, S-Bahn, RB, RE, tram and bus.',notLongDistance:'Not valid on ICE, IC, EC International or NightJet.',mexicoLimit:'Valid only to Grenzmarkt; a separate international ticket is required for Mexico.',departures:'Next departures',lines:'Lines',minutes:'min',frequency:'Frequency',urbanPlanner:'Plan a city journey',noRoute:'No connection found',buyTicket:'Buy ticket',singleTicket:'Single ticket',dayTicket:'Day ticket',seatSelection:'Select a seat',window:'Window',aisle:'Aisle',table:'Table',quiet:'Quiet zone',bike:'Bicycle',firstClass:'First class',secondClass:'Second class',international:'International',passportRequired:'Passport required',federalPolice:'Bundespolizei notice',borderText:'Journeys to Mexico are subject to border and identity checks. Keep your passport and, if required, visa or entry authorisation available.',arriveEarly:'Arrive 30 minutes before departure.',connectionSafe:'Connection secured',connectionRisk:'Connection at risk',connectionMissed:'Connection missed',alternative:'Alternative connection',nightTrain:'Night train',cabin:'Cabin',bed:'Berth',operationsTitle:'Current network status',normal:'Normal service',minor:'Minor disruption',disrupted:'Disruption',account:'Account',settings:'Settings',language:'Language',appearance:'Appearance',install:'Install app',purchaseHistory:'Purchase history',paymentMethods:'Payment methods',demoOnly:'Test data only; real payment information is never stored.',delete:'Delete',open:'Open',live:'Live',networkMap:'Network map',station:'Station',service:'Service',validUntil:'Valid until',renewal:'Next renewal',cancelSubscription:'Cancel subscription',subscriptionCancelled:'Subscription cancelled',noTickets:'No tickets yet',noTicketsText:'Book a journey or subscription.',all:'All',longDistance:'Long distance',urban:'City transport',online:'Online',offline:'Offline',cancel:'Cancel',close:'Close',cancelPurchase:'Cancel purchase',cancelQuestion:'Do you want to cancel this purchase?',cancelWarning:'Your selections are kept only if you return to checkout.',keepBuying:'Continue purchase',discardPurchase:'Discard purchase',previousStep:'Previous step',selectLanguage:'Choose the app language.',selected:'Selected',system:'Automatic',light:'Light',dark:'Dark',updateAvailable:'A new version is available.',updateNow:'Update now',reviewOrder:'Review order',subtotal:'Subtotal',seatReservation:'Seat reservation',occupied:'Occupied',chosen:'Selected',nameRequired:'Name is required',documentsConfirm:'I confirm that valid entry documents are available.',passportDemo:'Passport number (demo)',saveTestCard:'Remember test card (brand and last 4 digits only)',cardHelp:'Use test cards only. Visa 4242…, Mastercard 5555…, 4000…0002 is declined.',services:'Services',stations:'Stations',arrival:'Arrival',departure:'Departure',speed:'Speed',simulatedLive:'Simulated position and speed.',testCardMissing:'No test card saved',journeys:'Journeys',points:'Points',cancelled:'Cancelled',purchaseCancelled:'Purchase cancelled',price:'Price'}
};

export const getStation = id => STATIONS.find(s=>s.id===id) || null;
export const getUrbanNetwork = id => URBAN_NETWORKS.find(n=>n.id===id) || URBAN_NETWORKS[0];
