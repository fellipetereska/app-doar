import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

const MapController = ({ center, zoom }) => {
  const map = useMap();
  const lastCenterRef = useRef(null);

  useEffect(() => {
    const currentCenterStr = JSON.stringify(center);

    if (center && currentCenterStr !== lastCenterRef.current) {
      console.log(`Comando para voar para: ${center} com zoom: ${zoom}`);
      map.flyTo(center, zoom, {
        duration: 1.5, 
        easeLinearity: 0.5,
      });

      lastCenterRef.current = currentCenterStr;
    }
  }, [center, zoom, map]); 
  return null; 
};

export default MapController;