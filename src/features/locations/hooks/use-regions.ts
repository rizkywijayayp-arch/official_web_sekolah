// import * as turf from "@turf/turf";
// import { regionConfig } from "../utils";

// // Fungsi untuk mengonversi LineString menjadi Polygon
// const lineStringToPolygon = (lineString: number[][]): number[][][] | null => {
//   if (!lineString || lineString.length < 3) {
//     
//     return null;
//   }

//   // Pastikan LineString tertutup (koordinat pertama = terakhir)
//   const isClosed =
//     lineString[0][0] === lineString[lineString.length - 1][0] &&
//     lineString[0][1] === lineString[lineString.length - 1][1];

//   const coordinates = isClosed ? lineString : [...lineString, lineString[0]];

//   // Kembalikan dalam format Polygon: [[[lng, lat], ...]]
//   return [coordinates];
// };

// // Fungsi untuk menentukan wilayah marker
// export const getRegionForPoint = (lat: number, lng: number): string => {
//   // Validasi input koordinat
//   if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
//     
//     return "other";
//   }

//   const point = turf.point([lng, lat]); // Turf.js menggunakan [lng, lat]

//   for (const region of regionConfig) {
//     const geojson = region.data;

//     // Validasi data GeoJSON
//     if (!geojson || !geojson.type) {
(`Invalid<|control250|>

// System: GeoJSON data for region: ${region.key}`);
//       continue;
//     }

//     // Jika data adalah FeatureCollection
//     if (geojson.type === "FeatureCollection") {
//       if (!geojson.features || !Array.isArray(geojson.features)) {
//         
//         continue;
//       }

//       for (const feature of geojson.features) {
//         if (!feature.geometry) {
//           
//           continue;
//         }

//         let geometry = feature.geometry;

//         // Konversi LineString ke Polygon jika perlu
//         if (geometry.type === "LineString") {
//           const polygonCoords = lineStringToPolygon(geometry.coordinates);
//           if (!polygonCoords) {
//             
//             continue;
//           }

//           // Buat geometri Polygon baru
//           geometry = {
//             type: "Polygon",
//             coordinates: polygonCoords,
//           };
//         }

//         // Proses Polygon atau MultiPolygon
//         if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
//           try {
//             if (turf.booleanPointInPolygon(point, { ...feature, geometry })) {
//               
//               return region.key;
//             }
//           } catch (error) {
(
//               `Error processing feature in region ${region.key}:`,
//               error.message
//             );
//           }
//         } else {
(
//             `Unsupported geometry type ${geometry.type} in region: ${region.key}`
//           );
//         }
//       }
//     }
//     // Jika data adalah Feature
//     else if (geojson.type === "Feature") {
//       let geometry = geojson.geometry;

//       if (!geometry) {
//         
//         continue;
//       }

//       // Konversi LineString ke Polygon jika perlu
//       if (geometry.type === "LineString") {
//         const polygonCoords = lineStringToPolygon(geometry.coordinates);
//         if (!polygonCoords) {
//           
//           continue;
//         }

//         geometry = {
//           type: "Polygon",
//           coordinates: polygonCoords,
//         };
//       }

//       // Proses Polygon atau MultiPolygon
//       if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
//         try {
//           if (turf.booleanPointInPolygon(point, { ...geojson, geometry })) {
//             
//             return region.key;
//           }
//         } catch (error) {
(
//             `Error processing feature in region ${region.key}:`,
//             error.message
//           );
//         }
//       } else {
(
//           `Unsupported geometry type ${geometry.type} in region: ${region.key}`
//         );
//       }
//     } else {
//       
//     }
//   }

//   
//   return "other"; // Jika tidak berada di wilayah mana pun
// };