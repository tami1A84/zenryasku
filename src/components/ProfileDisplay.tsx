import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { fetchProfile, fetchNotes } from '../services/nostrService';
import type { NostrProfile, NostrEvent } from '../types/nostr';

interface ProfileDisplayProps {
  npub: string;
}

export default function ProfileDisplay({ npub }: ProfileDisplayProps) {
  const [profile, setProfile] = useState<NostrProfile | null>(null);
  const [notes, setNotes] = useState<NostrEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (!profile) {
    return null;
  }

  const renderMarkdown = (content: string) => {
    if (!content) return { __html: '' };
    return { __html: marked.parse(content) };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Banner image */}
      {profile.banner && (
        <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${profile.banner})` }}></div>
      )}
      
      <div className="p-6">
        {/* Profile picture and name */}
        <div className="flex flex-col sm:flex-row items-center mb-6">
          {profile.picture ? (
            <img 
              src={profile.picture} 
              alt={profile.name || 'Profile'} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md -mt-12 sm:-mt-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md -mt-12 sm:-mt-0">
              <span className="text-gray-500 text-2xl">?</span>
            </div>
          )}
          
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.display_name || profile.name || 'Anonymous'}
            </h1>
            
            {/* NIP-05 verification */}
            {profile.nip05 && (
              <div className="text-sm text-green-600 flex items-center justify-center sm:justify-start mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{profile.nip05}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* About section with markdown */}
        {profile.about && (
          <div className="mb-6 prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={renderMarkdown(profile.about)} />
          </div>
        )}
        
        {/* Links and contact info */}
        <div className="flex flex-wrap gap-2 mb-6">
          {profile.website && (
            <a 
              href={profile.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
              </svg>
              Website
            </a>
          )}
          
          {profile.lud16 && (
            <button 
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              onClick={() => console.log('Zap with', profile.lud16)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Zap
            </button>
          )}
        </div>
        
        {/* Recent notes */}
        {notes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h2>
            <div className="space-y-4">
              {notes.map(note => (
                <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{note.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(note.created_at * 1000).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
