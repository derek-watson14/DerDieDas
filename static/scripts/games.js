class PageState {
    constructor(gameType, set, setSize) {
      this.gameType = gameType;
      this.set = set;
      this.setSize = setSize;
      this.correct = 0;
      this.attempts = 0;
      this.answered = false;
      this.shown = [];
      this.current;
      this.setCurrent();
      this.setScore();
    };
    setCurrent() {
      this.current = this.set[Math.floor(Math.random() * this.setSize)];
      if (this.shown.includes(this.current)) {
        this.setPrep();
      } else {
        this.addToShown(this.current);
        document.querySelectorAll('.current')[0].innerHTML = this.current[1];
      }
    };
    setScore() {
      document.querySelectorAll('.score')[0].innerHTML = `${this.correct}/${this.attempts}: ${this.getPercentage()}%`;
    };
    getPercentage() {
      let percentage = "0";
      if (this.attempts > 0) {
        percentage = Math.round((this.correct / this.attempts) * 100);
      };
      return percentage;
    };
    addToShown(item) {
      this.shown.push(item);
    };
    continue() {
      if (this.attempts < this.setSize) return true;
      else return false;
    };
};

class questionRecord {
    constructor() {
      this.record = [];
    };
    addAttempt(guess, solution, word, correctness) {
      let attempt = [guess, solution, word, correctness];
      this.record.push(attempt);
    };
};

// setSize and gameType found in extra JS docs for game types
let game = new PageState(gameType, set, setSize);
let record = new questionRecord();

function checkAnswer(answer, key) {
  if (!game.answered) {
    let correctness = null;
    if (answer == game.current[0]) {
      document.querySelectorAll('.blank')[0].innerHTML = `<em class='correct'>${key[answer]}</em>`;
      document.querySelectorAll('.message')[0].innerHTML = `Correct! You chose <em class='correct'>${key[answer]}</em>.`;
      game.correct += 1;
      correctness = true;
    } else {
      document.querySelectorAll('.blank')[0].innerHTML = `<em class='incorrect'>${key[game.current[0]]}</em>`;
      document.querySelectorAll('.message')[0].innerHTML = `Incorrect. You chose <em class='incorrect'>${key[answer]}</em>.`;
      correctness = false;
      generateTip();
    };
    game.attempts += 1;
    record.addAttempt(answer, game.current[0], game.current[1], correctness);
    game.setScore();
    game.answered = true;
  };
};

function generateTip() {
  if (game.gameType == "gender") {
    let tip = suffixDisplay();
    document.querySelectorAll('.tip')[0].innerHTML = tip;
  } else {
    document.querySelectorAll('.tip')[0].innerHTML = ""
  };
};

function displayResults() {
  localStorage.setItem("resultRecord", JSON.stringify(record.record));
  localStorage.setItem("score", JSON.stringify([game.correct, game.attempts, game.getPercentage()]));
  localStorage.setItem("gameType", JSON.stringify(game.gameType));
  localStorage.setItem("key", JSON.stringify(key));
};

function resetFields() {
  if (game.continue()) {
    game.setCurrent();
    document.querySelectorAll('.blank')[0].innerHTML = blank;
    document.querySelectorAll('.message')[0].innerHTML = "";
    document.querySelectorAll('.tip')[0].innerHTML = "";
    game.answered = false;
  } else {
    displayResults();
  }
};

document.querySelectorAll('.next')[0].onclick = function() {
  resetFields();
};

document.querySelectorAll('.results')[0].onclick = function() {
  displayResults();
};