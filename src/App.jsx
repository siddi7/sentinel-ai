import { useState, useRef, useEffect } from "react";
import WavesurferPlayer from "@wavesurfer/react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, Zap } from "lucide-react";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [riskColor, setRiskColor] = useState("#3b82f6"); // Default Blue

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setRiskColor("#3b82f6");
  };

  const analyzeAudio = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const analysis = JSON.parse(data.ai_analysis);

      setResult({ ...analysis, transcript: data.transcript });

      // Dynamic Color Switching Logic
      if (analysis.risk_score > 75) setRiskColor("#ef4444"); // Red
      else if (analysis.risk_score > 40) setRiskColor("#f59e0b"); // Orange
      else setRiskColor("#22c55e"); // Green

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10 font-sans selection:bg-purple-500">
      <header className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
          <Zap size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sentinel.ai</h1>
          <p className="text-slate-400">Real-time Acoustic Fraud Detection</p>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Panel: The Scanner */}
        <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-4 text-slate-300">Live Audio Feed</h2>

          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all mb-6"
          />

          {file && (
            <div className="mb-6 p-4 bg-black/40 rounded-xl border border-slate-600/50">
              {/* The Waveform Visualizer */}
              <WavesurferPlayer
                height={120}
                waveColor={riskColor} // Changes color dynamically!
                progressColor="white"
                url={URL.createObjectURL(file)}
                onReady={(ws) => ws.play()}
              />
            </div>
          )}

          <button
            onClick={analyzeAudio}
            disabled={loading || !file}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Scanning Neural Patterns..." : "Analyze Audio Stream"}
          </button>
        </div>

        {/* Right Panel: The Intelligence */}
        <div className="relative">
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`p-8 rounded-3xl border-2 shadow-2xl ${result.risk_score > 75
                  ? "bg-red-950/30 border-red-500 shadow-red-900/20"
                  : "bg-green-950/30 border-green-500 shadow-green-900/20"
                  }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-4xl font-black mb-1">{result.verdict}</h3>
                    <p className="text-slate-400">Risk Score: {result.risk_score}/100</p>
                  </div>
                  {result.risk_score > 75 ? <ShieldAlert size={48} className="text-red-500" /> : <ShieldCheck size={48} className="text-green-500" />}
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-900/50 p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Detected Triggers</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.detected_triggers?.map((t, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-sm font-medium border border-white/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Analysis</h4>
                    <p className="leading-relaxed text-slate-200">{result.analysis}</p>
                  </div>

                  <div className="opacity-50 text-xs mt-4">
                    <span>Transcript: "{result.transcript.substring(0, 100)}..."</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}