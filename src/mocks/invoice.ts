import { Invoice } from "@/interface/Invoice";

export const InvoiceData: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "FAC-2026-00001",
    customerId: 1,
    items: [
      {
        id: "1-1",
        description: "Abonnement Premium",
        quantity: 1,
        unitPrice: 50000,
        tva: 18,
        totalHT: 50000,
        totalTVA: 9000,
        totalTTC: 59000,
      },
    ],
    totalHT: 50000,
    totalTVA: 9000,
    totalTTC: 59000,
    status: "Paid",
    emecefId: "EME-123456",
    qrCode: "https://emecef.fake/FAC-2026-00001",
    createdAt: "2026-01-10",
  },
  {
    id: 2,
    invoiceNumber: "FAC-2026-00002",
    customerId: 2,
    items: [
      {
        id: "2-1",
        description: "Service Installation",
        quantity: 2,
        unitPrice: 30000,
        tva: 18,
        totalHT: 60000,
        totalTVA: 10800,
        totalTTC: 70800,
      },
    ],
    totalHT: 60000,
    totalTVA: 10800,
    totalTTC: 70800,
    status: "Pending",
    createdAt: "2026-01-15",
  },
];