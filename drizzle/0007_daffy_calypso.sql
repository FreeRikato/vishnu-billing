PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_invoice` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invoiceNumber` text NOT NULL,
	`customerId` integer NOT NULL,
	`customerName` text NOT NULL,
	`customerPhone` text NOT NULL,
	`subtotal` integer NOT NULL,
	`totalDiscount` integer NOT NULL,
	`tax` integer NOT NULL,
	`total` integer NOT NULL,
	`amountPaid` integer DEFAULT 0 NOT NULL,
	`date` text NOT NULL,
	`status` text DEFAULT 'unpaid' NOT NULL,
	`pdfPath` text,
	`deletedAt` text,
	FOREIGN KEY (`customerId`) REFERENCES `contact`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_invoice`("id", "invoiceNumber", "customerId", "customerName", "customerPhone", "subtotal", "totalDiscount", "tax", "total", "amountPaid", "date", "status", "pdfPath", "deletedAt") SELECT "id", "invoiceNumber", "customerId", "customerName", "customerPhone", CAST("subtotal" * 100 AS INTEGER), CAST("totalDiscount" * 100 AS INTEGER), CAST("tax" * 100 AS INTEGER), CAST("total" * 100 AS INTEGER), CAST("amountPaid" * 100 AS INTEGER), "date", "status", "pdfPath", "deletedAt" FROM `invoice`;--> statement-breakpoint
DROP TABLE `invoice`;--> statement-breakpoint
ALTER TABLE `__new_invoice` RENAME TO `invoice`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `invoice_invoiceNumber_unique` ON `invoice` (`invoiceNumber`);--> statement-breakpoint
CREATE TABLE `__new_invoice_item` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invoiceId` integer NOT NULL,
	`productId` integer,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`price` integer NOT NULL,
	`quantity` integer NOT NULL,
	`discountValue` integer,
	`discountType` text,
	FOREIGN KEY (`invoiceId`) REFERENCES `invoice`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_invoice_item`("id", "invoiceId", "productId", "name", "description", "price", "quantity", "discountValue", "discountType") SELECT "id", "invoiceId", "productId", "name", "description", CAST("price" * 100 AS INTEGER), "quantity", CAST("discountValue" * 100 AS INTEGER), "discountType" FROM `invoice_item`;--> statement-breakpoint
DROP TABLE `invoice_item`;--> statement-breakpoint
ALTER TABLE `__new_invoice_item` RENAME TO `invoice_item`;--> statement-breakpoint
CREATE TABLE `__new_product` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`unit` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_product`("id", "name", "price", "unit") SELECT "id", "name", CAST("price" * 100 AS INTEGER), "unit" FROM `product`;--> statement-breakpoint
DROP TABLE `product`;--> statement-breakpoint
ALTER TABLE `__new_product` RENAME TO `product`;