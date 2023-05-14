import { readCSV, validateOrders } from './utils';
import { availableOrgans, promotionScheme } from './config';
import {
  ProcessedResult,
  Order,
  Result,
  CalculatedOrder,
} from './utils/interfaces';

const calculateOrder = (order: Order): CalculatedOrder => {
  const calculatedOrder: CalculatedOrder = {};

  // Preparing result object model
  availableOrgans.map((item) => {
    calculatedOrder[item] = 0;
  });
  const organ = order.organ.toLowerCase();
  const cash = Number(order.cash);
  const price = Number(order.price);
  const bonusRatio = Number(order.bonus_ratio);

  // Calculating the number of organs purchased and bonuses
  const purchased = Math.floor(cash / price);
  const bonuseCounts = Math.floor(purchased / bonusRatio);

  // Adding the purchased organs to the result object
  calculatedOrder[organ] = purchased;

  // Adding the bonus organs to the result object
  if (bonuseCounts > 0 && organ in promotionScheme) {
    const bonusOrgans = promotionScheme[organ].bonus;

    for (const bonusOrgan in bonusOrgans) {
      const bonusAmount = bonuseCounts * bonusOrgans[bonusOrgan];
      calculatedOrder[bonusOrgan] += bonusAmount;
    }
  }
  return calculatedOrder;
};
const formatOrder = (calculatedOrder: CalculatedOrder): string[] => {
  const formatedResult: string[] = [];

  for (const [key, value] of Object.entries(calculatedOrder)) {
    formatedResult.push(`${key}: ${value}`);
  }
  return formatedResult;
};

export const processOrders = async (
  orderFile: string
): Promise<ProcessedResult> => {
  let processedResult: ProcessedResult;

  const csvResult: Result = await readCSV(orderFile);
  if (csvResult.success && csvResult.data) {
    const finalResults: string[][] = [];
    const isValidOrders = validateOrders(csvResult.data);

    if (isValidOrders) {
      for (const order of csvResult.data) {
        // Calculating and applying the bonus
        const calculatedOrder: CalculatedOrder = calculateOrder(order);
        //Formating the order w.r.t. output
        const formatedResult: string[] = formatOrder(calculatedOrder);
        finalResults.push(formatedResult);
      }

      processedResult = {
        success: true,
        data: finalResults,
      };
    } else {
      processedResult = {
        success: false,
        message: 'orders are not valid',
      };
    }
  } else {
    processedResult = {
      success: false,
      message: 'error in orderFile file reading',
    };
  }
  return processedResult;
};
