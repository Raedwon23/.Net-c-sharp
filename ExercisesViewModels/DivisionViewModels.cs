using ExercisesDAL;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ExercisesViewModels
{
    public class DivisionViewModels
    {
        readonly private DivisionDAO _dao;
      
        public int? Id { get; set; }
        public string? Name { get; set; }

        public string? Timer { get; set; }

        public DivisionViewModels()
        {
            _dao = new DivisionDAO();
        }
        public async Task<List<DivisionViewModels>> GetAll()
        {
            List<DivisionViewModels> allVms = new();
            try
            {
                List<Division> allDivs = await _dao.GetAll();
                // we need to convert Student instance to StudentViewModel because
                // the Web Layer isn't aware of the Domain class Student
                foreach (Division stu in allDivs)
                {
                    DivisionViewModels stuVm = new()
                    {
                     
                        Name = stu.Name,
                        Id = stu.Id, 

                    // binary value needs to be stored on client as base64
                    Timer = Convert.ToBase64String(stu.Timer)
                    };
                    allVms.Add(stuVm);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                throw;
            }
            return allVms;
        }
    }
}
