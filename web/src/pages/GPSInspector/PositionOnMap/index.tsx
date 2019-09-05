import React, { FC, useCallback, useEffect, useState, useMemo } from "react";
import { Map as MapboxMap, GeoJSONSource } from "mapbox-gl";
import { RouteComponentProps } from "react-router-dom";
import Helmet from "react-helmet";
import { dependencies } from "../../../../package.json";
import { Feature, Point } from "geojson";
import { FeatureCollection } from "geojson";
import Button from "@material-ui/core/button";
import turfBbox from "@turf/bbox";

export interface Props {
  open: boolean;
  locations: Feature<Point>[];
}

export const PositionOnMap: FC<
  Props & Pick<RouteComponentProps, "history">
> = props => {
  const locations = useMemo(() => props.locations, [props.locations]);
  const [mapboxMap, setMapboxMap] = useState<MapboxMap>();

  const goBack = useCallback(() => {
    props.history.goBack();
  }, [props.history]);

  const initMap = useCallback(
    async container => {
      if (!container || mapboxMap) {
        return;
      }

      const recentLocation = locations[0];
      const _mapboxMap = new MapboxMap({
        container,
        zoom: 18,
        center:
          recentLocation &&
          (recentLocation.geometry.coordinates as [number, number]),
        bearing: 0,
        pitch: 0,
        style: {
          version: 8,
          glyphs: `https://jc-mapbox-resources.oss-cn-hangzhou.aliyuncs.com/fonts/v1/mapbox/{fontstack}/{range}.pbf`,
          sources: {
            amap: {
              type: "raster",
              tiles: [
                "https://maptile.tools.staging.jcbel.com/amap/1?x={x}&y={y}&z={z}",
                "https://maptile.tools.staging.jcbel.com/amap/2?x={x}&y={y}&z={z}",
                "https://maptile.tools.staging.jcbel.com/amap/3?x={x}&y={y}&z={z}",
                "https://maptile.tools.staging.jcbel.com/amap/4?x={x}&y={y}&z={z}"
              ],
              tileSize: 256,
              maxzoom: 18,
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
            {
              id: "amap",
              type: "raster",
              source: "amap"
            },
            {
              id: "userPosition",
              type: "circle",
              source: "userPosition",
              paint: {
                "circle-color": "skyblue",
                "circle-radius": 10
              }
            },
            {
              id: "positions",
              type: "circle",
              source: "positions",
              paint: {
                "circle-color": "crimson",
                "circle-radius": 7
              }
            }
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

    if (locations.length) {
      const [minLng, minLat, maxLng, maxLat] = turfBbox(data);
      mapboxMap.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
        padding: 20,
        maxZoom: 18
      });
    }
  }, [mapboxMap, locations]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "#fff",
        overflowY: "auto",
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

      <div
        style={{
          position: "absolute",
          height: "36px",
          width: "100%",
          zIndex: 10
        }}
      >
        <Button onClick={() => goBack()}>Go back</Button>
      </div>

      <div
        ref={initMap}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "#fff",
          overflowY: "auto"
        }}
      ></div>
    </div>
  );
};

export default PositionOnMap;
