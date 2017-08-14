import { Component } from 'react';
import { Marker, InfoWindow } from 'react-google-maps';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      showTooltip: false,
    };
  }

  onClick() {
    this.setState({ showTooltip: !this.state.showTooltip });
  }

  render() {
    const { content, position, filters, rating, defaultAnimation } = this.props;
    let stars;
    if(rating !== undefined){
      stars = (<span>Rating: {rating}</span>);
    }
    return (
      <Marker
        position={position}
        defaultAnimation={defaultAnimation}
        onClick={this.onClick.bind(this)}
      >
        {this.state.showTooltip &&
          <InfoWindow onCloseClick={this.onClick.bind(this)}>
            <div>
              <span>{content}</span><br/>
              {stars}
            </div>
          </InfoWindow>}
          <style jsx>{`
              .hidden {
                visibility: false;
              }
              `}</style>
      </Marker>
    );
  }
}
