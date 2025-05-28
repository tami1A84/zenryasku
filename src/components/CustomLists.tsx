import React, { useState, useEffect } from 'react';
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

  if (parsedLists.length === 0) {
    return (
      <div className="p-2 border">
        お気に入りリストが見つかりません
      </div>
    );
  }

  return (
    <div>
      <table className="favorites-table">
        <thead>
          <tr>
            <th colSpan={2}>
              お気に入りリスト
            </th>
          </tr>
        </thead>
        <tbody>
          {parsedLists.map((list, index) => (
            <React.Fragment key={index}>
              <tr>
                <th colSpan={2} className="list-header">
                  {list.name}
                </th>
              </tr>
              
              {list.items.length > 0 ? (
                list.items.map((item, itemIndex) => (
                  <tr key={`${index}-${itemIndex}`} className={itemIndex % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td className="number-cell">
                      {itemIndex + 1}
                    </td>
                    <td className="item-cell">
                      {item}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="empty-list">
                    項目がありません
                  </td>
                </tr>
              )}
              
              {/* Add a spacer row between lists */}
              {index < parsedLists.length - 1 && (
                <tr>
                  <td colSpan={2} className="list-spacer"></td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
