import { Component } from 'react';
import Link from 'next/link';
import Head from '../components/head';
import GoogleMap from '../components/googlemap';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [
        {
          position: {
            lat: 37.792015,
            lng: -122.401695,
          },
          key: 'hq',
          content: 'Restocks HQ',
          defaultAnimation: 2,
        },
      ],
      center: { lat: 37.792015, lng: -122.401695 },
    };
  }

  componentDidMount() {
    // places service needs an HTML element to work
    const container = document.getElementById('search');
    const service = new google.maps.places.PlacesService(container);

    service.nearbySearch(
      {
        location: this.state.center,
        radius: 5000,
        type: ['restaurant'],
      },
      data => {
        if (data === null) {
          return;
        }
        const markers = data.map(place => {
          return {
            position: place.geometry.location,
            content: place.name,
            key: place.id,
          };
        });

        this.setState({ markers: this.state.markers.concat(markers) });
      }
    );
  }

  render() {
    const { markers, center } = this.state;
    return (
      <div>
        <Head title="What's open?" />
        <GoogleMap
          className="map"
          markers={markers}
          center={center}
        />
        <div id="search" />
        <style jsx>{`
          .map {
            height: 100%;
            width: 100%;
          }
        `}</style>
      </div>
    );
  }
}
