import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  GraduationCap,
  PlayCircle,
  ArrowRight,
  BookMarked,
  Plus
} from 'lucide-react';

import ClientSidebar from './Sidebar.jsx';
import dummyData from '../../../assets/dummyData.json';
import { useAppContext } from '../../../context/AppContext.jsx';

const ClientCourses = () => {
  const data = dummyData.clientDashboardCoursesPage;
  const { courseEnrollments: enrolledCourses } = useAppContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return null;

  const completedCourses = enrolledCourses.filter((course) => course.status === 'Completed').length;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#020602] text-white selection:bg-[#a3e635] selection:text-black">
      {/* ---------------- 1. CLIENT DASHBOARD SIDEBAR ---------------- */}
      <ClientSidebar />

      {/* ---------------- 2. MAIN CONTENT AREA ---------------- */}
      <main className="relative z-10 w-full min-w-0 space-y-6 px-4 pb-10 pt-20 sm:space-y-8 sm:px-6 lg:ml-72 lg:w-[calc(100%-18rem)] lg:px-8 lg:pt-8 2xl:px-12">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* Cyber Mesh Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        {/* ---------------- 3. PAGE HEADER ---------------- */}
        <div className="relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-sky-300/20 bg-gradient-to-br from-[#071713] via-[#08101a] to-[#100b1a] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 md:flex-row md:items-center">
          <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/25 bg-sky-400/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-sky-300 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" />
              <span>{data.badge}</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
              {data.heading}
            </h1>

            <p className="max-w-2xl text-xs leading-relaxed text-gray-300 sm:text-sm">
              {data.subheading}
            </p>
          </div>

          <Link
            to="/academy"
            className="relative flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] px-5 py-3.5 text-xs font-extrabold text-black shadow-[0_0_25px_rgba(163,230,53,0.3)] transition-all hover:shadow-[0_0_30px_rgba(163,230,53,0.5)] sm:px-6 sm:text-sm md:w-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Browse All Courses</span>
          </Link>
        </div>

        {/* ---------------- 4. ENROLLED COURSES LIST ---------------- */}
        {enrolledCourses.length > 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-base font-black text-white sm:text-lg">
                <GraduationCap className="h-5 w-5 text-sky-300" />
                Active Enrollments ({enrolledCourses.length})
              </h2>
              <span className="w-fit rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold text-emerald-300">
                {completedCourses} completed
              </span>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2 sm:gap-6">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="group flex min-w-0 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#07130f] via-[#080b12] to-[#0d0a16] shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/35 hover:shadow-sky-950/20"
                >
                  <div>
                    {/* Course Thumbnail */}
                    <div className="relative aspect-[16/8] w-full overflow-hidden sm:aspect-[16/7]">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#040e04] via-transparent to-transparent opacity-90"></div>

                      <span className="absolute left-3 top-3 rounded-full border border-sky-300/30 bg-black/80 px-3 py-1 text-[10px] font-extrabold text-sky-200 backdrop-blur-md">
                        {course.category}
                      </span>

                      <span
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg ${
                          course.status === 'Completed'
                            ? 'border border-sky-200/30 bg-sky-300 text-[#061019]'
                            : 'border border-emerald-200/30 bg-emerald-300 text-[#06130c]'
                        }`}
                      >
                        {course.status}
                      </span>
                    </div>

                    {/* Course Body Info */}
                    <div className="min-w-0 space-y-4 p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg border border-violet-300/20 bg-violet-400/10 px-2.5 py-1 text-[10px] font-bold text-violet-200">
                          {course.level}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg border border-amber-300/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-200">
                          <BookMarked className="h-3 w-3" />
                          {course.totalModules} modules
                        </span>
                      </div>
                      <h3 className="text-base font-black leading-snug text-white transition-colors group-hover:text-sky-200 sm:text-lg">
                        {course.title}
                      </h3>

                      <div className="min-w-0 space-y-2 text-xs text-gray-400">
                        <div>Instructor: <strong className="text-gray-200">{course.instructor}</strong></div>
                        <div className="break-words">Last Watched: <strong className="text-sky-200">{course.lastWatchedModule}</strong></div>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-300">Course Progress</span>
                          <span className="text-sky-200">{course.progressPercentage}%</span>
                        </div>

                        <div
                          className="h-2 w-full overflow-hidden rounded-full border border-sky-300/15 bg-white/[0.06]"
                          role="progressbar"
                          aria-label={`${course.title} progress`}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-valuenow={Math.min(100, Math.max(0, course.progressPercentage))}
                        >
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 shadow-[0_0_12px_rgba(34,211,238,0.45)] transition-all duration-700"
                            style={{ width: `${Math.min(100, Math.max(0, course.progressPercentage))}%` }}
                          />
                        </div>

                        <div className="text-[10px] text-gray-400 font-semibold pt-1">
                          {course.completedModules} of {course.totalModules} modules completed
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Button */}
                  <div className="flex items-center justify-between border-t border-white/[0.06] bg-black/20 px-5 py-4 sm:px-6">
                    <Link
                      to={`/academy/${course.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-300 to-emerald-300 py-3 text-xs font-extrabold text-[#04100b] transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-200/60"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{course.status === 'Completed' ? 'Review Lectures' : 'Continue Learning'}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ---------------- 5. FALLBACK MODE: BROWSE COURSES ---------------- */
          <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-sky-300/25 bg-gradient-to-br from-[#07130f] via-[#080b12] to-[#0d0a16] p-6 text-center shadow-[0_0_50px_rgba(34,211,238,0.1)] animate-in fade-in duration-300 sm:p-12">
            <div className="mx-auto w-fit rounded-full border border-sky-300/25 bg-sky-400/10 p-4 text-sky-200">
              <BookMarked className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase text-amber-200">
                No Active Course Enrollments
              </span>
              <h2 className="text-2xl font-black text-white sm:text-4xl">
                You Have Not Enrolled In Any Academy Course Yet!
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                Learn Forex, Smart Money Concepts (SMC), and PSX Stock Market Analysis from certified institutional mentors.
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <Link
                to="/academy"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-300 to-emerald-300 px-6 py-4 text-xs font-black text-[#04100b] shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all hover:brightness-110 sm:w-auto sm:px-10 sm:text-sm"
              >
                <span>BROWSE COURSES NOW</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ClientCourses;