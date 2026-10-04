import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { LiveTicker } from './LiveTicker';
import { HeroSection } from './HeroSection';
import { StakeholderCockpits } from './StakeholderCockpits';
import { BloodBenchmark } from './BloodBenchmark';
import { ClinicalInfrastructure } from './ClinicalInfrastructure';
import { CtaSection } from './CtaSection';
import { Footer } from './Footer';
import { AuthGatewayModal } from './AuthGatewayModal';
import { RegisterModal } from './RegisterModal';
import { useAuth } from '../../context/AuthContext';

export const LandingPage = ({ 
  onSwitchToMobile, 
  onLaunchDashboard, 
  onLaunchAdminPortal 
}) => {
  const { user, logout: logoutUser } = useAuth();
  
  // Admin local state
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem('hemolink_admin_token') || null
  );

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('USER'); // 'USER' | 'ADMIN'
  const [prefillRole, setPrefillRole] = useState(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Handle open auth modal
  const handleOpenLogin = (tab = 'USER', role = null) => {
    setAuthTab(tab);
    setPrefillRole(role);
    setAuthModalOpen(true);
  };

  // Handle cockpit role login click
  const handleSelectRoleLogin = (role, isQuickPrefill = false) => {
    if (role === 'ADMIN') {
      handleOpenLogin('ADMIN', 'ADMIN');
    } else {
      handleOpenLogin('USER', role);
    }
  };

  // Handle admin logout
  const handleLogoutAdmin = () => {
    localStorage.removeItem('hemolink_admin_token');
    setAdminToken(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* 1. Header Navigation Bar */}
      <Navbar
        user={user}
        adminUser={adminToken ? { role: 'ADMIN' } : null}
        onOpenLogin={(tab) => handleOpenLogin(tab)}
        onOpenRegister={() => setRegisterModalOpen(true)}
        onLogoutUser={logoutUser}
        onLogoutAdmin={handleLogoutAdmin}
        onSwitchToMobile={onSwitchToMobile}
        onLaunchDashboard={onLaunchDashboard}
        onLaunchAdminPortal={() => onLaunchAdminPortal(adminToken)}
      />

      {/* 2. Real-time Live Blood Stock Ticker */}
      <LiveTicker />

      {/* 3. Hero Section */}
      <HeroSection
        onOpenUserLogin={() => handleOpenLogin('USER')}
        onOpenAdminLogin={() => handleOpenLogin('ADMIN')}
        onOpenRegister={() => setRegisterModalOpen(true)}
      />

      {/* 4. Dedicated Stakeholder Cockpits */}
      <StakeholderCockpits
        onSelectRoleLogin={handleSelectRoleLogin}
      />

      {/* 5. Live Blood Availability & Compatibility Benchmark */}
      <BloodBenchmark />

      {/* 6. Built on Genuine Clinical Infrastructure */}
      <ClinicalInfrastructure />

      {/* 7. Bottom Call to Action Banner */}
      <CtaSection
        onOpenRegister={() => setRegisterModalOpen(true)}
        onOpenLogin={(tab) => handleOpenLogin(tab)}
      />

      {/* 8. Comprehensive Footer with Medical Safeguards */}
      <Footer
        onOpenLogin={(role) => handleSelectRoleLogin(role)}
      />

      {/* Dual Login Gateway Modal (User & Admin Logins) */}
      <AuthGatewayModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
        prefillRole={prefillRole}
        onOpenRegister={() => {
          setAuthModalOpen(false);
          setRegisterModalOpen(true);
        }}
        onLaunchDashboard={onLaunchDashboard}
        onLaunchAdminPortal={onLaunchAdminPortal}
      />

      {/* Registration Modal */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onGoToLogin={() => handleOpenLogin('USER')}
        onSuccess={onLaunchDashboard}
      />

    </div>
  );
};
