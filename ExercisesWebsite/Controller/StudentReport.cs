using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using ExercisesViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using iText.Layout.Borders;
using iText.IO.Image;
using iText.Kernel.Geom;

namespace ExercisesWebsite.Reports
{
    public class StudentReport
    {
        public async Task GenerateReport(List<StudentViewModel> students, string rootPath)
        {
            PdfDocument pdfDoc = new PdfDocument(new PdfWriter(rootPath + "/pdfs/studentreport.pdf"));
            Document document = new Document(pdfDoc, PageSize.A4);

            // Add logo
            var logo = new Image(ImageDataFactory.Create(rootPath + "/img/sl.png"))
                .ScaleAbsolute(200, 100)
                .SetFixedPosition((PageSize.A4.GetWidth() - 200) / 2, 710);
            document.Add(logo);

            // Add spacing after logo
            document.Add(new Paragraph("\n"));
            document.Add(new Paragraph("\n"));
            document.Add(new Paragraph("\n"));

            // Add heading
            document.Add(new Paragraph("Current Students")
                .SetTextAlignment(TextAlignment.CENTER)
                .SetFontSize(24));

            // Add space after heading
            document.Add(new Paragraph("\n"));

            // Create a table with 3 columns
            Table table = new Table(3);
            table.SetWidth(UnitValue.CreatePercentValue(100));

            // Add the header row
            table.AddCell(new Cell().Add(new Paragraph("Title")
                .SetFontSize(14)
                .SetPaddingLeft(24)
                .SetTextAlignment(TextAlignment.LEFT))
                .SetBorder(Border.NO_BORDER));

            table.AddCell(new Cell().Add(new Paragraph("First Name")
                .SetFontSize(14)
                .SetPaddingLeft(24)
                .SetTextAlignment(TextAlignment.LEFT))
                .SetBorder(Border.NO_BORDER));

            table.AddCell(new Cell().Add(new Paragraph("Last Name")
                .SetFontSize(14)
                .SetPaddingLeft(24)
                .SetTextAlignment(TextAlignment.LEFT))
                .SetBorder(Border.NO_BORDER));

            // Print the list of students
            foreach (var student in students)
            {
                table.AddCell(new Cell().Add(new Paragraph(student.Title ?? "")
                    .SetFontSize(14)
                    .SetPaddingLeft(24)
                    .SetTextAlignment(TextAlignment.LEFT))
                    .SetBorder(Border.NO_BORDER));

                table.AddCell(new Cell().Add(new Paragraph(student.Firstname ?? "")
                    .SetFontSize(14)
                    .SetPaddingLeft(24)
                    .SetTextAlignment(TextAlignment.LEFT))
                    .SetBorder(Border.NO_BORDER));

                table.AddCell(new Cell().Add(new Paragraph(student.Lastname ?? "")
                    .SetFontSize(14)
                    .SetPaddingLeft(24)
                    .SetTextAlignment(TextAlignment.LEFT))
                    .SetBorder(Border.NO_BORDER));
            }

            document.Add(table);

            // Add date line at the bottom
            document.Add(new Paragraph("Student report written on - " + DateTime.Now)
                .SetFontSize(6)
                .SetTextAlignment(TextAlignment.CENTER));

            document.Close();
        }
    }
}