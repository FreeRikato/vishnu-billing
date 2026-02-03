import type {
	Feature,
	FeatureCollection,
	MultiPolygon,
	Polygon,
} from "geojson";

export interface DistrictFeature extends Feature {
	properties: {
		NAME_2: string; // District name (e.g., "Thoothukudi", "Chennai")
		ID_2: number;
		// ... other GeoJSON properties
	};
	geometry: Polygon | MultiPolygon;
}

export interface TamilNaduGeoJSON extends FeatureCollection {
	features: DistrictFeature[];
}

/**
 * Convert GeoJSON polygon coordinates to SVG path string
 * Uses simple linear projection for Tamil Nadu region
 */
export function geoCoordinatesToSVGPath(
	geometry: DistrictFeature["geometry"],
	bounds: { width: number; height: number },
): string {
	// Tamil Nadu approximate bounding box
	const LAT_MIN = 8.0;
	const LAT_MAX = 13.5;
	const LON_MIN = 76.0;
	const LON_MAX = 80.5;

	// Get coordinates based on geometry type
	const coordinates =
		geometry.type === "MultiPolygon"
			? geometry.coordinates
			: [geometry.coordinates];

	const pathParts: string[] = [];

	for (const polygon of coordinates) {
		// Use the first ring (exterior boundary)
		const ring = polygon[0];

		const moves = ring.map(([lon, lat]) => {
			// Project longitude/latitude to x/y coordinates
			const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * bounds.width;
			const y =
				bounds.height - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * bounds.height;
			return `${x},${y}`;
		});

		// Create SVG path command
		pathParts.push(`M${moves.join(" L")} Z`);
	}

	return pathParts.join(" ");
}
