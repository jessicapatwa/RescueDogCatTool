const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
  "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const numbers = ["0", "1", "2,", "3", "4", "5", "6", "7", "8", "9"];

let checkString = (str, varName) => {
    if (!str) {
      throw "Error: you must provide a " + varName;
    }
    if (typeof str !== "string") {
      throw "Error: " + varName + " must be of type string x";
    }
    str = str.trim();
    if (str.length === 0) {
      throw "Error: " + varName + " cannot be an empty string or just spaces";
    }
  
    return str;
};

let checkWord = (str, varName) => {
  if(!str) {
    throw "Error: " + varName + " must be provided";
  }
  str = checkString(str, varName);
  if(str.length < 3){
    throw "Error: " + varName + " must be at least 4 characters long";
  }
  let contains_letters = false;
  for(let i = 0; i < str.length; i++){
    if(alphabet.includes(str[i])){
      contains_letters = true;
    }
  }
  if(!contains_letters){
    throw "Error: " + varName + " must contain letters";
  }

  return str;
}

let checkId = (id, varName) => {
    if (!id) {
      throw "Error: you must provide an " + varName;
    }
    if (typeof id !== "string") {
      throw "Error: " + varName + " must be of type string";
    }
    id = id.trim();
    if (id.length === 0) {
      throw "Error: " + varName + " cannot be an empty string or just spaces";
    }
    return id;
};

let checkName = (name) => {
    checkString(name, "name");
    name = name.trim();
    if (name.length < 3) throw "Error: name cannot be less than 3 characters";
    for (let char of name) {
      if (!alphabet.includes(char.toLowerCase())) {
        throw "Error: name must contain only letters"
      }
    }
    return name;
};

let checkState = (state) => {
  state = checkString(state, "state");

  state = state.toLowerCase();

  if (state === "alabama" || state === "al") {
    state = "AL";
  } else if (state === "alaska" || state === "ak") {
    state = "AK";
  } else if (state === "arkansas" || state == "ar") {
    state = "AR";
  } else if (state === "california" || state == "ca") {
    state = "CA";
  } else if (state === "colorado" || state == "co") {
    state = "CO";
  } else if (state === "connecticut" || state == "ct") {
    state = "CT";
  } else if (state === "deleware" || state == "de") {
    state = "DE";
  } else if (state === "district of columbia" || state == "dc") {
    state = "DC";
  } else if (state === "florida" || state == "fl") {
    state = "FL";
  } else if (state === "georgia" || state == "ga") {
    state = "GA";
  } else if (state === "hawaii" || state == "hi") {
    state = "HI";
  } else if (state === "idaho" || state == "id") {
    state = "ID";
  } else if (state === "illinois" || state == "il") {
    state = "IL";
  } else if (state === "iowa" || state == "ia") {
    state = "IA";
  } else if (state === "kansas" || state == "ks") {
    state = "KS";
  } else if (state === "kentucky" || state == "ky") {
    state = "KY";
  } else if (state === "louisiana" || state == "la") {
    state = "LA";
  } else if (state === "maine" || state == "me") {
    state = "ME";
  } else if (state === "maryland" || state == "md") {
    state = "MD";
  } else if (state === "massachusetts" || state == "ma") {
    state = "MA";
  } else if (state === "michigan" || state == "mi") {
    state = "MI";
  } else if (state === "minnesota" || state == "mn") {
    state = "MN";
  } else if (state === "mississippi" || state == "ms") {
    state = "MS";
  } else if (state === "missouri" || state == "mo") {
    state = "MO";
  } else if (state === "montana" || state == "mt") {
    state = "MT";
  } else if (state === "nebraska" || state == "ne") {
    state = "NE";
  } else if (state === "nevada" || state == "nv") {
    state = "NV";
  } else if (state === "new hampshire" || state == "nh") {
    state = "NH";
  } else if (state === "new jersey" || state == "nj") {
    state = "NJ";
  } else if (state === "new mexico" || state == "nm") {
    state = "NM";
  } else if (state === "new york" || state == "ny") {
    state = "NY";
  } else if (state === "north carolina" || state == "nc") {
    state = "NC";
  } else if (state === "north dakota" || state == "nd") {
    state = "ND";
  } else if (state === "ohio" || state == "oh") {
    state = "OH";
  } else if (state === "oklahoma" || state == "ok") {
    state = "OK";
  } else if (state === "oregon" || state == "or") {
    state = "OR";
  } else if (state === "pennsylvania" || state == "pa") {
    state = "PA";
  } else if (state === "rhode island" || state == "ri") {
    state = "RI";
  } else if (state === "sout carolina" || state == "sc") {
    state = "SC";
  } else if (state === "south dakota" || state == "sd") {
    state = "SD";
  } else if (state === "tennessee" || state == "tn") {
    state = "TN";
  } else if (state === "texas" || state == "tx") {
    state = "TX";
  } else if (state === "utah" || state == "ut") {
    state = "UT";
  } else if (state === "vermont" || state == "vt") {
    state = "VT";
  } else if (state === "virginia" || state == "va") {
    state = "VA";
  } else if (state === "washington" || state == "wa") {
    state = "WA";
  } else if (state === "west virginia" || state == "wv") {
    state = "WV";
  } else if (state === "wisconsin" || state == "wi") {
    state = "WI";
  } else if (state === "wyoming" || state == "wy") {
    state = "WY";
  } else {
    throw "Error: invalid state input";
  }

  return state;
};

let checkPersonName = (personName) => {
    personName = checkString(personName, "Commenter Name");

    let numSpaces = 0;
    for(let i = 0; i < personName.length; i++){
      if(personName[i] === ' '){
        numSpaces = numSpaces + 1;
      }
    }
 
    if(numSpaces !== 1){
      throw "Error: incorrect format for name";
    }

    let name = personName.split(' ');
    let firstName = name[0];
    let lastName = name[1];

    firstName = checkName(firstName);
    lastName = checkName(lastName);

    let fullName = firstName + " " + lastName

    return fullName;
};

let checkAnimalType = (animalType) => {
    animalType = checkString(animalType, "animalType");
    animalType = animalType.toLowerCase();

    if (animalType === "dog") {
      return "dog";
    } else if (animalType === "cat") {
      return "cat";
    } else {
      throw "Error: animalType must be dog or cat";
    }
};

let errorFound = (error, varInput, varLabel, errorDiv) => {
  varInput.value = "";
  errorDiv.hidden = false;
  let errMsg = document.createElement("p");
  errMsg.className = "error-msg";
  errMsg.innerHTML = `${error}`;
  errorDiv.appendChild(errMsg);
  if(varInput==='usernameInput' || varInput==='passwordInput'){
    usernameInput.focus();
  }else{
    varInput.focus();
  }
  varInput.className = "inputClass";
  return;
};

let checkRating = (rating) => {
  if(!rating){
    throw "Error: rating must be provided";
  }
  rating = checkString(rating, "rating");
  rating = Number(rating);
  if(isNaN(rating)){
    throw "Error: rating is not a number";
  }
  if(typeof rating !== "number"){
    throw "Error: rating must be of type number";
  }
  if(rating < 1 || rating > 5){
    throw "Error: rating must be a number 1 to 5";
  }
  if(rating % 1 !== 0){
    throw "Error: rating must be an integer";
  }

  return rating;
};

let checkUsername = (username) => {
  if (!(/^[a-zA-Z0-9]{4,}$/.test(username))) {
      throw "Username or password not valid";
  }
};

let checkPassword = (password) => {
  if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{6,}$/.test(password))) {
      throw "Username or password not valid";
  }
};

let checkBirthday = (birthdate)  => {
  checkString(birthdate, "birthdate for rescue pet");
  birthdate = birthdate.trim();
  let dateArray = birthdate.split("/");
  if (dateArray.length != 3) throw `Error: birthdate argument is invalid`;

  const validMonths = ["01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12"];
  const validDays = ["31", "28", "31", "30", "31", "30",
    "31", "31", "30", "31", "30", "31"];

  let index = validMonths.indexOf(dateArray[0]);
  if (index < 0) throw `Error: birthdate argument is invalid`;
  let dayDifference = validDays[index] - dateArray[1];
  if (dayDifference < 0 || dayDifference > validDays[0])
    throw `Error: birthdate argument is invalid`;
  let birthday = new Date(birthdate);
  let currentDay = new Date();
  if (birthday > currentDay || birthday.getFullYear() < currentDay.getFullYear() - 30)
    throw `Error: birthdate argument is invalid`;
    
  return birthdate;
};

let checkBreed = (breed) => {
  checkString(breed, "breed type for rescue dog");
  breed = breed.trim();

  if (breed.length < 3)
    throw "Error: breed type for rescue dog cannot be less than 3 letters";

  for (letter of breed) {
    if (numbers.includes(letter))
      throw "Error: breed type for rescue dog cannot contain numbers";
  }

  return breed;
};

let checkHeight = (height) => {
  checkString(height, "height for recue pet");
  height = height.trim();

  let heightFormat = height.split("t");
  if (heightFormat.length !== 2) throw "Error: height format is invalid";

  let feet = Number(heightFormat[0].substring(0, heightFormat[0].length - 1));
  if (typeof feet !== "number" || Number.isNaN(feet))
    throw "Error: feet value is not a number";
  if (feet < 0 || feet > 3) throw "Error: feet value is out of range";
  if (`${feet}f` !== heightFormat[0]) throw "Error: height format is invalid";

  let inches = Number(
    heightFormat[1].substring(0, heightFormat[1].length - 2)
  );
  if (typeof inches !== "number" || Number.isNaN(inches))
    throw "Error: inches value is not a number";
  if (inches < 0 || inches > 12) throw "Error: inches value is out of range";
  if (`${inches}in` !== heightFormat[1].toLowerCase())
    throw "Error: height format is invalid3";

  return `${feet}ft${inches}in`;
};

let checkSexInput = (input) => {
  checkString(input, "sex of rescue pet");
  input = input.trim();
  if (input.length < 4) throw "Error: sex input is not valid";

  input = input.toLowerCase();
  if (input !== "male" && input !== "female")
    throw "Error: sex input is not valid";

  return input;
};

let checkSpecialNeeds = (needs) => {
  if (!needs) {
    return needs;
  }
  needs = checkString(needs, "special needs");
  for (let char of needs) {
    if (!alphabet.includes(char.toLowerCase()) && char !== "," && char !== " ") {
      throw "Error: invalid list input";
    }
  }
  return needs;
};

let checkWeight = (weight) => {
  if(!weight){
    throw "Error: must provide a weight";
  }
  checkString(weight, "weight for rescue pet");
  weight = weight.trim();
  if (weight.length < 3)
    throw "Error: weight argument is not valid";

  let weightValue;
  let weightTxt;

  if (weight[-1] === "b") {
    weightValue = Number(weight.substring(0, weight.length - 2));
    weightTxt = "lb";
  } else {
    weightValue = Number(weight.substring(0, weight.length - 3));
    weightTxt = "lbs";
  }

  if (typeof weightValue !== "number" || Number.isNaN(weightValue))
    throw "Error: weight value is not a number";

  if (weightValue <= 0 || weightValue > 300)
    throw "Error: weight is out of range"

  if (`${weightValue}${weightTxt}` !== weight.toLowerCase())
    throw "Error: weight argument is invalid";

  return `${weightValue}${weightTxt}`;
};

let checkTimeKept = (timeKept, killShelter) => {
  if(!timeKept){
    throw "Error: timeKept must be provided";
  }
  if(!killShelter){
    return "n/a";
  }
  timeKept = this.checkString(timeKept, "timeKept");
  timeKept = Number(timeKept);
  if(isNaN(timeKept)){
    throw "Error: time kept is not a number";
  }
  if(typeof timeKept !== "number"){
    throw "Error: time must be of type number";
  }
  if(timeKept % 1 !== 0){
    throw "Error: time kept must be an integer";
  }

  return timeKept;
};

let checkComment = (comment, varName) => {
  checkString(comment, varName);
  comment = comment.trim();
  if (comment.length < 3) throw "Error: " + varName + " cannot be less than 3 characters";
  for (let char of comment) {
    if (!alphabet.includes(char.toLowerCase()) && !numbers.includes(char.toLowerCase()) 
    && char !== '.' && char !== ' ' && char !== '!' && char !== '?' && char !== ',') {
      throw "Error: " + varName + " must contain only letters, numbers, or punctuation"
    }
  }
  return comment;
};

let checkCity = (city, varName) => {
  checkString(city, "city");
  city = city.trim();
  if (city.length < 3) throw "Error: " + varName + " cannot be less than 3 characters";
  for (let char of city) {
    if (!alphabet.includes(char.toLowerCase()) && char !== ' ') {
      throw "Error: " + varName + " must contain only letters"
    }
  }
  return city;
};