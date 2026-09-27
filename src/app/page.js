import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import OfficeBearers from '@/components/OfficeBearers';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  Building2, ShieldCheck, HeartHandshake, Lightbulb, 
  CheckCircle, ArrowRight, UserPlus, PhoneCall, Sparkles 
} from 'lucide-react';
import { ASSOCIATION_INFO } from '@/data/associationData';

export const metadata = {
  title: 'APRA | Association for Ponnappa Nadar Nagar Residents Amenity, Nagercoil',
  description: 'Official portal for Association for Ponnappa Nadar Nagar Residents Amenity (APRA). Online membership application, latest community updates, and committee directory.',
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-amber-400 selection:text-slate-900 pb-12 lg:pb-0">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Looping Events and Latest Updates */}
        <section id="updates" className="scroll-mt-28 sm:scroll-mt-32">
          <HeroSlider />
        </section>

        {/* Association Objectives & Community Focus */}
        <section id="about" className="py-12 sm:py-20 bg-white border-b border-slate-200 scroll-mt-28 sm:scroll-mt-32">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>About Our Association</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Protecting & Enhancing Quality of Life for All Residents
                </h2>

                <p className="text-slate-600 leading-relaxed text-xs sm:text-base">
                  <strong>{ASSOCIATION_INFO.nameEnglish} (APRA)</strong> is a recognized residents amenity body ({ASSOCIATION_INFO.regdNo}) formed by the proud property owners and tenants of Ponnappa Nadar Nagar, Nagercoil. 
                </p>

                <p className="text-slate-600 leading-relaxed text-xs sm:text-base">
                  Our association works closely with municipal authorities, electricity boards, and law enforcement to ensure well-lit streets, clean drainage, safe roads, and a peaceful community environment for every household.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 sm:pt-2">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Civic Representation</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500">Active dialogue with municipal and utility boards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Inclusive Community</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500">Open to both property owners and residing tenants</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Key Focus Areas Grid */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-100 shadow-xs space-y-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">Street Infrastructure</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Continuous monitoring of streetlights, road tarring, pothole restoration, and cross-street speed regulation.
                  </p>
                </div>

                <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-xs space-y-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">Sanitation & Health</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Organized garbage clearance schedules, mosquito fogging drives, and stormwater drainage maintenance.
                  </p>
                </div>

                <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 shadow-xs space-y-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">Residents Welfare</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Prompt community grievance redressal, dispute resolution, and neighborhood security watch.
                  </p>
                </div>

                <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-xs space-y-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">Cultural & Family Unity</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Annual association family celebrations, general body meetings, and community welfare programs.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Office Bearers Directory (Extracted from Document 1) */}
        <OfficeBearers />

        {/* Membership Call to Action Section */}
        <section className="py-12 sm:py-20 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 sm:space-y-6">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-[11px] sm:text-xs uppercase tracking-wider inline-block">
              Registration Open for 2026-2027
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
              Become an Official Registered Member of APRA Today
            </h2>

            <p className="text-slate-300 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
              Every resident living in Ponnappa Nadar Nagar is encouraged to enroll. Receive your official membership card, include all family members, and participate in association activities.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 sm:pt-4 max-w-md sm:max-w-none mx-auto">
              <Link
                href="/membership"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 active:scale-98 transition-transform"
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Fill Membership Form</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:9442636020"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-base border border-slate-700 active:scale-98 transition-transform"
              >
                <PhoneCall className="w-4 h-4 text-sky-400" />
                <span>Call President (9442636020)</span>
              </a>
            </div>

            <div className="pt-3 sm:pt-6 text-[11px] sm:text-xs text-slate-400">
              Community Enrollment: <span className="text-amber-400 font-bold">Open for all residents</span> • Verified by President, Secretary & Treasurer
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
