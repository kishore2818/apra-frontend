import { NextResponse } from 'next/server';
import { 
  getAllOfficeBearers, 
  addOfficeBearer, 
  updateOfficeBearer, 
  deleteOfficeBearer, 
  resetOfficeBearersToDefault 
} from '@/lib/serverStore';

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001').replace('localhost', '127.0.0.1');

// In-memory cache for office bearers
let cachedHeadsData = null;
let headsCacheExpiry = 0;

export async function GET() {
  try {
    const now = Date.now();
    if (cachedHeadsData && headsCacheExpiry > now) {
      return NextResponse.json(cachedHeadsData, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'X-Cache': 'HIT-NEXT'
        }
      });
    }

    // Try fetching from Backend API (Supabase) with fast 1.8s timeout
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/heads`, {
        signal: AbortSignal.timeout(1800),
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 60 }
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        cachedHeadsData = data;
        headsCacheExpiry = Date.now() + 60000; // 1 min server cache
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            'X-Cache': 'MISS-BACKEND'
          }
        });
      }
    } catch (err) {
      // Backend not running or slow - immediately return local store
    }

    const bearers = getAllOfficeBearers();
    const localData = { success: true, bearers };
    cachedHeadsData = localData;
    headsCacheExpiry = Date.now() + 60000;

    return NextResponse.json(localData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-Cache': 'LOCAL-STORE'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    cachedHeadsData = null;
    headsCacheExpiry = 0;
    const body = await request.json();

    if (body.action === 'RESET') {
      try {
        await fetch(`${BACKEND_URL}/api/heads`, {
          method: 'POST',
          signal: AbortSignal.timeout(2000),
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'RESET' })
        });
      } catch (e) {}
      const resetList = resetOfficeBearersToDefault();
      return NextResponse.json({
        success: true,
        message: 'Office bearers reset to official Document 1 records',
        bearers: resetList,
      });
    }

    if (!body.name || !body.role || !body.phone) {
      return NextResponse.json(
        { success: false, message: 'Name, role, and phone are required.' },
        { status: 400 }
      );
    }

    // Try backend
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/heads`, {
        method: 'POST',
        signal: AbortSignal.timeout(2000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch (e) {}

    const created = addOfficeBearer(body);
    return NextResponse.json({
      success: true,
      message: 'Office bearer added successfully',
      bearer: created,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    cachedHeadsData = null;
    headsCacheExpiry = 0;
    const body = await request.json();
    const { id, ...updatedFields } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Bearer id is required.' },
        { status: 400 }
      );
    }

    // Try backend
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/heads/${id}`, {
        method: 'PATCH',
        signal: AbortSignal.timeout(2000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch (e) {}

    const updated = updateOfficeBearer(id, updatedFields);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Office bearer not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Office bearer updated successfully',
      bearer: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    cachedHeadsData = null;
    headsCacheExpiry = 0;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Bearer id is required.' },
        { status: 400 }
      );
    }

    // Try backend
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/heads/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(2000)
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch (e) {}

    const deleted = deleteOfficeBearer(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Office bearer not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Office bearer deleted successfully',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
