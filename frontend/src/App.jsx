import { useState, useRef, useEffect } from "react";
import WavesurferPlayer from "@wavesurfer/react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, Mic, Upload, Activity, Info, ChevronRight, Lock, Server, FileText, Zap, BarChart3, Wifi } from "lucide-react";

export default function App() {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [isRecording, setIsRecording] = useState(false);

  const howItWorksRef = useRef(null);
  const resourcesRef = useRef(null);
  const demoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const scrollToSection = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setFile(new File([blob], "recording.wav", { type: "audio/wav" }));
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied. Please allow permission.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setAudioUrl(URL.createObjectURL(uploadedFile));
      setResult(null); // Reset result to show "Ready" state again if needed, or keep previous
    }
  };

  const analyzeAudio = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/analyze", { method: "POST", body: formData });
      const data = await response.json();
      const analysis = JSON.parse(data.ai_analysis);
      setResult({ ...analysis, transcript: data.transcript });
    } catch (error) {
      console.error(error);
      alert("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const HighlightedTranscript = ({ text, phrases }) => {
    if (!phrases || phrases.length === 0) return <p className="text-slate-600 leading-relaxed">{text}</p>;
    let highlightedHtml = text;
    phrases.forEach(phrase => {
      const regex = new RegExp(`(${phrase})`, "gi");
      highlightedHtml = highlightedHtml.replace(regex, '<span class="bg-red-100 text-red-700 font-bold border-b-2 border-red-300 px-1">$1</span>');
    });
    return <p className="text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-500/30">
              <ShieldCheck size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800">Sentinel.ai</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
            <button onClick={() => scrollToSection(howItWorksRef)} className="hover:text-blue-600 transition-colors">How it Works</button>
            <button onClick={() => scrollToSection(resourcesRef)} className="hover:text-blue-600 transition-colors">Resources</button>
            <button onClick={() => scrollToSection(demoRef)} className="text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">Live Demo</button>
          </div>
        </div>
      </nav>

      <main ref={demoRef} className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100"
          >
            <Activity size={14} /> AI-Powered Fraud Protection
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            <span className="text-slate-900">Silence the Scammers.</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Protect the Conversation.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* LEFT: INPUT PANEL */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex-1">
              <div className="flex border-b border-slate-100">
                <button onClick={() => setActiveTab("upload")} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "upload" ? "bg-slate-50 text-blue-600 border-b-2 border-blue-600" : "text-slate-400"}`}><Upload size={16} /> Upload</button>
                <button onClick={() => setActiveTab("record")} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "record" ? "bg-slate-50 text-blue-600 border-b-2 border-blue-600" : "text-slate-400"}`}><Mic size={16} /> Live Monitor</button>
              </div>

              <div className="p-8 bg-slate-50/50 flex flex-col justify-center h-full min-h-[400px]">
                {activeTab === "upload" ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:bg-white hover:border-blue-400 transition-all cursor-pointer relative group text-center h-64 flex flex-col items-center justify-center">
                    <input type="file" accept="audio/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="p-4 bg-white text-blue-600 rounded-full inline-block shadow-sm mb-3 group-hover:scale-110 transition-transform"><Upload size={24} /></div>
                    <p className="text-slate-600 font-medium">Drop audio file here</p>
                    <p className="text-slate-400 text-xs mt-1">Supports WAV, MP3</p>
                  </div>
                ) : (
                  <div className="text-center space-y-6 h-64 flex flex-col items-center justify-center">
                    <button onClick={isRecording ? stopRecording : startRecording} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all mx-auto ${isRecording ? "bg-red-500 animate-pulse ring-4 ring-red-200" : "bg-blue-600 hover:scale-105"}`}>
                      <Mic size={28} className="text-white" />
                    </button>
                    <p className="text-slate-500 font-medium text-sm">{isRecording ? "Listening... Tap to stop" : "Tap to start monitoring"}</p>
                  </div>
                )}

                {audioUrl && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 pt-6 border-t border-slate-200">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 mb-4">
                      <WavesurferPlayer height={40} waveColor="#3b82f6" progressColor="#1e40af" url={audioUrl} onReady={(ws) => ws.play()} />
                    </div>
                    <button onClick={analyzeAudio} disabled={loading} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex justify-center items-center gap-2 disabled:opacity-70">
                      {loading ? <Activity className="animate-spin" /> : <ShieldCheck size={18} />}
                      {loading ? "Scanning..." : "Run Security Check"}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT PANEL (The Fix) --- */}
          <div className="lg:col-span-7 flex flex-col">
            <AnimatePresence mode="wait">
              {result ? (
                /* 1. RESULT STATE */
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 h-full"
                >
                  {/* Verdict Card */}
                  <div className={`p-8 rounded-3xl text-white shadow-xl flex items-center justify-between ${result.risk_score > 70 ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30" : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30"}`}>
                    <div>
                      <h3 className="text-3xl font-bold mb-1">{result.verdict}</h3>
                      <p className="opacity-90 font-medium">{result.educational_warning}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-5xl font-black">{result.risk_score}</span>
                      <span className="block text-sm opacity-80 font-bold uppercase tracking-wider">Risk Score</span>
                    </div>
                  </div>

                  {/* Transcript Card */}
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/30 flex-1 min-h-[300px] flex flex-col">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                      <FileText size={20} className="text-slate-400" />
                      <h3 className="font-bold text-slate-700">Analysis Transcript</h3>
                    </div>
                    <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 max-h-[400px]">
                      <HighlightedTranscript text={result.transcript} phrases={result.highlight_phrases} />
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* 2. SYSTEM READY STATE (Replaces Empty Black Box) */
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 h-full min-h-[500px] flex flex-col"
                >
                  <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="font-bold text-slate-700">System Online</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">V.2.0.4 // LLAMA-3-70B</span>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-4">
                    {/* Status Card 1 */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                      <div className="p-3 bg-blue-100 text-blue-600 w-fit rounded-xl mb-4"><Zap size={24} /></div>
                      <div>
                        <h4 className="font-bold text-slate-700">Real-time Inference</h4>
                        <p className="text-sm text-slate-500 mt-1">Ready to process audio stream</p>
                      </div>
                    </div>
                    {/* Status Card 2 */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                      <div className="p-3 bg-purple-100 text-purple-600 w-fit rounded-xl mb-4"><BarChart3 size={24} /></div>
                      <div>
                        <h4 className="font-bold text-slate-700">Pattern Matching</h4>
                        <p className="text-sm text-slate-500 mt-1">Active threat database loaded</p>
                      </div>
                    </div>
                    {/* Large Status Card */}
                    <div className="col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white flex items-center justify-between relative overflow-hidden">
                      <div className="relative z-10">
                        <h4 className="text-xl font-bold mb-2">Awaiting Input</h4>
                        <p className="text-slate-400 text-sm max-w-xs">Upload an audio file or start the live monitor to begin forensic analysis.</p>
                      </div>
                      <Wifi size={48} className="text-slate-700 relative z-10" />
                      {/* Decorative BG element */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer ref={resourcesRef} className="bg-slate-900 text-slate-400 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck size={24} />
            <span className="text-xl font-bold">Sentinel.ai</span>
          </div>
          <p className="text-sm">Built for AlamedaHacks 2026</p>
        </div>
      </footer>
    </div>
  );
}
