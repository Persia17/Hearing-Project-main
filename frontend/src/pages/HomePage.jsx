import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function HomePage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/reports/');
      const data = await response.json();
      if (data.status === 'success') {
        setReports(data.reports);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const removePlan = async (id) => {
    if (!window.confirm("Are you sure you want to remove this plan?")) return;
    try {
      const response = await fetch(`/api/report/delete/${id}/`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.status === 'success') {
         setReports(reports.filter(r => r.id !== id));
      } else {
         alert("Failed to delete plan: " + data.message);
      }
    } catch (error) {
      console.error("Error removing plan:", error);
    }
  };

  const getDisorderLabel = (disorder) => {
    if (!disorder) return '';
    const d = disorder.toLowerCase();
    if (d === 'stut') return 'Stuttering';
    if (d === 'lisp') return 'Lisp';
    if (d === 'clut') return 'Cluttering';
    if (d === 'healthy') return 'Healthy Speech';
    return disorder;
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">

      <section className="relative bg-slate-900 pt-20 pb-24 lg:pt-32 lg:pb-32 overflow-hidden border-b-[6px] border-lime-500">
        <div className="absolute inset-0">
          <img
            src="/image/background 2.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-20 filter grayscale blur-sm"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/90 to-slate-900/50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start" data-aos="fade-right" data-aos-duration="1000">
          <div className="inline-block px-4 py-1.5 rounded-full bg-lime-500/20 border border-lime-500/30 text-lime-400 font-semibold mb-6">
            Dashboard
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 max-w-3xl leading-tight">
            Hi, <br/>
            Welcome back to your <span className="text-lime-400">Virtual Speech Therapist</span>
          </h1>
          <p className="mt-4 text-xl text-slate-400 mb-10 max-w-2xl">
            Ready to track your daily progress and record a new session? Our AI model is ready to analyze your voice and guide your therapy.
          </p>
          <Link to="/formpage">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-lime-600 border border-transparent rounded-full hover:bg-lime-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-600 shadow-xl shadow-lime-500/20 cursor-pointer">
              <span>Get Started</span>
              <i className="fas fa-arrow-right ml-3 transform group-hover:translate-x-1 transition-transform"></i>
            </button>
          </Link>
        </div>
      </section>

      <section className="relative -mt-12 z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start space-x-4 hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-500">
              <i className="fas fa-clipboard-list text-2xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Your Plans</h3>
              <p className="text-sm text-slate-500 mt-1">Review your current speech therapy schedules.</p>
            </div>
          </div>

          <Link to="/formpage" className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start space-x-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-lime-50 p-3 rounded-xl text-lime-600">
              <i className="fas fa-microphone text-2xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">New Test</h3>
              <p className="text-sm text-slate-500 mt-1">Record audio for rapid AI diagnosis.</p>
            </div>
          </Link>

          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start space-x-4 hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
            <div className="bg-purple-50 p-3 rounded-xl text-purple-500">
              <i className="fas fa-chart-line text-2xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Analytics</h3>
              <p className="text-sm text-slate-500 mt-1">Track your voice improvements over time.</p>
            </div>
          </div>

        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Recent Activity</h2>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm" data-aos="fade-up">
            {loading ? (
              <div className="p-8 text-center text-slate-500">
                <p>Loading your plans...</p>
              </div>
            ) : reports.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {reports.slice(0, 5).map((report) => (
                  <div key={report.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center text-lime-600">
                        <i className="fas fa-file-medical text-xl"></i>
                      </div>
                      <div>
                        <Link to={`/result/${report.id}`} className="text-lg font-bold text-slate-800 hover:text-lime-600 transition-colors">
                          {report.name}'s Plan
                        </Link>
                        <p className="text-sm text-slate-500">Created: {report.date}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
                          Diagnosis: <span className="text-lime-700 capitalize">{getDisorderLabel(report.diagnosis)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Link to={`/plan/${report.id}`}>
                        <button className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg shadow hover:bg-slate-800 transition-colors cursor-pointer">
                          View details
                        </button>
                      </Link>
                      <button 
                        onClick={() => removePlan(report.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Plan"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <i className="fas fa-folder-open text-2xl text-slate-400"></i>
                 </div>
                 <h3 className="text-lg font-bold text-slate-700">No active plans yet</h3>
                 <p className="mt-2 text-sm text-slate-500">Complete a new diagnosis test to automatically generate your customized therapy plan.</p>
                 <br/>
                 <Link to="/formpage">
                   <button className="bg-lime-50 text-lime-600 font-bold px-6 py-2 rounded-lg hover:bg-lime-100 cursor-pointer">
                       Run Diagnosis
                   </button>
                 </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="zoom-in">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-6">
            Consistency is the Key to Clarity
          </h2>
          <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
            Our app adapts to your progress. The more you use it, the better the AI tunes your customized exercises!
          </p>
          <div className="flex justify-center">
            <Link to="/formpage">
              <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-full shadow-lg hover:bg-slate-800 transition-colors duration-300">
                Record a Session Now
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
