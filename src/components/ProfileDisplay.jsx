import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { fetchProfile, fetchNotes } from '../services/nostrService';

function ProfileDisplay({ npub }) {
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      if (!npub) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const profileData = await fetchProfile(npub);
        if (!profileData) {
          setError('Profile not found');
          setLoading(false);
          return;
        }
        
        setProfile(profileData);
        
        const recentNotes = await fetchNotes(npub, 5);
        setNotes(recentNotes);
      } catch (err) {
        setError('Error loading profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
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

  if (!profile) {
    return null;
  }

  const renderMarkdown = (content) => {
    if (!content) return { __html: '' };
    return { __html: marked.parse(content) };
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <table className="w-full">
        <tbody>
          {/* Profile header */}
          <tr>
            <th colSpan={2} className="text-left">
              プロフィール情報
            </th>
          </tr>
          
          {/* Profile picture */}
          <tr>
            <td className="w-1/4">
              プロフ画像
            </td>
            <td className="w-3/4">
              {profile.picture ? (
                <img 
                  src={profile.picture} 
                  alt={profile.name || 'Profile'} 
                  className="w-24 h-24 border"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center border">
                  <span>No Image</span>
                </div>
              )}
            </td>
          </tr>
          
          {/* Name */}
          <tr>
            <td>
              ニックネーム
            </td>
            <td>
              {profile.display_name || profile.name || '名前なし'}
            </td>
          </tr>
          
          {/* NIP-05 verification */}
          {profile.nip05 && (
            <tr>
              <td>
                NIP-05認証
              </td>
              <td>
                {profile.nip05}
              </td>
            </tr>
          )}
          
          {/* Website */}
          {profile.website && (
            <tr>
              <td>
                ウェブサイト
              </td>
              <td>
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {profile.website}
                </a>
              </td>
            </tr>
          )}
          
          {/* Lightning address */}
          {profile.lud16 && (
            <tr>
              <td>
                Lightning
              </td>
              <td>
                {profile.lud16}
                <button 
                  className="ml-2 border px-2 py-1"
                  onClick={() => console.log('Zap with', profile.lud16)}
                >
                  Zap
                </button>
              </td>
            </tr>
          )}
          
          {/* About section with markdown */}
          {profile.about && (
            <tr>
              <td>
                自己紹介
              </td>
              <td>
                <div dangerouslySetInnerHTML={renderMarkdown(profile.about)} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Recent notes */}
      {notes.length > 0 && (
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th colSpan={2} className="text-left">
                最近の投稿
              </th>
            </tr>
          </thead>
          <tbody>
            {notes.map(note => (
              <tr key={note.id}>
                <td className="w-1/4">
                  {formatDate(note.created_at)}
                </td>
                <td className="w-3/4">
                  {note.content}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProfileDisplay;
