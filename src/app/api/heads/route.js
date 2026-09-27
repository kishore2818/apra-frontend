import { NextResponse } from 'next/server';
import { 
  getAllOfficeBearers, 
  addOfficeBearer, 
  updateOfficeBearer, 
  deleteOfficeBearer, 
  resetOfficeBearersToDefault 
} from '@/lib/serverStore';

export async function GET() {
  try {
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
