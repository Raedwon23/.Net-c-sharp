using System;
using System.Collections.Generic;

namespace ExercisesDAL;

public partial class Grade : SchoolEntity
{
    
    public int StudentId { get; set; }

    public int CourseId { get; set; }

    public int Mark { get; set; }

    public string? Comments { get; set; }

   
    public virtual Course Course { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
