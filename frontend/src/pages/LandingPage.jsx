import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">

      <section className="relative overflow-hidden bg-slate-900 pt-24 pb-32 lg:pt-36 lg:pb-48">
        <div className="absolute inset-0">
          <img
            src="/image/background 2.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
  
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white" data-aos="zoom-out" data-aos-duration="1200">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Welcome To <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-lime-400 to-green-500 line-clamp-2 pb-2">
              Virtual Speech Therapist
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-300 mb-10">
            We are a team of talented designers making websites that empower individuals to overcome speech barriers anywhere, anytime.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/home">
              <button className="px-8 py-4 text-lg font-bold rounded-full bg-lime-500 hover:bg-lime-600 text-slate-900 shadow-xl shadow-lime-500/30 transform transition-all hover:-translate-y-1">
                Get Started Today
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20" data-aos="fade-up">
            <span className="text-lime-600 font-bold tracking-wider uppercase text-sm bg-lime-50 px-3 py-1 rounded-full">About TalkOn</span>
            <h2 className="mt-4 text-4xl font-extrabold text-slate-900 tracking-tight">Your Virtual Speech Therapist</h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              <strong>TalkOn</strong> is designed to help you speak with clarity, confidence, and ease. 
              With advanced AI technology, we detect speech disorders like stammering, misarticulation, and dysarthria, and guide you with 
              <span className="text-lime-600 font-semibold"> personalized exercises </span> that adapt to your progress.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
              
              <div className="relative group bg-slate-50 rounded-3xl p-8 hover:bg-lime-50 transition-colors duration-300 border border-slate-100 shadow-xs hover:shadow-xl" data-aos="fade-up" data-aos-delay="100">
                <div className="absolute -top-6 left-8 bg-linear-to-br from-lime-400 to-green-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300">
                  <i className="fas fa-microphone-alt text-2xl"></i>
                </div>
                <h3 className="mt-8 text-2xl font-bold text-slate-900">1. Speak</h3>
                <p className="mt-4 text-slate-600">
                  Record your voice directly using our secure, browser-based platform in a quiet environment.
                </p>
              </div>

              <div className="relative group bg-slate-50 rounded-3xl p-8 hover:bg-lime-50 transition-colors duration-300 border border-slate-100 shadow-xs hover:shadow-xl" data-aos="fade-up" data-aos-delay="200">
                <div className="absolute -top-6 left-8 bg-linear-to-br from-lime-400 to-green-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300">
                  <i className="fas fa-brain text-2xl"></i>
                </div>
                <h3 className="mt-8 text-2xl font-bold text-slate-900">2. Detect</h3>
                <p className="mt-4 text-slate-600">
                  Our advanced AI model instantly analyzes acoustic features to identify speech patterns and areas for improvement.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative group bg-slate-50 rounded-3xl p-8 hover:bg-lime-50 transition-colors duration-300 border border-slate-100 shadow-xs hover:shadow-xl" data-aos="fade-up" data-aos-delay="300">
                <div className="absolute -top-6 left-8 bg-linear-to-br from-lime-400 to-green-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300">
                  <i className="fas fa-chart-line text-2xl"></i>
                </div>
                <h3 className="mt-8 text-2xl font-bold text-slate-900">3. Improve</h3>
                <p className="mt-4 text-slate-600">
                  Receive daily personalized exercises, tips, and real-time feedback tailored specifically to your needs.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Why Choose TalkOn?</h2>
            <p className="text-lg text-slate-600 mb-8">
              We believe that everyone deserves the chance to express themselves confidently. TalkOn is here to break barriers, one word at a time.
            </p>
            <ul className="space-y-5">
              {[
                { icon: "fa-check-circle", title: "AI-Powered Accuracy", desc: "Detects subtle speech issues in seconds." },
                { icon: "fa-globe", title: "Anytime, Anywhere", desc: "Practice at your own pace, on any device." },
                { icon: "fa-user-check", title: "Personalized Plans", desc: "Daily actionable exercises designed just for you." },
                { icon: "fa-lock", title: "Private & Secure", desc: "Your voice data is processed securely and privately." }
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-lime-100 text-lime-600">
                      <i className={`fas ${feature.icon} text-lg`}></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-slate-900">{feature.title}</h4>
                    <p className="mt-1 text-slate-600">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="absolute inset-0 bg-linear-to-r from-lime-400 to-green-500 rounded-3xl transform rotate-3 scale-105 opacity-20 blur-xl"></div>
            <div className="relative rounded-3xl bg-white p-8 shadow-2xl border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 bg-lime-50 rounded-full flex items-center justify-center text-lime-500 mb-6">
                 <i className="fas fa-quote-left text-4xl"></i>
              </div>
              <p className="text-2xl font-serif italic text-slate-700 text-center leading-relaxed">
                "Your voice matters <br/> let’s make it shine."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-linear-to-br from-lime-500 to-green-600 overflow-hidden">
       
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black opacity-10 blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="zoom-in">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-6">
            Start Speaking Clearly Today
          </h2>
          <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto">
            Transform your unclear speech into confident, crystal clear communication. Join thousands who have improved their voice clarity with our AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/home">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-green-600 font-bold rounded-full shadow-xl hover:bg-slate-50 transition-colors duration-300 cursor-pointer">
                Test My Voice Free
              </button>
            </Link>
            <Link to="/home">
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors duration-300 backdrop-blur-md cursor-pointer">
                Start Training Now
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
