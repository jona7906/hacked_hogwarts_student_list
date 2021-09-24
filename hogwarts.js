window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let filter = "*";
let sort;
let sortDir;
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
  document.querySelectorAll("[data-action='filter']").forEach((filterButton) => {
    filterButton.addEventListener("click", setFilter);
  });

  document.querySelectorAll("[data-action='sort']").forEach((sortButton) => {
    sortButton.addEventListener("click", setSorting);
  });

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
  fullName = cleanNameParts(fullName);
  student.firstName = fullName.firstName;
  student.middleName = fullName.middleName;
  student.lastName = fullName.lastName;
  student.image = getStudentImg(student);
  student.house = cleanHouse(jsonObject.house);
  student.gender = capitalize(jsonObject.gender);
  return student;
}

function cleanHouse(house) {
  house = house.trim();
  house = capitalize(house);
  return house;
}

function getStudentImg(student) {
  if (student.lastName.indexOf("-") === -1) {
    let imagefirst = student.firstName.substring(0, 1);
    let imagelast = student.lastName;
    imgSrc = "images/" + imagelast + "_" + imagefirst + ".png";
    imgSrc = imgSrc.toLowerCase();
  } else {
    /*  */
    console.log("WOOOOOOOOOOOOOOOOEWOEWOOWEOWE" + student.lastName);
    let lastNameHyphpen = student.lastName.split("-");
    imagefirst = student.firstName.substring(0, 1);
    imagelast = lastNameHyphpen[1];
    imgSrc = imgSrc = "images/" + imagelast + "_" + imagefirst + ".png";
    imgSrc = imgSrc.toLowerCase();
  }
  if (student.lastName === "Patil") {
    imgSrc = "images/" + student.lastName + "_" + student.firstName + ".png";
    imgSrc = imgSrc.toLowerCase();
  }
  return imgSrc;
}

function cleanNameParts(fullName) {
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
function setSorting(event) {
  sort = event.target.dataset.sort;
  sortDir = event.target.dataset.sortDirection;
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
    console.log("this is asc");
    sortDir = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
    console.log("this is desc");
    sortDir = "asc";
  }
  buildList();
}

function setFilter(event) {
  filter = event.target.dataset.filter;
  buildList();
}

function buildList() {
  let currentList = filterStudents(allStudents);
  let sortedCurrentList = sortStudents(currentList);
  displayList(sortedCurrentList);
  console.log("this is sorted and filtered list");
  console.table(sortedCurrentList);
}

function sortStudents(students) {
  let studentList = students;
  let direction = 1;
  if (sortDir === "asc") {
    direction = -1;
  } else {
    direction = 1;
  }
  let sortedStudents = studentList.sort(compareStudents);

  console.log(sort);
  function compareStudents(a, b) {
    if (a[sort] < b[sort]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedStudents;
}

function filterStudents(students) {
  console.log(allStudents);
  console.log(filter);
  console.log("this is filtering students");
  let filteredStudents = students.filter((student) => student.house.toLowerCase(0) === filter);
  if (filter === "*") {
    filteredStudents = students.filter((student) => student.firstName);
  }

  console.log("this is " + filter);
  console.table(filteredStudents);
  return filteredStudents;
}

function displayList(students) {
  // clear the list
  document.querySelector("#grid_students").innerHTML = "";

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
  clone.querySelector("[data-field=image]").src = student.image;
  clone.querySelector("[data-field=crest]").src = `images/${student.house}.png`;
  clone.querySelector("article").addEventListener("click", showPopUp);

  function showPopUp() {
    console.log(this);
    const clone = document.querySelector("template#popUpInfo").content.cloneNode(true);
    clone.querySelector("[data-field=firstName]").textContent = student.firstName;
    clone.querySelector("[data-field=middleName]").textContent = student.middleName;
    clone.querySelector("[data-field=lastName]").textContent = student.lastName;
    clone.querySelector("[data-field=image]").src = student.image;
    clone.querySelector("[data-field=crest]").src = `images/${student.house}.png`;
    /*  clone.querySelector("article").addEventListener("click", showPopUp); */
    document.querySelector("#pop_up").appendChild(clone);
  }

  console.log(student);

  // append clone to list
  document.querySelector("#grid_students").appendChild(clone);
}
