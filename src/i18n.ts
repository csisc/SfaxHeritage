import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: "Sfax Heritage",
      interactive_map: "Interactive Map",
      powered_by_wikidata: "Powered by Wikidata",
      fetching_locations: "Fetching locations from Wikidata...",
      locations: "Locations",
      status: "Status",
      no_description: "No description available.",
      wikimedia_commons: "Wikimedia Commons",
      no_image: "No Image",
      explore_wikipedia: "Explore Wikipedia",
      view_wikidata: "View on Wikidata",
    }
  },
  fr: {
    translation: {
      title: "Patrimoine de Sfax",
      interactive_map: "Carte Interactive",
      powered_by_wikidata: "Propulsé par Wikidata",
      fetching_locations: "Récupération des lieux depuis Wikidata...",
      locations: "Lieux",
      status: "Statut",
      no_description: "Aucune description disponible.",
      wikimedia_commons: "Wikimedia Commons",
      no_image: "Pas d'image",
      explore_wikipedia: "Explorer Wikipédia",
      view_wikidata: "Voir sur Wikidata",
    }
  },
  ar: {
    translation: {
      title: "تراث صفاقس",
      interactive_map: "خريطة تفاعلية",
      powered_by_wikidata: "مدعوم من ويكي بيانات",
      fetching_locations: "جاري جلب الأماكن من ويكي بيانات...",
      locations: "موقع",
      status: "الحالة",
      no_description: "لا يوجد وصف متاح.",
      wikimedia_commons: "ويكيميديا كومنز",
      no_image: "لا توجد صورة",
      explore_wikipedia: "استكشف ويكيبيديا",
      view_wikidata: "عرض على ويكي بيانات",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
