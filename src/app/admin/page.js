'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ApraLogo from '@/components/ApraLogo';
import { 
  Users, CheckCircle, Clock, XCircle, Search, Download, 
  Eye, Check, X, Shield, Lock, LogOut, RefreshCw, 
  FileSpreadsheet, ExternalLink, Printer, Copy, CheckCheck,
  Edit, Trash2, Plus, Crown, Scale, Award, Phone, UserPlus, Sparkles
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data state
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState('MEMBERS'); // 'MEMBERS', 'HEADS', 'ANALYTICS', 'SHEETS'
  const [copiedCode, setCopiedCode] = useState(false);

  // Office Bearers Management State
  const [officeBearers, setOfficeBearers] = useState([]);
  const [bearersLoading, setBearersLoading] = useState(false);
  const [bearerSearch, setBearerSearch] = useState('');
  const [bearerCategoryFilter, setBearerCategoryFilter] = useState('ALL');
  const [isBearerModalOpen, setIsBearerModalOpen] = useState(false);
  const [editingBearerId, setEditingBearerId] = useState(null);
  const [bearerStatusMsg, setBearerStatusMsg] = useState({ type: '', text: '' });
  const [bearerForm, setBearerForm] = useState({
    name: '',
    role: '',
    roleTamil: '',
    phone: '',
    category: 'Executive',
    badge: '',
    avatar: '',
    note: ''
  });

  // Check login on mount
  useEffect(() => {
    const saved = localStorage.getItem('apra_admin_auth');
    if (saved === 'true') {
      setIsAuthenticated(true);
      fetchMembers();
      fetchOfficeBearers();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    // Default demo admin credentials
    if (
      (adminEmail === 'admin@apra.org' && adminPass === 'apra2023') ||
      adminPass === '2023' ||
      adminPass === 'admin'
    ) {
      setIsAuthenticated(true);
      localStorage.setItem('apra_admin_auth', 'true');
      fetchMembers();
      fetchOfficeBearers();
    } else {
      setLoginError('Invalid credentials. Use demo: admin@apra.org / apra2023 or PIN 2023');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('apra_admin_auth');
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      if (data.success) {
        setMembers(data.members);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch members:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOfficeBearers = async () => {
    setBearersLoading(true);
    try {
      const res = await fetch('/api/heads');
      const data = await res.json();
      if (data.success) {
        setOfficeBearers(data.bearers || []);
      }
    } catch (err) {
      console.error('Failed to fetch office bearers:', err);
    } finally {
      setBearersLoading(false);
    }
  };

  const handleOpenAddBearer = () => {
    setEditingBearerId(null);
    setBearerForm({
      name: '',
      role: 'Executive Member',
      roleTamil: '',
      phone: '',
      category: 'Executive',
      badge: '',
      avatar: '',
      note: ''
    });
    setBearerStatusMsg({ type: '', text: '' });
    setIsBearerModalOpen(true);
  };

  const handleOpenEditBearer = (bearer) => {
    setEditingBearerId(bearer.id);
    setBearerForm({
      name: bearer.name || '',
      role: bearer.role || '',
      roleTamil: bearer.roleTamil || '',
      phone: bearer.phone || '',
      category: bearer.category || 'Executive',
      badge: bearer.badge || '',
      avatar: bearer.avatar || '',
      note: bearer.note || ''
    });
    setBearerStatusMsg({ type: '', text: '' });
    setIsBearerModalOpen(true);
  };

  const handleSaveBearer = async (e) => {
    e.preventDefault();
    if (!bearerForm.name || !bearerForm.role || !bearerForm.phone) {
      setBearerStatusMsg({ type: 'error', text: 'Please fill name, role, and phone number.' });
      return;
    }

    try {
      if (editingBearerId) {
        // Update existing bearer
        const res = await fetch('/api/heads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingBearerId, ...bearerForm }),
        });
        const data = await res.json();
        if (data.success) {
          fetchOfficeBearers();
          setIsBearerModalOpen(false);
        } else {
          setBearerStatusMsg({ type: 'error', text: data.message || 'Failed to update bearer' });
        }
      } else {
        // Add new bearer
        const res = await fetch('/api/heads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bearerForm),
        });
        const data = await res.json();
        if (data.success) {
          fetchOfficeBearers();
          setIsBearerModalOpen(false);
        } else {
          setBearerStatusMsg({ type: 'error', text: data.message || 'Failed to add bearer' });
        }
      }
    } catch (err) {
      console.error('Error saving office bearer:', err);
      setBearerStatusMsg({ type: 'error', text: 'Network error. Could not save.' });
    }
  };

  const handleDeleteBearer = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from Office Bearers?`)) {
      return;
    }
    try {
      const res = await fetch('/api/heads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOfficeBearers();
      } else {
        alert(data.message || 'Failed to delete office bearer');
      }
    } catch (err) {
      console.error('Error deleting bearer:', err);
    }
  };

  const handleResetBearers = async () => {
    if (!window.confirm('Reset all Office Bearers to official Document 1 records? Any manual additions will be restored to defaults.')) {
      return;
    }
    try {
      const res = await fetch('/api/heads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESET' }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOfficeBearers();
        alert('Office Bearers restored to Document 1 records successfully!');
      }
    } catch (err) {
      console.error('Error resetting office bearers:', err);
    }
  };

  const handleStatusUpdate = async (applicationNo, newStatus) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationNo, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchMembers();
        if (selectedMember && selectedMember.applicationNo === applicationNo) {
          setSelectedMember((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Failed to update member status:', err);
    }
  };

  const exportToCSV = () => {
    if (!members.length) return;
    const headers = [
      'Application No', 'Receipt No', 'Date', 'Status', 'Resident Type', 
      'Full Name', 'Age', 'Gender', 'Plot No', 'Door No', 'Street', 
      'Phone', 'Email', 'Family Count'
    ];

    const rows = members.map(m => [
      m.applicationNo,
      m.receiptNo,
      m.submissionDate,
      m.status,
      m.residentType,
      `"${m.fullName}"`,
      m.age,
      m.gender,
      `"${m.layoutPlotNo || ''}"`,
      `"${m.doorNoNew || ''}"`,
      `"${m.street || ''}"`,
      m.phone,
      m.email || '',
      (m.familyMembers || []).length
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apra_members_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone?.includes(searchTerm) ||
      m.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(m.applicationNo).includes(searchTerm);

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'Approved' && m.status === 'Approved') ||
      (statusFilter === 'Pending' && (m.status === 'Pending Verification' || m.status === 'Pending')) ||
      (statusFilter === 'Rejected' && m.status === 'Rejected');

    return matchesSearch && matchesStatus;
  });

  // Filter office bearers
  const filteredBearers = officeBearers.filter((b) => {
    const term = bearerSearch.toLowerCase();
    const matchesSearch =
      b.name?.toLowerCase().includes(term) ||
      b.role?.toLowerCase().includes(term) ||
      b.roleTamil?.includes(term) ||
      b.phone?.includes(term);

    const matchesCategory =
      bearerCategoryFilter === 'ALL' ||
      (bearerCategoryFilter === 'Executive' && b.category === 'Executive') ||
      (bearerCategoryFilter === 'Secretaries' && b.category === 'Secretaries') ||
      (bearerCategoryFilter === 'Advisors' && b.category === 'Advisors');

    return matchesSearch && matchesCategory;
  });

  // Analytics chart data
  const pieData = [
    { name: 'Owners', value: stats?.ownersCount || 0, color: '#0284c7' },
    { name: 'Tenants', value: stats?.tenantsCount || 0, color: '#f59e0b' },
  ];

  const barData = stats?.ageGroups
    ? Object.keys(stats.ageGroups).map((k) => ({
        ageRange: k,
        count: stats.ageGroups[k],
      }))
    : [];

  const googleAppsScriptCode = `// Google Apps Script to auto-append APRA membership applications into Google Sheets
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var body = JSON.parse(e.postData.contents);
  var data = body.data;

  // Append new member row
  sheet.appendRow([
    data.timestamp,
    data.applicationNo,
    data.receiptNo,
    data.residentType,
    data.fullName,
    data.age,
    data.gender,
    data.plotNo,
    data.doorNoNew,
    data.street,
    data.phone,
    data.email,
    data.status,
    data.familyMembersCount,
    data.familyDetails
  ]);

  return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <ApraLogo className="w-16 h-16 mx-auto mb-3" />
          <h2 className="text-2xl font-black text-white tracking-tight">
            APRA Admin Authentication
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Association for Ponnappa Nadar Nagar Residents Amenity
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-slate-800 py-8 px-6 shadow-2xl rounded-3xl border border-slate-700 sm:px-10">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Admin Email / Username
                </label>
                <input
                  type="text"
                  placeholder="admin@apra.org"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Admin Password or PIN
                </label>
                <input
                  type="password"
                  placeholder="apra2023 or 2023"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition-colors shadow-lg shadow-sky-600/20"
              >
                Sign In to Admin Portal
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-amber-400">Demo Admin Credentials:</div>
              <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-[11px] text-slate-300">
                Email: <span className="text-white">admin@apra.org</span><br />
                Password: <span className="text-white">apra2023</span> (or PIN: <span className="text-white">2023</span>)
              </div>
              <p className="text-[10px] text-slate-500">
                Supports Supabase Auth & Google Apps Script synchronization.
              </p>
            </div>
          </div>
          <div className="text-center mt-4">
            <Link href="/" className="text-xs text-sky-400 hover:text-sky-300">
              ← Return to Association Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <ApraLogo className="w-9 h-9" />
              <div>
                <span className="font-bold text-sm tracking-wide block">APRA Admin Portal</span>
                <span className="text-[10px] text-slate-400 block">Ponnappa Nadar Nagar Amenity</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'MEMBERS', label: 'Membership Register' },
              { id: 'HEADS', label: 'Office Bearers' },
              { id: 'ANALYTICS', label: 'Demographics & Charts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'HEADS' ? (
              <>
                <button
                  onClick={handleResetBearers}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
                  title="Reset to official Document 1 defaults"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>
                <button
                  onClick={handleOpenAddBearer}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Office Bearer</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={fetchMembers}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Members</span>
              <span className="p-2 rounded-xl bg-sky-100 text-sky-700"><Users className="w-4 h-4" /></span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">{stats?.total || 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">Enrolled applications</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved</span>
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700"><CheckCircle className="w-4 h-4" /></span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600">{stats?.approved || 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">Verified members</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Review</span>
              <span className="p-2 rounded-xl bg-amber-100 text-amber-700"><Clock className="w-4 h-4" /></span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-600">{stats?.pending || 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">Awaiting approval</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registration Mode</span>
              <span className="p-2 rounded-xl bg-purple-100 text-purple-700"><CheckCircle className="w-4 h-4" /></span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">Direct Entry</div>
            <div className="text-[11px] text-slate-500 mt-1">Verified by association</div>
          </div>
        </div>

        {/* Tab 1: Member Register Table */}
        {activeTab === 'MEMBERS' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Search & Status Filters */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96 group">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-sky-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search members by name, phone, or plot..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 bg-white shadow-sm transition-all"
                />
              </div>

              <div className="flex bg-slate-200/60 p-1 rounded-xl w-full md:w-auto overflow-x-auto shadow-inner">
                {['ALL', 'Approved', 'Pending', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                      statusFilter === status
                        ? 'bg-white text-sky-700 shadow-md ring-1 ring-slate-900/5 scale-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 scale-95'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Card List View (< md) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No member records found matching your filters.
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <div key={member.applicationNo} className="p-3.5 space-y-2.5 hover:bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-mono text-xs font-bold">
                          App #{member.applicationNo}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            member.residentType === 'Owner'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {member.residentType}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          member.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : member.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{member.fullName}</h4>
                      <p className="text-[11px] text-slate-500">
                        Age: {member.age || 'N/A'} • {member.gender} • Plot {member.layoutPlotNo || '-'}, {member.street}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                      <a href={`tel:${member.phone}`} className="text-sky-600 font-mono font-bold hover:underline">
                        📞 {member.phone}
                      </a>
                      <span className="text-slate-500 text-[11px]">
                        {(member.familyMembers || []).length} family members
                      </span>
                    </div>

                    {/* Mobile Card Action Buttons */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Form</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(member.applicationNo, 'Approved')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 active:scale-95 ${
                          member.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(member.applicationNo, 'Rejected')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 active:scale-95 ${
                          member.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 hover:bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4 w-16">App #</th>
                    <th className="p-4">Member Name</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Address / Street</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Family</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-slate-500 text-sm">
                        No member records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.applicationNo} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-mono font-bold text-sky-800">
                          #{member.applicationNo}
                        </td>
                        <td className="p-4 font-semibold text-slate-900">
                          {member.fullName}
                          <span className="block text-[11px] font-normal text-slate-500">
                            Age: {member.age} • {member.gender}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              member.residentType === 'Owner'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {member.residentType}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-600 max-w-xs truncate">
                          Plot {member.layoutPlotNo || '-'}, {member.street}
                        </td>
                        <td className="p-4 font-mono text-xs">
                          <a href={`tel:${member.phone}`} className="text-sky-600 hover:underline">
                            {member.phone}
                          </a>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">
                          {(member.familyMembers || []).length} members
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              member.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : member.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedMember(member)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                              title="View Document 2 Form Replica"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {member.status !== 'Approved' && (
                              <button
                                onClick={() => handleStatusUpdate(member.applicationNo, 'Approved')}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                                title="Approve Membership"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {member.status !== 'Rejected' && (
                              <button
                                onClick={() => handleStatusUpdate(member.applicationNo, 'Rejected')}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                title="Reject Membership"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Office Bearers Management (Editable only in Admin) */}
        {activeTab === 'HEADS' && (
          <div className="space-y-6">
            {/* Quick stats banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Committee</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{officeBearers.length} Members</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Active Office Bearers</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Executive Officers</span>
                <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
                  {officeBearers.filter((b) => b.category === 'Executive').length} Officers
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">President, VPs, Sec, Treasurer</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">Joint Secretaries</span>
                <div className="text-xl sm:text-2xl font-black text-purple-600 mt-1">
                  {officeBearers.filter((b) => b.category === 'Secretaries').length} Secretaries
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Ward & Community leads</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider block">Advisory Board</span>
                <div className="text-xl sm:text-2xl font-black text-sky-600 mt-1">
                  {officeBearers.filter((b) => b.category === 'Advisors').length} Advisors
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Legal & Senior guidance</div>
              </div>
            </div>

            {/* Bearers List Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Search & Filter bar */}
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search bearer by name, role, phone..."
                    value={bearerSearch}
                    onChange={(e) => setBearerSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                  {['ALL', 'Executive', 'Secretaries', 'Advisors'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setBearerCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        bearerCategoryFilter === cat
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'ALL' ? 'All Roles' : cat}
                    </button>
                  ))}
                  <button
                    onClick={handleOpenAddBearer}
                    className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Mobile Card List View (< md) */}
              <div className="block md:hidden divide-y divide-slate-100">
                {bearersLoading ? (
                  <div className="p-8 text-center text-slate-500 text-xs">Loading office bearers...</div>
                ) : filteredBearers.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No office bearers match your search.
                  </div>
                ) : (
                  filteredBearers.map((bearer) => (
                    <div key={bearer.id} className="p-4 space-y-3 hover:bg-slate-50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {bearer.avatar ? (
                            <img
                              src={bearer.avatar}
                              alt={bearer.name}
                              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
                            />
                          ) : bearer.role.includes('Legal') ? (
                            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                              <Scale className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                              {bearer.name.replace(/Mr\.|Er\.|Adv\./g, '').trim().slice(0, 2).toUpperCase() || 'AP'}
                            </div>
                          )}
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{bearer.name}</h4>
                            <p className="text-xs font-semibold text-sky-700">{bearer.role}</p>
                            {bearer.roleTamil && (
                              <p className="text-[11px] text-slate-500">{bearer.roleTamil}</p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            bearer.category === 'Executive'
                              ? 'bg-amber-100 text-amber-800'
                              : bearer.category === 'Secretaries'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {bearer.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <a
                          href={`tel:${bearer.phone}`}
                          className="inline-flex items-center gap-1.5 font-mono font-bold text-sky-700 hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>+91 {bearer.phone}</span>
                        </a>
                        {bearer.note && (
                          <span className="text-[11px] text-slate-500 italic truncate max-w-[150px]">
                            {bearer.note}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                        <button
                          onClick={() => handleOpenEditBearer(bearer)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBearer(bearer.id, bearer.name)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View (>= md) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Photo / Avatar</th>
                      <th className="py-3 px-4">Member Name</th>
                      <th className="py-3 px-4">Official Designation</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Direct Phone</th>
                      <th className="py-3 px-4">Note / Info</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {bearersLoading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          Loading office bearers...
                        </td>
                      </tr>
                    ) : filteredBearers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          No office bearers found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredBearers.map((bearer) => (
                        <tr key={bearer.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            {bearer.avatar ? (
                              <img
                                src={bearer.avatar}
                                alt={bearer.name}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                              />
                            ) : bearer.role.includes('Legal') ? (
                              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                                <Scale className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                                {bearer.name.replace(/Mr\.|Er\.|Adv\./g, '').trim().slice(0, 2).toUpperCase() || 'AP'}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 text-sm">{bearer.name}</div>
                            {bearer.roleTamil && (
                              <div className="text-[11px] text-slate-500 font-normal">{bearer.roleTamil}</div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <div className="inline-flex items-center gap-1.5 font-bold text-slate-800">
                              {bearer.role === 'President' && <Crown className="w-4 h-4 text-amber-500" />}
                              <span>{bearer.role}</span>
                            </div>
                            {bearer.badge && (
                              <span className="block mt-0.5 text-[10px] font-semibold text-amber-700">
                                {bearer.badge}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                bearer.category === 'Executive'
                                  ? 'bg-amber-100 text-amber-800'
                                  : bearer.category === 'Secretaries'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {bearer.category}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <a
                              href={`tel:${bearer.phone}`}
                              className="inline-flex items-center gap-1 font-mono font-bold text-sky-700 hover:text-sky-900 hover:underline"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>+91 {bearer.phone}</span>
                            </a>
                          </td>

                          <td className="py-3 px-4 text-slate-500 max-w-xs truncate text-[11px]">
                            {bearer.note || '—'}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditBearer(bearer)}
                                className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200"
                                title="Edit Office Bearer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBearer(bearer.id, bearer.name)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                title="Delete Office Bearer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Recharts Demographics & Analytics */}
        {activeTab === 'ANALYTICS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Owners vs Tenants Pie Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Resident Type Distribution (Owner vs. Tenant)
              </h3>
              <p className="text-xs text-slate-500 mb-6">Ratio of property owners to tenants in Ponnappa Nadar Nagar</p>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Age Distribution Bar Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Applicant Age Demographics
              </h3>
              <p className="text-xs text-slate-500 mb-6">Distribution across different resident age brackets</p>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="ageRange" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Google Sheets & Apps Script Setup */}
        {activeTab === 'SHEETS' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Google Sheets Integration URL</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Active Google Sheets Webhook
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-4">
                This URL connects your membership database to the live Google Sheet register.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs break-all text-sky-800 shadow-sm">
                https://script.google.com/macros/s/AKfycbyh5YoxAmYc5nB30NQ6S-lYIaMbyG8MsaVImIq4U_pPy48Hww6QDePuNzBGcDNLkBza/exec
              </div>
            </div>

            {/* Code Box */}
            <div className="relative">
              <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-4 py-2 rounded-t-xl text-xs font-mono">
                <span>Google Apps Script (Code.gs)</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(googleAppsScriptCode);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                >
                  {copiedCode ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 text-slate-200 p-4 rounded-b-xl text-xs font-mono overflow-x-auto max-h-72">
                {googleAppsScriptCode}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Official Form Modal (Document 2 Replica) */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full p-3.5 sm:p-8 max-h-[94vh] overflow-y-auto relative shadow-2xl border border-slate-300">
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200 no-print">
              <span className="font-bold text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider truncate">
                App #{selectedMember.applicationNo} • {selectedMember.fullName}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print Form</span>
                </button>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document 2 Physical Form Layout Replica */}
            <div className="p-3 sm:p-6 border-2 border-slate-800 rounded-xl sm:rounded-2xl bg-white text-slate-900 mt-3 sm:mt-4 official-form-paper">
              <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <ApraLogo className="w-14 h-14" />
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-600 block">
                      Regd. No. 25/2023 • Receipt No: {selectedMember.receiptNo}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold">
                      பொன்னப்பநாடார் நகர் குடியிருப்போர் வசதி மேம்பாட்டு சங்கம்
                    </h3>
                    <h4 className="text-xs sm:text-sm font-semibold tracking-wider text-sky-800">
                      ASSOCIATION FOR PONNAPPANADAR NAGER RESIDENTS AMENITY (APRA)
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Ponnappa Nadar Nagar, Nagercoil - 629 004
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="border-2 border-slate-800 px-4 py-2 font-mono text-sm font-black tracking-wider rounded-lg flex flex-col items-center justify-center bg-slate-50">
                    <span className="text-[10px] text-slate-500 font-sans tracking-normal uppercase">App No</span>
                    <span className="text-lg">{selectedMember.applicationNo}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono tracking-widest font-semibold border-b border-slate-300 pb-1">
                    Date: {selectedMember.submissionDate}
                  </div>
                </div>
              </div>

              <div className="my-3 text-center font-bold text-sm underline uppercase tracking-wider">
                MEMBERSHIP APPLICATION
              </div>

              <div className="text-xs text-slate-700 italic mb-4">
                "Membership to this association is open to all residents of Ponnappanadar Nagar"
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-1 grid grid-cols-2 gap-4 text-xs w-full">
                  <div>
                    <strong>Applicant Name:</strong> {selectedMember.fullName}
                  </div>
                  <div>
                    <strong>Resident Status:</strong> {selectedMember.residentType}
                  </div>
                  <div>
                    <strong>Age / Gender:</strong> {selectedMember.age} yrs / {selectedMember.gender}
                  </div>
                  <div>
                    <strong>Plot / Layout No:</strong> {selectedMember.layoutPlotNo || 'N/A'}
                  </div>
                  <div>
                    <strong>Door No (Old / New):</strong> {selectedMember.doorNoOld || '-'} / {selectedMember.doorNoNew || '-'}
                  </div>
                  <div>
                    <strong>Street:</strong> {selectedMember.street}
                  </div>
                  <div className="col-span-2">
                    <strong>Mailing Address:</strong> {selectedMember.mailingAddress}
                  </div>
                  <div>
                    <strong>Cell Phone:</strong> {selectedMember.phone}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedMember.email || 'N/A'}
                  </div>
                </div>
                
                {selectedMember.photoDataUrl && (
                  <div className="w-28 h-36 flex-shrink-0 border-2 border-slate-300 rounded-lg overflow-hidden shadow-sm bg-slate-50 flex items-center justify-center p-1 self-start">
                    <img 
                      src={selectedMember.photoDataUrl} 
                      alt="Member Photo" 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              {/* Family members table */}
              <div className="mt-4 pt-3 border-t border-slate-300">
                <h5 className="font-bold text-xs mb-2">Household Members to be included in membership card:</h5>
                <table className="w-full text-[11px] border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 p-1 text-left">Sl</th>
                      <th className="border border-slate-300 p-1 text-left">Name</th>
                      <th className="border border-slate-300 p-1 text-left">Gender</th>
                      <th className="border border-slate-300 p-1 text-left">Relationship</th>
                      <th className="border border-slate-300 p-1 text-left">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedMember.familyMembers || []).map((m, idx) => (
                      <tr key={idx}>
                        <td className="border border-slate-300 p-1">{idx + 1}</td>
                        <td className="border border-slate-300 p-1 font-semibold">{m.name}</td>
                        <td className="border border-slate-300 p-1">{m.gender}</td>
                        <td className="border border-slate-300 p-1">{m.relationship}</td>
                        <td className="border border-slate-300 p-1">{m.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Office Use Section */}
              <div className="mt-6 pt-4 border-t-2 border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider mb-2">For Office Use Only:</div>
                <div className="flex items-center justify-between text-xs mb-4">
                  <span>Receipt No: <strong>#{selectedMember.receiptNo}</strong></span>
                  <span>Registration: <strong>Direct Official Enrollment</strong></span>
                  <span>Status: <strong>{selectedMember.status}</strong></span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-xs pt-4 border-t border-slate-300">
                  <div>
                    <div className="h-8 flex items-end justify-center font-serif italic text-slate-700">K.S. Murugesan</div>
                    <p className="border-t border-slate-400 pt-1 font-semibold">President</p>
                  </div>
                  <div>
                    <div className="h-8 flex items-end justify-center font-serif italic text-slate-700">K. Perumal</div>
                    <p className="border-t border-slate-400 pt-1 font-semibold">Secretary</p>
                  </div>
                  <div>
                    <div className="h-8 flex items-end justify-center font-serif italic text-slate-700">D. Vivekanandan</div>
                    <p className="border-t border-slate-400 pt-1 font-semibold">Treasurer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Action Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-end gap-3 no-print">
              <button
                onClick={() => handleStatusUpdate(selectedMember.applicationNo, 'Approved')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Mark as Approved
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedMember.applicationNo, 'Rejected')}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Mark as Rejected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Office Bearer Edit / Add Modal */}
      {isBearerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingBearerId ? 'Edit Office Bearer' : 'Add New Office Bearer'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Updates will immediately reflect on the public association website
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBearerModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error / Status Message */}
            {bearerStatusMsg.text && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  bearerStatusMsg.type === 'error'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {bearerStatusMsg.text}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveBearer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Member Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. K.S. Murugesan / Er. S. Christopher"
                    value={bearerForm.name}
                    onChange={(e) => setBearerForm({ ...bearerForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Role (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. President / Vice-President / Secretary"
                    value={bearerForm.role}
                    onChange={(e) => setBearerForm({ ...bearerForm, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Role in Tamil (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. தலைவர் / செயலாளர் / ஆலோசகர்"
                    value={bearerForm.roleTamil}
                    onChange={(e) => setBearerForm({ ...bearerForm, roleTamil: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="9842186026"
                      value={bearerForm.phone}
                      onChange={(e) => setBearerForm({ ...bearerForm, phone: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category Hierarchy *
                  </label>
                  <select
                    value={bearerForm.category}
                    onChange={(e) => setBearerForm({ ...bearerForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  >
                    <option value="Executive">Executive (President, VP, Sec, Treas)</option>
                    <option value="Secretaries">Secretaries (Joint Secretaries)</option>
                    <option value="Advisors">Advisors (Legal & General Advisors)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Photo / Avatar URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /images/president.jpg or image URL (leave empty for initials)"
                    value={bearerForm.avatar}
                    onChange={(e) => setBearerForm({ ...bearerForm, avatar: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Badge Label (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 👑 President / Lead, Finance, Legal"
                    value={bearerForm.badge}
                    onChange={(e) => setBearerForm({ ...bearerForm, badge: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Note / Affiliation (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Advocate / Ward 4 Rep"
                    value={bearerForm.note}
                    onChange={(e) => setBearerForm({ ...bearerForm, note: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBearerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingBearerId ? 'Save Changes' : 'Add Office Bearer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
