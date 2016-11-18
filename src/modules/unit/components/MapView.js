// @flow
import React, {Component, PropTypes} from 'react';
import SMIcon from '../../home/components/SMIcon';
import {View} from './View';
import Logo from '../../home/components/Logo';
import Disclaimer from '../../home/components/Disclaimer';
import {Map, TileLayer, ZoomControl} from 'react-leaflet';
import Control from 'react-leaflet-control';
import {mobileBreakpoint} from '../../common/constants';
import {languages} from '../../language/constants';
import {MAP_URL} from '../../map/constants';
import {latLngToArray} from '../../map/helpers';
import UnitsOnMap from './UnitsOnMap';
import UserLocationMarker from '../../map/components/UserLocationMarker';

export class MapView extends Component {
  static propTypes = {
    position: PropTypes.array.isRequired,
    units: PropTypes.array
  };

  state: {
    isMobile: boolean
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      isMobile: window.innerWidth < mobileBreakpoint
    };

    this.locateUser = this.locateUser.bind(this);
    this.updateIsMobile = this.updateIsMobile.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateIsMobile);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateIsMobile);
    //this.refs.map.leafletElement.setActiveArea('activeArea');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.unitId && nextProps.units && this.state.isMobile) {
      const unit = nextProps.units.filter((unit) => unit.id == nextProps.params.unitId)[0];
      if (unit) {
        //For some reason could not use reverse here so had to do this weird way.
        this.refs.map.leafletElement.flyTo([unit.location.coordinates[1]+0.04, unit.location.coordinates[0]], 12);
      }
    }
  }

  updateIsMobile() {
    this.setState({isMobile: window.innerWidth < mobileBreakpoint});
  }

  locateUser() {
    this.refs.map.leafletElement.locate({setView: true});
  }

  handleClick(event: Object) {
    this.props.setLocation(latLngToArray(event.latlng));
  }

  render() {
    const {position, selectedUnitId, units, selected, activeLanguage, openUnit, changeLanguage} = this.props;
    const {isMobile} = this.state;

    return (
      <View id="map-view" className="map-view" isSelected={selected}>
        <Map ref="map"
          zoomControl={false}
          attributionControl={false}
          center={position}
          zoom={12}
          onClick={this.handleClick} >
          <TileLayer
        url={MAP_URL}
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <UserLocationMarker />
          <UnitsOnMap units={units} selectedUnitId={selectedUnitId} openUnit={openUnit}/>
          {!isMobile && <ZoomControl position="bottomright" />}
          <Control className="leaflet-bar leaflet-control-locate" position="bottomright">
            <a className="custom-control-button" onClick={this.locateUser}>
              <SMIcon icon="address" />
            </a>
          </Control>
          <LanguageChanger activeLanguage={activeLanguage} changeLanguage={changeLanguage} />
          <Control className="leaflet-bar leaflet-control-info" position={isMobile ? 'bottomleft' : 'topright'}>
            <a className="custom-control-button">
              <SMIcon icon="info" />
            </a>
          </Control>
        </Map>
        <Logo/>
        <Disclaimer attributionLink="http://osm.org/copyright" />
      </View>
    );
  }
}

const LanguageChanger = ({changeLanguage, activeLanguage}) =>
  <div className="language-changer">
    {Object.keys(languages).filter((language) => languages[language] !== activeLanguage).map((languageKey, index) => (
      <div key={index} style={{ display: 'flex' }}>
        <a onClick={() => changeLanguage(languages[languageKey])}>
          {languageKey}
        </a>
        {index < Object.keys(languages).length - 2
          ? <div style={{ marginLeft: 2, marginRight: 2 }}>|</div>
          : null}
      </div>)
    )}
  </div>;
