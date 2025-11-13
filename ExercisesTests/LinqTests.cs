using ExercisesDAL;
using Microsoft.EntityFrameworkCore;
using System.Linq;
namespace ExercisesTests
{
    public class LinqTests
    {
        [Fact]
        public void Test1()
        {
            SomeSchoolContext _db = new();
            var selectedStudents = from stu in _db.Students
                                   where stu.Id == 2
                                   select stu;
            Assert.True(selectedStudents.Any());
        }

        [Fact]
        public void Test2()
        {
            SomeSchoolContext _db = new();
            var selectedStudents = from stu in _db.Students
                                   where stu.Title == "Ms." || stu.Title == "Mrs."
                                   select stu;

            Assert.True(selectedStudents.Any());


        }
        [Fact]
        public void Test3()
        {
            SomeSchoolContext _db = new();
            var selectedStudents = from stu in _db.Students
                                   join divi in _db.Divisions
                                   on stu.DivisionId equals divi.Id
                                   where divi.Name == "Design"
                                   select stu;

            Assert.True(selectedStudents.Any());


        }
        [Fact]
        public void Test4()
        {
            SomeSchoolContext _db = new();
            Student? selectedStudent = _db.Students.FirstOrDefault(stu => stu.Id == 2);
            Assert.True(selectedStudent!.FirstName == "Sunny");
        }
        [Fact]
        public void Test5()
        {
            SomeSchoolContext _db = new();
            var selectedStudents = _db.Students.Where(stu => stu.Title == "Ms." || stu.Title == "Mrs.");
            Assert.True(selectedStudents.Any());



        }
        [Fact]
        public void Test6()
        {
            SomeSchoolContext _db = new();
            var selectedStudents = _db.Students.Where(stu => stu.Division.Name == "Design");
            Assert.True(selectedStudents.Any());



        }
        [Fact]
        public async Task Test7()
        {
            SomeSchoolContext _db = new();
            Student? selectedStudent = await _db.Students.FirstOrDefaultAsync(stu => stu.LastName == "Patel");
            if (selectedStudent != null)
            {
                string oldEmail = selectedStudent.Email!;
                string NewEmail = oldEmail == "js@someschool.com" ? "up@someschool.com" : "js@someschool.com";
                selectedStudent.Email = NewEmail;
                _db.Entry(selectedStudent).CurrentValues.SetValues(selectedStudent);
            }
            Assert.True(await _db.SaveChangesAsync() == 1); // rows updated, will be 0 if student not found
        }

        [Fact]
        public async Task Test8()
        {
            SomeSchoolContext _db = new();
            Student newStudent = new()
            {
                FirstName = "Urshit",
                LastName = "Patel",
                PhoneNo = "(555)555-1234",
                Title = "Mr.",
                DivisionId = 10,
                Email = "js@someschool.com"
            };
            await _db.Students.AddAsync(newStudent);
            await _db.SaveChangesAsync();
            Assert.True(newStudent.Id > 0); // should be populated after save
        }

        [Fact]
        public async Task Test9()
        {
            SomeSchoolContext _db = new();
            Student? selectedStudent = await _db.Students.FirstOrDefaultAsync(stu => stu.FirstName == "Joe" && stu.LastName == "Smith");
            if (selectedStudent != null)
            {
                _db.Students.Remove(selectedStudent);
                Assert.True(await _db.SaveChangesAsync() == 1); // # of rows deleted
            }
            else
            {
                Assert.True(false);
            }
        }
    }
}