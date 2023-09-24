const addShelterForm = document.getElementById('addShelter');

if(addShelterForm){
  const nameElement = document.getElementById('shelterName');
  const nameLabel = document.getElementById('shelterNameLabel')
  const cityElement = document.getElementById('shelterCity');
  const cityLabel = document.getElementById('cityFormLabel"')
  const stateElement = document.getElementById('shelterState');
  const stateLabel = document.getElementById('shelterFormLabel');
  const timeElement = document.getElementById('timeKept');
  const timeLabel = document.getElementById("timeKeptLabel");
  const errorDiv = document.getElementById("error");

  addShelterForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let name = undefined;
    let city = undefined;
    let state = undefined;
    let time = undefined;

    try{
      name = nameElement.value;
      city = cityElement.value;
      state = stateElement.value;
      time = timeElement.value;
    } catch(e){
      errorDiv.hidden = false;
      let errMsg = document.createElement("p");
      errMsg.className = "error-msg";
      errMsg.innerHTML = `${error}`;
      errorDiv.appendChild(e);
    }
    try{
      checkWord(name, "Name");
      checkCity(name, "name");
    } catch(e){
      errorDiv.innerHTML = "";
      errorFound(e, nameElement, nameLabel, errorDiv);
      return;
    }
    try{
      checkWord(city, "City");
      checkCity(city, "city");
    } catch(e){
      errorDiv.innerHTML = "";
      errorFound(e, cityElement, cityLabel, errorDiv);
      return;
    }
    try{
      checkState(state, "State");
    } catch(e){
      errorDiv.innerHTML = "";
      errorFound(e, stateElement, stateLabel, errorDiv);
      return;
    }
    try{
      checkString(time, "time kept");
    } catch(e){
      errorDiv.innerHTML = "";
      errorFound(e, timeElement, timeLabel, errorDiv);
      return;
    }

    if(name.trim() && city.trim() && state.trim()){
      errorDiv.innerHTML = "";

      addShelterForm.submit();
    } else{
      errorDiv.innerHTML = "";
      if(!name.trim()){
        errorFound("Shelter Name cannot be empty", nameElement, nameLabel, errorDiv);
        return;
      } else if(!city.trim()){
        errorFound("City cannot be empty", cityElement, cityLabel, errorDiv);
        return;
      } else if(!state.trim()){
        errorFound("State cannot be empty", stateElement, stateLabel, errorDiv);
        return;
      }
    }
  });
}
