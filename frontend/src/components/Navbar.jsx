import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Navbar({ isAuthenticated, onLogout, openAuthModal }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const location = useLocation();

  const toggleProfile = async () => {
    const newState = !isProfileOpen;
    setIsProfileOpen(newState);
    if (newState && isAuthenticated && !profileData) {
      try {
        const response = await fetch('/api/profile/');
        const data = await response.json();
        if (response.ok && data.status === 'success') {
          setProfileData(data.profile);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="shrink-0 flex items-center">
              <Link to="/" className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-lime-600 to-green-500 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-linear-to-br from-[#5d6939] to-[#8a9a5b] rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-xl">
                    T
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#5d6939] tracking-tight">TalkON</h1>
                </div>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                <>
                  <Link to="/home" className="text-gray-700 font-semibold hover:text-lime-600 hover:bg-lime-50 px-4 py-2 rounded-xl transition-all duration-300">
                    HOME
                  </Link>
                  <button
                    onClick={toggleProfile}
                    className="text-gray-700 font-semibold hover:text-lime-600 hover:bg-lime-50 px-4 py-2 rounded-xl transition-all duration-300"
                  >
                    PROFILE
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => openAuthModal('login')} className="text-gray-600 font-medium hover:text-gray-900 transition-colors duration-200 active:scale-95">
                    Log in
                  </button>
                  <button onClick={() => openAuthModal('signup')} className="bg-linear-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg shadow-lime-500/30 hover:shadow-lime-500/50 transform hover:-translate-y-0.5 transition-all duration-300 active:scale-95">
                    Sign up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button (simplified for aesthetic) */}
            <div className="md:hidden flex items-center">
              <button className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-lime-500 p-2 rounded-lg">
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isProfileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={toggleProfile}
          ></div>
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isProfileOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
                <button
                  onClick={toggleProfile}
                  className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-lime-100 mb-4">
                  <img src="../public/image/profile-pic.png" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold border-b-2 border-lime-400 pb-2">
                  {profileData ? profileData.name : 'Loading...'}
                </h3>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h5 className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Email</h5>
                  <p className="text-gray-800 font-medium">{profileData ? profileData.email : 'Loading...'}</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Mobile no.</h5>
                  <p className="text-gray-800 font-medium">{profileData ? profileData.phone : 'Loading...'}</p>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100">
                <button
                  onClick={() => { onLogout(); toggleProfile(); }}
                  className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
