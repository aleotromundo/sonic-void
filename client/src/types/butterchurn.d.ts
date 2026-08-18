declare module "butterchurn" {
  const butterchurn: {
    createVisualizer: (context: AudioContext, canvas: HTMLCanvasElement, options: { width: number; height: number; pixelRatio?: number }) => {
      connectAudio: (source: AudioNode) => void;
      disconnectAudio?: (source: AudioNode) => void;
      loadPreset: (preset: unknown, blendTime: number) => void;
      setRendererSize: (width: number, height: number) => void;
      render: () => void;
    };
  };
  export default butterchurn;
}

declare module "butterchurn-presets" {
  const presets: Record<string, unknown>;
  export default presets;
}
