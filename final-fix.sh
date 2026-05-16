#!/bin/bash
echo "🔥 مسح نهائي لمجلد pages وحل مشكلة Types"

# 1. اتأكد إن pages اتمسح من Git نهائي
git rm -r --cached pages/ 2>/dev/null
rm -rf pages/
echo "pages/ deleted" > .gitignore
echo "pages/" >> .gitignore

# 2. صلح app/admin/profile/page.tsx بالـ Type الصح
cat > app/admin/profile/page.tsx << 'TSX'
import { MongoClient, WithId, Document } from 'mongodb';

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
  return {
    name: profile?.name || '',
    title: profile?.title || '',
    bio: profile?.bio || '',
    github: profile?.github || '',
    linkedin: profile?.linkedin || '',
  };
}

export default async function ProfilePage() {
  const profile = await getProfile();
  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">تعديل البروفايل</h1>
      <form action="/api/profile" method="POST" className="space-y-4">
        <input name="name" defaultValue={profile.name} placeholder="الاسم" className="w-full p-3 bg-zinc-900 rounded border border-zinc-800" />
        <input name="title" defaultValue={profile.title} placeholder="المسمى الوظيفي" className="w-full p-3 bg-zinc-900 rounded border border-zinc-800" />
        <textarea name="bio" defaultValue={profile.bio} placeholder="نبذة عنك" className="w-full p-3 bg-zinc-900 rounded border border-zinc-800 h-32" />
        <input name="github" defaultValue={profile.github} placeholder="GitHub" className="w-full p-3 bg-zinc-900 rounded border border-zinc-800" />
        <input name="linkedin" defaultValue={profile.linkedin} placeholder="LinkedIn" className="w-full p-3 bg-zinc-900 rounded border border-zinc-800" />
        <button className="bg-white text-black px-6 py-3 rounded font-bold w-full">حفظ التعديلات</button>
      </form>
    </div>
  )
}
TSX

# 3. صلح app/admin/projects/page.tsx عشان الـ ObjectId
cat > app/admin/projects/page.tsx << 'TSX'
import { MongoClient } from 'mongodb';
import Link from 'next/link';

async function getProjects() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const projects = await client.db().collection('projects').find().sort({createdAt:-1}).toArray();
  client.close();
  return projects.map(p => ({...p, _id: p._id.toString()}));
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
                <a href={`/admin/projects/${p._id}/edit`} className="text-blue-400 text-sm">تعديل</a>
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

echo "✅ خلصنا. اعمل push"
