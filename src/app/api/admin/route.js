import { NextResponse } from 'next/server';
import { getAllMembers, updateMemberStatus } from '@/lib/serverStore';

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001').replace('localhost', '127.0.0.1');

// Server-side cache for instantaneous responses
let cachedAdminData = null;
let cacheExpiry = 0;

export async function GET() {
  try {
    const now = Date.now();
    if (cachedAdminData && cacheExpiry > now) {
      return NextResponse.json(cachedAdminData, {
        headers: {
          'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=60',
          'X-Cache': 'HIT-NEXT'
        }
      });
    }

    // Try fetching from Backend API (Supabase) with fast 1.8s timeout
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/members`, {
        signal: AbortSignal.timeout(1800),
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 15 }
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        cachedAdminData = data;
        cacheExpiry = Date.now() + 15000; // 15s server cache
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=60',
            'X-Cache': 'MISS-BACKEND'
          }
        });
      }
    } catch (err) {
      // Backend not running or slow - immediately return local store
    }

    const members = getAllMembers();

    // Compute statistics
    const total = members.length;
    const approved = members.filter(m => m.status === 'Approved').length;
    const pending = members.filter(m => m.status === 'Pending Verification' || m.status === 'Pending').length;
    const rejected = members.filter(m => m.status === 'Rejected').length;
    const totalFeesCollected = approved * 100;

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

    const localData = {
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
    };

    cachedAdminData = localData;
    cacheExpiry = Date.now() + 15000;

    return NextResponse.json(localData, {
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=60',
        'X-Cache': 'LOCAL-STORE'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    cachedAdminData = null;
    cacheExpiry = 0;
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
        signal: AbortSignal.timeout(2000),
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
