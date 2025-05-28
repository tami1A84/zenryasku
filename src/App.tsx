import { useState } from 'react';
import './App.css';
import ProfileDisplay from './components/ProfileDisplay';
import FriendsList from './components/FriendsList';
import CustomLists from './components/CustomLists';

function App() {
  const [npub, setNpub] = useState<string>('');
  const [searchedNpub, setSearchedNpub] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'profile' | 'friends' | 'lists'>('profile');

  const handleSearch = () => {
    if (npub.trim()) {
      setSearchedNpub(npub);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-8 text-center">
        <img 
          src="/images/title.gif" 
          alt="Zenryaku Profile" 
          className="mx-auto mb-2"
        />
        <p className="text-gray-600">Nostr前略プロフィール</p>
      </header>
      <main className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="text-center mb-4">Enter a Nostr public key (npub) to view profile</p>
          <div className="flex">
            <input
              type="text"
              value={npub}
              onChange={(e) => setNpub(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="npub..."
              className="flex-1 p-2 border rounded-l"
            />
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-r"
              onClick={handleSearch}
            >
              View
            </button>
          </div>
        </div>

        {searchedNpub && (
          <>
            {/* Tabs */}
            <div className="flex border-b mb-6">
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'friends' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('friends')}
              >
                Friends
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'lists' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('lists')}
              >
                Favorite Things
              </button>
            </div>

            {/* Content based on active tab */}
            <div className="mb-8">
              {activeTab === 'profile' && <ProfileDisplay npub={searchedNpub} />}
              {activeTab === 'friends' && <FriendsList npub={searchedNpub} />}
              {activeTab === 'lists' && <CustomLists npub={searchedNpub} />}
            </div>
          </>
        )}
      </main>
      <footer className="text-center text-gray-500 text-sm mt-8">
        <p>Zenryasku - Nostr前略プロフィール</p>
        <p className="mt-1">
          <a 
            href="https://github.com/nostr-protocol/nostr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Nostr Protocol
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
