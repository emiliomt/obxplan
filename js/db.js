// Supabase client + database helpers (attendee-based party-size RSVPs)
const { createClient } = supabase;
const _db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const db = {

  async getAttendees() {
    const { data, error } = await _db.from('attendees').select('*').order('full_name');
    if (error) throw error;
    const list = data ?? [];
    list.sort((a, b) => {
      const g = (a.family_group || '').localeCompare(b.family_group || '');
      return g !== 0 ? g : (a.full_name || '').localeCompare(b.full_name || '');
    });
    return list;
  },

  async getAttendee(id) {
    const { data, error } = await _db.from('attendees').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createAttendee(fullName, familyGroup, type, maxPartySize) {
    const cfg = window.ATTENDEE_CONFIG || { defaultMaxPartyAdult: 4, defaultMaxPartyChild: 1 };
    const max = maxPartySize ?? (type === 'child' ? cfg.defaultMaxPartyChild : cfg.defaultMaxPartyAdult);
    const { data, error } = await _db
      .from('attendees')
      .insert({
        full_name: fullName,
        family_group: familyGroup,
        type,
        max_party_size: max
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateAttendee(id, fields) {
    const { data, error } = await _db
      .from('attendees')
      .update(fields)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getEvents() {
    const { data, error } = await _db.from('events').select('*').order('sort_order');
    if (error) throw error;
    return data ?? [];
  },

  async updateEvent(id, fields) {
    const { data, error } = await _db
      .from('events').update(fields).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async createEvent(fields) {
    const { data, error } = await _db.from('events').insert(fields).select().single();
    if (error) throw error;
    return data;
  },

  async deleteEvent(id) {
    const { error } = await _db.from('events').delete().eq('id', id);
    if (error) throw error;
  },

  async getAllAttendeeRsvps() {
    const { data, error } = await _db
      .from('attendee_rsvps')
      .select('*, attendees(id, full_name, family_group, type, max_party_size)');
    if (error) throw error;
    return (data ?? []).map(normalizeRsvpRow);
  },

  /**
   * @param {{ attending: boolean, partySize: number, extraGuestNames?: string[] }} payload
   */
  async upsertAttendeeRsvp(attendeeId, eventId, payload) {
    const attending = !!payload.attending;
    const partySize = attending ? Math.max(1, payload.partySize || 1) : 0;
    const extraGuestNames = attending && partySize > 1
      ? (payload.extraGuestNames || []).slice(0, partySize - 1)
      : [];

    const row = {
      attendee_id: attendeeId,
      event_id: eventId,
      attending,
      going: attending,
      party_size: partySize,
      extra_guest_names: extraGuestNames,
      updated_at: new Date().toISOString()
    };

    const { error } = await _db.from('attendee_rsvps').upsert(row, {
      onConflict: 'attendee_id,event_id'
    });
    if (error) throw error;
  },

  subscribeToChanges(tables, callback) {
    const ch = _db.channel('obx-live');
    tables.forEach(t =>
      ch.on('postgres_changes', { event: '*', schema: 'public', table: t }, callback)
    );
    ch.subscribe();
    return ch;
  },

  unsubscribe(channel) {
    _db.removeChannel(channel);
  }
};

function normalizeRsvpRow(r) {
  const attending = r.attending != null ? r.attending : !!r.going;
  let partySize = parseInt(r.party_size, 10);
  if (Number.isNaN(partySize)) partySize = attending ? 1 : 0;
  if (!attending) partySize = 0;
  else if (partySize < 1) partySize = 1;

  let extra = r.extra_guest_names;
  if (typeof extra === 'string') {
    try { extra = JSON.parse(extra); } catch { extra = []; }
  }
  if (!Array.isArray(extra)) extra = [];

  return {
    ...r,
    attending,
    going: attending,
    party_size: partySize,
    extra_guest_names: extra.slice(0, Math.max(0, partySize - 1))
  };
}

window.normalizeRsvpRow = normalizeRsvpRow;
