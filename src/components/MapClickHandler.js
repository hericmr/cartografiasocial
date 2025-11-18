import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useMap } from 'react-map-gl/maplibre';

const MapClickHandler = ({ setNewLocation, mapId = 'main-map' }) => {
  const maps = useMap();
  const map = maps?.[mapId];

  useEffect(() => {
    if (!map || !setNewLocation) return;

    const handleClick = (e) => {
      const { lng, lat } = e.lngLat;
      setNewLocation((prev) => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, setNewLocation]);

  return null;
};

MapClickHandler.propTypes = {
  setNewLocation: PropTypes.func.isRequired,
  mapId: PropTypes.string,
};

export default MapClickHandler;
