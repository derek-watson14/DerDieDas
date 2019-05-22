let articleTypes = ["definite", "indefinite"];
let genders = ["masculine", "feminine", "neutral", "plural"];
let cases = ["nominitive", "accusative", "dative", "genitive"];

let key = ["der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "eines"];

// Format: [0] = Answer, [1] = Article Type, [2] = Gender, [3] = Case
// Example: [5, 0, 0, 3] == ["dem", "definite", "masculine", "dative"]
let set = [[0, 0, 0, 0], [3, 0, 0, 1], [4, 0, 0, 2], [5, 0, 0, 3],  // Definite Masculine
           [1, 0, 1, 0], [1, 0, 1, 1], [0, 0, 1, 2], [0, 0, 1, 3],  // Definite Feminine
           [2, 0, 2, 0], [2, 0, 2, 1], [4, 0, 2, 2], [5, 0, 2, 3],  // Definite Neutral
           [1, 0, 3, 0], [1, 0, 3, 1], [3, 0, 3, 2], [0, 0, 3, 3],  // Definite Plural
           [6, 1, 0, 0], [8, 1, 0, 1], [9, 1, 0, 2], [11, 1, 0, 3],  // Indefinite Masculine
           [7, 1, 1, 0], [7, 1, 1, 1], [10, 1, 1, 2], [10, 1, 1, 3],  // Indefinite Feminine
           [6, 1, 2, 0], [6, 1, 2, 1], [9, 1, 2, 2], [11, 1, 2, 3]]; // Indefinite Neutral

let gameType = "articles";
let blank = "_____";

function generateQuestion(item) {
  let question = `<span class="cap">${genders[item[2]]}</span> ${articleTypes[item[1]]} article in ${cases[item[3]]}: `;
  return question;
}

function answerDisplay(answer, correctness) {
  if (correctness) {
    document.querySelectorAll('.blank')[0].innerHTML = `<em class='correct'>${key[answer]}</em>`;
    document.querySelectorAll('.message')[0].innerHTML = `Correct! You chose <em class='correct'>${key[answer]}</em>.`;
  } else {
    document.querySelectorAll('.blank')[0].innerHTML = `<em class='incorrect'>${key[game.current[0]]}</em>`;
    document.querySelectorAll('.message')[0].innerHTML = `Incorrect. You chose <em class='incorrect'>${key[answer]}</em>.`;
  };
};