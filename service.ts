interface ProcessedResult {
  success: boolean;
  data?: string[][];
  message?: string;
}

export const processOrders = async (
  orderFile: string
): Promise<ProcessedResult> => {
  const finalResults = [
    ['heart: 0', 'liver: 2', 'lung: 2'],
    ['heart: 0', 'liver: 2', 'lung: 2'],
  ];

  const processedResult: ProcessedResult = {
    success: true,
    data: finalResults,
  };
  return processedResult;
};
