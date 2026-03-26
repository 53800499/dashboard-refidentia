export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerId: number;
  items: InvoiceItem[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  status: "Draft" | "Pending" | "Validated" | "Rejected" | "Paid";
  emecefId?: string;
  qrCode?: string;
  createdAt: string;
} 
export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  tva: number
  discount?: number
  totalHT: number
  totalTVA: number
  totalTTC: number
} 