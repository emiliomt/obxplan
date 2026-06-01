// Supabase client + database helpers (attendee-based RSVPs)
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

  async createAttendee(fullName, familyGroup, type) {
    const { data, error } = await _db
      .from('attendees')
      .insert({ full_name: fullName, family_group: familyGroup, type })
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
      .select('*, attendees(id, full_name, family_group, type)');
    if (error) throw error;
    return data ?? [];
  },

  async upsertAttendeeRsvp(attendeeId, eventId, going) {
    const { error } = await _db.from('attendee_rsvps').upsert(
      { attendee_id: attendeeId, event_id: eventId, going, updated_at: new Date().toISOString() },
      { onConflict: 'attendee_id,event_id' }
    );
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
