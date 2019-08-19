import React from 'react'
import Sliding_Marker from "./Sliding_Marker"
import { Icon, DivIcon, LatLngExpression } from 'leaflet'
import { LeafletProvider, MapLayer, MapLayerProps,withLeaflet } from 'react-leaflet'

type LeafletElement = Sliding_Marker
type Props = {
  icon?: Icon | DivIcon,
  draggable?: boolean,
  opacity?: number,
  position: LatLngExpression,
  duration: number,
  keepAtCenter?: boolean,
  zIndexOffset?: number,
} & MapLayerProps

class DriftMarker extends MapLayer<Props, LeafletElement> {
  createLeafletElement(props: Props): LeafletElement {
    const el = new Sliding_Marker(props.position, this.getOptions(props))
    console.log("sippir",this.props)
    this.contextValue = { ...props.leaflet, popupContainer: el }
    return el
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    if (toProps.position !== fromProps.position && typeof toProps.duration == 'number') {
      this.leafletElement.slideTo(toProps.position, {
        duration: toProps.duration,
        keepAtCenter: toProps.keepAtCenter
      })
    }
    if (toProps.icon !== fromProps.icon && toProps.icon) {
      this.leafletElement.setIcon(toProps.icon)
    }
    if (toProps.zIndexOffset !== fromProps.zIndexOffset && toProps.zIndexOffset !== undefined) {
      this.leafletElement.setZIndexOffset(toProps.zIndexOffset)
    }
    if (toProps.opacity !== fromProps.opacity && toProps.opacity !== undefined) {
      this.leafletElement.setOpacity(toProps.opacity)
    }
    if (toProps.draggable !== fromProps.draggable && this.leafletElement.dragging !== undefined) {
      if (toProps.draggable === true) {
        this.leafletElement.dragging.enable()
      } else {
        this.leafletElement.dragging.disable()
      }
    }
  }

  render() {
    const { children } = this.props

    return children == null || this.contextValue == null ? null : (
      <LeafletProvider value={this.contextValue}>
        {children}
      </LeafletProvider>
    )
  }
}
export default withLeaflet<Props>(DriftMarker)