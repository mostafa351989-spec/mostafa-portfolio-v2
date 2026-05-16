rm -rf pages/
git rm -r --cached pages/ 2>/dev/null

mkdir -p app/admin/skills app/admin/messages

cat > app/admin/profile/page.tsx << 'TSX'
import { MongoClient } from 'mongodb';
export const dynamic = 'force-dynamic';
async function getProfile() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const profile = await client.db().collection('profile').findOne({});
    client.close();
    return { name: profile?.name || '', title: profile?.title || '', bio: profile?.bio || '', github: profile?.github || '', linkedin: profile?.linkedin || '' };
  } catch { return { name: '', title: '', bio: '', github: '', linkedin: '' }; }
}
export default async function ProfilePage() {
  const p = await getProfile();
  return <div className="p-8 bg-black min-h-screen text-white max-w-2xl mx-auto"><h1 className="text-2xl font-bold mb-6">البروفايل</h1><form action="/api/profile" method="POST" className="space-y-4"><input name="name" defaultValue={p.name} placeholder="الاسم" className="w-full p-3 bg-zinc-900 rounded"/><input name="title" defaultValue={p.title} placeholder="المسمى" className="w-full p-3 bg-zinc-900 rounded"/><textarea name="bio" defaultValue={p.bio} placeholder="نبذة" className="w-full p-3 bg-zinc-900 rounded h-32"/><button className="bg-white text-black px-6 py-3 rounded font-bold w-full">حفظ</button></form></div>
}
TSX

cat > app/admin/skills/page.tsx << 'TSX'
import { MongoClient } from 'mongodb';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
async function getSkills() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const skills = await client.db().collection('skills').find().toArray();
    client.close();
    return skills.map(s => ({_id: s._id.toString(), name: s.name || '', level: s.level || 0}));
  } catch { return []; }
}
export default async function SkillsPage() {
  const skills = await getSkills();
  return <div className="p-8 bg-black min-h-screen text-white"><div className="flex justify-between mb-6"><h1 className="text-2xl font-bold">المهارات</h1><Link href="/admin/skills/new" className="bg-white text-black px-4 py-2 rounded">+ إضافة</Link></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{skills.map(s => <div key={s._id} className="bg-zinc-900 p-4 rounded-xl text-center"><div className="font-bold">{s.name}</div><div className="text-sm text-zinc-400">{s.level}%</div></div>)}</div></div>
}
TSX

cat > app/admin/messages/page.tsx << 'TSX'
import { MongoClient } from 'mongodb';
export const dynamic = 'force-dynamic';
async function getMessages() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const msgs = await client.db().collection('messages').find().sort({createdAt:-1}).toArray();
    client.close();
    return msgs.map(m => ({_id: m._id.toString(), name: m.name || '', email: m.email || '', message: m.message || ''}));
  } catch { return []; }
}
export default async function Messages() {
  const messages = await getMessages();
  return <div className="p-8 bg-black min-h-screen text-white"><h1 className="text-2xl font-bold mb-6">الرسائل ({messages.length})</h1><div className="space-y-3">{messages.map(m => <div key={m._id} className="bg-zinc-900 p-4 rounded-xl"><strong>{m.name}</strong><p className="text-zinc-300 mt-2">{m.message}</p></div>)}</div></div>
}
TSX
