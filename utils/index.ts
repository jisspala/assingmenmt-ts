// Read the orders from the CSV file
import fs from 'fs';
import parse from 'csv-parse/lib/sync';

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
    result = {
      success: false,
    };
  }
  return result;
}
