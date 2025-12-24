ALTER TABLE `invoice` ADD `customerAddress` text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `invoice` ADD `customerGstin` text;--> statement-breakpoint
ALTER TABLE `invoice` ADD `customerDlNo` text;