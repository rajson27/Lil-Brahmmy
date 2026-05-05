import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, BrainCircuit, Users, LogOut, Lock, 
  User, Mail, XCircle, CheckCircle, ChevronLeft, Edit3, Plus,
  TrendingUp, Award, Clock
} from 'lucide-react';
import { LOGIN_BG_URL } from './DashboardConstants';
import { DashboardHome, MyClassesView, VaultView, QuizLabView } from './DashboardComponents';

const TeacherDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null); 
  // NEW STATE: Track the student being viewed for analytics
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [classList, setClassList] = useState([
    {
      grade: "Grade 1",
      sections: [
        { 
          name: "Section A", 
          status: "Active",
          roster: [
            { id: 101, name: "Marcus Phoenix", email: "m.phoenix@university.edu", performance: "Excellent" },
            { id: 102, name: "Sarah Connor", email: "s.connor@university.edu", performance: "Good" },
            { id: 103, name: "John Wick", email: "j.wick@university.edu", performance: "Average" },
          ]
        },
        { name: "Section B", status: "Active", roster: [] }
      ]
    },
    {
      grade: "Grade 2",
      sections: [{ name: "Section C", status: "Active", roster: [] }]
    },
    {
      grade: "Grade 3",
      sections: [{ name: "Section A", status: "Active", roster: [] }]
    }
  ]);

  const navigate = useNavigate();
  const UB_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/f/f1/UBlogo.png";

  useEffect(() => {
    setSelectedSection(null);
    setSelectedStudent(null);
  }, [activeTab]);

  const handleAddStudent = () => {
    const name = prompt("Enter Student Name:");
    if (!name) return;

    const email = prompt("Enter University Email:");
    if (!email) return;

    const newStudent = {
      id: Date.now(),
      name: name,
      email: email,
      performance: "Average"
    };

    const updatedClasses = classList.map(gradeGroup => {
      if (gradeGroup.grade === selectedSection.grade) {
        return {
          ...gradeGroup,
          sections: gradeGroup.sections.map(sec => {
            if (sec.name === selectedSection.name) {
              return { ...sec, roster: [...sec.roster, newStudent] };
            }
            return sec;
          })
        };
      }
      return gradeGroup;
    });

    setClassList(updatedClasses);
    setSelectedSection(prev => ({
      ...prev,
      roster: [...prev.roster, newStudent]
    }));
  };

  const LoginView = () => {
    const [view, setView] = useState('login');
    const [formData, setFormData] = useState({ id: '', email: '', password: '', name: '', proof: null });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleAuth = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const endpoint = view === 'register' ? 'register' : 'login';
      
      try {
        let body;
        let headers = {};

        if (view === 'register') {
          body = new FormData();
          body.append('id', formData.id);
          body.append('name', formData.name);
          body.append('email', formData.email);
          body.append('password', formData.password);
          if (formData.proof) {
            body.append('proof_image', formData.proof);
          } else {
            setMessage({ type: 'error', text: 'Please upload an ID proof image.' });
            setLoading(false);
            return;
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
            setMessage({ type: 'success', text: 'Registration Successful! Please wait for approval.' });
            setTimeout(() => setView('login'), 2000);
          } else {
            setMessage({ type: 'error', text: data.error || 'Registration failed.' });
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
            setMessage({ type: 'error', text: data.message || 'Invalid Credentials.' });
          }
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'System temporarily unavailable.' });
      } finally {
        setLoading(false);
      }
    };   

    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative font-sans"
        style={{ backgroundImage: `url('${LOGIN_BG_URL}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-[#800000]/40 backdrop-blur-[4px]"></div>
        <div className="bg-white/95 w-full max-w-md rounded-[40px] shadow-2xl p-10 relative z-10 border border-white/20">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img src={UB_LOGO_URL} alt="UB Logo" className="h-24 w-auto drop-shadow-md" />
            </div>
            <h2 className="text-3xl font-black text-[#800000] italic tracking-tighter uppercase leading-none">
              {view === 'login' ? 'Teacher Portal' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">University of Batangas</p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
              message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
            }`}>
              {message.type === 'error' ? <XCircle size={20}/> : <CheckCircle size={20}/>}
              <span className="text-xs font-bold uppercase italic tracking-tight">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {view === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-black uppercase ml-1 tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 text-gray-400" size={18} />
                    <input type="text" placeholder="Enter your full name" required 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-sm" 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-black uppercase ml-1 tracking-widest">University Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
                    <input type="email" placeholder="Enter your email" required 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-sm" 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
              </>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-black uppercase ml-1 tracking-widest">Faculty ID</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-gray-400" size={18} />
                <input type="text" placeholder="Enter your ID" required 
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-sm" 
                  onChange={(e) => setFormData({...formData, id: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-black uppercase ml-1 tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
                <input type="password" placeholder="Enter your password" required 
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-sm" 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>

            {view === 'register' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-black uppercase ml-1 tracking-widest">Identity Verification</label>
                <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  <p className="text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest text-center">Identity Verification (JPEG/PNG)</p>
                  <input type="file" accept="image/*" required
                    onChange={(e) => setFormData({...formData, proof: e.target.files[0]})}
                    className="text-[10px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-[#800000] file:text-yellow-400 cursor-pointer w-full" />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className={`w-full bg-[#800000] text-yellow-400 py-4 rounded-2xl font-black uppercase shadow-xl transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70' : 'hover:scale-[1.02] active:scale-[0.98]'}`}>
              {loading ? <div className="size-5 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" /> : (view === 'login' ? 'Sign In' : 'Register Now')}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <button onClick={() => { setView(view === 'login' ? 'register' : 'login'); setMessage({type:'', text:''}); }} 
              className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#800000] transition-colors">
              {view === 'login' ? "Don't have an account? Join" : "Already have an account? Login"}
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
          <div className="flex flex-col items-center gap-4 mb-14 border-b border-white/10 pb-8">
            <div className="bg-white p-2 size-20 rounded-[30px] shadow-lg flex items-center justify-center overflow-hidden">
              <img src={UB_LOGO_URL} alt="UB Seal" className="w-full h-full object-contain scale-110" />
            </div>
            <span className="text-white font-black text-2xl italic tracking-tighter uppercase text-center leading-none">
              Lil Brahmmy
            </span>
          </div>
          
          <nav className="space-y-3">
            {[
              { label: 'Dashboard', icon: LayoutDashboard },
              { label: 'My Classes', icon: Users },
              { label: 'Course Vault', icon: BookOpen },
              { label: 'AI Quiz Lab', icon: BrainCircuit },
            ].map((item) => (
              <div key={item.label} onClick={() => setActiveTab(item.label)} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${activeTab === item.label ? 'bg-yellow-400 text-[#800000] font-black shadow-xl' : 'text-red-100 hover:bg-red-900/50'}`}>
                <item.icon size={20} /> <span className="text-[15px]">{item.label}</span>
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
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs font-black uppercase text-gray-900 leading-none">{currentUser?.name || currentUser?.full_name || 'Professor'}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {currentUser?.id || currentUser?.faculty_id}</p>
             </div>
             <img src={`https://ui-avatars.com/api/?name=${currentUser?.name || currentUser?.full_name}&background=800000&color=FFD700`} className="size-10 rounded-xl border-2 border-white shadow-md" alt="Avatar"/>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-10">
            <div className="xl:col-span-3">
              {activeTab === 'Dashboard' && <DashboardHome />}
              {activeTab === 'Course Vault' && <VaultView />}
              {activeTab === 'AI Quiz Lab' && <QuizLabView />}
              
              {activeTab === 'My Classes' && (
                <div className="animate-in fade-in duration-500">
                  {selectedStudent ? (
                    /* --- STUDENT ANALYTICS VIEW --- */
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                       <button onClick={() => setSelectedStudent(null)} className="flex items-center gap-2 text-[#800000] font-black uppercase text-xs hover:underline">
                        <ChevronLeft size={16} /> Back to {selectedSection.name} Roster
                      </button>

                      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-8 mb-10">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${selectedStudent.name}&background=800000&color=FFD700`} 
                            className="size-24 rounded-[30px] shadow-xl border-4 border-white" 
                            alt="Student"
                          />
                          <div>
                            <h2 className="text-4xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">{selectedStudent.name}</h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">{selectedStudent.email} • {selectedSection.grade}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="p-8 bg-red-50 rounded-[35px] border border-red-100 group hover:bg-[#800000] transition-all">
                            <TrendingUp className="text-[#800000] mb-4 group-hover:text-yellow-400" size={24} />
                            <p className="text-[10px] font-black uppercase text-[#800000] mb-1 group-hover:text-red-200">Overall Performance</p>
                            <p className="text-2xl font-black text-gray-900 group-hover:text-white">{selectedStudent.performance}</p>
                          </div>
                          <div className="p-8 bg-yellow-50 rounded-[35px] border border-yellow-100">
                            <Award className="text-yellow-600 mb-4" size={24} />
                            <p className="text-[10px] font-black uppercase text-yellow-700 mb-1">Quiz Average</p>
                            <p className="text-2xl font-black text-gray-900">88.4%</p>
                          </div>
                          <div className="p-8 bg-gray-50 rounded-[35px] border border-gray-100">
                            <Clock className="text-gray-400 mb-4" size={24} />
                            <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Attendance</p>
                            <p className="text-2xl font-black text-gray-900">96%</p>
                          </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-gray-50">
                           <h4 className="font-black uppercase italic text-[#800000] text-sm mb-6 flex items-center gap-2">
                             <div className="w-8 h-[2px] bg-yellow-400"></div> Subject Analytics
                           </h4>
                           <div className="h-64 bg-gray-50 rounded-[40px] flex items-center justify-center border-2 border-dashed border-gray-200">
                              <p className="text-gray-300 font-black italic uppercase tracking-widest text-sm">Statistics Visualization Data Loading...</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedSection ? (
                    /* --- CLASS ROSTER VIEW --- */
                    <div className="space-y-8">
                      <button onClick={() => setSelectedSection(null)} className="flex items-center gap-2 text-[#800000] font-black uppercase text-xs hover:underline">
                        <ChevronLeft size={16} /> Back to Classes
                      </button>
                      <div className="flex justify-between items-end">
                        <div>
                          <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase">{selectedSection.name} Roster</h2>
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">{selectedSection.grade} • Active Students</p>
                        </div>
                        <button 
                          onClick={handleAddStudent}
                          className="bg-[#800000] text-yellow-400 px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                        >
                          <Plus size={18} /> Add Student
                        </button>
                      </div>

                      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="p-6 text-[10px] font-black uppercase text-gray-400">Student Name</th>
                              <th className="p-6 text-[10px] font-black uppercase text-gray-400">University Email</th>
                              <th className="p-6 text-[10px] font-black uppercase text-gray-400">Performance</th>
                              <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedSection.roster && selectedSection.roster.length > 0 ? (
                              selectedSection.roster.map((s) => (
                                <tr key={s.id} className="border-b border-gray-50 hover:bg-red-50/20 transition-colors">
                                  {/* UPDATED: Name is now a clickable button */}
                                  <td className="p-6">
                                    <button 
                                      onClick={() => setSelectedStudent(s)}
                                      className="font-black text-gray-900 hover:text-[#800000] hover:underline transition-all text-left uppercase italic tracking-tight"
                                    >
                                      {s.name}
                                    </button>
                                  </td>
                                  <td className="p-6 text-sm font-bold text-gray-400">{s.email}</td>
                                  <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                      s.performance === 'Excellent' ? 'bg-green-100 text-green-700' : 
                                      s.performance === 'Good' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {s.performance}
                                    </span>
                                  </td>
                                  <td className="p-6 text-right"><button className="text-gray-300 hover:text-[#800000]"><Edit3 size={18}/></button></td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan="4" className="p-20 text-center text-gray-300 font-bold italic">No roster data available.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* --- INITIAL CLASSES VIEW --- */
                    <div className="space-y-10">
                      <div>
                        <h2 className="text-3xl font-black text-[#800000] uppercase italic tracking-tighter">Class Management</h2>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Track your assigned sections</p>
                      </div>
                      <div className="space-y-8">
                        {classList.map((item, index) => (
                          <div key={index} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                               <div className="bg-red-50 text-[#800000] p-2 rounded-xl"><Users size={20} /></div>
                               <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tight">{item.grade}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {item.sections.map((section, sIndex) => (
                                <div key={sIndex} className="group p-6 rounded-[30px] border-2 border-gray-50 hover:border-yellow-400 hover:bg-yellow-50/30 transition-all cursor-pointer">
                                  <div className="flex justify-between items-start mb-4">
                                    <span className="text-2xl font-black text-[#800000] tracking-tighter">{section.name}</span>
                                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-green-100 text-green-700 rounded-full">{section.status}</span>
                                  </div>
                                  <button onClick={() => setSelectedSection({...section, grade: item.grade})} className="w-full py-3 rounded-2xl bg-white border border-gray-100 text-[#800000] text-xs font-black uppercase hover:bg-[#800000] hover:text-yellow-400 transition-all shadow-sm">
                                    View Roster
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <aside className="space-y-10">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center">
                <img src={`https://ui-avatars.com/api/?name=${currentUser?.name || currentUser?.full_name}&background=800000&color=FFD700`} alt="Prof" className="size-28 rounded-full border-4 border-white shadow-2xl mx-auto mb-6" />
                <h4 className="text-xl font-black text-gray-900 leading-tight">{currentUser?.name || currentUser?.full_name}</h4>
                <div className="mt-4 px-4 py-1 bg-red-50 text-[#800000] text-[10px] font-black uppercase rounded-full inline-block">
                  {currentUser?.role || 'Faculty'} Account
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