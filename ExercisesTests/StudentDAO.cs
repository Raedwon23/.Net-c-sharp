using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Reflection;
namespace ExercisesDAL
{
    public class StudentDAO
    {
        readonly IRepository<Student> _repo;
        public StudentDAO()
        {
            _repo = new SomeSchoolRepository<Student>();
        }

        public async Task<Student> GetByLastname(string? name)
        {
            Student? selectedStudent;
            try
            {
                selectedStudent = await _repo.GetOne(stu => stu.LastName == name);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                throw;
            }
            return selectedStudent!;
        }

        public async Task<Student> GetById(int Id)
        {
            Student? selectedStudent;
            try
            {
                selectedStudent = await _repo.GetOne(stu => stu.Id == Id);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                throw;
            }
            return selectedStudent!;
        }


        public async Task<List<Student>> GetAll()
        {
            List<Student> allStudents;
            try
            {
                allStudents = await _repo.GetAll();
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                throw;
            }
            return allStudents;
        }


        public async Task<int> Add(Student newStudent)
        {
            try
            {
                SomeSchoolContext _db = new();
                await _repo.Add(newStudent);
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                throw;
            }
            return newStudent.Id;
        }


        public async Task<UpdateStatus> Update(Student updatedStudent)
        {
            UpdateStatus status;

            try
            {
                status = await _repo.Update(updatedStudent);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                throw;
            }
            return status;
        }
        
        public async Task<int> Delete(int? id)
        {
            int studentsDeleted = -1;
            try
            {
                Student? selectedStudent = await _repo.GetOne(stu => stu.Id == id);
                if (selectedStudent != null)
                {
                    //_repo.Remove(selectedStudent);
                    studentsDeleted = await _repo.Delete((int)id!); // returns # of rows removed
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                throw;
            }
            return studentsDeleted;
        }


        public async Task<Student> GetByPhoneNumber(string phoneNumber)
        {
            Student? selectedStudent;
            try
            {
                selectedStudent = await _repo.GetOne(stu => stu.PhoneNo == phoneNumber);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                throw;
            }
            return selectedStudent!;
        }

    }
}