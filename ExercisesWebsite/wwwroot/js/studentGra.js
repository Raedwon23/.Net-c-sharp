$(() => {
    const studentList = $("#studentList");

    const modalStatus = $("#modalstatus");
    const markRow = $("#MarkRow");
    const commentsRow = $("#CommentsRow");

   
    const errorRtn = (problemJson, status) => {
        if (status > 499) {
            $("#status").text("Problem server side, see debug console");
        } else {
            let keys = Object.keys(problemJson.errors);

            $("#status").text(problemJson.errors[keys[0]]);
        }
    };

    const clearModalFields = () => {
        $("#TextBoxMark").val("");

        $("#TextBoxComments").val("");
        $("#ddlCourses").empty();
        markRow.hide();
        commentsRow.hide();

        modalStatus.text("");
    };

    
    const getAll = async () => {
        try {
            studentList.text("Finding Student Information...");
            const response = await fetch("api/student");

            if (response.ok) {
                const data = await response.json();
                
                buildStudentList(data);
                $("#status").text("Students Loaded");

            } else if (response.status !== 404) {
                const problemJson = await response.json();
                errorRtn(problemJson, response.status);
            }
        } catch (error) {
            $("#status").text(error.message);
        }
    };

    const buildStudentList = (data) => {
        studentList.empty();
        studentList.append(`
            <div class="list-group-item text-white bg-secondary row d-flex" id="status">Student Info</div>
            <div class="list-group-item row d-flex text-center" id="heading">
                <div class="col-4 h4">Title</div>
                <div class="col-4 h4">First</div>
                <div class="col-4 h4">Last</div>
            </div>
        `);

        sessionStorage.setItem("allstudents", JSON.stringify(data));
        data.forEach(student => {
            studentList.append(`
                <button class="list-group-item row d-flex" id="${student.id}">
                    <div class="col-4">${student.title}</div>
                    <div class="col-4">${student.firstname}</div>

                    <div class="col-4">${student.lastname}</div>
                </button>
            `);
        });
    };

    studentList.on("click", async (e) => {
        const id = e.target.closest("button")?.id;
        if (id && !["status", "heading"].includes(id)) {
            try {
                clearModalFields();

                
                const students = JSON.parse(sessionStorage.getItem("allstudents"));
                const student = students.find(s => s.id === parseInt(id));
                if (student) {
                    $("#Firstname").text(student.firstname);
                    $("#Lastname").text(student.lastname);
                    sessionStorage.setItem("student", JSON.stringify(student));
                }

               
                let response = await fetch(`api/course/${id}`);
                if (response.ok) {
                    const courses = await response.json();
                    loadCourses(courses);
                    sessionStorage.setItem("studentcourses", JSON.stringify(courses));
                }

                response = await fetch(`api/grade/${id}`);
                if (response.ok) {
                    const grades = await response.json();
                    sessionStorage.setItem("studentgrades", JSON.stringify(grades));
                }

                $("#theModal").modal("show");
            } catch (error) {
                $("#status").text(error.message);
            }
        }
    });

    const loadCourses = (courses) => {
        const ddl = $("#ddlCourses");
        ddl.empty().append('<option value="">Select a Course</option>');
        courses.forEach(course => {

            ddl.append(`<option value="${course.courseId}">${course.name}</option>`);
        });
    };

    $("#ddlCourses").change((e) => {
        const courseId = parseInt(e.target.value);
        if (courseId) {
            const grades = JSON.parse(sessionStorage.getItem("studentgrades"));
            const grade = grades.find(g => g.courseId === courseId);
            if (grade) {
                $("#TextBoxMark").val(grade.mark);

                $("#TextBoxComments").val(grade.comments);
                sessionStorage.setItem("currentGrade", JSON.stringify(grade));
                markRow.show();
                commentsRow.show();
            }
        } else {
            $("#TextBoxMark").val("");
            $("#TextBoxComments").val("");
            markRow.hide();
            commentsRow.hide();
        }
    }); $("#actionbutton").click(async () => {
        const courseId = parseInt($("#ddlCourses").val());
        if (!courseId) {
            modalStatus.text("Please select a course");
            return;
        }

        try {
            const currentGrade = JSON.parse(sessionStorage.getItem("currentGrade"));
            const updatedGrade = {
                studentId: currentGrade.studentId,
                courseId: courseId,

                mark: parseInt($("#TextBoxMark").val()),
                comments: $("#TextBoxComments").val(),

                timer: currentGrade.timer
            };

            const response = await fetch("api/grade", {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(updatedGrade)
            });



            const result = await response.json();
            if (result.msg.includes("updated")) {
                $("#theModal").modal("hide");
                $("#status.list-group-item").text(result.msg);
            } else {
                modalStatus.text(result.msg);
            }

        } catch (error) {
            modalStatus.text(error.message);
        }
    });
    
    getAll();
});