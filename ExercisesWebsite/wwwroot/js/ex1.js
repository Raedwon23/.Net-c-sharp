// Exercise #1 - click a button and display some JSON based data
// this code is declaring a string variable, notice the use of the tick
// instead of quotes to allow the use of multiple lines without concatenation.
// Define 3 students in JSON format. Note stringData remains a string
// and doesn't become JSON until it is parsed as studentData
const stringData = `[{ "id": 123, "firstname": "Guac", "lastname": "Amole" },
{ "id": 234, "firstname": "Donny", "lastname": "Brook" },
{ "id": 345, "firstname": "Chris", "lastname": "Cross" }]`
// an event handler for the for a button element's click event
const loadData = (e) => { // e represents an event, but we're not using it in this example
    // have the DOM locate a <div> element with an id attribute of studentList
    let list = document.getElementById("studentList");
    // data is currently a string but to process it we need a JSON
    // object array. Use const when the data won't be mutated
    const studentData = JSON.parse(stringData);
    // manually build a string of html. Use let because
    // this string will be mutated
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
    list.insertAdjacentHTML("afterbegin", html);
    // finally ask the DOM to locate the button with an id attribute of loadButton and hide it
    document.getElementById("loadButton").style.visibility = "hidden";
}; // loadData
// use the DOM to locate a button with an id attribute of loadButton
// when clicked execute a method called loadData (defined earlier as an arrow function)
document.getElementById("loadButton").addEventListener("click", loadData);