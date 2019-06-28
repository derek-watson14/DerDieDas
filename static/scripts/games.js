// Create game type description that can pop up within overlay

class PageState {
    constructor(gameType, set, setSize, correct=0, attempts=0, shown=[], current=null) {
        this.gameType = gameType;
        this.set = set;
        this.setSize = setSize;
        this.correct = correct;
        this.attempts = attempts;
        this.shown = shown;
        this.answered = false;
        this.gameInfo = false;
        this.currentCorrectness;
        this.current = current;
    };

    // Setting and Resetting the Page: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    setCurrent() {
        this.current = this.getCurrent();
        this.setView();
    };
    resetFields() {
        if (this.answered) sendQuestionResults();
        if (this.shown.length < this.setSize) {
            document.querySelectorAll('.blank')[0].innerHTML = blank;
            document.querySelectorAll('.message')[0].innerHTML = "";
            document.querySelectorAll('.tip')[0].innerHTML = "";
            this.setCurrent();
            this.saveGame();
            this.answered = false;
        } else {
            this.storeResults();
            window.location.href = "/results";
        }
    };
    storeResults() {
        localStorage.setItem("resultRecord", JSON.stringify(record.record));
        localStorage.setItem("score", JSON.stringify([this.correct, this.attempts, calcPercentage(this.correct, this.attempts)]));
        localStorage.setItem("gameType", JSON.stringify(this.gameType));
        localStorage.setItem("key", JSON.stringify(this.key));
    };
    createSaveObject() {
        return {
            gameType: this.gameType,
            set: this.set,
            setSize: this.setSize,
            correct: this.correct,
            attempts: this.attempts,
            shown: this.shown,
            current: this.current, 
            record: record.record
        }
    };
    saveGame() {
        localStorage.setItem("savedGame", JSON.stringify(this.createSaveObject()));
    };


    // Operational and Mechanical Functions >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    getCurrent() {
        let current = this.set[randomElement(this.set.length)];
        if (this.shown.includes(current["q_id"])) {
            return this.getCurrent();
        } else {
            if (this.answered || this.shown.length == 0) this.shown.push(current["q_id"]);
            return current;
        };
    };
    checkAnswer(answer) {
        if (!this.answered) {
            let correctness = this.testCorrectness(answer);
            this.currentCorrectness = (correctness ? 1 : 0);
            this.displayTip(correctness);
            this.displayAsnwer(answer, correctness);
            this.attempts += 1;
            this.displayScore();
            let question = this.questionText(this.current);
            record.addAttempt(this.current["q_id"], answer, this.current["answer"], question, correctness);
            this.answered = true;
        };
    };
    questionText(current) {
        let question = "";
        for (let index = 0; index < 3; index++) {
            if (current[`qinfo_${index}`]) question += `${current[`qinfo_${index}`]} `
        };
        return question.trim()
    };
    testCorrectness(answer) {
        if (answer == this.current["answer"]) {
            this.correct += 1;
            return true;
        } else return false;
    };
    interpretChoice(element) {
        this.checkAnswer(element.innerHTML.substr(3));
    };

    // Display/View: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    setView() {
        this.displayCurrentWord();
        this.displayChoices(this.current);
        this.displayScore();
    }
    displayCurrentWord() {
        if (this.gameType == "gender" || this.gameType == "preps") {
            document.querySelectorAll('.current')[0].innerHTML = this.current["qinfo_1"];
        } else if (this.gameType == "endings") {
            document.querySelectorAll('.current')[0].innerHTML = this.current["qinfo_1"];
            document.querySelectorAll('.hint')[0].innerHTML = `z. B. "<strong>${this.current["example"]}</strong>"`;
        } else if (this.gameType == "articles") {
            document.querySelectorAll('.current')[0].innerHTML = generateQuestion(this.current);
        };
    };
    displayChoices(current) {
        let choices = ["choice_a", "choice_b", "choice_c", "choice_d"];
        document.querySelectorAll('.choice').forEach(function(choice, index) {
            choice.innerHTML = `${index + 1}. ${current[choices[index]]}`;
        });
    };
    displayAsnwer(answer, correctness) {
        if (correctness) {
            document.querySelectorAll('.blank')[0].innerHTML = this.prefix() + `<em class='correct'>${this.current["answer"]}</em>`;
            document.querySelectorAll('.message')[0].innerHTML = `Correct! You chose <em class='correct'>${answer}</em>.`;
        } else {
            document.querySelectorAll('.blank')[0].innerHTML = this.prefix() + `<em class='incorrect'>${this.current["answer"]}</em>`;
            document.querySelectorAll('.message')[0].innerHTML = `Incorrect. You chose <em class='incorrect'>${answer}</em>.`;
        }
    };
    prefix() {
        if (this.gameType == "endings") return ": ";
        else if (this.gameType == "preps") return "ist ";
        else return "";
    };
    displayScore() {
        document.querySelector('.score p').innerHTML = `Score: ${this.correct}/${this.attempts} \
                                                        (${calcPercentage(this.correct, this.attempts)}%)`;
    };
    displayTip(isCorrect) {
        let tip = document.querySelectorAll('.tip')[0];
        if (!isCorrect) {
            if (this.gameType == "gender") tip.innerHTML = suffixDisplay();
            else if (this.gameType == "endings") tip.innerHTML = generateExample(game.current);
        } else {
            tip.innerHTML = "";
        };
    };
    toggleOverlay() {
        let overlay = document.querySelectorAll('.overlay')[0];
        if (game.gameInfo) overlay.style.display = "none";
        else overlay.style.display = "block";
        game.gameInfo = !game.gameInfo;
    };
};

class questionRecord {
        constructor(record=[]) {
            this.record = record;
        };
        addAttempt(qID, guess, solution, word, correctness) {
            let attempt = {qID: qID, 
                           guess: guess, 
                           solution: solution, 
                           word: word, 
                           correctness: correctness
                          };
            this.record.push(attempt);
        };
};

// Extra Functions

function randomElement(setSize) {
    return Math.floor(Math.random() * setSize);
};

function calcPercentage(correct, attempts) {
    if (attempts > 0) return Math.round((correct / attempts) * 100);
    else return 0;
};

function setHotkeys() {
    setChoiceHotkeys();
    setOverlayHotkeys();
    setNextHotkey();
};

function setChoiceHotkeys() { 
    choices = document.querySelectorAll('.choice')
    for (let index = 0, hotkey = 49; index < choices.length; index++, hotkey++) {
        window.addEventListener("keyup", function(event) {
            if (event.keyCode == hotkey) game.checkAnswer(choices[index].innerHTML.substr(3));
        });
    };
};

function setNextHotkey() {
    window.addEventListener("keyup", function(event) {
        if (event.keyCode == 13) game.resetFields();
    });
};

function setOverlayHotkeys() {
    window.addEventListener("keyup", function(event) {
        if (event.keyCode == 79 && !game.gameInfo) {
            document.querySelectorAll('.overlay')[0].style.display = "block";
            game.gameInfo = true;
        } else if (event.keyCode == 79 && game.gameInfo) {
            document.querySelectorAll('.overlay')[0].style.display = "none";
            game.gameInfo = false;
        };
    });
};

function sendQuestionResults() {
    if (user_id && game.answered) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/update_grades");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            if (!JSON.parse(xhr.responseText)) console.log(JSON.parse(xhr.responseText))
        }
        xhr.send(JSON.stringify({q_id: game.current["q_id"], u_id: user_id, correct: game.currentCorrectness}));
    };
};