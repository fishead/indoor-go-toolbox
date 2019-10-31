import {
  FillPaint,
  FillExtrusionPaint,
  SymbolPaint,
  SymbolLayout,
  Layer
} from "mapbox-gl";

export function getPlaceholderLayer(id: string): Layer {
  return {
    id,
    type: "fill",
    source: "empty"
  };
}

export function getAmapRasterLayer(): Layer {
  return {
    id: "amap",
    type: "raster",
    source: "amap"
  };
}

export function getUserPositionLayer(): Layer {
  return {
    id: "userPosition",
    type: "circle",
    source: "userPosition",
    paint: {
      "circle-color": "skyblue",
      "circle-radius": 10
    }
  };
}

export function getPositionHistoryLayer(): Layer {
  return {
    id: "positions",
    type: "circle",
    source: "positions",
    paint: {
      "circle-color": "crimson",
      "circle-radius": 7
    }
  };
}

export function getVectorCartogramLayers(): Layer[] {
  return [
    {
      id: "back:outdoor",
      source: "vectorCartogram",
      "source-layer": "background",
      minzoom: 14,
      maxzoom: 20,
      type: "fill",
      paint: {
        "fill-color": "#dbdbdb",
        "fill-opacity": 0.95
      } as FillPaint
    },
    {
      id: "back-3d:outdoor",
      source: "vectorCartogram",
      "source-layer": "3D_background",
      minzoom: 14,
      maxzoom: 20,
      type: "fill",
      paint: {
        "fill-color": "#e4f4ff",
        "fill-opacity": 0.95
      } as FillPaint
    },
    {
      id: "area:outdoor",
      source: "vectorCartogram",
      "source-layer": "area",
      minzoom: 14,
      maxzoom: 20,
      type: "fill",
      paint: {
        "fill-color": "#eaeaea",
        "fill-opacity": 0.85
      } as FillPaint
    },
    {
      id: "wall:outdoor",
      source: "vectorCartogram",
      "source-layer": "wall",
      minzoom: 14,
      maxzoom: 20,
      type: "fill-extrusion",
      paint: {
        "fill-extrusion-color": ["get", "style:fill-extrusion:color"],
        "fill-extrusion-height": ["get", "style:fill-extrusion:height"]
      } as FillExtrusionPaint
    },
    {
      id: "park:outdoor",
      source: "vectorCartogram",
      "source-layer": "park",
      minzoom: 18,
      maxzoom: 20,
      type: "fill-extrusion",
      paint: {
        "fill-extrusion-color": ["get", "style:fill:color"],
        "fill-extrusion-height": 0.5
      } as FillExtrusionPaint
    },
    {
      id: "room:make:outdoor",
      source: "vectorCartogram",
      "source-layer": "room",
      minzoom: 14,
      maxzoom: 20,
      type: "fill-extrusion",
      filter: ["==", ["get", "make_up"], "true"],
      paint: {
        "fill-extrusion-color": "#f4c59f",
        "fill-extrusion-height": ["get", "style:fill-extrusion:height"],
        "fill-extrusion-opacity": 1,
        "fill-extrusion-vertical-gradient": false
      }
    },
    {
      id: "room:outdoor",
      source: "vectorCartogram",
      "source-layer": "room",
      minzoom: 14,
      maxzoom: 20,
      type: "fill-extrusion",
      filter: ["!=", ["get", "make_up"], "true"],
      paint: {
        "fill-extrusion-color": "#ffffff",
        /* eslint-disable */
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          20,
          ["get", "style:fill-extrusion:height"]
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "style:fill-extrusion:base"]
        ],
        /* eslint-enable */
        "fill-extrusion-opacity": 1,
        "fill-extrusion-vertical-gradient": false
      } as FillExtrusionPaint
    },
    {
      id: "road:level1bg:outdoor",
      source: "vectorCartogram",
      "source-layer": "road",
      minzoom: 14,
      maxzoom: 20,
      type: "line",
      filter: ["==", ["get", "size"], "S"],
      layout: {
        "line-cap": "round"
      },
      paint: {
        "line-color": "#000000",
        /* eslint-disable */
        "line-width": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10,
          ["*", 4.5, ["^", 2, -6]],
          24,
          ["*", 10.5, ["^", 2, 8]]
        ]
        /* eslint-enable */
      }
    },
    {
      id: "road:level2:bg",
      source: "vectorCartogram",
      "source-layer": "road",
      minzoom: 14,
      maxzoom: 20,
      type: "line",
      filter: ["!=", ["get", "size"], "S"],
      layout: {
        "line-cap": "round"
      },
      paint: {
        "line-color": "#000000",
        /* eslint-disable */
        "line-width": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10,
          ["*", 2.5, ["^", 2, -6]],
          24,
          ["*", 7.5, ["^", 2, 8]]
        ]
        /* eslint-enable */
      }
    },
    {
      id: "road:level1:outdoor",
      source: "vectorCartogram",
      "source-layer": "road",
      minzoom: 14,
      maxzoom: 20,
      type: "line",
      filter: ["==", ["get", "size"], "S"],
      layout: {
        "line-cap": "round"
      },
      paint: {
        "line-color": "#6b6b6b",
        /* eslint-disable */
        "line-width": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10,
          ["*", 4, ["^", 2, -6]],
          24,
          ["*", 10, ["^", 2, 8]]
        ]
        /* eslint-enable */
      }
    },
    {
      id: "road:level2:outdoor",
      source: "vectorCartogram",
      "source-layer": "road",
      minzoom: 14,
      maxzoom: 20,
      type: "line",
      filter: ["!=", ["get", "size"], "S"],
      layout: {
        "line-cap": "round"
      },
      paint: {
        "line-color": "#6b6b6b",
        /* eslint-disable */
        "line-width": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10,
          ["*", 2, ["^", 2, -6]],
          24,
          ["*", 7, ["^", 2, 8]]
        ]
        /* eslint-enable */
      }
    },
    {
      id: "line-road",
      source: "vectorCartogram",
      "source-layer": "road",
      minzoom: 15,
      maxzoom: 20,
      type: "line",
      paint: {
        "line-width": 2,
        "line-pattern": "road_bg_icon"
      }
    },
    {
      id: "text:make:outdoor",
      source: "vectorCartogram",
      "source-layer": "room",
      minzoom: 14,
      maxzoom: 20,
      type: "symbol",
      filter: ["==", ["get", "make_up"], "true"],
      paint: {
        "text-color": "rgba(0,0,0,1)",
        "text-halo-color": "rgba(255,255,255,1)",
        "text-halo-width": 1
      },
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Ping Fang"],
        "text-size": 10
      }
    },
    {
      id: "text:outdoor",
      source: "vectorCartogram",
      "source-layer": "room",
      minzoom: 15,
      maxzoom: 20,
      type: "symbol",
      filter: ["!=", ["get", "make_up"], "true"],
      paint: {
        "text-color": "rgba(0,0,0,1)",
        "text-halo-color": "rgba(255,255,255,1)",
        "text-halo-width": 1
      },
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Ping Fang"],
        "text-size": 10
      }
    },
    {
      id: "areaname:outdoor",
      source: "vectorCartogram",
      "source-layer": "area",
      minzoom: 20,
      maxzoom: 20,
      type: "symbol",
      paint: {
        "text-color": "rgba(0,0,0,1)"
      } as SymbolPaint,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Ping Fang"],
        "text-size": 16,
        "text-justify": "right"
      } as SymbolLayout
    },
    {
      id: "roomname:outdoor",
      source: "vectorCartogram",
      "source-layer": "room",
      minzoom: 20,
      maxzoom: 20,
      type: "symbol",
      paint: {
        "text-color": "rgba(0,0,0,1)"
      } as SymbolPaint,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Ping Fang"],
        "text-size": 16,
        "text-justify": "right"
      } as SymbolLayout
    },
    {
      id: "parktext:outdoor",
      source: "vectorCartogram",
      "source-layer": "park",
      minzoom: 20,
      maxzoom: 20,
      type: "symbol",
      paint: {
        "text-color": "rgba(0,0,0,1)"
      } as SymbolPaint,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Ping Fang"],
        "text-size": 8,
        "text-justify": "right"
      } as SymbolLayout
    }
  ];
}
