// components/Sidebar.js (FIXED VERSION)
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const telegramItems = [
  { name: 'Dashboard', href: '/user/telegram/dashboard', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z' },
  { name: 'Bots', href: '/user/bots', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { name: 'Logs', href: '/user/telegram/logs', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { name: 'Analytics', href: '/user/telegram/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

const discordItems = [
  { name: 'Dashboard', href: '/user/discord/dashboard', icon: 'M7 5v12M7 5a2 2 0 00-2 2v6a2 2 0 002 2m0-10l12-3v12l-12 3M17 7v12m0-12a2 2 0 00-2 2v6a2 2 0 002 2' },
  { name: 'Bots', href: '/user/discord-bots', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { name: 'Logs', href: '/user/discord/logs', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { name: 'Analytics', href: '/user/discord/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

const otherItems = [
  { name: 'API Keys', href: '/user/api-keys', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  { name: 'Social Integrations', href: '/user/social-integrations', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9' },
];

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Users', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'All Logs', href: '/admin/logs', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { name: 'System Health', href: '/admin/health', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { name: 'Settings', href: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

// NavItem component for rendering individual navigation items
function NavItem({ name, href, icon, collapsed, isActive }) {
  return (
    <Link href={href}>
      <div className={`flex items-center px-4 py-3 mx-2 my-1 rounded-lg cursor-pointer transition-all duration-200 group ${isActive ? 'bg-purple-600 shadow-md' : 'hover:bg-gray-700'}`}>
        <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
        {!collapsed && <span className="ml-3 text-sm font-medium">{name}</span>}
      </div>
    </Link>
  );
}

export default function Sidebar({ onCollapseChange }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(() => {
    // Persist sidebar state in localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved === 'true';
    }
    return false;
  });

  // Notify parent component when collapsed state changes
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    }
    // Dispatch event for Layout to listen
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { collapsed } }));
    }
  }, [collapsed, onCollapseChange]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState);
  };

  return (
    <motion.aside
      initial={{ width: collapsed ? 80 : 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.2 }}
      className="bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen fixed left-0 top-0 z-50 flex flex-col shadow-2xl"
    >
      {/* Logo / Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        {!collapsed && <span className="text-xl font-bold">ToxiGuard</span>}
        <button onClick={handleCollapse} className="p-1 rounded hover:bg-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
          </svg>
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 py-6 overflow-y-auto">
        {user.role === 'admin' ? (
          // Admin navigation
          adminNavItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              collapsed={collapsed}
              isActive={router.pathname === item.href}
            />
          ))
        ) : (
          // Regular user navigation - split by platform
          <>
            <div className="text-xs uppercase text-gray-400 font-semibold px-4 mb-2">Telegram</div>
            {telegramItems.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                collapsed={collapsed}
                isActive={router.pathname === item.href}
              />
            ))}
            
            <div className="text-xs uppercase text-gray-400 font-semibold px-4 mt-4 mb-2">Discord</div>
            {discordItems.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                collapsed={collapsed}
                isActive={router.pathname === item.href}
              />
            ))}
            
            <div className="text-xs uppercase text-gray-400 font-semibold px-4 mt-4 mb-2">Other</div>
            {otherItems.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                collapsed={collapsed}
                isActive={router.pathname === item.href}
              />
            ))}
          </>
        )}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-sm font-bold">{user.username[0].toUpperCase()}</span>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-700 transition-colors" title="Logout">
            <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}