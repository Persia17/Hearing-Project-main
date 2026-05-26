import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function FormPage() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [fileName, setFileName] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setCurrentDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleDobChange = (e) => {
    const selectedDate = e.target.value;
    setDob(selectedDate);
    if (selectedDate) {
      const today = new Date();
      const birthDate = new Date(selectedDate);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge.toString());
    } else {
      setAge('');
    }
  };


  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      setPredicting(true);
      const formData = new FormData();
      formData.append('audio', file);
      try {
        const response = await fetch('/api/audio-predict/', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.status === 'success') {
          setPredictionResult(data.diagnosis);
        }
      } catch (error) {
        console.error("Audio prediction failed:", error);
      } finally {
        setPredicting(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!predictionResult) {
      alert("Please upload an audio file and wait for AI diagnosis before submitting.");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.target);

    try {
      const response = await fetch('/api/generate-plan/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        if (data.diagnosis) {
          setPredictionResult(data.diagnosis);
        }
        setTimeout(() => {
          navigate(`/result/${data.report_id}`);
        }, 1500);
      } else {
        alert("Operation failed: " + data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lime-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/3 -translate-x-1/3"></div>
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>

      <header className="w-full bg-slate-900 border-b-4 border-lime-500 py-4 px-6 sm:px-10 flex justify-between items-center z-10 shadow-lg sticky top-0" data-aos="fade-down">
        <Link to="/" className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-lime-400 to-green-300 tracking-tight hover:scale-105 transition-transform">
          TalkON
        </Link>
        <Link to="/your_plans" className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-5 rounded-full transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-lime-400/50 shadow-[0_0_15px_rgba(132,204,22,0.1)] hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] group">
          <i className="fa-solid fa-list-check group-hover:text-lime-400 transition-colors"></i>
          <span>Your Plans</span>
        </Link>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 z-10 flex flex-col justify-center min-h-[calc(100vh-80px)]" data-aos="zoom-in" data-aos-duration="800">

        <div className="bg-white/90 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden flex flex-col">

          <div className="bg-slate-900 p-8 sm:p-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-lime-500/20 to-green-600/20 opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-lime-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
            
            <div className="relative z-10 md:flex md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight flex items-center gap-3">
                  <span className="bg-lime-500/20 p-2.5 rounded-2xl border border-lime-500/30">
                    <i className="fa-solid fa-wave-square text-lime-400"></i>
                  </span>
                  Speech Analysis
                </h1>
                <p className="text-slate-300 font-medium text-lg max-w-xl">Enter patient details and upload an audio sample for instant AI diagnosis.</p>
              </div>
            </div>
          </div>
 
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">

              <div className="w-full md:w-1/2 space-y-6">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <i className="fa-regular fa-user text-lime-600 text-xl"></i>
                  <h2 className="text-xl font-bold text-slate-800">Patient Details</h2>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-600 ml-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <i className="fa-regular fa-id-badge"></i>
                      </div>
                      <input type="text" name="name" id="name" required className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all outline-none text-slate-800 font-medium placeholder:text-slate-400" placeholder="Patient's Name" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="date" className="block text-sm font-semibold text-slate-600 ml-1">Session Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <i className="fa-regular fa-calendar"></i>
                      </div>
                      <input type="date" id="date" name="date" required value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all outline-none text-slate-800 font-medium" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="dob" className="block text-sm font-semibold text-slate-600 ml-1">Date of Birth</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <i className="fa-solid fa-cake-candles"></i>
                      </div>
                      <input type="date" id="dob" name="dob" required value={dob} onChange={handleDobChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all outline-none text-slate-800 font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="age" className="block text-sm font-semibold text-slate-600 ml-1">Age</label>
                      <div className="relative">
                        <input type="number" id="age" name="age" required min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all outline-none text-slate-800 font-medium" placeholder="Years" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="gender" className="block text-sm font-semibold text-slate-600 ml-1">Gender</label>
                      <div className="relative">
                        <select id="gender" name="gender" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all outline-none text-slate-800 font-medium appearance-none">
                          <option value="" disabled selected>Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                          <i className="fa-solid fa-chevron-down text-sm"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block w-px bg-linear-to-b from-transparent via-slate-200 to-transparent"></div>

              <div className="w-full md:w-1/2 flex flex-col justify-between space-y-8">
 
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-microphone-lines text-lime-600 text-xl"></i>
                    <h2 className="text-xl font-bold text-slate-800">Voice Sample</h2>
                  </div>
                  
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-lime-400 rounded-3xl blur-xl transition-opacity duration-300 ${fileName ? 'opacity-30' : 'opacity-0 group-hover:opacity-20'}`}></div>
                    <label 
                      htmlFor="audio-upload" 
                      className={`relative flex flex-col items-center justify-center w-full px-6 py-6 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300
                        ${fileName 
                          ? 'bg-lime-50/80 border-lime-400 shadow-[0_0_20px_rgba(132,204,22,0.15)] group-hover:bg-lime-50' 
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-300 hover:border-lime-400'
                        }`}
                    >
                      <input id="audio-upload" name="audio" type="file" accept=".mp3,.wav" className="sr-only" required={!fileName} onChange={handleFileChange} />
                      
                      <div className={`h-16 w-16 mb-4 rounded-2xl flex items-center justify-center shadow-md transition-all duration-500 ${fileName ? 'bg-lime-500 text-white shadow-lime-500/30 rotate-3 scale-110' : 'bg-white text-slate-400 group-hover:scale-110 group-hover:text-lime-500 group-hover:shadow-lime-200/50'}`}>
                        <i className={`text-2xl ${fileName ? 'fa-solid fa-file-audio' : 'fa-solid fa-cloud-arrow-up'}`}></i>
                      </div>
                      
                      {fileName ? (
                        <div className="text-center">
                          <p className="text-lg font-bold text-lime-700 mb-1">{fileName}</p>
                          <p className="text-sm font-medium text-lime-600/70 border border-lime-200 bg-white px-3 py-1 rounded-full inline-block">Click to replace file</p>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <p className="font-semibold text-slate-700 text-lg">Click to Upload <span className="text-slate-500 font-normal">or drag & drop</span></p>
                          <p className="text-sm font-medium text-slate-500 bg-slate-200/50 px-3 py-1 rounded-full inline-block">WAV, MP3 (Max 10MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-100 flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <label htmlFor="diagnosis" className="block text-sm font-semibold text-slate-600 ml-1">AI Diagnosis Result</label>
                    
                    {predicting && (
                      <span className="flex items-center text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full shadow-xs animate-pulse">
                        <i className="fas fa-circle-notch fa-spin mr-2"></i> Analyzing...
                      </span>
                    )}
                    {predictionResult && !predicting && (
                      <span className="flex items-center text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full shadow-xs">
                        <i className="fas fa-check-circle mr-1.5"></i> Analysis Complete
                      </span>
                    )}
                  </div>
                  
                  <div className="relative">
                    <input type="hidden" name="diagnosis" value={predictionResult || ""} />
                    
                    <div className="absolute inset-y-0 left-0 pl-5 pt-4 flex items-start pointer-events-none z-10">
                      <div className={`flex items-center justify-center h-8 w-8 rounded-full ${predictionResult ? 'bg-white text-green-500 shadow-sm' : 'bg-slate-200 text-slate-400'}`}>
                        <i className="fas fa-stethoscope text-sm"></i>
                      </div>
                    </div>
                    
                    <textarea 
                      id="diagnosis" 
                      value={predictionResult || ""} 
                      placeholder="Prediction will appear here..." 
                      readOnly 
                      rows={1}
                      className={`w-full pl-16 pr-5 py-5 rounded-2xl font-semibold outline-none border-2 transition-all resize-none ${
                        predicting ? 'bg-amber-50 border-amber-200 text-amber-800' :
                        predictionResult ? 'bg-green-50/50 border-green-200 text-green-800 shadow-[0_4px_20px_rgba(34,197,94,0.05)] focus:ring-4 focus:ring-green-500/10 focus:border-green-400' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                <div className="">
                  <button 
                    type="submit" 
                    disabled={loading || predicting || !fileName} 
                    className={`relative w-full overflow-hidden group rounded-2xl p-0.5 transition-all duration-300 ${
                      loading || predicting || !fileName 
                        ? 'opacity-60 cursor-not-allowed grayscale-[0.5]' 
                        : 'hover:shadow-[0_8px_30px_rgb(132,204,22,0.3)] hover:-translate-y-1'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-linear-to-r from-lime-400 via-green-500 to-emerald-500 opacity-100 transition-opacity duration-300 ${(!loading && !predicting && fileName) ? 'group-hover:opacity-90' : ''}`}></div>
                    
                    <div className="relative bg-black/10 backdrop-blur-sm p-4 w-full h-full rounded-[14px] flex justify-center items-center gap-3">
                      <span className="text-white font-bold text-xl tracking-wide">
                        {loading ? (
                          <><i className="fas fa-circle-notch fa-spin mr-3"></i> Generating Plan...</>
                        ) : predicting ? (
                          <><i className="fas fa-circle-notch fa-spin mr-3"></i> Processing...</>
                        ) : !fileName ? (
                          'Upload Audio First'
                        ) : !predictionResult ? (
                          'Waiting for Analysis...'
                        ) : (
                          'Generate Therapy Plan'
                        )}
                      </span>
                      {(!loading && !predicting && predictionResult) && (
                        <i className="fa-solid fa-arrow-right text-white text-lg group-hover:translate-x-1 transition-transform"></i>
                      )}
                    </div>
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FormPage;
