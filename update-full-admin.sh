#!/bin/bash
echo "🚀 بنحدث ملفات الأدمن القديمة + بنضيف المميزات الجديدة..."

# 1. تعديل app/admin/page.tsx - الداشبورد
cat > app/admin/page.tsx << 'TSX'
import { MongoClient } from 'mongodb';
import Link from 'next/link';

async function getStats() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();
  const projects = await db.collection('projects').countDocuments();
  const messages = await db.collection('messages').countDocuments();
  const skills = await db.collection('skills').countDocuments();
  client.close();
  return { projects, messages, skills };
}

export default async function AdminDashboard() {
  const { projects, messages, skills } = await getStats();
  const stats = [
    { label: 'المشاريع', value: projects, href: '/admin/projects' },
    { label: 'المهارات', value: skills, href: '/admin/skills' },
    { label: 'الرسائل', value: messages, href: '/admin/messages' },
  ];

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <form action="/api/logout" method="POST">
          <button className="bg-zinc-800 px-4 py-2 rounded text-sm">تسجيل خروج</button>
        </form>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-zinc-400 text-sm">{s.label}</div>
          </Link>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="font-bold mb-4">إجراءات سريعة</h2>
          <div className="space-y-2">
            <Link href="/admin/projects/new" className="block bg-white text-black px-4 py-2 rounded text-center">+ مشروع جديد</Link>
            <Link href="/admin/skills/new" className="block bg-zinc-800 px-4 py-2 rounded text-center">+ مهارة جديدة</Link>
          </div>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="font-bold mb-4">روابط سريعة</h2>
          <div className="space-y-2 text-sm">
            <Link href="/admin/profile" className="block text-zinc-400 hover:text-white">تعديل البروفايل</Link>
            <a href="/" target="_blank" className="block text-zinc-400 hover:text-white">عرض الموقع</a>
          </div>
        </div>
      </div>
    </div>
  )
}
TSX

# 2. تعديل app/admin/projects/page.tsx - إضافة زرار حذف وتعديل
cat > app/admin/projects/page.tsx << 'TSX'
import { MongoClient } from 'mongodb';
import Link from 'next/link';
import { ObjectId } from 'mongodb';

async function getProjects() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const projects = await client.db().collection('projects').find().sort({createdAt:-1}).toArray();
  client.close();
  return projects;
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المشاريع</h1>
        <Link href="/admin/projects/new" className="bg-white text-black px-4 py-2 rounded">+ إضافة</Link>
      </div>
      {projects.length === 0 ? (
        <div className="bg-zinc-900 p-8 rounded-xl text-center text-zinc-500">مفيش مشاريع لسه</div>
      ) : (
        <div className="space-y-3">
          {projects.map((p:any) => (
            <div key={p._id} className="bg-zinc-900 p-4 rounded-xl flex justify-between items-center">
              <div>
                <div className="font-bold">{p.title}</div>
                <div className="text-sm text-zinc-400">{p.tech?.join(', ')}</div>
              </div>
              <div className="flex gap-3">
                <Link href={`/admin/projects/${p._id}/edit`} className="text-blue-400 text-sm">تعديل</Link>
                <form action={`/api/projects/${p._id}`} method="POST">
                  <input type="hidden" name="_method" value="DELETE" />
                  <button className="text-red-400 text-sm">حذف</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
TSX

# 3. تعديل app/admin/messages/page.tsx - إضافة فلترة مقروء/غير مقروء
cat > app/admin/messages/page.tsx << 'TSX'
import { MongoClient } from 'mongodb';

async function getMessages(filter: string) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const query = filter === 'unread' ? { read: { $ne: true } } : {};
  const msgs = await client.db().collection('messages').find(query).sort({createdAt:-1}).toArray();
  client.close();
  return msgs;
}

export default async function Messages({ searchParams }: { searchParams: { filter?: string } }) {
  const filter = searchParams.filter || 'all';
  const messages = await getMessages(filter);
  
  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الرسائل ({messages.length})</h1>
        <div className="flex gap-2 text-sm">
          <a href="/admin/messages" className={`px-3 py-1 rounded ${filter==='all'?'bg-white text-black':'bg-zinc-800'}`}>الكل</a>
          <a href="/admin/messages?filter=unread" className={`px-3 py-1 rounded ${filter==='unread'?'bg-white text-black':'bg-zinc-800'}`}>غير مقروء</a>
        </div>
      </div>
      <div className="space-y-3">
        {messages.map((m:any)=>(
          <div key={m._id} className={`bg-zinc-900 p-4 rounded-xl ${!m.read ? 'border border-blue-500' : ''}`}>
            <div className="flex justify-between mb-2">
              <strong>{m.name} {!m.read && <span className="text-blue-500 text-xs">جديد</span>}</strong>
              <span className="text-zinc-500 text-xs">{new Date(m.createdAt).toLocaleString('ar-EG')}</span>
            </div>
            <a href={`mailto:${m.email}`} className="text-blue-400 text-sm">{m.email}</a>
            <p className="mt-2 text-zinc-300">{m.message}</p>
            {!m.read && (
              <form action={`/api/messages/${m._id}/read`} method="POST" className="mt-3">
                <button className="text-xs bg-zinc-800 px-3 py-1 rounded">تحديد كمقروء</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
TSX

# 4. تعديل app/admin/skills/page.tsx
mkdir -p app/admin/skills
cat > app/admin/skills/page.tsx << 'TSX'
import { MongoClient } from 'mongodb';
import Link from 'next/link';

async function getSkills() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const skills = await client.db().collection('skills').find().toArray();
  client.close();
  return skills;
}

export default async function SkillsPage() {
  const skills = await getSkills();
  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المهارات</h1>
        <Link href="/admin/skills/new" className="bg-white text-black px-4 py-2 rounded">+ إضافة</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {skills.map((s:any) => (
          <div key={s._id} className="bg-zinc-900 p-4 rounded-xl text-center">
            <div className="font-bold">{s.name}</div>
            <div className="text-sm text-zinc-400">{s.level}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
TSX

# 5. تعديل app/admin/profile/page.tsx
cat > app/admin/profile/page.tsx << 'TSX'
import { MongoClient } from 'mongodb';

async function getProfile() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const profile = await client.db().collection('profile').findOne({});
  client.close();
  return profile;
}

export default async function ProfilePage() {
  const profile = await getProfile() || {};
  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">تعديل البروفايل</h1>
      <form action="/api/profile" method="POST" className="space-y-4">
        <input name="name" defaultValue={profile.name} placeholder="الاسم" className="w-full p-3 bg-zinc-900 rounded" />
        <input name="title" defaultValue={profile.title} placeholder="المسمى الوظيفي" className="w-full p-3 bg-zinc-900 rounded" />
        <textarea name="bio" defaultValue={profile.bio} placeholder="نبذة عنك" className="w-full p-3 bg-zinc-900 rounded h-32" />
        <input name="github" defaultValue={profile.github} placeholder="GitHub" className="w-full p-3 bg-zinc-900 rounded" />
        <input name="linkedin" defaultValue={profile.linkedin} placeholder="LinkedIn" className="w-full p-3 bg-zinc-900 rounded" />
        <button className="bg-white text-black px-6 py-3 rounded font-bold w-full">حفظ التعديلات</button>
      </form>
    </div>
  )
}
TSX

# 6. إضافة APIs جديدة
mkdir -p app/api/logout app/api/messages app/api/profile

cat > app/api/logout/route.ts << 'TS'
import { NextResponse } from 'next/server';
export async function POST() {
  const res = NextResponse.redirect(new URL('/admin/login'));
  res.cookies.delete('admin_token');
  return res;
}
TS

echo "✅ كل الملفات القديمة اتحدثت + الإضافات اتضافت"
