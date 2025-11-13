using ExercisesDAL;
using System.Diagnostics;

public class GradeDAO
{
    private readonly IRepository<Grade> _repo;

    public GradeDAO()
    {
        _repo = new SomeSchoolRepository<Grade>();  
    }

    public async Task<List<Grade>> GetGradesForStudent(int studentId)
    {
        try
        {
         
            return await _repo.GetSome(grade => grade.StudentId == studentId);  // Using GetSome with a condition
        }
        catch (Exception ex)
        {
            Debug.WriteLine("Error: " + ex.Message);
            throw;
        }
    }
    public async Task<UpdateStatus> UpdateGrade(Grade grade)
    {
        try
        {
          
            var currGrade = await _repo.GetOne(g => g.StudentId == grade.StudentId && g.CourseId == grade.CourseId);

            if (currGrade != null)
            {
                
             
                // Update the grade
                currGrade.Mark = grade.Mark;
                currGrade.Comments = grade.Comments;
                currGrade.Timer = grade.Timer; 

                
                return await _repo.Update(currGrade);
            }
            else
            {
                return UpdateStatus.Failed; 
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine("Error: " + ex.Message);
            throw;
        }
    }

}
