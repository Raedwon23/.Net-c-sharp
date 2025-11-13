using ExercisesViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExercisesTests
{
    public class ViewModelTests
    {
        [Fact]
        public async Task Student_GetByLastnameTest()
        {
            StudentViewModel vm = new() { Lastname = "Cross" };
            await vm.GetByLastname();
            Assert.NotNull(vm.Firstname);
        }

        [Fact]
        public async Task Student_GetByIdTest()
        {
            StudentViewModel vm = new() { Id = 1 };
            await vm.GetById();
            Assert.NotNull(vm.Firstname);
        }

        [Fact]
        public async Task Student_GetAll()
        {
            List<StudentViewModel> allStudentVms;
            StudentViewModel vm = new();
            allStudentVms = await vm.GetAll();
            Assert.True(allStudentVms.Count > 0);
        }
        
        [Fact]
        public async Task Student_Add()
        {
            StudentViewModel vm;
            vm = new()
            {
                Title = "Mr.",
                Firstname = "Urshit",
                Lastname = "Patel",
                Email = "up@abc.com",
                Phoneno = "(777)777-7777",
                DivisionId = 10 // ensure division id is in Division table
            };
            await vm.Add();
            Assert.True(vm.Id > 0);
        }
        
        [Fact]
        public async Task Student_UpdateTest()
        {
            StudentViewModel vm = new() { Lastname = "Patel" };
            await vm.GetByLastname(); // Student just added in Add test
            vm.Email = vm.Email == "up@abc.com" ? "ump@abc.com" : "up@abc.com";
            // will be -1 if failed 0 if no data changed, 1 if succcessful
            Assert.True(await vm.Update() == 1);

        }

        [Fact]
        public async Task Student_Delete()
        {
            StudentViewModel vm = new() { Lastname = "Patel" };
            await vm.GetByLastname(); // Student just added
            Assert.True(await vm.Delete() == 1); // 1 student deleted
        }

        [Fact]
        public async Task Student_GetByPhoneNumberTest()
        {
            StudentViewModel vm = new() { Phoneno = "(555) 555-5555" };
            await vm.GetByPhoneNumber();
            Assert.NotNull(vm.Firstname);
        }

        [Fact]
        public async Task Student_ConcurrencyTest()
        {
            StudentViewModel vm1 = new() { Lastname = "Cross" };
            StudentViewModel vm2 = new() { Lastname = "Cross" };
            await vm1.GetByLastname(); // Fetch same student to simulate 2 users
            if (vm1.Lastname != "Not Found") // make sure we found a student
            {
                await vm2.GetByLastname(); // fetch same data
                vm1.Phoneno = vm1.Phoneno == "(555)555-5551" ? "(555)555-5552" : "(555)555-5551";
                if (await vm1.Update() == 1)
                {
                    vm2.Phoneno = "(666)666-6666"; // just need any value
                    Assert.True(await vm2.Update() == -2);
                }
            }
            else
            {
                Assert.True(false); // student not found
            }
        }

    }
}