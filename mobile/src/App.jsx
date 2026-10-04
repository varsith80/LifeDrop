import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider, useSocket } from './context/SocketContext';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { DemoBar } from './components/DemoBar';

// Auth Screens
import { SplashScreen } from './screens/auth/SplashScreen';
import { OnboardingScreen } from './screens/auth/OnboardingScreen';
import { LoginScreen } from './screens/auth/LoginScreen';
import { RegisterScreen } from './screens/auth/RegisterScreen';

// Donor Screens
import { DonorDashboard } from './screens/donor/DonorDashboard';
import { EmergencyRequestsScreen } from './screens/donor/EmergencyRequestsScreen';
import { DonationHistoryScreen } from './screens/donor/DonationHistoryScreen';

// Patient Screens
import { PatientDashboard } from './screens/patient/PatientDashboard';
import { CreateEmergencyRequestScreen } from './screens/patient/CreateEmergencyRequestScreen';
import { TrackRequestScreen } from './screens/patient/TrackRequestScreen';

// Hospital & Blood Bank Screens
import { HospitalDashboard } from './screens/hospital/HospitalDashboard';
import { BloodBankDashboard } from './screens/bloodBank/BloodBankDashboard';

// Common Screens
import { NotificationsScreen } from './screens/common/NotificationsScreen';
import { ProfileScreen } from './screens/common/ProfileScreen';

// Landing Page Suite
import { LandingPage } from './components/LandingPage/LandingPage';

const MainApp = () => {
  const { user, loading } = useAuth();
  const { liveAlert, clearAlert } = useSocket();

  // Navigation states
  const [authStep, setAuthStep] = useState('SPLASH'); // 'SPLASH' | 'ONBOARDING' | 'LOGIN' | 'REGISTER'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // If user logs in or switches, default to dashboard
  useEffect(() => {
    if (user) {
      setActiveTab('dashboard');
    }
  }, [user?.role, user?._id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 text-slate-400">
        <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Not Logged In Flows
  if (!user) {
    if (authStep === 'SPLASH') {
      return (
        <SplashScreen
          onGetStarted={() => {
            const hasSeenOnboarding = localStorage.getItem('hemolink_seen_onboarding');
            if (hasSeenOnboarding) {
              setAuthStep('LOGIN');
            } else {
              setAuthStep('ONBOARDING');
            }
          }}
        />
      );
    }

    if (authStep === 'ONBOARDING') {
      return (
        <OnboardingScreen
          onFinish={() => {
            localStorage.setItem('hemolink_seen_onboarding', 'true');
            setAuthStep('LOGIN');
          }}
        />
      );
    }

    if (authStep === 'REGISTER') {
      return (
        <RegisterScreen
          onGoToLogin={() => setAuthStep('LOGIN')}
          onSuccess={() => setActiveTab('dashboard')}
        />
      );
    }

    // Default to Login
    return (
      <LoginScreen
        onGoToRegister={() => setAuthStep('REGISTER')}
        onForgotPassword={() => alert('Demo Password reset code sent: 741258')}
        onSuccess={() => setActiveTab('dashboard')}
      />
    );
  }

  // Logged In App Content Router
  const renderContent = () => {
    // If tracking specific request
    if (selectedRequestId) {
      return (
        <TrackRequestScreen
          requestId={selectedRequestId}
          onBack={() => setSelectedRequestId(null)}
        />
      );
    }

    // Notifications view
    if (activeTab === 'notifications') {
      return (
        <NotificationsScreen
          onBack={() => setActiveTab('dashboard')}
          onNavigateRequest={(reqId) => setSelectedRequestId(reqId)}
        />
      );
    }

    // Profile view
    if (activeTab === 'profile') {
      return <ProfileScreen />;
    }

    // Role-specific screens
    const role = user.role;

    if (role === 'DONOR') {
      switch (activeTab) {
        case 'emergency-requests':
          return (
            <EmergencyRequestsScreen
              onBack={() => setActiveTab('dashboard')}
              onNavigateTracking={(id) => setSelectedRequestId(id)}
            />
          );
        case 'history':
          return <DonationHistoryScreen onBack={() => setActiveTab('dashboard')} />;
        case 'dashboard':
        default:
          return (
            <DonorDashboard
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectRequest={(id) => setSelectedRequestId(id)}
            />
          );
      }
    }

    if (role === 'PATIENT') {
      switch (activeTab) {
        case 'create-request':
          return (
            <CreateEmergencyRequestScreen
              onBack={() => setActiveTab('dashboard')}
              onSuccess={(id) => {
                setSelectedRequestId(id);
              }}
            />
          );
        case 'my-requests':
          return (
            <PatientDashboard
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectRequest={(id) => setSelectedRequestId(id)}
            />
          );
        case 'dashboard':
        default:
          return (
            <PatientDashboard
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectRequest={(id) => setSelectedRequestId(id)}
            />
          );
      }
    }

    if (role === 'HOSPITAL') {
      return <HospitalDashboard />;
    }

    if (role === 'BLOOD_BANK') {
      return <BloodBankDashboard />;
    }

    // Fallback
    return <ProfileScreen />;
  };

  return (
    <div className="flex-1 flex flex-col justify-between relative bg-slate-50 min-h-full">
      {/* Top Demo Quick Bar */}
      <DemoBar
        onFlowComplete={(newReqId) => {
          setSelectedRequestId(newReqId);
        }}
      />

      <OfflineBanner />

      <Header
        onOpenNotifications={() => setActiveTab('notifications')}
        unreadCount={unreadCount}
      />

      {/* Real-time Push Alert Banner */}
      {liveAlert && (
        <div className="mx-3 my-2 p-3 bg-rose-600 text-white rounded-2xl shadow-lg flex items-center justify-between animate-bounce z-40 text-xs">
          <div>
            <strong className="block leading-tight">{liveAlert.title}</strong>
            <span className="text-[11px] opacity-90 block mt-0.5">{liveAlert.message}</span>
          </div>
          <button
            onClick={clearAlert}
            className="ml-2 px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Screen Body */}
      <div className="flex-1 flex flex-col">{renderContent()}</div>

      {/* Bottom Tab Bar */}
      {!selectedRequestId && activeTab !== 'notifications' && (
        <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
      )}
    </div>
  );
};

const AppRoot = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'mobile' ? 'MOBILE' : 'LANDING';
  });

  const handleLaunchAdmin = (token) => {
    const adminUrl = token 
      ? `http://localhost:5174?token=${encodeURIComponent(token)}` 
      : 'http://localhost:5174';
    window.open(adminUrl, '_blank');
  };

  if (viewMode === 'LANDING') {
    return (
      <LandingPage
        onSwitchToMobile={() => setViewMode('MOBILE')}
        onLaunchDashboard={() => setViewMode('MOBILE')}
        onLaunchAdminPortal={handleLaunchAdmin}
      />
    );
  }

  return (
    <MobileFrame onBackToLanding={() => setViewMode('LANDING')}>
      <MainApp onBackToLanding={() => setViewMode('LANDING')} />
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppRoot />
      </SocketProvider>
    </AuthProvider>
  );
}

