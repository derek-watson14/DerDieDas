let results = JSON.parse(localStorage.getItem("resultRecord"));
let score = JSON.parse(localStorage.getItem("score"));
let gameType = JSON.parse(localStorage.getItem("gameType"));

function buildTable(results, display) {
  let tableHTML = `<tr class='row-heading'><th>Your Answer</th><th>Correct Answer</th>\
                   <th>Word</th>${userRecord ? '<th>History</th>' : ''}</tr>`;
  for (let item of results) {
    tableHTML += createRow(item, display);
  };
  return tableHTML;
};

function createRow(item, display) {
  let history = userRecord ? `<td>${getQuestionPercentage(item[0])}</td>` : "";
  if (display) {
    let rowDeco = item[4] ? "class='row-correct'" : "class='row-incorrect'";
    return `<tr ${rowDeco}><td>${item[1]}</td><td>${item[2]}</td><td>${item[3]}</td>${history}</tr>`;
  } else {
    return !item[4] ? `<tr class='row-incorrect'><td>${item[1]}</td><td>${item[2]}</td><td>${item[3]}</td>${history}</tr>` : "";
  }
};

function getQuestionPercentage(rq_id) {
  record = userRecord.filter(item => item["rq_id"] == rq_id)[0];
  return Math.round((record["correct"] / record["attempts"]) * 100).toString() + "%"; 
};

function setMessage(score) {
  if (score > 90) return "Excellent score!";
  else if (score > 75 && score <= 90) return "Well done!";
  else if (score > 50 && score <= 75) return "Room for improvement.";
  else if (score > 25 && score <= 50) return "Keep working at it.";
  else if (score < 25) return "Wow bitch, you dumb.";
};

function displayResults(display) {
  if (localStorage) {
    let msg = score[1] > 0 ? `You got ${score[0]} of ${score[1]} correct, or ${score[2]}%. ${setMessage(score[2])}` : "No exercises completed.";
    document.querySelectorAll('.result-score')[0].innerHTML = msg;
    document.querySelectorAll('.result-table')[0].innerHTML = buildTable(results, display);
  } else {
    document.querySelectorAll('.result-score')[0].innerHTML = "No results to display.";
  }
};