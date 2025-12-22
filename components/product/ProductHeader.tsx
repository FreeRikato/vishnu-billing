import ContactHeader from "@/components/contact/ContactHeader";

interface ProductHeaderProps {
	onSettingsPress: () => void;
}

export default function ProductHeader({ onSettingsPress }: ProductHeaderProps) {
	return <ContactHeader onSettingsPress={onSettingsPress} title="Products" />;
}
