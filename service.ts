import { availableOrgans, promotionScheme } from './config';
import { readCSV, validateOrders } from './utils';
import {
  ProcessedResult,
  Order,
  Result,
  CalculatedOrder,
} from './utils/interfaces';
import constants from './utils/stringConstants';

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
  const formattedResult: string[] = [];

  for (const [key, value] of Object.entries(calculatedOrder)) {
    formattedResult.push(`${key}: ${value}`);
  }
  return formattedResult;
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
        //Formatting the order w.r.t. output
        const formattedResult: string[] = formatOrder(calculatedOrder);

        finalResults.push(formattedResult);
      }

      processedResult = {
        success: true,
        data: finalResults,
      };
    } else {
      processedResult = {
        success: false,
        message: constants.INVALID_ORDERS,
      };
    }
  } else {
    processedResult = {
      success: false,
      message: constants.INVALID_CSV,
    };
  }
  return processedResult;
};
