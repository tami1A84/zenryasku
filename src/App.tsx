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
    <div className="min-h-screen bg-gray-100">
      <div className="main-content" style={{ width: '100%', margin: '0 auto', border: '1px solid #999999', backgroundColor: 'white', padding: '8px' }}>
        <div className="header-container mb-8">
          <div className="title-image-container">
            <img src="/img/title.gif" alt="前略プロフィール" className="title-image" />
          </div>
          <div className="intro-text-container">
            <div className="mb-2">
              激しく自己紹介しませんか？
            </div>
            
            <div className="mb-2">
              『前略プロフィール』は、誰でも手軽に携帯電話・パソコンの両方に対応した、自己紹介ページを作成できるサイトです。あらかじめ用意された数十種類の項目から、公表したいものだけに答えていくだけで簡単に完成します。
            </div>
            
            <div className="mb-2">
              投稿をメール転送する機能付のゲストブック(掲示板)も簡単操作で設置可能、写真の掲載やリンク集などの機能もあるので、簡易ホームページのような使い方もできます。プロフィールは携帯電話・パソコンどちらでも同じURLでアクセスできます。掲示板ももちろん携帯電話対応です。
            </div>
            
            <div>
              個性を主張した楽しい自己紹介が、ナウい！ぜひ、ここぞとばかりに自己主張して、あなただけのプロフィールを作成しませんか？
            </div>
          </div>
        </div>
        
        {/* Search section */}
        <table className="search-table mb-8">
          <thead>
            <tr>
              <th colSpan={2}>
                さっそくプロフィール検索
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="w-1/2">
                <div>プロフIDで検索</div>
                <input
                  type="text"
                  value={npub}
                  onChange={(e) => setNpub(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="npub..."
                  className="mb-2"
                />
                <button onClick={handleSearch}>
                  検索
                </button>
              </td>
              <td className="w-1/2">
                <div>フリーワード検索</div>
                <input
                  type="text"
                  className="mb-2"
                  disabled
                />
                <button disabled>
                  検索
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* Menu section */}
        {!searchedNpub && (
          <table className="menu-table mb-8">
            <thead>
              <tr>
                <th>
                  メニュー
                </th>
                <th>
                  ちょっと説明
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  朗らかにサンプル
                </td>
                <td>
                  実際にご利用中のユーザープロフです。<a href="https://njump.me/npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m">jack</a>
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://nstart.me/ja">新規登録！</a>
                </td>
                <td>
                  簡単にプロフィールを作成できます。楽しいプロフを作りましょう！
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://metadata.nostr.com/">管理人室</a>
                </td>
                <td>
                  入り口が1つに統一！
                </td>
              </tr>
              <tr>
                <td>
                  <a href="#">プロフIDで検索</a>
                </td>
                <td>
                  目的の人のプロフID（ナンバー）がわかっている場合、こちらからその人のプロフを表示できます。
                </td>
              </tr>
              <tr>
                <td>
                  <a href="#">フリーワード検索</a>
                </td>
                <td>
                  例えば前世が海亀の人を探したいとき、『ウミガメ』と検索すると見つかるかもしれません。
                </td>
              </tr>
            </tbody>
          </table>
        )}
        
        {/* Profile content */}
        {searchedNpub && (
          <div className="mb-8">
            <table className="w-full mb-4">
              <thead>
                <tr>
                  <th colSpan={3}>
                    プロフィール表示
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="p-0">
                    <table className="profile-tabs w-full border-0">
                      <tbody>
                        <tr>
                          <td className="w-1/3">
                            <button 
                              className={activeTab === 'profile' ? 'active' : ''}
                              onClick={() => setActiveTab('profile')}
                            >
                              プロフィール
                            </button>
                          </td>
                          <td className="w-1/3">
                            <button 
                              className={activeTab === 'friends' ? 'active' : ''}
                              onClick={() => setActiveTab('friends')}
                            >
                              友達リスト
                            </button>
                          </td>
                          <td className="w-1/3">
                            <button 
                              className={activeTab === 'lists' ? 'active' : ''}
                              onClick={() => setActiveTab('lists')}
                            >
                              お気に入り
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-2">
                    {activeTab === 'profile' && <ProfileDisplay npub={searchedNpub} />}
                    {activeTab === 'friends' && <FriendsList npub={searchedNpub} />}
                    {activeTab === 'lists' && <CustomLists npub={searchedNpub} />}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {/* Footer */}
        <div className="footer">
          <a 
            href="https://github.com/nostr-protocol/nostr" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Nostr Protocol
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
