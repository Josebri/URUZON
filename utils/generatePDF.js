const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateInvoice = (order, path) => {
    let doc = new PDFDocument({ margin: 50 });

    doc.pipe(fs.createWriteStream(path));

    doc.fontSize(20).text('Factura de Compra', { align: 'center' });

    doc.text(`Fecha: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.text(`Cliente: ${order.user.name} ${order.user.lastname}`, { align: 'left' });
    doc.text(`Email: ${order.user.email}`, { align: 'left' });
    doc.text(`Teléfono: ${order.user.phone}`, { align: 'left' });
    doc.text(`Ubicación: ${order.user.location}`, { align: 'left' });

    doc.moveDown();
    doc.text('Productos:', { underline: true });

    order.items.forEach(item => {
        doc.text(`- ${item.product.name} (x${item.quantity}): $${item.price}`, { align: 'left' });
    });

    doc.moveDown();
    doc.text(`Total: $${order.total}`, { align: 'left' });

    doc.end();
};

module.exports = generateInvoice;
