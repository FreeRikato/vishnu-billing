import { Suspense, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { useDistrictStats } from "@/hooks/useDistrictStats";
import { homeStyles } from "@/styles/home";
import { getDistrictColor } from "@/utils/colorScale";
import {
	geoCoordinatesToSVGPath,
	type TamilNaduGeoJSON,
} from "@/utils/mapUtils";
import DistrictDetailModal from "./DistrictDetailModal";

// Import GeoJSON
const tamilNaduGeoJSON =
	require("../../public/TamilNadu.json") as TamilNaduGeoJSON;

function MapLoader() {
	return (
		<View style={[homeStyles.mapCard, { justifyContent: "center" }]}>
			<ActivityIndicator size="small" color="#13EC6A" />
		</View>
	);
}

export function TamilNaduMap() {
	const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const { statsMap, loading } = useDistrictStats();

	if (loading) {
		return <MapLoader />;
	}

	const handleDistrictPress = (districtName: string) => {
		setSelectedDistrict(districtName);
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
		setSelectedDistrict(null);
	};

	return (
		<View style={homeStyles.mapCard}>
			<Text style={homeStyles.chartTitle}>District-wise Collections</Text>

			<View style={homeStyles.mapContainer}>
				<Suspense fallback={<MapLoader />}>
					<Svg width={350} height={400} viewBox="0 0 350 400">
						{tamilNaduGeoJSON.features.map((feature) => {
							const districtName = feature.properties.NAME_2;
							const stats = statsMap.get(districtName);
							const color = getDistrictColor(stats?.paidRatio || 0, !!stats);

							const pathData = geoCoordinatesToSVGPath(feature.geometry, {
								width: 350,
								height: 400,
							});

							return (
								<Path
									key={districtName}
									d={pathData}
									fill={color}
									stroke="#000000"
									strokeWidth={1}
									onPress={() => handleDistrictPress(districtName)}
								/>
							);
						})}
					</Svg>
				</Suspense>
			</View>

			{/* Map Legend */}
			<View style={homeStyles.mapLegend}>
				<View style={homeStyles.legendRow}>
					<View
						style={[homeStyles.legendDot, { backgroundColor: "#13EC6A" }]}
					/>
					<Text style={homeStyles.legendText}>80%+ Paid</Text>
				</View>
				<View style={homeStyles.legendRow}>
					<View
						style={[homeStyles.legendDot, { backgroundColor: "#84CC16" }]}
					/>
					<Text style={homeStyles.legendText}>50-80%</Text>
				</View>
				<View style={homeStyles.legendRow}>
					<View
						style={[homeStyles.legendDot, { backgroundColor: "#F59E0B" }]}
					/>
					<Text style={homeStyles.legendText}>20-50%</Text>
				</View>
				<View style={homeStyles.legendRow}>
					<View
						style={[homeStyles.legendDot, { backgroundColor: "#EF4444" }]}
					/>
					<Text style={homeStyles.legendText}>&lt;20%</Text>
				</View>
				<View style={homeStyles.legendRow}>
					<View
						style={[homeStyles.legendDot, { backgroundColor: "#2A2A2A" }]}
					/>
					<Text style={homeStyles.legendText}>No Data</Text>
				</View>
			</View>

			{/* Detail Modal */}
			{selectedDistrict && (
				<DistrictDetailModal
					visible={modalVisible}
					district={selectedDistrict}
					stats={statsMap.get(selectedDistrict)}
					onClose={handleCloseModal}
				/>
			)}
		</View>
	);
}
