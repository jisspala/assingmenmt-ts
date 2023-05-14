export interface ProcessedResult {
  success: boolean;
  data?: string[][];
  message?: string;
}

export interface Order {
  organ: string;
  cash: string;
  price: string;
  bonus_ratio: string;
}

export interface Result {
  success: boolean;
  message?: string;
  data?: Order[];
}

export interface CalculatedOrder {
  [key: string]: number;
}
