'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ApraLogo from './ApraLogo';
import { 
  Menu, X, Shield, UserPlus, PhoneCall, Home, Bell, Users, FileText 
} from 'lucide-react';
import { ASSOCIATION_INFO } from '@/data/associationData';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isMembershipPage = pathname === '/membership';
  const isAdminPage = pathname === '/admin';

  return (
    <>
      {/* Main Sticky Navbar & Top Banner Wrapper */}
      <header className="sticky top-0 z-40 shadow-xs">
        {/* Top Banner Notice - Stays Static & Pinned on Scroll */}
        <div className="bg-slate-950 text-slate-200 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
              <span className="font-bold text-amber-300 truncate">{ASSOCIATION_INFO.regdNo}</span>
              <span className="hidden md:inline text-slate-500">•</span>
              <span className="hidden md:inline text-slate-300">Nagercoil - 629 004</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a 
                href="tel:9442636020" 
                className="text-slate-300 hover:text-amber-300 active:scale-95 transition-all flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800"
              >
                <PhoneCall className="w-3 h-3 text-emerald-400" />
                <span className="font-mono text-[10px] sm:text-xs font-semibold">9442636020</span>
              </a>
              <Link
                href="/admin"
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors text-[10px] sm:text-xs"
              >
                <Shield className="w-3 h-3" />
                <span className="hidden xs:inline">Admin</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Glass Navigation Bar */}
        <div className="glass-nav border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Bilingual Title */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
              <ApraLogo className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 group-hover:scale-105 transition-transform" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-base font-black text-slate-900 tracking-tight leading-tight truncate">
                  {ASSOCIATION_INFO.nameTamil}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-sky-700 tracking-wide truncate">
                  APRA • NAGERCOIL
                </span>
                <span className="text-[9px] text-slate-500 hidden sm:block truncate">
                  Sankara Menon Street, P.N. Nagar - 629 004
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link 
                href="/" 
                className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname === '/' ? 'text-sky-600 font-bold' : 'text-slate-700 hover:text-sky-600'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <a href="/#updates" className="text-sm font-semibold text-slate-700 hover:text-sky-600 transition-colors flex items-center gap-1.5">
                <Bell className="w-4 h-4" />
                <span>Updates</span>
              </a>
              <a href="/#heads" className="text-sm font-semibold text-slate-700 hover:text-sky-600 transition-colors flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>Office Bearers</span>
              </a>
              <a href="/#about" className="text-sm font-semibold text-slate-700 hover:text-sky-600 transition-colors">
                <span>About APRA</span>
              </a>
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white text-sm font-bold shadow-md hover:from-sky-500 hover:to-blue-600 transition-all hover:shadow-lg active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>New Membership</span>
              </Link>
            </nav>

            {/* Mobile Header Quick Actions */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <Link
                href="/membership"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold shadow-xs active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Apply</span>
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100 active:bg-slate-200"
            >
              <Home className="w-4 h-4 text-sky-600" />
              <span>Association Home</span>
            </Link>
            <a
              href="/#updates"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100 active:bg-slate-200"
            >
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Events & Circulars</span>
            </a>
            <a
              href="/#heads"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100 active:bg-slate-200"
            >
              <Users className="w-4 h-4 text-sky-600" />
              <span>Office Bearers Directory</span>
            </a>
            <a
              href="/#about"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100 active:bg-slate-200"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>About Association Bylaws</span>
            </a>
            
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/membership"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold text-sm text-center shadow-md active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>Fill Membership Application</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs text-center border border-slate-300 active:scale-98"
              >
                <Shield className="w-3.5 h-3.5 text-sky-700" />
                <span>Admin Login Portal</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom App Navigation Bar for Mobile Users (Admin link removed for mobile users) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl py-2 px-6 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-3 items-center justify-items-center text-center">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 transition-colors ${
              pathname === '/' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <a
            href="/#heads"
            className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900"
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-medium">Leaders</span>
          </a>

          <Link
            href="/membership"
            className={`flex flex-col items-center gap-1 transition-colors ${
              isMembershipPage ? 'text-sky-600 font-bold' : 'text-slate-700 hover:text-sky-600'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white flex items-center justify-center shadow-md -mt-3 ring-4 ring-white">
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-sky-700">Apply</span>
          </Link>
        </div>
      </div>
    </>
  );
}

