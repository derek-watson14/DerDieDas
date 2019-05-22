// Game Dataset:
let DER = 0, DIE = 1, DAS = 2;
let key = ["der", "die", "das"];
let genders = ["masculine", "feminine", "neutral"];
let gameType = "gender";
let blank = "____";


// Test word suffixes:
// suffixLists[0] = masc, suffixLists[1] = fem, suffixLists[2] = neutral
let suffixLists = [ [["schluss", "schlag"], ["ismus"], ["ling", "name", "gang", "fall", "korb"], ["tag", "ant", "zug", "ent", "ich", "ist"], ["or", "us", "er", "en", "ig", "er"], []],
                    [["schaft", "nummer"], [""], ["heit", "keit", "bahn"], ["nis", "ion", "tät", "ung", "uhr", "enz", "anz", "art"], ["ei", "ie", "ik", "ur"], ["e"]], 
                    [["zimmer"], [], ["chen", "lein", "ment", "haus", "zeug", "land"], ["erl", "nis", "rad", "weh", "amt"], ["um" ,"ma"], []]];          

function testSuffixes(word, suffixList) {
  var len = suffixList.length;
  for (let i = 0; i < len; i++) {
    let suffix = word.slice(-(len - i));
    for (let item of suffixList[i]) {
      if (item == suffix) return item;
    };
  };
  return null;
};

function suffixDisplay() {
  let suffix = testSuffixes(game.current[1], suffixLists[game.current[0]])
  if (suffix) {
    return `Tip: Words ending in <strong>-${suffix}</strong> are often ${genders[game.current[0]]}.`;
  } else {
    return "";
  }
};

function answerDisplay(answer, correctness) {
  if (correctness) {
    document.querySelectorAll('.blank')[0].innerHTML = `<em class='correct'>${key[answer]}</em>`;
    document.querySelectorAll('.message')[0].innerHTML = `Correct! You chose <em class='correct'>${key[answer]}</em>.`;
  } else {
    document.querySelectorAll('.blank')[0].innerHTML = `<em class='incorrect'>${key[game.current[0]]}</em>`;
    document.querySelectorAll('.message')[0].innerHTML = `Incorrect. You chose <em class='incorrect'>${key[answer]}</em>.`;
  }
};