CREATE TABLE `invoice` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invoiceNumber` text NOT NULL,
	`customerId` integer NOT NULL,
	`customerName` text NOT NULL,
	`customerPhone` text NOT NULL,
	`subtotal` real NOT NULL,
	`totalDiscount` real NOT NULL,
	`tax` real NOT NULL,
	`total` real NOT NULL,
	`date` text NOT NULL,
	`status` text DEFAULT 'unpaid' NOT NULL,
	`pdfPath` text,
	FOREIGN KEY (`customerId`) REFERENCES `contact`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoice_invoiceNumber_unique` ON `invoice` (`invoiceNumber`);--> statement-breakpoint
CREATE TABLE `invoice_item` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invoiceId` integer NOT NULL,
	`productId` integer,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`price` real NOT NULL,
	`quantity` integer NOT NULL,
	`discountValue` real,
	`discountType` text,
	FOREIGN KEY (`invoiceId`) REFERENCES `invoice`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE no action
);
