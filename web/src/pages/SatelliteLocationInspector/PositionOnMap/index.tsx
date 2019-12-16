import React, { FC, useCallback, useEffect, useState, useMemo } from "react";
import {
  Map as MapboxMap,
  GeoJSONSource,
  MapMouseEvent,
  EventData
} from "mapbox-gl";
import { RouteComponentProps, Route } from "react-router-dom";
import Helmet from "react-helmet";
import { dependencies } from "../../../../package.json";
import { Feature, Point } from "geojson";
import { FeatureCollection } from "geojson";
import Button from "@material-ui/core/Button";
import turfBbox from "@turf/bbox";
import CartogramList from "../CartogramList";
import {
  getPlaceholderLayer,
  getAmapRasterLayer,
  getRawPositionHistoryLayer,
  getKalmanFilterPositionHistoryLayer,
  getUserPositionLayer,
  getVectorCartogramLayers
} from "./layers";
import styled from "@emotion/styled";

export interface Props {
  open: boolean;
  rawPositions: Feature<Point>[];
  kalmanFilterPositions: Feature<Point>[];
  cartogramId?: string;
  onSelectCartogramId: (cartogramId: string) => void;
  mockPosition: (pos: Position) => void;
}

export const PositionOnMap: FC<Props & RouteComponentProps> = props => {
  const rawPositions = useMemo(() => props.rawPositions, [props.rawPositions]);
  const kalmanFilterPositions = useMemo(() => props.kalmanFilterPositions, [
    props.kalmanFilterPositions
  ]);
  const [mapboxMap, setMapboxMap] = useState<MapboxMap>();
  const [cartogramListVisiable, toggleCartogramListVisiable] = useState(false);

  const initMap = useCallback(
    async container => {
      if (!container || mapboxMap) {
        return;
      }

      const recentLocation = rawPositions[0];
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
            rawPositions: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: []
              }
            },
            kalmanFilterPositions: {
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
            getRawPositionHistoryLayer(),
            getKalmanFilterPositionHistoryLayer(),
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
    [rawPositions, mapboxMap]
  );

  // 模拟位置
  useEffect(() => {
    if (!mapboxMap) {
      return;
    }

    const type = "click";
    const handler = (evt: MapMouseEvent & EventData) => {
      if (evt.originalEvent.altKey) {
        const { lng, lat } = evt.lngLat;
        props.mockPosition({
          timestamp: Date.now(),
          coords: {
            accuracy: Math.random() * 99,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: Math.random() > 0.5 ? 1 : -1 * Math.random() * 180,
            latitude: lat,
            longitude: lng,
            speed: Math.random()
          }
        } as Position);
      }
    };
    mapboxMap.on(type, handler);

    return () => {
      mapboxMap.off(type, handler);
    };
  }, [mapboxMap, props]);

  // 更新未处理过的数据
  useEffect(() => {
    if (!mapboxMap) {
      return;
    }

    const positionsSource = mapboxMap.getSource(
      "rawPositions"
    ) as GeoJSONSource;
    const data: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: rawPositions
    };
    positionsSource.setData(data);
  }, [mapboxMap, rawPositions]);

  // 更新 KalmanFilter 处理之后的数据
  useEffect(() => {
    if (!mapboxMap) {
      return;
    }

    const positionsSource = mapboxMap.getSource(
      "kalmanFilterPositions"
    ) as GeoJSONSource;
    const data: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: kalmanFilterPositions
    };
    positionsSource.setData(data);
  }, [mapboxMap, kalmanFilterPositions]);

  const handleCartogramListSelectClose = useCallback(
    (cartogramId: string) => {
      toggleCartogramListVisiable(false);
      props.onSelectCartogramId(cartogramId);
    },
    [props]
  );

  // 显示当前原始位置
  useEffect(() => {
    if (!mapboxMap) {
      return;
    }

    const recentPosition = rawPositions[0];
    if (recentPosition) {
      const userPositionSource = mapboxMap.getSource(
        "userPosition"
      ) as GeoJSONSource;
      userPositionSource.setData(recentPosition);
    }
  }, [mapboxMap, rawPositions]);

  // 根据数据居中地图
  useEffect(() => {
    if (!mapboxMap) {
      return;
    }

    const data: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [...rawPositions, ...kalmanFilterPositions]
    };
    if (data.features.length) {
      const [minLng, minLat, maxLng, maxLat] = turfBbox(data);
      mapboxMap.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
        padding: 20,
        maxZoom: 17
      });
    }
  }, [kalmanFilterPositions, mapboxMap, rawPositions]);

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
          `https://jcmap.jcbel.com/apis/cartogram-tiles/{z}/{x}/{y}?cartogram_id=${props.cartogramId}&layers=background,area,room_background,road,park,room,icon&refresh=1`
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
