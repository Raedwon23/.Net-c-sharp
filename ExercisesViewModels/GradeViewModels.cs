using ExercisesDAL;
using System.Diagnostics;

namespace ExercisesViewModels
{
    public class GradeViewModel
    {
        private readonly GradeDAO _dao;

        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public int Mark { get; set; }
        public string? Comments { get; set; }
        public string? Timer { get; set; }
        public string? StudentFirstName { get; set; }
        public string? StudentLastName { get; set; }
        public string? CourseName { get; set; }

        public GradeViewModel()
        {
            _dao = new GradeDAO();
        }

        // Get all grades for a student
        public async Task<List<GradeViewModel>> GetAllGradesForStudent(int studentId)
        {
            List<GradeViewModel> gradeVMs = new();
            try
            {
                List<Grade> grades = await _dao.GetGradesForStudent(studentId);
                foreach (Grade grade in grades)
                {
                    GradeViewModel gradeVM = new()
                    {
                        StudentId = grade.StudentId,
                        CourseId = grade.CourseId,
                        Mark = grade.Mark,
                        Comments = grade.Comments,
                        Timer = Convert.ToBase64String(grade.Timer),
                        StudentFirstName = grade.Student?.FirstName ?? "",
                        StudentLastName = grade.Student?.LastName ?? "",
                        CourseName = grade.Course?.Name ?? ""
                    };
                    gradeVMs.Add(gradeVM);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " GetAllGradesForStudent " + ex.Message);
                throw;
            }
            return gradeVMs;
        }

        // Update a grade
        public async Task<int> UpdateGrade()
        {
            int updateStatus;
            try
            {
                Grade grade = new()
                {
                    StudentId = StudentId,
                    CourseId = CourseId,
                    Mark = Mark,
                    Comments = Comments,
                    Timer = Convert.FromBase64String(Timer!)
                };
                updateStatus = -1;
                updateStatus = Convert.ToInt16(await _dao.UpdateGrade(grade));
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " UpdateGrade " + ex.Message);
                throw;
            }
            return updateStatus;
        }
    }
}