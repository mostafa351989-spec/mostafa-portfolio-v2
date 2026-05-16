import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'الاسم والايميل والرسالة مطلوبين' }, { status: 400 });
    }

    await Contact.create({ name, email, subject, message });

    return NextResponse.json({ success: true, message: 'تم الإرسال بنجاح' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حصل خطأ في السيرفر' }, { status: 500 });
  }
}
