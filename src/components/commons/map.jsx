import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = "pk.eyJ1IjoibW9vdmlqb2IiLCJhIjoiY2tuenYyZGI4MDltYzJwbXZwNTV5eWNobCJ9.NvAh02Q732tcCkLM7DJywg";

const MapComponent = ({ searchQuery }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map) return;

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [6.1727, 49.1193],
      zoom: 13,
      dragRotate: false,
      pitchWithRotate: false,
    });

    setMap(newMap);
  }, []);

  useEffect(() => {
    if (map && searchQuery) {
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}`;

      fetch(geocodeUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.features && data.features.length > 0) {
            const [longitude, latitude] = data.features[0].center;
            map.setCenter([longitude, latitude]);
            map.setZoom(12);
          }
        })
        .catch((error) => console.error('Error fetching geocode data:', error));
    }
  }, [searchQuery, map]);

  return (
    <div
      ref={mapContainer}
      className="fixed top-0 left-0 w-screen h-screen z-0"
    />
  );
};

export default MapComponent;
