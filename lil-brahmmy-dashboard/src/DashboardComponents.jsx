import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, BrainCircuit, FileUp, CheckCircle, Users, Plus, 
  Trash2, Edit3, ChevronLeft, Loader2, Globe, CheckCircle2, X, AlertTriangle,
  AlertCircle, TrendingUp
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { masteryData } from './DashboardConstants';

// --- MOCK DATA FOR STUDENT ANALYTICS ---
const studentPerformanceData = [
  { lesson: 'Cell Structure', score: 95, status: 'Success' },
  { lesson: 'Mitosis', score: 42, status: 'Failed' },
  { lesson: 'DNA Replication', score: 88, status: 'Success' },
  { lesson: 'Genetics', score: 35, status: 'Failed' },
  { lesson: 'Ecosystems', score: 92, status: 'Success' },
];

// --- REUSABLE STAT CARD ---
export const StatCard = ({ icon: Icon, label, value, colorClass, bgClass }) => (
  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 flex-1">
    <div className={`p-4 rounded-2xl ${bgClass}`}>
      <Icon className={`${colorClass} size-6`} />
    </div>
    <div>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

// --- DASHBOARD HOME TAB ---
export const DashboardHome = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState('loading');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleProcess = () => {
    if (!selectedFile) return;
    setIsModalOpen(true);
    setModalStep('loading');
    setTimeout(() => {
      setModalStep('success');
    }, 2500);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex gap-6">
        <StatCard icon={BookOpen} label="Courses In Progress" value="18" colorClass="text-red-700" bgClass="bg-red-50" />
        <StatCard icon={Sparkles} label="Quizzes Completed" value="23" colorClass="text-yellow-600" bgClass="bg-yellow-50" />
        <StatCard icon={BrainCircuit} label="AI Generations" value="15" colorClass="text-maroon-800" bgClass="bg-red-100/50" />
        <StatCard icon={Users} label="Total Students" value="87" colorClass="text-blue-600" bgClass="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 relative">
          <h3 className="text-lg font-black text-gray-900 italic uppercase tracking-tighter mb-8">Performance Level</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={masteryData} barGap={8}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="unit" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11, fontWeight: 700}} />
                <Tooltip cursor={{fill: '#FDF2F2'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                <Bar dataKey="mastery" fill="#800000" radius={[12, 12, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-sm border-2 border-dashed border-yellow-400 flex flex-col items-center justify-center text-center group transition-all duration-500">
          <div className={`p-6 rounded-full mb-6 transition-all ${selectedFile ? 'bg-green-100 text-green-600' : 'bg-yellow-50 text-[#800000] shadow-lg shadow-yellow-100'}`}>
            <FileUp size={48} className={!selectedFile ? "animate-bounce" : ""} />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">New Lesson Upload</h3>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">
            {selectedFile ? `Ready: ${selectedFile.name}` : "Upload PDF for Unity integration."}
          </p>
          <div className="flex gap-4 w-full max-w-xs">
            <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
            <label htmlFor="fileInput" className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black text-[10px] uppercase cursor-pointer hover:bg-gray-200 transition-all flex items-center justify-center">
              {selectedFile ? "Change" : "Browse"}
            </label>
            <button 
              onClick={handleProcess} 
              disabled={!selectedFile} 
              className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all ${!selectedFile ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#800000] text-yellow-400 hover:scale-105 active:scale-95'}`}
            >
              Process
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#800000]/60 backdrop-blur-md animate-in fade-in duration-300" />
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              {modalStep === 'loading' ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <Loader2 className="size-16 text-[#800000] animate-spin" />
                  </div>
                  <h3 className="text-2xl font-black text-[#800000] uppercase italic tracking-tighter">Integrating...</h3>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-relaxed">
                    Synchronizing lesson assets <br/> with the Unity environment.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full shadow-inner">
                      <CheckCircle2 className="size-16 text-green-600" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Sync Complete</h3>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Local stream is now active at:</p>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-center gap-3">
                      <Globe className="text-[#800000]" size={16} />
                      <span className="font-mono text-sm font-black text-[#800000]">http://localhost:3000</span>
                    </div>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="w-full bg-[#800000] text-yellow-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-red-900 transition-colors"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </div>
            <div className="h-2 bg-yellow-400 w-full" />
          </div>
        </div>
      )}
    </div>
  );
};

// --- MY CLASSES VIEW (UPDATED LOGIC) ---
export const MyClassesView = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [classData, setClassData] = useState([
    {
      id: 1,
      grade: "GRADE 1",
      sections: [
        { id: 101, name: "Section A", studentsCount: 4, status: "ACTIVE", roster: [
            { id: 1001, name: "Marcus Phoenix", email: "m.phoenix@university.edu", performance: "Excellent" },
            { id: 1002, name: "Sarah Connor", email: "s.connor@university.edu", performance: "Good" },
            { id: 1003, name: "John Wick", email: "j.wick@university.edu", performance: "Average" },
            { id: 1004, name: "hi", email: "2100810@university.edu", performance: "Average" },
          ]
        },
        { id: 102, name: "Section B", studentsCount: 22, status: "ACTIVE", roster: [] }
      ]
    },
    {
      id: 2,
      grade: "GRADE 2",
      sections: [{ id: 103, name: "Section C", studentsCount: 28, status: "ACTIVE", roster: [] }]
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalTarget, setModalTarget] = useState('GRADE'); 
  const [modalMode, setModalMode] = useState('ADD'); 
  const [activeGradeId, setActiveGradeId] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const openGradeModal = (mode, gradeObj = null) => {
    setModalTarget('GRADE'); setModalMode(mode);
    setInputValue(mode === 'EDIT' ? gradeObj.grade : '');
    if (mode === 'EDIT') setActiveGradeId(gradeObj.id);
    setShowModal(true);
  };

  const openSectionModal = (mode, gradeId, sectionObj = null) => {
    setModalTarget('SECTION'); setModalMode(mode); setActiveGradeId(gradeId);
    setInputValue(mode === 'EDIT' ? sectionObj.name : '');
    if (mode === 'EDIT') setActiveSectionId(sectionObj.id);
    setShowModal(true);
  };

  const openDeleteConfirm = (type, gradeId, sectionId = null) => {
    setModalTarget(type); setActiveGradeId(gradeId); setActiveSectionId(sectionId);
    setShowDeleteModal(true);
  };

  const handleSave = () => {
    if (!inputValue.trim()) return;
    if (modalTarget === 'GRADE') {
      if (modalMode === 'ADD') {
        setClassData([...classData, { id: Date.now(), grade: inputValue.toUpperCase(), sections: [] }]);
      } else {
        setClassData(classData.map(g => g.id === activeGradeId ? { ...g, grade: inputValue.toUpperCase() } : g));
      }
    } else {
      setClassData(classData.map(g => {
        if (g.id === activeGradeId) {
          if (modalMode === 'ADD') {
            return { ...g, sections: [...g.sections, { id: Date.now(), name: inputValue, studentsCount: 0, roster: [] }] };
          } else {
            return { ...g, sections: g.sections.map(s => s.id === activeSectionId ? { ...s, name: inputValue } : s) };
          }
        }
        return g;
      }));
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (modalTarget === 'GRADE') {
      setClassData(classData.filter(g => g.id !== activeGradeId));
    } else {
      setClassData(classData.map(g => {
        if (g.id === activeGradeId) {
          return { ...g, sections: g.sections.filter(s => s.id !== activeSectionId) };
        }
        return g;
      }));
    }
    setShowDeleteModal(false);
  };

  // --- RENDERING LOGIC (ORDER IS CRITICAL) ---

  // 1. SHOW ANALYTICS (Highest Priority)
  if (selectedStudent) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button onClick={() => setSelectedStudent(null)} className="flex items-center gap-2 text-[#800000] font-black uppercase text-xs hover:underline">
          <ChevronLeft size={16} /> Back to Roster
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-gray-900 italic uppercase tracking-tighter">{selectedStudent.name}</h2>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{selectedStudent.email}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 font-black text-[10px] uppercase">Average Mastery</p>
            <p className="text-4xl font-black text-[#800000]">74%</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-[35px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
              <h3 className="font-black uppercase italic text-sm text-gray-700">Lesson Mastery Breakdown</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400">Lesson Topic</th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400">Score</th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {studentPerformanceData.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="p-5 font-bold text-gray-800">{item.lesson}</td>
                    <td className="p-5 font-black text-[#800000]">{item.score}%</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1 w-fit ${
                        item.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status === 'Success' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
             <TrendingUp className="text-gray-200 mb-4" size={48} />
             <p className="text-gray-400 font-bold uppercase text-[10px] text-center">Unity Analytics <br/> Stream Active</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. SHOW ROSTER (Second Priority)
  if (selectedSection) {
    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        <button onClick={() => setSelectedSection(null)} className="flex items-center gap-2 text-[#800000] font-black uppercase text-xs hover:underline">
          <ChevronLeft size={16} /> Back to My Classes
        </button>
        <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase">{selectedSection.name} Roster</h2>
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Student Name</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Performance</th>
                <th className="p-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedSection.roster.map(s => (
                <tr key={s.id} className="border-b border-gray-50 group hover:bg-red-50/50 transition-all">
                  <td 
                    className="p-6 font-bold cursor-pointer text-[#800000] underline decoration-transparent hover:decoration-[#800000] transition-all"
                    onClick={() => {
                      console.log("Student Clicked:", s.name);
                      setSelectedStudent(s);
                    }} 
                  >
                    {s.name}
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black">{s.performance}</span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-gray-300 hover:text-red-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 3. DEFAULT VIEW
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-[#800000] uppercase italic tracking-tighter">Class Management</h2>
        <button onClick={() => openGradeModal('ADD')} className="bg-[#800000] text-yellow-400 px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg">
          <Plus size={18} /> Add Grade Level
        </button>
      </div>

      <div className="space-y-10">
        {classData.map((gradeObj) => (
          <div key={gradeObj.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
              <h3 className="text-2xl font-black text-gray-800 uppercase italic">{gradeObj.grade}</h3>
              <button onClick={() => openSectionModal('ADD', gradeObj.id)} className="bg-yellow-400 text-[#800000] px-4 py-2 rounded-xl font-black text-[10px] uppercase flex items-center gap-2">
                <Plus size={14} strokeWidth={4} /> Add Section
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gradeObj.sections.map((section) => (
                <div key={section.id} className="p-6 rounded-[30px] border-2 border-gray-100 group">
                  <span className="text-2xl font-black text-[#800000] block mb-4">{section.name}</span>
                  <button onClick={() => setSelectedSection(section)} className="w-full py-3 rounded-2xl bg-white border border-gray-100 text-[#800000] text-[10px] font-black uppercase hover:bg-[#800000] hover:text-yellow-400 transition-all">
                    View Roster
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#800000]/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-sm rounded-[30px] shadow-2xl relative z-10 p-8">
            <h3 className="text-xl font-black text-[#800000] uppercase mb-6">{modalMode === 'ADD' ? 'Create' : 'Edit'} {modalTarget}</h3>
            <input className="w-full bg-gray-50 p-4 rounded-2xl mb-6 font-bold" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black uppercase text-[10px]">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-4 bg-[#800000] text-yellow-400 rounded-2xl font-black uppercase text-[10px]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- DEEP-DIVE COURSE VAULT ---
export const VaultView = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'General Biology', students: [
        { id: 101, name: 'Juan Dela Cruz', score: 85, history: 'Quiz: Cells (90%), Quiz: Genetics (80%)' },
        { id: 102, name: 'Maria Clara', score: 92, history: 'Quiz: Cells (95%), Quiz: Genetics (89%)' }
      ]},
    { id: 2, name: 'Anatomy & Physiology', students: [] },
    { id: 3, name: 'Environmental Science', students: [] }
  ]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [vaultModalMode, setVaultModalMode] = useState('COURSE'); 
  const [vaultInputValue, setVaultInputValue] = useState('');

  const handleVaultSave = () => {
    if (!vaultInputValue.trim()) return;
    if (vaultModalMode === 'COURSE') {
      setCourses(prev => [...prev, { id: Date.now(), name: vaultInputValue, students: [] }]);
    } else {
      const updatedCourses = courses.map(c => {
        if (c.id === selectedCourse.id) {
          return { ...c, students: [...c.students, { id: Date.now(), name: vaultInputValue, score: 0, history: 'Newly Enrolled' }] };
        }
        return c;
      });
      setCourses(updatedCourses);
      setSelectedCourse(updatedCourses.find(c => c.id === selectedCourse.id));
    }
    setVaultInputValue('');
    setShowVaultModal(false);
  };

  return (
    <div className="relative">
      {!selectedCourse ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-[#800000] italic uppercase tracking-tighter">Course Vault</h2>
            <button 
              onClick={() => { setVaultModalMode('COURSE'); setVaultInputValue(''); setShowVaultModal(true); }} 
              className="bg-[#800000] text-yellow-400 px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg"
            >
              <Plus size={18} /> Add New Subject
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} onClick={() => setSelectedCourse(course)} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:border-[#800000] cursor-pointer transition-all group">
                <div className="bg-red-50 size-16 rounded-2xl flex items-center justify-center text-[#800000] mb-6 group-hover:bg-yellow-400 transition-colors"><BookOpen size={32} /></div>
                <h4 className="text-xl font-black text-gray-900 mb-2">{course.name}</h4>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest"><Users size={14} /> {course.students.length} Students</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-[#800000] font-black uppercase text-xs hover:underline">
            <ChevronLeft size={16} /> Back to Vault
          </button>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase">{selectedCourse.name}</h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Class Roster & History</p>
            </div>
            <button 
              onClick={() => { setVaultModalMode('STUDENT'); setVaultInputValue(''); setShowVaultModal(true); }}
              className="bg-[#800000] text-yellow-400 px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg"
            >
              <Plus size={18} /> Enroll Student
            </button>
          </div>

          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400">Student</th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400">Progress</th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400">History</th>
                  <th className="p-6 text-right text-[10px] font-black uppercase text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourse.students.length > 0 ? selectedCourse.students.map(s => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors">
                    <td className="p-6 font-bold text-gray-900">{s.name}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{ width: `${s.score}%` }}></div></div>
                        <span className="text-xs font-black text-gray-600">{s.score}%</span>
                      </div>
                    </td>
                    <td className="p-6 text-xs text-gray-400 italic">{s.history}</td>
                    <td className="p-6 text-right"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase">Active</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="p-20 text-center text-gray-300 font-bold italic uppercase tracking-widest">No students enrolled.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showVaultModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#800000]/60 backdrop-blur-md" onClick={() => setShowVaultModal(false)} />
          <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl relative z-10 p-10">
            <h3 className="text-2xl font-black text-[#800000] uppercase italic mb-6">{vaultModalMode === 'COURSE' ? 'New Subject' : 'Enroll Student'}</h3>
            <input 
              autoFocus 
              className="w-full bg-gray-50 p-5 rounded-2xl outline-none font-bold text-gray-700 mb-8" 
              placeholder={vaultModalMode === 'COURSE' ? "Enter Subject Name" : "Enter Student Name"} 
              value={vaultInputValue} 
              onChange={(e) => setVaultInputValue(e.target.value)} 
            />
            <div className="flex gap-3">
              <button onClick={() => setShowVaultModal(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black uppercase text-[10px] text-gray-500">Cancel</button>
              <button onClick={handleVaultSave} className="flex-1 py-4 bg-[#800000] text-yellow-400 rounded-2xl font-black uppercase text-[10px] shadow-lg">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- AI QUIZ LAB TAB ---
export const QuizLabView = () => (
  <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
    <div className="bg-yellow-50 size-20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#800000]">
      <Sparkles size={40} />
    </div>
    <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">AI Quiz Laboratory</h2>
    <p className="text-gray-400 font-bold text-sm uppercase tracking-widest leading-relaxed mb-8">
      Generate dynamic assessments using your processed Unity assets.
    </p>
    <button className="bg-[#800000] text-yellow-400 px-10 py-5 rounded-[25px] font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all">
      Launch Lab Generator
    </button>
  </div>
);