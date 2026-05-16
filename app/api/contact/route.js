import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export async function POST(req) {
  if (!MONGODB_URI) {
    return NextResponse.json({ error: 'MONGODB_URI مش موجود' }, { status: 500 });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { name, email, subject, message } = await req.json();

    if (!name ||!email ||!message) {
      throw new Error('الاسم والإيميل والرسالة مطلوبين');
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }

    const ContactSchema = new mongoose.Schema({
      name: String,
      email: String,
      subject: String,
      message: String,
      createdAt: { type: Date, default: Date.now }
    });

    const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

    const newContact = await Contact.create([{ name, email, subject, message }], { session });

    await session.commitTransaction();

    return NextResponse.json({ success: true, data: newContact[0] });

  } catch (err) {
    await session.abortTransaction();
    console.error('Transaction Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    session.endSession();
  }
}
