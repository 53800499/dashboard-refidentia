import { Transaction } from "@/interface/transaction";

export const TransactionData: Transaction[] = [
  {
    id: 1,
    customer: { name: "Jean Dupont", avatar: "/images/user/user-01.jpg" },
    email: "jean.dupont@gmail.com",
    amount: 450,
    method: "Mobile Money",
    status: "Completed",
    date: "15/03/2026",
  },
  {
    id: 2,
    customer: { name: "Amina Traoré", avatar: "/images/user/user-02.jpg" },
    email: "amina.t@example.com",
    amount: 125,
    method: "Cash",
    status: "Pending",
    date: "10/03/2026",
  },
  {
    id: 3,
    customer: { name: "Koffi Mensah", avatar: "/images/user/user-03.jpg" },
    email: "koffi.mensah@gmail.com",
    amount: 75,
    method: "Card",
    status: "Failed",
    date: "01/03/2026",
  },
];