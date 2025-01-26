import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface RadiusMapProps {
  center: [number, number] | null;
  radiusMiles: number;
}

export function RadiusMap({ center, radiusMiles }: RadiusMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const radiusCircle = useRef<mapboxgl.GeoJSONSource | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiYnNjaGVlbWEiLCJhIjoiY202ZHI3eWltMHo4bTJscHl3dWg5bm84MyJ9.9uHYl6mn0fgAFrAx-vetAg';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      zoom: 9,
      center: center || [-122.4194, 37.7749], // Default to San Francisco
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add the radius circle source and layer
      map.current?.addSource('radius-circle', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center || [-122.4194, 37.7749],
          },
          properties: {},
        },
      });

      map.current?.addLayer({
        id: 'radius-circle',
        type: 'circle',
        source: 'radius-circle',
        paint: {
          'circle-radius': {
            stops: [
              [0, 0],
              [20, radiusMiles * 50], // Adjust the multiplier to make the circle more visible
            ],
          },
          'circle-color': '#008080',
          'circle-opacity': 0.2,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#008080',
        },
      });

      radiusCircle.current = map.current?.getSource('radius-circle') as mapboxgl.GeoJSONSource;
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update circle when center or radius changes
  useEffect(() => {
    if (!mapLoaded || !map.current || !radiusCircle.current) return;

    // Update circle center and radius
    radiusCircle.current.setData({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: center || [-122.4194, 37.7749],
      },
      properties: {},
    });

    map.current.setPaintProperty('radius-circle', 'circle-radius', {
      stops: [
        [0, 0],
        [20, radiusMiles * 50], // Adjust the multiplier to make the circle more visible
      ],
    });

    // Center map on the location
    if (center) {
      map.current.flyTo({
        center: center,
        zoom: Math.max(9, 14 - Math.log2(radiusMiles)),
        duration: 1000,
      });
    }
  }, [center, radiusMiles, mapLoaded]);

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}