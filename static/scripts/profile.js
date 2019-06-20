function setupPage() {
    displayTable();
    activateRangeSlider();
    calculateOverall();
};

function activateRangeSlider() {
    var rangeslider = document.getElementById("sliderRange");
    var output = document.getElementById("demo");
    output.innerHTML = rangeslider.value.toString() + "%";

    rangeslider.oninput = function() {
        output.innerHTML = this.value.toString() + "%";
    }
};


function calculateOverall() {
    let ovr_att = document.getElementById("overall-attempts");
    let ovr_per = document.getElementById("overall-percentage");
    let totals = userRecord.reduce((a, b) => ({attempts: a.attempts + b.attempts, correct: a.correct + b.correct}));
    ovr_att.innerHTML = totals.attempts;
    ovr_per.innerHTML = Math.round((totals.correct / totals.attempts) * 100).toString() + "%";
};


function displayTable() {
    let table = document.querySelectorAll('.result-table')[0];
    let limit = document.getElementById('sliderRange');
    let gametype = document.getElementById('gametypes');
    table.innerHTML = buildTable(limit.value, gametype.value);
    setTableSort();
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
            const headtext = head.innerHTML.replace(/(\w+).+/, "$1");
            head.innerHTML = `${headtext}${head == th ? arrow(this.order = !this.order) : "-"}`;
        });
    })));
};


function buildTable(filter=100, gametype="all") {
    let tableHTML = `<tr class='row-heading'>\
                     <th id="th-gametype">GameType-</th>\
                     <th id="th-question">Question-</th>\
                     <th id="th-answer">Answer-</th>\
                     <th id="th-percentage">Percentage-</th>\
                     <th id="th-attempts">Attempts-</th></tr>`;
    for (let item of userRecord) {
        let row = createRow(item, filter)
        if (row) {
            if (gametype == "all") {
                tableHTML += row;
            } else {
                if (item.gametype == gametype) tableHTML += row;
            }
        }
    };
    return tableHTML;
};

function createRow(item, filter) {
    item["percentage"] = Math.round((item["correct"] / item["attempts"]) * 100);
    let row = `<tr ${rowColor(item.percentage)}><td>${item["gametype"]}</td>
                                                <td>${questionText(item)}</td>
                                                <td>${item["answer"]}</td>
                                                <td>${item.percentage}%</td>
                                                <td>${item["attempts"]}</td></tr>`;
    if (item.percentage <= filter) return row;
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