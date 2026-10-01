'use client';

import { useState, useEffect } from 'react';
import { 
  Phone, MessageCircle, Copy, Check, Search, Shield, 
  Crown, Users, Scale, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { OFFICE_BEARERS } from '@/data/associationData';

export default function OfficeBearers() {
  const [bearersList, setBearersList] = useState(OFFICE_BEARERS);
  const [filterTab, setFilterTab] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedPhone, setCopiedPhone] = useState('');

  // Fetch updated bearers from API on client mount
  useEffect(() => {
    fetch('/api/heads')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.bearers?.length) {
          setBearersList(data.bearers);
        }
      })
      .catch((err) => console.error('Failed to load bearers:', err));
  }, []);

  const handleCopy = (phone) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(''), 2000);
  };

  // Filter logic
  const matchesSearchOrFilter = (bearer) => {
    const matchesSearch =
      bearer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bearer.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bearer.phone.includes(searchTerm);

    const matchesRole = selectedRole === 'ALL' || bearer.role.toLowerCase().includes(selectedRole.toLowerCase());

    const matchesTab =
      filterTab === 'ALL' ||
      (filterTab === 'Office Bearers' && (bearer.category === 'Executive' || bearer.category === 'Secretaries')) ||
      (filterTab === 'Executives' && bearer.category === 'Executive') ||
      (filterTab === 'Joint Secretaries' && bearer.category === 'Secretaries') ||
      (filterTab === 'Advisors' && bearer.category === 'Advisors');

    return matchesSearch && matchesRole && matchesTab;
  };

  // Partition bearers by hierarchy
  const president = bearersList.find((b) => b.role === 'President');
  const vicePresidents = bearersList.filter((b) => b.role.includes('Vice-President'));
  const secAndTreasurer = bearersList.filter((b) => b.role === 'Secretary' || b.role === 'Treasurer');
  const jointSecretaries = bearersList.filter((b) => b.role.includes('Joint Secretary'));
  const legalAdvisors = bearersList.filter((b) => b.role.includes('Legal'));
  const generalAdvisors = bearersList.filter((b) => b.role.includes('General'));

  // Helper Card Component for individual member
  const MemberCard = ({ bearer, compact = false }) => {
    const isLegal = bearer.role.includes('Legal');
    
    // Initials for avatar
    const initials = bearer.name
      .replace(/Mr\.|Er\.|Adv\./g, '')
      .trim()
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

    // Compact mode: vertical stack for 3-column mobile grid
    if (compact) {
      return (
        <div className="bg-white rounded-2xl p-2.5 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-2">
          {/* Avatar */}
          {bearer.avatar ? (
            <img
              src={bearer.avatar}
              alt={bearer.name}
              className="w-10 h-10 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-slate-100 shadow-xs flex-shrink-0"
            />
          ) : isLegal ? (
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold flex-shrink-0 shadow-inner">
              <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs sm:text-base flex-shrink-0 shadow-inner">
              {initials || 'AP'}
            </div>
          )}

          {/* Name & Role */}
          <div className="w-full min-w-0">
            <h4 className="text-[10px] sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
              {bearer.name}
            </h4>
            <p className="text-[9px] sm:text-xs font-medium text-slate-500 mt-0.5 line-clamp-1">
              {bearer.role}
            </p>
          </div>

          {/* Icon-only action buttons */}
          <div className="flex gap-1.5 pt-1 border-t border-slate-100 w-full justify-center">
            <a
              href={`tel:${bearer.phone}`}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/80 active:scale-95 transition-colors"
              title={`Call ${bearer.phone}`}
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
            <a
              href={`https://wa.me/91${bearer.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs active:scale-95 transition-colors"
              title="WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>
      );
    }

    // Default (full) card layout
    return (
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center space-y-3 group text-center">
        {/* Top: Avatar */}
        {bearer.avatar ? (
          <img
            src={bearer.avatar}
            alt={bearer.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
        ) : isLegal ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform duration-300">
            <Scale className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-sky-100/60 text-sky-900 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform duration-300">
            {initials || 'AP'}
          </div>
        )}

        {/* Member Details */}
        <div className="w-full">
          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {bearer.name}
          </h4>
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1">
            {bearer.role}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 pt-2 w-full">
          <a
            href={`tel:${bearer.phone}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold text-[11px] sm:text-xs transition-colors border border-sky-100 active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call</span>
          </a>
          <a
            href={`https://wa.me/91${bearer.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0F9D58] hover:bg-[#0b8248] text-white font-semibold text-[11px] sm:text-xs transition-colors active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    );
  };

  return (
    <section id="heads" className="py-12 sm:py-20 bg-slate-50/70 relative scroll-mt-28 sm:scroll-mt-32">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Committee Members
          </h2>
          <p className="text-xs sm:text-base text-slate-500 font-medium">
            APRA Leadership Council & Office Bearers
          </p>
        </div>

        {/* Top Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
          {[
            { id: 'ALL', label: 'All Members' },
            { id: 'Office Bearers', label: 'Office Bearers' },
            { id: 'Executives', label: 'Executives' },
            { id: 'Joint Secretaries', label: 'Joint Secretaries' },
            { id: 'Advisors', label: 'Advisors' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-95 flex-shrink-0 ${
                filterTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar & Role Selector Dropdown */}
        <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xs max-w-4xl mx-auto flex flex-row items-stretch gap-2.5">
          {/* Search — left side on all screens */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, role or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 focus:bg-white"
            />
          </div>

          {/* Role selector — right side on all screens */}
          <div className="relative w-28 sm:w-48 flex-shrink-0">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full appearance-none pl-2.5 pr-7 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Roles ▾</option>
              <option value="President">President</option>
              <option value="Vice-President">Vice Presidents</option>
              <option value="Secretary">Secretary</option>
              <option value="Treasurer">Treasurer</option>
              <option value="Joint Secretary">Joint Sec.</option>
              <option value="Legal">Legal Advisors</option>
              <option value="General">General Adv.</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. FEATURED PRESIDENT CARD (Matching Reference Image)   */}
        {/* ======================================================== */}
        {president && matchesSearchOrFilter(president) && (
          <div className="relative rounded-3xl border-2 border-amber-300/90 bg-gradient-to-r from-amber-50/60 via-white to-amber-50/30 p-5 sm:p-8 shadow-sm">
            
            {/* Crown Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-4 border border-amber-300/60 shadow-2xs">
              <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>PRESIDENT</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
              {/* President Photo */}
              <div className="relative flex-shrink-0">
                <img
                  src={president.avatar || '/images/president.jpg'}
                  alt={president.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-amber-300"
                />
              </div>

              {/* President Information */}
              <div className="text-center sm:text-left space-y-2 flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {president.name}
                </h3>
                
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-700">President</p>
                  <p className="text-xs text-slate-500">APRA Leadership Council</p>
                </div>

                {/* Phone & Copy Button */}
                <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-sm font-mono font-bold text-slate-800 pt-1">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>{president.phone}</span>
                  <button
                    onClick={() => handleCopy(president.phone)}
                    className="p-1 text-slate-400 hover:text-slate-800 active:scale-90"
                    title="Copy Phone"
                  >
                    {copiedPhone === president.phone ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* President Action Buttons */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3">
                  <a
                    href={`tel:${president.phone}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-xs sm:text-sm border border-sky-200 active:scale-95 transition-all"
                  >
                    <Phone className="w-4 h-4 text-sky-600" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={`https://wa.me/91${president.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. VICE PRESIDENTS SECTION                               */}
        {/* ======================================================== */}
        {vicePresidents.some(matchesSearchOrFilter) && (
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-sky-100/70 text-sky-950 font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs sm:text-sm shadow-2xs border border-sky-200/50">
              <Users className="w-4 h-4 text-sky-700" />
              <span>Vice Presidents</span>
            </div>

            {/* Mobile: 2 cols | Desktop: 2 cols */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
              {vicePresidents.filter(matchesSearchOrFilter).map((vp, idx) => (
                <MemberCard key={idx} bearer={vp} />
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. SECRETARY & TREASURER SECTION                         */}
        {/* ======================================================== */}
        {secAndTreasurer.some(matchesSearchOrFilter) && (
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-emerald-100/70 text-emerald-950 font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs sm:text-sm shadow-2xs border border-emerald-200/50">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Secretary & Treasurer</span>
            </div>

            {/* Mobile: 2 cols | Desktop: 2 cols */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
              {secAndTreasurer.filter(matchesSearchOrFilter).map((member, idx) => (
                <MemberCard key={idx} bearer={member} />
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. JOINT SECRETARIES SECTION                             */}
        {/* ======================================================== */}
        {jointSecretaries.some(matchesSearchOrFilter) && (
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-purple-100/70 text-purple-950 font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs sm:text-sm shadow-2xs border border-purple-200/50">
              <Users className="w-4 h-4 text-purple-700" />
              <span>Joint Secretaries</span>
            </div>

            {/* Mobile: 3 cols | Desktop: 3 cols */}
            <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4">
              {jointSecretaries.filter(matchesSearchOrFilter).map((js, idx) => (
                <MemberCard key={idx} bearer={js} compact={true} />
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. LEGAL & GENERAL ADVISORS DUAL GRID SECTION            */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Legal Advisors Column */}
          {legalAdvisors.some(matchesSearchOrFilter) && (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-rose-100/70 text-rose-950 font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs sm:text-sm shadow-2xs border border-rose-200/50">
                <Scale className="w-4 h-4 text-rose-700" />
                <span>Legal Advisors</span>
              </div>

              {/* Mobile: 2 cols */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:block lg:space-y-4">
                {legalAdvisors.filter(matchesSearchOrFilter).map((advisor, idx) => (
                  <MemberCard key={idx} bearer={advisor} />
                ))}
              </div>
            </div>
          )}

          {/* General Advisors Column */}
          {generalAdvisors.some(matchesSearchOrFilter) && (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-sky-100/70 text-sky-950 font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs sm:text-sm shadow-2xs border border-sky-200/50">
                <Users className="w-4 h-4 text-sky-700" />
                <span>General Advisors</span>
              </div>

              {/* Mobile: 2 cols */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:block lg:space-y-4">
                {generalAdvisors.filter(matchesSearchOrFilter).map((advisor, idx) => (
                  <MemberCard key={idx} bearer={advisor} />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
