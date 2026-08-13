/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import { Place } from './types';
import { fetchSfaxPlaces } from './lib/wikidata';
import { Globe, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t, i18n } = useTranslation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlaces() {
      setLoading(true);
      const data = await fetchSfaxPlaces(i18n.language);
      setPlaces(data);
      setLoading(false);
    }
    loadPlaces();
  }, [i18n.language]);

  const selectedPlace = places.find(p => p.id === selectedPlaceId) || null;

  return (
    <div className="flex flex-col h-screen w-full bg-[#FDFCFB] overflow-hidden font-serif" dir={i18n.dir()}>
      {/* Header */}
      <header className="h-16 border-b border-[#E8E2D9] flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#5A5A40] rounded-full flex items-center justify-center text-[#FDFCFB]">
            <Globe className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#3D3B36] uppercase">
            {t('title').split(' ').map((word, i, arr) => 
              i === arr.length - 1 ? <span key={i} className="text-[#5A5A40] font-normal lowercase italic">{word}</span> : <React.Fragment key={i}>{word} </React.Fragment>
            )}
          </h1>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium uppercase tracking-widest text-[#7A746B]">
          <span className="text-[#5A5A40] border-b border-[#5A5A40] pb-1 cursor-default">{t('interactive_map')}</span>
          <a href="https://www.wikidata.org/" target="_blank" rel="noopener noreferrer" className="hover:text-[#5A5A40] transition-colors cursor-pointer opacity-50 flex items-center gap-1">
            {t('powered_by_wikidata')}
          </a>
        </nav>
        
        <div className="flex gap-2 text-xs font-medium uppercase tracking-widest">
          {['en', 'fr', 'ar'].map((lang) => (
            <button
              key={lang}
              onClick={() => i18n.changeLanguage(lang)}
              className={`px-2 py-1 rounded ${i18n.language === lang ? 'bg-[#5A5A40] text-white' : 'text-[#7A746B] hover:bg-[#E8E2D9]'}`}
            >
              {lang}
            </button>
          ))}
        </div>
      </header>

      {/* Main Map Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 z-20 bg-slate-50/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#5A5A40] animate-spin mb-4" />
            <p className="text-[#7A746B] font-medium font-serif">{t('fetching_locations')}</p>
          </div>
        )}
        
        <div className="flex-1 relative bg-[#F5F2ED]">
          <div className="absolute inset-0 opacity-20 pointer-events-none z-10" style={{ backgroundImage: 'radial-gradient(#5A5A40 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute inset-0 z-0">
            <MapView 
              places={places} 
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={(place) => setSelectedPlaceId(place.id)}
            />
          </div>
          <div className={`absolute top-8 ${i18n.dir() === 'rtl' ? 'left-8' : 'right-8'} bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm border border-[#E8E2D9] z-[400] pointer-events-none`}>
            <div className="text-[10px] text-[#7A746B] uppercase tracking-widest font-bold mb-1">{t('status')}</div>
            <div className="text-sm font-mono text-[#5A5A40]">{places.length} {t('locations')}</div>
          </div>
        </div>
        
        <AnimatePresence>
          {selectedPlaceId && (
            <Sidebar 
              place={selectedPlace} 
              onClose={() => setSelectedPlaceId(null)} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
