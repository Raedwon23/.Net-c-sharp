$(() => {


    // Cached DOM elements
    const studentList = $("#studentList");
    const modalStatus = $("#modalstatus");
    const markRow = $("#MarkRow");
    const commentsRow = $("#CommentsRow");

    // Error handling function
    const errorRtn = (problemJson, status) => {
        if (status > 499) {
            $("#status").text("Problem server side, see debug console");
        } else {
            let keys = Object.keys(problemJson.errors);
            problem = keys[0];
            $("#status").text(problemJson.errors[problem]);
        }
    };

    // Clear and hide modal fields
    const clearModalFields = () => {
        $("#TextBoxMark").val("");
        $("#TextBoxComments").val("");
        markRow.hide();
        commentsRow.hide();
        modalStatus.text("");
        $("#ddlCourses").empty();
    };

    // Load all students
    const getAll = async (msg) => {
        try {
            studentList.text("Finding Student Information...");
            const response = await fetch("api/student");
            if (response.ok) {
                const payload = await response.json();
                buildStudentList(payload);
                $("#status").text(msg === "" ? "Students Loaded" : `${msg} - Students Loaded`);
            } else if (response.status !== 404) {
                const problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else {
                $("#status").text("No such path on server");
            }
        } catch (error) {
            $("#status").text(error.message);
        }
    };


   

    };
    // Build student list display
    const buildStudentList = (data) => {
        studentList.empty();
        const header = $(`
            <div class="list-group-item text-white bg-secondary row d-flex" id="status">Student Info</div>
            <div class="list-group-item row d-flex text-center" id="heading">
                <div class="col-4 h4">Title</div>
                <div class="col-4 h4">First</div>
                <div class="col-4 h4">Last</div>
            </div>
        `);
        header.appendTo(studentList);

        sessionStorage.setItem("allstudents", JSON.stringify(data));

        data.forEach((student) => {
            const studentRow = $(`
                <button class="list-group-item row d-flex" id="${student.id}">
                    <div class="col-4" id="studenttitle${student.id}">${student.title}</div>
                    <div class="col-4" id="studentfname${student.id}">${student.firstname}</div>
                    <div class="col-4" id="studentlname${student.id}">${student.lastname}</div>
                </button>
            `);
            studentRow.appendTo(studentList);
        });
    };

    // Handle student selection
    studentList.on("click", async (e) => {
        const id = e.target.parentNode.id || e.target.id;
        if (id !== "status" && id !== "heading") {
            try {
                clearModalFields();

                // Get selected student info
                const allStudents = JSON.parse(sessionStorage.getItem("allstudents"));
                const selectedStudent = allStudents.find(s => s.id === parseInt(id));

                if (selectedStudent) {
                    sessionStorage.setItem("student", JSON.stringify(selectedStudent));
                }

                // Fetch student's courses
                let response = await fetch(`api/course/${id}`);
                if (response.ok) {
                    const courses = await response.json();
                    sessionStorage.setItem("studentcourses", JSON.stringify(courses));
                }

                // Fetch student's grades
                response = await fetch(`api/grade/${id}`);
                if (response.ok) {
                    const grades = await response.json();
                    sessionStorage.setItem("studentgrades", JSON.stringify(grades));
                    if (grades.length > 0) {
                        setupModal(grades[0]);
                        $("#theModal").modal('show');
                    }
                }
            } catch (error) {
                $("#status").text(error.message);
            }
        }
    });

    // Setup modal with student data
    const setupModal = (data) => {
        const student = JSON.parse(sessionStorage.getItem("student"));
        if (student) {
            $("#Firstname").text(student.firstname);
            $("#Lastname").text(student.lastname);
        }

        // Build course dropdown
        const courses = JSON.parse(sessionStorage.getItem("studentcourses"));
        const coursesDropdown = $("#ddlCourses");
        coursesDropdown.empty();

        coursesDropdown.append('<option value="">Select a Course</option>');
        courses.forEach(course => {
            coursesDropdown.append(
                `<option value="${course.courseId}">${course.name}</option>`
            );
        });
    };

    // Handle course selection
    $("#ddlCourses").change((e) => {
        const courseId = parseInt($(e.target).val());
        if (courseId) {
            const grades = JSON.parse(sessionStorage.getItem("studentgrades"));
            const grade = grades.find(g => g.courseId === courseId);

            if (grade) {
                $("#TextBoxMark").val(grade.mark);
                $("#TextBoxComments").val(grade.comments);
                sessionStorage.setItem("currentGrade", JSON.stringify(grade));

                // Show grade fields
                markRow.show();
                commentsRow.show();
            }
        } else {
            clearModalFields();
        }
    });

    // Handle grade update
    $("#actionbutton").click(async () => {
        const courseId = parseInt($("#ddlCourses").val());
        if (!courseId) {
            modalStatus.text("Please select a course").show();
            return;
        }

        try {
            const currentGrade = JSON.parse(sessionStorage.getItem("currentGrade"));
            const updatedGrade = {
                studentId: currentGrade.studentId,
                courseId: courseId,
                mark: parseInt($("#TextBoxMark").val()),
                comments: $("#TextBoxComments").val().trim(),
                timer: currentGrade.timer
            };

            const response = await fetch("api/grade", {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(updatedGrade)
            });

            if (response.ok) {
                const result = await response.json();
                modalStatus.text(result.msg).show();

                // Refresh grades
                const gradeResponse = await fetch(`api/grade/${updatedGrade.studentId}`);
                if (gradeResponse.ok) {
                    const grades = await gradeResponse.json();
                    sessionStorage.setItem("studentgrades", JSON.stringify(grades));
                }
            } else {
                const problemJson = await response.json();
                errorRtn(problemJson, response.status);
            }
        } catch (error) {
            modalStatus.text(error.message).show();
        }
    });

    // Initialize
    getAll("");
    clearModalFields();
});