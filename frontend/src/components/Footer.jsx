function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div className="w-8 h-8 bg-[#5d6939] rounded-lg flex items-center justify-center text-white font-bold">T</div>
              <span className="text-2xl font-bold text-white">TalkON</span>
            </div>
            <p className="text-slate-400 mt-2 text-sm max-w-xs">
              Your personal <b>Virtual Speech Therapist</b> to help you speak with clarity and confidence.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-lime-400 transition-colors">
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-lime-400 transition-colors">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-lime-400 transition-colors">
              <i className="fab fa-instagram text-xl"></i>
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            Copyright © TalkON 2026. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
