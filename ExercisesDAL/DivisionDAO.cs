using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ExercisesDAL
{
    public class DivisionDAO
    {

        readonly IRepository<Division> _repo;
        public DivisionDAO()
        {
          _repo = new SomeSchoolRepository<Division>();
        }

        public async Task<List<Division>> GetAll()
        {
            List<Division> allDivs;
            try
            {
                allDivs = await _repo.GetAll();
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                throw;
            }
            return allDivs;
        }

    }
}
