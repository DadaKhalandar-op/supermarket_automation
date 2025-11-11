import { useRef } from 'react';
import { Download, Printer, X, CheckCircle } from 'lucide-react';

interface ReceiptProps {
  sale: any;
  onClose: () => void;
}

export default function Receipt({ sale, onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'height=600,width=400');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Receipt</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: 'Courier New', monospace; margin: 0; padding: 20px; }
      .receipt { max-width: 300px; margin: 0 auto; }
      .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
      .company-name { font-size: 20px; font-weight: bold; }
      .info-row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px; }
      .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
      .items-table th { text-align: left; border-bottom: 1px solid #000; padding: 5px 0; font-size: 12px; }
      .items-table td { padding: 5px 0; font-size: 12px; }
      .total-section { border-top: 2px dashed #000; padding-top: 10px; margin-top: 10px; }
      .total-row { display: flex; justify-content: space-between; margin: 5px 0; font-weight: bold; font-size: 14px; }
      .footer { text-align: center; margin-top: 20px; padding-top: 10px; border-top: 2px dashed #000; font-size: 10px; }
      @media print {
        body { padding: 0; }
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownload = () => {
    const content = receiptRef.current;
    if (!content) return;

    const printWindow = window.open('', '', 'height=600,width=400');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Receipt</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: 'Courier New', monospace; margin: 0; padding: 20px; }
      .receipt { max-width: 300px; margin: 0 auto; }
      .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
      .company-name { font-size: 20px; font-weight: bold; }
      .info-row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px; }
      .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
      .items-table th { text-align: left; border-bottom: 1px solid #000; padding: 5px 0; font-size: 12px; }
      .items-table td { padding: 5px 0; font-size: 12px; }
      .total-section { border-top: 2px dashed #000; padding-top: 10px; margin-top: 10px; }
      .total-row { display: flex; justify-content: space-between; margin: 5px 0; font-weight: bold; font-size: 14px; }
      .footer { text-align: center; margin-top: 20px; padding-top: 10px; border-top: 2px dashed #000; font-size: 10px; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(content.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8" />
              <h2 className="text-xl font-bold">Sale Completed!</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="flex-1 bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div ref={receiptRef} className="p-8">
          <div className="receipt" style={{ fontFamily: "'Courier New', monospace" }}>
            <div className="header">
              <div className="company-name" style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>
                DADA Supermarket Store
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Automation Software System</div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                RK valley, RGUKT<br />
                Phone: +91 99665 98565<br />
                GST: 29ABCDE1234F1Z5
              </div>
            </div>

            <div style={{ margin: '15px 0' }}>
              <div className="info-row">
                <span>Receipt No:</span>
                <span style={{ fontWeight: 'bold' }}>{sale.transactionNumber}</span>
              </div>
              <div className="info-row">
                <span>Date:</span>
                <span>{new Date(sale.saleDate).toLocaleDateString()}</span>
              </div>
              <div className="info-row">
                <span>Time:</span>
                <span>{new Date(sale.saleDate).toLocaleTimeString()}</span>
              </div>
              <div className="info-row">
                <span>Cashier:</span>
                <span>{sale.clerkName}</span>
              </div>
            </div>

            <table className="items-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '15px 0' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #000' }}>
                  <th style={{ textAlign: 'left', padding: '5px 0', fontSize: '12px' }}>Item</th>
                  <th style={{ textAlign: 'center', padding: '5px 0', fontSize: '12px' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '5px 0', fontSize: '12px' }}>Price</th>
                  <th style={{ textAlign: 'right', padding: '5px 0', fontSize: '12px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item: any, index: number) => (
                  <tr key={index}>
                    <td style={{ padding: '8px 0', fontSize: '12px' }}>
                      <div>{item.itemName}</div>
                      <div style={{ fontSize: '10px', color: '#666' }}>{item.itemCode}</div>
                    </td>
                    <td style={{ textAlign: 'center', padding: '8px 0', fontSize: '12px' }}>
                      {item.quantity}
                    </td>
                    <td style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px' }}>
                      ₹{item.unitPrice.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px', fontWeight: 'bold' }}>
                      ₹{item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="total-section" style={{ borderTop: '2px dashed #000', paddingTop: '10px', marginTop: '10px' }}>
              <div className="info-row" style={{ fontSize: '13px' }}>
                <span>Subtotal:</span>
                <span>₹{sale.totalAmount.toFixed(2)}</span>
              </div>
              <div className="info-row" style={{ fontSize: '13px' }}>
                <span>Tax (0%):</span>
                <span>₹0.00</span>
              </div>
              <div className="total-row" style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
                <span>TOTAL:</span>
                <span>₹{sale.totalAmount.toFixed(2)}</span>
              </div>
              <div className="info-row" style={{ fontSize: '13px', marginTop: '10px' }}>
                <span>Items Count:</span>
                <span>{sale.items.length}</span>
              </div>
            </div>

            <div className="footer" style={{ textAlign: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '2px dashed #000', fontSize: '11px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>THANK YOU FOR SHOPPING! VISIT AGAIN!</div>
              <div style={{ color: '#666' }}>Please visit again</div>
              <div style={{ color: '#666', marginTop: '10px' }}>
                For queries: support@dada-supermarket-sas.com
              </div>
              <div style={{ marginTop: '10px', fontSize: '10px', color: '#999' }}>
                ** This is a computer generated receipt **
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
