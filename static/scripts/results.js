let results = JSON.parse(localStorage.getItem("resultRecord"));
let score = JSON.parse(localStorage.getItem("score"));
let gameType = JSON.parse(localStorage.getItem("gameType"));
localStorage.removeItem('savedGame')

function displayResults(display) {
    if (localStorage.getItem("resultRecord")) {
      let msg = score[1] > 0 ? `You got ${score[0]} of ${score[1]} correct, or ${score[2]}%. ${setMessage(score[2])}` : "No exercises completed.";
      document.querySelectorAll('.result-score')[0].innerHTML = msg;
      document.querySelectorAll('.result-table')[0].innerHTML = buildTable(results, display);
      setTableSort();
    } else {
      document.querySelectorAll('.result-score')[0].innerHTML = "No results to display.";
    }
};

function buildTable(results, display) {
  let tableHTML = `<tr class='row-heading'><th>Your Answer-</th>
                                           <th>Correct Answer-</th>\
                                           <th>Word-</th>
                                           ${userRecord ? '<th>History-</th>' : ''}</tr>`;
  for (let item of results) {
    tableHTML += createRow(item, display);
  };
  return tableHTML;
};

function createRow(item, display) {
  let history = userRecord ? `<td>${getQuestionPercentage(item.qID)}</td>` : "";
  if (display) {
    let rowDeco = item.correctness ? "class='row-correct'" : "class='row-incorrect'";
    return `<tr ${rowDeco}><td>${item.guess}</td>
                           <td>${item.solution}</td>
                           <td>${item.word}</td>
                           ${history}</tr>`;
  } else {
    return !item.correctness ? `<tr class='row-incorrect'><td>${item.guess}</td>
                                                          <td>${item.solution}</td>
                                                          <td>${item.word}</td>
                                                          ${history}</tr>` : "";
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

function setTableSort() {
    const getCellValue = (tr, index) => {
        return tr.children[index].innerText || tr.children[index].textContent;
    };

    const comparer = (idx, asc) => (rowa, rowb) => ((txta, txtb) => {
            if (txta.slice(-1) == "%" && txtb.slice(-1) == "%") txta = txta.slice(0, -1), txtb = txtb.slice(0, -1);
            return txta !== '' && txtb !== '' && !isNaN(txta) && !isNaN(txtb) ? txta - txtb : txta.toString().localeCompare(txtb);
        })(getCellValue(asc ? rowa : rowb, idx), getCellValue(asc ? rowb : rowa, idx)); 

    const arrow = (order) => order ? "&#x1f809;" : "&#x1f80b;";
        
    document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
        const table = th.closest('table');
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => table.appendChild(tr) );
        Array.from(th.parentNode.children).forEach(head => {
            const headtext = head.innerHTML.replace(/([\w ]+).+/, "$1");
            head.innerHTML = `${headtext}${head == th ? arrow(this.order = !this.order) : "-"}`;
        });
    })));
};
