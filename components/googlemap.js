import { withGoogleMap, GoogleMap, InfoWindow } from 'react-google-maps';
import Marker from './marker';

const SimpleMap = withGoogleMap(props =>
  <GoogleMap
    ref={props.onMapLoad}
    defaultOptions={{
      styles: [
        // Hides all the other businesses on the map
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    }}
    defaultZoom={17}
    defaultCenter={props.center}
    onClick={props.onMapClick}
  >
    {props.markers.map((marker, index) =>
      <Marker key={marker.key} filters={props.filters} {...marker} />
    )}
  </GoogleMap>
);

export default ({ onMapLoad, markers, center, filters }) => {
  return (
    <SimpleMap
      containerElement={
        <div
          style={{
            height: '100vh',
            width: '100%',
          }}
        />
      }
      mapElement={<div style={{ height: `100%` }} />}
      onMapLoad={onMapLoad}
      center={center}
      filters ={filters}
      onMapClick={() => {}}
      markers={markers}
      onMarkerRightClick={() => {}}
    />
  );
};
