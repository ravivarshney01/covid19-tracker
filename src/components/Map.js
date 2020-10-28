import React from 'react'
import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import '../styles/map.css'
import { showDataOnMap } from '../util'

const Map = ({ center, zoom, countries, casesType }) => {
  return (
    <div className='map'>
      <LeafletMap zoom={zoom} center={center}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  )
}

export default Map
