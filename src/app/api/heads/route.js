import { NextResponse } from 'next/server';
import { 
  getAllOfficeBearers, 
  addOfficeBearer, 
  updateOfficeBearer, 
  deleteOfficeBearer, 
  resetOfficeBearersToDefault 
} from '@/lib/serverStore';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function GET() {
  try {
    // Try fetching from Backend API (Supabase)
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/heads`);
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn('Backend API unavailable for heads GET, using local fallback:', err.message);
    }

    const bearers = getAllOfficeBearers();
    return NextResponse.json({ success: true, bearers });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.action === 'RESET') {
      try {
        await fetch(`${BACKEND_URL}/api/heads`, {
          method: 'POST',
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
        method: 'DELETE'
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
