using System;
using System.Collections.Generic;

namespace ExercisesDAL;

public partial class Course : SchoolEntity
{
    

    public string? Name { get; set; }

    public int Credits { get; set; }

    public int DivisionId { get; set; }


    public virtual Division Division { get; set; } = null!;

    public virtual ICollection<Grade> Grades { get; set; } = new List<Grade>();
}
