class ResultDisplay {
    constructor(tableController, messageController) {
        this.displayAll = true;
        this.toggle = document.querySelector('.form-btn');
        this.tableController = tableController;
        this.messageController = messageController;
    }
    setInitialDisplay() {
        localStorage.removeItem('savedGame');        
        this.messageController.displayMessage();
        this.tableController.displayTable(this.displayAll);
        this.addButtonListener();
        setTableSort();
    }
    addButtonListener() {
        this.toggle.addEventListener('click', () => {
            this.displayAll = !this.displayAll;
            this.tableController.displayTable(this.displayAll);
            if (this.displayAll) this.toggle.innerHTML = "Incorrect Only";
            else this.toggle.innerHTML = "Show All";
            setTableSort();
        });
    }
}


class TableController {
    constructor(userRecord) {
        this.userRecord = userRecord
        this.results = JSON.parse(localStorage.getItem("resultRecord"));
        this.gameType = JSON.parse(localStorage.getItem("gameType"));
        this.table = document.querySelector('.result-table');
    }
    displayTable(display) {
        localStorage.getItem("resultRecord") ? this.table.innerHTML = this.buildTable(display) : this.table = '';
    }
    buildTable(display) {
        let tableHTML = `<tr class='row-heading'><th>Your Answer-</th>\
                         <th>Correct Answer-</th>\
                         <th>Word-</th>\
                         ${this.userRecord ? '<th>History-</th>' : ''}</tr>`;
        for (let item of this.results) {
          tableHTML += this.createRow(item, display);
        };
        return tableHTML;
    }
    createRow(item, display) {
        let history = userRecord ? `<td>${this.getUserScore(item.qID)}%</td>` : "";
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
                                      ${history}</tr>` : "</tr>";
        }
    }
    getUserScore(rq_id) {
        return userRecord.find(item => item["rq_id"] === rq_id).score; 
    };
};


class MessageController {
    constructor() {
        this.score = JSON.parse(localStorage.getItem("score"));
        this.scoreElement = document.querySelector('.result-score');
    }
    displayMessage() {
        if (localStorage.getItem("resultRecord")) {
            let msg = this.score[1] > 0 ? `You got ${this.score[0]} of ${this.score[1]} correct, 
                                           or ${this.score[2]}%. 
                                           ${this.setMessage()}`
                                        : "No exercises completed.";
            this.scoreElement.innerHTML = msg;
        } else {
            this.scoreElement.innerHTML = "No results to display.";
        }

    }
    setMessage() {
        if ( this.score[2] > 90) return "Excellent score!";
        else if (this.score[2] > 75 && this.score[2] <= 90) return "Well done!";
        else if (this.score[2] > 50 && this.score[2] <= 75) return "Room for improvement.";
        else if (this.score[2] > 25 && this.score[2] <= 50) return "Keep working at it.";
        else if (this.score[2] < 25) return "Wow bitch, you dumb.";
    };
};

