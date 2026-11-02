import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Edit3,
  ExternalLink,
  Filter,
  Info,
  Mail,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

import AdminSidebar from '../../components/admin/adminSiderbar.jsx';
import { useAppContext } from '../../context/AppContext';

const statusOptions = [
  { value: 'PENDING', label: 'Pending', classes: 'border-amber-300/20 bg-amber-300/10 text-amber-200' },
  { value: 'REVIEWING', label: 'Reviewing', classes: 'border-sky-300/20 bg-sky-300/10 text-sky-200' },
  { value: 'APPROVED', label: 'Approved', classes: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200' },
  { value: 'REJECTED', label: 'Rejected', classes: 'border-rose-300/20 bg-rose-300/10 text-rose-200' }
];

const marketOptions = [
  { id: 'psx', label: 'PSX', name: 'Pakistan Stock Exchange (PSX)', accountTypes: ['PSX Saahulat', 'PSX Normal / Standard'] },
  { id: 'forex', label: 'Forex', name: 'FOREX MARKETS', accountTypes: ['Forex trading account'] },
  { id: 'pmex', label: 'PMEX', name: 'PMEX (Pakistan Mercantile Exchange)', accountTypes: ['PMEX trading account'] }
];

const emptyRequestForm = {
  marketId: 'forex',
  accountType: 'Forex trading account',
  fullName: '',
  email: '',
  phone: '',
  occupation: '',
  message: '',
  status: 'PENDING'
};

const formatSubmittedAt = (value) => {
  const submittedAt = new Date(value);
  return Number.isNaN(submittedAt.getTime())
    ? 'Date unavailable'
    : submittedAt.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const AdminAccountRequests = () => {
  const {
    accountRequests,
    addAccountRequest,
    updateAccountRequest,
    updateAccountRequestStatus,
    deleteAccountRequest
  } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [marketFilter, setMarketFilter] = useState('ALL');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [requestForm, setRequestForm] = useState(emptyRequestForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pendingCount = accountRequests.filter((request) => request.status === 'PENDING').length;
  const reviewingCount = accountRequests.filter((request) => request.status === 'REVIEWING').length;
  const connectedSources = new Set(accountRequests.map((request) => request.source).filter(Boolean)).size;

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return accountRequests.filter((request) => {
      const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter;
      const matchesMarket = marketFilter === 'ALL' || request.marketId === marketFilter;
      const searchableContent = [
        request.fullName,
        request.email,
        request.phone,
        request.market,
        request.accountType,
        request.occupation,
        request.source
      ].filter(Boolean).join(' ').toLowerCase();
      return matchesStatus && matchesMarket && (!normalizedSearch || searchableContent.includes(normalizedSearch));
    }).sort((first, second) => new Date(second.requestedAt) - new Date(first.requestedAt));
  }, [accountRequests, marketFilter, searchTerm, statusFilter]);

  const openCreateModal = () => {
    setEditingRequest(null);
    setRequestForm(emptyRequestForm);
    setRequestModalOpen(true);
  };

  const openEditModal = (request) => {
    setEditingRequest(request);
    setRequestForm({
      marketId: request.marketId || 'forex',
      accountType: request.accountType || 'Forex trading account',
      fullName: request.fullName || '',
      email: request.email || '',
      phone: request.phone || '',
      occupation: request.occupation || '',
      message: request.message || '',
      status: request.status || 'PENDING'
    });
    setRequestModalOpen(true);
  };

  const handleMarketChange = (marketId) => {
    const market = marketOptions.find((option) => option.id === marketId) || marketOptions[0];
    setRequestForm((current) => ({
      ...current,
      marketId,
      accountType: market.accountTypes[0]
    }));
  };

  const handleRequestSave = (event) => {
    event.preventDefault();
    const market = marketOptions.find((option) => option.id === requestForm.marketId);
    if (!market) {
      toast.error('Select a valid account market.');
      return;
    }

    const details = editingRequest?.marketId === market.id
      ? { ...editingRequest.details }
      : undefined;
    if (details?.applicant) {
      details.applicant = {
        ...details.applicant,
        'Full name': requestForm.fullName.trim(),
        Email: requestForm.email.trim(),
        Mobile: requestForm.phone.trim(),
        Occupation: requestForm.occupation.trim() || details.applicant.Occupation
      };
    }
    if (details?.contact) {
      details.contact = {
        ...details.contact,
        'Full name': requestForm.fullName.trim(),
        Email: requestForm.email.trim(),
        Phone: requestForm.phone.trim(),
        Request: requestForm.message.trim()
      };
    }

    const requestData = {
      market: market.name,
      marketId: market.id,
      accountType: requestForm.accountType,
      fullName: requestForm.fullName.trim(),
      email: requestForm.email.trim(),
      phone: requestForm.phone.trim(),
      occupation: requestForm.occupation.trim(),
      message: requestForm.message.trim(),
      source: editingRequest?.source || 'Admin-created request',
      details
    };

    try {
      if (editingRequest) {
        updateAccountRequest(editingRequest.id, { ...requestData, status: requestForm.status });
        toast.success('Account request updated.');
      } else {
        addAccountRequest({ ...requestData, status: requestForm.status });
        toast.success('Account request created.');
      }
      setRequestModalOpen(false);
      setEditingRequest(null);
    } catch (error) {
      console.error('Unable to save account request.', error);
      toast.error('Request could not be saved. Please try again.');
    }
  };

  const handleStatusChange = (requestId, status) => {
    try {
      updateAccountRequestStatus(requestId, status);
      toast.success('Request status updated.');
    } catch (error) {
      console.error('Unable to update account request status.', error);
      toast.error('Status could not be saved. Please try again.');
    }
  };

  const handleDeleteRequest = () => {
    if (!deleteTarget) return;
    try {
      deleteAccountRequest(deleteTarget.id);
      toast.success('Account request deleted.');
      setDeleteTarget(null);
    } catch (error) {
      console.error('Unable to delete account request.', error);
      toast.error('Request could not be deleted. Please try again.');
    }
  };

  const overview = [
    { label: 'Requests received', value: accountRequests.length, icon: ClipboardList, color: 'text-cyan-200 bg-cyan-300/10 border-cyan-300/15' },
    { label: 'Pending review', value: pendingCount, icon: Building2, color: 'text-amber-200 bg-amber-300/10 border-amber-300/15' },
    { label: 'In review', value: reviewingCount, icon: CheckCircle2, color: 'text-sky-200 bg-sky-300/10 border-sky-300/15' },
    { label: 'Connected sources', value: connectedSources, icon: ExternalLink, color: 'text-violet-200 bg-violet-300/10 border-violet-300/15' }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070b09] text-white selection:bg-amber-300 selection:text-black">
      <AdminSidebar />

      <main className="relative z-10 min-h-screen space-y-6 px-4 pb-10 pt-20 sm:space-y-8 sm:px-6 lg:ml-72 lg:px-8 lg:pt-8">
        <div className="pointer-events-none absolute -right-20 top-8 h-72 w-72 rounded-full bg-cyan-400/[0.07] blur-[110px]" />

        <header className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-[#101d20] via-[#10151a] to-[#12131a] p-5 shadow-2xl sm:p-8">
          <div className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full bg-cyan-300/[0.07] blur-3xl" />
          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="min-w-0 space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-200 sm:text-xs">
                <ClipboardList className="h-4 w-4" />
                Client onboarding
              </span>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Account Requests
                </h1>
                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-gray-300 sm:text-sm">
                  Review account applications, contact clients, and keep onboarding status up to date.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-3 text-xs font-semibold text-emerald-200">
                <ShieldCheck className="h-4 w-4" />
                Admin workspace
              </span>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-xs font-extrabold text-[#07100b] transition hover:bg-cyan-200"
              >
                <Plus className="h-4 w-4" />
                Add request
              </button>
            </div>
          </div>
        </header>

        <section aria-label="Account request overview" className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {overview.map(({ label, value, icon: Icon, color }) => (
            <article key={label} className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#101713]/90 p-3 shadow-lg sm:gap-4 sm:p-5">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border sm:h-11 sm:w-11 ${color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xl font-black text-white sm:text-2xl">{value}</p>
                <p className="text-[10px] leading-tight text-gray-400 sm:text-xs">{label}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="space-y-5 rounded-2xl border border-white/[0.08] bg-[#101713]/90 p-4 shadow-xl sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Applications</h2>
              <p className="mt-1 text-xs text-gray-400">
                {filteredRequests.length} of {accountRequests.length} request{accountRequests.length === 1 ? '' : 's'}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_160px_160px]">
              <label className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search client or account..."
                  aria-label="Search account requests"
                  className="w-full rounded-xl border border-white/10 bg-[#080d0a] py-2.5 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-300/40"
                />
              </label>
              <label className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter account requests by status"
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#080d0a] py-2.5 pl-9 pr-3 text-xs text-white outline-none transition focus:border-cyan-300/40"
                >
                  <option value="ALL">All statuses</option>
                  {statusOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <select
                  value={marketFilter}
                  onChange={(event) => setMarketFilter(event.target.value)}
                  aria-label="Filter account requests by market"
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#080d0a] py-2.5 pl-9 pr-3 text-xs text-white outline-none transition focus:border-cyan-300/40"
                >
                  <option value="ALL">All markets</option>
                  {marketOptions.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-amber-300/15 bg-amber-300/[0.05] p-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
            <p className="text-xs leading-relaxed text-gray-300">
              Requests are stored only in this browser tab session for the demo. Sensitive identity, bank, nominee, and uploaded document data are not stored in this list.
            </p>
          </div>

          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {filteredRequests.map((request) => {
                const currentStatus = statusOptions.find(({ value }) => value === request.status) || statusOptions[0];
                return (
                  <article key={request.id} className="min-w-0 space-y-4 rounded-2xl border border-white/[0.08] bg-[#090f0b] p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-200">
                          <UserRound className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="break-words font-bold text-white">{request.fullName || 'Client name unavailable'}</h3>
                              {request.isDemo && (
                                <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-violet-200">
                                  Demo data
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-gray-400">{request.accountType || request.market}</p>
                        </div>
                      </div>
                      <span className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${currentStatus.classes}`}>
                        {currentStatus.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs sm:grid-cols-2">
                      <p className="flex min-w-0 items-center gap-2 text-gray-300">
                        <Building2 className="h-4 w-4 shrink-0 text-cyan-200" />
                        <span className="truncate">{request.market || 'Market not specified'}</span>
                      </p>
                      <p className="flex min-w-0 items-center gap-2 text-gray-400">
                        <CalendarDays className="h-4 w-4 shrink-0 text-gray-500" />
                        <span>{formatSubmittedAt(request.requestedAt)}</span>
                      </p>
                      <a href={`mailto:${request.email}`} className="flex min-w-0 items-center gap-2 text-gray-300 transition hover:text-cyan-200">
                        <Mail className="h-4 w-4 shrink-0 text-cyan-200" />
                        <span className="truncate">{request.email || 'Email not provided'}</span>
                      </a>
                      <a href={`tel:${request.phone}`} className="flex min-w-0 items-center gap-2 text-gray-300 transition hover:text-cyan-200">
                        <Phone className="h-4 w-4 shrink-0 text-cyan-200" />
                        <span className="truncate">{request.phone || 'Phone not provided'}</span>
                      </a>
                      {request.occupation && (
                        <p className="text-gray-400 sm:col-span-2">
                          <span className="text-gray-500">Occupation:</span> {request.occupation}
                        </p>
                      )}
                    </div>

                    {request.message && (
                      <p className="rounded-xl border border-white/[0.06] px-3 py-2.5 text-xs leading-relaxed text-gray-300">
                        {request.message}
                      </p>
                    )}

                    {request.details && (
                      <details className="group rounded-xl border border-cyan-300/10 bg-cyan-300/[0.03]">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-xs font-semibold text-cyan-100 marker:hidden">
                          <span>View full application details</span>
                          <span className="text-[10px] font-medium text-gray-500 group-open:hidden">
                            {request.details.documents?.length || 0} document entries
                          </span>
                          <span className="hidden text-[10px] font-medium text-gray-500 group-open:inline">Hide details</span>
                        </summary>
                        <div className="space-y-4 border-t border-white/[0.06] p-3 sm:p-4">
                          {Object.entries(request.details)
                            .filter(([section]) => section !== 'documents')
                            .map(([section, fields]) => (
                              <section key={section}>
                                <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                  {section === 'applicant' ? 'Applicant details' : section === 'nominee' ? 'Nominee details' : 'Request details'}
                                </h4>
                                <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                  {Object.entries(fields).map(([label, value]) => (
                                    <div key={label} className="min-w-0 rounded-lg border border-white/[0.05] bg-black/20 px-3 py-2">
                                      <dt className="text-[10px] text-gray-500">{label}</dt>
                                      <dd className="mt-0.5 break-words text-xs text-gray-200">{value || 'Not provided'}</dd>
                                    </div>
                                  ))}
                                </dl>
                              </section>
                            ))}
                          {request.details.documents?.length > 0 && (
                            <section>
                              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Document checklist</h4>
                              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {request.details.documents.map((document) => (
                                  <li key={document.label} className="flex min-w-0 items-start justify-between gap-3 rounded-lg border border-white/[0.05] bg-black/20 px-3 py-2 text-xs">
                                    <span className="text-gray-300">{document.label}</span>
                                    <span className="shrink-0 text-right text-[10px] text-amber-200">{document.status}</span>
                                  </li>
                                ))}
                              </ul>
                            </section>
                          )}
                          {request.isDemo && (
                            <p className="rounded-lg border border-violet-300/10 bg-violet-300/[0.04] px-3 py-2 text-[10px] leading-relaxed text-violet-100/80">
                              Demo-only sample values. No actual identity, banking, nominee, or uploaded file data is included.
                            </p>
                          )}
                        </div>
                      </details>
                    )}

                    <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-[10px] text-gray-500">Source: {request.source || 'Account opening'}</span>
                        <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          Status
                          <select
                            value={request.status || 'PENDING'}
                            onChange={(event) => handleStatusChange(request.id, event.target.value)}
                            aria-label={`Update status for ${request.fullName || 'account request'}`}
                            className="rounded-lg border border-white/10 bg-[#101713] px-2.5 py-2 text-xs font-semibold normal-case tracking-normal text-white outline-none focus:border-cyan-300/40"
                          >
                            {statusOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                          </select>
                        </label>
                      </div>
                      <div className="flex gap-2 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => openEditModal(request)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/15 sm:flex-none"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(request)}
                          aria-label={`Delete ${request.fullName || 'account request'}`}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-300/15 bg-rose-300/[0.05] px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-300/15 sm:flex-none"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mx-auto flex max-w-2xl flex-col items-center py-8 text-center sm:py-10">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-200">
                <ClipboardList className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-white">
                {accountRequests.length ? 'No matching requests' : 'No account requests yet'}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {accountRequests.length
                  ? 'Try changing your search or status filter.'
                  : 'New Forex, PMEX, and PSX applications will appear here after submission.'}
              </p>
              {!accountRequests.length && (
                <Link
                  to="/account-opening"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-gray-200 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.07] hover:text-cyan-100"
                >
                  View client account-opening page
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </section>
      </main>

      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleRequestSave}
            className="my-auto max-h-[92vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-3xl border border-cyan-300/15 bg-[#0b120e] p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                  {editingRequest ? 'Manage application' : 'Manual intake'}
                </span>
                <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                  {editingRequest ? 'Edit account request' : 'Create account request'}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">
                  Add or update client contact and account details. Do not enter CNIC, bank, or document data.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                aria-label="Close request form"
                className="rounded-xl border border-white/10 p-2 text-gray-400 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs font-semibold text-gray-300">
                Market
                <select
                  required
                  value={requestForm.marketId}
                  onChange={(event) => handleMarketChange(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                >
                  {marketOptions.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
                </select>
              </label>
              <label className="space-y-1.5 text-xs font-semibold text-gray-300">
                Account type
                <select
                  required
                  value={requestForm.accountType}
                  onChange={(event) => setRequestForm({ ...requestForm, accountType: event.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                >
                  {(marketOptions.find(({ id }) => id === requestForm.marketId)?.accountTypes || []).map((accountType) => (
                    <option key={accountType} value={accountType}>{accountType}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5 text-xs font-semibold text-gray-300 sm:col-span-2">
                Client full name
                <input
                  required
                  autoComplete="name"
                  value={requestForm.fullName}
                  onChange={(event) => setRequestForm({ ...requestForm, fullName: event.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                />
              </label>
              <label className="space-y-1.5 text-xs font-semibold text-gray-300">
                Email address
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={requestForm.email}
                  onChange={(event) => setRequestForm({ ...requestForm, email: event.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                />
              </label>
              <label className="space-y-1.5 text-xs font-semibold text-gray-300">
                Phone number
                <input
                  required
                  type="tel"
                  autoComplete="tel"
                  value={requestForm.phone}
                  onChange={(event) => setRequestForm({ ...requestForm, phone: event.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                />
              </label>
              {requestForm.marketId === 'psx' && (
                <label className="space-y-1.5 text-xs font-semibold text-gray-300 sm:col-span-2">
                  Occupation
                  <select
                    value={requestForm.occupation}
                    onChange={(event) => setRequestForm({ ...requestForm, occupation: event.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                  >
                    <option value="">Not specified</option>
                    <option value="Student / Household">Student / Household</option>
                    <option value="Employee / Salaried">Employee / Salaried</option>
                    <option value="Business / Owner">Business / Owner</option>
                  </select>
                </label>
              )}
              <label className="space-y-1.5 text-xs font-semibold text-gray-300 sm:col-span-2">
                Client request / notes <span className="font-normal text-gray-500">(optional)</span>
                <textarea
                  rows="3"
                  value={requestForm.message}
                  onChange={(event) => setRequestForm({ ...requestForm, message: event.target.value })}
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#080d0a] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                />
              </label>
              <label className="space-y-1.5 text-xs font-semibold text-gray-300 sm:col-span-2">
                Review status
                <select
                  value={requestForm.status}
                  onChange={(event) => setRequestForm({ ...requestForm, status: event.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#080d0a] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40 sm:max-w-xs"
                >
                  {statusOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-gray-300 transition hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-xs font-extrabold text-[#07100b] transition hover:bg-cyan-200"
              >
                {editingRequest ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingRequest ? 'Save changes' : 'Create request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-5 rounded-2xl border border-rose-300/15 bg-[#0b120e] p-5 shadow-2xl sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-300/15 bg-rose-300/[0.08] text-rose-200">
                <Trash2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-bold text-white">Delete account request?</h2>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">
                  This will permanently remove the request for {deleteTarget.fullName || 'this client'} from this browser session.
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-gray-300 transition hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteRequest}
                className="rounded-xl bg-rose-400 px-4 py-2.5 text-xs font-extrabold text-[#190708] transition hover:bg-rose-300"
              >
                Delete request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccountRequests;
