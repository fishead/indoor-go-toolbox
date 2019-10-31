import React, { FC, useCallback, useEffect, useState, useMemo } from "react";
import { Map as MapboxMap, GeoJSONSource } from "mapbox-gl";
import { RouteComponentProps, Route } from "react-router-dom";
import Helmet from "react-helmet";
import { dependencies } from "../../../../package.json";
import { Feature, Point } from "geojson";
import { FeatureCollection } from "geojson";
import Button from "@material-ui/core/button";
import turfBbox from "@turf/bbox";
import CartogramList from "../CartogramList";
import {
  getPlaceholderLayer,
  getAmapRasterLayer,
  getPositionHistoryLayer,
  getUserPositionLayer,
  getVectorCartogramLayers
} from "./layers";
import styled from "@emotion/styled";

export interface Props {
  open: boolean;
  locations: Feature<Point>[];
  cartogramId?: string;
  onSelectCartogramId: (cartogramId: string) => void;
}

export const PositionOnMap: FC<Props & RouteComponentProps> = props => {
  const locations = useMemo(() => props.locations, [props.locations]);
  const [mapboxMap, setMapboxMap] = useState<MapboxMap>();
  const [cartogramListVisiable, toggleCartogramListVisiable] = useState(false);

  const initMap = useCallback(
    async container => {
      if (!container || mapboxMap) {
        return;
      }

      const recentLocation = locations[0];
      const _mapboxMap = new MapboxMap({
        container,
        zoom: 17,
        center: recentLocation
          ? (recentLocation.geometry.coordinates as [number, number])
          : [106.5763288, 29.55892179],
        bearing: 0,
        pitch: 0,
        style: {
          version: 8,
          glyphs: `https://jc-mapbox-resources.oss-cn-hangzhou.aliyuncs.com/fonts/v1/mapbox/{fontstack}/{range}.pbf`,
          sources: {
            empty: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: []
              }
            },
            amap: {
              type: "raster",
              tiles: [
                "https://maptile.tools.staging.jcbel.com/amap/1?x={x}&y={y}&z={z}",
                "https://maptile.tools.staging.jcbel.com/amap/2?x={x}&y={y}&z={z}",
                "https://maptile.tools.staging.jcbel.com/amap/3?x={x}&y={y}&z={z}",
                "https://maptile.tools.staging.jcbel.com/amap/4?x={x}&y={y}&z={z}"
              ],
              tileSize: 256,
              maxzoom: 20,
              minzoom: 3,
              scheme: "xyz"
            },
            userPosition: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: []
              }
            },
            positions: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: []
              }
            }
          },
          layers: [
            getAmapRasterLayer(),
            getPlaceholderLayer("vector"),
            getPositionHistoryLayer(),
            getUserPositionLayer()
          ]
        }
      });

      await new Promise(resolve => {
        if (_mapboxMap.loaded()) {
          resolve(true);
        } else {
          _mapboxMap.once("load", () => resolve(true));
        }
      });
      setMapboxMap(_mapboxMap);
    },
    [locations, mapboxMap]
  );

  useEffect(() => {
    if (!mapboxMap) {
      return;
    }

    const recentPosition = locations[0];
    if (recentPosition) {
      const userPositionSource = mapboxMap.getSource(
        "userPosition"
      ) as GeoJSONSource;
      userPositionSource.setData(recentPosition);
    }

    const positionsSource = mapboxMap.getSource("positions") as GeoJSONSource;
    const data: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: locations
    };
    positionsSource.setData(data);

    if (locations.length === 1) {
      const [minLng, minLat, maxLng, maxLat] = turfBbox(data);
      mapboxMap.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
        padding: 20,
        maxZoom: 17
      });
    }
  }, [mapboxMap, locations]);

  const handleCartogramListSelectClose = useCallback(
    (cartogramId: string) => {
      toggleCartogramListVisiable(false);
      props.onSelectCartogramId(cartogramId);
    },
    [props]
  );

  useEffect(() => {
    if (!mapboxMap || !props.cartogramId) {
      return;
    }

    const mapLoadHandler = () => {
      const layers = getVectorCartogramLayers();
      for (let layer of layers) {
        if (mapboxMap.getLayer(layer.id)) {
          mapboxMap.removeLayer(layer.id);
        }
      }
      if (mapboxMap.getSource("vectorCartogram")) {
        mapboxMap.removeSource("vectorCartogram");
      }

      mapboxMap.addSource("vectorCartogram", {
        type: "vector",
        tiles: [
          `https://jcmap.jcbel.com/apis/cartogram-tiles/{z}/{x}/{y}?cartogram_id=${props.cartogramId}&layers=background,area,room_background,park,room,icon&refresh=1`
        ],
        minzoom: 14,
        maxzoom: 20
      });
      for (let layer of layers) {
        mapboxMap.addLayer(layer, "vector");
      }
    };

    const timer = setInterval(() => {
      if (mapboxMap.loaded()) {
        mapLoadHandler();
        clearInterval(timer);
      }
    }, 200);
    return () => {
      clearInterval(timer);
    };
  }, [mapboxMap, props.cartogramId]);

  return (
    <Container
      style={{
        zIndex: props.open ? 0 : -999,
        visibility: props.open ? "visible" : "hidden"
      }}
    >
      <Helmet>
        <link
          rel="stylesheet"
          href={`https://unpkg.com/mapbox-gl@${dependencies["mapbox-gl"]}/dist/mapbox-gl.css`}
        />
      </Helmet>

      <Route
        path={props.match.path}
        exact
        render={() => (
          <div
            style={{
              position: "absolute",
              height: "36px",
              width: "100%",
              zIndex: 10
            }}
          >
            <Button onClick={() => props.history.goBack()}>Go back</Button>
            <Button onClick={() => toggleCartogramListVisiable(true)}>
              加载地图
            </Button>
          </div>
        )}
      />

      <MapContainer>
        <div style={{ height: "100%" }} ref={initMap}></div>
      </MapContainer>

      {cartogramListVisiable && (
        <CartogramList
          onClose={() => toggleCartogramListVisiable(false)}
          onSelect={handleCartogramListSelectClose}
        />
      )}
    </Container>
  );
};

export default PositionOnMap;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
  overflow-y: auto;
`;

const MapContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
  overflow-y: auto;

  .mapboxgl-canary {
    background-color: salmon;
  }
`;
