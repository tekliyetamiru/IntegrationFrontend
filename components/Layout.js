import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Layout({ children, title }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Public routes that don't require sidebar
  const publicRoutes = ['/', '/login', '/signup'];
  const isPublicRoute = publicRoutes.includes(router.pathname);
  
  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      router.push('/login');
    }
  }, [user, loading, router, isPublicRoute]);
  
  if (loading && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main>{children}</main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onCollapseChange={setSidebarCollapsed} />
      <main className={`transition-all duration-200 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} p-6`}>
        {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
}