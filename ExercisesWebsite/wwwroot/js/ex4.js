// Exercise #4 - a re-do of exercise #3 plus introduce session storage and
// allow the user to add a generated user
$(() => { // main jQuery routine - executes every on page load, $ is short for jQuery
    // this code is declaring a string variable, notice the use of the tick
    // instead of quotes to allow the use of multiple lines without concatenation.
    // back to a string again, starting array
    const stringData =
        `[{ "id": 123, "firstname": "Gail", "lastname":
"Storm" },
{ "id": 234, "firstname": "Donny", "lastname":
"Brook" },
{ "id": 345, "firstname": "Chris", "lastname":
"Cross" }]`;
    // do we already have it loaded from a previousrun in the current session ?
    // if not load the start array to session storage now
        sessionStorage.getItem("studentData") === null
        ? sessionStorage.setItem("studentData",stringData)
        : null;
    // get the session data to an object format
    let studentData =
        JSON.parse(sessionStorage.getItem("studentData"));

    // the event handler for a button with id attribute of loadButton
    $("#loadButton").on("click", () => {
        // we'll manually build a string of html. We use let because
        // the string will be mutated
        let html = "";
        // using the array forEach operator here to iterate through the object array
        // for each object it finds label it as student. Then dump
        // out the 3 properties using a templated string inside a hardcoded div node.
        // list-group-item is a bootstrap class that allows for a styled entry in a list-group
        // we added a heading and an id attribute to allow student selection
        html += `<h5 class="text-info">Select a Student</h5>`;
        studentData.forEach((student) => {
            html += `<div class="list-group-item" id="${student.id}">
${student.id},${student.firstname},${student.lastname}
</div>`;
        });
        // insert the dynamically generated html variable contents into an element with an
        // id attribute of studentList (in this case an empty <div>)
        $("#studentList").html(html);
        // finally locate the button with an id attribute of loadButton and hide it
        $("#loadButton").hide();
        $("#addButton").show();
    }); // loadButton.click()

    // add button event handler
    $("#addButton").on("click", () => {
        // find the last student
        const student = studentData[studentData.length - 1];
        // add 101 to the id
        $("#results").text(`added student ${ student.id + 101 }`);
        // add a new student to the object array
        studentData.push({ "id": student.id + 101, "firstname": "New", "lastname": "Student" });
        // convert the object array back to a string and put it in session storage
        sessionStorage.setItem("studentData", JSON.stringify(studentData));
        let html = "";
        studentData.forEach(student => {
            html += `<div class="list-group-item" id="${student.id}">
${student.id},${student.firstname},${student.lastname}
</div>`;
        });
        $("#studentList").html(html);
    }); // addButton click

    // click on a student from the list to access properties and place output in <div id="results"
    $("#studentList").on("click", e => { // here we use the event, to get at its target.id property
        // find the student the user has clicked on
        const student = studentData.find(s => s.id === parseInt(e.target.id));
        // if we get a student dump out a templated string to the bottom of the page
        student
            ? $("#results").text(`You selected ${student.firstname}, ${student.lastname}`)
            : $("#results").text(`"Something went wrong"`);
    }); // studentList div click
}); // jQuery routine - operates as an IIFE (Immediately Invoked Function Expression)