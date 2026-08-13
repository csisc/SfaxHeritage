import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '../types';

// Fix Leaflet marker icon issue in React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (place: Place) => void;
}

function MapController({ selectedPlace }: { selectedPlace: Place | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedPlace) {
      map.flyTo([selectedPlace.lat, selectedPlace.lon], 16, { animate: true, duration: 1 });
    }
  }, [selectedPlace, map]);
  return null;
}

export default function MapView({ places, selectedPlaceId, onSelectPlace }: MapViewProps) {
  const selectedPlace = places.find(p => p.id === selectedPlaceId) || null;

  return (
    <MapContainer 
      center={[34.75, 10.9]} // Center shifted slightly east to cover Sfax and Kerkennah
      zoom={10} 
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map(place => (
        <Marker 
          key={place.id} 
          position={[place.lat, place.lon]}
          eventHandlers={{
            click: () => onSelectPlace(place),
          }}
        />
      ))}
      <MapController selectedPlace={selectedPlace} />
    </MapContainer>
  );
}
