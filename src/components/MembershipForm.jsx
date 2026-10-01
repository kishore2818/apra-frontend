'use client';

import { useState } from 'react';
import { ASSOCIATION_INFO } from '@/data/associationData';
import { 
  User, Home, Phone, Mail, MapPin, Users, Plus, Trash2, CheckCircle2, 
  Printer, ArrowRight, ShieldCheck, Sparkles, Upload, FileText, AlertCircle,
  Share2, MessageCircle, Copy, Check
} from 'lucide-react';
import ApraLogo from './ApraLogo';

export default function MembershipForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    residentType: 'Owner', // Owner or Tenant
    fullName: '',
    age: '',
    gender: 'Male',
    layoutPlotNo: '',
    doorNoOld: '',
    doorNoNew: '',
    street: '',
    mailingAddress: '',
    phone: '',
    landline: '',
    email: '',
    photoDataUrl: '',
    signatureName: '',
    declarationAccepted: false,
    familyMembers: [
      { id: 1, name: '', gender: 'Male', relationship: 'Self', age: '' },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedAppNo, setCopiedAppNo] = useState(false);

  // Handle simple input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Autofill mailing address if applicant fills plot/door/street
  const handleAutoSuggestAddress = () => {
    const parts = [
      formData.fullName ? formData.fullName : '',
      formData.layoutPlotNo ? `Plot No. ${formData.layoutPlotNo}` : '',
      formData.doorNoNew ? `Door No. ${formData.doorNoNew}` : '',
      formData.street ? formData.street : '',
      'Ponnappa Nadar Nagar, Nagercoil - 629 004',
    ].filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      mailingAddress: parts.join(', '),
    }));
  };

  // Photo upload handling (converting to Data URL for instant preview and storage)
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoDataUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Family Members Table handling
  const handleFamilyChange = (index, field, value) => {
    const updated = [...formData.familyMembers];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, familyMembers: updated }));
  };

  const addFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: [
        ...prev.familyMembers,
        { id: Date.now(), name: '', gender: 'Male', relationship: 'Family Member', age: '' },
      ],
    }));
  };

  const removeFamilyMember = (index) => {
    if (formData.familyMembers.length === 1) return;
    const updated = formData.familyMembers.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, familyMembers: updated }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter applicant name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.declarationAccepted) {
      setErrorMsg('Please accept the bylaws declaration to proceed.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit application.');
      }

      setSubmittedData(result.data);
      if (onSuccess) onSuccess(result.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // If submitted successfully, show confirmation and print preview
  if (submittedData) {
    const shareText = `APRA Membership Application Submitted!\nApplicant: ${submittedData.fullName}\nApplication No: #${submittedData.applicationNo}\nReceipt No: #${submittedData.receiptNo}\nAssociation: Association for Ponnappa Nadar Nagar Residents Amenity, Nagercoil.`;

    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-emerald-200 shadow-xl max-w-4xl mx-auto my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
            Application Submitted Successfully!
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-base">
            Your membership application for the <strong className="text-slate-900">Association for Ponnappa Nadar Nagar Residents Amenity (APRA)</strong> has been recorded in the register.
          </p>

          {/* Quick Metrics Grid - 2x2 on Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-2xl mx-auto my-4 sm:my-6 text-left">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium block">Application No.</span>
              <p className="text-lg sm:text-xl font-bold text-sky-700">#{submittedData.applicationNo}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium block">Receipt No.</span>
              <p className="text-lg sm:text-xl font-bold text-amber-600">#{submittedData.receiptNo}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium block">Family Members</span>
              <p className="text-lg sm:text-xl font-bold text-slate-900">{(submittedData.familyMembers || []).length} People</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium block">Status</span>
              <p className="text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-0.5">
                {submittedData.status}
              </p>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 pt-2 no-print">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md active:scale-98 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share Application via WhatsApp</span>
            </a>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md active:scale-98 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Form</span>
            </button>

            <button
              onClick={() => {
                setSubmittedData(null);
                setFormData({
                  residentType: 'Owner',
                  fullName: '',
                  age: '',
                  gender: 'Male',
                  layoutPlotNo: '',
                  doorNoOld: '',
                  doorNoNew: '',
                  street: '',
                  mailingAddress: '',
                  phone: '',
                  landline: '',
                  email: '',
                  photoDataUrl: '',
                  signatureName: '',
                  declarationAccepted: false,
                  familyMembers: [{ id: 1, name: '', gender: 'Male', relationship: 'Self', age: '' }],
                });
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>New Application</span>
            </button>
          </div>
        </div>

        {/* Printable Official Form Replica */}
        <div className="mt-8 p-4 sm:p-8 border-2 border-slate-800 rounded-2xl bg-white text-slate-900 official-form-paper">
          <div className="flex items-start justify-between border-b-2 border-slate-800 pb-3 sm:pb-4 gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <ApraLogo className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-600 block">
                  Regd. No. 25/2023 • Receipt No. {submittedData.receiptNo}
                </span>
                <h3 className="text-xs sm:text-lg font-bold leading-tight truncate">
                  {ASSOCIATION_INFO.nameTamil}
                </h3>
                <h4 className="text-[10px] sm:text-sm font-semibold tracking-wider text-sky-800 truncate">
                  ASSOCIATION FOR PONNAPPANADAR NAGER RESIDENTS AMENITY (APRA)
                </h4>
                <p className="text-[9px] sm:text-[11px] text-slate-600 truncate">
                  Ponnappa Nadar Nagar, Nagercoil - 629 004
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className="border-2 border-slate-800 px-3 py-1 font-mono text-sm font-black tracking-wider rounded-lg flex flex-col items-center justify-center bg-slate-50">
                <span className="text-[9px] text-slate-500 font-sans tracking-normal uppercase">App No</span>
                <span>{submittedData.applicationNo}</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-mono tracking-widest font-semibold border-b border-slate-300 pb-1">
                Date: {submittedData.submissionDate}
              </div>
              {submittedData.photoUrl || submittedData.photoDataUrl ? (
                <div className="w-20 h-24 sm:w-24 sm:h-28 border-2 border-slate-300 rounded overflow-hidden shadow-sm bg-slate-50 flex items-center justify-center p-1 mt-1">
                  <img 
                    src={submittedData.photoUrl || submittedData.photoDataUrl} 
                    alt="Member Photo" 
                    className="w-full h-full object-cover rounded-sm"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="my-3 sm:my-4 text-center font-bold text-xs sm:text-base underline uppercase tracking-wider">
            Membership Application (Official Record)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs">
            <div><strong>Applicant Name:</strong> {submittedData.fullName}</div>
            <div><strong>Resident Status:</strong> {submittedData.residentType}</div>
            <div><strong>Age / Gender:</strong> {submittedData.age || 'N/A'} yrs / {submittedData.gender}</div>
            <div><strong>Plot / Layout No:</strong> {submittedData.layoutPlotNo || 'N/A'}</div>
            <div><strong>Door No (Old / New):</strong> {submittedData.doorNoOld || '-'} / {submittedData.doorNoNew || '-'}</div>
            <div><strong>Street:</strong> {submittedData.street}</div>
            <div className="sm:col-span-2"><strong>Mailing Address:</strong> {submittedData.mailingAddress}</div>
            <div><strong>Cell Phone:</strong> {submittedData.phone}</div>
            <div><strong>Email:</strong> {submittedData.email || 'N/A'}</div>
          </div>

          {/* Family members summary */}
          <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-300">
            <h5 className="font-bold text-xs mb-1.5">Household Family Members ({(submittedData.familyMembers || []).length}):</h5>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] sm:text-[11px] border-collapse border border-slate-300">
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
                  {(submittedData.familyMembers || []).map((m, idx) => (
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
          </div>

          {/* Signatures and Office Use Section */}
          <div className="mt-6 pt-4 border-t-2 border-slate-800 grid grid-cols-4 gap-2 sm:gap-4 text-center text-[10px] sm:text-xs">
            <div>
              <div className="h-8 sm:h-10 flex items-end justify-center font-serif italic font-bold truncate">
                {submittedData.signatureName || submittedData.fullName}
              </div>
              <p className="border-t border-slate-400 pt-1 font-semibold">Member</p>
            </div>
            <div>
              <div className="h-8 sm:h-10 flex items-end justify-center text-slate-400 text-[9px]">Seal</div>
              <p className="border-t border-slate-400 pt-1 font-semibold">President</p>
            </div>
            <div>
              <div className="h-8 sm:h-10 flex items-end justify-center text-slate-400 text-[9px]">Verified</div>
              <p className="border-t border-slate-400 pt-1 font-semibold">Secretary</p>
            </div>
            <div>
              <div className="h-8 sm:h-10 flex items-end justify-center text-slate-400 text-[9px]">Enrolled</div>
              <p className="border-t border-slate-400 pt-1 font-semibold">Treasurer</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 lg:p-10 border border-slate-200 shadow-xl max-w-4xl mx-auto my-3 sm:my-8">
      {/* Form Header */}
      <div className="border-b border-slate-200 pb-4 sm:pb-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <ApraLogo className="w-11 h-11 sm:w-16 sm:h-16 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[9px] sm:text-xs font-mono font-bold text-sky-700 uppercase tracking-widest block truncate">
                {ASSOCIATION_INFO.regdNo}
              </span>
              <h2 className="text-xs sm:text-xl font-bold text-slate-900 font-sans leading-tight break-words">
                {ASSOCIATION_INFO.nameTamil}
              </h2>
              <h3 className="text-[9px] sm:text-xs font-semibold text-slate-600 tracking-wide leading-tight block break-words mt-0.5">
                ASSOCIATION FOR PONNAPPANADAR NAGER RESIDENTS AMENITY (APRA)
              </h3>
              <p className="text-[9px] sm:text-xs text-slate-500 mt-0.5 truncate">
                Ponnappa Nadar Nagar, Nagercoil - 629 004.
              </p>
            </div>
          </div>
          
          <div className="bg-sky-50 border border-sky-200 px-3 py-1.5 sm:p-3 rounded-xl sm:rounded-2xl text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
            <div>
              <div className="text-[10px] sm:text-[11px] font-bold text-sky-800 uppercase tracking-wider">Membership Form</div>
              <div className="text-xs sm:text-xl font-black text-sky-700">Open & Active</div>
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-500">Official Resident Enrollment</div>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-sky-50 rounded-xl border border-sky-100 text-[11px] sm:text-xs text-sky-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span>
            <strong>Eligibility:</strong> Open to all residents (Owners & Tenants) of Ponnappanadar Nagar, Nagercoil.
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        
        {/* Section 1: Resident Type & Photo */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Resident Status *
            </label>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, residentType: 'Owner' }))}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 ${
                  formData.residentType === 'Owner'
                    ? 'border-sky-600 bg-sky-50/80 ring-2 ring-sky-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <span className="font-bold text-xs sm:text-sm block text-slate-900">Owner (உரிமையாளர்)</span>
                  <span className="text-[10px] sm:text-xs text-slate-500">Property owner in P.N. Nagar</span>
                </div>
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    formData.residentType === 'Owner' ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {formData.residentType === 'Owner' && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></span>}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, residentType: 'Tenant' }))}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 ${
                  formData.residentType === 'Tenant'
                    ? 'border-sky-600 bg-sky-50/80 ring-2 ring-sky-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <span className="font-bold text-xs sm:text-sm block text-slate-900">Tenant (வாடகைதாரர்)</span>
                  <span className="text-[10px] sm:text-xs text-slate-500">Resident tenant living here</span>
                </div>
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    formData.residentType === 'Tenant' ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {formData.residentType === 'Tenant' && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></span>}
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start">
            <div className="md:col-span-2 space-y-3.5 sm:space-y-4">
              
              {/* Applicant Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name (விண்ணப்பதாரர் பெயர்) *
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. K.S. MURUGESAN"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 sm:py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base sm:text-sm font-semibold uppercase bg-slate-50/50 focus:bg-white"
                />
              </div>

              {/* Age and Gender in 2 cols - Equalized Label Heights */}
              <div className="grid grid-cols-2 gap-3 items-end">
                <div className="flex flex-col justify-end">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 min-h-[1.75rem] flex items-end leading-tight">
                    Age (வயது) *
                  </label>
                  <input
                    type="number"
                    name="age"
                    placeholder="e.g. 67"
                    value={formData.age}
                    onChange={handleChange}
                    min="18"
                    max="110"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base sm:text-sm bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 min-h-[1.75rem] flex items-end leading-tight">
                    Gender (பாலினம்) *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base sm:text-sm bg-slate-50/50 focus:bg-white"
                  >
                    <option value="Male">Male (ஆண்)</option>
                    <option value="Female">Female (பெண்)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Passport Photo Upload Box */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50/70 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px]">
              {formData.photoDataUrl ? (
                <div className="relative group">
                  <img
                    src={formData.photoDataUrl}
                    alt="Member Preview"
                    className="w-28 h-32 sm:w-32 sm:h-36 object-cover rounded-xl shadow-md border-2 border-white"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, photoDataUrl: '' }))}
                    className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full text-xs shadow-md hover:bg-rose-700 active:scale-90"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center w-full py-2">
                  <Upload className="w-7 h-7 text-sky-600 mb-1.5 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800 block">Upload Photo</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Passport photo (JPG/PNG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <span className="mt-2.5 px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-sky-700 shadow-2xs hover:bg-slate-50">
                    Select File / Camera
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Address & Property Info */}
        <div className="pt-4 sm:pt-6 border-t border-slate-200 space-y-3.5 sm:space-y-4">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Home className="w-4 h-4 text-sky-600" />
            <span>2. Residence & Property Details</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Plot No (பிளாட்)
              </label>
              <input
                type="text"
                name="layoutPlotNo"
                placeholder="e.g. 6 / 35"
                value={formData.layoutPlotNo}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base sm:text-sm bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Door No New (புதிய எண்) *
              </label>
              <input
                type="text"
                name="doorNoNew"
                placeholder="e.g. 250"
                value={formData.doorNoNew}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base sm:text-sm bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Door No Old (பழைய எண்)
              </label>
              <input
                type="text"
                name="doorNoOld"
                placeholder="e.g. -"
                value={formData.doorNoOld}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base sm:text-sm bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Street Name (தெரு பெயர்) *
            </label>
            <input
              type="text"
              name="street"
              placeholder="e.g. Carmel Mount Road - Second Cross Street"
              value={formData.street}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base sm:text-sm bg-slate-50/50 focus:bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Mailing Address (அஞ்சல் முகவரி) *
              </label>
              <button
                type="button"
                onClick={handleAutoSuggestAddress}
                className="text-[11px] sm:text-xs text-sky-600 hover:text-sky-700 font-bold underline"
              >
                Auto-fill Address
              </button>
            </div>
            <textarea
              name="mailingAddress"
              rows="2"
              placeholder="e.g. K.S. Murugesan, 6/35-250, Carmel Mount Road, Ponnappa Nadar Nagar, Nagercoil"
              value={formData.mailingAddress}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base sm:text-sm bg-slate-50/50 focus:bg-white"
            ></textarea>
          </div>
        </div>

        {/* Section 3: Contact Details */}
        <div className="pt-4 sm:pt-6 border-t border-slate-200 space-y-3.5 sm:space-y-4">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-4 h-4 text-sky-600" />
            <span>3. Contact Particulars</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Cell Phone (கைபேசி எண்) *
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. 9442636020"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base sm:text-sm font-mono bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Landline (தொலைபேசி)
              </label>
              <input
                type="tel"
                name="landline"
                placeholder="e.g. 04652-XXXXXX"
                value={formData.landline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base sm:text-sm font-mono bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email (மின்னஞ்சல்)
              </label>
              <input
                type="email"
                name="email"
                placeholder="e.g. nayakimurugesan@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base sm:text-sm bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Family Members living at home table / Mobile Card Stack */}
        <div className="pt-4 sm:pt-6 border-t border-slate-200 space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span>4. Household Family Members</span>
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-500">
                (Members living at home to be included in the card)
              </p>
            </div>
            <button
              type="button"
              onClick={addFamilyMember}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs border border-sky-200 active:scale-95 flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Mobile Stacked Card View (Screens < 640px) */}
          <div className="block sm:hidden space-y-3">
            {formData.familyMembers.map((member, index) => (
              <div key={member.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 relative">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 font-mono">Member #{index + 1}</span>
                  {formData.familyMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFamilyMember(index)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. M. Thirumal Nayaki"
                    value={member.name}
                    onChange={(e) => handleFamilyChange(index, 'name', e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Gender</label>
                    <select
                      value={member.gender}
                      onChange={(e) => handleFamilyChange(index, 'gender', e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Relation</label>
                    <select
                      value={member.relationship}
                      onChange={(e) => handleFamilyChange(index, 'relationship', e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                    >
                      <option value="Self">Self</option>
                      <option value="Wife">Wife</option>
                      <option value="Husband">Husband</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Age</label>
                    <input
                      type="number"
                      placeholder="Age"
                      value={member.age}
                      onChange={(e) => handleFamilyChange(index, 'age', e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (Screens >= 640px) */}
          <div className="hidden sm:block overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3">Member Full Name *</th>
                  <th className="p-3 w-28">Gender</th>
                  <th className="p-3 w-36">Relationship</th>
                  <th className="p-3 w-20">Age</th>
                  <th className="p-3 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {formData.familyMembers.map((member, index) => (
                  <tr key={member.id} className="hover:bg-slate-50">
                    <td className="p-3 text-center font-mono font-bold text-slate-500">
                      {index + 1}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="e.g. M. Thirumal Nayaki"
                        value={member.name}
                        onChange={(e) => handleFamilyChange(index, 'name', e.target.value)}
                        required
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={member.gender}
                        onChange={(e) => handleFamilyChange(index, 'gender', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        value={member.relationship}
                        onChange={(e) => handleFamilyChange(index, 'relationship', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                      >
                        <option value="Self">Self (விண்ணப்பதாரர்)</option>
                        <option value="Wife">Wife (மனைவி)</option>
                        <option value="Husband">Husband (கணவர்)</option>
                        <option value="Son">Son (மகன்)</option>
                        <option value="Daughter">Daughter (மகள்)</option>
                        <option value="Father">Father (தந்தை)</option>
                        <option value="Mother">Mother (தாய்)</option>
                        <option value="Other">Other (பிற)</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        placeholder="Age"
                        value={member.age}
                        onChange={(e) => handleFamilyChange(index, 'age', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                      />
                    </td>
                    <td className="p-2 text-center">
                      {formData.familyMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFamilyMember(index)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Declaration & Agreement */}
        <div className="pt-4 sm:pt-6 border-t border-slate-200 space-y-3.5 sm:space-y-4">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2 sm:space-y-3">
            <h5 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-900">
              Declaration & Bylaws Agreement
            </h5>
            <p className="text-xs text-slate-700 leading-relaxed">
              "I / We desire to be admitted as an official registered member of the <strong>Association for Ponnappanadar Nager Residents Amenity (APRA)</strong>. I / We hereby declare that the above mentioned details are true to the best of my knowledge. I / We agree to abide by the bylaws and regulations of 'Association for Ponnappanadar Nager Residents Amenity (APRA)'."
            </p>
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                name="declarationAccepted"
                checked={formData.declarationAccepted}
                onChange={handleChange}
                required
                className="mt-0.5 h-4 w-4 rounded text-sky-600 focus:ring-sky-500 flex-shrink-0"
              />
              <span className="text-xs font-bold text-slate-900">
                I hereby accept and sign this declaration electronically.
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Applicant Signature / Name for Signature *
              </label>
              <input
                type="text"
                name="signatureName"
                placeholder="Type your full signature name"
                value={formData.signatureName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base sm:text-sm font-serif italic bg-slate-50/50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Date of Application
              </label>
              <input
                type="text"
                readOnly
                value={new Date().toLocaleDateString('en-GB')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-sm font-mono text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 sm:pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-black text-sm sm:text-base shadow-lg shadow-sky-600/25 active:scale-98 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Submitting Application...</span>
            ) : (
              <>
                <span>Submit Membership Application</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
