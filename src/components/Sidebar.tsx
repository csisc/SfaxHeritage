import React, { useEffect, useState } from 'react';
import { Place, WikipediaDetails } from '../types';
import { fetchWikipediaDetails } from '../lib/wikidata';
import { Image as ImageIcon, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  place: Place | null;
  onClose: () => void;
}

export default function Sidebar({ place, onClose }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const [wikiDetails, setWikiDetails] = useState<WikipediaDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadWiki() {
      if (place?.wikipediaUrl) {
        setLoading(true);
        const details = await fetchWikipediaDetails(place.wikipediaUrl, i18n.language);
        setWikiDetails(details);
        setLoading(false);
      } else {
        setWikiDetails(null);
      }
    }
    loadWiki();
  }, [place, i18n.language]);

  if (!place) return null;

  const displayImage = wikiDetails?.thumbnail || place.image;

  return (
    <motion.aside
      initial={{ x: i18n.dir() === 'rtl' ? '-100%' : '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: i18n.dir() === 'rtl' ? '-100%' : '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`absolute top-0 ${i18n.dir() === 'rtl' ? 'left-0 border-r' : 'right-0 border-l'} h-full w-full sm:w-[380px] bg-white/95 backdrop-blur-md border-[#E8E2D9] p-6 flex flex-col gap-6 overflow-hidden z-[1000] shadow-xl`}
    >
      <button 
        onClick={onClose}
        className={`absolute top-4 ${i18n.dir() === 'rtl' ? 'left-4' : 'right-4'} p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full shadow-sm text-[#7A746B] transition-colors z-20`}
      >
        <X className="w-5 h-5" />
      </button>

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-[#E8E2D9] text-[#7A746B] text-[10px] rounded uppercase font-bold tracking-tighter">
            Wikidata {place.id}
          </span>
          <span className="px-2 py-0.5 bg-[#5A5A40]/10 text-[#5A5A40] text-[10px] rounded uppercase font-bold tracking-tighter">
            {place.lat.toFixed(4)}, {place.lon.toFixed(4)}
          </span>
        </div>
        <h2 className="text-3xl font-light text-[#3D3B36] leading-tight pr-8">{place.name}</h2>
        {loading ? (
          <div className="space-y-2 animate-pulse mt-3">
            <div className="h-4 bg-[#E8E2D9] rounded w-full"></div>
            <div className="h-4 bg-[#E8E2D9] rounded w-5/6"></div>
          </div>
        ) : (
          <p className="text-[#7A746B] text-sm mt-3 leading-relaxed">
            {wikiDetails?.extract || place.wikidataDescription || t('no_description')}
          </p>
        )}
      </div>

      <div className="rounded-3xl overflow-hidden border-8 border-white shadow-inner aspect-[4/3] bg-[#F5F2ED] relative shrink-0">
        {displayImage ? (
          <>
            <img 
              src={displayImage} 
              alt={place.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            <div className={`absolute bottom-3 ${i18n.dir() === 'rtl' ? 'right-4' : 'left-4'} text-white text-[10px] uppercase font-bold`}>{t('wikimedia_commons')}</div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#7A746B]">
            <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-xs uppercase tracking-widest font-bold">{t('no_image')}</span>
          </div>
        )}
      </div>

      <div className="mt-auto pt-6 border-t border-[#E8E2D9] flex flex-col gap-3">
        {place.wikipediaUrl && (
          <a 
            href={place.wikipediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-4 bg-[#5A5A40] text-white rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#4A4A35] transition-colors"
          >
            {t('explore_wikipedia')}
          </a>
        )}
        
        <a 
          href={`https://www.wikidata.org/wiki/${place.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-4 bg-transparent border border-[#5A5A40] text-[#5A5A40] rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#5A5A40]/5 transition-colors"
        >
          {t('view_wikidata')}
        </a>
      </div>
    </motion.aside>
  );
}
