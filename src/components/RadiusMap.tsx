import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/helpers';
import circle from '@turf/circle';

interface RadiusMapProps {
  center: [number, number] | null;
  radiusMiles: number;
}

export function RadiusMap({ center, radiusMiles }: RadiusMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
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
      
      // Add the radius circle source
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

      // Add a transparent fill layer
      map.current?.addLayer({
        id: 'radius-circle-fill',
        type: 'fill',
        source: 'radius-circle',
        paint: {
          'fill-color': '#008080',
          'fill-opacity': 0.2,
        },
      });

      // Add a stroke layer
      map.current?.addLayer({
        id: 'radius-circle-stroke',
        type: 'line',
        source: 'radius-circle',
        paint: {
          'line-color': '#008080',
          'line-width': 2,
        },
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update circle when center or radius changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const coordinates = center || [-122.4194, 37.7749];
    
    // Create a circle using turf
    const options = { steps: 64, units: 'miles' as const };
    const circleGeojson = circle(coordinates, radiusMiles, options);

    // Update the circle source
    const source = map.current.getSource('radius-circle') as mapboxgl.GeoJSONSource;
    source?.setData(circleGeojson);

    // Center map on the location with appropriate zoom
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