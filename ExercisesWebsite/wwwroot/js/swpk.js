$(() => {
    // Keep existing file upload handler
    $("input:file").on("change", () => {
        try {
            const reader = new FileReader();
            const file = $("#uploader")[0].files[0];
            $("#uploadstatus").text("");
            file ? reader.readAsBinaryString(file) : null;
            reader.onload = (readerEvt) => {
                const binaryString = reader.result;
                const encodedString = btoa(binaryString);
                let student = JSON.parse(sessionStorage.getItem("student"));
                student.picture64 = encodedString;
                sessionStorage.setItem("student", JSON.stringify(student));
                $("#uploadstatus").text("retrieved local pic")
            };
        } catch (error) {
            $("#uploadstatus").text("pic upload failed")
        }
    });

    // Simplified setupForAdd - now the only modal setup function
    const setupModal = () => {
        $("#modaltitle").html("<h4>Add Student</h4>");
        clearModalFields();
        // Hide delete button and change action button text
        $("#deletebutton").hide();
        $("#actionbutton").val("Add").show();
    };

    // Modified clearModalFields
    const clearModalFields = () => {
        loadDivisionDDL(-1);
        $("#TextBoxTitle").val("");
        $("#TextBoxFirst").val("");
        $("#TextBoxSurname").val("");
        $("#TextBoxEmail").val("");
        $("#TextBoxPhone").val("");
        sessionStorage.removeItem("student");
        sessionStorage.removeItem("picture");
        $("#uploadstatus").text("");
        $("#imageHolder").html("");
        $("#uploader").val("");
    };

    // Simplified student list click handler
    $("#studentList").on("click", (e) => {
        let id = e.target.parentNode.id || e.target.id;
        if (id !== "status" && id !== "heading") {
            setupModal(); // Always setup for add
            $("#theModal").modal("show");
        }
    });

    // Simplified add function
    $("#actionbutton").on("click", async () => {
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
                $("#theModal").modal("hide"); // Changed to hide
            } else {
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            }
        } catch (error) {
            $("#status").text(error.message);
        }
    });

    // Keep existing loadDivisionDDL function
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

    // Keep existing search functionality
    $("#srch").on("keyup", () => {
        let alldata = JSON.parse(sessionStorage.getItem("allstudents"));
        let filtereddata = alldata.filter((stu) => stu.lastname.match(new RegExp($("#srch").val(), 'i')));
        buildStudentList(filtereddata, false);
    });
});