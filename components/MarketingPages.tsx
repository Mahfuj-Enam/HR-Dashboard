import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, ArrowRight, TrendingUp, ShieldCheck, 
  PieChart, Layout, Layers, UserCheck, Calendar 
} from 'lucide-react';
import { Page } from '../types';

interface SectionProps {
  onNavigate: (page: Page) => void;
}

// Reusable motion settings
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export const Hero: React.FC<SectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6">
              #1 HR Automation Tool
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Smart HR Dashboard <br />
              <span className="text-blue-600">Automated Insights</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Track attendance, violations, hiring progress, KPIs, and HR performance — fully automated without complex spreadsheets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => onNavigate(Page.DEMO)}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30"
              >
                Launch Demo <ArrowRight size={20} />
              </button>
              <button 
                 onClick={() => onNavigate(Page.CONTACT)}
                 className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                Book Consultation
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
               {/* Mock Dashboard Image */}
               <img 
                 src="https://picsum.photos/800/600?random=1" 
                 alt="Dashboard Mockup" 
                 className="w-full h-auto object-cover opacity-90"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
               
               {/* Floating Badge */}
               <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-lg">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Daily Efficiency</p>
                    <p className="text-xl font-bold text-emerald-500">+24.5%</p>
                  </div>
                  <div className="h-10 w-24 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center">
                    <TrendingUp className="text-emerald-600" size={20} />
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const Features: React.FC = () => {
  const features = [
    { icon: Layout, title: "Daily Data Input", desc: "Automated source layer that streamlines daily entries." },
    { icon: ShieldCheck, title: "KPI Scorecards", desc: "Dynamic traffic light indicators for immediate status checks." },
    { icon: Layers, title: "Pivot Engine", desc: "Automated summaries and trend outputs without manual formula work." },
    { icon: PieChart, title: "Drill-Down Analytics", desc: "Interactive slicers to filter by date, department, or officer." },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why HR Leaders Choose Us</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Eliminate manual reporting errors and save 80% of your operational time with our intelligent dashboard architecture.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
              {...fadeInUp}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <f.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const RecruitmentSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Advanced Recruitment Analytics</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Visualize your entire hiring pipeline from application to onboarding. Identify bottlenecks and improve time-to-hire metrics instantly.
            </p>
            <ul className="space-y-4">
              {[
                "Visual Funnel Charts (Applied → Joined)",
                "HR Officer Performance Tables",
                "Automated Conversion Rate Calculation",
                "Time-to-Hire Trend Analysis"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <CheckCircle size={20} className="text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:w-1/2">
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="font-bold text-lg dark:text-white">Hiring Pipeline</h3>
                   <span className="text-xs font-medium text-slate-400">Last 30 Days</span>
                </div>
                {/* Simulated Funnel Visual using simple divs for marketing */}
                <div className="space-y-3">
                   <div className="h-10 bg-blue-600 rounded-md w-full flex items-center px-4 text-white text-sm justify-between">
                      <span>Applied</span> <span>1,240</span>
                   </div>
                   <div className="h-10 bg-blue-500 rounded-md w-[80%] flex items-center px-4 text-white text-sm justify-between mx-auto">
                      <span>Interviewed</span> <span>450</span>
                   </div>
                   <div className="h-10 bg-blue-400 rounded-md w-[60%] flex items-center px-4 text-white text-sm justify-between mx-auto">
                      <span>Offer Sent</span> <span>120</span>
                   </div>
                   <div className="h-10 bg-emerald-500 rounded-md w-[40%] flex items-center px-4 text-white text-sm justify-between mx-auto shadow-lg shadow-emerald-500/20">
                      <span>Joined</span> <span>98</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Pricing: React.FC = () => {
  const plans = [
    { name: "Basic", price: "$49", features: ["Dashboard Template", "Basic Slices", "1 User License", "Email Support"] },
    { name: "Professional", price: "$149", features: ["Fully Automated", "5 User Licenses", "KPI Customization", "Priority Support", "AI Insights (Limited)"], recommended: true },
    { name: "Enterprise", price: "Custom", features: ["Unlimited Users", "Multi-Branch Support", "HRIS Integration", "Custom Reporting", "Dedicated Manager"] },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-600 dark:text-slate-400">Choose the plan that fits your organization size.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {plans.map((plan, i) => (
             <div key={i} className={`relative p-8 rounded-2xl border ${plan.recommended ? 'border-blue-500 shadow-2xl scale-105 z-10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                   <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                   {plan.price !== 'Custom' && <span className="text-slate-500">/mo</span>}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle size={16} className="text-blue-500" /> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.recommended ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600'}`}>
                  Get Started
                </button>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export const Contact: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
       <div className="container mx-auto px-6 max-w-4xl">
         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 bg-blue-600 text-white">
               <h2 className="text-3xl font-bold mb-6">Book a Free Demo</h2>
               <p className="mb-8 text-blue-100">See how our dashboard can transform your HR operations. Schedule a 15-minute walkthrough with our experts.</p>
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <UserCheck className="text-blue-200" /> <span>Expert Consultation</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <Calendar className="text-blue-200" /> <span>Flexible Scheduling</span>
                  </div>
               </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12">
               <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Work Email</label>
                    <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                  </div>
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors mt-4">
                    Confirm Booking
                  </button>
               </form>
            </div>
         </div>
       </div>
    </section>
  );
}