export type PlaybackAvailability = "ready" | "unavailable";

export function getPlaybackAvailability(previewUrl: string | null | undefined): PlaybackAvailability {
  return previewUrl ? "ready" : "unavailable";
}

export function getPlaybackErrorMessage(error?: unknown) {
  if (error instanceof DOMException && error.name === "NotAllowedError") return "El navegador requiere una interacción para iniciar el audio.";
  return "El navegador no pudo cargar esta preview de audio.";
}
