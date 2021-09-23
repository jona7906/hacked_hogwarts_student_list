window.addEventListener("DOMContentLoaded", start);

let allStudents = [];

// The prototype for all students:
const Student = {
  squad: false,
  status: true,
  prefect: false,
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  bloodStatus: "",
  house: "",
  gender: "",
};

function start() {
  console.log("les get this party started - wup wup");
  loadJSON();
}

async function loadJSON() {
  const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json ");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);

  buildList();
}

function prepareObject(jsonObject) {
  const student = Object.create(Student);
  let fullName = jsonObject.fullname.trim();
  fullName = getNameParts(fullName);
  student.firstName = fullName.firstName;
  student.middleName = fullName.middleName;
  student.lastName = fullName.lastName;
  return student;
}

function getNameParts(fullName) {
  if (fullName.split(" ").length > 1) {
    firstName = fullName.substring(0, fullName.indexOf(" ")).trim();
    middleName = null;
    lastName = null;
    console.log("only one name");
    firstName = capitalize(firstName);
  }
  if (fullName.split(" ").length > 2) {
    console.log("there is a middle name");
    firstName = fullName.substring(0, fullName.indexOf(" ")).trim();
    middleName = fullName.substring(fullName.indexOf(" "), fullName.lastIndexOf(" ")).trim();
    lastName = fullName.slice(fullName.lastIndexOf(" "), fullName.length).trim();
    firstName = capitalize(firstName);
    middleName = capitalize(middleName);
    lastName = capitalize(lastName);
  }
  if (fullName.split(" ").length === 2) {
    console.log("no middle name");

    firstName = fullName.substring(0, fullName.indexOf(" ")).trim();
    lastName = fullName.slice(fullName.indexOf(" "), fullName.length).trim();

    firstName = capitalize(firstName);
    lastName = capitalize(lastName);
  }

  let sortedFullname = { firstName, middleName, lastName };
  return sortedFullname;
}

function capitalize(str) {
  str = str.substring(0, 1).toLocaleUpperCase() + str.substring(1).toLocaleLowerCase();
  return str;
}

function buildList() {
  /* displayList(allStudents); */
  console.table(allStudents);
}

function displayList(students) {
  // clear the list
  document.querySelector("#student_grid").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;

  console.log(student);

  // append clone to list
  document.querySelector("#student_grid").appendChild(clone);
}
