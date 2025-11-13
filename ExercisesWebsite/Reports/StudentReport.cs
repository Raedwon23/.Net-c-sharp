using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using ExercisesViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using iText.Layout.Borders;

namespace ExercisesWebsite.Reports
{
    public class StudentReport
    {
        public async Task GenerateReport(List<StudentViewModel> students, string rootPath)
        {
            PdfDocument pdfDoc = new PdfDocument(new PdfWriter(rootPath + "/pdfs/studentreport.pdf"));
            Document document = new Document(pdfDoc);

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