"use strict";

console.log(sessionList);
let activeIndex = sessionList.active;

function solveListHTML() {
  const tableContents = document.getElementById('table-contents');
  const session = sessionList.list[activeIndex];
  if (session.solveList.length !== 0) {
    tableContents.innerHTML = '';
    for (let i = 0; i < session.solveList.length; i++) {
      const solve = session.solveList[i];
      tableContents.innerHTML += `
        <tr>
        <td class="list-items">${formatTime(solve.time)}</td>
        <td class="list-items">${solve.scramble}</td>
        <td class="list-items">${solve.date.toLocaleDateString("en-AU")}</td>
        <td>
        <button type="button" class=" delete remove btn" id="${i}">
        <i class="x bi bi-x-lg"></i>
        </button>
        </td>
      </tr>`
    }
  } else {
    //display dashes to show the table is empty
    tableContents.innerHTML = '<tr><td>-</td><td>-</td><td>-</td><td> </td></tr>'
  }
  //add delete solve to each delete button
  const deleteButtons = document.querySelectorAll('.delete');
  deleteButtons.forEach(element => {
    element.addEventListener('click', (e) => {
      const id = e.target.id;
      session.remove(id);
      updateLSData(sessionKey, sessionList);
      solveListHTML();
    });
  });
}

function sortList(e) {
  console.log(sessionList);
  console.log(activeIndex);
  const session = sessionList.list[activeIndex];
  console.log(session);
  document.querySelectorAll('.filter').forEach(e => {
    if (e.classList.contains("filter-active")) {
      e.classList.remove("filter-active");
    }
  });
  let filter = e.target.id;
  const filterRef = document.getElementById(filter);
  switch (filter) {
    case 'slowest':
      filterRef.classList.add('filter-active');
      session.solveList.sort((a, b) => b.time - a.time);
      break;
    case 'fastest':
      filterRef.classList.add('filter-active');
      session.solveList.sort((a, b) => a.time - b.time);
      break;
    case 'oldest':
      filterRef.classList.add('filter-active');
      session.solveList.sort((a, b) => a.date - b.date);
      break;
    case 'newest':
      filterRef.classList.add('filter-active');
      session.solveList.sort((a, b) => b.date - a.date);
  }

  solveListHTML();
}

//todo: use bootstrap select element
function initDropdown() {
  const listOfSessions = sessionList.list;
  activeIndex = sessionList.active;
  const dropdown = document.querySelector('#dropdown');
  dropdown.innerHTML = '';
  for (let i = 0; i < listOfSessions.length; i++) {
    const session = listOfSessions[i];
    console.log(session);
    console.log(session.solveType)
    let selected = i === activeIndex;
    console.log(selected, activeIndex);
    const option = new Option(`${session.name} - ${session.solveType}`, i, false, selected);
    dropdown.appendChild(option);
    dropdown.addEventListener('change', (e) => {
      activeIndex = e.target.value;
      sessionList.active = activeIndex;
      console.log(activeIndex);
      solveListHTML();
      updateLSData(sessionKey, sessionList);
    })
  }
}

function addSession() {
  const sessionName = document.querySelector('#floatingInput');
  const solveType = document.querySelector('#solve-type');
  const session = new Session(sessionName.value, solveType.value);
  sessionList.add(session);
  activeIndex = sessionList.list.length - 1;
  sessionList.active = activeIndex;
  initDropdown();
  solveListHTML();
  updateLSData(sessionKey, sessionList);
  sessionName.value = '';
  solveType.selectedIndex = null;
}

function editSession() {
const sessionName = document.querySelector('#edit-input');
const solveTypeInput = document.querySelector('#edit-solve-type');
const activeIndex = sessionList.active;
const activeSession = sessionList.list[activeIndex]
activeSession.solveType = solveTypeInput.value;
activeSession.name = sessionName.value;
initDropdown();
sessionName.value = '';
solveType.selectedIndex = null;
}

// document.querySelector('#add-session').addEventListener('click', ()=> {

// })


const deleteAll = document.querySelector('#clear-session');
deleteAll.addEventListener('click', () => {
  console.log(sessionList);
  if (sessionList.list.length > 1) {
    sessionList.remove(activeIndex);
    updateLSData(sessionKey, sessionList);
    activeIndex = sessionList.active
    const session = sessionList.list[activeIndex];
    console.log(sessionList);
    console.log(session);
    initDropdown();
    solveListHTML();
  } else {
    const len = sessionList.list[activeIndex].solveList.length;
    for (let i = 0; i < len; i++) {
      const session = sessionList.list[activeIndex];
      session.remove(0);
    }
    updateLSData(sessionKey, sessionList);
    solveListHTML();
  }
});
//add filter function to filters
const filters = document.querySelectorAll('.filter')
filters.forEach(element => {
  element.addEventListener('click', sortList);
});

//initialise the list (newest first)
if (sessionList.list.length > 0) {
  console.log(sessionList);
  sessionList.list[activeIndex].solveList.sort((a, b) => b.date - a.date);
  solveListHTML();
  initDropdown();
}

const addSessionButton = document.querySelector('#confirm-new-session');
addSessionButton.addEventListener('click', addSession);
const editSessionButton = document.querySelector('#confirm-edit-session');
editSessionButton.addEventListener('click', editSession);