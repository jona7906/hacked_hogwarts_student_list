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
  fullName = cleanNameParts(fullName);
  student.firstName = fullName.firstName;
  student.middleName = fullName.middleName;
  student.lastName = fullName.lastName;
  student.image = getStudentImg(student);
  student.house = cleanHouse(jsonObject.house);
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

function buildList() {
  displayList(allStudents);
  console.table(allStudents);
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

  console.log(student);

  // append clone to list
  document.querySelector("#grid_students").appendChild(clone);
}
