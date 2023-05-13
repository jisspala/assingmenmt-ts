interface ProcessedResult {
  success: boolean;
  data?: [];
  message?: string;
}

export const processOrders = async (
  orderFile: string
): Promise<ProcessedResult> => {
  const processedResult: ProcessedResult = {
    success: true,
    data: [],
  };
  return processedResult;
};
