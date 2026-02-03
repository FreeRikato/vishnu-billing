/**
 * Tamil Nadu District List
 * Exported sorted array of district names from Tamil Nadu GeoJSON data
 */

export const TAMIL_NADU_DISTRICTS = [
	"Ariyalur",
	"Chennai",
	"Coimbatore",
	"Cuddalore",
	"Dharmapuri",
	"Dindigul",
	"Erode",
	"Kancheepuram",
	"Kanniyakumari",
	"Karur",
	"Madurai",
	"Nagapattinam",
	"Namakkal",
	"Nilgiris",
	"Perambalur",
	"Pudukkottai",
	"Ramanathapuram",
	"Salem",
	"Sivaganga",
	"Thanjavur",
	"Theni",
	"Thiruvallur",
	"Thiruvarur",
	"Thoothukudi",
	"Tiruchchirappalli",
	"Tirunelveli Kattabo",
	"Tiruvannamalai",
	"Vellore",
	"Villupuram",
	"Virudhunagar",
] as const;

export type TamilNaduDistrict = (typeof TAMIL_NADU_DISTRICTS)[number];
