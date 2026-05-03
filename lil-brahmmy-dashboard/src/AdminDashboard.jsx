import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import { 
  Users, ShieldAlert, Clock, Trash2, 
  CheckCircle, XCircle, LogOut, ShieldCheck 
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Verification'); 
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3001/admin/all-users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleLogout = () => {
    // Clear any session data if you have it
    localStorage.removeItem('userRole'); 
    navigate('/'); // Redirect to your main login page
  };

  const handleUpdateStatus = async (userId, status) => {
    let reason = status === 'declined' ? prompt("Reason for decline:") : null;
    if (status === 'declined' && !reason) return;

    await fetch('http://localhost:3001/admin/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, status, reason })
    });
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Permanently remove this teacher from the system?")) {
      await fetch(`http://localhost:3001/admin/delete-user/${userId}`, { method: 'DELETE' });
      fetchUsers();
    }
  };

  const pending = users.filter(u => u.status === 'pending' && u.role !== 'admin');
  const approved = users.filter(u => u.status === 'approved' && u.role !== 'admin');
  const history = users.filter(u => (u.status === 'approved' || u.status === 'declined') && u.role !== 'admin');

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar - Matches Teacher Dashboard Sidebar Design */}
      <nav className="w-64 bg-[#800000] p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
            <span className="text-[#800000] font-bold text-xl">★</span>
          </div>
          <span className="text-white font-black italic text-xl tracking-tighter">LIL BRAHMMY</span>
        </div>

        <ul className="space-y-2 flex-1">
          <li onClick={() => setActiveTab('Verification')}
            className={`p-3 rounded-xl flex items-center gap-3 font-bold cursor-pointer transition-all ${activeTab === 'Verification' ? 'bg-yellow-500 text-[#800000]' : 'text-white/70 hover:bg-white/10'}`}>
            <ShieldAlert size={20} /> Verification
          </li>
          <li onClick={() => setActiveTab('Management')}
            className={`p-3 rounded-xl flex items-center gap-3 font-bold cursor-pointer transition-all ${activeTab === 'Management' ? 'bg-yellow-500 text-[#800000]' : 'text-white/70 hover:bg-white/10'}`}>
            <Users size={20} /> Teacher Management
          </li>
          <li onClick={() => setActiveTab('History')}
            className={`p-3 rounded-xl flex items-center gap-3 font-bold cursor-pointer transition-all ${activeTab === 'History' ? 'bg-yellow-500 text-[#800000]' : 'text-white/70 hover:bg-white/10'}`}>
            <Clock size={20} /> Action Logs
          </li>
        </ul>

        {/* Updated Sign Out Button */}
        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 text-white/70 font-bold p-3 hover:text-white transition-all hover:bg-white/10 rounded-xl"
        >
          <LogOut size={20} /> SIGN OUT
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 bg-white overflow-y-auto">
        <header className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-2xl font-black uppercase italic text-[#800000]">Admin Panel</h1>
          
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
            <div className="w-12 h-12 bg-[#800000] rounded-full flex items-center justify-center text-yellow-500 font-bold text-xl">
              SA
            </div>
            <div>
              <p className="font-black text-gray-800 leading-none mb-1">System Admin</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: ADMIN-01</p>
              <span className="text-[9px] bg-red-100 text-[#800000] px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">Admin Account</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Views remain the same as previous design */}
          {activeTab === 'Verification' && (
            <div>
              <h2 className="text-[#800000] font-black italic uppercase mb-6">Teacher Verification</h2>
              {pending.length > 0 ? (
                <div className="space-y-4">
                  {pending.map(u => (
                    <div key={u.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-6">
                      <div className="w-24 h-16 bg-gray-200 rounded-xl overflow-hidden border border-gray-100">
                        <img src={`http://localhost:3001/uploads/${u.proof_image}`} className="w-full h-full object-cover" alt="ID" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-gray-800 text-lg italic">{u.full_name}</p>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{u.faculty_id} • {u.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdateStatus(u.id, 'approved')} className="p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all"><CheckCircle /></button>
                        <button onClick={() => handleUpdateStatus(u.id, 'declined')} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><XCircle /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic font-medium py-10 text-center">All caught up! No pending teachers.</p>
              )}
            </div>
          )}

          {activeTab === 'Management' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {approved.map(u => (
                    <div key={u.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-[#800000]">{u.full_name.charAt(0)}</div>
                            <div>
                                <p className="font-black text-gray-800 italic">{u.full_name}</p>
                                <p className="text-gray-400 text-[10px] font-bold uppercase">{u.faculty_id}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDeleteUser(u.id)} className="p-3 text-red-300 hover:bg-red-600 hover:text-white rounded-xl transition-all"><Trash2 size={20} /></button>
                    </div>
                ))}
             </div>
          )}

          {activeTab === 'History' && (
             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400">
                        <tr>
                            <th className="p-6">Teacher</th>
                            <th className="p-6">Decision</th>
                            <th className="p-6">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {history.map(u => (
                            <tr key={u.id} className="text-sm font-bold">
                                <td className="p-6 text-gray-800">{u.full_name}</td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="p-6 text-gray-400 italic text-xs">{u.decline_reason || 'Identity Confirmed'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;