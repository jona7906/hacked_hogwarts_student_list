"use strict";
window.addEventListener("DOMContentLoaded", start);

let hacked = false;
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
  color: "",
};

function start() {
  /*  document.querySelectorAll("[data-action='filter']").forEach((filterButton) => {
    filterButton.addEventListener("click", setFilter);
  }); */

  document.querySelector("header h1").addEventListener("click", setHack);

  document.querySelectorAll("[data-action='sort']").forEach((sortButton) => {
    sortButton.addEventListener("click", setSorting);
  });

  document.querySelectorAll("[data-action='filter']").forEach((filterButton) => {
    filterButton.addEventListener("click", setFilter);
  });

  console.log("les get this party started - wup wup");
  loadJSON();
}

function setHack() {
  if (hacked === false) {
    hacked = true;
  } else {
    hacked = false;
  }
  hackTheSystem();
  console.log(allStudents);
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
function pushMarcJonas() {
  let jonas = { squad: false, expell: false, prefect: false, captain: false, firstName: "Jonas", middleName: "", lastName: "Rossen", nickName: "Stig", bloodStatus: "fullblood", house: "ravenclaw", gender: "boy", image: "images/jonas_r.png" };
  let marc = { squad: false, expell: false, prefect: false, captain: false, firstName: "Marc", middleName: "", lastName: "Ladefoged", nickName: "Noob", bloodStatus: "fullblood", house: "ravenclaw", gender: "boy", image: "images/marc_l.png" };
  allStudents.push(jonas, marc);
  console.log("thiiis is hacking");
  console.log(allStudents);
}

/* function removeMarcJonas() {
  allStudents = allStudents.filter((student) => student.firstName != "jonas" || student.firstName != "marc");
} */
function hackTheSystem() {
  if (hacked === true) {
    pushMarcJonas();
    console.log("THE SYSTEM IS NOW HACKED");
  }
  if (hacked === false) {
    allStudents.pop();
    allStudents.pop();
  }
  buildList();
}
function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);

  buildList();
}

function buildList() {
  let currentList = filterStudents(allStudents);
  let sortedCurrentList = sortStudents(currentList);
  document.querySelector("#searchfunction").addEventListener("input", search);
  function search() {
    const searchWord = document.querySelector("#searchfunction").value.toLowerCase();
    const filteredSearch = sortedCurrentList.filter((student) => {
      return student.firstName.toLowerCase().includes(searchWord) || student.lastName.toLowerCase().includes(searchWord);
    });
    displayList(filteredSearch);
  }
  document.querySelector(".text_output").textContent = sortedCurrentList.length;
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
  student.image = getStudentImg(fullName);
  student.house = cleanHouse(jsonObject.house);
  student.gender = capitalize(jsonObject.gender);
  student.color = getStudentColor(student);

  return student;
}

function getStudentColor(student) {
  let color;
  if (student.house === "Gryffindor") {
    color = "red";
  }
  if (student.house === "Hufflepuff") {
    color = "yellow";
  }
  if (student.house === "Ravenclaw") {
    color = "blue";
  }
  if (student.house === "Slytherin") {
    color = "green";
  }
  return color;
}

function cleanHouse(house) {
  house = house.trim();
  house = capitalize(house);
  return house;
}

function getStudentImg(fullName) {
  let imgSrc, imagefirst, imagelast;
  console.log("IS THIS HAPPENING???");
  console.log(fullName.firstName, fullName.middleName, fullName.lastName);
  if (fullName.lastName === "Patil") {
    imgSrc = "images/" + fullName.lastName + "_" + fullName.firstName + ".png";
    imgSrc = imgSrc.toLowerCase();
    return imgSrc;
  }
  if (fullName.middleName === "" || fullName.lastName === "") {
    imgSrc = "images/leanne.png";
    return imgSrc;
  }
  if (fullName.lastName.includes("-")) {
    console.log("WOOOOOOOOOOOOOOOOEWOEWOOWEOWE" + fullName.lastName);
    let lastNameHyphpen = fullName.lastName.split("-");
    imagefirst = fullName.firstName.substring(0, 1);
    imagelast = lastNameHyphpen[1];
    imgSrc = imgSrc = "images/" + imagelast + "_" + imagefirst + ".png";
    imgSrc = imgSrc.toLowerCase();
    return imgSrc;
  } else {
    console.log(fullName);
    imagefirst = fullName.firstName.substring(0, 1);
    imagelast = fullName.lastName;
    imgSrc = "images/" + imagelast + "_" + imagefirst + ".png";
    imgSrc = imgSrc.toLowerCase();
    return imgSrc;
  }
}

function cleanNameParts(fullName) {
  let firstName, middleName, lastName;
  if (fullName.split(" ").length === 1) {
    firstName = fullName.substring(0).trim();
    middleName = "";
    lastName = "";
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
    /* middleName = ""; */
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
  if (student.middleName === "undefined") {
    clone.querySelector("[data-field=middleName]").innerHTML = "";
  }
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;

  clone.querySelector("[data-field=image]").src = student.image;
  /*   if (student.lastName.includes("-")) {
    console.log("this is a hyphen!");
    clone.querySelector("[data-field=image]").src = student.;
  } */
  clone.querySelector("[data-field=crest]").src = `images/${student.house}.png`;
  clone.querySelector("article").addEventListener("click", showPopUp);

  function showPopUp() {
    document.querySelector("#pop_up").style.display = "block";
    document.querySelector("#pop_up").style.backgroundColor = student.color;

    console.log(this);
    const clone = document.querySelector("template#popUpInfo").content.cloneNode(true);
    clone.querySelector("[data-field=firstName]").textContent += student.firstName;
    if (student.lastName === undefined) {
      clone.querySelector("[data-field=lastName]").innerHTML = "";
    }
    clone.querySelector("[data-field=middleName]").textContent += student.middleName;
    if (student.middleName === undefined) {
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

      if (student.firstName === "Jonas" || student.firstName === "Marc") {
        student.expell = false;
        alert("YOUR HAVE NO AUTHORITY OF THIS STUDENT");
        buildList();
      } else {
        // setting student property to true????
        student.expell = true;

        //
        console.log("this is expelled student " + allStudents[index]);
        console.log(allStudents[index]);

        //adding student to new list (expelled)
        for (let i = 0; i < allStudents.length; i++) {
          if (allStudents[i] === allStudents[index]) {
            console.log("this is expelled student " + allStudents[index]);
            /* allStudents.pop(index); */
            expellStudentList.push(allStudents[index]);
          }
        }

        //removing student from studentList

        allStudents = allStudents.filter((i) => i.expell != true);

        console.table(allStudents); /*    allStudents = allStudents.slice(0, index - 1) + allStudents.slice(index + 1);
      console.log("sdks"); */
        /* let students = allStudents.splice(index);
        let rest = allStudents.splice(index + 1);
        allStudents = students + rest;
  
        expellStudentList.push(student);
        console.log(expellStudentList); */
        /*  buildList(); */
        console.log("this is the expelled student list");
        console.log(expellStudentList);
      }
      buildList();
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
        /*   if (hacked === true) {
          console.log("this is the student with squad");
          console.log(student);
          setTimeout((student.expell = false), 3000);
          console.log(student);
          setTimeout((event.target.dataset.status = "off"), 3000);
          /* setTimeout((event.target.dataset.status = "off"), 3000); 
        } */
      } else {
        student[buttonId] = false;
        event.target.dataset.status = "off";
        console.log(student[buttonId]);
        console.log({ student });
      }

      // check if house contains more than two prefects
      let prefects = allStudents.filter((i) => i.prefect === true);
      let prefectsAndHouse = prefects.filter((i) => i.house === student.house);
      console.log("this is prefectssssssssssssss with same house");
      if (prefectsAndHouse.length > 2) {
        alert("THIS IS TOO MANY FROM SAME HOUSE");
        student[buttonId] = false;
        event.target.dataset.status = "off";
      } else {
        console.log(prefectsAndHouse);
        buildList();
      }
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

function removePopUp() {
  document.querySelector("#pop_up").style.display = "none";
  document.querySelector("#pop_up").innerHTML = "";

  /*  document.querySelectorAll(".infotext").forEach((text) => (text.textContent = ""));
  document.querySelectorAll("#pop_up img").forEach((img) => (img.src = ""));
  document.querySelectorAll("#pop_up button").forEach((button) => (button.innerHTML = "")); */
}
