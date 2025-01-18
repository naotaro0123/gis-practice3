import { Tiles3DLoader } from "@loaders.gl/3d-tiles";
import { Deck, Tile3DLayer } from "deck.gl";

const INITIAL_VIEW_STATE = {
  longitude: -120,
  latitude: 34,
  height: 600,
  width: 800,
  pitch: 45,
  maxPitch: 85,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 14.5,
};

export const setupMapGL = (container: HTMLElement) => {
  const deckgl = new Deck({
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    layers: [
      new Tile3DLayer({
        id: "tile3dlayer",
        pointSize: 1,
        data: "https://s3-ap-northeast-1.amazonaws.com/3dimension.jp/13000_tokyo-egm96/13101_chiyoda-ku_notexture/tileset.json", // PLATEAU千代田区
        loader: Tiles3DLoader,
        onTilesetLoad: (tileset) => {
          const { cartographicCenter } = tileset;
          console.log(cartographicCenter); // 3dtilesの中心座標を取れるぞ

          // const [longitude, latitude] = cartographicCenter;
          // console.log(longitude, latitude); // 3dtilesの中心座標を取れるぞ
        },
      }),
      // new Tile3DLayer({
      //   id: "tile-3d-layer",
      //   data: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0",
      //   loader: I3SLoader,
      //   onTilesetLoad: (tileset) => {
      //     const { zoom, cartographicCenter } = tileset;
      //     const [longitude, latitude] = cartographicCenter;
      //     const viewState = {
      //       ...deckgl.viewState,
      //       zoom: zoom + 2.5,
      //       longitude,
      //       latitude,
      //     };
      //     deckgl.setProps({ initialViewState: viewState });
      //   },
      // }),
    ],
  });
};
