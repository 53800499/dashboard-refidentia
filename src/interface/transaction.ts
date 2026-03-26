export interface Transaction {
  id: number;
  customer: {
    avatar: string;
    name: string;
  };
  email: string;
  amount: number;
  method: "Card" | "Mobile Money" | "Cash";
  status: "Completed" | "Pending" | "Failed";
  date: string;
}


export interface TransactionFormData {
  id?: number; // optionnel pour edit
  name: string;
  email: string;
  amount: number;
  method: "Card" | "Mobile Money" | "Cash";
  status: "Completed" | "Pending" | "Failed";
}