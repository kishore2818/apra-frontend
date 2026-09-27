import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MembershipForm from '@/components/MembershipForm';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { ASSOCIATION_INFO } from '@/data/associationData';

export const metadata = {
  title: 'Apply for Membership | APRA - Ponnappa Nadar Nagar, Nagercoil',
  description: 'Online membership application form for Association for Ponnappa Nadar Nagar Residents Amenity (APRA). Official Document 2 form format.',
};

export default function MembershipPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 selection:bg-amber-400 selection:text-slate-900">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-6 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Official Enrollment Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Association Membership Application
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Please fill in your resident, address, and family member details accurately. This digital form matches the official registration document of APRA.
          </p>
        </div>

        {/* The Document 2 Form Component */}
        <MembershipForm />
      </main>

      <Footer />
    </div>
  );
}
