using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace logs
{
    internal class Program
    {
        //1.
        // Split file into small parts
        public static string SplitFile(string filePath)
        {
            string outputDir = Path.Combine(Path.GetDirectoryName(filePath), "parts");
            Directory.CreateDirectory(outputDir);

            using (StreamReader reader = new StreamReader(filePath))
            {
                int partNumber = 1;
                int linesPerPart = 1000;
                while (!reader.EndOfStream)
                {
                    string partPath = Path.Combine(outputDir, $"part_{partNumber}.txt");
                    using (StreamWriter writer = new StreamWriter(partPath))
                    {
                        for (int i = 0; i < linesPerPart && !reader.EndOfStream; i++)
                        {
                            writer.WriteLine(reader.ReadLine());
                        }
                    }
                    partNumber++;
                }
            }
            Console.WriteLine("File divided succesfully!");
            return outputDir;
        }


        //2.
        //Count errors for a single file
        public static void CountErrorsInFile(string filePath, Dictionary<string, int> errorsCount)
        {
            int maxLines = 1000;
            using (StreamReader reader = new StreamReader(filePath))
            {
                for (int i = 0; i < maxLines; i++)
                {
                    string line = reader.ReadLine();
                    if (line != null)
                    {
                        string errorCode = line.Split(new string[] { "Error: " }, StringSplitOptions.None).LastOrDefault()?.Trim();

                        if (errorCode != null && errorCode != "")
                        {
                            if (errorsCount.ContainsKey(errorCode))
                                errorsCount[errorCode]++;
                            else
                                errorsCount[errorCode] = 1;
                        }
                    }
                }
            }
        }



        //3.
        //Iterate through all files in folder and sum their errors
        public static Dictionary<string, int> SumErrorsFromAllFiles(string directoryPath)
        {
            Dictionary<string, int> errorsCount = new Dictionary<string, int>();

            foreach (string filePath in Directory.GetFiles(directoryPath, "*.txt"))
            {
                CountErrorsInFile(filePath, errorsCount);
            }
            return errorsCount;
        }


        static void Main(string[] args)
        {
            //1.
            Console.Write("Enter a path of file: ");
            string filePath = Console.ReadLine();
            string dirPath = SplitFile(filePath);

            //2, 3
            Dictionary<string, int> errorsCount = SumErrorsFromAllFiles(dirPath);

            //4.
            Console.Write("Enter a number: ");
            int N = int.Parse(Console.ReadLine());
            var topErrors = errorsCount.OrderByDescending(kv => kv.Value).Take(N);
            Console.WriteLine($"\nTop {N} error codes:");
            foreach (var kv in topErrors)
            {
                Console.WriteLine($"Error Code: {kv.Key}, Count: {kv.Value}");
            }

            //5.
            //Time Complexity: O(NLOGN)
            //Explanation:
            //SplitFile- O(N) - iterate through all lines in the file
            //CountErrorsInFile- O(1) - permanent iteration of 1000. (dictionary's actions like containsKey are O(1)
            //SumErrorsFromAllFiles- O(N) - iterate through N files and for each file call the above function (of O(1))
            //OrderByDescending- O(NLOGN) - sort a dictionary
            //Total= 
            // O(N) + O(N) + O(NLOGN)= O(NLOGN)


            //Space complexity: O(N)
            //Explanation:
            //splitFile- O(N) - required to store N lines (before spliting into small files. The small files- O(1))
            //CountErrorsInFile -  O(N)- required to store N error codes in the dictionary.
            //OrderByDescending -  O(N)
            //Total= 
            // O(N) + O(N) + O(N) = O(N)


            Console.ReadLine();

            //Examples of path
            //string outputDir = @"C:\Users\user1\Desktop\file\parts";
            //string filePath = @"C:\Users\user1\Desktop\file\logs.txt";
        }
    }
}
