import { useEffect } from "react";
import { useMap } from "react-leaflet";

function MapEvents({ onZoom }) {
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => {
      onZoom(map.getZoom());
    };

    map.on("zoomend", handleZoom);
    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map, onZoom]);

  return null;
}

export default MapEvents;