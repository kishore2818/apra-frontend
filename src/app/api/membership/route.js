import { NextResponse } from 'next/server';
import { addMember, getAllMembers } from '@/lib/serverStore';

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001').replace('localhost', '127.0.0.1');

export async function POST(request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.fullName || !body.phone || !body.street) {
      return NextResponse.json(
        { success: false, message: 'Full name, phone number, and street address are required.' },
        { status: 400 }
      );
    }

    // Attempt to send to Backend Express API (Supabase + Google Sheet + Cloudinary)
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/members`, {
        method: 'POST',
        signal: AbortSignal.timeout(4000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        return NextResponse.json({
          success: true,
          message: backendData.message || 'Membership application submitted successfully!',
          data: {
            ...backendData.data,
            applicationNo: backendData.data.application_no || backendData.data.applicationNo,
            receiptNo: backendData.data.receipt_no || backendData.data.receiptNo,
            fullName: backendData.data.full_name || backendData.data.fullName,
            submissionDate: backendData.data.submission_date || backendData.data.submissionDate,
          }
        });
      }
    } catch (backendErr) {
      console.warn('Backend API unavailable, saving to local fallback:', backendErr.message);
    }

    // Fallback to local store
    const newRecord = addMember(body);
    return NextResponse.json({
      success: true,
      message: 'Membership application submitted successfully!',
      data: newRecord,
    });
  } catch (error) {
    console.error('Error in /api/membership POST:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing application.' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const appNo = searchParams.get('appNo');

    // Try fetching from Backend API
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/members`, {
        signal: AbortSignal.timeout(1800),
        headers: { 'Accept': 'application/json' }
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        const members = data.members || [];
        if (phone) {
          const match = members.find(m => String(m.phone).replace(/\D/g, '') === phone.replace(/\D/g, ''));
          if (match) return NextResponse.json({ success: true, member: match });
        }
        if (appNo) {
          const match = members.find(m => String(m.applicationNo || m.application_no) === String(appNo));
          if (match) return NextResponse.json({ success: true, member: match });
        }
      }
    } catch (e) {
      // fallback to local
    }

    const members = getAllMembers();
    if (phone) {
      const match = members.find(m => String(m.phone).replace(/\D/g, '') === phone.replace(/\D/g, ''));
      if (match) return NextResponse.json({ success: true, member: match });
    }

    if (appNo) {
      const match = members.find(m => String(m.applicationNo) === String(appNo));
      if (match) return NextResponse.json({ success: true, member: match });
    }

    return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
