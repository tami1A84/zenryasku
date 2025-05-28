import { SimplePool, nip19 } from 'nostr-tools';
import type { NostrEvent, NostrProfile } from '../types/nostr';

const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://relay.nostr.band'
];

const pool = new SimplePool();

/**
 * Fetch a user's profile (Kind 0 event)
 * @param npub Nostr public key (npub format)
 * @returns Profile data or null if not found
 */
export async function fetchProfile(npub: string): Promise<NostrProfile | null> {
  try {
    const pubkey = npub.startsWith('npub') 
      ? nip19.decode(npub).data as string
      : npub;
    
    const events = await pool.querySync(DEFAULT_RELAYS, {
      kinds: [0],
      authors: [pubkey],
      limit: 1
    });
    
    if (events.length === 0) return null;
    
    const profileEvent = events[0];
    try {
      return JSON.parse(profileEvent.content);
    } catch (e) {
      console.error('Failed to parse profile content:', e);
      return null;
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Fetch a user's notes (Kind 1 events)
 * @param npub Nostr public key (npub format)
 * @param limit Number of notes to fetch
 * @returns Array of note events
 */
export async function fetchNotes(npub: string, limit = 10): Promise<NostrEvent[]> {
  try {
    const pubkey = npub.startsWith('npub') 
      ? nip19.decode(npub).data as string
      : npub;
    
    const events = await pool.querySync(DEFAULT_RELAYS, {
      kinds: [1],
      authors: [pubkey],
      limit
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

/**
 * Fetch a user's contact list (Kind 3 event)
 * @param npub Nostr public key (npub format)
 * @returns Contact list event or null if not found
 */
export async function fetchContacts(npub: string): Promise<NostrEvent | null> {
  try {
    const pubkey = npub.startsWith('npub') 
      ? nip19.decode(npub).data as string
      : npub;
    
    const events = await pool.querySync(DEFAULT_RELAYS, {
      kinds: [3],
      authors: [pubkey],
      limit: 1
    });
    
    return events.length > 0 ? events[0] : null;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return null;
  }
}

/**
 * Fetch a user's custom lists (Kind 30000/30001)
 * @param npub Nostr public key (npub format)
 * @param listName Optional list name to filter by (d tag)
 * @returns Array of list events
 */
export async function fetchLists(npub: string, listName?: string): Promise<NostrEvent[]> {
  try {
    const pubkey = npub.startsWith('npub') 
      ? nip19.decode(npub).data as string
      : npub;
    
    const filter: { kinds: number[], authors: string[], "#d"?: string[] } = {
      kinds: [30000, 30001],
      authors: [pubkey]
    };
    
    if (listName) {
      filter["#d"] = [listName];
    }
    
    const events = await pool.querySync(DEFAULT_RELAYS, filter);
    return events;
  } catch (error) {
    console.error('Error fetching lists:', error);
    return [];
  }
}

/**
 * Check if two users follow each other (mutual follow)
 * @param npub1 First user's npub
 * @param npub2 Second user's npub
 * @returns Boolean indicating if they mutually follow each other
 */
export async function checkMutualFollow(npub1: string, npub2: string): Promise<boolean> {
  const contacts1 = await fetchContacts(npub1);
  const contacts2 = await fetchContacts(npub2);
  
  if (!contacts1 || !contacts2) return false;
  
  const pubkey1 = npub1.startsWith('npub') 
    ? nip19.decode(npub1).data as string
    : npub1;
  
  const pubkey2 = npub2.startsWith('npub') 
    ? nip19.decode(npub2).data as string
    : npub2;
  
  const follows1to2 = contacts1.tags.some(tag => 
    tag[0] === 'p' && tag[1] === pubkey2
  );
  
  const follows2to1 = contacts2.tags.some(tag => 
    tag[0] === 'p' && tag[1] === pubkey1
  );
  
  return follows1to2 && follows2to1;
}

/**
 * Convert hex pubkey to npub format
 * @param hex Hex format pubkey
 * @returns npub format
 */
export function hexToNpub(hex: string): string {
  return nip19.npubEncode(hex);
}

/**
 * Try to convert npub to hex format
 * @param npubOrHex npub or hex format
 * @returns hex format
 */
export function normalizePublicKey(npubOrHex: string): string {
  if (npubOrHex.startsWith('npub')) {
    return nip19.decode(npubOrHex).data as string;
  }
  return npubOrHex;
}
