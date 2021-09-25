"use strict";
window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let filter = "*";
let sort;
let sortDir;
let expellStudentList = [];
// The prototype for all students:
const Student = {
  squad: false,
  expell: false,
  prefect: false,
  captain: false,
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  bloodStatus: "",
  house: "",
  gender: "",
};

function start() {
  /*  document.querySelectorAll("[data-action='filter']").forEach((filterButton) => {
    filterButton.addEventListener("click", setFilter);
  }); */

  document.querySelectorAll("[data-action='sort']").forEach((sortButton) => {
    sortButton.addEventListener("click", setSorting);
  });

  document.querySelectorAll("[data-action='filter']").forEach((filterButton) => {
    filterButton.addEventListener("click", setFilter);
  });

  console.log("les get this party started - wup wup");
  loadJSON();
}

function setFilter(event) {
  filter = event.target.dataset.filter;

  buildList();
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

function buildList() {
  let currentList = filterStudents(allStudents);
  let sortedCurrentList = sortStudents(currentList);

  displayList(sortedCurrentList);
  console.log("this is sorted and filtered list");
  /*  console.table(sortedCurrentList); */
}

function displayList(students) {
  // clear the list
  document.querySelector("#grid_students").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function prepareObject(jsonObject) {
  const student = Object.create(Student);
  let fullName = jsonObject.fullname.trim();
  fullName = cleanNameParts(fullName);
  student.firstName = fullName.firstName;
  student.middleName = fullName.middleName;
  student.lastName = fullName.lastName;
  /* student.image = getStudentImg(fullName); */
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
  let imgSrc, imagefirst, imagelast;
  if (student.lastName.indexOf("-") === -1) {
    imagefirst = student.firstName.substring(0, 1);
    imagelast = student.lastName;
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
  let firstName, middleName, lastName;
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
    document.querySelector("#pop_up").style.display = "block";

    console.log(this);
    const clone = document.querySelector("template#popUpInfo").content.cloneNode(true);
    clone.querySelector("[data-field=firstName]").textContent += student.firstName;

    clone.querySelector("[data-field=middleName]").textContent += student.middleName;
    if (student.middleName === null) {
      clone.querySelector("[data-field=middleName]").textContent = "";
    }
    clone.querySelector("[data-field=lastName]").textContent += student.lastName;
    clone.querySelector("[data-field=image]").src = student.image;
    clone.querySelector("[data-field=crest]").src = `images/${student.house}.png`;
    /*     clone.querySelector("[data-field=squad]").addEventListener("click", setSquad);
      clone.querySelector("[data-field=captain]").addEventListener("click", setCaptain); */

    clone.querySelector("[data-action=expell]").addEventListener("click", expellStudent);

    function expellStudent() {
      // getting student index from array
      let index = allStudents.findIndex(function (i, index) {
        console.log(student);
        return i === student;
      });
      console.log("this is student index: " + index);

      // setting student property to true????
      student.expell = true;
      //
      console.log("this is expelled student " + allStudents[index]);
      console.log(allStudents[index]);
      for (let i = 0; i < allStudents.length; i++) {
        if (allStudents[i] === allStudents[index]) {
          console.log("this is expelled student " + allStudents[index]);
          allStudents.pop(i);
          expellStudentList.push(allStudents[index]);
        }
      }
      /* let students = allStudents.splice(index);
        let rest = allStudents.splice(index + 1);
        allStudents = students + rest;
  
        expellStudentList.push(student);
        console.log(expellStudentList); */
      buildList();
      console.log("this is the expelled student list");
      console.log(expellStudentList);
    }

    clone.querySelectorAll("[data-action='button']").forEach((button) => {
      button.addEventListener("click", setData);
    });
    clone.querySelector("#close").addEventListener("click", removePopUp);
    /*  clone.querySelector("article").addEventListener("click", showPopUp); */
    function setData(event) {
      console.log(this);
      let buttonId = event.target.dataset.field;

      console.log(buttonId);

      if (student[buttonId] === false) {
        student[buttonId] = true;
        event.target.dataset.status = "on";
        console.log(buttonId);
      } else {
        student[buttonId] = false;
        event.target.dataset.status = "off";
        console.log(student[buttonId]);
        console.log({ student });
      }

      buildList();
    }

    /*  */

    document.querySelector("#pop_up").appendChild(clone);
  }

  console.log(student);

  // append clone to list
  document.querySelector("#grid_students").appendChild(clone);
}

function filterStudents(students) {
  console.log(allStudents);
  console.log(filter);
  console.log("this is filtering students");
  console.log("this is a studen filter " + filter);
  let filteredStudents;
  if (filter === "gryffindor" || "ravenclaw" || "slytherin" || "hufflepuff") {
    filteredStudents = students.filter((student) => student.house.toLowerCase(0) === filter);
  }
  if (filter === "squad") {
    filteredStudents = students.filter((student) => student.squad === true);
  }
  if (filter === "captain") {
    filteredStudents = students.filter((student) => student.captain === true);
  }
  if (filter === "expelled") {
    filteredStudents = expellStudentList;
    /*  students.filter((student) => student.expell === true); */
  }
  if (filter === "*") {
    filteredStudents = students.filter((student) => student.firstName);
  }

  console.log("this is " + filter);
  console.table(filteredStudents);
  return filteredStudents;
}
