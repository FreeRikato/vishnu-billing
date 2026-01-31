import { View } from "react-native";
import { scale } from "@/utils/responsive";

interface SkeletonLoaderProps {
	count?: number;
	height?: number;
}

export function InvoiceListSkeleton({ count = 5 }: SkeletonLoaderProps) {
	return (
		<View style={{ gap: scale(16), paddingHorizontal: scale(20) }}>
			{Array.from({ length: count }).map((_, i) => (
				<View
					// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items are identical placeholders
					key={`invoice-skeleton-${i}`}
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: scale(16),
						padding: scale(20),
						borderRadius: scale(24),
						backgroundColor: "#161b18",
					}}
				>
					<View
						style={{
							width: scale(32),
							height: scale(32),
							borderRadius: scale(16),
							backgroundColor: "#2A2F2C",
						}}
					/>
					<View style={{ flex: 1, gap: scale(8) }}>
						<View
							style={{
								height: scale(20),
								width: "60%",
								backgroundColor: "#2A2F2C",
								borderRadius: scale(4),
							}}
						/>
						<View
							style={{
								height: scale(14),
								width: "40%",
								backgroundColor: "#2A2F2C",
								borderRadius: scale(4),
							}}
						/>
					</View>
				</View>
			))}
		</View>
	);
}

export function ContactListSkeleton({ count = 5 }: SkeletonLoaderProps) {
	return (
		<View style={{ gap: scale(16), paddingHorizontal: scale(20) }}>
			{Array.from({ length: count }).map((_, i) => (
				<View
					// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items are identical placeholders
					key={`contact-skeleton-${i}`}
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: scale(16),
						padding: scale(16),
						borderRadius: scale(12),
						backgroundColor: "#1C1C1E",
					}}
				>
					<View
						style={{
							width: scale(48),
							height: scale(48),
							borderRadius: scale(24),
							backgroundColor: "#2C2C2E",
						}}
					/>
					<View style={{ flex: 1, gap: scale(4) }}>
						<View
							style={{
								height: scale(18),
								width: "50%",
								backgroundColor: "#2C2C2E",
								borderRadius: scale(4),
							}}
						/>
						<View
							style={{
								height: scale(14),
								width: "35%",
								backgroundColor: "#2C2C2E",
								borderRadius: scale(4),
							}}
						/>
					</View>
				</View>
			))}
		</View>
	);
}

export function ProductListSkeleton({ count = 5 }: SkeletonLoaderProps) {
	return (
		<View style={{ gap: scale(16), paddingHorizontal: scale(20) }}>
			{Array.from({ length: count }).map((_, i) => (
				<View
					// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items are identical placeholders
					key={`product-skeleton-${i}`}
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						padding: scale(16),
						borderRadius: scale(12),
						backgroundColor: "#1C1C1E",
					}}
				>
					<View style={{ flex: 1, gap: scale(8) }}>
						<View
							style={{
								height: scale(18),
								width: "40%",
								backgroundColor: "#2C2C2E",
								borderRadius: scale(4),
							}}
						/>
						<View
							style={{
								height: scale(14),
								width: "25%",
								backgroundColor: "#2C2C2E",
								borderRadius: scale(4),
							}}
						/>
					</View>
					<View
						style={{
							height: scale(20),
							width: scale(60),
							backgroundColor: "#2C2C2E",
							borderRadius: scale(4),
						}}
					/>
				</View>
			))}
		</View>
	);
}
