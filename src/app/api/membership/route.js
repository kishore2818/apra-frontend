import { NextResponse } from 'next/server';
import { addMember, getAllMembers } from '@/lib/serverStore';

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
