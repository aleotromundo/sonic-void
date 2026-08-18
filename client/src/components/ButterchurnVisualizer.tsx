import React, { useEffect, useMemo, useRef, useState } from "react";

export type ButterchurnPreset = { name: string; value: unknown; license: string; attribution: string; sourceUrl: string };

type ButterchurnEngine = {
  createVisualizer: (context: AudioContext, canvas: HTMLCanvasElement, options: { width: number; height: number; pixelRatio?: number }) => ButterchurnInstance;
};

type ButterchurnInstance = {
  connectAudio: (source: AudioNode) => void;
  disconnectAudio?: (source: AudioNode) => void;
  loadPreset: (preset: unknown, blendTime: number) => void;
  setRendererSize: (width: number, height: number) => void;
  render: () => void;
};

const PRESET_SOURCE = "https://github.com/jberg/butterchurn-presets";
const presetMetadata = [
  { name: "Base Signal", license: "MIT", attribution: "Butterchurn Presets · Jordan Berg", sourceUrl: PRESET_SOURCE },
  { name: "Extra Signal", license: "MIT", attribution: "Butterchurn Presets · Jordan Berg", sourceUrl: PRESET_SOURCE },
  { name: "Minimal Signal", license: "MIT", attribution: "Butterchurn Presets · Jordan Berg", sourceUrl: PRESET_SOURCE },
];

function unpackPresets(moduleValue: unknown): unknown[] {
  const root = (moduleValue as { default?: unknown })?.default ?? moduleValue;
  if (!root || typeof root !== "object") return [];
  const candidate = (root as { presets?: unknown }).presets ?? root;
  if (!candidate || typeof candidate !== "object") return [];
  return Object.values(candidate as Record<string, unknown>).filter(value => value && typeof value === "object");
}

export function ButterchurnVisualizer({ audioElement, isPlaying, reducedMotion, fallback }: { audioElement?: HTMLAudioElement | null; isPlaying: boolean; reducedMotion: boolean; fallback: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ButterchurnInstance | null>(null);
  const engineModuleRef = useRef<ButterchurnEngine | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const frameRef = useRef<number>(0);
  const [presets, setPresets] = useState<ButterchurnPreset[]>([]);
  const [activePreset, setActivePreset] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const selected = useMemo(() => presets[activePreset] ?? null, [activePreset, presets]);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([import("butterchurn"), import("butterchurn-presets")]).then(([engineModule, presetModule]) => {
      if (cancelled) return;
      const engine = ((engineModule as { default?: ButterchurnEngine }).default ?? engineModule) as ButterchurnEngine;
      engineModuleRef.current = engine;
      const values = unpackPresets(presetModule);
      if (!engine?.createVisualizer || values.length === 0) throw new Error("Butterchurn presets unavailable");
      setPresets(presetMetadata.map((meta, index) => ({ ...meta, value: values[index % values.length] })));
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!audioElement || !isPlaying || reducedMotion || presets.length === 0 || !canvasRef.current) return;
    const AudioContextCtor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) { setFailed(true); return; }
    let graphCreated = false;
    try {
      const context = contextRef.current ?? new AudioContextCtor();
      contextRef.current = context;
      const source = sourceRef.current ?? context.createMediaElementSource(audioElement);
      sourceRef.current = source;
      const visualizer = engineRef.current ?? engineModuleRef.current?.createVisualizer(context, canvasRef.current, { width: canvasRef.current.clientWidth || 320, height: canvasRef.current.clientHeight || 64, pixelRatio: Math.min(window.devicePixelRatio || 1, 2) });
      if (!visualizer) throw new Error("Butterchurn engine unavailable");
      engineRef.current = visualizer;
      if (!graphCreated) { visualizer.connectAudio(source); graphCreated = true; }
      void context.resume();
      visualizer.loadPreset(presets[activePreset]?.value ?? presets[0].value, 1.5);
      setReady(true);
      setFailed(false);
      const render = () => { if (!reducedMotion && isPlaying) { visualizer.render(); frameRef.current = window.requestAnimationFrame(render); } };
      frameRef.current = window.requestAnimationFrame(render);
      return () => window.cancelAnimationFrame(frameRef.current);
    } catch { setFailed(true); setReady(false); }
  }, [activePreset, audioElement, isPlaying, presets, reducedMotion]);

  useEffect(() => () => { window.cancelAnimationFrame(frameRef.current); if (contextRef.current) void contextRef.current.suspend(); }, []);

  const showButterchurn = ready && !failed && !reducedMotion && isPlaying;
  return <div className="relative flex min-w-0 items-center gap-2" role={showButterchurn ? "img" : undefined} aria-label={showButterchurn ? `Visualizador Butterchurn activo: ${selected?.name ?? "preset"}` : undefined}><canvas ref={canvasRef} className={showButterchurn ? "h-8 w-16 shrink-0 sm:w-28" : "hidden"} />{showButterchurn ? <><select aria-label="Preset visual" value={activePreset} onChange={event => setActivePreset(Number(event.target.value))} className="hidden max-w-24 bg-transparent font-mono text-[9px] text-[#00e7ff] sm:block">{presets.map((preset, index) => <option key={preset.name} value={index}>{preset.name}</option>)}</select><a href={selected?.sourceUrl} target="_blank" rel="noreferrer" className="hidden font-mono text-[8px] text-white/35 lg:inline" title={`${selected?.license}: ${selected?.attribution}`}>MIT · atribución</a></> : fallback}</div>;
}
