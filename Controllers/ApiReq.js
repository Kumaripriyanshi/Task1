import exceljs from "exceljs";
import PDFDocument from "pdfkit";
import fs from "fs";


export const addition = async (req, res) => {
  const num1 = parseInt(req.body.num1);
  const num2 = parseInt(req.body.num2);

  // Perform the calculation
  const ans = num1 + num2;

  // Write the result to an Excel sheet
  const workbook = new exceljs.Workbook();                     // Creating a new Excel Workbook
  const worksheet = workbook.addWorksheet("Sheet 1");
  worksheet.addRow(["Value 1", "Value 2", "Answer"]);
  worksheet.addRow([num1, num2, ans]);

  // Save the Excel sheet
  const excelBuffer = await workbook.xlsx.writeBuffer();
  const filePath = './result.xlsx';
  await workbook.xlsx.writeFile(filePath);

  printPDF()              // Simultaneously generate the PDF
  res.send({ans:ans});    // Response to the request 
};

export const printPDF = async (req, res) => {
  const workbook = new exceljs.Workbook();
  await workbook.xlsx.readFile("./result.xlsx");
  const worksheet = workbook.getWorksheet("Sheet 1");         // Reading the Worksheet

   

  const pdfDoc = new PDFDocument();               // PDF Generation
  pdfDoc.pipe(fs.createWriteStream("./public/file.pdf"));
  const colSpace = 80;

  worksheet.eachRow((row, rowIndex) => {
    row.eachCell((cell, colIndex) => {
      const xPos = colIndex * 40 + (colIndex - 1) * colSpace;
      const yPos = rowIndex * 40;
      pdfDoc.text(cell.text, xPos, yPos);
      console.log(cell.text)
    });
  });

  pdfDoc.end();

};
