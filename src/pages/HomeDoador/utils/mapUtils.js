import L from "leaflet";

export const createCustomIcon = (iconUrl, size = [30, 30]) => {
  return new L.Icon({
    iconUrl: iconUrl,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
    popupAnchor: [0, -size[1]],
    className: "company-marker",
  });
};

export const getIconSize = (zoom) => {
  if (zoom <= 5) return [15, 15];
  if (zoom <= 8) return [25, 25];
  if (zoom <= 12) return [35, 35];
  if (zoom <= 15) return [45, 45];
  return [55, 55];
};

// Configuração inicial do ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});