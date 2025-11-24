import React from 'react';
import { ChampionGuide } from '../types';
import { KeyCap } from './KeyCap';
import { Sword, Shield, Zap, Scroll, Target, Info, Crosshair } from 'lucide-react';

interface GuideDisplayProps {
  data: ChampionGuide;
}

const DDRAGON_VER = "14.21.1";
const DDRAGON_CDN = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img`;
const DDRAGON_IMG = "https://ddragon.leagueoflegends.com/cdn/img";

export const GuideDisplay: React.FC<GuideDisplayProps> = ({ data }) => {
  const splashUrl = `${DDRAGON_IMG}/champion/splash/${data.championId}_0.jpg`;
  const iconUrl = `${DDRAGON_CDN}/champion/${data.championId}.png`;

  const getItemUrl = (id: string) => `${DDRAGON_CDN}/item/${id}.png`;
  const getRuneUrl = (path: string) => `${DDRAGON_IMG}/${path}`;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Hero Section with Splash Art */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#C8AA6E]/30 mb-10 group">
        <div className="absolute inset-0 bg-gradient-to-t from-[#091428] via-[#091428]/60 to-transparent z-10"></div>
        <img 
          src={splashUrl} 
          alt={data.championName} 
          className="w-full h-64 md:h-[400px] object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        
        <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-10 flex flex-col md:flex-row items-end md:items-center gap-6">
          <img 
            src={iconUrl} 
            alt="Icon" 
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#C8AA6E] shadow-lg"
            onError={(e) => (e.target as HTMLImageElement).src = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/29.jpg'}
          />
          <div className="flex-1">
            <h2 className="text-4xl md:text-7xl font-bold text-[#F0E6D2] uppercase tracking-widest drop-shadow-xl font-serif leading-none">
              {data.championName}
            </h2>
            <p className="text-[#C8AA6E] text-xl md:text-2xl font-medium tracking-wide italic mt-2">
              "{data.title}"
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
             <div className="flex gap-2">
                <span className="px-4 py-1.5 bg-gradient-to-r from-[#0AC8B9]/20 to-[#0397AB]/20 border border-[#0AC8B9] rounded text-[#0AC8B9] uppercase text-sm font-bold tracking-wider backdrop-blur-md">
                  {data.role}
                </span>
             </div>
             <span className="text-slate-300 text-sm italic max-w-xs text-right hidden md:block drop-shadow-md">
                {data.playstyle}
              </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Combos */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-900/30 rounded-lg border border-cyan-500/30">
                <Zap className="text-cyan-400 w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 uppercase tracking-wide">Combos Letales</h3>
          </div>
          
          <div className="space-y-6">
            {data.combos.map((combo, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-xl border-l-4 border-l-cyan-600 hover:bg-slate-800/80 transition-all shadow-lg group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-cyan-100 group-hover:text-cyan-300 transition-colors">{combo.name}</h4>
                    <span className="text-xs text-cyan-500 uppercase tracking-wider font-semibold">{combo.damageType}</span>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-bold uppercase border
                    ${combo.difficulty === 'Fácil' ? 'bg-green-900/30 border-green-500/30 text-green-400' : ''}
                    ${combo.difficulty === 'Medio' ? 'bg-yellow-900/30 border-yellow-500/30 text-yellow-400' : ''}
                    ${combo.difficulty === 'Difícil' ? 'bg-orange-900/30 border-orange-500/30 text-orange-400' : ''}
                    ${combo.difficulty === 'Insano' ? 'bg-red-900/30 border-red-500/30 text-red-500 animate-pulse' : ''}
                  `}>
                    {combo.difficulty}
                  </span>
                </div>
                
                <div className="relative mb-6 p-4 bg-[#091428]/80 rounded-lg border border-slate-700/50">
                  <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start relative z-10">
                    {combo.sequence.map((step, i) => (
                      <div key={i} className="flex items-center">
                        <KeyCap k={step} />
                        {i < combo.sequence.length - 1 && (
                          <div className="mx-2 text-slate-600">
                             <Crosshair className="w-4 h-4 opacity-50 rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Subtle background decoration */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-transparent rounded-lg pointer-events-none"></div>
                </div>
                
                <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-700/50 pt-4">
                  {combo.description}
                </p>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="mt-8 glass-panel p-8 rounded-xl border border-[#C8AA6E]/30 bg-gradient-to-br from-[#091428] to-[#1E2328]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#C8AA6E]/20 rounded-lg border border-[#C8AA6E]/30">
                <Info className="text-[#C8AA6E] w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F0E6D2] uppercase tracking-wide">Consejos de Challenger</h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.tips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 text-slate-300 text-sm bg-slate-900/50 p-4 rounded border border-slate-700 hover:border-[#C8AA6E]/50 transition-colors">
                  <span className="text-[#C8AA6E] font-bold mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Runes & Items */}
        <div className="space-y-8">
          
          {/* Runes */}
          <div className="glass-panel p-6 rounded-xl border-t-4 border-t-purple-600 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
                <img src={getRuneUrl(data.runes.primary.treeIcon)} alt="" className="w-40 h-40" />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 bg-purple-900/30 rounded-lg border border-purple-500/30">
                 <Scroll className="text-purple-400 w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-200 uppercase tracking-wide">Runas</h3>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Primary Tree */}
              <div>
                <h4 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                  <img src={getRuneUrl(data.runes.primary.treeIcon)} className="w-6 h-6 grayscale hover:grayscale-0 transition-all" alt={data.runes.primary.treeName}/>
                  {data.runes.primary.treeName}
                </h4>
                <div className="bg-[#091428] p-4 rounded-lg border border-purple-500/20 shadow-inner">
                  <div className="flex flex-col items-center mb-4">
                    <img 
                        src={getRuneUrl(data.runes.primary.keystoneIcon)} 
                        alt={data.runes.primary.keystone}
                        className="w-16 h-16 mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    />
                    <div className="text-[#F0E6D2] font-bold text-center">
                      {data.runes.primary.keystone}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-purple-900/30 -translate-x-1/2"></div>
                    {data.runes.primary.slots.map((rune, i) => (
                      <div key={i} className="text-slate-400 text-sm text-center bg-[#091428] z-10 py-1">
                        {rune}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Secondary Tree */}
              <div>
                <h4 className="text-blue-300 font-bold mb-3 flex items-center gap-2">
                   <img src={getRuneUrl(data.runes.secondary.treeIcon)} className="w-5 h-5 grayscale hover:grayscale-0 transition-all" alt={data.runes.secondary.treeName}/>
                  {data.runes.secondary.treeName}
                </h4>
                <div className="bg-[#091428] p-4 rounded-lg border border-blue-500/20 shadow-inner">
                  <div className="flex flex-col gap-2 relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-900/30 -translate-x-1/2"></div>
                    {data.runes.secondary.slots.map((rune, i) => (
                      <div key={i} className="text-slate-400 text-sm text-center bg-[#091428] z-10 py-1">{rune}</div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-2 text-xs text-slate-500 bg-slate-900/50 p-2 rounded">
                 {data.runes.shards.map((shard, i) => (
                    <span key={i} className="px-2 border-r border-slate-700 last:border-0">{shard}</span>
                 ))}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="glass-panel p-6 rounded-xl border-t-4 border-t-yellow-600">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                 <Sword className="text-yellow-400 w-6 h-6" />
               </div>
              <h3 className="text-2xl font-bold text-slate-200 uppercase tracking-wide">Build</h3>
            </div>

            <div className="space-y-8">
              {data.items.map((group, idx) => (
                <div key={idx} className="relative">
                   <h4 className="text-[#C8AA6E] font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8AA6E]"></span>
                    {group.category}
                   </h4>
                   <div className="flex flex-wrap gap-3 mb-3">
                     {group.items.map((item, i) => (
                       <div key={i} className="group/item relative">
                         <div className="w-12 h-12 md:w-14 md:h-14 rounded bg-slate-800 border-2 border-slate-600 hover:border-[#C8AA6E] transition-all overflow-hidden relative">
                            <img 
                                src={getItemUrl(item.id)} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                   (e.target as HTMLImageElement).src = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/29.jpg';
                                   (e.target as HTMLImageElement).style.opacity = '0.5';
                                }}
                            />
                         </div>
                         {/* Tooltip */}
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-[#C8AA6E] text-xs rounded opacity-0 group-hover/item:opacity-100 whitespace-nowrap z-20 pointer-events-none border border-[#C8AA6E]/30">
                           {item.name}
                         </div>
                       </div>
                     ))}
                   </div>
                   <p className="text-xs text-slate-500 italic pl-2 border-l-2 border-slate-700">
                     {group.reason}
                   </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};