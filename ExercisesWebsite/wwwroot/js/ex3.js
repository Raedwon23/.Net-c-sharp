// Exercise #3 - a re-do of exercise #2 plus allow click on a student
$(() => { // main jQuery routine - executes every on page load, $ is short for jQuery
    // this code is declaring a string variable, notice the use of the tick
    // instead of quotes to allow the use of multiple lines without concatenation.
    // parse the data directly into a variable this time from the templated string
    const studentData = JSON.parse(`[{ "id": 123, "firstname": "Guac", "lastname": "Amole" },
 { "id": 234, "firstname": "Donny", "lastname": "Brook" },
 { "id": 345, "firstname": "Chris", "lastname": "Cross" }]`);
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
    }); // loadButton.click() 
    // click on a student from the list to access properties and place output in <div id="results"
    $("#studentList").on("click", e => { // here we use the event, to get at its target.id property
        // find the student the user has clicked on
        const student = studentData.find(s => s.id === parseInt(e.target.id));
        // if we get a student dump out a templated string to the bottom of the page
        student
            ? $("#results").text(`you selected ${student.firstname}, ${student.lastname}`)
            : $("#results").text(`something went wrong`);
    }); // studentList div click
}); // jQuery routine - operates as an IIFE (Immediately Invoked Function Expression)