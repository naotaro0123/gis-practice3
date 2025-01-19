import { Tiles3DLoader } from "@loaders.gl/3d-tiles";
// エラーが出るがPlateauの3dtilesを読み込むためには必要。使わない場合は9系でOKそう（typescriptの恩恵がある）
// https://github.com/visgl/deck.gl/discussions/8815
import { ArcLayer, Deck, GeoJsonLayer, Tile3DLayer } from "deck.gl";

const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 4,
  bearing: 0,
  pitch: 30,
};

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const COUNTRIES =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson"; //eslint-disable-line
const AIR_PORTS =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

export const setupMapGL = (container: HTMLElement) => {
  const deckgl = new Deck({
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    layers: [
      new GeoJsonLayer({
        id: "base-map",
        data: COUNTRIES,
        // Styles
        stroked: true,
        filled: true,
        lineWidthMinPixels: 2,
        opacity: 0.4,
        getLineColor: [60, 60, 60],
        getFillColor: [200, 200, 200],
      }),
      new GeoJsonLayer({
        id: "airports",
        data: AIR_PORTS,
        // Styles
        filled: true,
        pointRadiusMinPixels: 2,
        pointRadiusScale: 2000,
        getPointRadius: (f) => 11 - f.properties.scalerank,
        getFillColor: [200, 0, 80, 180],
        // Interactive props
        pickable: true,
        autoHighlight: true,
        onClick: (info) =>
          // eslint-disable-next-line
          info.object &&
          alert(
            `${info.object.properties.name} (${info.object.properties.abbrev})`
          ),
      }),
      new ArcLayer({
        id: "arcs",
        data: AIR_PORTS,
        dataTransform: (d) =>
          d.features.filter((f) => f.properties.scalerank < 4),
        // Styles
        getSourcePosition: (f) => [-0.4531566, 51.4709959], // London
        getTargetPosition: (f) => f.geometry.coordinates,
        getSourceColor: [0, 128, 200],
        getTargetColor: [200, 0, 80],
        getWidth: 1,
      }),
      new Tile3DLayer({
        id: "tile3dlayer",
        pointSize: 1,
        // data: "https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13101_chiyoda-ku/low_resolution/tileset.json", // PLATEAU千代田区
        data: "https://plateau.geospatial.jp/main/data/3d-tiles/bldg/14100_yokohama/low_resolution/tileset.json",
        loader: Tiles3DLoader,
        onTilesetLoad: (tileset): void => {
          console.log("onTilesetLoad", tileset);
          const { cartographicCenter, zoom } = tileset;
          console.log(cartographicCenter, zoom); // 3dtilesの中心座標を取れるぞ
          // ここで3Dの中心に移動する
          deckgl.setProps({
            initialViewState: {
              longitude: cartographicCenter?.x ?? 0,
              latitude: cartographicCenter?.y ?? 0,
              zoom,
            },
          });
        },
        // これは走らないが不要そう
        // onTileLoad: (tileHeader): void => {
        //   console.log("tileHeader", tileHeader);
        //   tileHeader.content.cartographicOrigin = new Vector3(
        //     tileHeader.content.cartographicOrigin.x,
        //     tileHeader.content.cartographicOrigin.y,
        //     tileHeader.content.cartographicOrigin.z - 40
        //   );
        // },
      }),
    ],
  });
};
