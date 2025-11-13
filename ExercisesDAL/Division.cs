using System;
using System.Collections.Generic;

namespace ExercisesDAL;

public partial class Division :SchoolEntity
{
   

    public string? Name { get; set; }

   
    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
