export const Billing: string = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sree Vishnu Agency Bill</title>
    <style>
        :root {
            --theme-green: #008f5d; /* Matches the green in the image */
            --border-color: #008f5d;
        }

        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
        }

        .page-container {
            width: 210mm; /* A4 Width */
            min-height: 297mm;
            background: white;
            margin: 0 auto;
            padding: 10px; /* White margin */
            position: relative;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        /* Main Border Box */
        .bill-border {
            border: 2px solid var(--theme-green);
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        /* General Table Styles */
        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid var(--theme-green);
            padding: 4px;
            color: var(--theme-green);
            font-size: 12px;
        }

        th {
            font-weight: bold;
            text-align: center;
            background-color: transparent;
        }

        /* --- HEADER SECTION --- */
        .header-section {
            display: flex;
            border-bottom: 1px solid var(--theme-green);
        }

        .cash-credit-col {
            width: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 1px solid var(--theme-green);
            background-color: #eafff6;
        }

        .cash-credit-text {
            writing-mode: vertical-rl;
            transform: rotate(180deg);
            font-weight: bold;
            font-size: 14px;
            letter-spacing: 1px;
            color: var(--theme-green);
        }

        .company-details {
            flex-grow: 1;
            text-align: center;
            padding: 10px;
        }

        .agency-name {
            font-size: 28px;
            font-weight: 900;
            color: var(--theme-green);
            margin: 0;
            font-family: 'Times New Roman', serif;
            text-transform: uppercase;
        }

        .sub-details {
            font-size: 11px;
            font-weight: bold;
            margin-top: 5px;
            color: #333;
        }

        .company-meta {
            font-size: 10px;
            margin-top: 5px;
            color: #333;
        }

        .invoice-meta-col {
            width: 150px;
            border-left: 1px solid var(--theme-green);
            display: flex;
            flex-direction: column;
        }

        .meta-row {
            flex: 1;
            border-bottom: 1px solid var(--theme-green);
            padding: 5px;
            font-size: 12px;
            position: relative;
        }
        
        .meta-row:last-child {
            border-bottom: none;
        }

        .meta-label {
            display: block;
            color: var(--theme-green);
            font-weight: bold;
            font-size: 10px;
        }

        /* --- PARTY NAME SECTION --- */
        .party-row {
            padding: 5px 10px;
            border-bottom: 1px solid var(--theme-green);
            font-size: 14px;
            font-weight: bold;
            color: var(--theme-green);
            height: 40px;
            display: flex;
            align-items: center;
        }

        .party-label {
            margin-right: 10px;
        }

        /* --- ITEMS TABLE --- */
        .items-table th {
            font-size: 11px;
            padding: 5px 2px;
        }
        
        /* Specific column widths based on image */
        .col-mfr { width: 4%; }
        .col-product { width: 30%; }
        .col-hsn { width: 10%; }
        .col-batch { width: 10%; }
        .col-exp { width: 8%; }
        .col-mrp { width: 8%; }
        .col-pack { width: 6%; }
        .col-qty { width: 5%; }
        .col-rate { width: 8%; }
        .col-amt { width: 11%; }

        .items-table td {
            height: 25px; /* Row height */
            border-top: none;
            border-bottom: none;
        }
        
        /* The main body needs vertical lines only, resembling the image */
        .items-body tr {
            height: 25px;
        }

        /* Watermark Container */
        .watermark-container {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.15;
            z-index: 0;
            pointer-events: none;
            text-align: center;
        }

        /* --- FOOTER SECTION --- */
        .footer-section {
            border-top: 1px solid var(--theme-green);
            display: flex;
        }

        .footer-left {
            flex-grow: 1;
        }

        .tax-table td, .tax-table th {
            text-align: center;
            font-size: 11px;
            height: 25px;
        }

        .footer-right {
            width: 250px;
            border-left: 1px solid var(--theme-green);
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 5px;
            border-bottom: 1px solid var(--theme-green);
            font-size: 12px;
            color: var(--theme-green);
            font-weight: bold;
        }

        .total-row:last-child {
            border-bottom: none;
        }
        
        .total-row span:first-child {
            text-align: left;
        }

        .jurisdiction {
            text-align: center;
            font-size: 10px;
            padding: 5px;
            border-top: 1px solid var(--theme-green);
            writing-mode: vertical-rl;
            transform: rotate(180deg);
            width: 25px;
            border-right: 1px solid var(--theme-green);
            white-space: nowrap;
        }

        .signature-area {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            height: 100px;
            padding-bottom: 10px;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            color: var(--theme-green);
        }
        
        .footer-bottom-container {
            display: flex;
            border-top: 1px solid var(--theme-green);
        }

        .eoe {
            width: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 1px solid var(--theme-green);
            font-size: 10px;
            writing-mode: vertical-rl;
            transform: rotate(180deg);
        }

        .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #008f5d;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }
            .page-container {
                box-shadow: none;
                margin: 0;
                width: 100%;
                height: 100%;
            }
            .print-btn {
                display: none;
            }
        }
    </style>
</head>
<body>

<button class="print-btn" onclick="window.print()">Print Invoice</button>

<div class="page-container">
    <div class="bill-border">
        
        <!-- HEADER -->
        <div class="header-section">
            <div class="cash-credit-col">
                <div class="cash-credit-text">CASH / CREDIT BILL</div>
            </div>
            
            <div class="company-details">
                <h1 class="agency-name">SREE VISHNU AGENCY</h1>
                <div class="sub-details">Pharmaceutical Distributors</div>
                <div class="company-meta">
                    8-B, Gandhiji Street, (1st Floor),<br>
                    Jaihindpuram 2nd Street, MADURAI - 625 011.<br>
                    Mobile: 9345907825
                </div>
                <!-- Box inside header -->
                <div style="border: 1px solid var(--theme-green); margin: 5px 20px; padding: 2px; font-size: 10px; font-weight: bold;">
                    ACKNOWLEDGEMENT
                </div>
            </div>

            <div class="invoice-meta-col">
                <div class="meta-row">
                    <span class="meta-label">Invoice No.</span>
                    <!-- Space for filling -->
                </div>
                <div class="meta-row">
                    <span class="meta-label">Date</span>
                    <!-- Space for filling -->
                </div>
                <div class="meta-row">
                    <span class="meta-label">Amount</span>
                    <!-- Space for filling -->
                </div>
                <div class="meta-row" style="flex:0.5; border-bottom: none;">
                    <span class="meta-label" style="font-size: 8px;">Seal with Signature</span>
                </div>
            </div>
        </div>

        <!-- PARTY NAME -->
        <div class="party-row">
            <span class="party-label">Party Name:</span>
            <span style="border-bottom: 1px dotted #333; flex-grow: 1;"></span>
        </div>
        <div class="party-row" style="border-top: none; height: 30px; font-size: 11px;">
            <div style="flex: 1; display:flex;">
                <span style="margin-right:5px;">DL No.: MDU/2027/20B, MDU/1865/21B</span>
            </div>
            <div style="flex: 1; text-align: right;">
                <span style="margin-right:5px;">GSTIN: 33AQAPR9634H1ZO</span>
            </div>
        </div>

        <!-- ITEMS TABLE -->
        <div style="position: relative; flex-grow: 1;">
            <!-- Watermark Simulator -->
            <div class="watermark-container">
                <svg width="200" height="200" viewBox="0 0 100 100" fill="none" stroke="#008f5d" stroke-width="1">
                    <!-- Abstract representation of the brain/head graphic -->
                    <path d="M50 10 C 30 10, 10 30, 10 50 C 10 70, 30 90, 50 90 C 70 90, 90 70, 90 50 C 90 30, 70 10, 50 10" />
                    <path d="M30 40 Q 50 20 70 40 T 50 80" />
                    <circle cx="40" cy="40" r="2" />
                    <circle cx="60" cy="45" r="3" />
                </svg>
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th class="col-mfr">Mfr.</th>
                        <th class="col-product">Product Name</th>
                        <th class="col-hsn">HSN Code</th>
                        <th class="col-batch">Batch No.</th>
                        <th class="col-exp">Exp. Dt.</th>
                        <th class="col-mrp">M.R.P</th>
                        <th class="col-pack">Packing</th>
                        <th class="col-qty">Qty</th>
                        <th class="col-rate">Rate</th>
                        <th class="col-amt">Amount</th>
                    </tr>
                </thead>
                <tbody class="items-body">
                    <!-- Generating empty rows to fill page -->
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                </tbody>
            </table>
        </div>

        <!-- FOOTER CALCULATION SECTION -->
        <div class="footer-bottom-container">
            <!-- Left side (Jurisdiction + Tax Table) -->
            <div class="eoe">E.&.O.E</div>
            <div class="jurisdiction">Subject to Madurai Jurisdiction</div>
            
            <div style="flex-grow: 1; display: flex; flex-direction: column;">
                <table class="tax-table" style="border-top: none; border-bottom: none; border-left: none;">
                    <thead>
                        <tr>
                            <th>Taxable Amt.</th>
                            <th>CGST %</th>
                            <th>CGST Amount</th>
                            <th>SGST %</th>
                            <th>SGST Amount</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    </tbody>
                </table>
                <div style="flex-grow:1; display:flex; justify-content: flex-end; padding-right: 10px; align-items: flex-end; padding-bottom: 5px;">
                    <span style="font-size: 12px; font-weight: bold; color: var(--theme-green);">For Sree Vishnu Agency</span>
                </div>
            </div>

            <!-- Right side (Totals) -->
            <div class="footer-right">
                <div class="total-row">
                    <span>Nett Amount</span>
                    <span></span>
                </div>
                <div class="total-row">
                    <span>Cash Discount</span>
                    <span></span>
                </div>
                <div class="total-row">
                    <span>Taxable Amt.</span>
                    <span></span>
                </div>
                <div class="total-row">
                    <span>Round off</span>
                    <span></span>
                </div>
                <div class="total-row" style="background-color: #eafff6; border-bottom: none; height: 35px; align-items: center;">
                    <span>TOTAL</span>
                    <span></span>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>`;
