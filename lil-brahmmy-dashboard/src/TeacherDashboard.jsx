import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for redirection
import { 
  LayoutDashboard, BookOpen, BrainCircuit, Users, Settings, 
  Search, Bell, Sparkles, LogOut, Lock, User, Mail, ShieldCheck, XCircle, CheckCircle, Image as ImageIcon
} from 'lucide-react';
import { LOGIN_BG_URL } from './DashboardConstants';
import { DashboardHome, VaultView, QuizLabView } from './DashboardComponents';

const TeacherDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (isLoggedIn && currentUser?.role === 'admin') {
      fetchPendingUsers();
    }
  }, [isLoggedIn, currentUser]);

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch('http://localhost:3001/admin/pending');
      const data = await res.json();
      setPendingUsers(data);
    } catch (err) { console.error("Error fetching users:", err); }
  };

  const handleUserStatus = async (userId, status) => {
    let reason = null;
    if (status === 'declined') {
      reason = prompt("Please provide a reason for declining this user:");
      if (!reason) return; 
    }

    await fetch('http://localhost:3001/admin/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, status, reason })
    });
    fetchPendingUsers();
  };

  const LoginView = () => {
    const [view, setView] = useState('login');
    const [formData, setFormData] = useState({ id: '', email: '', password: '', name: '', proof: null });

const handleAuth = async (e) => {
  e.preventDefault();
  const endpoint = view === 'register' ? 'register' : 'login';
  
  try {
    let body;
    let headers = {};

    if (view === 'register') {
      // Create FormData
      body = new FormData();
      body.append('id', formData.id);
      body.append('name', formData.name);
      body.append('email', formData.email);
      body.append('password', formData.password);
      
      // Safety check for the image
      if (formData.proof) {
        body.append('proof_image', formData.proof);
      } else {
        alert("Please select an ID proof image first.");
        return;
      }

      // DEBUG: View what is being sent in the console
      for (let pair of body.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
    } else {
      headers = { 'Content-Type': 'application/json' };
      body = JSON.stringify({ id: formData.id, password: formData.password });
    }

    const response = await fetch(`http://localhost:3001/${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: body
    });
    
    const data = await response.json();

    if (view === 'register') {
      if (response.ok) {
        alert("Registration Successful! Please wait for Admin approval.");
        setView('login');
      } else {
        alert(data.error || "Registration failed");
      }
    } else {
      if (data.success) {
        if (data.user.role === 'admin') {
          navigate('/admin-dash');
        } else {
          setCurrentUser(data.user);
          setIsLoggedIn(true);
        }
      } else {
        alert(data.message || "Invalid Login");
      }
    }
  } catch (err) {
    console.error("Auth Error:", err);
    alert("Connection Error! Is your server running?");
  }
};  

    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative"
        style={{ backgroundImage: `url('${LOGIN_BG_URL}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-[#800000]/40 backdrop-blur-[2px]"></div>
        <div className="bg-white/95 w-full max-w-md rounded-[40px] shadow-2xl p-10 relative z-10">
          <div className="text-center mb-10">
            <div className="bg-yellow-400 size-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-[#800000]" />
            </div>
            <h2 className="text-3xl font-black text-[#800000] italic tracking-tighter uppercase">
              {view === 'login' ? 'Welcome Back' : view === 'register' ? 'Join Portal' : 'Reset Access'}
            </h2>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {view === 'register' && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-gray-400" size={20} />
                  <input type="text" placeholder="Full Name" required className="w-full bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl py-4 pl-12 pr-4 outline-none" 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
                  <input type="email" placeholder="University Email" required className="w-full bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl py-4 pl-12 pr-4 outline-none" 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </>
            )}
            
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400" size={20} />
              <input type="text" placeholder="Faculty ID" required className="w-full bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl py-4 pl-12 pr-4 outline-none" 
              onChange={(e) => setFormData({...formData, id: e.target.value})} />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input type="password" placeholder="Password" required className="w-full bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl py-4 pl-12 pr-4 outline-none" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>

            {view === 'register' && (
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Upload ID Proof (JPEG/PNG)</p>
                <input type="file" accept="image/*" required
                  onChange={(e) => setFormData({...formData, proof: e.target.files[0]})}
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#800000] file:text-yellow-400 cursor-pointer" />
              </div>
            )}

            <button type="submit" className="w-full bg-[#800000] text-yellow-400 py-4 rounded-2xl font-black uppercase shadow-xl hover:scale-[1.02] transition-all">
              {view === 'login' ? 'Sign In' : 'Submit Registration'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="text-xs font-black text-gray-400 uppercase underline decoration-yellow-400">
              {view === 'login' ? 'Create Account' : 'Back to Login'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) return <LoginView />;

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex font-sans text-gray-900">
      <aside className="w-64 bg-[#800000] p-8 flex flex-col justify-between shadow-2xl sticky top-0 h-screen z-30">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-yellow-400 p-2 rounded-xl"><Sparkles size={24} className="text-[#800000]" /></div>
            <span className="text-white font-black text-xl italic tracking-tighter uppercase">Lil Brahmmy</span>
          </div>
          <nav className="space-y-3">
            {[
              { label: 'Dashboard', icon: LayoutDashboard },
              { label: 'Course Vault', icon: BookOpen },
              { label: 'AI Quiz Lab', icon: BrainCircuit },
            ].map((item) => (
              <div key={item.label} onClick={() => setActiveTab(item.label)} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${activeTab === item.label ? 'bg-yellow-400 text-[#800000] font-black shadow-xl' : 'text-red-100 hover:bg-red-900'}`}>
                <item.icon size={20} /> <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </nav>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-900/40 text-red-200 font-bold hover:bg-red-900 transition-all border border-red-800/50">
          <LogOut size={18} /> <span className="text-sm italic uppercase tracking-tighter">Sign Out</span>
        </button>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md px-10 py-6 flex items-center justify-between border-b border-gray-100">
          <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">{activeTab}</h1>
        </header>

        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-10">
            <div className="xl:col-span-3">
              {activeTab === 'Dashboard' && <DashboardHome />}
              {activeTab === 'Course Vault' && <VaultView />}
              {activeTab === 'AI Quiz Lab' && <QuizLabView />}
            </div>
            
            <aside className="space-y-10">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center">
                <img src={`https://ui-avatars.com/api/?name=${currentUser?.full_name || 'User'}&background=800000&color=FFD700`} alt="Prof" className="size-28 rounded-full border-4 border-white shadow-2xl mx-auto mb-6" />
                <h4 className="text-xl font-black text-gray-900 leading-tight">{currentUser?.full_name}</h4>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {currentUser?.faculty_id}</p>
                <div className="mt-4 px-4 py-1 bg-red-50 text-[#800000] text-[10px] font-black uppercase rounded-full inline-block">
                  {currentUser?.role} Account
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;