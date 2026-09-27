import Link from 'next/link';
import ApraLogo from './ApraLogo';
import { ASSOCIATION_INFO } from '@/data/associationData';
import { MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Association Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ApraLogo className="w-12 h-12" />
              <div>
                <h3 className="text-white font-bold text-base leading-tight">
                  {ASSOCIATION_INFO.shortName}
                </h3>
                <span className="text-xs text-amber-400 font-mono">
                  {ASSOCIATION_INFO.regdNo}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {ASSOCIATION_INFO.nameTamil}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated to resident welfare, road amenities, street illumination, sanitation, and safety in Ponnappa Nadar Nagar.
            </p>
          </div>

          {/* Column 2: Registered Address */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Registered Office
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200">Head Office:</p>
                <p>{ASSOCIATION_INFO.addressTamil}</p>
                <p className="mt-1 text-slate-400">{ASSOCIATION_INFO.addressEnglish}</p>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
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
                <a href="#updates" className="hover:text-amber-400 transition-colors">
                  Latest Events & Announcements
                </a>
              </li>
              <li>
                <Link href="/membership" className="text-amber-400 font-semibold hover:underline">
                  New Membership Application (Doc 2 Form)
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
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Emergency & Inquiries
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <a href="tel:9442636020" className="hover:text-white font-mono">
                  +91 94426 36020 (President)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <a href="tel:9994911733" className="hover:text-white font-mono">
                  +91 99949 11733 (Secretary)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Membership: Open for Residents</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} APRA (Association for Ponnappa Nadar Nagar Residents Amenity). All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>Nagercoil - 629 004</span>
            <span>•</span>
            <Link href="/admin" className="hover:text-slate-300">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
