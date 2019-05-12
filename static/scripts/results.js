let results = JSON.parse(localStorage.getItem("resultRecord"));
let score = JSON.parse(localStorage.getItem("score"));
let gameType = JSON.parse(localStorage.getItem("gameType"));
let key = JSON.parse(localStorage.getItem("key"));

function buildTable(results, display, key) {
  let tableHTML = `<tr class='row-heading'><th>Your Answer</th><th>Correct Answer</th><th>Word</th></tr>`;
  for (let item of results) {
    let row;
    let rowDeco;
    if (display == true) {
      if (item[3] == true) rowDeco = "class='row-correct'";
      else rowDeco = "class='row-incorrect'";
      row = `<tr ${rowDeco}><td>${key[item[0]]}</td><td>${key[item[1]]}</td><td>${item[2]}</td>`;
      tableHTML += row;
    } else {
      rowDeco = "class='row-incorrect'";
      if (item[3] == false) {
        row = `<tr ${rowDeco}><td>${key[item[0]]}</td><td>${key[item[1]]}</td><td>${item[2]}</td>`;
        tableHTML += row;
      }
    }
  };
  return tableHTML;
};

function setMessagge(score) {
  let personalized = "";
  if (score > 90) personalized = "Excellent score!";
  else if (score > 75 && score <= 90) personalized = "Well done!";
  else if (score > 50 && score <= 75) personalized = "Room for improvement.";
  else if (score > 25 && score <= 50) personalized = "Keep working at it.";
  else if (score < 25) personalized = "Wow bitch, you dumb.";
  return personalized;
};

function displayResults(display) {
  if (localStorage) {
    let htmlResultsTable = buildTable(results, display, key);
    if (score[1] > 0) {
      scoreMessage = `You got ${score[0]} of ${score[1]} correct, or ${score[2]}%. ${setMessagge(score[2])}`;
    } else {
      scoreMessage = "No exercises completed."
    }
    document.querySelectorAll('.result-score')[0].innerHTML = scoreMessage;
    document.querySelectorAll('.result-table')[0].innerHTML = htmlResultsTable;
  } else {
    document.querySelectorAll('.result-score')[0].innerHTML = "No results to display.";
  }
};

displayResults(true);

document.querySelectorAll('.all-res')[0].onclick = function() {
  displayResults(true);
};

document.querySelectorAll('.inc-res')[0].onclick = function() {
  displayResults(false);
};