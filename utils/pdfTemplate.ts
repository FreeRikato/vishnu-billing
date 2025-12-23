import type { InvoiceProduct, InvoiceSummary } from "@/types/invoice";

// Helper to convert cents to decimal for display
function centsToDecimal(cents: number): number {
	return cents / 100;
}

// Helper to convert basis points to percent for display
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _basisPointsToPercent(basisPoints: number): number {
	return basisPoints / 100;
}

// 1. styles separated for reuse
const STYLES = `
    body {
      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      border-bottom: 2px solid #13ec6a;
      padding-bottom: 20px;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #000;
    }
    .invoice-title {
      font-size: 32px;
      font-weight: bold;
      color: #333;
      text-align: right;
    }
    .meta-info {
      text-align: right;
      margin-top: 10px;
      font-size: 14px;
      color: #666;
    }
    .section {
      margin-bottom: 30px;
    }
    .bill-to-title {
      font-size: 14px;
      text-transform: uppercase;
      color: #999;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .customer-name {
      font-size: 18px;
      font-weight: bold;
    }
    .customer-phone {
      font-size: 14px;
      color: #666;
      margin-top: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      text-align: left;
      padding: 12px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #ddd;
      font-size: 12px;
      text-transform: uppercase;
      color: #666;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      display: flex;
      justify-content: flex-end;
    }
    .totals-table {
      width: 300px;
    }
    .totals-table td {
      border: none;
      padding: 6px 12px;
    }
    .total-label {
      font-weight: bold;
      color: #666;
    }
    .total-value {
      font-weight: bold;
      font-size: 16px;
    }
    .grand-total {
      border-top: 2px solid #13ec6a !important;
      padding-top: 12px !important;
      font-size: 20px !important;
      color: #000;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 12px;
      color: #999;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
    /* Page break utility for merged PDF */
    .page-break {
      page-break-after: always;
      height: 0;
      display: block;
      clear: both;
    }
`;

// 2. Body template for a single invoice
const INVOICE_BODY_TEMPLATE = `
  <div class="header">
    <div>
      <div class="company-name">{{senderName}}</div>
      <div style="margin-top: 5px; font-size: 14px; color: #666;">
        Invoice
      </div>
    </div>
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="meta-info">
        <div>Invoice #: <strong>{{invoiceNumber}}</strong></div>
        <div>Date: <strong>{{date}}</strong></div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="bill-to-title">Bill To:</div>
    <div class="customer-name">{{customerName}}</div>
    <div class="customer-phone">{{customerPhone}}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 40%">Item</th>
        <th style="width: 15%">Unit</th>
        <th style="width: 10%" class="text-right">Qty</th>
        <th style="width: 15%" class="text-right">Price</th>
        <th style="width: 20%" class="text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      {{tableRows}}
    </tbody>
  </table>

  <div class="totals">
    <table class="totals-table">
      <tr>
        <td class="total-label text-right">Subtotal</td>
        <td class="text-right">{{subtotal}}</td>
      </tr>
      <tr>
        <td class="total-label text-right">Discount</td>
        <td class="text-right" style="color: #ef4444;">-{{discount}}</td>
      </tr>
      <tr>
        <td class="total-label text-right">Tax (5%)</td>
        <td class="text-right">{{tax}}</td>
      </tr>
      <tr>
        <td class="total-label text-right grand-total">Total</td>
        <td class="text-right grand-total">{{total}}</td>
      </tr>
    </table>
  </div>

  <div class="footer">
    <p>Thank you for your business!</p>
  </div>
`;

// Helper types
type InvoiceData = {
	senderName: string;
	invoiceNumber: string;
	date: string;
	customerName: string;
	customerPhone: string;
	items: InvoiceProduct[];
	summary: InvoiceSummary;
};

// Helper to generate table rows
function generateRows(items: InvoiceProduct[]) {
	return items
		.map((item) => {
			// Convert price from cents to decimal
			const priceInRupees = centsToDecimal(item.price);
			const lineTotal = (priceInRupees * item.quantity).toFixed(2);
			return `
      <tr>
        <td>
          <strong>${item.name}</strong>
          ${item.discount ? `<br/><small style="color: #13ec6a">Discount applied</small>` : ""}
        </td>
        <td>${item.description}</td>
        <td class="text-right">${item.quantity}</td>
        <td class="text-right">₹${priceInRupees.toFixed(2)}</td>
        <td class="text-right">₹${lineTotal}</td>
      </tr>
    `;
		})
		.join("");
}

// Helper to fill the template with data
function fillInvoiceTemplate(template: string, data: InvoiceData) {
	const rows = generateRows(data.items);
	// Convert summary values from cents to decimals
	return template
		.replace("{{senderName}}", data.senderName)
		.replace("{{invoiceNumber}}", data.invoiceNumber)
		.replace("{{date}}", data.date)
		.replace("{{customerName}}", data.customerName)
		.replace("{{customerPhone}}", data.customerPhone)
		.replace("{{tableRows}}", rows)
		.replace(
			"{{subtotal}}",
			`₹${centsToDecimal(data.summary.subtotal).toFixed(2)}`,
		)
		.replace(
			"{{discount}}",
			`₹${centsToDecimal(data.summary.totalDiscount).toFixed(2)}`,
		)
		.replace("{{tax}}", `₹${centsToDecimal(data.summary.tax).toFixed(2)}`)
		.replace("{{total}}", `₹${centsToDecimal(data.summary.total).toFixed(2)}`);
}

// Wrap content in HTML shell
function wrapHtml(bodyContent: string) {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>${STYLES}</style>
</head>
<body>
  ${bodyContent}
</body>
</html>
`;
}

// Main function to generate single invoice HTML
export function generateInvoiceHtml(
	senderName: string,
	invoiceNumber: string,
	date: string,
	customer: { name: string; phone: string },
	items: InvoiceProduct[],
	summary: InvoiceSummary,
) {
	const data: InvoiceData = {
		senderName,
		invoiceNumber,
		date,
		customerName: customer.name,
		customerPhone: customer.phone,
		items,
		summary,
	};
	const body = fillInvoiceTemplate(INVOICE_BODY_TEMPLATE, data);
	return wrapHtml(body);
}

// New function to generate merged HTML for multiple invoices
export function generateMergedInvoiceHtml(
	invoices: Omit<InvoiceData, "senderName">[],
	senderName: string,
) {
	const bodies = invoices.map((inv) =>
		fillInvoiceTemplate(INVOICE_BODY_TEMPLATE, { ...inv, senderName }),
	);

	// Join all bodies with a page break div
	const mergedBody = bodies.join('<div class="page-break"></div>');

	return wrapHtml(mergedBody);
}

// Export constant for backward compatibility if needed, though functions are preferred
export const INVOICE_HTML = wrapHtml(INVOICE_BODY_TEMPLATE);
