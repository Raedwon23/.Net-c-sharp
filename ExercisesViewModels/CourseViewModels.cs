using ExercisesDAL;
using System.Diagnostics;

namespace ExercisesViewModels
{
    public class CourseViewModel
    {
        public int CourseId { get; set; }
        public string? Name { get; set; }

        private readonly CourseDAO _dao;

        public CourseViewModel()
        {
            _dao = new CourseDAO();
        }

        // Get courses for a specific student
        public async Task<List<CourseViewModel>> GetCoursesForStudent(int studentId)
        {
            List<CourseViewModel> courseVMs = new();
            try
            {
                List<Course> courses = await _dao.GetCoursesForStudent(studentId);
                foreach (Course course in courses)
                {
                    CourseViewModel courseVM = new()
                    {
                        CourseId = course.Id,
                        Name = course.Name
                    };
                    courseVMs.Add(courseVM);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " GetCoursesForStudent " + ex.Message);
                throw;
            }
            return courseVMs;
        }
    }
}