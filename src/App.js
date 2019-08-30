import React from 'react';
import {Map, YMaps, ZoomControl, Placemark, Polyline} from 'react-yandex-maps';
import './App.scss';
import AddressList from './AdressList/AddressList';
import Octicon, {Location} from '@primer/octicons-react';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            coordinates: [],
            addresses: [],
        };
        this.updateStateFromChild = this.updateStateFromChild.bind(this);
    }

    updateStateFromChild(addr, coord) {
        this.setState({
            addresses: addr,
            coordinates: coord,
        });
    }

    renameListItem(index, newCoordinate) {
        const ymaps = window.ymaps;
        ymaps.geocode(newCoordinate)
            .then(resp => {
                const newName = resp.geoObjects.get(0).properties.getAll().text;
                let coords = [...this.state.coordinates];
                let addrs = [...this.state.addresses];
                coords[index] = newCoordinate;
                addrs[index] = newName;

                this.setState({
                    coordinates: coords,
                    addresses: addrs
                })
            });

    }

    addPoint(address) {
        const ymaps = window.ymaps;
        ymaps.geocode(address)
            .then((result) => {
                const addedPoint = result.geoObjects.get(0).geometry.getCoordinates();
                let points = [...this.state.coordinates];
                points.push(addedPoint);

                this.setState({coordinates: points});
            })
    }

    _handleEnterDown(e) {
        const addressValue = e.target.value;
        if (e.key === 'Enter') {
            if (addressValue) {
                let addresses = this.state.addresses;
                addresses.push(addressValue);
                this.setState({addresses: addresses});

                document.getElementById('addPoint').value = '';

                this.addPoint(addressValue);
            }
        }
    }

    render() {
        return (
            <div className="App">

                <div className="left-side">
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <Octicon icon={Location} id="location"/>
                        </div>
                        <input type="text" className="form-control" id="addPoint"
                               placeholder="Точка назначения" onKeyDown={(e) => this._handleEnterDown(e)}/>
                    </div>
                    <ul className="list-group">
                        <AddressList addressList={this.state.addresses}
                                     coordinateList={this.state.coordinates}
                                     updateParentStateCallback={this.updateStateFromChild}
                        />
                    </ul>
                </div>

                <div className="right-side">
                    <YMaps>
                        <Map defaultState={{center: [55.843242, 37.582168], zoom: 12}} width='100%' height='100%'
                             id='map'>

                            <ZoomControl options={{float: 'right'}}/>
                            {this.state.coordinates.map((coordinate, index) =>
                                <Placemark key={index}
                                           onDragEnd={(e) => this.renameListItem(index, e.get('target').geometry.getCoordinates())}
                                           geometry={coordinate}
                                           options={{draggable: true}}
                                           properties={{iconContent: index + 1}}
                                />
                            )}
                            <Polyline geometry={[...this.state.coordinates]}
                                      options={{
                                          balloonCloseButton: false,
                                          strokeColor: '#000',
                                          strokeWidth: 4,
                                          strokeOpacity: 0.5,
                                      }}/>
                        </Map>
                    </YMaps>
                </div>
            </div>
        );
    }


}

export default App;
