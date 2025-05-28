import { useState } from 'react';
import './App.css';
import ProfileDisplay from './components/ProfileDisplay.jsx';
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
      <table className="main-table">
        <tbody>
          <tr>
            {/* Left vertical text column */}
            <td className="vertical-text-column">
              <div className="writing-vertical">
                <div>前</div>
                <div>略</div>
                <div>プ</div>
                <div>ロ</div>
                <div>フ</div>
                <div>ィ</div>
                <div>ー</div>
                <div>ル</div>
              </div>
            </td>
            
            {/* Main content column */}
            <td className="content-column">
              <div className="mb-4">
                <img src="/img/title.gif" alt="前略プロフィール" className="mb-2" />
              </div>
              
              <div className="mb-4">
                激しく自己紹介しませんか？
              </div>
              
              <div className="mb-4">
                『前略プロフィール』は、誰でも手軽に携帯電話・パソコンの両方に対応した、自己紹介ページを作成できるサイトです。あらかじめ用意された数十種類の項目から、公表したいものだけに答えていくだけで簡単に完成します。
              </div>
              
              <div className="mb-4">
                投稿をメール転送する機能付のゲストブック(掲示板)も簡単操作で設置可能、写真の掲載やリンク集などの機能もあるので、簡易ホームページのような使い方もできます。プロフィールは携帯電話・パソコンどちらでも同じURLでアクセスできます。掲示板ももちろん携帯電話対応です。
              </div>
              
              <div className="mb-8">
                個性を主張した楽しい自己紹介が、ナウい！ぜひ、ここぞとばかりに自己主張して、あなただけのプロフィールを作成しませんか？
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
                      <th>
                        朗らかにサンプル
                      </th>
                      <td>
                        実際にご利用中のユーザープロフです。
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <a href="#">新規登録！</a>
                      </th>
                      <td>
                        簡単にプロフィールを作成できます。楽しいプロフを作りましょう！
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <a href="#">プロフIDで検索</a>
                      </th>
                      <td>
                        目的の人のプロフID（ナンバー）がわかっている場合、こちらからその人のプロフを表示できます。
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <a href="#">フリーワード検索</a>
                      </th>
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
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
