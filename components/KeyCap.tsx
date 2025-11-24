import React from 'react';

interface KeyCapProps {
  k: string;
}

export const KeyCap: React.FC<KeyCapProps> = ({ k }) => {
  const isUlt = k.toUpperCase() === 'R';
  const isSummoner = ['FLASH', 'IGNITE', 'GHOST', 'TP'].includes(k.toUpperCase());
  const isAuto = k.toUpperCase() === 'AA' || k.toUpperCase() === 'AUTO';

  let borderColor = 'border-slate-500';
  let bgColor = 'bg-slate-800';
  let textColor = 'text-slate-200';

  if (isUlt) {
    borderColor = 'border-red-500';
    bgColor = 'bg-red-900/30';
    textColor = 'text-red-300';
  } else if (isSummoner) {
    borderColor = 'border-yellow-500';
    bgColor = 'bg-yellow-900/30';
    textColor = 'text-yellow-300';
  } else if (isAuto) {
    borderColor = 'border-stone-500';
    bgColor = 'bg-stone-800';
    textColor = 'text-stone-400';
  } else if (['Q', 'W', 'E'].includes(k.toUpperCase())) {
    borderColor = 'border-cyan-500';
    bgColor = 'bg-cyan-900/30';
    textColor = 'text-cyan-300';
  }

  return (
    <div className={`
      flex items-center justify-center 
      w-10 h-10 md:w-12 md:h-12 
      rounded-lg border-b-4 active:border-b-0 active:translate-y-1
      font-bold text-sm md:text-lg shadow-lg transition-all
      ${borderColor} ${bgColor} ${textColor}
    `}>
      {k}
    </div>
  );
};