// English / Spanish translations (in-memory only; default English)

const translations = {
  en: {
    skipToContent: 'Skip to content',
    brandTitle: 'OBX Family Itinerary',
    brandDates: 'July 5–11 · Corolla, North Carolina',
    brandViewingAs: 'Viewing as:',
    navFullItinerary: 'Full itinerary →',
    navChangePerson: '← Change person',
    navAdmin: 'Admin',
    themeToggle: '☾ Theme',
    themeAria: 'Switch theme',
    langGroupAria: 'Language',
    langEnglish: 'English',
    langSpanish: 'Español',

    pageTitleIndex: 'OBX Family Trip · RSVP',
    pageTitleRsvp: 'OBX RSVP',
    pageTitleAdmin: 'OBX Admin',

    heroTitle: 'One page for the whole family plan.',
    heroLead: 'Select your name to see your summary, or open the full itinerary to RSVP for each person individually. Headcounts on event cards count people marked Going.',
    chipPerPerson: 'Per-person RSVPs',
    chipLive: 'Live counts',
    chipDinners: 'Group dinners',
    chipMobile: 'Mobile friendly',
    statTripDates: 'Trip dates',
    statHomeBase: 'Home base',
    statGroupDinners: 'Group dinners',
    statActivities: 'Activities',
    statDinnersValue: '5 nights',
    statActivitiesValue: '4 optional',

    sectionWho: 'Who are you?',
    sectionWhoLead: 'Pick your name to highlight your row on the itinerary. You can still update RSVPs for everyone on the trip.',
    dividerAddSelf: 'or add yourself',
    addAttendeeTitle: 'Add an attendee',
    addAttendeeLead: 'Not on the list yet? Enter your details below.',
    labelFullName: 'Full name',
    labelFamilyGroup: 'Family group',
    labelType: 'Type',
    typeAdult: 'Adult',
    typeChild: 'Child',
    placeholderName: 'e.g. Maria Montemayor',
    placeholderFamily: 'e.g. Montemayor Tatum',
    btnJoinTrip: 'Join trip →',
    btnAdding: 'Adding…',
    btnSelect: 'Select →',
    emptyNoAttendees: 'No attendees yet — add yourself below after running the database migration.',
    migrationTitle: 'Database still on family RSVPs',
    migrationBody: 'Open Supabase → SQL Editor and run supabase/migrate-to-attendees.sql. That creates attendees and attendee_rsvps, expands each family headcount into individual rows, and copies existing RSVPs.',

    sidebarAria: 'Your summary',
    sidebarExpandHint: 'Expand activity cards for full details before you RSVP. Counts show individuals marked Going.',
    btnGroupDinners: 'All dinners — my family group',
    btnCopySummary: 'Copy my summary',
    rosterTitle: 'Full trip roster',
    rosterMeta: '{count} attendees',
    navEveryone: 'Everyone',
    summaryTotalGoing: '{total} total Going responses',
    summaryEventsGoing: '{count} events Going',
    summaryDinnersActs: '{dinners} dinners · {acts} activities',
    summaryInGroup: '{count} in your group',
    summaryUpdateHint: 'Update each person on the event cards',

    filterView: 'View',
    filterActivity: 'Activity filters',
    filterAll: 'All events',
    filterDinners: 'Dinners only',
    filterActivities: 'Activities only',
    filterKids: 'Great for kids',
    filterEasy: 'Easier options',
    facetKids: 'Kids friendly',
    facetGrandparent: 'Grandparent friendly',
    facetIndoor: 'Indoor',
    facetOutdoor: 'Outdoor',
    facetReservation: 'Reservation needed',
    facetCorolla: 'Near Corolla',
    facetKdhNags: 'Kill Devil Hills / Nags Head',
    facetRelaxed: 'Relaxed',
    facetHigh: 'High activity',

    itineraryAria: 'Itinerary',
    footerRsvp: 'RSVPs are saved live. Activity cards include effort level and accessibility notes — open “More details” before you decide.',
    footerIndex: 'Powered by Supabase · Changes sync live across all devices.',

    labelDescription: 'Description',
    labelNote: 'Note',
    labelLink: 'Link',
    labelWhosGoing: "Who's going",
    person: 'person',
    people: 'people',
    noConfirmations: 'No confirmations yet',
    reservationNeeded: 'Reservation needed',
    noReservation: 'No reservation required',
    moreDetails: 'More details',
    hideDetails: 'Hide details',
    rsvpByPerson: 'RSVP by person',

    partyMaxHint: 'You can RSVP for up to {max} people per event, including yourself.',
    partySizeLabel: 'Total people in your party, including you',
    partyCapShort: 'Max {max}',
    rsvpByParty: 'RSVP by party',
    extraGuestLabel: 'Optional names for additional guests',
    extraGuestName: 'Guest {n}',
    extraGuestPlaceholder: 'Name (optional)',
    summaryPeopleRepresented: '{total} people across your RSVPs',
    summaryPeopleRepresentedHint: 'Sum of party sizes on events you marked attending',
    summaryAttendeesListed: '{count} people on the roster',
    summaryAllPartyTotal: '{total} people confirmed trip-wide',
    labelMaxPartySize: 'Max party size (including you)',
    partySizeHelp: 'How many people you may count per event RSVP',
    goingYes: 'Going',
    goingNo: 'Not going',
    linkVenue: 'Open venue / activity site',
    linkBoil: 'Book catering / boil',
    activityHighlights: 'Activity highlights',

    detailFullDesc: 'Full description',
    detailBestFor: 'Best for',
    detailEffort: 'Effort level',
    detailIndoorOutdoor: 'Indoor / outdoor',
    detailAccessibility: 'Accessibility',
    detailReservation: 'Reservation info',
    detailFamilyFit: 'Why this fits the trip',
    detailTripNote: 'Trip note',
    indoorOutdoorBoth: 'Indoor & outdoor',
    indoorOutdoorIndoor: 'Indoor',
    indoorOutdoorOutdoor: 'Outdoor',
    effortRelaxed: 'Relaxed',
    effortModerate: 'Moderate',
    effortHigh: 'High activity',
    reservationNeededShort: 'Reservation needed.',

    badgeReservation: 'Reservation',
    badgeOutdoor: 'Outdoor',
    badgeIndoor: 'Indoor option',
    badgeKids: 'Kids friendly',
    badgeGrandparent: 'Grandparent friendly',
    badgeAdventure: 'Adventure',
    badgeAccessible: 'Accessible',

    emptyNoEvents: 'No events match this view or filter. Try clearing activity filters or switching the view.',
    errorLoadTrip: 'Could not load trip data.',
    errorLoadData: 'Failed to load data:',
    btnRetry: 'Retry',
    peopleConfirmed: '{count} people confirmed',

    toastSaveRsvpError: 'Could not save RSVP:',
    toastSelectName: 'Select your name on the home page first.',
    toastDinnersSuccess: 'Marked all dinners Going for {group}.',
    toastDinnersError: 'Could not update dinners:',
    toastCopySelectName: 'Select your name on the home page to copy a personal summary.',
    toastCopySuccess: 'Summary copied to clipboard.',
    toastCopyFail: 'Clipboard copy failed in this browser.',
    toastMigrate: 'Run migrate-to-attendees.sql in Supabase for per-person RSVPs.',
    toastAddAttendeeError: 'Could not add attendee:',
    toastLoadAttendees: 'Could not load attendees — check your Supabase config.',

    eventTypeDinner: 'Dinner',
    eventTypeActivity: 'Activity',
    otherGroup: 'Other'
  },
  es: {
    skipToContent: 'Saltar al contenido',
    brandTitle: 'Itinerario familiar OBX',
    brandDates: '5–11 de julio · Corolla, Carolina del Norte',
    brandViewingAs: 'Viendo como:',
    navFullItinerary: 'Itinerario completo →',
    navChangePerson: '← Cambiar persona',
    navAdmin: 'Admin',
    themeToggle: '☾ Tema',
    themeAria: 'Cambiar tema',
    langGroupAria: 'Idioma',
    langEnglish: 'English',
    langSpanish: 'Español',

    pageTitleIndex: 'Viaje familiar OBX · RSVP',
    pageTitleRsvp: 'RSVP OBX',
    pageTitleAdmin: 'Admin OBX',

    heroTitle: 'Un solo lugar para el plan familiar.',
    heroLead: 'Elige tu nombre para ver tu resumen, o abre el itinerario completo para confirmar asistencia por persona. Los totales en cada evento cuentan personas marcadas como Asistiré.',
    chipPerPerson: 'RSVP por persona',
    chipLive: 'Conteos en vivo',
    chipDinners: 'Cenas grupales',
    chipMobile: 'Compatible con móvil',
    statTripDates: 'Fechas del viaje',
    statHomeBase: 'Base',
    statGroupDinners: 'Cenas grupales',
    statActivities: 'Actividades',
    statDinnersValue: '5 noches',
    statActivitiesValue: '4 opcionales',

    sectionWho: '¿Quién eres?',
    sectionWhoLead: 'Elige tu nombre para resaltar tu fila en el itinerario. Aún puedes actualizar RSVPs de todos en el viaje.',
    dividerAddSelf: 'o agrégate',
    addAttendeeTitle: 'Agregar asistente',
    addAttendeeLead: '¿No estás en la lista? Ingresa tus datos abajo.',
    labelFullName: 'Nombre completo',
    labelFamilyGroup: 'Grupo familiar',
    labelType: 'Tipo',
    typeAdult: 'Adulto',
    typeChild: 'Niño/a',
    placeholderName: 'ej. María Montemayor',
    placeholderFamily: 'ej. Montemayor Tatum',
    btnJoinTrip: 'Unirme al viaje →',
    btnAdding: 'Agregando…',
    btnSelect: 'Elegir →',
    emptyNoAttendees: 'Aún no hay asistentes — agrégate abajo después de ejecutar la migración en la base de datos.',
    migrationTitle: 'La base de datos aún usa RSVPs por familia',
    migrationBody: 'Abre Supabase → Editor SQL y ejecuta supabase/migrate-to-attendees.sql. Crea attendees y attendee_rsvps, expande cada familia en filas individuales y copia los RSVPs existentes.',

    sidebarAria: 'Tu resumen',
    sidebarExpandHint: 'Expande las tarjetas de actividades para ver detalles antes de confirmar. Los totales muestran personas marcadas como Asistiré.',
    btnGroupDinners: 'Todas las cenas — mi grupo familiar',
    btnCopySummary: 'Copiar mi resumen',
    rosterTitle: 'Lista completa del viaje',
    rosterMeta: '{count} asistentes',
    navEveryone: 'Todos',
    summaryTotalGoing: '{total} respuestas Asistiré en total',
    summaryEventsGoing: '{count} eventos — Asistiré',
    summaryDinnersActs: '{dinners} cenas · {acts} actividades',
    summaryInGroup: '{count} en tu grupo',
    summaryUpdateHint: 'Actualiza a cada persona en las tarjetas de eventos',

    filterView: 'Vista',
    filterActivity: 'Filtros de actividades',
    filterAll: 'Todos los eventos',
    filterDinners: 'Solo cenas',
    filterActivities: 'Solo actividades',
    filterKids: 'Ideal para niños',
    filterEasy: 'Opciones más fáciles',
    facetKids: 'Apto para niños',
    facetGrandparent: 'Apto para abuelos',
    facetIndoor: 'Interior',
    facetOutdoor: 'Exterior',
    facetReservation: 'Reservación requerida',
    facetCorolla: 'Cerca de Corolla',
    facetKdhNags: 'Kill Devil Hills / Nags Head',
    facetRelaxed: 'Relajado',
    facetHigh: 'Alta actividad',

    itineraryAria: 'Itinerario',
    footerRsvp: 'Los RSVPs se guardan en vivo. Las actividades incluyen esfuerzo y accesibilidad — abre «Más detalles» antes de decidir.',
    footerIndex: 'Con Supabase · Los cambios se sincronizan en todos los dispositivos.',

    labelDescription: 'Descripción',
    labelNote: 'Nota',
    labelLink: 'Enlace',
    labelWhosGoing: 'Quién asiste',
    person: 'persona',
    people: 'personas',
    noConfirmations: 'Sin confirmaciones aún',
    reservationNeeded: 'Reservación requerida',
    noReservation: 'Sin reservación requerida',
    moreDetails: 'Más detalles',
    hideDetails: 'Ocultar detalles',
    rsvpByPerson: 'RSVP por persona',

    partyMaxHint: 'Puedes confirmar hasta {max} personas por evento, incluyéndote.',
    partySizeLabel: 'Total de personas en tu grupo, incluyéndote',
    partyCapShort: 'Máx. {max}',
    rsvpByParty: 'RSVP por grupo',
    extraGuestLabel: 'Nombres opcionales de invitados adicionales',
    extraGuestName: 'Invitado {n}',
    extraGuestPlaceholder: 'Nombre (opcional)',
    summaryPeopleRepresented: '{total} personas en tus RSVPs',
    summaryPeopleRepresentedHint: 'Suma de tamaños de grupo en eventos con asistencia',
    summaryAttendeesListed: '{count} personas en la lista',
    summaryAllPartyTotal: '{total} personas confirmadas en el viaje',
    labelMaxPartySize: 'Tamaño máximo del grupo (incluyéndote)',
    partySizeHelp: 'Cuántas personas puedes contar por evento',
    goingYes: 'Asistiré',
    goingNo: 'No asistiré',
    linkVenue: 'Abrir sitio del lugar / actividad',
    linkBoil: 'Reservar catering / boil',
    activityHighlights: 'Destacados de la actividad',

    detailFullDesc: 'Descripción completa',
    detailBestFor: 'Ideal para',
    detailEffort: 'Nivel de esfuerzo',
    detailIndoorOutdoor: 'Interior / exterior',
    detailAccessibility: 'Accesibilidad',
    detailReservation: 'Info de reservación',
    detailFamilyFit: 'Por qué encaja en el viaje',
    detailTripNote: 'Nota del viaje',
    indoorOutdoorBoth: 'Interior y exterior',
    indoorOutdoorIndoor: 'Interior',
    indoorOutdoorOutdoor: 'Exterior',
    effortRelaxed: 'Relajado',
    effortModerate: 'Moderado',
    effortHigh: 'Alta actividad',
    reservationNeededShort: 'Reservación requerida.',

    badgeReservation: 'Reservación',
    badgeOutdoor: 'Exterior',
    badgeIndoor: 'Opción interior',
    badgeKids: 'Apto para niños',
    badgeGrandparent: 'Apto para abuelos',
    badgeAdventure: 'Aventura',
    badgeAccessible: 'Accesible',

    emptyNoEvents: 'Ningún evento coincide con esta vista o filtro. Prueba quitar filtros o cambiar la vista.',
    errorLoadTrip: 'No se pudo cargar el viaje.',
    errorLoadData: 'Error al cargar:',
    btnRetry: 'Reintentar',
    peopleConfirmed: '{count} personas confirmadas',

    toastSaveRsvpError: 'No se pudo guardar el RSVP:',
    toastSelectName: 'Primero elige tu nombre en la página principal.',
    toastDinnersSuccess: 'Todas las cenas marcadas Asistiré para {group}.',
    toastDinnersError: 'No se pudieron actualizar las cenas:',
    toastCopySelectName: 'Elige tu nombre en la página principal para copiar tu resumen.',
    toastCopySuccess: 'Resumen copiado al portapapeles.',
    toastCopyFail: 'No se pudo copiar en este navegador.',
    toastMigrate: 'Ejecuta migrate-to-attendees.sql en Supabase para RSVPs por persona.',
    toastAddAttendeeError: 'No se pudo agregar asistente:',
    toastLoadAttendees: 'No se pudieron cargar asistentes — revisa la configuración de Supabase.',

    eventTypeDinner: 'Cena',
    eventTypeActivity: 'Actividad',
    otherGroup: 'Otro'
  }
};

/** Spanish copy for seeded / common events (matched on English source fields). */
const EVENT_LOCALES = [
  {
    match: ev => /arrival.*first group|la dolce vita/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Llegada + primera cena grupal',
      area: 'Corolla',
      description: 'Cena relajada de la primera noche en Corolla con comida italiana, pizza, pasta y platos clásicos reconfortantes. Mantiene la noche cerca de la casa y añade variedad más allá del marisco.',
      note: 'Meta de reservación: 14 personas. Elegida como opción más cercana en Corolla con mayor atractivo más allá del marisco.'
    }
  },
  {
    match: ev => /waterfront group dinner|miller/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Cena grupal frente al agua',
      area: 'Nags Head / lado del sound',
      description: 'Cena al atardecer sobre el sound — más al sur mientras el grupo ya está por esa zona.',
      note: 'El conteo puede ser aproximado. Las cenas se mantienen en Corolla salvo que las actividades del día nos lleven más al sur.'
    }
  },
  {
    match: ev => /wild horse/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Tour de caballos salvajes',
      area: 'Corolla',
      description: 'Tour guiado todoterreno (~2 horas) con avistamiento de caballos y historia local en Corolla.',
      note: 'La familia MG preguntó por esto; también se puede registrar RSVP aquí.',
      short_description: 'Tour guiado (~2 h) — caballos salvajes e historia de Corolla.',
      full_description: 'Experiencia guiada por playa y caminos de Corolla, normalmente unas dos horas, con caballos Banker e historia local. Viaje con baches — reserve con anticipación en verano.',
      best_for: 'Familias con niños, amantes de la naturaleza, visitantes que quieren la experiencia emblemática de Corolla',
      effort_level: 'relaxed',
      accessibility: 'Solo vehículos 4x4; no accesible en silla de ruedas. Mejor para quien tolera el movimiento.',
      reservation_info: 'Reservación requerida — reserve con anticipación en verano.',
      family_fit: 'Muy familiar para niños; abróchense y usen bloqueador.'
    }
  },
  {
    match: ev => /kayak/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Tour en kayak',
      area: 'Alligator River',
      description: 'Kayak en aguas tranquilas para adultos y niños.',
      note: 'Mencionado actualmente para Robertha y Pia.',
      short_description: 'Paseo en aguas tranquilas por Alligator River — vida silvestre y canales.',
      full_description: 'Tours guiados en canales protegidos — aves, tortugas y paisaje de marisma. Algunos operadores reciben niños con adultos. Sol, zapatos para el agua y unas horas en el río.',
      best_for: 'Amantes de la naturaleza, familias activas con niños mayores',
      effort_level: 'moderate',
      accessibility: 'Requiere entrar y salir del kayak; consulte opciones adaptadas.',
      reservation_info: 'Reservación requerida; las mañanas suelen ser más calmadas.',
      family_fit: 'Bueno desde edad escolar; menos ideal para pequeños.'
    }
  },
  {
    match: ev => /varied menu|agave roja/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Cena grupal de menú variado',
      area: 'Corolla',
      description: 'Cena mexicana y latina en Corolla con mariscos, carnes, pollo y opciones vegetarianas — alternativa al buffet de mariscos. Cena en Corolla después del kayak más al sur.',
      note: 'Meta de reservación: 19 personas. Las cenas se mantienen en Corolla salvo que las actividades del día nos lleven más al sur.'
    }
  },
  {
    match: ev => /seafood buffet|captain george/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Cena buffet de mariscos',
      area: 'Kill Devil Hills',
      description: 'Noche clásica de mariscos para grupo grande.',
      note: 'Meta de reservación: 19 personas.'
    }
  },
  {
    match: ev => /roanoke|manteo|bodie|1587/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Cena Roanoke / Manteo / Bodie',
      area: 'Manteo',
      description: 'Opción de cena en Manteo que mantiene al grupo cerca de los planes de Roanoke / Bodie del día y añade variedad más allá de platos muy centrados en mariscos.',
      note: 'Rango de reservación: 15–19 personas. Actualizada para más variedad y para alinear la cena con la zona de Manteo.'
    }
  },
  {
    match: ev => /horseback|equine/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Paseo a caballo en la playa',
      area: 'Frisco / Hatteras',
      description: 'Experiencia emblemática de cabalgata en la playa.',
      note: 'La familia MG quiere las 4 plazas.',
      short_description: 'Cabalgata en la playa de Hatteras — lista de deseos.',
      full_description: 'Paseo por la orilla con guías en Hatteras Island. Viaje largo desde Corolla; requiere reservación. Límites de edad y peso; pantalón largo y zapatos cerrados.',
      best_for: 'Amantes de caballos, familias con adolescentes, día en Hatteras',
      effort_level: 'moderate',
      accessibility: 'Hay que montar y desmontar; llame para adaptaciones.',
      reservation_info: 'Reservación requerida — los horarios populares se agotan.',
      family_fit: 'Memorable para la edad adecuada; confirme edad mínima con niños.'
    }
  },
  {
    match: ev => /fishing day|fishing charter|family fishing/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Día de pesca en OBX',
      area: 'Corolla / Outer Banks',
      description: 'Día de pesca familiar en Outer Banks: charter, viaje costero corto u opción más relajada. Buena alternativa al paseo a caballo.',
      note: 'Se recomienda reservar con anticipación, especialmente en julio.',
      short_description: 'Pesca familiar en OBX — charter, costa o salida relajada; menos intenso que cabalgata.',
      full_description: 'Planee un día de pesca familiar: charter de medio día, viaje costero desde Corolla o pesca en muelle/sound. Ideal para quienes quieren actividad al aire libre el 10 de julio sin el viaje largo a Hatteras.',
      best_for: 'Familias que prefieren algo más tranquilo, principiantes, quienes no van a caballo',
      effort_level: 'relaxed',
      accessibility: 'Los charters varían; pregunte por mareo y asientos. El muelle puede ser más accesible.',
      reservation_info: 'Reservación recomendada con anticipación, sobre todo en julio.',
      family_fit: 'Buena alternativa el 10 de julio; confirme edades mínimas con el charter.'
    }
  },
  {
    match: ev => /final dinner.*boil|outer banks boil/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Cena final + seafood boil en la casa',
      area: 'Corolla',
      description: 'No es restaurante — seafood boil caterizado en la renta (o ollas para cocinar en casa). Pueden montar, cocinar y limpiar para la última noche en Corolla casi sin manejar.',
      note: 'Meta de catering / personas: 14. Solicite disponibilidad en Book Your Boil en su sitio.'
    }
  },
  {
    match: ev => /final dinner|blue moon/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Cena final + brindis',
      area: 'Nags Head',
      description: 'Cena de cierre familiar con brindis de despedida.',
      note: 'Meta de reservación: 14 personas.'
    }
  },
  {
    match: ev => /hang glid/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Clase de ala delta',
      area: 'Jockey\'s Ridge',
      description: 'Lección opcional para los más aventureros del grupo.',
      note: 'Salvador y Eva quieren reservar.',
      short_description: 'Ala delta desde las dunas — reserve con anticipación.',
      full_description: 'Una de las experiencias emblemáticas de Outer Banks: vuelo tandem desde las dunas con instructores certificados. Depende del clima; registro anticipado; edad y peso mínimos.',
      best_for: 'Adolescentes y adultos, cumpleaños, buscadores de emoción',
      effort_level: 'high',
      accessibility: 'Requisitos del operador; no apto para todas las movilidades.',
      reservation_info: 'Registro anticipado — reserve temprano en temporada alta.',
      family_fit: 'Mejor para adolescentes y adultos; espectadores bienvenidos en las dunas.'
    }
  },
  {
    match: ev => /wright brothers/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Monumento Nacional Wright Brothers',
      area: 'Kill Devil Hills',
      description: 'Sitio histórico del primer vuelo con museo y monumento.',
      note: 'Día cultural opcional al explorar el sur.',
      short_description: 'Sitio del primer vuelo con museo, monumento y vistas costeras.',
      full_description: 'Incluye centro de visitantes con exhibiciones interactivas, la línea de vuelo de 1903 y un monumento en la colina con amplias vistas sobre dunas y sound. Caminos fáciles e interiores para edades mixtas.',
      best_for: 'Amantes de la historia, primera visita a OBX, niños en edad escolar y abuelos',
      effort_level: 'relaxed',
      accessibility: 'Caminos pavimentados al monumento; centro accesible. Dunas opcionales y arenosas.',
      reservation_info: 'Entrada al parque; sin boleto horario en la mayoría de visitas.',
      family_fit: 'Excelente para varias generaciones — interiores, caminatas cortas y vistas.'
    }
  },
  {
    match: ev => /jockey.*ridge dunes|jockey's ridge dunes/i.test(`${ev.title} ${ev.restaurant}`),
    es: {
      title: 'Dunas y atardecer en Jockey\'s Ridge',
      area: 'Nags Head',
      description: 'Sistema de dunas vivas más alto de la costa atlántica.',
      note: 'Combínalo con ala delta o visítalo solo.',
      short_description: 'Dunas vivas más altas de la costa atlántica — atardecer, cometas y caminatas.',
      full_description: 'Parque estatal con dunas amplias, cometas, atardeceres y caminatas cortas. El ala delta despega cerca pero no requiere reservar vuelo para visitar el parque.',
      best_for: 'Atardeceres, niños activos, fotógrafos, grupos mixtos',
      effort_level: 'moderate',
      accessibility: 'Pasarela accesible; subir dunas es arena irregular.',
      reservation_info: 'Sin reservación para entrar al parque.',
      family_fit: 'Genial para niños con energía; abuelos pueden preferir la pasarela.'
    }
  }
];

let currentLang = 'en';
const languageListeners = [];

function t(key, vars = {}) {
  const dict = translations[currentLang] || translations.en;
  let str = dict[key] ?? translations.en[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  });
  return str;
}

function translateDay(day) {
  if (currentLang !== 'es' || !day) return day;
  return String(day).replace(/^Day (\d+)/i, (_, n) => `Día ${n}`);
}

function stashEventEnglish(ev) {
  if (!ev._en) {
    ev._en = {
      day: ev.day,
      date: ev.date,
      title: ev.title,
      area: ev.area,
      restaurant: ev.restaurant,
      description: ev.description,
      note: ev.note,
      short_description: ev.short_description,
      full_description: ev.full_description,
      best_for: ev.best_for,
      accessibility: ev.accessibility,
      reservation_info: ev.reservation_info,
      family_fit: ev.family_fit
    };
  }
  return ev;
}

function localizeEvent(ev) {
  stashEventEnglish(ev);
  if (currentLang === 'en') {
    Object.assign(ev, ev._en);
    return ev;
  }
  const patch = EVENT_LOCALES.find(loc => loc.match(ev._en))?.es;
  if (patch) {
    Object.keys(patch).forEach(k => {
      if (patch[k]) ev[k] = patch[k];
    });
  }
  ev.day = translateDay(ev._en.day);
  return ev;
}

function localizeEvents(list) {
  return list.map(ev => localizeEvent({ ...ev }));
}

function effortLabelI18n(level) {
  if (level === 'relaxed') return t('effortRelaxed');
  if (level === 'high') return t('effortHigh');
  return t('effortModerate');
}

function indoorOutdoorI18n(value) {
  if (value === 'both') return t('indoorOutdoorBoth');
  if (value === 'indoor') return t('indoorOutdoorIndoor');
  return t('indoorOutdoorOutdoor');
}

function badgeLabelI18n(key, fallback) {
  const map = {
    reservation: 'badgeReservation',
    outdoor: 'badgeOutdoor',
    indoor: 'badgeIndoor',
    kids: 'badgeKids',
    gp: 'badgeGrandparent',
    adventure: 'badgeAdventure',
    accessible: 'badgeAccessible'
  };
  return map[key] ? t(map[key]) : fallback;
}

function applyI18nDom() {
  document.documentElement.lang = currentLang === 'es' ? 'es' : 'en';

  const titleKey = document.body.dataset.pageTitle;
  if (titleKey) document.title = t(titleKey);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    const text = t(key);
    if (attr) el.setAttribute(attr, text);
    else el.textContent = text;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });

  document.querySelectorAll('[data-i18n-option]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n-option'));
  });

  updateLangToggleUI();
}

function updateLangToggleUI() {
  document.querySelectorAll('[data-lang]').forEach(btn => {
    const active = btn.dataset.lang === currentLang;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'es') return;
  currentLang = lang;
  applyI18nDom();
  languageListeners.forEach(fn => fn(lang));
}

function onLanguageChange(fn) {
  languageListeners.push(fn);
}

function initLanguageSwitcher() {
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  applyI18nDom();
}

function langSwitcherHtml() {
  return `
    <div class="lang-switch" role="group" aria-label="${t('langGroupAria')}">
      <button type="button" class="lang-btn" data-lang="en" aria-pressed="true">${t('langEnglish')}</button>
      <button type="button" class="lang-btn" data-lang="es" aria-pressed="false">${t('langSpanish')}</button>
    </div>
  `;
}

window.I18n = {
  t,
  getLang: () => currentLang,
  setLanguage,
  onLanguageChange,
  initLanguageSwitcher,
  applyI18nDom,
  localizeEvent,
  localizeEvents,
  effortLabelI18n,
  indoorOutdoorI18n,
  badgeLabelI18n,
  langSwitcherHtml
};
