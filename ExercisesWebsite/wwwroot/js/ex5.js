// Exercise #5 - a re-do of exercise #4 plus fetch JSON from GitHub and
// allow the user to add an inputted user
$(() => { // main jQuery routine - executes every on page load, $ is short for jQuery
    // this code is declaring a string variable, notice the use of the tick
    // instead of quotes to allow the use of multiple lines without concatenation.
    // parse the data directly into a variable this time from the templated string
    let studentData = JSON.parse(`[{ "id": 123, "firstname": "Guac", "lastname": "Amole" },
    { "id": 234, "firstname": "Donny", "lastname": "Brook" },
    { "id": 345, "firstname": "Chris", "lastname": "Cross" }]`);

    // Check if studentData is stored in sessionStorage; if not, store the starting array
    sessionStorage.getItem("studentData") === null
        ? sessionStorage.setItem("studentData", JSON.stringify(studentData))
        : null;

    // the event handler for a button with id attribute of loadButton
    $("#loadButton").on("click", async () => {
        if (sessionStorage.getItem("studentData") === null) { // if not loaded get data from GitHub
            // location of data
            const url = "https://raw.githubusercontent.com/elauersen/info3070/master/ex5.json";
            $('#results').text('Locating student data on GitHub, please wait..');
            try {
                let response = await fetch(url);
                if (!response.ok) // check response
                    throw new Error(`Status - ${response.status}, Text - ${response.statusText}`); // fires catch
                studentData = await response.json(); // this returns a promise, so we await it
                sessionStorage.setItem("studentData", JSON.stringify(studentData));
                $('#results').text('Student data on GitHub loaded!');
            } catch (error) {
                $("#results").text(error.message);
            }   
        } else {
            // get the session data to an object format
            studentData = JSON.parse(sessionStorage.getItem("studentData"));
            $('#results').text('Student data from session storage loaded!');
        }
        // we'll manually build a string of html. We use let because
        // the string will be mutated
        let html = "";
        // using the array forEach operator here to iterate through the object array
        // for each object it finds label it as student an then dump
        // out the 3 properties using a templated string inside a hardcoded div node
        // list-group-item is a bootstrap class that allows for a styled entry in a list-group
        // we added a heading and an id attribute to allow student selection
        html += `<h5 class="text-info">Select a Student</h5>`;
        studentData.forEach((student) => {
            html += `<div class="list-group-item" id="${student.id}" >
${student.id},${student.firstname},${student.lastname}
</div>`;
        });
        // insert the dynamically generated html variable contents into an element with an
        // id attribute of studentList (in this case an empty <div>)
        $("#studentList").html(html);
        // Locate the button with an id attribute of loadButton and hide it
        $("#loadButton").hide();
        // Locate the button with an id attribute of addButton and show it
        $("#addButton").show();
        // locate div with an id attribute of inputFields and show it
        $("#inputFields").show();
    }); // loadButton.click()

    // click on a student from the list to access properties and place output in <div id="results"
    $("#studentList").on("click", e => { // here we use the event, to get at its target.id property
        // find the student the user has clicked on
        const student = studentData.find(s => s.id === parseInt(e.target.id));
        // if we get a student dump out a templated string to the bottom of the page
        student
            ? $("#results").text(`You selected ${ student.firstname }, ${ student.lastname }`)
            : $("#results").text(`Something went wrong`);
    }); // studentList div click

    // add button event handler
    $("#addButton").on("click", () => {
        // data from textboxes
        const first = $("#txtFirstname").val();
        const last = $("#txtLastname").val();
        if (first.length > 0 && last.length > 0) { // only add if we have something
            if (studentData.length > 0) {
                const student = studentData[studentData.length - 1];
                studentData.push({
                    "id": student.id + 101, "firstname": first,
                    "lastname": last
                });
                $("#results").text(`added student ${student.id + 101}`);
            } else {
                // if only student
                studentData.push({ "id": 101, "firstname": first, "lastname": last });
            }
            // clear out the textboxes
            $("#txtLastname").val("");
            $("#txtFirstname").val("");
            // convert the object array back to a string and put it in session storage
            sessionStorage.setItem("studentData",
                JSON.stringify(studentData));
            let html = "";
            studentData.forEach(student => {
                html += `<div class="list-group-item" id="${student.id}" >
${student.id},${student.firstname},${student.lastname}
</div>`;
            });
            $("#studentList").html(html);
        }
    }); // addButton click 
}); // jQuery routine - operates as an IIFE (Immediately Invoked Function Expression)