import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function PlanPage() {
  const { reportId } = useParams();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/plan/${reportId}/`);
        const data = await response.json();
        if (data.status === 'success') {
          setPlanData({ disorder: data.disorder, patient: data.patient });
        } else {
          console.error("Error fetching plan:", data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <i className="fas fa-spinner fa-spin text-4xl text-lime-500 mb-4"></i>
          <p className="text-slate-600 font-medium">Generating Plan...</p>
        </div>
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Plan Not Found</h2>
          <Link to="/formpage" className="text-lime-600 hover:text-lime-700 font-semibold underline">Go back to Form</Link>
        </div>
      </div>
    );
  }

  const getTasksForDisorder = (disorder) => {
    switch(disorder) {
      case 'lisp':
        return [
          { day: 1, title: 'Day 1: Auditory Discrimination', desc: 'Listen to recordings of correct /s/ sounds vs. lisp sounds. Raise hand when hearing correct /s/.' },
          { day: 2, title: 'Day 2: Jaw & Tongue Placement', desc: 'Practice keeping teeth lightly closed while smiling. Place tongue tip behind upper teeth without touching them.' },
          { day: 3, title: 'Day 3: Isolation Practice', desc: 'Produce isolated /s/ sound for 3 seconds. Repeat 10 times with correct tongue placement.' },
          { day: 4, title: 'Day 4: Syllable Practice', desc: 'Combine /s/ with vowels: sa, se, si, so, su. Practice 3 sets of 10.' },
          { day: 5, title: 'Day 5: Initial Word Position', desc: 'Practice 10 words starting with /s/ (sun, see, saw). Use a mirror for visual feedback.' },
          { day: 6, title: 'Day 6: Final Word Position', desc: 'Practice 10 words ending with /s/ (bus, yes, house). Focus on crisp endings.' },
          { day: 7, title: 'Day 7: Phrase Level', desc: 'Create 2-3 word phrases using target sounds (I see the sun, big bus). Repeat each phrase 5 times.' }
        ];
      case 'clut':
        return [
          { day: 1, title: 'Day 1: Awareness Training', desc: 'Record yourself speaking for 1 minute. Listen back and identify moments of rapid or cluttered speech.' },
          { day: 2, title: 'Day 2: Pacing Strategy', desc: 'Read a paragraph slowly while tapping out each syllable. Focus on clear articulation.' },
          { day: 3, title: 'Day 3: Pausing at Punctuation', desc: 'Read a short story. Stop completely for 1 second at commas and 2 seconds at periods.' },
          { day: 4, title: 'Day 4: Over-articulation', desc: 'Practice reading sentences while over-exaggerating mouth movements. Repeat 5 times.' },
          { day: 5, title: 'Day 5: Self-Monitoring', desc: 'Have a 2-minute conversation with a partner. Ask them to signal if you speak too fast.' },
          { day: 6, title: 'Day 6: Word Finding Practice', desc: 'Describe a picture in detail. Take your time to select the exact words you want to use.' },
          { day: 7, title: 'Day 7: Presentation Setup', desc: 'Prepare a 1-minute talk. Practice delivering it with deliberate pauses and clear speech.' }
        ];
      case 'stut':
        return [
          { day: 1, title: 'Day 1: Easy Onsets', desc: 'Practice starting words gently. Begin with vowel sounds: h-apple, h-easy, h-open.' },
          { day: 2, title: 'Day 2: Light Articulatory Contacts', desc: 'Practice touching the speech organs (lips, tongue) together very lightly when saying consonants.' },
          { day: 3, title: 'Day 3: Continuous Phonation', desc: 'Keep your voice "on" throughout a whole phrase. (e.g., I-want-to-go-to-the-store)' },
          { day: 4, title: 'Day 4: Voluntary Stuttering', desc: 'Stutter on purpose in a relaxed way on 5 different words during conversation.' },
          { day: 5, title: 'Day 5: Pull-outs', desc: 'When you catch yourself stuttering, finish the word but stretch out the rest of it smoothly.' },
          { day: 6, title: 'Day 6: Cancellations', desc: 'If you stutter, finish the word, pause for 2 seconds, and say it again smoothly.' },
          { day: 7, title: 'Day 7: Telephone Practice', desc: 'Make a short telephone call (e.g., asking a store for their hours). Use strategies discussed.' }
        ];
      default:
        // Healthy
        return [
          { day: 1, title: 'Day 1: Vocal Warm-up', desc: 'Lip trills and sirens to warm up the vocal cords.' },
          { day: 2, title: 'Day 2: Breath Support', desc: 'Diaphragmatic breathing exercises. Inhale 4 counts, exhale on a hiss for 8 counts.' },
          { day: 3, title: 'Day 3: Resonance Practice', desc: 'Humming scales feeling vibration in the mask (lips/nose area).' },
          { day: 4, title: 'Day 4: Articulation Drills', desc: 'Read tongue twisters to maintain clear and crisp articulation.' },
          { day: 5, title: 'Day 5: Pitch Variation', desc: 'Read a story utilizing different character voices to explore pitch range.' },
          { day: 6, title: 'Day 6: Projection', desc: 'Practice speaking to a point across the room without straining the throat.' },
          { day: 7, title: 'Day 7: Performance', desc: 'Sing a song or recite a poem utilizing all techniques practiced.' }
        ];
    }
  };

  const tasks = getTasksForDisorder(planData.disorder);

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          
          <div className="bg-slate-900 border-b-4 border-lime-500 px-8 py-6 text-white text-center">
            <h1 className="text-3xl font-extrabold mb-2">7-Day Therapy Plan</h1>
            <p className="text-slate-300 font-medium text-lg">Prepared for <span className="text-lime-400 font-bold">{planData.patient}</span></p>
            <div className="mt-4 inline-block bg-slate-800 rounded-full px-4 py-1 border border-slate-700">
               <span className="text-sm font-semibold uppercase tracking-widest text-slate-400 mr-2">Diagnosis:</span>
               <span className="text-white font-bold capitalize">
                 {planData.disorder === 'stut' ? 'Stuttering' :
                  planData.disorder === 'lisp' ? 'Lisp' :
                  planData.disorder === 'clut' ? 'Cluttering' :
                  planData.disorder === 'healthy' ? 'Healthy Speech' :
                  planData.disorder}
               </span>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {tasks.map((task, index) => (
                <div key={index} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-lime-500"></div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{task.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {task.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/home" className="py-3 px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-center">
                Return to Home
              </Link>
              <form action={`/account/save-plan/${reportId}/`} method="POST" className="flex-1 max-w-xs m-0">
                {tasks.map((t, i) => (
                  <input key={i} type="hidden" name="tasks[]" value={`${t.title}: ${t.desc}`} />
                ))}
                <button type="button" onClick={() => alert("Plan effectively generated! Visit 'Your Plans' page (Need to hook up saving).")} className="w-full py-3 px-8 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl shadow-lg shadow-lime-500/30 hover:-translate-y-0.5 transition-all">
                  Save Plan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanPage;
