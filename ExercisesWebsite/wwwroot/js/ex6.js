$(() => {
    let studentData = JSON.parse(`[{ "id": 123, "firstname": "Guac", "lastname": "Amole" },
    { "id": 234, "firstname": "Donny", "lastname": "Brook" },
    { "id": 345, "firstname": "Chris", "lastname": "Cross" }]`);

    // Check if studentData is stored in sessionStorage; if not, store the starting array
    sessionStorage.getItem("studentData") === null
        ? sessionStorage.setItem("studentData", JSON.stringify(studentData))
        : null;

    // Load Button Event Handler
    $("#loadButton").on("click", async () => {
        if (sessionStorage.getItem("studentData") === null) {
            const url = "https://raw.githubusercontent.com/elauersen/info3070/master/ex5.json";
            $('#results').text('Locating student data on GitHub, please wait..');
            try {
                let response = await fetch(url);
                if (!response.ok)
                    throw new Error(`Status - ${response.status}, Text - ${response.statusText}`);
                studentData = await response.json();
                sessionStorage.setItem("studentData", JSON.stringify(studentData));
                $('#results').text('Student data on GitHub loaded!');
            } catch (error) {
                $("#results").text(error.message);
            }
        } else {
            studentData = JSON.parse(sessionStorage.getItem("studentData"));
            $('#results').text('Student data from session storage loaded!');
        }

        let html = `<h5 class="text-info">Select a Student</h5>`;
        studentData.forEach((student) => {
            html += `<div class="list-group-item" id="${student.id}" >
${student.id}, ${student.firstname}, ${student.lastname}</div>`;
        });
        $("#studentList").html(html);

        $("#loadButton").hide();
        $("#addButton").show();
        $("#clearButton").show();
        $("#inputFields").show();
    });

    // Click on a student to display details
    $("#studentList").on("click", e => {
        const student = studentData.find(s => s.id === parseInt(e.target.id));
        student
            ? $("#results").text(`You selected ${student.firstname}, ${student.lastname}`)
            : $("#results").text(`Something went wrong`);
    });

    // Add Button Event Handler
    $("#addButton").on("click", () => {
        const first = $("#txtFirstname").val();
        const last = $("#txtLastname").val();
        if (first.length > 0 && last.length > 0) {
            const lastStudent = studentData[studentData.length - 1];
            studentData.push({
                "id": lastStudent.id + 101, "firstname": first, "lastname": last
            });
            $("#results").text(`added student ${lastStudent.id + 101}`);
            $("#txtFirstname").val("");
            $("#txtLastname").val("");
            sessionStorage.setItem("studentData", JSON.stringify(studentData));
            let html = "";
            studentData.forEach(student => {
                html += `<div class="list-group-item" id="${student.id}" >
${student.id}, ${student.firstname}, ${student.lastname}</div>`;
            });
            $("#studentList").html(html);
        }
    });

    // Clear Button Event Handler
    $("#clearButton").on("click", () => {
        sessionStorage.removeItem("studentData");

        $("#inputFields").hide();
        $("#addButton").hide();
        $("#clearButton").hide();
        $("#studentList").hide();
        $("#loadButton").show();
        $("#results").text('Session Storage Cleared');
    });
});
