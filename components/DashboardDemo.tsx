import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Users, UserPlus, Clock, AlertTriangle, Sparkles, Filter, Download, 
  HelpCircle, BookOpen, X, Edit, Save, Calendar
} from 'lucide-react';
import { generateHRInsights } from '../services/geminiService';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

type TimeRange = 'Daily' | 'Weekly' | 'Monthly';
type DepartmentType = 'All' | 'Field Sales' | 'Patient Mgmt' | 'In-House' | 'Part-Time';

// --- CUSTOM SCHEDULE DATA SETS ---

// 1. Field Sales: 10 AM - 10 PM
const HOURS_FIELD_SALES = [
  { name: '10 AM', present: 85, absent: 15 },
  { name: '11 AM', present: 88, absent: 12 },
  { name: '12 PM', present: 90, absent: 10 },
  { name: '1 PM', present: 85, absent: 15 },
  { name: '2 PM', present: 92, absent: 8 },
  { name: '3 PM', present: 94, absent: 6 },
  { name: '4 PM', present: 91, absent: 9 },
  { name: '5 PM', present: 88, absent: 12 },
  { name: '6 PM', present: 85, absent: 15 },
  { name: '7 PM', present: 80, absent: 20 },
  { name: '8 PM', present: 75, absent: 25 },
  { name: '9 PM', present: 70, absent: 30 },
  { name: '10 PM', present: 60, absent: 40 },
];

// 2. Patient Management: 10 AM - 7 PM
const HOURS_PATIENT_MGMT = [
  { name: '10 AM', present: 95, absent: 5 },
  { name: '11 AM', present: 96, absent: 4 },
  { name: '12 PM', present: 94, absent: 6 },
  { name: '1 PM', present: 90, absent: 10 },
  { name: '2 PM', present: 95, absent: 5 },
  { name: '3 PM', present: 96, absent: 4 },
  { name: '4 PM', present: 95, absent: 5 },
  { name: '5 PM', present: 92, absent: 8 },
  { name: '6 PM', present: 88, absent: 12 },
  { name: '7 PM', present: 80, absent: 20 },
];

// 3. In House: 10 AM - 6 PM (Also default for All)
const HOURS_IN_HOUSE = [
  { name: '10 AM', present: 98, absent: 2 },
  { name: '11 AM', present: 99, absent: 1 },
  { name: '12 PM', present: 97, absent: 3 },
  { name: '1 PM', present: 92, absent: 8 },
  { name: '2 PM', present: 98, absent: 2 },
  { name: '3 PM', present: 98, absent: 2 },
  { name: '4 PM', present: 97, absent: 3 },
  { name: '5 PM', present: 95, absent: 5 },
  { name: '6 PM', present: 90, absent: 10 },
];

// 4. Part Time (Evening Shift: 4 PM - 8 PM)
const HOURS_PART_TIME = [
  { name: '4 PM', present: 75, absent: 25 },
  { name: '5 PM', present: 80, absent: 20 },
  { name: '6 PM', present: 85, absent: 15 },
  { name: '7 PM', present: 82, absent: 18 },
  { name: '8 PM', present: 70, absent: 30 },
];

// Weekly: Sat - Thursday (Friday Holiday)
const DATA_WEEKLY_SAT_THU = {
  attendance: [
    { name: 'Sat', present: 88, absent: 12 },
    { name: 'Sun', present: 92, absent: 8 },
    { name: 'Mon', present: 90, absent: 10 },
    { name: 'Tue', present: 95, absent: 5 },
    { name: 'Wed', present: 93, absent: 7 },
    { name: 'Thu', present: 85, absent: 15 },
  ],
  recruitment: [
    { name: 'Applied', value: 500 },
    { name: 'Screened', value: 300 },
    { name: 'Interviewed', value: 100 },
    { name: 'Offered', value: 20 },
    { name: 'Hired', value: 15 },
  ],
  violations: 3
};

// Monthly: Week 1 - Week 4 Trend
const DATA_MONTHLY = {
  attendance: [
    { name: 'Week 1', present: 89, absent: 11 },
    { name: 'Week 2', present: 91, absent: 9 },
    { name: 'Week 3', present: 87, absent: 13 },
    { name: 'Week 4', present: 93, absent: 7 },
  ],
  recruitment: [
    { name: 'Applied', value: 2100 },
    { name: 'Screened', value: 1200 },
    { name: 'Interviewed', value: 450 },
    { name: 'Offered', value: 95 },
    { name: 'Hired', value: 82 },
  ],
  violations: 14
};

const INITIAL_DEPT_PERFORMANCE = [
  { name: 'Field Sales', score: 85 },
  { name: 'Patient Mgmt', score: 92 },
  { name: 'In-House', score: 88 },
  { name: 'Part-Time', score: 78 },
];

// Data Entry Modal Component
const DataEntryModal = ({ 
  attendanceData,
  deptData, 
  recruitmentData, 
  timeRange,
  onSave, 
  onClose 
}: { 
  attendanceData: any[],
  deptData: any[], 
  recruitmentData: any[], 
  timeRange: TimeRange,
  onSave: (newAttendance: any[], newDept: any[], newRecruitment: any[]) => void, 
  onClose: () => void 
}) => {
  const [localAttendance, setLocalAttendance] = useState([...attendanceData]);
  const [localDept, setLocalDept] = useState([...deptData]);
  const [localRecruitment, setLocalRecruitment] = useState([...recruitmentData]);

  // Update local state when props change (e.g. switching daily shift views)
  useEffect(() => {
    setLocalAttendance([...attendanceData]);
    setLocalDept([...deptData]);
    setLocalRecruitment([...recruitmentData]);
  }, [attendanceData, deptData, recruitmentData]);

  const handleAttendanceChange = (index: number, val: string) => {
    const present = Math.min(100, Math.max(0, Number(val)));
    const newData = [...localAttendance];
    newData[index] = { 
      ...newData[index], 
      present: present,
      absent: 100 - present
    };
    setLocalAttendance(newData);
  };

  const handleDeptChange = (index: number, val: string) => {
    const newData = [...localDept];
    newData[index] = { ...newData[index], score: Number(val) };
    setLocalDept(newData);
  };

  const handleRecruitmentChange = (index: number, val: string) => {
    const newData = [...localRecruitment];
    newData[index] = { ...newData[index], value: Number(val) };
    setLocalRecruitment(newData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full p-6 relative flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <Edit className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Input {timeRange} Data</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manually update metrics for the selected time range</p>
          </div>
        </div>

        <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Attendance Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-l-4 border-indigo-500 pl-3">
              {timeRange} Attendance (%)
            </h3>
            <div className="space-y-3">
              {localAttendance.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-300 w-16 whitespace-nowrap">{item.name}</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      min="0" max="100"
                      value={item.present}
                      onChange={(e) => handleAttendanceChange(idx, e.target.value)}
                      className="w-20 px-2 py-1 text-right rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                    <span className="text-xs text-slate-400">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Scores Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-l-4 border-blue-500 pl-3">
              Dept Performance (0-100)
            </h3>
            <div className="space-y-3">
              {localDept.map((dept, idx) => (
                <div key={dept.name} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-300 w-24 truncate" title={dept.name}>{dept.name}</label>
                   <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      min="0" max="100"
                      value={dept.score}
                      onChange={(e) => handleDeptChange(idx, e.target.value)}
                      className="w-20 px-2 py-1 text-right rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                     <span className="text-xs text-slate-400">pts</span>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruitment Funnel Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-l-4 border-emerald-500 pl-3">
              Recruitment Funnel
            </h3>
            <div className="space-y-3">
              {localRecruitment.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-300 w-24 truncate" title={item.name}>{item.name}</label>
                  <input 
                    type="number" 
                    min="0"
                    value={item.value}
                    onChange={(e) => handleRecruitmentChange(idx, e.target.value)}
                    className="w-24 px-2 py-1 text-right rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(localAttendance, localDept, localRecruitment)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// User Manual Modal Component
const UserManualModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative flex flex-col max-h-[90vh]">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <X size={24} />
      </button>
      
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
          <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard User Guide</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">How to use the Smart HR Analytics System</p>
        </div>
      </div>

      <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-1">
        <section className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm">1</div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Time Range Switching</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Use the tabs <strong>(Daily | Weekly | Monthly)</strong> to switch the analysis context. 
              <br/>
              • <strong>Daily:</strong> Shows hourly attendance. Hours adapt based on Department (e.g., Field Sales 10am-10pm).
              <br/>
              • <strong>Weekly:</strong> Shows Sat - Thu (Friday Holiday).
              <br/>
              • <strong>Monthly:</strong> Shows Week 1 - Week 4 trends.
            </p>
          </div>
        </section>

        <section className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm">2</div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Inputting Data</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              The <strong>Input Data</strong> modal is smart. It adapts to your selected Time Range. If you select "Monthly", you will be asked to input data for Weeks 1-4.
            </p>
          </div>
        </section>

        <section className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm">3</div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">AI-Powered Insights</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Gemini analyzes the <strong>currently visible</strong> data. Switch to "Monthly" to get a strategic overview, or "Daily" for operational alerts.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
        <button 
          onClick={onClose}
          className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Close Guide
        </button>
      </div>
    </div>
  </div>
);

export const DashboardDemo: React.FC = () => {
  // State for Time Range
  const [timeRange, setTimeRange] = useState<TimeRange>('Weekly');
  const [department, setDepartment] = useState<DepartmentType>('All');

  // State for Charts
  const [attendanceData, setAttendanceData] = useState(DATA_WEEKLY_SAT_THU.attendance);
  const [deptPerformanceData, setDeptPerformanceData] = useState(INITIAL_DEPT_PERFORMANCE);
  const [recruitmentData, setRecruitmentData] = useState(DATA_WEEKLY_SAT_THU.recruitment);
  const [violationCount, setViolationCount] = useState(DATA_WEEKLY_SAT_THU.violations);

  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showInput, setShowInput] = useState(false);

  // Switch data when TimeRange OR Department changes
  useEffect(() => {
    // Reset insight on view change
    setInsight(null);

    // DAILY VIEW LOGIC
    if (timeRange === 'Daily') {
      let dailyData = HOURS_IN_HOUSE; // Default to standard hours if All
      
      if (department === 'Field Sales') dailyData = HOURS_FIELD_SALES;
      else if (department === 'Patient Mgmt') dailyData = HOURS_PATIENT_MGMT;
      else if (department === 'In-House') dailyData = HOURS_IN_HOUSE;
      else if (department === 'Part-Time') dailyData = HOURS_PART_TIME;
      else if (department === 'All') dailyData = HOURS_IN_HOUSE; // Default fallback
      
      setAttendanceData(dailyData);
      // For demo, we keep recruitment/violations static in daily view or could create specific sets
      setRecruitmentData(DATA_WEEKLY_SAT_THU.recruitment); 
      setViolationCount(0);
      return;
    }

    // WEEKLY VIEW LOGIC
    if (timeRange === 'Weekly') {
      setAttendanceData(DATA_WEEKLY_SAT_THU.attendance);
      setRecruitmentData(DATA_WEEKLY_SAT_THU.recruitment);
      setViolationCount(DATA_WEEKLY_SAT_THU.violations);
      return;
    }

    // MONTHLY VIEW LOGIC
    if (timeRange === 'Monthly') {
      setAttendanceData(DATA_MONTHLY.attendance);
      setRecruitmentData(DATA_MONTHLY.recruitment);
      setViolationCount(DATA_MONTHLY.violations);
      return;
    }

  }, [timeRange, department]);

  // Dynamic Calculation of Average Attendance
  const averageAttendance = useMemo(() => {
    if (!attendanceData || attendanceData.length === 0) return 0;
    const total = attendanceData.reduce((acc, curr) => acc + curr.present, 0);
    return Math.round(total / attendanceData.length);
  }, [attendanceData]);

  const handleGenerateInsight = async () => {
    setLoading(true);
    const metrics = {
      period: timeRange,
      attendance: attendanceData,
      averageAttendance: `${averageAttendance}%`,
      performance: deptPerformanceData,
      recruitment: recruitmentData,
      selectedDepartment: department
    };
    
    // Call the Gemini service
    const result = await generateHRInsights(metrics);
    setInsight(result);
    setLoading(false);
  };

  const handleDataUpdate = (newAttendance: any[], newDept: any[], newRecruitment: any[]) => {
    setAttendanceData(newAttendance);
    setDeptPerformanceData(newDept);
    setRecruitmentData(newRecruitment);
    setShowInput(false);
    setInsight(null);
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {showGuide && <UserManualModal onClose={() => setShowGuide(false)} />}
      {showInput && (
        <DataEntryModal 
          attendanceData={attendanceData}
          deptData={deptPerformanceData} 
          recruitmentData={recruitmentData} 
          timeRange={timeRange}
          onSave={handleDataUpdate}
          onClose={() => setShowInput(false)} 
        />
      )}
      
      {/* Header Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Executive HR Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400">Real-time overview of workforce metrics</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Time Range Selector */}
          <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex">
            {(['Daily', 'Weekly', 'Monthly'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  timeRange === range 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

          <select 
            value={department}
            onChange={(e) => setDepartment(e.target.value as DepartmentType)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
          >
            <option value="All">All Departments</option>
            <option value="Field Sales">Field Sales</option>
            <option value="Patient Mgmt">Patient Mgmt</option>
            <option value="In-House">In-House</option>
            <option value="Part-Time">Part-Time</option>
          </select>

          <button 
            onClick={() => setShowInput(true)}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-700 dark:text-slate-200"
            title={`Input ${timeRange} Data`}
          >
            <Edit size={16} /> <span className="hidden sm:inline">Input Data</span>
          </button>
          
          <button 
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-700 dark:text-slate-200"
            title="Open User Manual"
          >
            <HelpCircle size={16} /> <span className="hidden sm:inline">Guide</span>
          </button>
          
          <button 
            onClick={handleGenerateInsight}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            <Sparkles size={16} /> 
            {loading ? 'Analyzing...' : 'AI Insights'}
          </button>
        </div>
      </div>

      {/* AI Insight Section */}
      {insight && (
        <div className="mb-8 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6 relative overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <h3 className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold mb-2">
            <Sparkles size={18} /> Gemini Analysis ({timeRange} View - {department})
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
          { 
            title: `${timeRange} Attendance`, 
            value: `${averageAttendance}%`, 
            change: averageAttendance > 90 ? '+2.1%' : '-1.4%', 
            icon: Clock, 
            color: averageAttendance > 90 ? 'emerald' : 'orange' 
          },
          { 
            title: 'Open Positions', 
            value: recruitmentData[3]?.value.toString() || '0', 
            change: timeRange === 'Monthly' ? '+15' : '+2', 
            icon: UserPlus, 
            color: 'amber' 
          }, 
          { 
            title: 'Policy Violations', 
            value: violationCount.toString(), 
            change: violationCount > 5 ? '+2' : '-1', 
            icon: AlertTriangle, 
            color: 'red' 
          },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
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
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{timeRange} Attendance Trend</h3>
            <span className="text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">Live Data</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" interval="preserveStartEnd" fontSize={12} tick={{dy: 10}} />
                <YAxis stroke="#64748b" domain={[0, 100]} />
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
              <BarChart data={deptPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={90} tick={{fontSize: 12}} />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {deptPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 85 ? '#10b981' : entry.score > 75 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recruitment Funnel */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recruitment Funnel ({timeRange})</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <Download size={14} /> Export Report
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recruitmentData}>
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