import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { LightboxModal } from './components/common/LightboxModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { Galeri } from './types';
import { api } from './services/api';

// Public Pages
import { Home } from './pages/public/Home';
import { ProfilPengawas } from './pages/public/ProfilPengawas';
import { SekolahList } from './pages/public/SekolahList';
import { SekolahDetail } from './pages/public/SekolahDetail';
import { BeritaList } from './pages/public/BeritaList';
import { BeritaDetail } from './pages/public/BeritaDetail';
import { GaleriList } from './pages/public/GaleriList';
import { PrestasiList } from './pages/public/PrestasiList';
import { KepalaSekolahList } from './pages/public/KepalaSekolahList';
import { GuruList } from './pages/public/GuruList';
import { KontakLokasi } from './pages/public/KontakLokasi';
import { BukuTamuPage } from './pages/public/BukuTamuPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPengawas } from './pages/admin/AdminPengawas';
import { AdminSekolah } from './pages/admin/AdminSekolah';
import { AdminVisiMisi } from './pages/admin/AdminVisiMisi';
import { AdminStruktur } from './pages/admin/AdminStruktur';
import { AdminFasilitas } from './pages/admin/AdminFasilitas';
import { AdminKeunggulan } from './pages/admin/AdminKeunggulan';
import { AdminKepalaSekolah } from './pages/admin/AdminKepalaSekolah';
import { AdminGuru } from './pages/admin/AdminGuru';
import { AdminPrestasi } from './pages/admin/AdminPrestasi';
import { AdminBerita } from './pages/admin/AdminBerita';
import { AdminPengumuman } from './pages/admin/AdminPengumuman';
import { AdminGaleri } from './pages/admin/AdminGaleri';
import { AdminKontak } from './pages/admin/AdminKontak';
import { AdminBukuTamu } from './pages/admin/AdminBukuTamu';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminSecurity } from './pages/admin/AdminSecurity';

const normalizePath = (raw: string): string => {
  if (!raw) return '/';
  const clean = raw.split('?')[0].split('#')[0];
  if (clean.length > 1 && clean.endsWith('/')) {
    return clean.slice(0, -1);
  }
  return clean || '/';
};

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { settings } = useSettings();
  const [currentPath, setCurrentPath] = useState<string>(() => normalizePath(window.location.pathname));
  const [adminSection, setAdminSection] = useState<string>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<Galeri | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize browser history
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    const norm = normalizePath(path);
    if (path !== window.location.pathname) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(norm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Automatic website visitor tracking for public pages
  useEffect(() => {
    if (!currentPath.startsWith('/admin')) {
      try {
        let visitorId = localStorage.getItem('portal_visitor_id');
        if (!visitorId) {
          visitorId = 'v_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
          localStorage.setItem('portal_visitor_id', visitorId);
        }
        api.trackVisit({
          visitorId,
          path: currentPath,
          referrer: document.referrer || undefined
        }).catch(() => {
          // ignore tracking network failures silently
        });
      } catch {
        // ignore storage access issues
      }
    }
  }, [currentPath]);

  // Keyboard shortcut for Cmd+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update document title dynamically
  useEffect(() => {
    const portalName = settings?.namaPortal || 'PORTAL PENGAWAS SEKOLAH';
    if (currentPath === '/') {
      document.title = `${portalName} | Informasi, Pendampingan & Mutu Satuan Pendidikan`;
    } else if (currentPath === '/profil-pengawas') {
      document.title = `Profil Pengawas | ${portalName}`;
    } else if (currentPath === '/sekolah') {
      document.title = `Sekolah Binaan | ${portalName}`;
    } else if (currentPath.startsWith('/sekolah/')) {
      document.title = `Profil Satuan Pendidikan | ${portalName}`;
    } else if (currentPath === '/berita') {
      document.title = `Berita & Pengawasan | ${portalName}`;
    } else if (currentPath.startsWith('/berita/')) {
      document.title = `Warta Berita | ${portalName}`;
    } else if (currentPath === '/galeri') {
      document.title = `Galeri Media | ${portalName}`;
    } else if (currentPath === '/prestasi') {
      document.title = `Prestasi Sekolah | ${portalName}`;
    } else if (currentPath === '/kepala-sekolah') {
      document.title = `Data Kepala Sekolah | ${portalName}`;
    } else if (currentPath === '/guru') {
      document.title = `Direktori Guru | ${portalName}`;
    } else if (currentPath === '/buku-tamu') {
      document.title = `Buku Tamu & Aspirasi | ${portalName}`;
    } else if (currentPath === '/kontak') {
      document.title = `Kontak & Lokasi | ${portalName}`;
    } else if (currentPath.startsWith('/admin')) {
      document.title = `Panel Administrator | ${portalName}`;
    }
  }, [currentPath, settings]);

  // Route matching
  const isAdminRoute = currentPath.startsWith('/admin');

  // If in admin route and not logged in (and not already on /admin/login)
  if (isAdminRoute && currentPath !== '/admin/login' && !isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar currentPath={currentPath} onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />
        <main className="flex-1">
          <AdminLogin onNavigate={navigate} onShowToast={showToast} />
        </main>
        <Footer onNavigate={navigate} />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // Admin Logged-In View
  if (isAdminRoute && currentPath !== '/admin/login' && isAuthenticated) {
    let adminContent = <AdminDashboard onSelectSection={setAdminSection} onShowToast={showToast} />;

    switch (adminSection) {
      case 'dashboard':
        adminContent = <AdminDashboard onSelectSection={setAdminSection} onShowToast={showToast} />;
        break;
      case 'pengawas':
        adminContent = <AdminPengawas onShowToast={showToast} />;
        break;
      case 'sekolah':
        adminContent = <AdminSekolah onShowToast={showToast} />;
        break;
      case 'visimisi':
        adminContent = <AdminVisiMisi onShowToast={showToast} />;
        break;
      case 'struktur':
        adminContent = <AdminStruktur onShowToast={showToast} />;
        break;
      case 'fasilitas':
        adminContent = <AdminFasilitas onShowToast={showToast} />;
        break;
      case 'keunggulan':
        adminContent = <AdminKeunggulan onShowToast={showToast} />;
        break;
      case 'kepalaSekolah':
        adminContent = <AdminKepalaSekolah onShowToast={showToast} />;
        break;
      case 'guru':
        adminContent = <AdminGuru onShowToast={showToast} />;
        break;
      case 'prestasi':
        adminContent = <AdminPrestasi onShowToast={showToast} />;
        break;
      case 'berita':
        adminContent = <AdminBerita onShowToast={showToast} />;
        break;
      case 'pengumuman':
        adminContent = <AdminPengumuman onShowToast={showToast} />;
        break;
      case 'galeri':
        adminContent = <AdminGaleri onShowToast={showToast} />;
        break;
      case 'kontak':
        adminContent = <AdminKontak onShowToast={showToast} />;
        break;
      case 'bukuTamu':
        adminContent = <AdminBukuTamu onShowToast={showToast} />;
        break;
      case 'settings':
        adminContent = <AdminSettings onShowToast={showToast} onNavigateSection={setAdminSection} />;
        break;
      case 'security':
        adminContent = <AdminSecurity onShowToast={showToast} />;
        break;
      default:
        adminContent = <AdminDashboard onSelectSection={setAdminSection} />;
    }

    return (
      <AdminLayout
        currentSection={adminSection}
        onSelectSection={setAdminSection}
        onNavigatePublic={navigate}
      >
        {adminContent}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </AdminLayout>
    );
  }

  // Public & Login Routing
  const renderPublicPage = () => {
    if (currentPath === '/admin/login') {
      return <AdminLogin onNavigate={navigate} onShowToast={showToast} />;
    }
    if (currentPath === '/' || currentPath === '') {
      return <Home onNavigate={navigate} onOpenLightbox={setLightboxItem} />;
    }
    if (currentPath === '/profil-pengawas') {
      return <ProfilPengawas />;
    }
    if (currentPath === '/sekolah') {
      return <SekolahList onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/sekolah/')) {
      const id = currentPath.replace('/sekolah/', '');
      return <SekolahDetail schoolId={id} onNavigate={navigate} onOpenLightbox={setLightboxItem} />;
    }
    if (currentPath === '/berita') {
      return <BeritaList onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/berita/')) {
      const slug = currentPath.replace('/berita/', '');
      return <BeritaDetail slug={slug} onNavigate={navigate} />;
    }
    if (currentPath === '/galeri') {
      return <GaleriList onOpenLightbox={setLightboxItem} />;
    }
    if (currentPath === '/prestasi') {
      return <PrestasiList />;
    }
    if (currentPath === '/kepala-sekolah') {
      return <KepalaSekolahList onNavigate={navigate} />;
    }
    if (currentPath === '/guru') {
      return <GuruList />;
    }
    if (currentPath === '/buku-tamu') {
      return <BukuTamuPage onShowToast={showToast} />;
    }
    if (currentPath === '/kontak') {
      return <KontakLokasi onShowToast={showToast} />;
    }

    // 404 Fallback
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="text-6xl font-black text-slate-300">404</div>
        <h2 className="text-xl font-bold text-slate-800">Halaman Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">
          Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <main className="flex-1">{renderPublicPage()}</main>
      <Footer onNavigate={navigate} />

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />
      <LightboxModal item={lightboxItem} onClose={() => setLightboxItem(null)} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
}
