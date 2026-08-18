import { useEffect, useState } from "react";
import { ExternalLink, Headphones, Loader2, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

type Track = {
  id: string; name: string; artist: string; album: string; releaseYear: string; durationLabel: string; popularity: number; imageUrl: string | null; spotifyUrl: string; availableMarkets: string[];
};

export default function Home() {
  const [term, setTerm] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [offset, setOffset] = useState(0);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selected, setSelected] = useState<Track | null>(null);
  const status = trpc.music.status.useQuery();
  const search = trpc.music.search.useQuery({ query: submitted, offset }, { enabled: submitted.length > 0 });
  const lyrics = trpc.music.lyrics.useQuery(selected ? { name: selected.name, artist: selected.artist } : { name: "", artist: "" }, { enabled: Boolean(selected) });

  useEffect(() => {
    if (!search.data) return;
    setTracks(prev => offset === 0 ? search.data.items as Track[] : [...prev, ...(search.data.items as Track[])]);
  }, [search.data, offset]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const clean = term.trim();
    if (!clean) return;
    setOffset(0); setTracks([]); setSubmitted(clean); setSelected(null);
  };
  const loadMore = () => { if (search.data?.nextOffset !== null && search.data?.nextOffset !== undefined) setOffset(search.data.nextOffset); };

  return (
    <main className="min-h-screen overflow-hidden bg-[#060609] text-white selection:bg-[#ff2db2] selection:text-black">
      <div className="pointer-events-none fixed inset-0 opacity-60" style={{ background: "radial-gradient(circle at 10% 10%, rgba(255,45,178,.16), transparent 30%), radial-gradient(circle at 90% 20%, rgba(0,231,255,.12), transparent 34%)" }} />
      <div className="relative mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-12">
        <header className="hud-line flex items-center justify-between gap-4 pb-8">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center border border-[#ff2db2] text-[#ff2db2] shadow-[0_0_24px_rgba(255,45,178,.5)]"><Sparkles size={19} /></div><div><p className="font-mono text-[10px] uppercase tracking-[.35em] text-[#00e7ff]">Signal archive / 01</p><h1 className="font-display text-xl font-black tracking-tight">SONIC<span className="text-[#ff2db2]">//</span>VOID</h1></div></div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[.28em] text-white/40 sm:block">Personal music intelligence</span>
        </header>

        <section className="grid gap-10 py-14 lg:grid-cols-[1fr_320px] lg:items-end">
          <div><p className="mb-4 font-mono text-xs uppercase tracking-[.4em] text-[#ff2db2]">Search the frequency</p><h2 className="max-w-3xl font-display text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-7xl">Encontrá la canción.<br /><span className="neon-cyan">Abrí el universo.</span></h2><p className="mt-6 max-w-xl text-sm leading-7 text-white/55">Metadatos, carátulas y acceso directo a las letras en una interfaz de archivo musical de alto contraste.</p></div>
          <div className="hud-panel p-4"><p className="mb-3 font-mono text-[10px] uppercase tracking-[.25em] text-white/40">Backend status</p><div className="flex items-center gap-2 font-mono text-xs"><span className={`h-2 w-2 rounded-full ${status.data?.spotifyConfigured ? "bg-[#55ff9a] shadow-[0_0_10px_#55ff9a]" : "bg-[#ffb000] shadow-[0_0_10px_#ffb000]"}`} />{status.data?.spotifyConfigured ? "SPOTIFY LINK // ONLINE" : "SPOTIFY LINK // CONFIG REQUIRED"}</div></div>
        </section>

        <form onSubmit={submit} className="relative mb-12 flex max-w-4xl gap-3"><div className="relative flex-1"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#00e7ff]" size={18} /><Input value={term} onChange={e => setTerm(e.target.value)} placeholder="Artista, canción o álbum..." className="h-16 rounded-none border-[#00e7ff]/40 bg-[#0b0c12]/90 pl-14 font-display text-base text-white placeholder:text-white/30 focus-visible:border-[#ff2db2] focus-visible:ring-[#ff2db2]" /></div><Button type="submit" className="h-16 rounded-none bg-[#ff2db2] px-7 font-display font-bold uppercase tracking-wider text-black hover:bg-[#ff65c8]">Scan</Button></form>

        {!status.data?.spotifyConfigured && <div className="hud-panel mb-10 border-[#ffb000]/40 bg-[#ffb000]/5 p-5 font-mono text-xs leading-6 text-[#ffd37a]"><span className="mr-2 text-[#ffb000]">[NOTICE]</span> El panel de Spotify está temporalmente inaccesible. La interfaz ya está lista; cuando agregues SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET en los secretos del proyecto, la búsqueda se activará sin modificar el cliente.</div>}

        {submitted && <div className="mb-6 flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.3em] text-[#00e7ff]">Results for</p><h3 className="font-display text-2xl font-bold">{submitted}</h3></div>{search.isFetching && <Loader2 className="animate-spin text-[#ff2db2]" size={20} />}</div>}
        {search.error && <div className="hud-panel mb-8 border-[#ff4d6d]/50 bg-[#ff4d6d]/5 p-5 font-mono text-xs leading-6 text-[#ff9aaa]"><span className="mr-2 text-[#ff4d6d]">[ERROR]</span> No se pudo consultar Spotify. Verificá la configuración del backend o reintentá más tarde.</div>}
        {tracks.length > 0 ? <><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{tracks.map(track => <button key={track.id} onClick={() => setSelected(track)} className="hud-card group text-left"><div className="aspect-square overflow-hidden bg-[#11121a]">{track.imageUrl ? <img src={track.imageUrl} alt={`Carátula de ${track.album}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-80" /> : <div className="grid h-full place-items-center text-[#ff2db2]"><Headphones /></div>}</div><div className="p-4"><p className="truncate font-display font-bold">{track.name}</p><p className="mt-1 truncate text-sm text-[#00e7ff]">{track.artist}</p><div className="mt-4 flex justify-between font-mono text-[10px] uppercase tracking-wider text-white/40"><span>{track.releaseYear}</span><span>{track.durationLabel}</span></div></div></button>)}</div>{search.data?.nextOffset !== null && search.data?.nextOffset !== undefined && <div className="mt-10 text-center"><Button onClick={loadMore} disabled={search.isFetching} variant="outline" className="rounded-none border-[#00e7ff]/50 bg-transparent font-mono text-xs uppercase tracking-[.2em] text-[#00e7ff] hover:bg-[#00e7ff]/10">{search.isFetching ? "Scanning..." : "Ver más resultados"}</Button></div>}</> : submitted && !search.isFetching && <div className="hud-panel py-20 text-center font-mono text-sm text-white/45">{status.data?.spotifyConfigured ? "No se encontraron señales para esta búsqueda." : "Esperando credenciales seguras de Spotify para iniciar el escaneo."}</div>}
        {!submitted && <div className="grid min-h-[260px] place-items-center border border-dashed border-white/10 py-16 text-center"><div><div className="mx-auto mb-5 grid h-14 w-14 place-items-center border border-[#00e7ff]/40 text-[#00e7ff]"><Search size={24} /></div><p className="font-mono text-xs uppercase tracking-[.25em] text-white/35">No signal selected</p><p className="mt-2 text-sm text-white/45">Escribí una búsqueda para iniciar el escaneo.</p></div></div>}
      </div>

      {selected && <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={() => setSelected(null)}><section onClick={e => e.stopPropagation()} className="hud-panel max-h-[90vh] w-full max-w-4xl overflow-y-auto border-[#ff2db2]/50 bg-[#0a0a10] p-6 sm:p-8"><div className="mb-7 flex justify-end"><button onClick={() => setSelected(null)} className="text-white/50 hover:text-[#ff2db2]" aria-label="Cerrar"><X /></button></div><div className="grid gap-8 md:grid-cols-[240px_1fr]"><div className="aspect-square overflow-hidden border border-white/10">{selected.imageUrl && <img src={selected.imageUrl} alt={`Carátula de ${selected.album}`} className="h-full w-full object-cover" />}</div><div><p className="font-mono text-[10px] uppercase tracking-[.35em] text-[#00e7ff]">Track dossier</p><h2 className="mt-3 font-display text-4xl font-black leading-none">{selected.name}</h2><p className="mt-3 text-xl text-[#ff2db2]">{selected.artist}</p><div className="mt-7 grid grid-cols-2 gap-4 border-y border-white/10 py-5 font-mono text-xs"><span><b className="block text-white/35">ALBUM</b>{selected.album}</span><span><b className="block text-white/35">RELEASE</b>{selected.releaseYear}</span><span><b className="block text-white/35">DURATION</b>{selected.durationLabel}</span><span><b className="block text-white/35">POPULARITY</b>{selected.popularity}/100</span><span className="col-span-2"><b className="block text-white/35">MARKETS</b><span className="mt-1 block leading-5 text-white/70">{selected.availableMarkets.length ? selected.availableMarkets.slice(0, 12).join(" · ") : "No informado"}{selected.availableMarkets.length > 12 ? " · …" : ""}</span></span></div><a href={selected.spotifyUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[.18em] text-[#00e7ff] hover:text-white">Abrir en Spotify <ExternalLink size={14} /></a></div></div><div className="mt-10 border-t border-white/10 pt-7"><div className="flex items-center gap-3"><div className="h-px w-8 bg-[#ff2db2]" /><h3 className="font-mono text-xs uppercase tracking-[.3em] text-[#ff2db2]">Lyrics channel</h3></div><p className="mt-5 max-w-2xl text-sm leading-7 text-white/60">{lyrics.isLoading ? "Buscando coincidencia en Genius..." : lyrics.error ? "No se pudo consultar Genius. Reintentá más tarde." : lyrics.data?.message}</p>{lyrics.data?.sourceUrl && <a href={lyrics.data.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 border border-[#ff2db2]/50 px-4 py-3 font-mono text-xs uppercase tracking-wider text-[#ff2db2] hover:bg-[#ff2db2]/10">Leer en Genius <ExternalLink size={14} /></a>}</div></section></div>}
    </main>
  );
}
