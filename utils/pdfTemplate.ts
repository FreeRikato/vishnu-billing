import type { InvoiceProduct, InvoiceSummary } from "@/types/invoice";

// The HTML Shell
export const INVOICE_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
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
  </style>
</head>
<body>

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

</body>
</html>
`;

// Helper to generate HTML based on data types
export function generateInvoiceHtml(
	senderName: string,
	invoiceNumber: string,
	date: string,
	customer: { name: string; phone: string },
	items: InvoiceProduct[],
	summary: InvoiceSummary,
) {
	// Generate rows
	const rows = items
		.map((item) => {
			const lineTotal = (item.price * item.quantity).toFixed(2);

			return `
      <tr>
        <td>
          <strong>${item.name}</strong>
          ${item.discount ? `<br/><small style="color: #13ec6a">Discount applied</small>` : ""}
        </td>
        <td>${item.description}</td>
        <td class="text-right">${item.quantity}</td>
        <td class="text-right">${item.price.toFixed(2)}</td>
        <td class="text-right">${lineTotal}</td>
      </tr>
    `;
		})
		.join("");

	// Replace placeholders
	return INVOICE_HTML.replace("{{senderName}}", senderName)
		.replace("{{invoiceNumber}}", invoiceNumber)
		.replace("{{date}}", date)
		.replace("{{customerName}}", customer.name)
		.replace("{{customerPhone}}", customer.phone)
		.replace("{{tableRows}}", rows)
		.replace("{{subtotal}}", `${summary.subtotal.toFixed(2)}`)
		.replace("{{discount}}", `${summary.totalDiscount.toFixed(2)}`)
		.replace("{{tax}}", `${summary.tax.toFixed(2)}`)
		.replace("{{total}}", `${summary.total.toFixed(2)}`);
}
