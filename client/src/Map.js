// ------------- NOTES -------------
/*
I was able to set up a basic map functionality, where the user selects a POI,clicks a "Map" button and a map with the POI coordinates are displayed.
Goals-> I was planning on have a set of controls in the map that would allow the user to select a metric and see the corresponding value (a circular marker with the numerical value in the center). This is just based on one POI at a time, but it could be scaled so that the user selects a general map,can input a search location, and POI around that location appear (it could have the same control so that when the user selects a metric, all they can compare that one metric for all the surrounding POI)
*/

import React, { Component, useRef } from 'react';
import MapGL, { NavigationControl, Marker } from 'react-map-gl';
// import LocationPin from './LocationPin';

const TOKEN = 'pk.eyJ1Ijoic2FyYWhkdm8iLCJhIjoiY2s2cTBvd2k3MW92NjNsbzY4YWZpZDk2diJ9.SXFiCIt2uvW3oFBqsrx4zg';
const navStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '10px'
};

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                latitude: 43.6426,
                longitude: -79.3871,
                zoom: 7,
                bearing: 0,
                pitch: 0,
                width: 500,
                height: 500,
            },
            poi: {}
        };
    }

    componentDidMount() {
        this.setState({
            poi: this.props.passPOI
        })
    }

    render() {
        const { viewport } = this.state;
        
        return (
            <MapGL
                {...viewport}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onViewportChange={viewport => this.setState({ viewport })}
                mapboxApiAccessToken={TOKEN}
                >
                    
                <div className="nav" style={navStyle}>
                    <NavigationControl />
                </div>
                <Marker
                    anchor='bottom'
                    // key={`marker-${index}`}
                    longitude={this.props.passPOI.lon}
                    latitude={this.props.passPOI.lat}
                >
                    <div className="mapMarker"><div className="innerCircle"></div></div>
                    {/* <LocationPin
                        width={100}
                    // onClick={(event) => this._handleClick(event, marker)} 
                    /> */}
                </Marker>
            </MapGL>
        );
    }
}

// export default Map;