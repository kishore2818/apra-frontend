import Link from 'next/link';
import ApraLogo from './ApraLogo';
import { ASSOCIATION_INFO } from '@/data/associationData';
import { MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          
          {/* Column 1: Association Brand */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3">
              <ApraLogo className="w-10 h-10 md:w-12 md:h-12" />
              <div>
                <h3 className="text-white font-bold text-sm md:text-base leading-tight">
                  {ASSOCIATION_INFO.shortName}
                </h3>
                <span className="text-[10px] md:text-xs text-amber-400 font-mono">
                  {ASSOCIATION_INFO.regdNo}
                </span>
              </div>
            </div>
            <p className="hidden sm:block text-xs text-slate-400 leading-relaxed">
              {ASSOCIATION_INFO.nameTamil}
            </p>
            <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed max-w-sm">
              Dedicated to resident welfare, road amenities, and safety in Ponnappa Nadar Nagar.
            </p>
          </div>

          {/* Column 2: Registered Address (Hidden on very small screens, concise otherwise) */}
          <div className="hidden sm:block space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Registered Office
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200">Head Office:</p>
                <p className="mt-1 text-slate-400">{ASSOCIATION_INFO.addressEnglish}</p>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Links (Hidden on mobile) */}
          <div className="hidden md:block space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Association Home
                </Link>
              </li>
              <li>
                <a href="#heads" className="hover:text-amber-400 transition-colors">
                  Office Bearers & Advisory Council
                </a>
              </li>
              <li>
                <Link href="/membership" className="text-amber-400 font-semibold hover:underline">
                  New Membership Application
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sky-400 hover:underline">
                  Admin Verification Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Bylaws */}
          <div className="space-y-2 md:space-y-3">
            <h4 className="hidden sm:block text-white font-bold text-xs uppercase tracking-wider">
              Emergency & Inquiries
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-[10px] md:text-xs">
              <div className="flex items-center gap-1.5 md:gap-2 bg-slate-900/50 p-2 sm:p-0 rounded-lg sm:bg-transparent">
                <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                <a href="tel:9442636020" className="hover:text-white font-mono truncate">
                  <span className="sm:hidden text-slate-500 mr-1">Pres:</span>+91 94426 36020
                </a>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 bg-slate-900/50 p-2 sm:p-0 rounded-lg sm:bg-transparent">
                <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                <a href="tel:9994911733" className="hover:text-white font-mono truncate">
                  <span className="sm:hidden text-slate-500 mr-1">Sec:</span>+91 99949 11733
                </a>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Membership: Open for Residents</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 md:mt-12 pt-4 md:pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] md:text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} APRA. All Rights Reserved.</p>
          <div className="flex items-center justify-center gap-3">
            <span className="hidden sm:inline">Nagercoil - 629 004</span>
            <span className="hidden sm:inline">•</span>
            <Link href="/admin" className="hover:text-slate-300 bg-slate-900 px-3 py-1 rounded-full sm:bg-transparent sm:px-0 sm:py-0">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
