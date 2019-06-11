function toggleRecord() {
  let table = document.querySelectorAll('.result-table')[0], button = document.querySelectorAll('.all-res')[0];
  if (table.innerHTML == "") {
    table.innerHTML = buildTable();
    button.innerHTML = "Hide Table";
  } else {
    table.innerHTML = "";
    button.innerHTML = "All Results"
  };
};

// Idea: Create premade snippits as template and insert into html
function getMenuHtml() {
  return {
    "title": addTitle(),
    "slider": addSilder()
  }
};

function addTitle() {
  var para = document.createElement("p");
  var node = document.createTextNode("Filter:");
  para.appendChild(node);
  para.style.marginBottom = "10px"
  return para;
};

// https://www.geeksforgeeks.org/creating-range-slider-html-using-javascript/
function addSilder() {
  let container = document.createElement("div");
  container.classList.add("rangeslider");
  let slider = document.createElement("input");
  slider.classList.add("myslider");
  slider.id = "sliderRange";
  slider.setAttribute("type", "range");
  slider.setAttribute("min", "0");
  slider.setAttribute("max", "100");
  slider.setAttribute("value", "100");
  let sliderValue = document.createElement("p");
  sliderValue.innerHTML = "Max Score: <span id='demo'></span>"
  container.appendChild(slider);
  container.appendChild(sliderValue);
  return container;
};

function addCloseButton() {
  let button = document.createElement("div");
  button.classList.add("rangeslider");

};

function activateRangeSlider() {
  var rangeslider = document.getElementById("sliderRange");
  var output = document.getElementById("demo");
  output.innerHTML = rangeslider.value.toString() + "%";

  rangeslider.oninput = function() {
    output.innerHTML = this.value.toString() + "%";
    let table = document.querySelectorAll('.result-table')[0];
    table.innerHTML = buildTable(this.value, true);
  }
};

function deployMenu() {
  let menuHtml = getMenuHtml();
  let filterMenu = document.querySelectorAll(".filter")[0];
  filterMenu.classList.add('filter-menu');
  filterMenu.classList.remove('display-option');
  filterMenu.innerHTML = "";
  filterMenu.appendChild(menuHtml.title);
  filterMenu.appendChild(menuHtml.slider);
  activateRangeSlider();
};

function buildTable(filter = 100, order=false) {
  if (order) {
    // https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
    userRecord.sort((a, b) => (a.correct / a.attempts > b.correct / b.attempts) ? -1 : 1);
  };
  let tableHTML = `<tr class='row-heading'><th>Game Type</th><th>Question</th><th>Answer</th><th>Percentage</th></tr>`;
  for (let item of userRecord) {
    item["percentage"] = Math.round((item["correct"] / item["attempts"]) * 100);
    let row = `<tr ${rowColor(item.percentage)}><td>${item["gametype"]}</td><td>${questionText(item)}</td><td>${item["answer"]}</td><td>${item.percentage}%</td>`;
    if (item.percentage <= filter) tableHTML += row;
  };
  return tableHTML;
};

function rowColor(percentage) {
  if (percentage == 100) return "class='row-perfect'";
  else if (percentage >= 65 && percentage < 100) return "class='row-good'";
  else if (percentage > 0 && percentage < 65) return "class='row-poor'";
  else if (percentage == 0) return "class='row-zero'"
};

function questionText(item) {
  let question = "";
  for (let index = 1; index < 4; index++) {
    if (item[`qinfo_${index}`]) question += `${item[`qinfo_${index}`]} `
  };
  return question.trim()
};