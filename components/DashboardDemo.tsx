import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { Users, UserPlus, Clock, AlertTriangle, Sparkles, Filter, Download } from 'lucide-react';
import { generateHRInsights } from '../services/geminiService';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const dataAttendance = [
  { name: 'Mon', present: 88, absent: 12 },
  { name: 'Tue', present: 92, absent: 8 },
  { name: 'Wed', present: 90, absent: 10 },
  { name: 'Thu', present: 95, absent: 5 },
  { name: 'Fri', present: 85, absent: 15 },
];

const dataDeptPerformance = [
  { name: 'Sales', score: 85 },
  { name: 'Tech', score: 92 },
  { name: 'HR', score: 88 },
  { name: 'Ops', score: 78 },
  { name: 'Mktg', score: 82 },
];

const dataRecruitment = [
  { name: 'Applied', value: 500 },
  { name: 'Screened', value: 300 },
  { name: 'Interviewed', value: 100 },
  { name: 'Offered', value: 20 },
  { name: 'Hired', value: 15 },
];

export const DashboardDemo: React.FC = () => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState('All');

  const handleGenerateInsight = async () => {
    setLoading(true);
    const metrics = {
      attendance: dataAttendance,
      performance: dataDeptPerformance,
      recruitment: dataRecruitment,
      selectedDepartment: department
    };
    
    // Simulate slight network delay for better UX if API is fast
    const result = await generateHRInsights(metrics);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Executive HR Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400">Real-time overview of workforce metrics</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Departments</option>
            <option value="Sales">Sales</option>
            <option value="Tech">Technology</option>
            <option value="Ops">Operations</option>
          </select>
          <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={handleGenerateInsight}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Sparkles size={16} /> 
            {loading ? 'Analyzing...' : 'AI Insights'}
          </button>
        </div>
      </div>

      {/* AI Insight Section */}
      {insight && (
        <div className="mb-8 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <h3 className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold mb-2">
            <Sparkles size={18} /> Gemini Analysis
          </h3>
          <div className="prose dark:prose-invert text-slate-700 dark:text-slate-300 text-sm max-w-none">
            {insight.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Employees', value: '1,248', change: '+12%', icon: Users, color: 'blue' },
          { title: 'Attendance Rate', value: '94.2%', change: '+2.1%', icon: Clock, color: 'emerald' },
          { title: 'Open Positions', value: '24', change: '-4', icon: UserPlus, color: 'amber' },
          { title: 'Policy Violations', value: '3', change: '-1', icon: AlertTriangle, color: 'red' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-${kpi.color}-100 dark:bg-${kpi.color}-900/30 text-${kpi.color}-600 dark:text-${kpi.color}-400`}>
                <kpi.icon size={24} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                kpi.change.startsWith('+') 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {kpi.change}
              </span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{kpi.title}</h3>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Attendance Trend */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Weekly Attendance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataAttendance}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="present" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPresent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Performance */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Department KPI Scores</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataDeptPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={50} />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {dataDeptPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 85 ? '#10b981' : entry.score > 75 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recruitment Funnel */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recruitment Funnel</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataRecruitment}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" stroke="#64748b" />
                 <YAxis stroke="#64748b" />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                 <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};