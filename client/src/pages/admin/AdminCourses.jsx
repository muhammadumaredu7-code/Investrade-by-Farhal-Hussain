import { useEffect, useState } from 'react';
import { BookOpen, Edit, GraduationCap, Plus, Search, Save, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/adminSiderbar.jsx';
import dummyData from '../../assets/dummyData.json';
import { useAppContext } from '../../context/AppContext.jsx';

const createCourseForm = (course = null) => ({
  title: course?.title || '',
  category: course?.category || '',
  level: course?.level || '',
  duration: course?.duration || '',
  badge: course?.badge || '',
  pricePKR: course?.pricePKR || '',
  priceUSD: course?.priceUSD || '',
  instructorName: course?.instructor?.name || '',
  instructorRole: course?.instructor?.role || '',
  instructorAvatar: course?.instructor?.avatar || '',
  thumbnail: course?.thumbnail || '',
  shortDesc: course?.shortDesc || '',
  likesCount: String(course?.likesCount ?? 0),
  modules: course?.modules?.map((module) => ({ ...module })) || []
});

const createEnrollmentForm = (enrollment = null, courses = []) => {
  const course = courses.find((item) => item.title === enrollment?.title) || courses[0];

  return {
    courseTitle: enrollment?.title || course?.title || '',
    status: enrollment?.status || 'In Progress',
    progressPercentage: String(enrollment?.progressPercentage ?? 0),
    completedModules: String(enrollment?.completedModules ?? 0),
    totalModules: String(enrollment?.totalModules ?? course?.modules?.length ?? 0),
    lastWatchedModule: enrollment?.lastWatchedModule || ''
  };
};

const inputClass = 'w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-amber-300/50';
const labelClass = 'block space-y-1.5 text-xs font-medium text-gray-300';

const AdminCourses = () => {
  const {
    academyCourses,
    setAcademyCourses,
    courseEnrollments,
    setCourseEnrollments
  } = useAppContext();
  const [activeTab, setActiveTab] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [enrollmentSearch, setEnrollmentSearch] = useState('');
  const [enrollmentStatusFilter, setEnrollmentStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseForm, setCourseForm] = useState(() => createCourseForm());
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [editingEnrollmentId, setEditingEnrollmentId] = useState(null);
  const [enrollmentForm, setEnrollmentForm] = useState(() => createEnrollmentForm(null, academyCourses));
  const clientProfile = dummyData.dashboardSidebar.user;
  const clientRecord = dummyData.adminUserManagement.usersList.find((user) => user.email === clientProfile.email);
  const [categories, setCategories] = useState(() => (
    [...new Set(dummyData.academyPage.courses.map((course) => course.category))]
  ));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const notify = (message, isError = false) => {
    const showToast = isError ? toast.error : toast.success;
    showToast(message, { duration: 3000, position: 'top-right' });
  };

  const openCourseModal = (course = null) => {
    setEditingCourseId(course?.id || null);
    setCourseForm(createCourseForm(course));
    setIsModalOpen(true);
  };

  const closeCourseModal = () => {
    setIsModalOpen(false);
    setEditingCourseId(null);
    setCourseForm(createCourseForm());
  };

  const updateModule = (index, key, value) => {
    setCourseForm((current) => ({
      ...current,
      modules: current.modules.map((module, moduleIndex) => (
        moduleIndex === index ? { ...module, [key]: value } : module
      ))
    }));
  };

  const handleSaveCourse = (event) => {
    event.preventDefault();
    const existingCourse = academyCourses.find((course) => course.id === editingCourseId);
    const modules = courseForm.modules
      .filter((module) => module.title.trim() && module.videoUrl.trim())
      .map((module) => ({
        title: module.title.trim(),
        videoUrl: module.videoUrl.trim(),
        type: module.type
      }));

    if (!courseForm.title.trim() || !courseForm.category || !courseForm.pricePKR.trim() || !courseForm.priceUSD.trim()) {
      notify('Complete the course title, category, and prices', true);
      return;
    }
    if (!courseForm.instructorName.trim() || !courseForm.shortDesc.trim()) {
      notify('Complete the instructor name and course description', true);
      return;
    }
    if (modules.length === 0) {
      notify('Add at least one complete course module', true);
      return;
    }

    const slug = courseForm.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const savedCourse = {
      id: existingCourse?.id || `${slug}-${Date.now()}`,
      title: courseForm.title.trim(),
      category: courseForm.category,
      level: courseForm.level.trim(),
      duration: courseForm.duration.trim(),
      badge: courseForm.badge.trim(),
      pricePKR: courseForm.pricePKR.trim(),
      priceUSD: courseForm.priceUSD.trim(),
      instructor: {
        name: courseForm.instructorName.trim(),
        role: courseForm.instructorRole.trim(),
        avatar: courseForm.instructorAvatar.trim()
      },
      thumbnail: courseForm.thumbnail.trim(),
      shortDesc: courseForm.shortDesc.trim(),
      likesCount: Math.max(0, Number(courseForm.likesCount) || 0),
      comments: existingCourse?.comments || [],
      modules
    };
    const updatedCourses = existingCourse
      ? academyCourses.map((course) => (course.id === existingCourse.id ? savedCourse : course))
      : [...academyCourses, savedCourse];

    setAcademyCourses(updatedCourses);
    setCategories((current) => current.includes(savedCourse.category) ? current : [...current, savedCourse.category]);
    closeCourseModal();
    notify(existingCourse ? 'Course updated successfully' : 'Course added to Academy');
  };

  const handleDeleteCourse = (course) => {
    if (!window.confirm(`Delete "${course.title}" from the Academy catalog?`)) return;
    setAcademyCourses((current) => current.filter((item) => item.id !== course.id));
    notify('Course removed from Academy');
  };

  const openEnrollmentModal = (enrollment = null) => {
    setEditingEnrollmentId(enrollment?.id || null);
    setEnrollmentForm(createEnrollmentForm(enrollment, academyCourses));
    setIsEnrollmentModalOpen(true);
  };

  const closeEnrollmentModal = () => {
    setIsEnrollmentModalOpen(false);
    setEditingEnrollmentId(null);
    setEnrollmentForm(createEnrollmentForm(null, academyCourses));
  };

  const handleSaveEnrollment = (event) => {
    event.preventDefault();
    const course = academyCourses.find((item) => item.title === enrollmentForm.courseTitle);
    if (!course) {
      notify('Select a course from the Academy catalog', true);
      return;
    }

    const existingEnrollment = courseEnrollments.find((item) => item.id === editingEnrollmentId);
    if (!existingEnrollment && courseEnrollments.some((item) => item.title === course.title)) {
      notify('This client already has an enrollment for this course', true);
      return;
    }

    const totalModules = Math.max(0, Number(enrollmentForm.totalModules) || course.modules.length);
    const isCompleted = enrollmentForm.status === 'Completed';
    const completedModules = isCompleted
      ? totalModules
      : Math.min(totalModules, Math.max(0, Number(enrollmentForm.completedModules) || 0));
    const progressPercentage = isCompleted
      ? 100
      : Math.min(99, Math.max(0, Number(enrollmentForm.progressPercentage) || 0));
    const savedEnrollment = {
      id: existingEnrollment?.id || `${course.id}-enrollment-${Date.now()}`,
      title: course.title,
      category: course.category,
      level: course.level,
      progressPercentage,
      completedModules,
      totalModules,
      lastWatchedModule: enrollmentForm.lastWatchedModule.trim(),
      instructor: course.instructor.name,
      thumbnail: course.thumbnail,
      status: isCompleted ? 'Completed' : 'In Progress'
    };
    const updatedEnrollments = existingEnrollment
      ? courseEnrollments.map((item) => (item.id === existingEnrollment.id ? savedEnrollment : item))
      : [...courseEnrollments, savedEnrollment];

    setCourseEnrollments(updatedEnrollments);
    closeEnrollmentModal();
    notify(existingEnrollment ? 'Enrollment progress updated' : 'Course enrollment added');
  };

  const handleDeleteEnrollment = (enrollment) => {
    if (!window.confirm(`Remove ${clientProfile.name}'s enrollment in "${enrollment.title}"?`)) return;
    setCourseEnrollments((current) => current.filter((item) => item.id !== enrollment.id));
    notify('Course enrollment removed');
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCourses = academyCourses.filter((course) => {
    const searchableText = [
      course.title,
      course.category,
      course.instructor?.name,
      course.instructor?.role,
      course.shortDesc
    ].filter(Boolean).join(' ').toLowerCase();
    return searchableText.includes(normalizedQuery)
      && (categoryFilter === 'all' || course.category === categoryFilter);
  });
  const normalizedEnrollmentQuery = enrollmentSearch.trim().toLowerCase();
  const filteredEnrollments = courseEnrollments.filter((enrollment) => {
    const searchText = [clientProfile.name, clientProfile.email, clientRecord?.phone, enrollment.title, enrollment.category, enrollment.instructor]
      .filter(Boolean).join(' ').toLowerCase();
    return searchText.includes(normalizedEnrollmentQuery)
      && (enrollmentStatusFilter === 'all' || enrollment.status === enrollmentStatusFilter);
  });

  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-[#050806] text-white selection:bg-amber-300 selection:text-black">
      <AdminSidebar />
      <main className="relative z-10 min-w-0 flex-1 space-y-6 px-4 pb-8 pt-20 sm:space-y-8 sm:px-8 sm:pb-10 sm:pt-8 lg:ml-72">
        <header className="flex flex-col gap-5 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              {dummyData.academyPage.badge}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{activeTab === 'catalog' ? 'Course Catalog' : 'Enrollments & Progress'}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">{activeTab === 'catalog' ? 'Manage courses and review how many enrollment records each course has.' : 'Review each client enrollment and update its completion progress.'}</p>
          </div>
          {activeTab === 'catalog' ? (
            <button type="button" onClick={() => openCourseModal()} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 sm:w-auto">
              <Plus className="h-4 w-4" aria-hidden="true" /> Add course
            </button>
          ) : (
            <button type="button" onClick={() => openEnrollmentModal()} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 sm:w-auto">
              <Plus className="h-4 w-4" aria-hidden="true" /> Add enrollment
            </button>
          )}
        </header>

        <nav aria-label="Course management views" className="grid w-full max-w-lg grid-cols-2 gap-1 rounded-xl border border-white/[0.08] bg-white/[0.025] p-1 sm:rounded-2xl">
          <button type="button" onClick={() => setActiveTab('catalog')} aria-pressed={activeTab === 'catalog'} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 ${activeTab === 'catalog' ? 'bg-amber-300 text-black' : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'}`}>
            <BookOpen className="h-4 w-4" aria-hidden="true" /> Catalog ({academyCourses.length})
          </button>
          <button type="button" onClick={() => setActiveTab('enrollments')} aria-pressed={activeTab === 'enrollments'} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 ${activeTab === 'enrollments' ? 'bg-amber-300 text-black' : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'}`}>
            <GraduationCap className="h-4 w-4" aria-hidden="true" /> Enrollments ({courseEnrollments.length})
          </button>
        </nav>

        {activeTab === 'catalog' && (
          <>
        <section aria-label="Course filters" className="grid gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-4">
          <label className="block min-w-0 space-y-1.5 text-[11px] font-semibold text-gray-400">
            Search courses
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
              <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Title, instructor, category" className="min-h-10 w-full rounded-lg border border-white/[0.1] bg-black/30 py-2 pl-9 pr-3 text-sm font-normal text-white outline-none placeholder:text-gray-600 focus:border-amber-300/40" />
            </span>
          </label>
          <label className="block space-y-1.5 text-[11px] font-semibold text-gray-400">
            Category
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="min-h-10 w-full rounded-lg border border-white/[0.1] bg-[#10140f] px-3 py-2 text-sm font-normal text-white outline-none focus:border-amber-300/40 sm:min-w-48">
              <option value="all">All categories</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
        </section>

        <p className="px-1 text-xs text-gray-500">Showing {filteredCourses.length} of {academyCourses.length} courses</p>

        {filteredCourses.length > 0 ? (
          <section aria-label="Academy courses" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <article key={course.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080a08]/90 transition-all duration-200 hover:-translate-y-1 hover:border-amber-300/25 hover:shadow-[0_16px_36px_rgba(0,0,0,0.28)]">
                <div className="relative aspect-[16/9] overflow-hidden bg-white/[0.03]">
                  {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />}
                  <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/75 px-2.5 py-1 text-[10px] font-semibold text-amber-100">{course.category}</span>
                  {course.badge && <span className="absolute right-3 top-3 rounded-full bg-amber-300 px-2.5 py-1 text-[9px] font-bold text-black">{course.badge}</span>}
                </div>
                <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
                  <div>
                    <h2 className="line-clamp-2 text-base font-semibold leading-snug text-white">{course.title}</h2>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-400">{course.shortDesc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><p className="text-[10px] uppercase text-gray-500">Instructor</p><p className="mt-1 truncate font-medium text-gray-200">{course.instructor?.name}</p></div>
                    <div><p className="text-[10px] uppercase text-gray-500">Duration / level</p><p className="mt-1 text-gray-200">{course.duration} · {course.level}</p></div>
                    <div><p className="text-[10px] uppercase text-gray-500">Price</p><p className="mt-1 font-semibold text-amber-200">{course.pricePKR} <span className="font-normal text-gray-400">({course.priceUSD})</span></p></div>
                    <div><p className="text-[10px] uppercase text-gray-500">Enrollments</p><p className="mt-1 text-gray-200">{courseEnrollments.filter((enrollment) => enrollment.title === course.title).length} enrolled · {course.modules.length} modules</p></div>
                  </div>
                  <div className="mt-auto flex items-center gap-2 border-t border-white/[0.07] pt-4">
                    <button type="button" onClick={() => openCourseModal(course)} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-amber-300/20 bg-amber-300/[0.06] px-3 text-xs font-semibold text-amber-100 transition-colors hover:bg-amber-300/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200">
                      <Edit className="h-3.5 w-3.5" aria-hidden="true" /> Edit course
                    </button>
                    <button type="button" onClick={() => handleDeleteCourse(course)} aria-label={`Delete ${course.title}`} title="Delete course" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-300/20 bg-rose-400/[0.05] text-rose-300 transition-colors hover:bg-rose-400/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-white/[0.12] px-5 py-12 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-amber-200" aria-hidden="true" />
            <h2 className="mt-3 text-base font-semibold text-white">No matching courses</h2>
            <p className="mt-1 text-sm text-gray-400">Adjust the search or category filter, or add a course.</p>
          </section>
        )}
          </>
        )}

        {activeTab === 'enrollments' && (
          <section aria-label="Client course enrollments" className="space-y-4">
            <div className="grid gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 sm:grid-cols-[minmax(0,1fr)_180px] sm:p-4">
              <label className="block min-w-0 space-y-1.5 text-[11px] font-semibold text-gray-400">Search enrollments
                <span className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" /><input type="search" value={enrollmentSearch} onChange={(event) => setEnrollmentSearch(event.target.value)} placeholder="Client, email, phone, or course" className="min-h-10 w-full rounded-lg border border-white/[0.1] bg-black/30 py-2 pl-9 pr-3 text-sm font-normal text-white outline-none placeholder:text-gray-600 focus:border-amber-300/40" /></span>
              </label>
              <label className="block space-y-1.5 text-[11px] font-semibold text-gray-400">Completion status
                <select value={enrollmentStatusFilter} onChange={(event) => setEnrollmentStatusFilter(event.target.value)} className="min-h-10 w-full rounded-lg border border-white/[0.1] bg-[#10140f] px-3 py-2 text-sm font-normal text-white outline-none focus:border-amber-300/40"><option value="all">All statuses</option><option value="In Progress">In progress</option><option value="Completed">Completed</option></select>
              </label>
            </div>
            <p className="px-1 text-xs text-gray-500">Showing {filteredEnrollments.length} of {courseEnrollments.length} enrollment records</p>
            {filteredEnrollments.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {filteredEnrollments.map((enrollment) => {
                  const progress = Math.min(100, Math.max(0, Number(enrollment.progressPercentage) || 0));
                  const linkedCourse = academyCourses.find((course) => (
                    course.id === enrollment.id || course.title === enrollment.title
                  ));
                  return (
                    <article key={enrollment.id} className="rounded-2xl border border-white/[0.08] bg-[#080a08]/90 p-4 transition-colors hover:border-sky-300/20 sm:p-5">
                      <header className="flex min-w-0 items-start justify-between gap-3 border-b border-white/[0.07] pb-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <img src={clientRecord?.avatar || dummyData.dashboardSidebar.user.avatar} alt={clientProfile.name} className="h-11 w-11 shrink-0 rounded-xl border border-white/10 object-cover" />
                          <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{clientProfile.name}</p><p className="truncate text-xs text-gray-400">{clientProfile.email}</p>{clientRecord?.phone && <p className="truncate text-[11px] text-gray-500">{clientRecord.phone}</p>}</div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button type="button" onClick={() => openEnrollmentModal(enrollment)} aria-label={`Edit ${enrollment.title} enrollment`} title="Edit enrollment" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/20 bg-amber-300/[0.06] text-amber-200 transition-colors hover:bg-amber-300/15"><Edit className="h-4 w-4" aria-hidden="true" /></button>
                          <button type="button" onClick={() => handleDeleteEnrollment(enrollment)} aria-label={`Remove ${enrollment.title} enrollment`} title="Remove enrollment" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-300/20 bg-rose-400/[0.05] text-rose-300 transition-colors hover:bg-rose-400/15"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                        </div>
                      </header>
                      <div className="mt-4 flex items-start gap-3">
                        {enrollment.thumbnail && <img src={enrollment.thumbnail} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />}
                        <div className="min-w-0"><p className="text-[10px] font-semibold uppercase text-sky-200">{enrollment.category} · {enrollment.level}</p><h2 className="mt-1 break-words text-sm font-semibold text-white">{enrollment.title}</h2><p className="mt-1 text-xs text-gray-400">Instructor: {enrollment.instructor}</p></div>
                      </div>
                      <div className="mt-4 rounded-lg border border-amber-300/15 bg-amber-300/[0.04] px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase text-gray-500">Course fee</p>
                        <p className="mt-1 text-sm font-semibold text-amber-200">{linkedCourse?.pricePKR || 'Price not available'}{linkedCourse?.priceUSD ? <span className="ml-2 text-xs font-normal text-gray-400">({linkedCourse.priceUSD})</span> : null}</p>
                        <p className="mt-1 text-[10px] text-gray-500">Listed Academy price; payment transaction is not included in dummy data.</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3 text-xs"><span className="font-medium text-gray-300">Course progress</span><span className="font-semibold text-sky-200">{progress}% · {enrollment.status}</span></div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.07]" role="progressbar" aria-label={`${enrollment.title} progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-300 transition-[width]" style={{ width: `${progress}%` }} /></div>
                      <div className="mt-2 flex flex-col gap-1 text-[11px] text-gray-400 sm:flex-row sm:items-center sm:justify-between"><span>{enrollment.completedModules} of {enrollment.totalModules} modules completed</span><span className="break-words">Last watched: {enrollment.lastWatchedModule}</span></div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/[0.12] px-5 py-12 text-center"><GraduationCap className="mx-auto h-8 w-8 text-sky-200" aria-hidden="true" /><h2 className="mt-3 text-base font-semibold text-white">No matching enrollments</h2><p className="mt-1 text-sm text-gray-400">No enrollment records match this search or status filter.</p></div>
            )}
          </section>
        )}
      </main>

      {isEnrollmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="enrollment-modal-title" className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-sky-300/20 bg-[#080a08] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:rounded-3xl sm:p-7">
            <header className="mb-5 flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h2 id="enrollment-modal-title" className="text-lg font-bold text-white">{editingEnrollmentId ? 'Edit enrollment progress' : 'Add course enrollment'}</h2>
                <p className="mt-1 text-xs text-gray-400">Enrollment profile is sourced from the existing dashboard client.</p>
              </div>
              <button type="button" onClick={closeEnrollmentModal} aria-label="Close dialog" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"><X className="h-4 w-4" aria-hidden="true" /></button>
            </header>

            <form onSubmit={handleSaveEnrollment} className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
                <img src={clientRecord?.avatar || dummyData.dashboardSidebar.user.avatar} alt={clientProfile.name} className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{clientProfile.name}</p><p className="truncate text-xs text-gray-400">{clientProfile.email}</p></div>
              </div>

              <label className={labelClass}>Course<select required value={enrollmentForm.courseTitle} onChange={(event) => {
                const selectedCourse = academyCourses.find((course) => course.title === event.target.value);
                setEnrollmentForm((current) => ({
                  ...current,
                  courseTitle: event.target.value,
                  totalModules: String(selectedCourse?.modules.length || 0),
                  completedModules: String(Math.min(Number(current.completedModules) || 0, selectedCourse?.modules.length || 0))
                }));
              }} className={inputClass}>{academyCourses.map((course) => <option key={course.id} value={course.title}>{course.title}</option>)}</select></label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>Enrollment status<select value={enrollmentForm.status} onChange={(event) => setEnrollmentForm((current) => ({ ...current, status: event.target.value }))} className={inputClass}><option value="In Progress">In Progress</option><option value="Completed">Completed</option></select></label>
                <label className={labelClass}>Progress percentage<input type="number" min="0" max="100" value={enrollmentForm.progressPercentage} onChange={(event) => setEnrollmentForm((current) => ({ ...current, progressPercentage: event.target.value }))} className={inputClass} /></label>
                <label className={labelClass}>Completed modules<input type="number" min="0" value={enrollmentForm.completedModules} onChange={(event) => setEnrollmentForm((current) => ({ ...current, completedModules: event.target.value }))} className={inputClass} /></label>
                <label className={labelClass}>Total modules<input type="number" min="0" value={enrollmentForm.totalModules} onChange={(event) => setEnrollmentForm((current) => ({ ...current, totalModules: event.target.value }))} className={inputClass} /></label>
              </div>

              <label className={labelClass}>Last watched module<input value={enrollmentForm.lastWatchedModule} onChange={(event) => setEnrollmentForm((current) => ({ ...current, lastWatchedModule: event.target.value }))} className={inputClass} /></label>

              <footer className="flex flex-col-reverse gap-2 border-t border-white/[0.08] pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeEnrollmentModal} className="min-h-10 rounded-lg border border-white/[0.1] px-4 text-sm font-medium text-gray-300 transition-colors hover:bg-white/[0.05]">Cancel</button>
                <button type="submit" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-sky-200 px-4 text-sm font-bold text-[#07121b] transition-colors hover:bg-sky-100"><Save className="h-4 w-4" aria-hidden="true" /> Save enrollment</button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="course-modal-title" className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-amber-300/20 bg-[#080a08] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:rounded-3xl sm:p-7">
            <header className="mb-5 flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h2 id="course-modal-title" className="text-lg font-bold text-white">{editingCourseId ? 'Edit course' : 'Add course'}</h2>
                <p className="mt-1 text-xs text-gray-400">Fields follow the public Academy course record.</p>
              </div>
              <button type="button" onClick={closeCourseModal} aria-label="Close dialog" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"><X className="h-4 w-4" aria-hidden="true" /></button>
            </header>

            <form onSubmit={handleSaveCourse} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>Course title<input required value={courseForm.title} onChange={(event) => setCourseForm((current) => ({ ...current, title: event.target.value }))} className={inputClass} /></label>
                <label className={labelClass}>Category<input required list="academy-course-categories" value={courseForm.category} onChange={(event) => setCourseForm((current) => ({ ...current, category: event.target.value }))} className={inputClass} /><datalist id="academy-course-categories">{categories.map((category) => <option key={category} value={category} />)}</datalist></label>
                <label className={labelClass}>Level<input value={courseForm.level} onChange={(event) => setCourseForm((current) => ({ ...current, level: event.target.value }))} className={inputClass} /></label>
                <label className={labelClass}>Duration<input value={courseForm.duration} onChange={(event) => setCourseForm((current) => ({ ...current, duration: event.target.value }))} className={inputClass} /></label>
                <label className={labelClass}>Catalog badge<input value={courseForm.badge} onChange={(event) => setCourseForm((current) => ({ ...current, badge: event.target.value }))} className={inputClass} /></label>
                <label className={labelClass}>Likes count<input type="number" min="0" value={courseForm.likesCount} onChange={(event) => setCourseForm((current) => ({ ...current, likesCount: event.target.value }))} className={inputClass} /></label>
                <label className={labelClass}>Price PKR<input required value={courseForm.pricePKR} onChange={(event) => setCourseForm((current) => ({ ...current, pricePKR: event.target.value }))} className={inputClass} /></label>
                <label className={labelClass}>Price USD<input required value={courseForm.priceUSD} onChange={(event) => setCourseForm((current) => ({ ...current, priceUSD: event.target.value }))} className={inputClass} /></label>
                <label className={labelClass}>Instructor name<input required value={courseForm.instructorName} onChange={(event) => setCourseForm((current) => ({ ...current, instructorName: event.target.value }))} className={inputClass} /></label>
                <label className={labelClass}>Instructor role<input value={courseForm.instructorRole} onChange={(event) => setCourseForm((current) => ({ ...current, instructorRole: event.target.value }))} className={inputClass} /></label>
                <label className={labelClass}>Instructor avatar URL<input type="url" value={courseForm.instructorAvatar} onChange={(event) => setCourseForm((current) => ({ ...current, instructorAvatar: event.target.value }))} className={inputClass} /></label>
                <label className={labelClass}>Thumbnail URL<input type="url" value={courseForm.thumbnail} onChange={(event) => setCourseForm((current) => ({ ...current, thumbnail: event.target.value }))} className={inputClass} /></label>
              </div>

              <label className={labelClass}>Course description<textarea required rows={3} value={courseForm.shortDesc} onChange={(event) => setCourseForm((current) => ({ ...current, shortDesc: event.target.value }))} className={`${inputClass} resize-y leading-relaxed`} /></label>

              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold text-gray-200">Modules</legend>
                {courseForm.modules.map((module, index) => (
                  <div key={index} className="grid gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_130px_auto] sm:items-end">
                    <label className={labelClass}>Module title<input required value={module.title} onChange={(event) => setCourseForm((current) => ({ ...current, modules: current.modules.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) }))} className={inputClass} /></label>
                    <label className={labelClass}>Video URL<input type="url" required value={module.videoUrl} onChange={(event) => setCourseForm((current) => ({ ...current, modules: current.modules.map((item, itemIndex) => itemIndex === index ? { ...item, videoUrl: event.target.value } : item) }))} className={inputClass} /></label>
                    <label className={labelClass}>Type<select value={module.type} onChange={(event) => updateModule(index, 'type', event.target.value)} className={inputClass}><option value="youtube">YouTube</option><option value="drive">Drive</option></select></label>
                    <button type="button" disabled={courseForm.modules.length === 1} onClick={() => setCourseForm((current) => ({ ...current, modules: current.modules.filter((_, itemIndex) => itemIndex !== index) }))} aria-label="Remove module" className="flex h-10 w-10 items-center justify-center rounded-lg text-rose-300 transition-colors hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-30"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => setCourseForm((current) => ({ ...current, modules: [...current.modules, { title: '', videoUrl: '', type: 'youtube' }] }))} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/[0.1] px-3 text-xs font-medium text-gray-300 transition-colors hover:border-amber-300/30 hover:text-amber-200"><Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add module</button>
              </fieldset>

              <footer className="flex flex-col-reverse gap-2 border-t border-white/[0.08] pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeCourseModal} className="min-h-10 rounded-lg border border-white/[0.1] px-4 text-sm font-medium text-gray-300 transition-colors hover:bg-white/[0.05]">Cancel</button>
                <button type="submit" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 text-sm font-bold text-black transition-colors hover:bg-amber-200"><Save className="h-4 w-4" aria-hidden="true" /> Save course</button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
