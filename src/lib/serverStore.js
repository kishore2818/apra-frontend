import fs from 'fs';
import path from 'path';
import { INITIAL_MEMBERS, OFFICE_BEARERS } from '@/data/associationData';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'members_db.json');
const BEARERS_PATH = path.join(process.cwd(), 'src', 'data', 'office_bearers.json');

// Initialize database file if it doesn't exist
function ensureDb() {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_MEMBERS, null, 2), 'utf-8');
    }
    if (!fs.existsSync(BEARERS_PATH)) {
      const initialWithIds = OFFICE_BEARERS.map((b, idx) => ({ id: idx + 1, ...b }));
      fs.writeFileSync(BEARERS_PATH, JSON.stringify(initialWithIds, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error ensuring DB files:', error);
  }
}

/* =========================================================================
   OFFICE BEARERS CRUD FUNCTIONS
   ========================================================================= */

export function getAllOfficeBearers() {
  ensureDb();
  try {
    const raw = fs.readFileSync(BEARERS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read office bearers:', err);
    return OFFICE_BEARERS.map((b, idx) => ({ id: idx + 1, ...b }));
  }
}

export function saveAllOfficeBearers(bearers) {
  ensureDb();
  fs.writeFileSync(BEARERS_PATH, JSON.stringify(bearers, null, 2), 'utf-8');
  return bearers;
}

export function addOfficeBearer(newBearer) {
  ensureDb();
  const bearers = getAllOfficeBearers();
  const maxId = bearers.reduce((max, b) => Math.max(max, Number(b.id) || 0), 0);
  const created = {
    id: maxId + 1,
    role: newBearer.role || 'Committee Member',
    roleTamil: newBearer.roleTamil || '',
    name: newBearer.name || '',
    phone: newBearer.phone || '',
    category: newBearer.category || 'Executive',
    badge: newBearer.badge || '',
    avatar: newBearer.avatar || '',
    note: newBearer.note || '',
    updatedAt: new Date().toISOString()
  };
  bearers.push(created);
  saveAllOfficeBearers(bearers);
  return created;
}

export function updateOfficeBearer(id, updatedFields) {
  ensureDb();
  const bearers = getAllOfficeBearers();
  const index = bearers.findIndex((b) => String(b.id) === String(id));
  if (index !== -1) {
    bearers[index] = {
      ...bearers[index],
      ...updatedFields,
      id: bearers[index].id, // preserve id
      updatedAt: new Date().toISOString()
    };
    saveAllOfficeBearers(bearers);
    return bearers[index];
  }
  return null;
}

export function deleteOfficeBearer(id) {
  ensureDb();
  let bearers = getAllOfficeBearers();
  const initialLength = bearers.length;
  bearers = bearers.filter((b) => String(b.id) !== String(id));
  if (bearers.length !== initialLength) {
    saveAllOfficeBearers(bearers);
    return true;
  }
  return false;
}

export function resetOfficeBearersToDefault() {
  ensureDb();
  const defaultBearers = OFFICE_BEARERS.map((b, idx) => ({ id: idx + 1, ...b }));
  saveAllOfficeBearers(defaultBearers);
  return defaultBearers;
}

/* =========================================================================
   MEMBERS CRUD FUNCTIONS
   ========================================================================= */

export function getAllMembers() {
  ensureDb();
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read members db:', err);
    return INITIAL_MEMBERS;
  }
}

export function addMember(newMember) {
  ensureDb();
  const members = getAllMembers();
  
  // Compute next application and receipt numbers
  const maxApp = members.reduce((max, m) => Math.max(max, Number(m.applicationNo) || 0), 0);
  const maxReceipt = members.reduce((max, m) => Math.max(max, Number(m.receiptNo) || 0), 0);
  
  const createdRecord = {
    ...newMember,
    applicationNo: maxApp + 1,
    receiptNo: maxReceipt + 1,
    submissionDate: newMember.submissionDate || new Date().toISOString().split('T')[0],
    status: newMember.status || 'Pending Verification',
    admissionFee: 100,
  };

  members.unshift(createdRecord);
  fs.writeFileSync(DB_PATH, JSON.stringify(members, null, 2), 'utf-8');

  // Trigger Google Sheet Webhook if webhook URL is configured
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL;
  if (webhookUrl) {
    forwardToGoogleSheet(createdRecord, webhookUrl).catch(err => {
      console.error('Failed to forward to Google Sheets:', err.message);
    });
  }

  return createdRecord;
}

export function updateMemberStatus(applicationNo, status, notes = '') {
  ensureDb();
  const members = getAllMembers();
  const index = members.findIndex(m => String(m.applicationNo) === String(applicationNo));
  
  if (index !== -1) {
    members[index].status = status;
    if (notes) members[index].rejectionReason = notes;
    members[index].updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_PATH, JSON.stringify(members, null, 2), 'utf-8');
    return members[index];
  }
  return null;
}

async function forwardToGoogleSheet(record, webhookUrl) {
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'ADD_MEMBER',
        data: {
          timestamp: new Date().toISOString(),
          applicationNo: record.applicationNo,
          receiptNo: record.receiptNo,
          residentType: record.residentType,
          fullName: record.fullName,
          age: record.age,
          gender: record.gender,
          plotNo: record.layoutPlotNo,
          doorNoOld: record.doorNoOld || '',
          doorNoNew: record.doorNoNew || '',
          street: record.street,
          mailingAddress: record.mailingAddress,
          phone: record.phone,
          landline: record.landline || '',
          email: record.email || '',
          status: record.status,
          familyMembersCount: (record.familyMembers || []).length,
          familyDetails: (record.familyMembers || []).map(f => `${f.name} (${f.relationship}, ${f.age}y)`).join('; ')
        }
      })
    });
  } catch (err) {
    console.error('Google Sheet dispatch failed:', err);
  }
}
