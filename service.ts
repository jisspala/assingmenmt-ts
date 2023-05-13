import { readCSV } from './utils';
import { availableOrgans, promotionScheme } from './config';

interface ProcessedResult {
  success: boolean;
  data?: string[][];
  message?: string;
}

const formatOrder = (result): string[] => {
  const formatedResult: string[] = [];

  for (const [key, value] of Object.entries(result)) {
    formatedResult.push(`${key}: ${value}`);
  }
  return formatedResult;
};

const calculateOrder = (order) => {
  const result = {};

  // Preparing result object model
  availableOrgans.map((item) => {
    result[item] = 0;
  });
  const organ = order.organ.toLowerCase();
  const cash = Number(order.cash);
  const price = Number(order.price);
  const bonusRatio = Number(order.bonus_ratio);

  // Calculating the number of organs purchased and bonuses
  const purchased = Math.floor(cash / price);
  const bonuseCounts = Math.floor(purchased / bonusRatio);

  // Adding the purchased organs to the result object
  result[organ] = purchased;

  // Adding the bonus organs to the result object
  if (bonuseCounts > 0 && organ in promotionScheme) {
    const bonusOrgans = promotionScheme[organ].bonus;

    for (const bonusOrgan in bonusOrgans) {
      const bonusAmount = bonuseCounts * bonusOrgans[bonusOrgan];
      result[bonusOrgan] += bonusAmount;
    }
  }
  return result;
};

export const processOrders = async (
  orderFile: string
): Promise<ProcessedResult> => {
  let processedResult: ProcessedResult;

  const csvResult = await readCSV(orderFile);
  if (csvResult.success) {
    const finalResults: string[][] = [];

    for (const order of csvResult.data) {
      // Calculating and applying the bonus
      const calculatedResult = calculateOrder(order);
      //Formating the w.r.t. output
      const formatedResult: string[] = formatOrder(calculatedResult);
      finalResults.push(formatedResult);
    }

    processedResult = {
      success: true,
      data: finalResults,
    };
  } else {
    processedResult = {
      success: false,
      message: 'error in orderFile file reading',
    };
  }
  return processedResult;
};
