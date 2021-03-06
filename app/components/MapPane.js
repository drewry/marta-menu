import React, {Component, PropTypes} from 'react'
import { Panel } from 'react-bootstrap'
import { Map, Marker, Popup, TileLayer, CircleMarker, Polyline } from 'react-leaflet';

import ProjectListing from './ProjectListing'

export default class MapPane extends Component {

  constructor (props) {
    super(props)
  }

  getProjectLayer (project) {
    if(!project.geojson) return null
    const popup = (
      <Popup>
        <ProjectListing
          project={project}
          inverse={true}
          projectToggled={() => this.props.projectToggled(project)}
        />
      </Popup>
    )

    const color = project.selected ? '#df691a' : 'gray'
    switch(project.geojson.geometry.type) {
      case 'Point':
        return (
          <CircleMarker
            center={[project.geojson.geometry.coordinates[1], project.geojson.geometry.coordinates[0]]}
            color={color}
            radius={project.selected ? 10 : 8}
            weight={4}
            key={project.id}
          >
            {popup}
          </CircleMarker>
        )
      case 'LineString':
        const positions = project.geojson.geometry.coordinates.map(coord => {
          return [coord[1], coord[0]]
        })
        return (
          <Polyline
            positions={positions}
            color={color}
            weight={project.selected ? 10 : 8}
            key={project.id}
          >
            {popup}
          </Polyline>
        )
    }
  }

  getHighlightLayer (projectId) {
    const project = this.props.projects.all.find(p => p.id === projectId)
    const color = 'yellow'
    switch(project.geojson.geometry.type) {
      case 'Point':
        return (
          <CircleMarker
            center={[project.geojson.geometry.coordinates[1], project.geojson.geometry.coordinates[0]]}
            color={color}
            radius={16}
            stroke={false}
            key={project.id}
          />
        )
      case 'LineString':
        const positions = project.geojson.geometry.coordinates.map(coord => {
          return [coord[1], coord[0]]
        })
        return (
          <Polyline
            positions={positions}
            color={color}
            weight={project.selected ? 16 : 14}
            key={project.id}
          />
        )
    }

  }

  render () {
    const position = [MM_CONFIG.map.start_location.lat, MM_CONFIG.map.start_location.lon]

    const style = {
      position: 'fixed',
      padding: '20px',
      top: '40px',
      bottom: '80px',
      left: '400px',
      right: '0px'
    }

    return (
      <Map center={position} id='map' style={style} zoom={13}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/${MM_CONFIG.map.mapbox.tileset}/tiles/{z}/{x}/{y}?access_token=${MM_CONFIG.map.mapbox.access_token}`}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {this.props.projects.highlighted ? this.getHighlightLayer(this.props.projects.highlighted) : null}
        {this.props.projects.all.map(project => this.getProjectLayer(project))}
      </Map>
    )
  }
}
