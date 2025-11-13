$(() => {
    const getAll = async (msg) => {
        try {
            $("#studentList").text("Finding Student Information...");
            let response = await fetch("api/student");
            if (response.ok) {
                let payload = await response.json();
                buildStudentList(payload);
                $("#status").text(msg === "" ? "Students Loaded" : `${msg} - Students Loaded`);
            } else if (response.status !== 404) {
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else {
                $("#status").text("No such path on server");
            }

            // Get division data
            response = await fetch("api/division");
            if (response.ok) {
                let divs = await response.json();
                sessionStorage.setItem("alldivisions", JSON.stringify(divs));
            } else if (response.status !== 404) {
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else {
                $("#status").text("No such path on server");
            }
        } catch (error) {
            $("#status").text(error.message);
        }
    };

    const buildStudentList = (data,usealldata = true) => {
        $("#studentList").empty();
        let div = $(`
            <div class="list-group-item text-white bg-secondary row d-flex" id="status">Student Info</div>
            <div class="list-group-item row d-flex text-center" id="heading">
                <div class="col-4 h4">Title</div>
                <div class="col-4 h4">First</div>
                <div class="col-4 h4">Last</div>
            </div>
        `);
        div.appendTo($("#studentList"));

        usealldata ? sessionStorage.setItem("allstudents", JSON.stringify(data)) : null;
        let btn = $(`<button class="list-group-item row d-flex" id="0">...click to add student</button>`);
        btn.appendTo($("#studentList"));

        data.forEach((stu) => {
            btn = $(`
                <button class="list-group-item row d-flex" id="${stu.id}">
                    <div class="col-4" id="studenttitle${stu.id}">${stu.title}</div>
                    <div class="col-4" id="studentfname${stu.id}">${stu.firstname}</div>
                    <div class="col-4" id="studentlastname${stu.id}">${stu.lastname}</div>
                </button>
            `);
            btn.appendTo($("#studentList"));
        });
    };

    getAll("");

    $("#studentList").on("click", (e) => {
        let id = e.target.parentNode.id || e.target.id;
        if (id !== "status" && id !== "heading") {
            let data = JSON.parse(sessionStorage.getItem("allstudents"));
            id === "0" ? setupForAdd() : setupForUpdate(id, data);
        }
    });

    const update = async () => {
        try {
            let stu = JSON.parse(sessionStorage.getItem("student"));
            stu.title = $("#TextBoxTitle").val();
            stu.firstname = $("#TextBoxFirst").val();
            stu.lastname = $("#TextBoxSurname").val();
            stu.email = $("#TextBoxEmail").val();
            stu.phoneno = $("#TextBoxPhone").val();
            stu.divisionId = parseInt($("#ddlDivisions").val());

            let response = await fetch("api/student", {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(stu),
            });

            if (response.ok) {
                let payload = await response.json();
                getAll(payload.msg);
            } else {
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            }
        } catch (error) {
            $("#status").text(error.message);
        }
        $("#theModal").modal("toggle");
    };

    const clearModalFields = () => {
        loadDivisionDDL(-1);
        $("#TextBoxTitle").val("");
        $("#TextBoxFirst").val("");
        $("#TextBoxSurname").val("");
        $("#TextBoxEmail").val("");
        $("#TextBoxPhone").val("");
        sessionStorage.removeItem("student");
        $("#theModal").modal("toggle");
    };

    const setupForAdd = () => {
        $("#actionbutton").val("add");
        $("#modaltitle").html("<h4>Add Student</h4>");
        clearModalFields();
        $("#deletebutton").hide();
    };

    const setupForUpdate = (id, data) => {
        $("#actionbutton").val("update");
        clearModalFields();
        data.forEach((student) => {
            if (student.id === parseInt(id)) {
                $("#TextBoxTitle").val(student.title);
                $("#TextBoxFirst").val(student.firstname);
                $("#TextBoxSurname").val(student.lastname);
                $("#TextBoxEmail").val(student.email);
                $("#TextBoxPhone").val(student.phoneno);
                sessionStorage.setItem("student", JSON.stringify(student));
                loadDivisionDDL(student.divisionId);
                $("#deletebutton").show();
            }
        });
    };

    const add = async () => {
        try {
            let stu = {
                title: $("#TextBoxTitle").val(),
                firstname: $("#TextBoxFirst").val(),
                lastname: $("#TextBoxSurname").val(),
                email: $("#TextBoxEmail").val(),
                phoneno: $("#TextBoxPhone").val(),
                divisionId: parseInt($("#ddlDivisions").val()),
                id: -1,
                timer: null,
                picture64: null,
            };

            let response = await fetch("api/student", {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(stu),
            });

            if (response.ok) {
                let data = await response.json();
                getAll(data.msg);
            } else {
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            }
        } catch (error) {
            $("#status").text(error.message);
        }
        $("#theModal").modal("toggle");
    };

    const _delete = async () => {
        let student = JSON.parse(sessionStorage.getItem("student"));
        try {
            let response = await fetch(`api/student/${student.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json; charset=utf-8" },
            });

            if (response.ok) {
                let data = await response.json();
                getAll(data.msg);
            } else {
                $("#status").text(`Status - ${response.status}, Problem on delete server side.`);
            }
        } catch (error) {
            $("#status").text(error.message);
        }
        $("#theModal").modal("toggle");
    };

    $("#actionbutton").on("click", () => {
        $("#actionbutton").val() === "update" ? update() : add();
    });

    const loadDivisionDDL = (studiv) => {
        let html = "";
        $("#ddlDivisions").empty();
        let alldivisions = JSON.parse(sessionStorage.getItem("alldivisions"));
        alldivisions.forEach((div) => {
            html += `<option value="${div.id}">${div.name}</option>`;
        });
        $("#ddlDivisions").append(html);
        $("#ddlDivisions").val(studiv);
    };
    $("#srch").on("keyup", () => {
        let alldata = JSON.parse(sessionStorage.getItem("allstudents"));
        let filtereddata = alldata.filter((stu) => stu.lastname.match(new RegExp($("#srch").val(), 'i')));
        buildStudentList(filtereddata, false);
    }); // srch keyup
});
