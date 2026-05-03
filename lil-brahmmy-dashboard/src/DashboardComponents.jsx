import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, BrainCircuit, FileUp, CheckCircle, Users, Plus, Trash2, Edit3, ChevronLeft 
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { masteryData } from './DashboardConstants';

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
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setTimeout(() => {
      alert(`${selectedFile.name} successfully synced with Unity!`);
      setIsUploading(false);
      setSelectedFile(null);
    }, 2000);
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

        <div className="bg-white p-10 rounded-[40px] shadow-sm border-2 border-dashed border-red-100 flex flex-col items-center justify-center text-center group hover:border-yellow-400 transition-all duration-500">
          <div className={`p-6 rounded-full mb-6 transition-all ${selectedFile ? 'bg-green-100 text-green-600' : 'bg-red-50 text-[#800000] group-hover:bg-yellow-400'}`}>
            {isUploading ? <div className="animate-spin size-12 border-4 border-[#800000] border-t-transparent rounded-full" /> : <FileUp size={48} className={!selectedFile ? "animate-bounce" : ""} />}
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">{selectedFile ? "File Ready" : "New Lesson Upload"}</h3>
          <p className="text-gray-400 text-sm max-w-xs mb-8">{selectedFile ? `Selected: ${selectedFile.name}` : "Upload PDF for Unity integration."}</p>
          <div className="flex gap-4">
            <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
            <label htmlFor="fileInput" className="bg-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-black text-sm uppercase cursor-pointer hover:bg-gray-200 transition-all">
              {selectedFile ? "Change" : "Browse"}
            </label>
            <button onClick={handleUpload} disabled={!selectedFile || isUploading} className={`px-8 py-4 rounded-2xl font-black text-sm uppercase shadow-xl transition-all ${!selectedFile || isUploading ? 'bg-gray-200 text-gray-400' : 'bg-[#800000] text-yellow-400 hover:scale-105'}`}>
              {isUploading ? "Syncing..." : "Process"}
            </button>
          </div>
        </div>
      </div>
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

  const addCourse = () => {
    const name = prompt("Enter New Course Name:");
    if (name) setCourses([...courses, { id: Date.now(), name, students: [] }]);
  };

  const enrollStudent = () => {
    const name = prompt("Enter Student Name:");
    if (name) {
      const updated = courses.map(c => {
        if (c.id === selectedCourse.id) {
          return { ...c, students: [...c.students, { id: Date.now(), name, score: 0, history: 'Newly Enrolled' }] };
        }
        return c;
      });
      setCourses(updated);
      setSelectedCourse(updated.find(c => c.id === selectedCourse.id));
    }
  };

  // If a course is clicked, show the Student Analytics view
  if (selectedCourse) {
    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-[#800000] font-black uppercase text-xs hover:underline">
          <ChevronLeft size={16} /> Back to Vault
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase">{selectedCourse.name}</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Class Roster & History</p>
          </div>
          <button onClick={enrollStudent} className="bg-[#800000] text-yellow-400 px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg">
            <Plus size={18} /> Enroll Student
          </button>
        </div>

        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Student</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Mastery</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Recent History</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourse.students.length > 0 ? selectedCourse.students.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors">
                  <td className="p-6 font-bold text-gray-900">{s.name}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${s.score}%` }}></div>
                      </div>
                      <span className="text-xs font-black text-gray-600">{s.score}%</span>
                    </div>
                  </td>
                  <td className="p-6 text-xs text-gray-400 font-medium italic">{s.history}</td>
                  <td className="p-6 text-right">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase">Active</span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="p-20 text-center text-gray-300 font-bold italic">No students enrolled.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Default Grid View
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-[#800000] italic uppercase tracking-tighter">Course Vault</h2>
        <button onClick={addCourse} className="bg-[#800000] text-yellow-400 px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg">
          <Plus size={18} /> Add New Subject
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} onClick={() => setSelectedCourse(course)} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:border-[#800000] cursor-pointer transition-all group">
            <div className="bg-red-50 size-16 rounded-2xl flex items-center justify-center text-[#800000] mb-6 group-hover:bg-yellow-400 transition-colors">
              <BookOpen size={32} />
            </div>
            <h4 className="text-xl font-black text-gray-900 mb-2">{course.name}</h4>
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              <Users size={14} /> {course.students.length} Students
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- AI QUIZ LAB TAB ---
export const QuizLabView = () => (
  <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
    <div className="bg-yellow-50 size-20 rounded-full flex items-center justify-center mx-auto mb-8">
      <BrainCircuit size={40} className="text-[#800000]" />
    </div>
    <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase italic tracking-tighter">AI Quiz Generator</h2>
    <textarea placeholder="Paste lesson text..." className="w-full h-48 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-3xl p-6 outline-none mb-8" />
    <button className="bg-[#800000] text-yellow-400 w-full py-5 rounded-2xl font-black uppercase shadow-xl hover:scale-[1.02] transition-all">
      Generate Unity Quiz
    </button>
  </div>
);