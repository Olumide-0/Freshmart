// Builds the demo receipt email. Email clients ignore Tailwind and CSS
// classes, so this template deliberately uses table layout and inline styles.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const COLORS = {
  header: "#2F5D3A",
  background: "#F6F0E3",
  text: "#1F2937",
  accent: "#C6672E",
  muted: "#6B7280",
  border: "#E5E7EB",
  white: "#FFFFFF",
};

const FONT = "Arial, Helvetica, sans-serif";

const FOOTER_TEXT = "Demo receipt from a test-mode payment. No real money was charged.";

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

const formatMoney = (amount) => `$${amount.toFixed(2)} MXN`;

// Date only, in Mexico City time, e.g. "27 Oct 2026".
function formatOrderDate(date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Mexico_City",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, value])
  );

  return `${parts.day} ${MONTHS[Number(parts.month) - 1]} ${parts.year}`;
}

const formatAddress = (order) =>
  [order.address1, order.address2, order.city, order.postalCode]
    .filter((part) => part && part.trim())
    .join(", ");

export function buildReceiptEmail(order, date = new Date()) {
  const orderDate = formatOrderDate(date);
  const address = formatAddress(order);

  const items = order.items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    lineTotal: item.price * item.quantity,
  }));

  const summaryRows = [
    ["Subtotal", order.subtotal],
    ["Delivery", order.deliveryFee],
    ["Taxes", order.tax],
    ["Tip", order.tip],
  ];

  const subject = `Your FreshMart receipt: ${order.orderNumber}`;

  const itemRowsHtml = items
    .map(
      (item) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid ${COLORS.border};font-family:${FONT};font-size:14px;color:${COLORS.text};">${escapeHtml(item.name)}</td>
                <td align="center" style="padding:10px 0;border-bottom:1px solid ${COLORS.border};font-family:${FONT};font-size:14px;color:${COLORS.text};">${item.quantity}</td>
                <td align="right" style="padding:10px 0;border-bottom:1px solid ${COLORS.border};font-family:${FONT};font-size:14px;color:${COLORS.text};">${escapeHtml(formatMoney(item.lineTotal))}</td>
              </tr>`
    )
    .join("");

  const summaryRowsHtml = summaryRows
    .map(
      ([label, amount]) => `
              <tr>
                <td style="padding:4px 0;font-family:${FONT};font-size:14px;color:${COLORS.muted};">${label}</td>
                <td align="right" style="padding:4px 0;font-family:${FONT};font-size:14px;color:${COLORS.text};">${escapeHtml(formatMoney(amount))}</td>
              </tr>`
    )
    .join("");

  const detailHtml = (label, value) => `
              <tr>
                <td style="padding:0 0 12px 0;font-family:${FONT};">
                  <p style="margin:0;font-size:12px;font-weight:bold;letter-spacing:0.5px;text-transform:uppercase;color:${COLORS.accent};">${label}</p>
                  <p style="margin:4px 0 0 0;font-size:14px;line-height:20px;color:${COLORS.text};">${value}</p>
                </td>
              </tr>`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${COLORS.background};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.background};">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:${COLORS.white};border-radius:8px;">

            <!-- Header -->
            <tr>
              <td style="padding:24px;background-color:${COLORS.header};border-radius:8px 8px 0 0;font-family:${FONT};">
                <p style="margin:0;font-size:24px;font-weight:bold;color:${COLORS.white};">FreshMart</p>
                <p style="margin:4px 0 0 0;font-size:14px;color:${COLORS.white};">Order receipt</p>
              </td>
            </tr>

            <!-- Greeting + order info -->
            <tr>
              <td style="padding:24px 24px 8px 24px;font-family:${FONT};">
                <p style="margin:0 0 16px 0;font-size:16px;color:${COLORS.text};">Hi ${escapeHtml(order.customerName)}, thanks for your order.</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family:${FONT};">
                      <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:${COLORS.muted};">Order number</p>
                      <p style="margin:4px 0 0 0;font-size:16px;font-weight:bold;color:${COLORS.accent};">${escapeHtml(order.orderNumber)}</p>
                    </td>
                    <td align="right" style="font-family:${FONT};">
                      <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:${COLORS.muted};">Date</p>
                      <p style="margin:4px 0 0 0;font-size:16px;font-weight:bold;color:${COLORS.text};">${escapeHtml(orderDate)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Items -->
            <tr>
              <td style="padding:16px 24px 0 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <th align="left" style="padding:0 0 8px 0;border-bottom:2px solid ${COLORS.header};font-family:${FONT};font-size:12px;text-transform:uppercase;color:${COLORS.muted};">Item</th>
                    <th align="center" style="padding:0 0 8px 0;border-bottom:2px solid ${COLORS.header};font-family:${FONT};font-size:12px;text-transform:uppercase;color:${COLORS.muted};">Qty</th>
                    <th align="right" style="padding:0 0 8px 0;border-bottom:2px solid ${COLORS.header};font-family:${FONT};font-size:12px;text-transform:uppercase;color:${COLORS.muted};">Price</th>
                  </tr>${itemRowsHtml}
                </table>
              </td>
            </tr>

            <!-- Totals -->
            <tr>
              <td style="padding:16px 24px 0 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${summaryRowsHtml}
                  <tr>
                    <td style="padding:12px 0 0 0;border-top:1px solid ${COLORS.border};font-family:${FONT};font-size:16px;font-weight:bold;color:${COLORS.text};">Total</td>
                    <td align="right" style="padding:12px 0 0 0;border-top:1px solid ${COLORS.border};font-family:${FONT};font-size:18px;font-weight:bold;color:${COLORS.text};">${escapeHtml(formatMoney(order.total))}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Delivery + payment details -->
            <tr>
              <td style="padding:24px 24px 12px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${detailHtml("Delivery address", `${escapeHtml(order.customerName)}<br />${escapeHtml(address)}`)}${detailHtml("Delivery window", escapeHtml(order.deliveryTime))}${detailHtml("Payment method", escapeHtml(order.paymentMethod))}
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 24px;background-color:${COLORS.background};border-radius:0 0 8px 8px;font-family:${FONT};font-size:12px;color:${COLORS.muted};text-align:center;">
                ${FOOTER_TEXT}
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    "FreshMart receipt",
    "",
    `Hi ${order.customerName}, thanks for your order.`,
    "",
    `Order number: ${order.orderNumber}`,
    `Date: ${orderDate}`,
    "",
    "Items",
    ...items.map((item) => `- ${item.name} x ${item.quantity}: ${formatMoney(item.lineTotal)}`),
    "",
    ...summaryRows.map(([label, amount]) => `${label}: ${formatMoney(amount)}`),
    `Total: ${formatMoney(order.total)}`,
    "",
    `Delivery address: ${order.customerName}, ${address}`,
    `Delivery window: ${order.deliveryTime}`,
    `Payment method: ${order.paymentMethod}`,
    "",
    FOOTER_TEXT,
  ].join("\n");

  return { subject, html, text };
}
