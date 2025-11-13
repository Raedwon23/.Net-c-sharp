using System.Diagnostics;

namespace ExercisesDAL
{
    public class CourseDAO
    {
        private readonly IRepository<Course> _repo;
        private readonly IRepository<Grade> _gradeRepo;

        public CourseDAO()
        {
            _repo = new SomeSchoolRepository<Course>();
            _gradeRepo = new SomeSchoolRepository<Grade>();
        }

        // Get courses for a specific student
        public async Task<List<Course>> GetCoursesForStudent(int studentId)
        {
            List<Course> studentCourses = new();
            try
            {
                // Get all grades for the student
                var studentGrades = await _gradeRepo.GetSome(g => g.StudentId == studentId);

                // Extract courses from grades
                foreach (Grade g in studentGrades)
                {
                    Course course = g.Course;
                    studentCourses.Add(course);
                }

                return studentCourses.Distinct().ToList();  // Remove any duplicates
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " GetCoursesForStudent " + ex.Message);
                throw;
            }
        }
    }
}