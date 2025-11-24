
import React, { useState, useEffect, useRef } from 'react';
import { SearchState, ChampionSummary } from './types';
import { fetchChampionGuide } from './services/geminiService';
import { GuideDisplay } from './components/GuideDisplay';
import { Search, Loader2, ChevronRight, X, Download } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<SearchState>({
    query: '',
    loading: false,
    error: null,
    data: null
  });

  // Autocomplete state
  const [allChampions, setAllChampions] = useState<ChampionSummary[]>([]);
  const [suggestions, setSuggestions] = useState<ChampionSummary[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [ddragonVersion, setDdragonVersion] = useState("14.21.1");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // PWA Install state
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Fetch Champion List on Mount
  useEffect(() => {
    const fetchChampions = async () => {
      try {
        // 1. Get latest version
        const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await versionRes.json();
        const latestVersion = versions[0];
        setDdragonVersion(latestVersion);

        // 2. Get champion data
        const champRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/es_ES/champion.json`);
        const champData = await champRes.json();
        
        // Convert object to array
        const champList: ChampionSummary[] = Object.values(champData.data);
        // Sort alphabetically
        champList.sort((a, b) => a.name.localeCompare(b.name));
        
        setAllChampions(champList);
      } catch (e) {
        console.error("Failed to fetch champion list", e);
      }
    };

    fetchChampions();
  }, []);

  // Listen for PWA install prompt (Android/Chrome)
  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    // Show the install prompt
    installPrompt.prompt();
    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setInstallPrompt(null);
      } else {
        console.log('User dismissed the install prompt');
      }
    });
  };

  // Filter suggestions when query changes
  useEffect(() => {
    if (state.query.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const lowerQuery = state.query.toLowerCase();
    const filtered = allChampions.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.id.toLowerCase().includes(lowerQuery)
    );
    setSuggestions(filtered);
  }, [state.query, allChampions]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e?: React.FormEvent, specificChampion?: string) => {
    if (e) e.preventDefault();
    
    const searchTerm = specificChampion || state.query;
    if (!searchTerm.trim()) return;

    setShowSuggestions(false);
    setState(prev => ({ ...prev, query: searchTerm, loading: true, error: null, data: null }));

    try {
      const data = await fetchChampionGuide(searchTerm);
      setState(prev => ({ ...prev, loading: false, data }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "No pudimos encontrar datos para este campeón. Intenta verificar el nombre." 
      }));
    }
  };

  const handleSelectChampion = (champ: ChampionSummary) => {
    setState(prev => ({ ...prev, query: champ.name }));
    handleSearch(undefined, champ.name);
  };

  return (
    <div className="min-h-screen bg-[#091428] text-slate-200 font-sans selection:bg-[#C8AA6E] selection:text-[#091428]">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#1a2a3f,transparent)]"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_100%_100%,#092f3f,transparent)]"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        
        {/* Navigation / Header */}
        <header className="flex flex-col items-center justify-center mb-12 mt-8 relative">
          
          {/* PWA Install Button (Only visible if installable) */}
          {installPrompt && (
            <button 
              onClick={handleInstallClick}
              className="absolute right-0 top-0 md:right-10 md:top-2 flex items-center gap-2 px-3 py-1.5 bg-[#C8AA6E]/20 hover:bg-[#C8AA6E]/40 border border-[#C8AA6E] text-[#C8AA6E] rounded-lg transition-all animate-bounce text-sm font-bold uppercase tracking-wider"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Instalar App</span>
              <span className="md:hidden">App</span>
            </button>
          )}

          <div className="mb-6 relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#C8AA6E] to-[#0AC8B9] opacity-75 blur animate-pulse"></div>
            <h1 className="relative bg-[#091428] px-6 py-2 rounded-full border border-[#C8AA6E] text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#F0E6D2] to-[#C8AA6E]">
              LoL Tactician AI
            </h1>
          </div>
          <p className="text-slate-400 text-center max-w-lg">
            Domina la Grieta. Genera combos, runas y builds optimizados por IA.
          </p>
        </header>

        {/* Search Box - Sticky behavior via CSS if needed, but relative here for focus */}
        <div className="max-w-xl mx-auto mb-16 sticky top-4 z-50" ref={searchContainerRef}>
          <form onSubmit={(e) => handleSearch(e)} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0AC8B9] to-[#C8AA6E] rounded-lg opacity-50 group-hover:opacity-100 transition duration-500 blur"></div>
            <div className="relative flex items-center bg-[#091428] rounded-lg overflow-hidden border border-[#C8AA6E]/30">
              <input
                type="text"
                value={state.query}
                onChange={(e) => {
                    setState(prev => ({ ...prev, query: e.target.value }));
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Busca un campeón..."
                className="w-full bg-transparent px-6 py-4 text-lg text-[#F0E6D2] placeholder-slate-600 focus:outline-none"
                autoComplete="off"
              />
              
              {state.query && (
                <button
                  type="button"
                  onClick={() => {
                    setState(prev => ({ ...prev, query: '' }));
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}
                  className="p-2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <button 
                type="submit"
                disabled={state.loading}
                className="px-6 py-4 text-[#C8AA6E] hover:text-[#F0E6D2] hover:bg-[#1E2328] transition-colors disabled:opacity-50 border-l border-[#C8AA6E]/10"
              >
                {state.loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Dropdown Suggestions */}
            {showSuggestions && (allChampions.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#091428]/95 backdrop-blur-xl border border-[#C8AA6E]/30 rounded-lg shadow-2xl overflow-hidden z-50 animate-fade-in max-h-[60vh] overflow-y-auto custom-scrollbar">
                 {suggestions.length > 0 ? (
                   suggestions.map((champ) => (
                     <div
                       key={champ.id}
                       onMouseDown={() => handleSelectChampion(champ)}
                       className="flex items-center gap-4 p-3 hover:bg-[#C8AA6E]/20 cursor-pointer transition-colors border-b border-slate-800 last:border-0 group/item"
                     >
                       <img 
                         src={`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${champ.image.full}`} 
                         alt={champ.name}
                         className="w-10 h-10 rounded border border-[#C8AA6E]/50 group-hover/item:scale-110 transition-transform"
                       />
                       <div className="flex flex-col">
                         <span className="text-[#F0E6D2] font-bold group-hover/item:text-white">{champ.name}</span>
                         <span className="text-xs text-slate-500 italic">{champ.title}</span>
                       </div>
                       <ChevronRight className="ml-auto w-4 h-4 text-[#C8AA6E] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                     </div>
                   ))
                 ) : state.query.trim().length > 0 ? (
                   <div className="p-4 text-center text-slate-500 italic">
                     No se encontraron campeones
                   </div>
                 ) : (
                    // Show some popular/random or just the top list if query is empty but focused
                    allChampions.slice(0, 5).map((champ) => (
                      <div
                       key={champ.id}
                       onMouseDown={() => handleSelectChampion(champ)}
                       className="flex items-center gap-4 p-3 hover:bg-[#C8AA6E]/20 cursor-pointer transition-colors border-b border-slate-800 last:border-0 group/item"
                     >
                       <img 
                         src={`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${champ.image.full}`} 
                         alt={champ.name}
                         className="w-10 h-10 rounded border border-[#C8AA6E]/50"
                       />
                        <div className="flex flex-col">
                         <span className="text-[#F0E6D2] font-bold group-hover/item:text-white">{champ.name}</span>
                         <span className="text-xs text-slate-500 italic">Popular</span>
                       </div>
                     </div>
                    ))
                 )}
              </div>
            )}
          </form>
        </div>

        {/* Content Area */}
        <main className="min-h-[400px]">
          {state.error && (
            <div className="max-w-md mx-auto p-6 bg-red-900/20 border border-red-500/50 rounded-lg text-center text-red-200 animate-fade-in">
              <p>{state.error}</p>
            </div>
          )}

          {!state.data && !state.loading && !state.error && (
            <div className="text-center text-slate-600 py-20 animate-pulse">
              <div className="w-24 h-24 mx-auto border-4 border-slate-700 rounded-full flex items-center justify-center mb-4 bg-[#091428] relative group overflow-hidden">
                <Search className="w-10 h-10 relative z-10" />
                <div className="absolute inset-0 bg-[#C8AA6E] opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              <p className="text-lg">Selecciona un campeón de la lista para ver sus tácticas.</p>
            </div>
          )}

          {state.data && <GuideDisplay data={state.data} />}
        </main>

        {/* Footer */}
        <footer className="text-center text-slate-600 text-xs py-8 mt-12 border-t border-slate-800">
          <div className="mb-4">
            <span className="text-[#C8AA6E] font-bold text-sm tracking-widest uppercase border-b border-[#C8AA6E]/30 pb-1">
              Creado por CHUCHUBLACK
            </span>
          </div>
          <p>LoL Tactician AI no está respaldado por Riot Games y no refleja los puntos de vista u opiniones de Riot Games.</p>
          <p className="mt-2">Datos de versión: {ddragonVersion}</p>
          <p className="mt-1">Powered by Google Gemini 2.5 Flash</p>
        </footer>

      </div>
    </div>
  );
}
