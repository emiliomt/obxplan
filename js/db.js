// Supabase client + all database helpers
const { createClient } = supabase;
const _db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const db = {

  // ── Families ──────────────────────────────────────────────────────────────

  async getFamilies() {
    const { data, error } = await _db.from('families').select('*').order('created_at');
    if (error) throw error;
    return data;
  },

  async createFamily(name, headcount) {
    const { data, error } = await _db
      .from('families')
      .insert({ name, headcount })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateFamilyHeadcount(id, headcount) {
    const { error } = await _db.from('families').update({ headcount }).eq('id', id);
    if (error) throw error;
  },

  async getFamily(id) {
    const { data, error } = await _db.from('families').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  // ── Events ────────────────────────────────────────────────────────────────

  async getEvents() {
    const { data, error } = await _db.from('events').select('*').order('sort_order');
    if (error) throw error;
    return data;
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

  // ── RSVPs ─────────────────────────────────────────────────────────────────

  // Returns rows joined with the family's name + headcount for live count math
  async getAllRsvps() {
    const { data, error } = await _db
      .from('rsvps')
      .select('*, families(id, name, headcount)');
    if (error) throw error;
    return data ?? [];
  },

  async upsertRsvp(familyId, eventId, going) {
    const { error } = await _db.from('rsvps').upsert(
      { family_id: familyId, event_id: eventId, going, updated_at: new Date().toISOString() },
      { onConflict: 'family_id,event_id' }
    );
    if (error) throw error;
  },

  // ── Realtime ──────────────────────────────────────────────────────────────

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
