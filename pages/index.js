import { Component } from 'react';
import Link from 'next/link';
import Head from '../components/head';
import Menu from '../components/menu';
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
          rating: 5,
          defaultAnimation: 2,
        },
      ],
      center: { lat: 37.792015, lng: -122.401695 },
      filters: {
        isOpen: true,
        openAtTime: "",
        minRating: 1
      }
    };

    this.toggleSettings = this.toggleSettings.bind(this);
    this.fetchLocations = this.fetchLocations.bind(this);
  }

  componentDidMount() {
    this.fetchLocations();
  }
  componentDidUpdate(){
    window.state = this.state;
  }

  fetchLocations(){
    console.log("FETCHING");
    // places service needs an HTML element to work
    const container = document.getElementById('search');
    const service = new google.maps.places.PlacesService(container);
    const { minRating } = this.state.filters;

    const placesSearch = () => {
      const searchOptions = {
        location: this.state.center,
        radius: 5000,
        type: ['restaurant'],
        openNow: true,
      };

      return new Promise((res,rej) => {
        service.nearbySearch(searchOptions, (results, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            res(results);
          } else {
            rej(status);
          }
        });
      });
    };

    const placesFindDetail = (place, index) => {
      let request = { placeId: place.place_id };

      return new Promise((res, rej) => {

        service.getDetails(request, (details, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            let openHours, address, phone, photos;
            openHours = details.open_hours ? details.open_hours : "";
            address = details.formatted_address ? details.formatted_address : "";
            phone = details.formatted_phone_number ? details.formatted_phone_number : "";
            photos = details.photos ? details.photos : [];
            res({
              key: place.id,
              content: place.name,
              position: place.geometry.location,
              rating: place.rating,
              openHours,
              address,
              phone,
              photos
            });
          } else {
            rej(status);
          }
        });
      });

    };

    placesSearch()
      .then(places => {
        return Promise.all(places.slice(0,10).map((place) => {
          return placesFindDetail(place);
        }));
      })
      .then(markers => {
        let filteredMarkers = markers.filter((marker)=> {
          return marker.rating >= minRating;
        });
        this.setState({ markers: filteredMarkers }); })
      .catch(error => alert(error));
  }

  toggleSettings(options){
    let time =  options.date + " " + options.time;

    this.setState({
      filters: {
        isOpen: options.isOpen,
        minRating: options.minRating,
        openAtTime: time,
      }
    }, () => this.fetchLocations());
  }
  render() {
    const { markers, center, filters } = this.state;
    return (
      <div>
        <Head title="What's open?" />
        <GoogleMap
          className="map"
          filters={filters}
          markers={markers}
          center={center}
        />
        <div id="search" />

        <Menu updateMarkers={this.toggleSettings} />

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
