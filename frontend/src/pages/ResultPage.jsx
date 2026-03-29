import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function ResultPage() {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/report/${reportId}/`);
        const data = await response.json();
        if (data.status === 'success') {
          setReport(data.report);
        } else {
          console.error("Error fetching report:", data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <i className="fas fa-circle-notch fa-spin text-4xl text-lime-500 mb-4"></i>
          <p className="text-slate-600 font-medium">Loading Results...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Report Not Found</h2>
          <button onClick={() => navigate('/formpage')} className="text-lime-600 hover:text-lime-700 font-semibold underline">Go back to Form</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#edf3cc] flex justify-center items-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/3 -translate-x-1/3"></div>
      
      <div className="w-full max-w-2xl bg-white/60 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-3xl overflow-hidden z-10" data-aos="fade-up">
        <div className="bg-linear-to-r from-lime-600 to-green-600 p-8 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/image/background\ 2.jpg')] opacity-10 mix-blend-overlay object-cover"></div>
          <h1 className="relative z-10 text-3xl font-extrabold tracking-tight">Diagnosis Complete</h1>
          <p className="relative z-10 text-green-100 mt-2 font-medium">Your speech analysis is ready.</p>
        </div>
        
        <div className="p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-slate-200 pb-4 mb-6"><i className="fas fa-file-medical text-lime-600 mr-2"></i> Patient Report</h2>
          
          <div className="space-y-4 text-lg">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-500">Patient Name:</span>
              <span className="font-bold text-slate-800">{report.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-500">Date:</span>
              <span className="font-bold text-slate-800">{report.date}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-500">Date of Birth:</span>
              <span className="font-bold text-slate-800">{report.dob}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-500">Age:</span>
              <span className="font-bold text-slate-800">{report.age}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-500">Gender:</span>
              <span className="font-bold text-slate-800 capitalize">{report.gender}</span>
            </div>
            <div className="flex justify-between items-center bg-lime-50 p-4 rounded-xl border border-lime-100 mt-6 shadow-sm">
              <span className="font-bold text-lime-800 uppercase tracking-wide text-sm">Diagnosis:</span>
              <span className="font-black text-2xl text-lime-600 capitalize">{report.diagnosis}</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button onClick={() => navigate('/formpage')} className="flex-1 py-3 px-4 bg-white border-2 border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all text-center">
              Back to Form
            </button>
            <Link to={`/plan/${report.id}`} className="flex-1 py-3 px-4 bg-linear-to-r from-lime-500 to-green-600 text-white rounded-xl font-bold shadow-lg shadow-lime-500/30 hover:shadow-lime-500/50 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2">
              Get Personalized Plan <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
