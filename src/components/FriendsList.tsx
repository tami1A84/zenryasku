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
      <div className="text-center p-4">
        読み込み中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 border border-red-500">
        {error}
      </div>
    );
  }

  if (!contacts || friends.length === 0) {
    return (
      <div className="p-2 border">
        友達が見つかりません
      </div>
    );
  }

  return (
    <div>
      <table className="friends-table">
        <thead>
          <tr>
            <th colSpan={3}>
              友達リスト
            </th>
          </tr>
          <tr>
            <th className="name-header">
              名前
            </th>
            <th className="id-header">
              プロフID
            </th>
            <th className="status-header">
              ステータス
            </th>
          </tr>
        </thead>
        <tbody>
          {friends.map(friend => (
            <tr 
              key={friend.pubkey} 
              className={friend.isMutual ? 'mutual-friend' : ''}
            >
              <td className="name-cell">
                <div className="friend-name">
                  {friend.profile?.picture ? (
                    <img 
                      src={friend.profile.picture} 
                      alt={friend.profile.name || 'Friend'} 
                      className="friend-image"
                    />
                  ) : (
                    <div className="no-friend-image">
                      <span>?</span>
                    </div>
                  )}
                  {friend.profile?.display_name || friend.profile?.name || '名前なし'}
                </div>
              </td>
              <td className="id-cell">
                {hexToNpub(friend.pubkey).substring(0, 10)}...
              </td>
              <td className="status-cell">
                {friend.isMutual ? (
                  <span className="mutual-status">親友</span>
                ) : (
                  <span>フォロー中</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
