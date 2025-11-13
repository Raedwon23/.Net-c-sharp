$(() => { // main jQuery routine - executes every on page load, $ is short for jquery
    $("#getbutton").on('click', async (e) => { // click event handler
        try {
            $("#actionbutton").hide();
            let lastname = $("#TextBoxFindLastname").val();
            $("#status").text("please wait...");
            $("#theModal").modal("toggle"); // pop the modal
            let response = await fetch(`api/student/${lastname}`);
            if (response.ok) {
                let data = await response.json(); // this returns a promise, so we await it
                if (data.lastname !== "not found") {
                    $("#TextBoxTitle").val(data.title);
                    $("#TextBoxFirst").val(data.firstname);
                    $("#TextBoxSurname").val(data.lastname);
                    $("#TextBoxEmail").val(data.email);
                    $("#TextBoxPhone").val(data.phoneno);
                    $("#status").text("student found");
                    // return these non-mutated values later
                    sessionStorage.setItem("student", JSON.stringify(data));
                    $("#actionbutton").show();
                } else {
                    $("#TextBoxPhone").val("");
                    $("#status").text("no such student");
                } // else
            } else if (response.status !== 404) {
                // probably some other client side error
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else {
                // else 404 not found
                $("#status").text("no such path on server");
            } // else
        } catch (error) {
            // catastrophic
            $("#status").text(error.message);
        } // try/catch
    }); // get button click

    $("#actionbutton").on('click', async (e) => {
        // action button click event handler
        try {
            // set up a new client side instance of Student
            let stu = JSON.parse(sessionStorage.getItem("student"));
            // pouplate the properties
            stu.title = $("#TextBoxTitle").val();          // Get updated title
            stu.firstname = $("#TextBoxFirst").val();  // Get updated first name
            stu.lastname = $("#TextBoxSurname").val();     // Get updated surname
            stu.email = $("#TextBoxEmail").val();          // Get updated email
            stu.phoneno = $("#TextBoxPhone").val(); // Get updated phone number
            // send the updated back to the server asynchronously using Http PUT
            let response = await fetch("api/student", {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(stu),
            });
            if (response.ok) {
                // or check for response.status
                let payload = await response.json();
                $("#status").text(payload.msg);
            } else if (response.status !== 404) {
                // probably some other client side error
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else {
                // else 404 not found
                $("#status").text("no such path on server");
                $("#status").text("no such path on server");
            } // else
        } catch (error) {
            $("#status").text(error.message);
            console.table(error);
        } // try/catch
    }); // action button click
}); // main jQuery method

// server was reached but server had a problem with the call
const errorRtn = (problemJson, status) => {
    if (status > 499) {
        $("#status").text("Problem server side, see debug console");
    } else {
        let keys = Object.keys(problemJson.errors)
        problem = {
            status: status,
            statusText: problemJson.errors[keys[0]][0], // first error
        };
        $("#status").text("Problem client side, see browser console");
        console.log(problem);
    } // else
}