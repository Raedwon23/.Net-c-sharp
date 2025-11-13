using ExercisesViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Reflection;

namespace ExercisesWebsite.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class GradeController : ControllerBase
    {
        // Get all grades for a student
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                GradeViewModel viewmodel = new();
                List<GradeViewModel> allGrades = await viewmodel.GetAllGradesForStudent(id); // Get grades for the student
                return Ok(allGrades); // Return grades
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError); // something went wrong
            }
        }

        // Update a grade
        [HttpPut]
        public async Task<IActionResult> Put(GradeViewModel gvm)
        {
            try
            {
                // Ensure Timer is provided
                if (string.IsNullOrEmpty(gvm.Timer))
                {
                    return BadRequest("Timer is required for concurrency control.");
                }

                // Ensure all required fields are present
                if (gvm.StudentId == 0 || gvm.CourseId == 0)
                {
                    return BadRequest("StudentId and CourseId are required.");
                }

                // Call UpdateGrade from the GradeViewModel to update the grade
                int updateStatus = await gvm.UpdateGrade();

                return updateStatus switch
                {
                    1 => Ok(new { msg = "Student " + gvm.StudentId + " updated!" }),
                    -1 => Ok(new { msg = "Grade not updated!" }),
                    -2 => Ok(new { msg = "Concurrency issue, grade not updated!" }),
                    _ => Ok(new { msg = "Grade not updated!" })
                };
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);  // something went wrong
            }
        }
    }
}