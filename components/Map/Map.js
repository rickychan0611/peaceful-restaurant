import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Loader from '../../components/Loader';
import { MAP_API } from '../../env';
import router from 'next/router';

export default function Map({ addresses }) {
  const router = useRouter();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: MAP_API // ,
    // ...otherOptions
  });

  const mapContainerStyle = {
    height: '80vh',
    width: '100%'
  };

  const center = {
    lat: 49.21219277520741,
    lng: -122.99914925688586
  };

  const mapRef = useRef();
  const markerRef = useRef();

  const getFitBounds = (map) => {
    console.log("markerRef", markerRef)
    let positions = mapRef.current.props.children
    if (map) {
      const bounds = new google.maps.LatLngBounds();

      positions.forEach((position) => {
        let bound = new google.maps.LatLng(position.props.position.lat, position.props.position.lng);
        bounds.extend(bound);
      });

      map.fitBounds(bounds)
    }
  };

  const RenderMap = () => {
    return (
      <>
        <GoogleMap
          ref={mapRef}
          id="marker-example"
          mapContainerStyle={mapContainerStyle}
          defaultZoom={11.3}
          defaultCenter={center}
          onLoad={getFitBounds}>
          
          {addresses.map((address, i) => {
            return (
            <Marker 
            ref={markerRef}
            position={{ lat: address.lat, lng: address.lng }} 
            key={i} 
            onClick={() => {router.push('/shop/' + address.name + "/" + address.id)}}
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
