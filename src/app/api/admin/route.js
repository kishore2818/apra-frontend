import { NextResponse } from 'next/server';
import { getAllMembers, updateMemberStatus } from '@/lib/serverStore';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function GET() {
  try {
    // Try fetching from Backend API (Supabase)
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/members`);
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn('Backend API unavailable for admin GET, using local store:', err.message);
    }

    const members = getAllMembers();

    // Compute statistics
    const total = members.length;
    const approved = members.filter(m => m.status === 'Approved').length;
    const pending = members.filter(m => m.status === 'Pending Verification' || m.status === 'Pending').length;
    const rejected = members.filter(m => m.status === 'Rejected').length;
    const totalFeesCollected = members.filter(m => m.status === 'Approved').length * 100;

    const ownersCount = members.filter(m => m.residentType === 'Owner').length;
    const tenantsCount = members.filter(m => m.residentType === 'Tenant').length;

    // Age distribution
    const ageGroups = {
      '18-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0,
    };
    members.forEach(m => {
      const a = Number(m.age) || 0;
      if (a >= 18 && a <= 35) ageGroups['18-35']++;
      else if (a >= 36 && a <= 50) ageGroups['36-50']++;
      else if (a >= 51 && a <= 65) ageGroups['51-65']++;
      else if (a > 65) ageGroups['65+']++;
    });

    return NextResponse.json({
      success: true,
      stats: {
        total,
        approved,
        pending,
        rejected,
        totalFeesCollected,
        ownersCount,
        tenantsCount,
        ageGroups,
      },
      members,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { applicationNo, status, rejectionReason } = body;

    if (!applicationNo || !status) {
      return NextResponse.json(
        { success: false, message: 'applicationNo and status are required' },
        { status: 400 }
      );
    }

    // Try updating via Backend API (Supabase)
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/members/${applicationNo}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason: rejectionReason })
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json({
          success: true,
          message: `Status updated to ${status}`,
          member: data.member
        });
      }
    } catch (err) {
      console.warn('Backend API unavailable for admin PATCH, using local fallback:', err.message);
    }

    const updated = updateMemberStatus(applicationNo, status, rejectionReason);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to ${status}`,
      member: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
