import React, { useEffect } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import { useMap } from 'react-map-gl/maplibre';

const Bairros = ({ data }) => {
  const { 'main-map': map } = useMap();

  // Handler para hover - mudar estilo ao passar mouse
  useEffect(() => {
    if (!map || !data) return;

    const handleMouseEnter = (e) => {
      const feature = e.features?.[0];
      if (!feature) return;

      map.setFeatureState(
        { source: 'bairros', id: feature.id },
        { hover: true }
      );
    };

    const handleMouseLeave = (e) => {
      const feature = e.features?.[0];
      if (!feature) return;

      map.setFeatureState(
        { source: 'bairros', id: feature.id },
        { hover: false }
      );
    };

    const handleClick = (e) => {
      const feature = e.features?.[0];
      if (!feature) return;

      // Obter bounds do feature
      const coordinates = feature.geometry.coordinates[0];
      if (!coordinates || coordinates.length === 0) return;

      // Calcular bounds
      let minLng = Infinity;
      let maxLng = -Infinity;
      let minLat = Infinity;
      let maxLat = -Infinity;

      coordinates.forEach((coord) => {
        const [lng, lat] = coord;
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      });

      // Fazer zoom para o bairro
      map.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat]
        ],
        {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: 500
        }
      );

      // Resetar estado de hover de todos os features
      if (data.features) {
        data.features.forEach((f) => {
          if (f.id !== feature.id) {
            map.setFeatureState(
              { source: 'bairros', id: f.id },
              { hover: false, selected: false }
            );
          }
        });
      }

      // Marcar como selecionado
      map.setFeatureState(
        { source: 'bairros', id: feature.id },
        { selected: true }
      );
    };

    // Adicionar event listeners
    map.on('mouseenter', 'bairros-fill', handleMouseEnter);
    map.on('mouseleave', 'bairros-fill', handleMouseLeave);
    map.on('click', 'bairros-fill', handleClick);

    // Mudar cursor ao passar sobre os bairros
    map.on('mouseenter', 'bairros-fill', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'bairros-fill', () => {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      map.off('mouseenter', 'bairros-fill', handleMouseEnter);
      map.off('mouseleave', 'bairros-fill', handleMouseLeave);
      map.off('click', 'bairros-fill', handleClick);
    };
  }, [map, data]);

  // Se não há dados, não renderizar nada
  if (!data || !data.features || data.features.length === 0) {
    return null;
  }

  return (
    <Source
      id="bairros"
      type="geojson"
      data={data}
    >
      {/* Layer de preenchimento */}
      <Layer
        id="bairros-fill"
        type="fill"
        paint={{
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#00441b', // Cor mais escura no hover
            ['boolean', ['feature-state', 'selected'], false],
            '#000000', // Preto quando selecionado
            [
              'interpolate',
              ['linear'],
              ['get', 'DENSITY'],
              0, '#74c476',
              100, '#41ab5d',
              200, '#238b45',
              500, '#006d2c',
              1000, '#00441b'
            ]
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.9,
            ['boolean', ['feature-state', 'selected'], false],
            0.8,
            0.2
          ]
        }}
      />
      
      {/* Layer de bordas */}
      <Layer
        id="bairros-line"
        type="line"
        paint={{
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#00441b',
            ['boolean', ['feature-state', 'selected'], false],
            '#000000',
            '#ffffff'
          ],
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            3,
            ['boolean', ['feature-state', 'selected'], false],
            4,
            1
          ]
        }}
      />
    </Source>
  );
};

export default React.memo(Bairros);
