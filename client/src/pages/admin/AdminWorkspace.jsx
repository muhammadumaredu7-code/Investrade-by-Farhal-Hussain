import {
  ArrowUpRight,
  BarChart3,
  Bot,
  ClipboardList,
  Crown,
  GraduationCap,
  LayoutDashboard,
  Package,
  ShieldAlert,
  ShieldCheck,
  Settings,
  Users,
  Zap
} from 'lucide-react';
import { useUser } from '@clerk/react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/adminSiderbar.jsx';
import dummyData from '../../assets/dummyData.json';
import AdminUsers from './AdminUsers.jsx';
import AdminVipManagement from './AdminVipManagement.jsx';
import AdminSignals from './AdminSignals.jsx';
import AdminCourses from './AdminCourses.jsx';
import AdminProducts from './AdminProducts.jsx';
import AdminAccountRequests from './AdminAccountRequests.jsx';
import AdminAnalytics from './AdminAnalytics.jsx';

const sectionVisuals = {
  LayoutDashboard: { Icon: LayoutDashboard, color: 'text-cyan-300', surface: 'border-cyan-300/20 bg-cyan-400/10 group-hover:bg-cyan-400/20' },
  Users: { Icon: Users, color: 'text-sky-300', surface: 'border-sky-300/20 bg-sky-400/10 group-hover:bg-sky-400/20' },
  Crown: { Icon: Crown, color: 'text-amber-300', surface: 'border-amber-300/20 bg-amber-400/10 group-hover:bg-amber-400/20' },
  Zap: { Icon: Zap, color: 'text-orange-300', surface: 'border-orange-300/20 bg-orange-400/10 group-hover:bg-orange-400/20' },
  GraduationCap: { Icon: GraduationCap, color: 'text-blue-300', surface: 'border-blue-300/20 bg-blue-400/10 group-hover:bg-blue-400/20' },
  Bot: { Icon: Bot, color: 'text-teal-300', surface: 'border-teal-300/20 bg-teal-400/10 group-hover:bg-teal-400/20' },
  Package: { Icon: Package, color: 'text-violet-300', surface: 'border-violet-300/20 bg-violet-400/10 group-hover:bg-violet-400/20' },
  ClipboardList: { Icon: ClipboardList, color: 'text-cyan-300', surface: 'border-cyan-300/20 bg-cyan-400/10 group-hover:bg-cyan-400/20' },
  BarChart3: { Icon: BarChart3, color: 'text-emerald-300', surface: 'border-emerald-300/20 bg-emerald-400/10 group-hover:bg-emerald-400/20' },
  ShieldAlert: { Icon: ShieldAlert, color: 'text-rose-300', surface: 'border-rose-300/20 bg-rose-400/10 group-hover:bg-rose-400/20' },
  Settings: { Icon: Settings, color: 'text-slate-300', surface: 'border-slate-300/20 bg-slate-400/10 group-hover:bg-slate-400/20' }
};

const getSectionVisual = (iconName) => sectionVisuals[iconName] || sectionVisuals.LayoutDashboard;

const AdminWorkspace = () => {
  const location = useLocation();
  const { isLoaded, isSignedIn, user } = useUser();
  const navigation = dummyData.adminSidebar.navigation;
  const activeItem = navigation.find((item) => item.path === location.pathname);
  const isDevelopmentMode = import.meta.env.DEV;

  if (!isDevelopmentMode) {
    if (!isLoaded) return null;
    if (!isSignedIn || user?.publicMetadata?.role !== 'admin') return <Navigate to="/home" replace />;
  }
  if (!activeItem) return <Navigate to="/admin/dashboard" replace />;
  if (activeItem.path === '/admin/users') return <AdminUsers />;
  if (activeItem.path === '/admin/vip-approvals') return <AdminVipManagement />;
  if (activeItem.path === '/admin/signals') return <AdminSignals />;
  if (activeItem.path === '/admin/content') return <AdminCourses />;
  if (activeItem.path === '/admin/products') return <AdminProducts />;
  if (activeItem.path === '/admin/account-requests') return <AdminAccountRequests />;
  if (activeItem.path === '/admin/analytics') return <AdminAnalytics />;

  const isDashboard = activeItem.path === '/admin/dashboard';
  const ActiveIcon = getSectionVisual(activeItem.icon).Icon;

  return (
    <div className="min-h-screen bg-[#050806] text-white selection:bg-amber-400 selection:text-black">
      <AdminSidebar />
      <main className="admin-workspace-enter min-h-screen px-4 pb-8 pt-20 sm:px-8 sm:pb-10 sm:pt-8 lg:pl-[19rem] lg:pr-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-7 flex flex-col gap-5 border-b border-white/[0.08] pb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <span className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${getSectionVisual(activeItem.icon).surface} ${getSectionVisual(activeItem.icon).color}`}>
                <ActiveIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/80">
                  Investrade <span className="px-1 text-gray-600">/</span> Administration
                </p>
                <h1 className="break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {activeItem.label}
                </h1>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-gray-400">
                  {isDashboard ? 'Welcome back. Your administrative workspace is ready.' : `Manage ${activeItem.label.toLowerCase()} from this workspace.`}
                </p>
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-amber-300/20 bg-amber-300/[0.06] px-3 py-2 text-xs font-semibold text-amber-200">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Administrator access
            </div>
          </header>

          {isDashboard ? (
            <section aria-labelledby="admin-sections-heading">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 id="admin-sections-heading" className="text-base font-semibold text-white">Admin sections</h2>
                  <p className="mt-1 text-xs text-gray-500">Choose an area to manage.</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {navigation.filter((item) => item.path !== activeItem.path).map((item, index) => {
                  const { Icon, color, surface } = getSectionVisual(item.icon);

                  return (
                  <Link
                    key={item.id}
                    to={item.path}
                    style={{ animationDelay: `${index * 45}ms` }}
                    className="admin-workspace-enter group flex min-h-24 items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-amber-300/25 hover:bg-white/[0.045] hover:shadow-[0_14px_32px_rgba(0,0,0,0.24)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50 sm:min-h-28 sm:p-5"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-110 ${surface} ${color}`}>
                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-semibold leading-snug text-gray-200 transition-colors group-hover:text-white">{item.label}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-600 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-200" aria-hidden="true" />
                  </Link>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="admin-workspace-enter flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] px-5 py-10 text-center sm:px-8 sm:py-12">
              <span className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border transition-transform duration-300 hover:rotate-3 hover:scale-105 ${getSectionVisual(activeItem.icon).surface} ${getSectionVisual(activeItem.icon).color}`}>
                <ActiveIcon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="text-base font-semibold text-white sm:text-lg">No records to display</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-400">
                {activeItem.label} is connected to the admin navigation. No data is available in this section yet.
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminWorkspace;