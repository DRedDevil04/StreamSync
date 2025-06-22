import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Tv, 
  Users, 
  User, 
  Bell,
  Search,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const username = useSelector((state: RootState) => state.user.username);

  // Update active tab based on current route
  useEffect(() => {
    const currentPath = location.pathname.slice(1) || 'home';
    setActiveTab(currentPath);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileMenu(false);
      setShowMobileMenu(false);
    };
    
    if (showProfileMenu || showMobileMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showProfileMenu, showMobileMenu]);

  const handleActiveTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowMobileMenu(false); // Close mobile menu when navigating
    console.log(`Navigating to: ${tab}`);
    
    // Navigate to the appropriate route
    if (tab === 'home') {
      navigate('/');
    } else {
      navigate(`/${tab}`);
    }
  };

  const handleProfileMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowProfileMenu(!showProfileMenu);
  };

  const handleMobileMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMobileMenu(!showMobileMenu);
  };

  const handleProfileAction = (action: string) => {
    setShowProfileMenu(false);
    
    switch (action) {
      case 'Profile Settings':
        navigate('/profile/settings');
        break;
      case 'Account':
        navigate('/profile/account');
        break;
      case 'Notifications':
        navigate('/notifications');
        break;
      case 'Sign Out':
        // Handle sign out logic here
        console.log('Signing out...');
        // navigate('/login');
        break;
      default:
        break;
    }
  };

  const navItems = [
    { 
      name: 'home', 
      icon: Home, 
      active: activeTab === 'home',
      displayName: 'Home'
    },
    { 
      name: 'feed', 
      icon: Tv, 
      active: activeTab === 'feed',
      displayName: 'Feed'
    },
    { 
      name: 'friends', 
      icon: Users, 
      active: activeTab === 'friends',
      displayName: 'Friends',
      badge: 3 // notification badge
    }
  ];

  const profileMenuItems = [
    { name: 'Profile Settings', icon: Settings },
    { name: 'Account', icon: User },
    { name: 'Notifications', icon: Bell },
    { name: 'Sign Out', icon: LogOut }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl' 
          : 'bg-slate-900/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleActiveTabChange('home')}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Tv className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">StreamSync</h1>
                <p className="text-xs text-slate-400 -mt-1">FireTV Edition</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleActiveTabChange(item.name)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                    item.active
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${item.active ? 'text-blue-400' : ''}`} />
                  <span className="capitalize">{item.displayName}</span>
                  
                  {/* Notification Badge */}
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{item.badge}</span>
                    </div>
                  )}
                  
                  {/* Active indicator */}
                  {item.active && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              
              {/* Search Button */}
              <button 
                onClick={() => navigate('/search')}
                className="hidden sm:flex items-center justify-center w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <Search className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
              </button>

              {/* Notifications */}
              <button 
                onClick={() => navigate('/notifications')}
                className="relative flex items-center justify-center w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <Bell className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={handleProfileMenuClick}
                  className="flex items-center space-x-2 bg-slate-800/50 hover:bg-slate-700/50 px-3 py-2 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div 
                    className="absolute right-0 top-12 w-56 bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl py-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-3 border-b border-slate-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{username}</p>
                          <p className="text-slate-400 text-sm">{username}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      {profileMenuItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleProfileAction(item.name)}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={handleMobileMenuClick}
                className="md:hidden flex items-center justify-center w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-200"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div 
            className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleActiveTabChange(item.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    item.active
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${item.active ? 'text-blue-400' : ''}`} />
                  <span className="capitalize">{item.displayName}</span>
                  {item.badge && (
                    <div className="ml-auto w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{item.badge}</span>
                    </div>
                  )}
                </button>
              ))}
              
              {/* Mobile Search */}
              <button 
                onClick={() => {
                  navigate('/search');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for menus */}
      {(showProfileMenu || showMobileMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProfileMenu(false);
            setShowMobileMenu(false);
          }}
        />
      )}

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;