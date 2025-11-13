using Microsoft.AspNetCore.Mvc;
using ExercisesWebsite.Reports;
using ExercisesViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExercisesWebsite.Controller
{
    [ApiController]
    [Route("~/api/StudentReport")]
    public class ReportController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly StudentViewModel _studentViewModel;
        private readonly StudentReport _studentReport;

        public ReportController(IWebHostEnvironment env)
        {
            _env = env;
            _studentViewModel = new StudentViewModel();
            _studentReport = new StudentReport();
        }

        [Route("~/api/helloreport")]
        [HttpGet]
        public IActionResult GetHelloReport()
        {
            try
            {
                HelloReport hello = new();
                hello.GenerateReport(_env.WebRootPath);
                return Ok(new { msg = "Report Generated" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { msg = ex.Message });
            }
        }

        [HttpGet("student")]
        public async Task<IActionResult> GetStudentReport()
        {
            try
            {
                // Get students from database
                List<StudentViewModel> students = await _studentViewModel.GetAll();

                // Generate the report using _studentReport
                await _studentReport.GenerateReport(students, _env.WebRootPath);

                return Ok(new { msg = "Report Generated" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { msg = ex.Message });
            }
        }
    }
}