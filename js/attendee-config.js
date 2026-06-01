// Defaults when creating attendees in the UI (max_party_size column is the source of truth in Supabase).
// To change limits for existing people, edit supabase/seed-attendees-party.sql or update the attendees table.
window.ATTENDEE_CONFIG = {
  defaultMaxPartyAdult: 4,
  defaultMaxPartyChild: 1,
  absoluteMaxParty: 20
};
