
export interface Customer {
  id: string | number;
  name: string;
  phone: string;
  email: string;
  totalSpent: number;
  totalTransactions: number;
  loyaltyPoints: number;
  status: CustomerStatus;
  lastPurchaseDate: string;
  avatar?: string;
}

export interface CustomerFormData {
  id?: number;
  name: string;
  phone: string;
  email: string;
  status: CustomerStatus;
  loyaltyPoints: number;
}
export type CustomerStatus = "VIP" | "Active" | "Inactive";
