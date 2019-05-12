let AKK = 1, MIX = 2, DAT = 3, GEN = 4;
let set = [[1, ]];

let artTypes = ["definite", "indefinite"];
let cases = ["nominitive", "accusative", "dative", "genitive"];
let genders = ["masculine", "feminine", "neutral", "plural"];

let key = ["der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "eines", "einer"];

document.querySelectorAll('.akk')[0].onclick = function() {
  checkAnswer(AKK);
};

document.querySelectorAll('.mix')[0].onclick = function() {
  checkAnswer(MIX);
};

document.querySelectorAll('.dat')[0].onclick = function() {
  checkAnswer(DAT);
};

document.querySelectorAll('.gen')[0].onclick = function() {
  checkAnswer(GEN);
};

addEventListener("keyup", function(event) {
  if (event.keyCode === 13) resetFields();
  else if (event.keyCode === 49) checkAnswer(AKK);
  else if (event.keyCode === 50) checkAnswer(DAT);
  else if (event.keyCode === 51) checkAnswer(MIX);
  else if (event.keyCode === 52) checkAnswer(GEN);
});