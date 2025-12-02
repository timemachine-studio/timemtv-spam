import React, { useState, useRef } from "react";

// TimeMachine TV - Single-file React component
// Usage: Drop this component into your React app. Tailwind CSS should be enabled in the project.

export default function TimeMachineTV() {
  const [prompt, setPrompt] = useState("A cinematic short of an old city street at dusk, filmic, moody lighting");
  const [modelKey, setModelKey] = useState("plln_sk_9p1ezHOVsb2XB96WV3tJSYvDvFLpho3i");
  const [flavor, setFlavor] = useState("tv-plus"); // tv-plus -> seedance, tv-pro -> veo
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [privateMode, setPrivateMode] = useState(true);
  const [enhance, setEnhance] = useState(false);
  const [noLogo, setNoLogo] = useState(true);
  const [quality, setQuality] = useState("high");
  const videoRef = useRef(null);

  const modelMap = {
    "tv-plus": "seedance",
    "tv-pro": "veo",
  };

  function buildPollinationsUrl(promptText) {
    const model = modelMap[flavor] || "seedance";
    const encoded = encodeURIComponent(promptText.trim() || "");
    const params = [];
    params.push(`enhance=${enhance ? "true" : "false"}`);
    params.push(`private=${privateMode ? "true" : "false"}`);
    params.push(`nologo=${noLogo ? "true" : "false"}`);
    params.push(`model=${model}`);
    params.push(`quality=${encodeURIComponent(quality)}`);
    if (modelKey) params.push(`key=${encodeURIComponent(modelKey)}`);

    return `https://enter.pollinations.ai/api/generate/image/${encoded}?${params.join("&")}`;
  }

  async function handleGenerate(e) {
    e && e.preventDefault();
    setError("");
    setVideoUrl("");

    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    const url = buildPollinationsUrl(prompt);
    setLoading(true);

    // Many simple UIs simply point a <video> at the generated URL.
    // We'll set the src and let the browser try to load it. Show errors if it fails.
    try {
      setVideoUrl(url);
      // Reset video element so it attempts to load new src
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.load && videoRef.current.load();
      }
    } catch (err) {
      setError("Failed to construct or load the video.");
      console.error(err);
      setLoading(false);
    }
  }

  function handleVideoLoaded() {
    setLoading(false);
  }

  function handleVideoError() {
    setLoading(false);
    setError(
      "Video failed to load from the generated URL. This can happen due to CORS or because the generation endpoint returns a redirect/HTML. Use 'Open link' to test in a new tab."
    );
  }

  function handleDownload() {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `timemachine-${Date.now()}.mp4`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-slate-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">TimeMachine TV</h1>
            <p className="text-slate-300 mt-1">Simple, beautiful video generator — TV Plus & TV Pro.</p>
          </div>
          <div className="text-sm text-slate-300">
            <div className="mb-1">Model</div>
            <div className="flex gap-2">
              <button
                onClick={() => setFlavor("tv-plus")}
                className={`px-3 py-1 rounded-lg font-medium ${flavor === "tv-plus" ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-200"}`}>
                TV Plus
                <div className="text-xs">seedance</div>
              </button>
              <button
                onClick={() => setFlavor("tv-pro")}
                className={`px-3 py-1 rounded-lg font-medium ${flavor === "tv-pro" ? "bg-rose-600 text-white" : "bg-white/5 text-slate-200"}`}>
                TV Pro
                <div className="text-xs">veo</div>
              </button>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <form className="md:col-span-1 space-y-4" onSubmit={handleGenerate}>
            <label className="block text-slate-200">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="w-full rounded-lg p-3 bg-white/5 text-slate-100 placeholder:text-slate-400"
              placeholder="Describe the scene you want the model to generate..."
            />

            <div className="flex flex-col gap-2">
              <label className="text-slate-200">Key (editable)</label>
              <input
                value={modelKey}
                onChange={(e) => setModelKey(e.target.value)}
                className="w-full rounded-md p-2 bg-white/5"
              />
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-2">
                <input id="private" type="checkbox" checked={privateMode} onChange={() => setPrivateMode(!privateMode)} />
                <label htmlFor="private" className="text-slate-300">private</label>
              </div>
              <div className="flex items-center gap-2">
                <input id="enhance" type="checkbox" checked={enhance} onChange={() => setEnhance(!enhance)} />
                <label htmlFor="enhance" className="text-slate-300">enhance</label>
              </div>
              <div className="flex items-center gap-2">
                <input id="nologo" type="checkbox" checked={noLogo} onChange={() => setNoLogo(!noLogo)} />
                <label htmlFor="nologo" className="text-slate-300">nologo</label>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <label className="text-slate-300">Quality</label>
              <select value={quality} onChange={(e) => setQuality(e.target.value)} className="rounded-md bg-white/5 p-1">
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </select>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleGenerate}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-rose-500 px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg">
                Generate
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrompt("");
                  setVideoUrl("");
                  setError("");
                }}
                className="px-4 py-2 rounded-lg bg-white/5">
                Reset
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-400">
              This UI constructs a Pollinations generation URL and tries to load the returned media directly. If the endpoint returns HTML or requires server-side handling you may need to proxy the request server-side.
            </div>

            {error && <div className="text-sm text-rose-400">{error}</div>}

            <div className="mt-4 text-xs text-slate-300">
              Constructed URL (read-only)
            </div>
            <input readOnly value={videoUrl || buildPollinationsUrl(prompt)} className="w-full rounded-md p-2 bg-white/5 text-xs" />
          </form>

          <section className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Preview</h2>
                <p className="text-slate-400 text-sm">Video will appear here after you click Generate.</p>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => videoUrl && window.open(videoUrl, "_blank")}
                  className="px-3 py-1 rounded-md bg-white/5">
                  Open link
                </button>
                <button onClick={handleDownload} className="px-3 py-1 rounded-md bg-white/5" disabled={!videoUrl}>
                  Download
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-black/40 border border-white/5 p-4 min-h-[320px] flex items-center justify-center">
              {loading && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white/60 mx-auto" />
                  <div className="mt-2 text-slate-300">Loading...</div>
                </div>
              )}

              {!loading && !videoUrl && (
                <div className="text-slate-400">No video yet. Enter a prompt and click Generate.</div>
              )}

              {videoUrl && (
                <video
                  ref={videoRef}
                  controls
                  onLoadedData={handleVideoLoaded}
                  onError={handleVideoError}
                  className="w-full rounded-xl max-h-[560px]"
                >
                  <source src={videoUrl} />
                  Your browser does not support the video element. <a href={videoUrl} target="_blank" rel="noreferrer">Open link</a>
                </video>
              )}
            </div>

            <div className="mt-2 text-xs text-slate-400">
              Tip: If the preview does not load, click "Open link" to open the generated URL in a new tab or use a server-side proxy to fetch the generated file.
            </div>
          </section>
        </main>

        <footer className="mt-6 text-sm text-slate-400 flex justify-between">
          <div>Built with ❤️ — TimeMachine TV</div>
          <div>Models: TV Plus (seedance) • TV Pro (veo)</div>
        </footer>
      </div>
    </div>
  );
}
