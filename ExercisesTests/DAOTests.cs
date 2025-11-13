using ExercisesDAL;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ExercisesTests
{
    public class DAOTests
    {
        [Fact]
        public async Task Student_GetByLastnameTest()
        {
            StudentDAO dao = new();
            Student selectedStudent = await dao.GetByLastname("Cross");
            Assert.NotNull(selectedStudent);
        }

        [Fact]
        public async Task Student_GetById()
        {
            SomeSchoolContext _db = new();
            Student? selectedStudent = await _db.Students.FindAsync(1);
            Assert.NotNull(selectedStudent);
        }

        [Fact]
        public async Task Student_GetAllTest()
        {
            // SomeSchoolContext _db = new();
            StudentDAO dao = new();
            List<Student> allStudents = await dao.GetAll();
            Assert.True(allStudents.Count > 0);
        }

        [Fact]
        public async Task Student_GetByPhoneNumber()
        {
            StudentDAO dao = new();
            Student selectedStudent = await dao.GetByPhoneNumber("555-555-5555");
            Assert.NotNull(selectedStudent);
        }

        [Fact]
        public async Task Student_AddTest()
        {
            StudentDAO dao = new();
            Student newStudent = new()
            {
                FirstName = "Urshit",
                LastName = "Patel",
                PhoneNo = "(555)555-1234",
                Title = "Mr.",
                DivisionId = 10,
                Email = "js@someschool.com"
            };
            Assert.True(await dao.Add(newStudent) > 0);
        }

        [Fact]
        public async Task Student_UpdateTest()
        {
            StudentDAO dao = new();
            Student? studentForUpdate = await dao.GetByLastname("Cross");
            if (studentForUpdate != null)
            {
                string oldPhoneNo = studentForUpdate.PhoneNo!;
                string newPhoneNo = oldPhoneNo == "(555)555-1234" ? "555-555-5555" : "(555)555-1234";
                studentForUpdate!.PhoneNo = newPhoneNo;
            }
            Assert.True(await dao.Update(studentForUpdate!) == UpdateStatus.Ok);
        }

        [Fact]
        public async Task Student_ConcurrencyTest()
        {
            StudentDAO dao1 = new();
            StudentDAO dao2 = new();
            Student studentForUpdate1 = await dao1.GetByLastname("Cross");
            Student studentForUpdate2 = await dao2.GetByLastname("Cross");
            if (studentForUpdate1 != null)
            {
                string? oldPhoneNo = studentForUpdate1.PhoneNo;
                string? newPhoneNo = oldPhoneNo == "519-555-1234" ? "555-555-5555" : "519-555-1234";
                studentForUpdate1.PhoneNo = newPhoneNo;
                if (await dao1.Update(studentForUpdate1) == UpdateStatus.Ok)
                {
                    // need to change the phone # to something else
                    studentForUpdate2.PhoneNo = "666-666-6668";
                    Assert.True(await dao2.Update(studentForUpdate2) == UpdateStatus.Stale);
                }
                else
                    Assert.True(false); // first update failed
            }
            else
                Assert.True(false); // didn't find student 1
        }

        [Fact]
        public async Task Student_DeleteTest()
        {
            SomeSchoolContext _db = new();
            Student? selectedStudent = await _db.Students.FirstOrDefaultAsync(stu => stu.FirstName == "Urshit" && stu.LastName == "Patel");
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
        [Fact]
        public async Task Student_LoadPicsTest()
        {
            {
                PicsUtility util = new();
                Assert.True(await util.AddStudentPicsToDb());
            }
        }
    }
}