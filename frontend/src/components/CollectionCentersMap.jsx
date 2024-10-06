// src/components/CollectionCentersMap.js

import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correggi l'icona di default di Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

function CollectionCentersMap() {
  const { authState } = useContext(AuthContext);
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get('/collectionCenters', {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        console.log('Centri di Raccolta:', res.data); // Per debugging
        setCenters(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCenters();
  }, [authState.token]);

  return (
    <div>
      <h3>Centri di Raccolta Rifiuti Speciali</h3>
      <MapContainer center={[41.117143, 16.871871]} zoom={13} style={{ height: '400px' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {centers.map((center) => (
          <Marker key={center._id} position={[center.location.coordinates[1], center.location.coordinates[0]]}>
            <Popup>
              <strong>{center.name}</strong><br />
              {center.address}<br />
              Orari: {center.openingHours}<br />
              Rifiuti accettati: {center.wasteTypes.join(', ')}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CollectionCentersMap;
