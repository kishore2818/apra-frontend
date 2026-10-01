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

    return (
      <div className={`relative overflow-hidden group bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-500 ${compact ? 'p-3 flex flex-col items-center text-center' : 'p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4'}`}>
        
        {/* Subtle background glow effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-sky-100/50 via-emerald-50/50 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] blur-xl pointer-events-none" />

        {/* Top: Avatar */}
        <div className="relative z-10 flex-shrink-0">
          {bearer.avatar ? (
            <img
              src={bearer.avatar}
              alt={bearer.name}
              className={`${compact ? 'w-14 h-14' : 'w-16 h-16 sm:w-20 sm:h-20'} rounded-[1rem] object-cover shadow-sm group-hover:scale-105 group-hover:rotate-1 transition-transform duration-500`}
            />
          ) : isLegal ? (
            <div className={`${compact ? 'w-14 h-14' : 'w-16 h-16 sm:w-20 sm:h-20'} rounded-[1rem] bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-inner group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-500`}>
              <Scale className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} opacity-80`} />
            </div>
          ) : (
            <div className={`${compact ? 'w-14 h-14' : 'w-16 h-16 sm:w-20 sm:h-20'} rounded-[1rem] bg-gradient-to-br from-sky-100 to-blue-50 text-sky-900 flex items-center justify-center font-bold text-lg shadow-inner group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-500`}>
              {initials || 'AP'}
            </div>
          )}
        </div>

        {/* Member Details */}
        <div className={`relative z-10 flex-1 min-w-0 ${compact ? 'w-full mt-2' : 'text-center sm:text-left mt-2 sm:mt-0'}`}>
          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
            {bearer.name}
          </h4>
          <p className="text-[11px] sm:text-xs font-semibold text-sky-700/80 mt-1 uppercase tracking-wider">
            {bearer.role}
          </p>
          
          {/* Phone Display (Hidden in compact mobile view) */}
          {!compact && (
            <div className="hidden sm:flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-mono">
              <Phone className="w-3.5 h-3.5 opacity-60" />
              <span>{bearer.phone}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`relative z-10 flex items-center justify-center gap-2 ${compact ? 'pt-3 w-full' : 'pt-3 sm:pt-0 sm:flex-col lg:flex-row sm:self-center'}`}>
          <a
            href={`tel:${bearer.phone}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-sky-500 hover:text-white hover:shadow-lg hover:shadow-sky-500/20 font-bold text-[11px] sm:text-xs transition-all duration-300 border border-slate-200 hover:border-sky-500 active:scale-95"
            title={`Call ${bearer.phone}`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span className={compact ? 'hidden' : 'inline'}>Call</span>
          </a>
          <a
            href={`https://wa.me/91${bearer.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20 font-bold text-[11px] sm:text-xs transition-all duration-300 border border-emerald-200 hover:border-emerald-500 active:scale-95"
            title="WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className={compact ? 'hidden' : 'hidden lg:inline'}>WhatsApp</span>
          </a>
        </div>
      </div>
    );
  };

  return (
    <section id="heads" className="py-12 sm:py-20 relative scroll-mt-28 sm:scroll-mt-32 overflow-hidden bg-slate-50">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-emerald-200/30 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-2 sm:space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
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
          <div className="relative rounded-[2.5rem] bg-white/80 backdrop-blur-md border border-amber-200/50 p-6 sm:p-10 shadow-lg hover:shadow-2xl hover:border-amber-300 transition-all duration-700 overflow-hidden group">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Crown Badge */}
            <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-200 to-amber-100 text-amber-900 text-xs sm:text-sm font-black uppercase tracking-widest mb-6 shadow-sm ring-1 ring-amber-300/50">
              <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>PRESIDENT</span>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-10">
              {/* President Photo */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-amber-400 rounded-full blur group-hover:blur-md transition-all duration-500 opacity-30" />
                <img
                  src={president.avatar || '/images/president.jpg'}
                  alt={president.name}
                  className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 group-hover:rotate-2 transition-transform duration-700"
                />
              </div>

              {/* President Information */}
              <div className="text-center sm:text-left space-y-3 flex-1 min-w-0">
                <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                  {president.name}
                </h3>
                
                <div className="space-y-1">
                  <p className="text-base font-bold text-amber-600 uppercase tracking-widest">President</p>
                  <p className="text-sm text-slate-500 font-medium">APRA Leadership Council</p>
                </div>

                {/* President Action Buttons */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-4">
                  <a
                    href={`tel:${president.phone}`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-md hover:shadow-xl hover:text-sky-600 border border-slate-200 transition-all duration-300 active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={`https://wa.me/91${president.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 active:scale-95"
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
