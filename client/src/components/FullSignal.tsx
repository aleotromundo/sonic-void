import React, { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Pause, Play, SlidersHorizontal, X } from "lucide-react";
import { getOrCreateVisualAudioGraph } from "@/lib/audioGraph";
import { ButterchurnVisualizer } from "@/components/ButterchurnVisualizer";

function drawImmersiveFrame(canvas: HTMLCanvasElement, analyser: AnalyserNode | null, time: number, intensity: number, isPlaying: boolean, reducedMotion: boolean) {
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, canvas.clientHeight);
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
  }
  const context = canvas.getContext("2d");
  if (!context) return;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.fillStyle = "#05060b";
  context.fillRect(0, 0, width, height);

  const spectrum = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
  if (spectrum && analyser) analyser.getByteFrequencyData(spectrum);
  const bass = spectrum ? (spectrum[2] + spectrum[4] + spectrum[7]) / 3 / 255 : isPlaying ? (Math.sin(time * 0.002) + 1) / 2 : 0.08;
  const treble = spectrum ? (spectrum[Math.max(1, spectrum.length - 12)] + spectrum[Math.max(1, spectrum.length - 4)]) / 2 / 255 : bass * 0.6;
  const pulse = 1 + bass * intensity * 0.18;
  const hue = (time * 0.015 + treble * 140) % 360;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.hypot(width, height) * 0.72;

  const glow = context.createRadialGradient(cx, cy, 0, cx, cy, maxRadius * 0.72);
  glow.addColorStop(0, `hsla(${hue}, 100%, 60%, ${0.14 + bass * 0.2})`);
  glow.addColorStop(0.4, `hsla(${(hue + 90) % 360}, 100%, 55%, ${0.07 + treble * 0.12})`);
  glow.addColorStop(1, "rgba(3, 4, 10, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  context.save();
  context.translate(cx, cy);
  context.globalCompositeOperation = "screen";
  const layers = reducedMotion ? 9 : 18;
  for (let layer = layers; layer >= 1; layer -= 1) {
    const depth = layer / layers;
    const scale = (1 - depth) * 0.9 + 0.1;
    const rotation = reducedMotion ? 0 : time * 0.00008 * (1 + bass) * (layer % 2 ? 1 : -1);
    const radius = maxRadius * scale * (0.24 + bass * 0.12) * pulse;
    context.save();
    context.rotate(rotation);
    context.strokeStyle = `hsla(${(hue + layer * 17) % 360}, 100%, ${58 + treble * 25}%, ${0.12 + (1 - depth) * 0.28})`;
    context.lineWidth = Math.max(1, (1 - depth) * 3 + bass * 2);
    context.beginPath();
    const sides = 8;
    for (let side = 0; side <= sides; side += 1) {
      const angle = (Math.PI * 2 * side) / sides + Math.PI / 8;
      const wobble = 1 + Math.sin(time * 0.002 + side * 1.7 + layer) * bass * 0.18 * intensity;
      const x = Math.cos(angle) * radius * wobble;
      const y = Math.sin(angle) * radius * wobble;
      if (side === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.closePath();
    context.stroke();
    context.restore();
  }
  context.restore();

  context.save();
  context.globalAlpha = 0.24 + bass * 0.32;
  context.strokeStyle = `hsl(${(hue + 180) % 360}, 100%, 72%)`;
  context.lineWidth = 1;
  const horizon = cy + height * 0.12;
  for (let line = 0; line < 12; line += 1) {
    const y = horizon + Math.pow(line / 12, 1.7) * (height - horizon);
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
  for (let ray = -8; ray <= 8; ray += 1) {
    context.beginPath();
    context.moveTo(cx + ray * width * 0.025, horizon);
    context.lineTo(cx + ray * width * 0.24, height);
    context.stroke();
  }
  context.restore();
}

export function FullSignal({ audioElement, isPlaying, reducedMotion, onClose }: { audioElement?: HTMLAudioElement | null; isPlaying: boolean; reducedMotion: boolean; onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fallbackCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!open) return;
    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;
    let frame = 0;
    let analyser: AnalyserNode | null = null;
    try {
      analyser = audioElement ? getOrCreateVisualAudioGraph(audioElement)?.analyser ?? null : null;
    } catch { analyser = null; }
    const render = (time: number) => {
      drawImmersiveFrame(canvas, analyser, time, intensity, isPlaying, reducedMotion);
      if (!reducedMotion) frame = window.requestAnimationFrame(render);
    };
    render(performance.now());
    return () => window.cancelAnimationFrame(frame);
  }, [audioElement, intensity, isPlaying, open, reducedMotion]);

  useEffect(() => {
    if (!open || !isPlaying || reducedMotion) return;
    const context = audioElement ? getOrCreateVisualAudioGraph(audioElement)?.context : null;
    if (context) void context.resume();
  }, [audioElement, isPlaying, open, reducedMotion]);

  const enter = async () => {
    setOpen(true);
    try { await document.documentElement.requestFullscreen?.(); setIsFullscreen(true); } catch { setIsFullscreen(false); }
  };
  const exit = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); } catch { /* browser may reject exit */ }
    setIsFullscreen(false);
    setOpen(false);
    onClose?.();
  };

  if (!open) return <button onClick={enter} disabled={reducedMotion} className="flex shrink-0 items-center gap-1.5 border border-[#00e7ff]/35 bg-[#00e7ff]/[.06] px-2 py-1.5 text-[#00e7ff] transition hover:border-[#ff2db2]/60 hover:bg-[#ff2db2]/[.08] hover:text-[#ff65c8] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e7ff]" aria-label="Abrir modo Full Signal" title={reducedMotion ? "Desactivado por preferencias de movimiento reducido" : "Abrir visualizador inmersivo a pantalla completa"}><Maximize2 size={15} /><span className="font-mono text-[9px] uppercase tracking-wider">Visuales</span></button>;

  return <div className="fixed inset-0 z-[70] overflow-hidden bg-[#05060b]" role="dialog" aria-modal="true" aria-label="Visualizador inmersivo Full Signal">
    <canvas ref={fallbackCanvasRef} className="absolute inset-0 h-full w-full" aria-label="Visualizador de profundidad reactivo" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,6,11,.1)_45%,rgba(5,6,11,.78)_100%)]" />
    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-8"><div><p className="font-mono text-[10px] uppercase tracking-[.35em] text-[#00e7ff]">nowarfy radio</p><h2 className="font-display text-2xl font-black tracking-tight text-white sm:text-4xl">Full<span className="text-[#ff2db2]"> Signal</span></h2><p className="mt-1 font-mono text-[9px] uppercase tracking-[.2em] text-white/45">{isPlaying ? "Audio-reactive immersion" : "Esperando señal"}</p></div><div className="flex items-center gap-2"><ButterchurnVisualizer audioElement={audioElement} isPlaying={isPlaying} reducedMotion={reducedMotion} fallback={null} /><button onClick={exit} className="grid h-10 w-10 place-items-center border border-white/20 bg-black/20 text-white/70 transition hover:border-[#ff2db2] hover:text-white" aria-label="Cerrar Full Signal"><X size={18} /></button></div></div>
    <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-4 p-5 sm:p-8"><div className="flex items-center gap-2 border border-white/15 bg-black/25 p-2 backdrop-blur"><button onClick={() => audioElement && (isPlaying ? audioElement.pause() : void audioElement.play())} className="grid h-9 w-9 place-items-center bg-[#ff2db2] text-black" aria-label={isPlaying ? "Pausar" : "Reproducir"}>{isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}</button><span className="font-mono text-[10px] uppercase tracking-wider text-white/50">{isPlaying ? "Signal live" : "Signal idle"}</span></div><label className="flex items-center gap-3 border border-white/15 bg-black/25 px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-white/50 backdrop-blur"><SlidersHorizontal size={14} className="text-[#00e7ff]" /> Intensidad <input aria-label="Intensidad visual" type="range" min="0.4" max="2" step="0.1" value={intensity} onChange={event => setIntensity(Number(event.target.value))} className="w-28 accent-[#00e7ff]" /></label><button onClick={() => isFullscreen ? void exit() : void enter()} className="border border-white/15 bg-black/25 p-3 text-white/60 backdrop-blur hover:text-white" aria-label={isFullscreen ? "Salir de pantalla completa" : "Entrar en pantalla completa"}>{isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button></div>
  </div>;
}
