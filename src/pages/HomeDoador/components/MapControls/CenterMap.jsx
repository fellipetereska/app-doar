import { useEffect } from "react";
import { useMap } from "react-leaflet";

const CenterMap = ({ center, zoom, animate = true }) => {
  const map = useMap();
  map.zoomControl.remove();

  useEffect(() => {
    if (animate) {
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.5,
      });
    } else {
      map.setView(center, zoom);
    }
  }, [center, zoom, map, animate]);

  return null;
};

export default CenterMap;