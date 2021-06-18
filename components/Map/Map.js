import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Loader from '../../components/Loader';
import { MAP_API } from '../../env';
import router from 'next/router';
import { useRecoilState } from 'recoil';
import { mapLoaction as setMapLoactionAtom } from '../../data/atoms';

export default function Map({ addresses }) {
  const [mapLoaction, setMapLoaction] = useRecoilState(setMapLoactionAtom);
  const [showLocations, setShowLocations] = useState();
  const router = useRouter();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: MAP_API // ,
    // ...otherOptions
  });

  const mapContainerStyle = {
    height: '95%',
    width: '100%'
  };

  const center = {
    lat: 49.21219277520741,
    lng: -122.99914925688586
  };

  const mapRef = useRef();
  const markerRef = useRef();

  const getFitBounds = (map) => {
    console.log('markerRef', markerRef);
    let positions = mapRef.current.props.children;
    if (map) {
      const bounds = new google.maps.LatLngBounds();

      positions.forEach((position) => {
        let bound = new google.maps.LatLng(
          position.props.position.lat,
          position.props.position.lng
        );
        bounds.extend(bound);
      });

      // Don't zoom in too far on only one marker
      if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
        var extendPoint1 = new google.maps.LatLng(
          bounds.getNorthEast().lat() + 0.005,
          bounds.getNorthEast().lng() + 0.005
        );
        var extendPoint2 = new google.maps.LatLng(
          bounds.getNorthEast().lat() - 0.005,
          bounds.getNorthEast().lng() - 0.005
        );
        bounds.extend(extendPoint1);
        bounds.extend(extendPoint2);
      }
      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    if (mapLoaction) {
      setShowLocations([mapLoaction]);
    } else setShowLocations(addresses);
  }, [mapLoaction]);

  const RenderMap = () => {
    return (
      <>
        <h5>
          <a onClick={() => {
            setMapLoaction()
            setShowLocations(addresses)}
            }>SHOW ALL LOCATIONS</a>
        </h5>
        <GoogleMap
          ref={mapRef}
          id="marker-example"
          mapContainerStyle={mapContainerStyle}
          zoom={11.3}
          center={center}
          onLoad={getFitBounds}>
          {showLocations &&
            showLocations.map((address, i) => {
              return (
                <Marker
                  ref={markerRef}
                  position={{ lat: address.lat, lng: address.lng }}
                  key={i}
                  onClick={() => {
                    router.push('/shop/' + address.name + '/' + address.id);
                  }}
                />
              );
            })}
        </GoogleMap>
      </>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? <RenderMap /> : <Loader />;
}
