// Make page state into a prototype, and make subclasses for each gametype that add features as needed!
// Create relational database with the data and load necessary info with python application
// Design for mobile with media queries, update overall look
// Create game type description that can pop up as overlay
// 

class PageState {
    constructor(gameType, set, key) {
      this.gameType = gameType;
      this.set = set;
      this.setSize = set.length;
      this.key = key;
      this.keySize = key.length;
      this.correct = 0;
      this.attempts = 0;
      this.answered = false;
      this.gameInfo = false;
      this.shown = [];
      this.current;
      this.hotkeys = [];
      this.setCurrent();
      this.setScore();
      this.setControlButtons();
    };
    setCurrent() {
      this.current = this.set[randElement(this.setSize)];
      if (this.shown.includes(this.current)) {
        this.setCurrent();
      } else {
        this.addToShown(this.current);
        this.detectGameType();
        this.setOptions();
        this.setButtonListeners();
        this.setHotkeys();
      };
    };
    detectGameType() {
      if (this.gameType == "gender" || this.gameType == "preps") {
        document.querySelectorAll('.current')[0].innerHTML = this.current[1];
      } else if (this.gameType == "endings") {
        document.querySelectorAll('.current')[0].innerHTML = this.current[1];
        document.querySelectorAll('.hint')[0].innerHTML = generateHint(this.current);
      } else if (this.gameType == "articles") {
        document.querySelectorAll('.current')[0].innerHTML = generateQuestion(this.current);
      };
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
      if (game.attempts < this.setSize) return true;
      else return false;
    };
    genOptionsRandom() {
      let options = [this.key[this.current[0]]];
      while (options.length < document.querySelectorAll('.choice').length) {
        let falseChoice = this.key[randElement(this.keySize)];
        if (!options.includes(falseChoice)) options.push(falseChoice);
      };
      return options;
    };
    genChoiceDisplayRandom() {
      let options = this.genOptionsRandom();
      document.querySelectorAll('.choice').forEach(function(choice, index) {
        choice.innerHTML = `${index + 1}. ${options.splice(randElement(options.length), 1)}`;
      });
    };
    setOptions() {
      if (this.gameType == "articles") {
        this.genChoiceDisplayRandom();
      } else {
        this.genChoiceDisplay();
      };
    };
    genChoiceDisplay() {
      let counter = 0;
      let key = this.key;
      document.querySelectorAll('.choice').forEach(function(button) {
        button.innerHTML = `${counter + 1}. ${key[counter]}`;
        counter++;
      });
    };
    setButtonListeners() {
      let hotkeys = this.hotkeys;
      document.querySelectorAll('.choice').forEach(function(choice) {
        hotkeys.push(choice.innerHTML.substr(3))
        choice.onclick = function() {
          checkAnswer(key.indexOf(choice.innerHTML.substr(3)))
        };
      });
    };
    setControlButtons() {
      document.querySelectorAll('.next')[0].onclick = function() {
        resetFields();
      };
      document.querySelectorAll('.results')[0].onclick = function() {
        displayResults();
      };
      document.querySelectorAll('.info-btn')[0].onclick = function() {
        if (game.gameInfo == false) {
          document.querySelectorAll('.overlay')[0].style.display = "block";
          game.gameInfo = true;
        };
      };
      document.querySelectorAll('.overlay')[0].onclick = function() {
        if (game.gameInfo == true) {
          document.querySelectorAll('.overlay')[0].style.display = "none";
          game.gameInfo = false;
        }
      };
      addEventListener("keyup", function(event) {
        if (event.keyCode === 13) resetFields();
        if (event.keyCode == 79 && game.gameInfo == false) {
          document.querySelectorAll('.overlay')[0].style.display = "block";
          game.gameInfo = true;
        } else if (event.keyCode == 79 && game.gameInfo == true) {
          document.querySelectorAll('.overlay')[0].style.display = "none";
          game.gameInfo = false;
        };
      });
    };
    setHotkeys() {
      for (let i = 0, h = 49; i < this.hotkeys.length; i++, h++) {
        this.createHotkeyListener(i, h);
      };
    };
    createHotkeyListener(arrayElement, hotkey) {
      addEventListener("keyup", function(event) {
        if (event.keyCode == hotkey) {
          checkAnswer(key.indexOf(game.hotkeys[arrayElement]));
        }; 
      });
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
let game = new PageState(gameType, set, key);
let record = new questionRecord();

function checkAnswer(answer) {
  if (!game.answered) {
    let correctness = testCorrectness(answer);
    generateTip(correctness);
    answerDisplay(answer, correctness);
    game.attempts += 1;
    game.setScore();
    record.addAttempt(answer, game.current[0], game.current[1], correctness);
    game.answered = true;
  };
};

function testCorrectness(answer) {
  if (answer == game.current[0]) {
    game.correct += 1;
    return true;
  } else {
    return false;
  }
};

function generateTip(correctness) {
  if (!correctness) {
    if (game.gameType == "gender") {
      document.querySelectorAll('.tip')[0].innerHTML = suffixDisplay();
    } else if (game.gameType == "endings") {
      document.querySelectorAll('.tip')[0].innerHTML = generateExample(game.current);
    } else if (game.gameType == "preps") {
      document.querySelectorAll('.tip')[0].innerHTML = "";
    };
  } else {
    document.querySelectorAll('.tip')[0].innerHTML = "";
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

function randElement(length) {
  return Math.floor(Math.random() * length);
};