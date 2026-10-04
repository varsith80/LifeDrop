import React from 'react';
import { 
  HeartHandshake, 
  ShieldAlert, 
  LogIn, 
  UserPlus, 
  Smartphone, 
  Activity, 
  LogOut, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const Navbar = ({ 
  user, 
  adminUser, 
  onOpenLogin, 
  onOpenRegister, 
  onLogoutUser, 
  onLogoutAdmin, 
  onSwitchToMobile,
  onLaunchDashboard,
  onLaunchAdminPortal
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#062416] border-b border-emerald-900/60 shadow-xl text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <a href="#hero" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 p-0.5 shadow-md shadow-rose-950/40 flex items-center justify-center text-white transform group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-white">LifeDrop</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                    Network
                  </span>
                </div>
                <span className="text-[10px] text-emerald-300/80 tracking-tight font-medium hidden sm:inline">
                  Direct Lifesaving Blood Coordination
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-emerald-100/90 tracking-wide">
            <a href="#cockpits" className="hover:text-emerald-300 transition-colors py-1">
              Stakeholder Portals
            </a>
            <a href="#benchmarks" className="hover:text-emerald-300 transition-colors py-1">
              Blood Benchmarks
            </a>
            <a href="#infrastructure" className="hover:text-emerald-300 transition-colors py-1">
              Cold Chain & Infra
            </a>
            <a href="#safeguards" className="hover:text-emerald-300 transition-colors py-1">
              Clinical Safeguards
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Mobile View Toggle */}
            <button
              onClick={onSwitchToMobile}
              title="Switch to Mobile Frame View"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-200 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/50 transition-all shadow-inner"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mobile App</span>
            </button>

            {/* Authenticated User Pill */}
            {user && (
              <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-700/60 rounded-full px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-200 font-medium truncate max-w-[120px] sm:max-w-[160px]">
                  {user.name || user.email}
                </span>
                <span className="text-[10px] bg-rose-900/60 text-rose-200 px-1.5 py-0.5 rounded font-bold uppercase">
                  {user.role}
                </span>
                <button
                  onClick={onLaunchDashboard}
                  className="text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 px-2 py-0.5 rounded-full ml-1"
                >
                  App
                </button>
                <button
                  onClick={onLogoutUser}
                  title="Logout User"
                  className="text-emerald-400 hover:text-white transition-colors ml-0.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Authenticated Admin Pill */}
            {adminUser && !user && (
              <div className="flex items-center gap-2 bg-purple-950/60 border border-purple-700/60 rounded-full px-3 py-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-purple-200 font-medium">Admin Active</span>
                <button
                  onClick={onLaunchAdminPortal}
                  className="text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 px-2 py-0.5 rounded-full ml-1 flex items-center gap-1"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={onLogoutAdmin}
                  title="Logout Admin"
                  className="text-purple-300 hover:text-white transition-colors ml-0.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Not Logged In Actions */}
            {!user && !adminUser && (
              <>
                <button
                  onClick={onOpenRegister}
                  className="px-3.5 py-1.5 text-xs font-semibold text-emerald-200 hover:text-white bg-transparent hover:bg-emerald-900/50 rounded-lg transition-all"
                >
                  Register
                </button>

                {/* User Login Button */}
                <button
                  onClick={() => onOpenLogin('USER')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-md shadow-rose-950/50 hover:shadow-rose-900/40 transition-all active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>User Login</span>
                </button>

                {/* Admin Login Button */}
                <button
                  onClick={() => onOpenLogin('ADMIN')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-100 bg-[#0c3924] hover:bg-[#124b31] border border-emerald-600/40 rounded-lg shadow-sm transition-all active:scale-95"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Admin</span> Login
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
