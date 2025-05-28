import { useState, useEffect } from 'react';
import { fetchContacts, fetchProfile, checkMutualFollow, hexToNpub } from '../services/nostrService';
import type { NostrEvent, NostrProfile } from '../types/nostr';

interface FriendsListProps {
  npub: string;
}

export default function FriendsList({ npub }: FriendsListProps) {
  const [contacts, setContacts] = useState<NostrEvent | null>(null);
  const [friends, setFriends] = useState<Array<{ pubkey: string; profile: NostrProfile | null; isMutual: boolean }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContacts() {
      if (!npub) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const contactsEvent = await fetchContacts(npub);
        if (!contactsEvent) {
          setError('No contacts found');
          setLoading(false);
          return;
        }
        
        setContacts(contactsEvent);
        
        const friendPubkeys = contactsEvent.tags
          .filter(tag => tag[0] === 'p')
          .map(tag => tag[1]);
        
        const friendsData = await Promise.all(
          friendPubkeys.slice(0, 10).map(async (pubkey) => {
            const profile = await fetchProfile(pubkey);
            const isMutual = await checkMutualFollow(npub, pubkey);
            return { pubkey, profile, isMutual };
          })
        );
        
        setFriends(friendsData);
      } catch (err) {
        setError('Error loading contacts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadContacts();
  }, [npub]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!contacts || friends.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded">
        No friends found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Friends</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {friends.map(friend => (
            <div 
              key={friend.pubkey} 
              className={`p-4 rounded-lg border ${friend.isMutual ? 'border-pink-200 bg-pink-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex items-center">
                {friend.profile?.picture ? (
                  <img 
                    src={friend.profile.picture} 
                    alt={friend.profile.name || 'Friend'} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xl">?</span>
                  </div>
                )}
                
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">
                    {friend.profile?.display_name || friend.profile?.name || 'Anonymous'}
                  </h3>
                  
                  <div className="text-sm text-gray-500">
                    {hexToNpub(friend.pubkey).substring(0, 10)}...
                  </div>
                  
                  {friend.isMutual && (
                    <div className="text-xs text-pink-600 font-medium mt-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      My Best Friend
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
