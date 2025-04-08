using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace averages
{
    internal class Program
    {
        //1.
        public static bool CheckData(string filePath)
        {

            int lineNumber = 0;
            string expectedFormat = "dd/MM/yyyy HH:mm";
            Dictionary<DateTime, int> uniqueDates = new Dictionary<DateTime, int>();

            using (StreamReader reader = new StreamReader(filePath))
            {
                string line;
                reader.ReadLine();
                while ((line = reader.ReadLine()) != null)
                {
                    lineNumber++;
                    string[] columns = line.Split(','); //seperate line by columns
                    string dateColumn = columns[0].Trim(); // date column
                    string valueColumn = columns[1].Trim(); //value column


                    //Check date format
                    if (!DateTime.TryParseExact(dateColumn, expectedFormat, null, DateTimeStyles.None, out DateTime parsedDateTime))
                    {
                        Console.WriteLine($"Invalid date format at line {lineNumber + 1}");
                        return false;
                    }


                    //Check empty lines in column B
                    if (string.IsNullOrWhiteSpace(valueColumn))
                    {
                        Console.WriteLine($"Empty value in column B at line {lineNumber + 1}");
                        return false;
                    }

                    //Check duplicate date and time
                    if (uniqueDates.TryGetValue(parsedDateTime, out int originalLine))
                    {
                        Console.WriteLine($"Duplicate date in row {lineNumber + 1}, and row {originalLine}");
                        return false;
                    }
                    else
                    {
                        uniqueDates[parsedDateTime] = lineNumber + 1;
                    }
                }
            }
            return true;
        }


        //2.
        //Split big file into small files
        public static string SplitFile(string filePath)
        {
            string outputDir = Path.Combine(Path.GetDirectoryName(filePath), "small_parts");
            Directory.CreateDirectory(outputDir);

            using (StreamReader reader = new StreamReader(filePath))
            {
                string header = reader.ReadLine();

                //dictionary contains date and streamwiter for a file
                Dictionary<string, StreamWriter> fileWriters = new Dictionary<string, StreamWriter>();

                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    string[] columns = line.Split(',');
                    string dateColumn = columns[0].Trim();

                    if (DateTime.TryParse(dateColumn, out DateTime date))
                    {
                        string dateKey = date.ToString("yyyy-MM-dd");
                        if (!fileWriters.ContainsKey(dateKey))
                        {
                            string partPath = Path.Combine(outputDir, $"{dateKey}.csv");
                            fileWriters[dateKey] = new StreamWriter(partPath);
                            fileWriters[dateKey].WriteLine(header);
                        }
                        fileWriters[dateKey].WriteLine(line); //write current line- date + value
                    }
                    else
                    {
                        Console.WriteLine($"Invalid date format in line: {line}");
                    }
                }
                foreach (var writer in fileWriters.Values)
                {
                    writer.Close();
                }
            }
            Console.WriteLine("File divided by date successfully!");
            return outputDir;
        }


        //Reading each file by itself
        public static void ProcessAndWriteFile(string inputFile, StreamWriter writer)
        {
            Dictionary<string, (double sum, int count)> dateTimeSums = new Dictionary<string, (double, int)>();
            using (StreamReader reader = new StreamReader(inputFile))
            {
                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    string[] values = line.Split(',');

                    if (values.Length < 2) continue; //countinues to next line

                    string trimmedDate = values[0].Trim();
                    string trimmedValue = values[1].Trim();

                    if (DateTime.TryParseExact(trimmedDate,
                        new string[] { "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm", "dd/MM/yyyy HH:mm:ss", "dd/MM/yyyy HH:mm" },
                        CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDateTime))
                    {
                        string dateTimeWithoutMinutes = parsedDateTime.ToString("yyyy-MM-dd HH");

                        if (double.TryParse(trimmedValue, NumberStyles.Any, CultureInfo.InvariantCulture, out double numericValue) &&
                            !double.IsNaN(numericValue))
                        {
                            if (dateTimeSums.ContainsKey(dateTimeWithoutMinutes))
                            {
                                dateTimeSums[dateTimeWithoutMinutes] =
                                    (dateTimeSums[dateTimeWithoutMinutes].sum + numericValue,
                                     dateTimeSums[dateTimeWithoutMinutes].count + 1);
                            }
                            else
                            {
                                dateTimeSums[dateTimeWithoutMinutes] = (numericValue, 1);
                            }
                        }
                    }
                }
            }

            //Writing to final file date and avarage
            foreach (var entry in dateTimeSums)
            {
                double average = entry.Value.sum / entry.Value.count;
                writer.WriteLine($"{entry.Key},{average:F2}");
            }
        }


        static void Main(string[] args)
        {
            //1.
            string filePath = @"C:\Users\user1\Desktop\file\\time_series.csv";

            //bool isValidData = CheckData(filePath);
            //Console.WriteLine(isValidData);


            //2.
            //Split file
            string outputDir = SplitFile(filePath);

            //Read file and calculate sum + avg 
            //Write results to file

            string outputFile = @"C:\Users\user1\Desktop\file\eee.csv";
            try
            {
                string[] files = Directory.GetFiles(outputDir, "*.csv");

                using (StreamWriter writer = new StreamWriter(outputFile))
                {
                    writer.WriteLine("DateTime, Average");
                    foreach (string inputFile in files)
                    {
                        ProcessAndWriteFile(inputFile, writer);
                    }
                }
                Console.WriteLine("Data written to file successfuly.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"error: {ex.Message}");
            }


            //3.
            //To update the hourly averages in real - time when the data arrives as a stream,
            //I plan to use a dictionary to store the sums and counts for each hour (using the date and hour as the key).
            //Each time a new data point arrives, I update the sum and count for that hour. 
            //Immediately after updating the data, I calculate the current hourly average and write it to the output(StreamWriter).
            //This way, the averages are updated in real - time, and there is no need to wait for the entire dataset to be processed.


            //4.
            //Changes in function 1 (SplitFile)
            // To adapt the code for reading from a Parquet file, you need to install the Parquet.NET package 
            // and add a dependency for its usage. It's possible to read the file by accessing rows, columns, or row groups.


            //The advantage of a Parquet file is that it allows reading by columns instead of by rows,
            //enabling faster computations without loading unnecessary data. For example, in the given
            //exercise where we needed to calculate averages, Parquet would improve
            // performance by reading only the relevant column instead of processing entire rows.


            Console.ReadLine();
        }
    }
}
