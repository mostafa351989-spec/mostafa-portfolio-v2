#!/bin/bash
echo "🔧 بنصلح الـ Build Errors..."

# 1. احذف مجلد pages القديم لو موجود - هو اللي عامل Duplicate
rm -rf pages/

# 2. صلح app/admin/profile/page.tsx - TypeScript Error
cat > app/admin/profile/page.tsx << 'TSX'
import { MongoClient } from 'mongodb';

type Profile = {
  name?: string;
  title?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
};

async function getProfile(): Promise<Profile> {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const profile = await client.db().collection('profile').findOne({});
  client.close();
  return profile || {};
}

export default async function ProfilePage() {
  const profile = await getProfile();
  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">تعديل البروفايل</h1>
      <form action="/api/profile" method="POST" className="space-y-4">
        <input name="name" defaultValue={profile?.name || ''} placeholder="الاسم" className="w-full p-3 bg-zinc-900 rounded border border-zinc-800" />
        <input name="title" defaultValue={profile?.title || ''} placeholder="المسمى الوظيفي" className="w-full p-3 bg-zinc-900 rounded border border-zinc-800" />
        <textarea name="bio" defaultValue={profile?.bio || ''} placeholder="نبذة عنك" className="w-full p-3 bg-zinc-900 rounded border border-zinc-800 h-32" />
        <input name="github" defaultValue={profile?.github || ''} placeholder="GitHub" className="w-full p-3 bg-zinc-900 rounded border border-zinc-800" />
        <input name="linkedin" defaultValue={profile?.linkedin || ''} placeholder="LinkedIn" className="w-full p-3 bg-zinc-900 rounded border border-zinc-800" />
        <button className="bg-white text-black px-6 py-3 rounded font-bold w-full">حفظ التعديلات</button>
      </form>
    </div>
  )
}
TSX

# 3. نعمل API للبروفايل
mkdir -p app/api/profile
cat > app/api/profile/route.ts << 'TS'
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(req: NextRequest) {
  const data = Object.fromEntries(await req.formData());
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  await client.db().collection('profile').updateOne({}, { $set: data }, { upsert: true });
  client.close();
  return NextResponse.redirect(new URL('/admin/profile', req.url));
}
TS

echo "✅ اتصلح. اعمل push دلوقتي"
