import { useState, useEffect } from 'react';
import { fetchLists } from '../services/nostrService';
import type { NostrEvent } from '../types/nostr';

interface CustomListsProps {
  npub: string;
}

interface ParsedList {
  name: string;
  items: string[];
}

export default function CustomLists({ npub }: CustomListsProps) {
  const [, setLists] = useState<NostrEvent[]>([]);
  const [parsedLists, setParsedLists] = useState<ParsedList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLists() {
      if (!npub) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const listsData = await fetchLists(npub);
        setLists(listsData);
        
        const parsed = listsData.map(list => {
          try {
            const dTag = list.tags.find(tag => tag[0] === 'd');
            const listName = dTag ? dTag[1] : 'Unnamed List';
            
            const content = JSON.parse(list.content);
            return {
              name: listName,
              items: Array.isArray(content) ? content : []
            };
          } catch (e) {
            console.error('Failed to parse list:', e);
            return {
              name: 'Error parsing list',
              items: []
            };
          }
        });
        
        setParsedLists(parsed);
      } catch (err) {
        setError('Error loading lists');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadLists();
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

  if (parsedLists.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded">
        No custom lists found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Favorite Things</h2>
        
        <div className="space-y-6">
          {parsedLists.map((list, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{list.name}</h3>
              
              {list.items.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {list.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No items in this list</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
