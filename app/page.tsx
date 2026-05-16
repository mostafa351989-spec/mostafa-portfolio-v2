'use client';
import { useState, useEffect } from 'react';
import LightThreeBackground from '@/components/LightThreeBackground'
import IntroLoader from '@/components/IntroLoader'

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('جاري الإرسال...');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('✅ اتبعتت بنجاح! هرد عليك قريب');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('❌ حصل خطأ، جرب تاني');
      }
    } catch (error) {
      setStatus('❌ فشل الاتصال');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 5000);
    }
  };

  return (
    <>
      {showIntro && <IntroLoader onFinish={() => setShowIntro(false)} />}

      <main className={`relative ${isDark? '' : 'bg-white/80'}`}>
        <div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#8B7355] via-[#C9B037] to-[#8B7355] z-50 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />

        <button
          onClick={() => setIsDark(!isDark)}
          className="fixed top-6 right-6 z-50 px-4 py-2 bg-black/60 backdrop-blur border border-[#C9B037]/50 rounded-full hover:bg-[#C9B037]/20 transition-all text-white"
        >
          {isDark? '☀️ نهار' : '🌙 ليل'}
        </button>

        <a
          href="https://wa.me/201044907363"
          target="_blank"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white text-2xl shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:scale-110 transition-all"
        >
          💬
        </a>

        {isDark && (
          <div
            className="pointer-events-none fixed w-96 h-96 rounded-full opacity-15 blur-3xl bg-[#C9B037] z-0 transition-all duration-300"
            style={{
              left: mousePos.x - 192,
              top: mousePos.y - 192,
              mixBlendMode: 'screen'
            }}
          />
        )}

        <LightThreeBackground />

        <div className={`relative z-10 ${isDark? 'text-white' : 'text-black'}`}>
          <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <div className="relative">
              {isDark && <div className="absolute inset-0 bg-[#C9B037]/15 blur-3xl"></div>}
              <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#8B7355] via-[#C9B037] to-[#8B7355] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(201,176,55,0.4)]">
                مصطفى محمود عيسى
              </h1>
            </div>
            <p className={`text-xl md:text-2xl mt-4 ${isDark? 'text-gray-300' : 'text-gray-800'}`}>مصمم مواقع - ثلاثي الأبعاد</p>
            <p className={`max-w-2xl mt-6 leading-relaxed ${isDark? 'text-gray-400' : 'text-gray-700'}`}>
              أحول الأفكار إلى تجارب بصرية تفاعلية باستخدام أحدث التقنيات. متخصص في Three.js و Next.js.
            </p>
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              <a href="https://wa.me/201044907363" className="px-6 py-3 border-2 border-[#C9B037]/50 rounded-full hover:bg-[#C9B037]/10 hover:border-[#C9B037] transition-all hover:shadow-[0_0_20px_rgba(201,176,55,0.3)]">
                واتساب: 01044907363
              </a>
              <a href="#projects" className="px-6 py-3 bg-gradient-to-r from-[#8B7355] to-[#C9B037] rounded-full hover:from-[#6B5A44] hover:to-[#A67C00] transition-all hover:shadow-[0_0_30px_rgba(201,176,55,0.5)] text-white">
                شوف شغلي
              </a>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6">المهارات</h3>
              <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
                {['Next.js', 'React', 'Three.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB', 'GSAP', 'UI/UX', 'Figma'].map((skill) => (
                  <span key={skill} className={`px-4 py-2 backdrop-blur rounded-full border border-[#C9B037]/30 text-sm hover:border-[#C9B037]/60 hover:shadow-[0_0_15px_rgba(201,176,55,0.3)] transition-all ${isDark? 'bg-black/40' : 'bg-white/80'}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="min-h-screen px-4 py-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-[#8B7355] via-[#C9B037] to-[#8B7355] bg-clip-text text-transparent">خدماتي</h2>
              <p className={`text-center mb-16 ${isDark? 'text-gray-400' : 'text-gray-700'}`}>حلول تقنية متكاملة لمشروعك</p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: '🌐', title: 'مواقع 3D تفاعلية', desc: 'تصميم مواقع بتقنية Three.js وتجربة مستخدم فريدة تبهر زوارك' },
                  { icon: '⚡', title: 'تطوير Full Stack', desc: 'بناء مواقع متكاملة من الواجهة لقواعد البيانات بأحدث التقنيات' },
                  { icon: '🎨', title: 'تصميم UI/UX', desc: 'واجهات عصرية سريعة ومتجاوبة مع كل الأجهزة وتجربة سلسة' }
                ].map((service) => (
                  <div key={service.title} className={`group relative backdrop-blur-lg p-8 rounded-3xl border border-[#C9B037]/20 hover:border-[#C9B037]/60 transition-all duration-500 hover:shadow-[0_0_40px_rgba(201,176,55,0.2)] ${isDark? 'bg-black/40' : 'bg-white/80'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C9B037]/0 to-[#8B7355]/0 group-hover:from-[#C9B037]/10 group-hover:to-[#8B7355]/10 rounded-3xl transition-all duration-500"></div>
                    <div className="relative">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#C9B037] to-[#8B7355] bg-clip-text text-transparent">{service.title}</h3>
                      <p className={`leading-relaxed ${isDark? 'text-gray-300' : 'text-gray-800'}`}>{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { num: '27+', label: 'مشروع منجز' },
                { num: '15+', label: 'عميل سعيد' },
                { num: '3+', label: 'سنين خبرة' },
                { num: '100%', label: 'التزام بالمواعيد' }
              ].map((stat) => (
                <div key={stat.label} className={`relative text-center backdrop-blur-lg p-6 rounded-2xl border border-[#C9B037]/30 hover:border-[#C9B037]/60 transition-all group hover:shadow-[0_0_30px_rgba(201,176,55,0.3)] ${isDark? 'bg-black/40' : 'bg-white/80'}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9B037]/0 to-[#8B7355]/0 group-hover:from-[#C9B037]/5 group-hover:to-[#8B7355]/5 rounded-2xl transition-all"></div>
                  <div className="relative">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#C9B037] to-[#8B7355] bg-clip-text text-transparent mb-2">{stat.num}</div>
                    <div className={isDark? 'text-gray-300' : 'text-gray-800'}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="min-h-screen px-4 py-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#8B7355] via-[#C9B037] to-[#8B7355] bg-clip-text text-transparent">طريقة الشغل</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: '01', title: 'نتناقش', desc: 'نتكلم عن فكرتك والمتطلبات' },
                  { step: '02', title: 'أصمم', desc: 'بعمل التصميم الأولي وأوريك' },
                  { step: '03', title: 'أبرمج', desc: 'بكود الموقع بأحدث التقنيات' },
                  { step: '04', title: 'نطلق', desc: 'بنرفع الموقع ونتابع معاك' }
                ].map((item) => (
                  <div key={item.step} className={`backdrop-blur-lg p-6 rounded-3xl border border-[#C9B037]/20 hover:border-[#C9B037]/60 transition-all hover:shadow-[0_0_30px_rgba(201,176,55,0.2)] ${isDark? 'bg-black/40' : 'bg-white/80'}`}>
                    <div className="text-5xl font-bold bg-gradient-to-r from-[#C9B037]/30 to-[#8B7355]/30 bg-clip-text text-transparent mb-4">{item.step}</div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className={isDark? 'text-gray-400' : 'text-gray-700'}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="projects" className="min-h-screen px-4 py-20">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-[#8B7355] via-[#C9B037] to-[#8B7355] bg-clip-text text-transparent">أحدث المشاريع</h2>
              <p className={`text-center mb-12 ${isDark? 'text-gray-400' : 'text-gray-700'}`}>مجموعة من أفضل أعمالي</p>

              <div className="flex justify-center gap-4 mb-12 flex-wrap">
                <button className="px-6 py-2 bg-gradient-to-r from-[#8B7355] to-[#C9B037] rounded-full hover:shadow-[0_0_20px_rgba(201,176,55,0.5)] transition-all text-white">الكل</button>
                <button className={`px-6 py-2 border border-[#C9B037]/30 rounded-full hover:bg-[#C9B037]/10 hover:border-[#C9B037]/60 transition-all ${isDark? 'bg-black/40' : 'bg-white/80'}`}>3D</button>
                <button className={`px-6 py-2 border border-[#C9B037]/30 rounded-full hover:bg-[#C9B037]/10 hover:border-[#C9B037]/60 transition-all ${isDark? 'bg-black/40' : 'bg-white/80'}`}>Design</button>
                <button className={`px-6 py-2 border border-[#C9B037]/30 rounded-full hover:bg-[#C9B037]/10 hover:border-[#C9B037]/60 transition-all ${isDark? 'bg-black/40' : 'bg-white/80'}`}>Web App</button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: 'منصة تسوق إلكتروني', tech: 'Next.js + Stripe + MongoDB', desc: 'متجر كامل مع دفع أونلاين' },
                  { name: 'عالم ثلاثي الأبعاد تفاعلي', tech: 'Three.js + React Three Fiber', desc: 'تجربة VR على الويب' },
                  { name: 'لوحة تحكم إدارة', tech: 'React + Node.js', desc: 'Dashboard كامل لإدارة البيانات' },
                  { name: 'موقع شخصي بتأثيرات GSAP', tech: 'GSAP + Tailwind', desc: 'أنيميشن احترافي وسلس' }
                ].map((project) => (
                  <div key={project.name} className={`group relative backdrop-blur-lg p-8 rounded-3xl border border-[#C9B037]/20 hover:border-[#C9B037]/60 transition-all duration-500 hover:shadow-[0_0_40px_rgba(201,176,55,0.2)] ${isDark? 'bg-black/40' : 'bg-white/80'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C9B037]/0 to-[#8B7355]/0 group-hover:from-[#C9B037]/10 group-hover:to-[#8B7355]/10 rounded-3xl transition-all"></div>
                    <div className="relative">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-[#C9B037] transition">{project.name}</h3>
                      <p className="text-sm text-[#C9B037] mb-3">{project.tech}</p>
                      <p className={`mb-4 ${isDark? 'text-gray-400' : 'text-gray-700'}`}>{project.desc}</p>
                      <a href="#" className="text-[#C9B037] hover:text-[#8B7355] group-hover:mr-2 transition-all inline-block">عرض المشروع →</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="min-h-screen px-4 py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#8B7355] via-[#C9B037] to-[#8B7355] bg-clip-text text-transparent">الخبرات</h2>
              <div className="space-y-8">
                {[
                  { year: '2023 - الآن', title: 'Full Stack Developer', company: 'Freelance', desc: 'بناء مواقع وتطبيقات ويب متكاملة للعملاء من مصر والخليج باستخدام Next.js و Three.js' },
                  { year: '2022 - 2023', title: 'Frontend Developer', company: 'شركة تقنية', desc: 'تطوير واجهات مستخدم تفاعلية وسريعة مع التركيز على تجربة المستخدم' }
                ].map((exp) => (
                  <div key={exp.title} className={`backdrop-blur-lg p-8 rounded-3xl border border-[#C9B037]/20 hover:border-[#C9B037]/60 transition-all hover:shadow-[0_0_40px_rgba(201,176,55,0.2)] ${isDark? 'bg-black/40' : 'bg-white/80'}`}>
                    <div className="flex flex-wrap justify-between items-start mb-3">
                      <h3 className="text-2xl font-bold">{exp.title}</h3>
                      <span className="text-[#C9B037] bg-[#C9B037]/10 px-4 py-1 rounded-full text-sm border border-[#C9B037]/30">{exp.year}</span>
                    </div>
                    <p className={`mb-3 ${isDark? 'text-gray-400' : 'text-gray-700'}`}>{exp.company}</p>
                    <p className={`leading-relaxed ${isDark? 'text-gray-300' : 'text-gray-800'}`}>{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 py-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#8B7355] via-[#C9B037] to-[#8B7355] bg-clip-text text-transparent">الشهادات</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: 'Meta Front-End Developer', org: 'Coursera', year: '2024' },
                  { title: 'Three.js Journey', org: 'Bruno Simon', year: '2023' },
                  { title: 'Advanced React', org: 'Udemy', year: '2023' }
                ].map((cert) => (
                  <div key={cert.title} className={`backdrop-blur-lg p-6 rounded-2xl border border-[#C9B037]/20 text-center hover:border-[#C9B037]/60 transition-all hover:shadow-[0_0_30px_rgba(201,176,55,0.2)] ${isDark? 'bg-black/40' : 'bg-white/80'}`}>
                    <div className="text-4xl mb-3">🎓</div>
                    <h3 className="text-lg font-bold mb-2">{cert.title}</h3>
                    <p className={`text-sm ${isDark? 'text-gray-400' : 'text-gray-700'}`}>{cert.org} • {cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="min-h-screen px-4 py-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#8B7355] via-[#C9B037] to-[#8B7355] bg-clip-text text-transparent">آراء العملاء</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: 'أحمد محمد', role: 'صاحب متجر', text: 'مصطفى محترف جداً، سلمني الموقع قبل المعاد والشغل فوق الممتاز' },
                  { name: 'سارة خالد', role: 'مصممة', text: 'أفضل مطور اتعاملت معاه، فهم فكرتي ونفذها أحسن ما تخيلت' }
                ].map((testimonial) => (
                  <div key={testimonial.name} className={`backdrop-blur-lg p-8 rounded-3xl border border-[#C9B037]/20 hover:border-[#C9B037]/60 transition-all hover:shadow-[0_0_40px_rgba(201,176,55,0.2)] ${isDark? 'bg-black/40' : 'bg-white/80'}`}>
                    <p className={`mb-6 leading-relaxed text-lg ${isDark? 'text-gray-300' : 'text-gray-800'}`}>"{testimonial.text}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8B7355] to-[#C9B037] flex items-center justify-center font-bold text-white">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <div className="font-bold">{testimonial.name}</div>
                        <div className={`text-sm ${isDark? 'text-gray-400' : 'text-gray-700'}`}>{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 py-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-[#8B7355] via-[#C9B037] to-[#8B7355] bg-clip-text text-transparent">آخر المقالات</h2>
              <p className={`text-center mb-16 ${isDark? 'text-gray-400' : 'text-gray-700'}`}>بشارك خبرتي ومعلومات مفيدة</p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: 'ليه Three.js مستقبل الويب؟', date: '15 مايو 2026', read: '5 دقائق' },
                  { title: 'Next.js 15: أهم المميزات الجديدة', date: '10 مايو 2026', read: '7 دقائق' },
                  { title: 'نصائح لتحسين أداء موقعك', date: '5 مايو 2026', read: '4 دقائق' }
                ].map((post) => (
                  <div key={post.title} className={`group backdrop-blur-lg rounded-3xl border border-[#C9B037]/20 overflow-hidden hover:border-[#C9B037]/60 transition-all hover:shadow-[0_0_40px_rgba(201,176,55,0.2)] ${isDark? 'bg-black/40' : 'bg-white/80'}`}>
                    <div className="h-48 bg-gradient-to-br from-[#8B7355] to-[#C9B037]"></div>
                    <div className="p-6">
                      <div className={`flex gap-4 text-xs mb-3 ${isDark? 'text-gray-400' : 'text-gray-700'}`}>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.read}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[#C9B037] transition">{post.title}</h3>
                      <a href="#" className="text-[#C9B037] hover:text-[#8B7355]">اقرأ المزيد →</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 py-20">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#8B7355] via-[#C9B037] to-[#8B7355] bg-clip-text text-transparent">أسئلة شائعة</h2>
              <div className="space-y-4">
                {[
                  { q: 'كم مدة تنفيذ المشروع؟', a: 'حسب حجم المشروع، عادة من أسبوعين لشهر. المواقع البسيطة أسبوع، المعقدة شهر أو أكتر.' },
                  { q: 'بتشتغل على مشاريع خارج مصر؟', a: 'أيوه بشتغل مع عملاء من كل مكان أونلاين. التواصل زووم أو واتساب.' },
                  { q: 'إيه طرق الدفع المتاحة؟', a: 'تحويل بنكي، PayPal، Instapay، أو Wise. الدفع على دفعات: 50% مقدم و 50% عند التسليم.' },
                  { q: 'بتقدم دعم بعد التسليم؟', a: 'أكيد، بديك شهر دعم مجاني لأي تعديلات بسيطة أو مشاكل.' }
                ].map((item) => (
                  <div key={item.q} className={`backdrop-blur-lg p-6 rounded-2xl border border-[#C9B037]/20 hover:border-[#C9B037]/60 transition-all hover:shadow-[0_0_30px_rgba(201,176,55,0.2)] ${isDark? 'bg-black/40' : 'bg-white/80'}`}>
                    <h3 className="text-xl font-bold mb-2">{item.q}</h3>
                    <p className={`leading-relaxed ${isDark? 'text-gray-300' : 'text-gray-800'}`}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className={`max-w-2xl w-full relative backdrop-blur-lg p-8 md:p-12 rounded-3xl border-2 border-[#C9B037]/30 hover:border-[#C9B037]/60 transition-all duration-500 hover:shadow-[0_0_50px_rgba(201,176,55,0.3)] ${isDark? 'bg-black/40' : 'bg-white/80'}`}>
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#C9B037] rounded-tl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#C9B037] rounded-br-3xl"></div>

              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-[#8B7355] via-[#C9B037] to-[#8B7355] bg-clip-text text-transparent">
                  تواصل معايا
                </h2>
                <p className={`text-center mb-8 ${isDark? 'text-gray-400' : 'text-gray-700'}`}>عندك مشروع؟ ابعتلي وهنبدأ على طول</p>

                <form onSubmit={async (e) => { e.preventDefault(); const form = e.currentTarget; const data = Object.fromEntries(new FormData(form)); const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if(res.ok){ alert("تم الإرسال بنجاح ✅"); form.reset(); } else { alert("حصل خطأ ❌"); } }}  method="POST">
                  <input
                    type="text"
                    placeholder="الاسم"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className={`w-full p-4 border-2 border-[#C9B037]/30 rounded-xl focus:border-[#C9B037] focus:outline-none transition-all ${isDark? 'bg-black/30 text-white' : 'bg-white/80 text-black'}`}
                  />
                  <input
                    type="email"
                    placeholder="الإيميل"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className={`w-full p-4 border-2 border-[#C9B037]/30 rounded-xl focus:border-[#C9B037] focus:outline-none transition-all ${isDark? 'bg-black/30 text-white' : 'bg-white/80 text-black'}`}
                  />
                  <textarea
                    placeholder="الرسالة"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={5}
                    className={`w-full p-4 border-2 border-[#C9B037]/30 rounded-xl focus:border-[#C9B037] focus:outline-none transition-all ${isDark? 'bg-black/30 text-white' : 'bg-white/80 text-black'}`}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-[#8B7355] to-[#C9B037] rounded-xl font-bold text-lg hover:from-[#6B5A44] hover:to-[#A67C00] transition-all hover:shadow-[0_0_40px_rgba(201,176,55,0.6)] disabled:opacity-50 text-white"
                  >
                    {loading? 'جاري الإرسال...' : 'إرسال الرسالة'}
                  </button>
                  {status && (
                    <p className="text-center text-[#C9B037] font-bold">{status}</p>
                  )}
                </form>
              </div>
            </div>
          </section>
        </div>
        {/* Admin Dashboard Button */}
  <a 
    href="/admin" 
    className="fixed bottom-6 left-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 z-50"
  >
    ⚙️ لوحة التحكم
  </a>
</main>
    </>
  );
}
