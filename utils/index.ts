// Read the orders from the CSV file
import fs from 'fs';
import parse from 'csv-parse/lib/sync';

import { Order } from './interfaces';
import constants from '../utils/stringConstants';

export async function readCSV(filename: string) {
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
    console.error(`${constants.CSV_ERROR} : ${JSON.stringify(error)}`);
    result = {
      success: false,
    };
  }
  return result;
}

export const validateOrders = (orders: Order[]): boolean => {
  if (orders.length > 0) {
    for (const order of orders) {
      const organ = order.organ;
      const cash = Number(order.cash);
      const price = Number(order.price);
      const bonusRatio = Number(order.bonus_ratio);
      if (isNaN(cash) || isNaN(price) || isNaN(bonusRatio)) {
        console.log(`${constants.INVALID_ORDER} : ${JSON.stringify(order)}`);
        return false;
      }
      if (!organ || cash <= 0 || price <= 0 || bonusRatio < 1) {
        console.log(`${constants.INVALID_ORDER} : ${JSON.stringify(order)}`);

        return false;
      }

      return true;
    }
  }
  return false;
};
