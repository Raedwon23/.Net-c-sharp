// Exercise #2 - a re-do of Exercise #1 using jQuery
$(() => { // main jQuery routine - executes every on page load, $ is short for jQuery
    // this code is declaring a string variable, notice the use of the tick
    // instead of quotes to allow the use of multiple lines without concatenation.
    // Define 3 students in JSON format. Note though it is still remains a string
    // and doesn't become JSON until it is parsed
    const stringData = `[{ "id": 123, "firstname": "Guac", "lastname": "Amole" },
 { "id": 234, "firstname": "Donny", "lastname": "Brook" },
 { "id": 345, "firstname": "Chris", "lastname": "Cross" }]`;
    // the event handler for a button with id attribute of loadButton
    $("#loadButton").on("click", () => {
        // data is currently a string but to process it we need an object array
        // Use const when the data shouldn't mutated
        const studentData = JSON.parse(stringData);
        // we'll manually build a string of html. We use let because
        // the string will be mutated
        let html = "";
        // using the array forEach operator here to iterate through the object array
        // for each object it finds label it as student an then dump
        // out the 3 properties using a templated string inside a hardcoded div node
        // list-group-item is a bootstrap class that allows for a styled entry in a list-group
        studentData.forEach((student) => {
            html += `<div class="list-group-item">
${student.id},${student.firstname},${student.lastname}
</div>`;
        });
        // insert the dynamically generated html variable contents into an element with an
        // id attribute of studentList (in this case an empty <div>)
        $("#studentList").html(html);
        // finally locate the button with an id attribute of loadButton and hide it
        $("#loadButton").hide();
    });  //loadButton.click()
}); // jQuery routine - operates as an IIFE (Immediately Invoked Function Expression)