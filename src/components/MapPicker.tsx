'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Navigation, Search, Check } from 'lucide-react';

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

export default function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      // Fix icon URL
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && isMounted && mapContainerRef.current) {
        const initialLat = latitude || 1.4822;
        const initialLng = longitude || 124.8428;

        const map = L.map(mapContainerRef.current, {
          center: [initialLat, initialLng],
          zoom: 14,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor',
          maxZoom: 19,
        }).addTo(map);

        // Custom Pin Icon
        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="background-color: #16a34a; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2.5px solid white;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
          popupAnchor: [0, -34],
        });

        const marker = L.marker([initialLat, initialLng], {
          draggable: true,
          icon: customIcon,
        }).addTo(map);

        marker.bindPopup('<b>Lokasi Usaha Anda</b><br>Geser pin atau klik pada peta untuk memindahkan titik.').openPopup();

        // Marker drag event
        marker.on('dragend', (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          onChange(parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6)));
        });

        // Map click event
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          onChange(parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6)));
          marker.openPopup();
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker position if props change externally
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (currentPos.lat !== latitude || currentPos.lng !== longitude) {
        markerRef.current.setLatLng([latitude, longitude]);
        mapInstanceRef.current.setView([latitude, longitude], mapInstanceRef.current.getZoom());
      }
    }
  }, [latitude, longitude]);

  // Geolocation handler (Get Current Device Location)
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung deteksi lokasi otomatis.');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        onChange(lat, lng);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16);
        }
      },
      (err) => {
        setGeoLocating(false);
        console.warn('Geolocation error:', err);
        alert('Tidak dapat mendeteksi lokasi saat ini. Pastikan izin lokasi diizinkan pada browser.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Search address using OpenStreetMap Nominatim
  const handleSearchAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const top = data[0];
        const lat = parseFloat(parseFloat(top.lat).toFixed(6));
        const lng = parseFloat(parseFloat(top.lon).toFixed(6));
        onChange(lat, lng);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16);
        }
      } else {
        alert('Alamat atau nama lokasi tidak ditemukan. Coba gunakan kata kunci yang lebih spesifik.');
      }
    } catch (error) {
      console.error('Nominatim search error:', error);
      alert('Gagal melakukan pencarian alamat.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Controls: Search and My Location */}
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearchAddress} className="relative flex-1 flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jalan, kelurahan, atau nama gedung..."
            className="w-full pl-9 pr-24 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-perindag-500 bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <button
            type="submit"
            disabled={searching}
            className="absolute right-1 top-1 bottom-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
          >
            {searching ? 'Mencari...' : 'Cari'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={geoLocating}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-perindag-800 bg-perindag-100 hover:bg-perindag-200 rounded-lg transition-colors border border-perindag-300 shrink-0"
        >
          <Navigation className={`w-3.5 h-3.5 ${geoLocating ? 'animate-spin' : ''}`} />
          {geoLocating ? 'Mendeteksi...' : 'Lokasi Saya Saat Ini'}
        </button>
      </div>

      {/* Map Window */}
      <div className="relative border-2 border-dashed border-slate-300 rounded-xl overflow-hidden shadow-inner bg-slate-100 h-72">
        <div ref={mapContainerRef} className="w-full h-full" />
        <div className="absolute top-2 right-2 z-[400] bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-700 border border-slate-200 shadow-sm pointer-events-none">
          Klik peta atau geser pin hijau
        </div>
      </div>

      {/* Coordinate Coordinates readout */}
      <div className="flex items-center justify-between bg-slate-100 px-3 py-2 rounded-lg text-xs text-slate-600 border border-slate-200">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-perindag-600" />
          <span>Koordinat Terpilih:</span>
        </div>
        <div className="font-mono font-medium text-slate-800 flex items-center gap-3">
          <span>Lat: <strong className="text-perindag-700">{latitude || '-'}</strong></span>
          <span>Lng: <strong className="text-perindag-700">{longitude || '-'}</strong></span>
        </div>
      </div>
    </div>
  );
}
