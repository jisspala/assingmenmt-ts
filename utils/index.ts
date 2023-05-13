// Read the orders from the CSV file
import fs from 'fs';
import parse from 'csv-parse/lib/sync';

interface Order {
  organ: string;
  cash: number;
  price: number;
  bonus_ratio: number;
}

export async function readCSV(filename) {
  let data;
  let result;
  try {
    data = await parse(fs.readFileSync(filename), {
      columns: true,
      skip_empty_lines: true,
    });
    result = {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('error in reading csv:', JSON.stringify(error?.message));
    result = {
      success: false,
    };
  }
  return result;
}

export const validateOrders = (orders: Order[]): boolean => {
  for (const order of orders) {
    const organ = order.organ;
    const cash = Number(order.cash);
    const price = Number(order.price);
    const bonusRatio = Number(order.bonus_ratio);
    if (!organ || cash <= 0 || price <= 0 || bonusRatio < 1) {
      console.log(`Invalid order : ${JSON.stringify(order)}`);

      return false;
    }
    if (isNaN(cash) || isNaN(price) || isNaN(bonusRatio)) {
      console.log(`Invalid order : ${JSON.stringify(order)}`);

      return false;
    }
    return true;
  }
};
