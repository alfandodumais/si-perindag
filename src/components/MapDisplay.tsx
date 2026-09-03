'use client';

import React, { useEffect, useRef } from 'react';

export interface MerchantPin {
  id: string;
  registrationNo: string;
  businessName: string;
  ownerName: string;
  category: string;
  scale: string;
  address: string;
  district: string;
  status: string;
  latitude: number;
  longitude: number;
  businessImage?: string | null;
  phone?: string;
}

interface MapDisplayProps {
  merchants: MerchantPin[];
  height?: string;
  selectedId?: string | null;
  onSelectMerchant?: (merchant: MerchantPin) => void;
}

export default function MapDisplay({
  merchants,
  height = '500px',
  selectedId,
  onSelectMerchant,
}: MapDisplayProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      if (!mapInstanceRef.current && isMounted && mapContainerRef.current) {
        const defaultCenter: [number, number] = merchants.length > 0 && merchants[0].latitude
          ? [merchants[0].latitude, merchants[0].longitude]
          : [1.4822, 124.8428];

        const map = L.map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: 13,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor',
          maxZoom: 19,
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);

        mapInstanceRef.current = map;
        markersLayerRef.current = markersLayer;
      }

      // Populate markers
      if (mapInstanceRef.current && markersLayerRef.current) {
        markersLayerRef.current.clearLayers();

        const validPins = merchants.filter(
          (m) => typeof m.latitude === 'number' && typeof m.longitude === 'number' && !isNaN(m.latitude)
        );

        if (validPins.length === 0) return;

        const bounds = L.latLngBounds([]);

        validPins.forEach((m) => {
          let pinColor = '#16a34a'; // Green (Approved)
          let statusLabel = 'Terverifikasi';
          let statusBg = '#dcfce7';
          let statusText = '#15803d';

          if (m.status === 'PENDING') {
            pinColor = '#d97706'; // Amber
            statusLabel = 'Menunggu Verifikasi';
            statusBg = '#fef3c7';
            statusText = '#b45309';
          } else if (m.status === 'REJECTED') {
            pinColor = '#dc2626'; // Red
            statusLabel = 'Ditolak';
            statusBg = '#fee2e2';
            statusText = '#b91c1c';
          }

          const iconHtml = `
            <div style="background-color: ${pinColor}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2.5px solid white; transition: transform 0.2s;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
                <path d="M2 7h20"/>
              </svg>
            </div>
          `;

          const pinIcon = L.divIcon({
            className: 'custom-merchant-pin',
            html: iconHtml,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          const marker = L.marker([m.latitude, m.longitude], { icon: pinIcon });

          const popupContent = `
            <div style="min-width: 200px; font-family: sans-serif;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 10px; font-weight: 700; color: ${statusText}; background-color: ${statusBg}; padding: 2px 6px; border-radius: 9999px;">
                  ${statusLabel}
                </span>
                <span style="font-size: 10px; color: #64748b;">${m.registrationNo}</span>
              </div>
              <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${m.businessName}</h4>
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #475569;">Pemilik: <b>${m.ownerName}</b></p>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">
                <span>Kategori: <b>${m.category}</b></span> • <span>Skala: <b>${m.scale}</b></span>
              </div>
              <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.4;">${m.address}, Kec. ${m.district}</p>
            </div>
          `;

          marker.bindPopup(popupContent);

          marker.on('click', () => {
            if (onSelectMerchant) {
              onSelectMerchant(m);
            }
          });

          marker.addTo(markersLayerRef.current);
          bounds.extend([m.latitude, m.longitude]);
        });

        if (validPins.length > 0) {
          mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
        }
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
  }, [merchants]);

  // Center on selected merchant if prop updates
  useEffect(() => {
    if (selectedId && mapInstanceRef.current) {
      const target = merchants.find((m) => m.id === selectedId);
      if (target && target.latitude && target.longitude) {
        mapInstanceRef.current.setView([target.latitude, target.longitude], 16, {
          animate: true,
        });
      }
    }
  }, [selectedId, merchants]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
