export type VisualAudioGraph = {
  context: AudioContext;
  analyser: AnalyserNode;
  source: MediaElementAudioSourceNode;
};

export const visualAudioGraph = new WeakMap<HTMLAudioElement, VisualAudioGraph>();

export function getOrCreateVisualAudioGraph(audioElement: HTMLAudioElement): VisualAudioGraph | null {
  const existing = visualAudioGraph.get(audioElement);
  if (existing) return existing;
  const AudioContextCtor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return null;
  try {
    audioElement.crossOrigin = "anonymous";
    const context = new AudioContextCtor();
    const analyser = context.createAnalyser();
    analyser.fftSize = 64;
    const source = context.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(context.destination);
    const graph = { context, analyser, source };
    visualAudioGraph.set(audioElement, graph);
    return graph;
  } catch {
    return null;
  }
}
