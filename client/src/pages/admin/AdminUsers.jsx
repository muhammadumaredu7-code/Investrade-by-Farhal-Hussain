import { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  Search,
  ShieldAlert,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Phone,
  Edit,
  X,
  Save,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

import AdminSidebar from '../../components/admin/adminSiderbar.jsx';
import dummyData from '../../assets/dummyData.json';

const AdminUsers = () => {
  const data = dummyData.adminUserManagement;
  const [users, setUsers] = useState(() => data?.usersList || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL', 'Client', 'Admin', 'VIP Client'

  // Edit Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    role: 'Client',
    status: 'Active'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const triggerToast = (msg) => {
    toast.success(msg, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10140f',
        border: '1px solid rgba(251, 191, 36, 0.35)',
        borderRadius: '12px',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
        color: '#f3f4f6',
        fontSize: '13px',
        fontWeight: 600,
        padding: '12px 16px'
      },
      iconTheme: {
        primary: '#fbbf24',
        secondary: '#10140f'
      }
    });
  };

  // Toggle User Status (Active / Suspended)
  const toggleUserStatus = (id) => {
    const selectedUser = users.find((user) => user.id === id);
    if (!selectedUser) return;

    const nextStatus = selectedUser.status === 'Active' ? 'Suspended' : 'Active';
    setUsers((prev) => prev.map((user) => (
      user.id === id ? { ...user, status: nextStatus } : user
    )));
    triggerToast(`User ${selectedUser.name} status updated to ${nextStatus}`);
  };

  // Open Edit Modal
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      role: user.role,
      status: user.status
    });
  };

  // Save Edit Form
  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              name: editFormData.name,
              email: editFormData.email,
              phone: editFormData.phone,
              country: editFormData.country,
              role: editFormData.role,
              status: editFormData.status
            }
          : u
      )
    );

    triggerToast(`User "${editFormData.name}" updated successfully`);
    setEditingUser(null);
  };

  // Delete User Handler
  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete ${name}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      triggerToast(`User "${name}" deleted from records`);
    }
  };

  if (!data) return null;

  // Filter Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-[#020602] min-h-screen text-white flex selection:bg-amber-400 selection:text-black overflow-hidden relative">
      {/* ---------------- 1. ADMIN SIDEBAR ---------------- */}
      <AdminSidebar />

      {/* ---------------- 2. MAIN CONTENT AREA ---------------- */}
      <main className="flex-1 lg:ml-72 p-4 sm:p-8 pt-20 lg:pt-8 relative z-10 space-y-8 max-w-7xl">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-amber-400/20 via-yellow-500/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* ---------------- 3. PAGE HEADER ---------------- */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0e0c02] via-[#1c1800] to-[#0e0c02] border border-amber-400/35 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{data.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {data.heading}
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
              {data.subheading}
            </p>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-[#1c1800] border border-amber-400/30 text-amber-300 font-mono text-xs font-extrabold flex items-center gap-2 shrink-0">
            <UserCheck className="w-4 h-4" />
            <span>Total Users: {users.length}</span>
          </div>
        </div>

        {/* ---------------- 4. SEARCH & ROLE FILTER BAR ---------------- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#080702]/90 border border-amber-400/30 shadow-xl backdrop-blur-xl">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121003] border border-amber-400/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'Client', 'VIP Client', 'Admin'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  roleFilter === role
                    ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                    : 'bg-[#121003] text-gray-300 hover:text-white border border-amber-400/20'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

        </div>

        {/* ---------------- 5. USERS DIRECTORY TABLE ---------------- */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080702]/90 border border-amber-400/30 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-amber-400/20 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              User Accounts Directory ({filteredUsers.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-amber-400/20 text-[11px] font-black uppercase text-gray-400">
                  <th className="py-3 px-4">User Profile</th>
                  <th className="py-3 px-4">Contact Parameters</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">System Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-400/10 text-xs">
                {filteredUsers.map((user) => {
                  const isAdmin = user.role === 'Admin';
                  const isActive = user.status === 'Active';

                  return (
                    <tr key={user.id} className="hover:bg-[#121003] transition-colors">
                      
                      {/* Avatar & Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400/40 shadow-md"
                          />
                          <div>
                            <div className="font-black text-white flex items-center gap-1.5">
                              {user.name}
                              {isAdmin && <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            </div>
                            <span className="text-[10px] text-amber-400 font-bold">{user.badge}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="text-gray-300 font-mono flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          {user.email}
                        </div>
                        <div className="text-gray-400 font-mono text-[11px] flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          {user.phone}
                        </div>
                      </td>

                      {/* Country */}
                      <td className="py-4 px-4 font-extrabold text-white flex items-center gap-1.5 pt-6">
                        <span>{user.flag}</span>
                        <span>{user.country}</span>
                      </td>

                      {/* System Role */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                            isAdmin
                              ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                              : user.role === 'VIP Client'
                              ? 'bg-yellow-400/15 text-yellow-300 border-yellow-400/40'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-red-500/20 text-red-400 border-red-500/40'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* Action Buttons: EDIT & DELETE & TOGGLE */}
                      <td className="py-4 px-4 text-right space-x-2">
                        {/* Edit User Details */}
                        <button
                          onClick={() => handleEditClick(user)}
                          title="Edit User Details"
                          className="p-2 rounded-xl bg-[#121003] border border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-black transition-all cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Status Toggle */}
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          title="Toggle Status (Active/Suspended)"
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#121003] border-amber-400/30 text-amber-400 hover:bg-red-500/20 hover:text-red-400'
                              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          }`}
                        >
                          {isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          title="Delete User Account"
                          className="p-2 rounded-xl bg-[#121003] border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* ---------------- 6. EDIT USER MODAL ---------------- */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#080702] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 relative shadow-[0_0_50px_rgba(251,191,36,0.35)] animate-in fade-in duration-300">
            
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-amber-400/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-400" />
                Edit User: <span className="text-amber-300">{editingUser.name}</span>
              </h3>
              <p className="text-xs text-gray-400">Modify credentials, contact information, and security permissions.</p>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Country & Role Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Country *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.country}
                    onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                    className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">System Role *</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Client">Client</option>
                    <option value="VIP Client">VIP Client</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Account Status *</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Active">Active</option>
                  <option value="In-Active">In-Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-3 rounded-xl bg-[#121003] border border-amber-400/20 text-gray-300 text-xs font-bold hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 hover:bg-yellow-300 transition-all cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>Save User Changes</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;