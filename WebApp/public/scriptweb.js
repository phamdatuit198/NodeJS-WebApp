var portID = "9060";

var numThemes = 3;
var backColors = ['white', 'black', 'lightblue'];
var textBackgroundColors = ['white', 'dimgrey', 'orange'];
var textColors = ['black', 'white', 'black'];
var inputBackgrounds = ['#f7f7f7', 'dimgrey', 'white'];
var textBorders = ['none', 'none', 'none'];
var textBorderColors = ['white', 'white', 'white'];
var placholderTextColors = ['#757575', '#bababa', '#757575'];
var linkTextColors = ['blue', 'LightSteelBlue', 'DarkOrchid'];
var divPadding = "10px";

// returns true if browser is chrome, false otherwise
// reference: https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome/13348618#13348618
function isChrome() {
  var isChromium = window.chrome,
    winNav = window.navigator,
    vendorName = winNav.vendor,
    isOpera = winNav.userAgent.indexOf("OPR") > -1,
    isIEedge = winNav.userAgent.indexOf("Edge") > -1,
    isIOSChrome = winNav.userAgent.match("CriOS");

  if (isIOSChrome) {
    return true;
  } else if (
    isChromium !== null &&
    typeof isChromium !== "undefined" &&
    vendorName === "Google Inc." &&
    isOpera === false &&
    isIEedge === false
  ) {
    return true;
  } else {
    return false;
  }
}
var usingChrome = isChrome();

document.addEventListener('DOMContentLoaded', function() {
  contentLoadedHandler(function() {
    return;
  });
});

// when the page is loaded, all data gets requested from the database and tables/UI are created
function contentLoadedHandler(callBack) {

  // every time a new screen is loaded, make sure to put the following at the start
  // that is there because the user may have cleared cookies and they need to go back to login screen if that's the case

  /*

      // first check if no user logged in (cookie data)
      if (getUserID() < 0) {
        createLoginScreen();
        return;
      }
      // if user logged in, continue w/ making this screen
      clearScreen();
      var curTheme = getThemeOption();
      if (curTheme < 0 || curTheme >= numThemes)
        curTheme = 0;
      var background = getBackgroundDOM(curTheme);
      
      // function goes here
      
      changeState(true); // this goes at the end of the function
      
  */

  // if you make a button...
  // once the button does its work, call changeState(true), or a new load screen function
  // every button you make needs to call <BUTTON VAR>.classList.add("canBeDisabled");  that way it'll work w/ the changeState function
  // you should add any input to that class to make sure user can't interact while DB is getting queries
  // also, make sure you put these commands at the start of its click event listener click:

  /*
  
    event.stopPropagation();
    event.preventDefault();
    changeState(false);
    if (getUserID() < 0) { // if user clears cookies, this ensures they're put back to login screen b/c they won't be able to access the db if they dont have session data
      createLoginScreen();
      return;
    }
    
 */

  // if you make a text box, use this template for creating a div

  /*
  var myTextBox = document.createElement("div");
  myTextBox.style.backgroundColor = textBackgroundColors[curTheme];
  myTextBox.style.border = textBorders[curTheme];
  myTextBox.style.borderColor = textBorderColors[curTheme];
  myTextBox.style.padding = divPadding;
  myTextBox.textContent = "some text"
  myTextBox.style.whiteSpace = 'nowrap'; // use if you don't want word wrap
  myTextBox.style.fontSize = "20px";
  myTextBox.style.position = "absolute";
  myTextBox.style.top = "15%"; // pick position w.r.t. background
  myTextBox.style.left = "2%";  // pick position w.r.t. background
  myTextBox.style.textAlign = "left";
  //myTextBox.style.transform = "translate(-50%,-50%)"; // use this if you want your text centered w.r.t background
  */

  createLoginScreen();

}

// if you want any information about the currently logged in user from the database,
// you must make a http request to the server and it will query the DB for info related to the session's user (currently logged in user)
// but, you don't need to call getUserID beforehand to do this, that function is just to check if a user is logged in when the function is called

// returns the id of the user who is currently logged in
// synchronous request!
// returns -2 if server error occurs and returns -1 if no user is currently logged in
// only use this to check if a user is logged in
function getUserID() {

  var getuserIdRequest = new XMLHttpRequest();
  getuserIdRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/getUserID", false);
  getuserIdRequest.setRequestHeader('Content-Type', 'application/json');
  getuserIdRequest.send(JSON.stringify({}));

  if (getuserIdRequest.status >= 200 && getuserIdRequest.status < 400) {
    return JSON.parse(getuserIdRequest.responseText).userID;
  } else {
    console.log("Error in network request: " + getuserIdRequest.statusText);
    return -2;
  }
}

// returns the username of the currently logged in user
// synchronous request!
// returns -2 if server error occurs and returns -1 if no user is currently logged in or db didn't have the currently logged in user's id (this is unlikely)
function getUsername() {
  var getuserIdRequest = new XMLHttpRequest();
  getuserIdRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/getLoggedInUsername", false);
  getuserIdRequest.setRequestHeader('Content-Type', 'application/json');
  getuserIdRequest.send(JSON.stringify({}));

  if (getuserIdRequest.status >= 200 && getuserIdRequest.status < 400) {

    var returnData = JSON.parse(getuserIdRequest.responseText);

    if (returnData.errorCode > 0) {
      return -1;
    } else {
      return returnData.username;
    }
  } else {
    console.log("Error in network request: " + getuserIdRequest.statusText);
    return -2;
  }
}

// get goal data, the return value is an array of strings that correspond to the goals entered, in order, for the currently logged in user
// empty array returned if no goals entered for user
// synchronous request!
// if no user logged in, return -1
// if server error, return -2
function getGoals() {

  var getGoalsRequest = new XMLHttpRequest();
  getGoalsRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/getGoals", false);
  getGoalsRequest.setRequestHeader('Content-Type', 'application/json');
  getGoalsRequest.send(JSON.stringify({}));

  if (getGoalsRequest.status >= 200 && getGoalsRequest.status < 400) {

    var returnData = JSON.parse(getGoalsRequest.responseText);

    if (returnData.errorCode > 0) {
      return -1;
    } else {
      var goalsData = []
      var j;
      for (j = 0; j < returnData.goals.length; j++) {
        goalsData.push(returnData.goals[j].goal_text);
      }
      return goalsData;
    }
  } else {
    console.log("Error in network request: " + getGoalsRequest.statusText);
    return -2;
  }
}

// get health data, the return value is an array of integers that correspond to the health values entered, in order, for the currently logged in user
// empty array returned if no health data entered for user
// synchronous request!
// if no user logged in, return -1
// if server error, return -2
function getHealth() {

  var getHealthRequest = new XMLHttpRequest();
  getHealthRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/getHealth", false);
  getHealthRequest.setRequestHeader('Content-Type', 'application/json');
  getHealthRequest.send(JSON.stringify({}));

  if (getHealthRequest.status >= 200 && getHealthRequest.status < 400) {

    var returnData = JSON.parse(getHealthRequest.responseText);

    if (returnData.errorCode > 0) {
      return -1;
    } else {
      var healthData = []
      var j;
      for (j = 0; j < returnData.health.length; j++) {
        healthData.push(returnData.health[j].health_value);
      }
      return healthData;
    }
  } else {
    console.log("Error in network request: " + getHealthRequest.statusText);
    return -2;
  }
}

// get theme option for currently logged in user, return value is an int, referring to the theme option (range is zero to number of themes - 1, inclusive)
// synchronous request!
// if no user logged in, return -1
// if server error, return -2
function getThemeOption() {

  var getThemeRequest = new XMLHttpRequest();
  getThemeRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/getThemeOption", false);
  getThemeRequest.setRequestHeader('Content-Type', 'application/json');
  getThemeRequest.send(JSON.stringify({}));

  if (getThemeRequest.status >= 200 && getThemeRequest.status < 400) {

    var returnData = JSON.parse(getThemeRequest.responseText);

    if (returnData.errorCode > 0) {
      return -1;
    } else {
      return returnData.themeOption;
    }
  } else {
    console.log("Error in network request: " + getThemeRequest.statusText);
    return -2;
  }
}

function getBackgroundDOM(curThemeIndex) {
  var background = document.getElementById('background');

  if (curThemeIndex < 0 || curThemeIndex >= numThemes) {
    background.style.backgroundColor = backColors[0];
    background.style.color = textColors[0];
  } else {
    background.style.backgroundColor = backColors[curThemeIndex];
    background.style.color = textColors[curThemeIndex];
  }
  background.style.position = "relative";

  return background;
}

function createLoginScreen() {

  // first check if user is already logged in (cookie data)
  if (getUserID() >= 0) {
    createHomeScreen();
    return;
  }

  // if no user logged in, then can go to login screen    
  clearScreen();
  var curTheme = 0; // no one is logged in for login screen so use default theme
  var background = getBackgroundDOM(curTheme);

  // small rectangle around the login buttons/input
  var loginRect = document.createElement("div");
  loginRect.style.backgroundColor = textBackgroundColors[curTheme];
  loginRect.style.position = "absolute";
  loginRect.style.textAlign = "center";
  loginRect.style.top = "50%";
  loginRect.style.left = "50%";
  loginRect.style.transform = "translate(-50%,-50%)";
  loginRect.style.width = "240px";
  loginRect.style.height = "180px";
  loginRect.style.border = "2px solid black";
  background.appendChild(loginRect);

  // text at top of login rect
  var loginInstructions = document.createElement("div");
  loginInstructions.textContent = "Login or Create a New Account";
  loginInstructions.style.fontSize = "16px";
  loginInstructions.style.width = (loginRect.offsetWidth - 4) + "px";
  loginInstructions.style.position = "absolute";
  loginInstructions.style.top = "7%";
  loginInstructions.style.left = "50%";
  loginInstructions.style.transform = "translate(-50%,-50%)";
  loginRect.appendChild(loginInstructions);

  // error text
  var errorText = document.createElement("div");
  errorText.textContent = "";
  errorText.style.color = "#ff0000";
  errorText.style.fontSize = "16px";
  errorText.style.width = (loginRect.offsetWidth - 4) + "px";
  errorText.style.position = "absolute";
  errorText.style.top = "90%";
  errorText.style.left = "50%";
  errorText.style.transform = "translate(-50%,-50%)";
  loginRect.appendChild(errorText);

  // user name input field
  var username_field = document.createElement("input");
  username_field.classList.add("canBeDisabled");
  username_field.type = "text";
  username_field.style.width = "150px";
  username_field.style.position = "absolute";
  username_field.style.backgroundColor = "#eeeeee";
  username_field.style.top = "25%";
  username_field.style.left = "50%";
  username_field.style.transform = "translate(-50%,-50%)";
  username_field.placeholder = "Username (10 char max)";
  if (usingChrome) {
    document.styleSheets[0].cssRules[2].style.cssText = 'color: ' + placholderTextColors[curTheme] + ' !important;';
  }
  username_field.addEventListener("input", function(event) {
    event.stopPropagation();
    event.preventDefault();
    if (username_field.value.length > 10) {
      username_field.value = username_field.value.substr(0, 10);
    }
  });
  loginRect.appendChild(username_field);

  // password input field
  var pw_field = document.createElement("input");
  pw_field.classList.add("canBeDisabled");
  pw_field.type = "password";
  pw_field.style.width = "150px";
  pw_field.style.position = "absolute";
  pw_field.style.backgroundColor = "#eeeeee";
  pw_field.style.top = "40%";
  pw_field.style.left = "50%";
  pw_field.style.transform = "translate(-50%,-50%)";
  pw_field.placeholder = "Password (10 char max)";
  if (usingChrome) {
    document.styleSheets[0].cssRules[2].style.cssText = 'color: ' + placholderTextColors[curTheme] + ' !important;';
  }
  pw_field.addEventListener("input", function(event) {
    event.stopPropagation();
    event.preventDefault();
    if (pw_field.value.length > 10) {
      pw_field.value = pw_field.value.substr(0, 10);
    }
  });
  loginRect.appendChild(pw_field);

  // login button
  var submit_btn = document.createElement("button");
  submit_btn.classList.add("canBeDisabled");
  submit_btn.style.width = "155px";
  submit_btn.style.position = "absolute";
  submit_btn.style.top = "55%";
  submit_btn.style.left = "50%";
  submit_btn.style.transform = "translate(-50%,-50%)";
  submit_btn.textContent = "Login";
  submit_btn.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    if (username_field.value.length <= 0) {
      errorText.textContent = "A username is required.";
      return;
    }
    if (pw_field.value.length <= 0) {
      errorText.textContent = "A password is required.";
      return;
    }

    if (username_field.value.length > 10) {
      errorText.textContent = "Username is too long.";
      return;
    }
    if (pw_field.value.length > 10) {
      errorText.textContent = "Password is too long.";
      return;
    }

    changeState(false);
    errorText.textContent = "";
    var userLoginRequest = new XMLHttpRequest();
    userLoginRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/attemptLogin", true);
    userLoginRequest.setRequestHeader('Content-Type', 'application/json');
    userLoginRequest.addEventListener("load", function() {
      if (userLoginRequest.status >= 200 && userLoginRequest.status < 400) {

        var errorCodeReturn = JSON.parse(userLoginRequest.responseText).errorCode;

        if (errorCodeReturn == 1) { // username/pw incorrect
          errorText.textContent = "Incorrect username and/or password.";
        } else if (errorCodeReturn == 2) { // no username
          errorText.textContent = "A username is required.";
        } else if (errorCodeReturn == 3) { // no pw
          errorText.textContent = "A password is required.";
        } else if (errorCodeReturn == 4) { // user name too long
          errorText.textContent = "Username is too long.";
        } else if (errorCodeReturn == 5) { // pw too long
          errorText.textContent = "Password is too long.";
        } else { // account login successful                     
          createHomeScreen();
          return;
        }

      } else {
        console.log("Error in network request: " + userLoginRequest.statusText);
      }
      changeState(true);
    });
    userLoginRequest.send(JSON.stringify({
      "username": username_field.value,
      "password": pw_field.value
    }));

  });
  loginRect.appendChild(submit_btn);

  // create new account button
  var newAccntBtn = document.createElement("button");
  newAccntBtn.classList.add("canBeDisabled");
  newAccntBtn.style.width = "155px";
  newAccntBtn.style.position = "absolute";
  newAccntBtn.style.top = "70%";
  newAccntBtn.style.left = "50%";
  newAccntBtn.style.transform = "translate(-50%,-50%)";
  newAccntBtn.textContent = "Create New Account";
  newAccntBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();

    if (username_field.value.length <= 0) {
      errorText.textContent = "A username is required.";
      return;
    }
    if (pw_field.value.length <= 0) {
      errorText.textContent = "A password is required.";
      return;
    }

    if (username_field.value.length > 10) {
      errorText.textContent = "Username is too long.";
      return;
    }
    if (pw_field.value.length > 10) {
      errorText.textContent = "Password is too long.";
      return;
    }

    changeState(false);
    errorText.textContent = "";
    var newAccntRequest = new XMLHttpRequest();
    newAccntRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/createNewAccount", true);
    newAccntRequest.setRequestHeader('Content-Type', 'application/json');
    newAccntRequest.addEventListener("load", function() {
      if (newAccntRequest.status >= 200 && newAccntRequest.status < 400) {

        var errorCodeReturn = JSON.parse(newAccntRequest.responseText).errorCode;

        if (errorCodeReturn == 1) { // username exists
          errorText.textContent = username_field.value + " already exists.";
        } else if (errorCodeReturn == 2) { // no username
          errorText.textContent = "A username is required.";
        } else if (errorCodeReturn == 3) { // no pw
          errorText.textContent = "A password is required.";
        } else if (errorCodeReturn == 4) { // user name too long
          errorText.textContent = "Username is too long.";
        } else if (errorCodeReturn == 5) { // pw too long
          errorText.textContent = "Password is too long.";
        } else { // new account created 
          createHomeScreen();
          return;
        }

      } else {
        console.log("Error in network request: " + newAccntRequest.statusText);
      }
      changeState(true);
    });
    newAccntRequest.send(JSON.stringify({
      "username": username_field.value,
      "password": pw_field.value
    }));
  });
  loginRect.appendChild(newAccntBtn);


  changeState(true);
}

function createHomeScreen() {
  // first check if no user logged in (cookie data)
  if (getUserID() < 0) {
    createLoginScreen();
    return;
  }
  // if user logged in, continue w/ making this screen
  clearScreen();
  var curTheme = getThemeOption();
  if (curTheme < 0 || curTheme >= numThemes)
    curTheme = 0;
  var allGoals = getGoals();
  var allHealth = getHealth();
  var curUserName = getUsername();
  var background = getBackgroundDOM(curTheme);

  // welcome message
  var welcomeMessage = document.createElement("div");
  welcomeMessage.style.backgroundColor = textBackgroundColors[curTheme];
  welcomeMessage.style.border = textBorders[curTheme];
  welcomeMessage.style.borderColor = textBorderColors[curTheme];
  welcomeMessage.style.padding = divPadding;
  welcomeMessage.style.textAlign = "left";
  welcomeMessage.textContent = "Welcome, " + curUserName;
  welcomeMessage.style.whiteSpace = 'nowrap';
  welcomeMessage.style.fontSize = "28px";
  welcomeMessage.style.position = "absolute";
  welcomeMessage.style.top = "15%";
  welcomeMessage.style.left = "2%";
  welcomeMessage.style.textAlign = "left";
  //welcomeMessage.style.transform = "translate(-50%,-50%)";
  background.appendChild(welcomeMessage);

  // set current health/stress data text
  var healthDisplay = document.createElement("div");
  healthDisplay.style.backgroundColor = textBackgroundColors[curTheme];
  healthDisplay.style.border = textBorders[curTheme];
  healthDisplay.style.borderColor = textBorderColors[curTheme];
  healthDisplay.style.padding = divPadding;
  if (allHealth.length === 0) {
    healthDisplay.textContent = "You haven't entered health/stress data yet.";
  } else {
    healthDisplay.textContent = "Your current health/stress score is: " + allHealth[allHealth.length - 1];
  }
  healthDisplay.style.fontSize = "20px";
  healthDisplay.style.position = "absolute";
  healthDisplay.style.whiteSpace = 'nowrap';
  healthDisplay.style.top = "25%";
  healthDisplay.style.left = "2%";
  healthDisplay.style.textAlign = "left";
  //healthIntro.style.transform = "translate(-50%,-50%)";
  background.appendChild(healthDisplay);

  // set current goal text
  var goalIntro = document.createElement("div");
  goalIntro.style.backgroundColor = textBackgroundColors[curTheme];
  goalIntro.style.border = textBorders[curTheme];
  goalIntro.style.borderColor = textBorderColors[curTheme];
  goalIntro.style.padding = divPadding;
  goalIntro.style.whiteSpace = 'nowrap';
  if (allGoals.length === 0) {
    goalIntro.textContent = "You haven't entered any goals yet.";
  } else {
    goalIntro.textContent = "Your current goal is:";
  }
  goalIntro.style.fontSize = "20px";
  goalIntro.style.position = "absolute";
  goalIntro.style.top = "32%";
  goalIntro.style.left = "2%";
  goalIntro.style.textAlign = "left";
  //goalIntro.style.transform = "translate(-50%,-50%)";
  background.appendChild(goalIntro);

  // current goal message
  var currentGoal = document.createElement("div");
  currentGoal.style.backgroundColor = backColors[curTheme];
  currentGoal.style.border = textBorders[curTheme];
  if (allGoals.length === 0) {
    currentGoal.style.backgroundColor = backColors[curTheme];
    currentGoal.style.borderColor = backColors[curTheme];
  } else {
    currentGoal.style.backgroundColor = textBackgroundColors[curTheme];
    currentGoal.style.borderColor = textBorderColors[curTheme];
  }
  currentGoal.style.padding = divPadding;
  currentGoal.textContent = allGoals[allGoals.length - 1];
  currentGoal.style.fontSize = "20px";
  //currentGoal.style.height = "150px";
  currentGoal.style.position = "relative";
  currentGoal.style.maxWidth = "556px";
  currentGoal.style.position = "absolute";
  currentGoal.style.top = "49.5%"; // 38
  currentGoal.style.left = "50%";
  currentGoal.style.textAlign = "center";
  currentGoal.style.transform = "translate(-50%,-50%)";
  background.appendChild(currentGoal);

  // logout button (tells server to set cookie data to undefined for userID, then returns user to login screen)
  var logoutButton = document.createElement("button");
  logoutButton.classList.add("canBeDisabled");
  logoutButton.style.width = "100px";
  logoutButton.style.position = "absolute";
  logoutButton.style.top = "15%";
  logoutButton.style.left = "80%";
  logoutButton.style.transform = "translate(-50%,-50%)";
  logoutButton.textContent = "Logout";
  logoutButton.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    changeState(false);
    if (getUserID() < 0) { // if user clears cookies, this ensures they're put back to login screen b/c they won't be able to access the db if they dont have session data
      createLoginScreen();
      return;
    }
    var logoutRequest = new XMLHttpRequest();
    logoutRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/logoutUser", true);
    logoutRequest.setRequestHeader('Content-Type', 'application/json');
    logoutRequest.addEventListener("load", function() {
      if (logoutRequest.status >= 200 && logoutRequest.status < 400) {
        createLoginScreen();
        return;
      } else {
        console.log("Error in network request: " + logoutRequest.statusText);
      }
      changeState(true);
    });
    logoutRequest.send(JSON.stringify({}));
  });
  background.appendChild(logoutButton);

  // goal error text
  var goalErrorText = document.createElement("div");
  goalErrorText.textContent = "";
  goalErrorText.style.color = "#ff0000";
  goalErrorText.style.fontSize = "16px";
  goalErrorText.style.width = "600px";
  goalErrorText.style.position = "absolute";
  goalErrorText.style.top = "88.5%";
  goalErrorText.style.left = "28.35%";
  goalErrorText.style.transform = "translate(-50%,-50%)";
  background.appendChild(goalErrorText);

  // add (custom) goal button
  var goal_field = document.createElement("textarea"); // need to define this now b/c its used in event handler
  var addGoalBtn = document.createElement("button");
  addGoalBtn.disabled = true;
  addGoalBtn.classList.add("canBeDisabled");
  addGoalBtn.style.width = "135px";
  addGoalBtn.style.position = "absolute";
  addGoalBtn.style.top = "85%";
  addGoalBtn.style.left = "43.41%";
  addGoalBtn.style.transform = "translate(-50%,-50%)";
  addGoalBtn.textContent = "Add Custom Goal";
  addGoalBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    changeState(false);
    if (getUserID() < 0) { // if user clears cookies, this ensures they're put back to login screen b/c they won't be able to access the db if they dont have session data
      createLoginScreen();
      return;
    }
    var addGoalRequest = new XMLHttpRequest();
    addGoalRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/addGoal", true);
    addGoalRequest.setRequestHeader('Content-Type', 'application/json');
    addGoalRequest.addEventListener("load", function() {
      if (addGoalRequest.status >= 200 && addGoalRequest.status < 400) {
        responseData = JSON.parse(addGoalRequest.responseText);
        if (responseData.errorCode == 1) {
          goalErrorText.textContent = "Unable to add goal.";
        } else if (responseData.errorCode == 2) {
          goalErrorText.textContent = "Goal must not be empty.";
        } else {
          goalErrorText.textContent = "";
          createHomeScreen();
          return;
        }
        goal_field.value = "";
      } else {
        console.log("Error in network request: " + addGoalRequest.statusText);
      }
      changeState(true);
    });
    addGoalRequest.send(JSON.stringify({
      "goal": goal_field.value
    }));
  });
  background.appendChild(addGoalBtn);

  // goal text field
  goal_field.classList.add("canBeDisabled");
  goal_field.style.backgroundColor = inputBackgrounds[curTheme];
  goal_field.style.color = textColors[curTheme];
  goal_field.style.resize = "none";
  goal_field.style.width = "310px";
  goal_field.style.height = "100px";
  goal_field.style.position = "absolute";
  goal_field.style.top = "69.5%";
  goal_field.style.left = "2%";
  goal_field.style.textAlign = "top";
  //goal_field.style.transform = "translate(-50%,-50%)";
  goal_field.placeholder = "Choose a goal above, or enter custom goal (140 character limit)";
  goal_field.id = 'goal_field_area';
  if (usingChrome) {
    document.styleSheets[0].cssRules[2].style.cssText = 'color: ' + placholderTextColors[curTheme] + ' !important;';
  }
  goal_field.addEventListener("input", function(event) {
    event.stopPropagation();
    event.preventDefault();
    goal_field.value = goal_field.value.replaceAll("\n", "").replaceAll("\r", "");
    if (goal_field.value.length <= 0) {
      addGoalBtn.disabled = true;
    } else {
      addGoalBtn.disabled = false;
    }
    if (goal_field.value.length > 140) {
      goal_field.value = goal_field.value.substr(0, 140);
    }
  });
  background.appendChild(goal_field);

  // build in goal drop-down
  var goalSelect = document.createElement("select");
  goalSelect.style.backgroundColor = inputBackgrounds[curTheme];
  goalSelect.style.color = textColors[curTheme];
  goalSelect.classList.add("canBeDisabled");
  goalSelect.style.position = "absolute";
  goalSelect.style.width = "316px";
  goalSelect.style.top = "62%";
  goalSelect.style.left = "2%";
  goalSelect.style.textAlign = "left";
  var goalSelectOption = document.createElement("option");
  goalSelectOption.textContent = "Consume at most 1 alcoholic drink per week.";
  goalSelect.appendChild(goalSelectOption);
  goalSelectOption = document.createElement("option");
  goalSelectOption.textContent = "Lose 10 pounds this month.";
  goalSelect.appendChild(goalSelectOption);
  goalSelectOption = document.createElement("option");
  goalSelectOption.textContent = "Meet 5 new people this month.";
  goalSelect.appendChild(goalSelectOption);
  goalSelectOption = document.createElement("option");
  goalSelectOption.textContent = "Improve employee performance review rating by 1.";
  goalSelect.appendChild(goalSelectOption);
  goalSelectOption = document.createElement("option");
  goalSelectOption.textContent = "Exercise 30 minutes every day this month.";
  goalSelect.appendChild(goalSelectOption);
  goalSelectOption = document.createElement("option");
  goalSelectOption.textContent = "Quit smoking within 3 months.";
  goalSelect.appendChild(goalSelectOption);
  goalSelectOption = document.createElement("option");
  goalSelectOption.textContent = "Sleep 7 hours or more 5 nights per week.";
  goalSelect.appendChild(goalSelectOption);
  goalSelectOption = document.createElement("option");
  goalSelectOption.textContent = "Reduce blood pressure to at most 120/80.";
  goalSelect.appendChild(goalSelectOption);
  goalSelectOption = document.createElement("option");
  goalSelectOption.textContent = "Take a walk outside 3 days per week.";
  goalSelect.appendChild(goalSelectOption);
  goalSelectOption = document.createElement("option");
  goalSelectOption.textContent = "Contact relatives at least 2 times this month.";
  goalSelect.appendChild(goalSelectOption);
  goalSelectOption = document.createElement("option");
  goalSelectOption.textContent = "Put 6% of earnings into savings per month.";
  goalSelect.appendChild(goalSelectOption);
  background.appendChild(goalSelect);
  goalSelect.selectedIndex = 0;

  // add (preset) goal button
  var addPresetGoalBtn = document.createElement("button");
  addPresetGoalBtn.classList.add("canBeDisabled");
  addPresetGoalBtn.style.width = "135px";
  addPresetGoalBtn.style.position = "absolute";
  addPresetGoalBtn.style.top = "66.5%";
  addPresetGoalBtn.style.left = "43.41%";
  addPresetGoalBtn.style.transform = "translate(-50%,-50%)";
  addPresetGoalBtn.textContent = "Add Preset Goal";
  addPresetGoalBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    changeState(false);
    if (getUserID() < 0) { // if user clears cookies, this ensures they're put back to login screen b/c they won't be able to access the db if they dont have session data
      createLoginScreen();
      return;
    }
    var addGoalRequest = new XMLHttpRequest();
    addGoalRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/addGoal", true);
    addGoalRequest.setRequestHeader('Content-Type', 'application/json');
    addGoalRequest.addEventListener("load", function() {
      if (addGoalRequest.status >= 200 && addGoalRequest.status < 400) {
        responseData = JSON.parse(addGoalRequest.responseText);
        if (responseData.errorCode == 1) {
          goalErrorText.textContent = "Unable to add goal.";
        } else if (responseData.errorCode == 2) {
          goalErrorText.textContent = "Goal must not be empty.";
        } else {
          goalErrorText.textContent = "";
          createHomeScreen();
          return;
        }
        goalSelect.selectedIndex = 0;
      } else {
        console.log("Error in network request: " + addGoalRequest.statusText);
      }
      changeState(true);
    });
    addGoalRequest.send(JSON.stringify({
      "goal": goalSelect.options[goalSelect.selectedIndex].textContent
    }));
  });
  background.appendChild(addPresetGoalBtn);


  // drop down for health/stress (values to enter in DB are 1-10 inclusive)
  var healthSelect = document.createElement("select");
  healthSelect.style.backgroundColor = inputBackgrounds[curTheme];
  healthSelect.style.color = textColors[curTheme];
  healthSelect.classList.add("canBeDisabled");
  healthSelect.style.position = "absolute";
  healthSelect.style.width = "50px";
  healthSelect.style.top = "73.6%";
  healthSelect.style.left = "66%";
  healthSelect.style.transform = "translate(-50%,-50%)";
  var j;
  for (j = 1; j <= 10; j++) {
    var healthSelectOption = document.createElement("option");
    healthSelectOption.value = j;
    healthSelectOption.textContent = "" + j;
    healthSelect.appendChild(healthSelectOption);
  }
  background.appendChild(healthSelect);
  healthSelect.selectedIndex = 9;

  // add health data error text
  var healthErrorText = document.createElement("div");
  healthErrorText.textContent = "";
  healthErrorText.style.color = "#ff0000";
  healthErrorText.style.fontSize = "16px";
  healthErrorText.style.width = "600px";
  healthErrorText.style.position = "absolute";
  healthErrorText.style.top = "77.5%";
  healthErrorText.style.left = "80%";
  healthErrorText.style.transform = "translate(-50%,-50%)";
  background.appendChild(healthErrorText);

  // add heath/stress data button
  var addHealthStressBtn = document.createElement("button");
  addHealthStressBtn.classList.add("canBeDisabled");
  addHealthStressBtn.style.width = "166px";
  addHealthStressBtn.style.position = "absolute";
  addHealthStressBtn.style.top = "73.5%";
  addHealthStressBtn.style.left = "85%";
  addHealthStressBtn.style.transform = "translate(-50%,-50%)";
  addHealthStressBtn.textContent = "Add Health/Stress Score";
  addHealthStressBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    changeState(false);
    if (getUserID() < 0) { // if user clears cookies, this ensures they're put back to login screen b/c they won't be able to access the db if they dont have session data
      createLoginScreen();
      return;
    }
    var addHealthDataRequest = new XMLHttpRequest();
    addHealthDataRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/addHealth", true);
    addHealthDataRequest.setRequestHeader('Content-Type', 'application/json');
    addHealthDataRequest.addEventListener("load", function() {
      if (addHealthDataRequest.status >= 200 && addHealthDataRequest.status < 400) {
        responseData = JSON.parse(addHealthDataRequest.responseText);
        if (responseData.errorCode == 1) {
          healthErrorText.textContent = "Unable to add health/stress data.";
        } else if (responseData.errorCode == 2) {
          healthErrorText.textContent = "Health/Stress out of bounds.";
        } else {
          healthErrorText.textContent = "";
          createHomeScreen();
          return;
        }
      } else {
        console.log("Error in network request: " + addHealthDataRequest.statusText);
      }
      changeState(true);
    });
    addHealthDataRequest.send(JSON.stringify({
      "health": healthSelect.options[healthSelect.selectedIndex].value
    }));
  });
  background.appendChild(addHealthStressBtn);

  // options button
  var optionsButton = document.createElement("button");
  optionsButton.classList.add("canBeDisabled");
  optionsButton.style.width = "100px";
  optionsButton.style.position = "absolute";
  optionsButton.style.top = "20%";
  optionsButton.style.left = "80%";
  optionsButton.style.transform = "translate(-50%,-50%)";
  optionsButton.textContent = "Options";
  optionsButton.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    changeState(false);
    if (getUserID() < 0) { // if user clears cookies, this ensures they're put back to login screen b/c they won't be able to access the db if they dont have session data
      createLoginScreen();
      return;
    }
    createOptionsScreen();
  });
  background.appendChild(optionsButton);

  // additional resources button
  var addtnlResourcesBtn = document.createElement("button");
  addtnlResourcesBtn.classList.add("canBeDisabled");
  addtnlResourcesBtn.style.width = "160px";
  addtnlResourcesBtn.style.position = "absolute";
  addtnlResourcesBtn.style.top = "95%";
  addtnlResourcesBtn.style.left = "85%";
  addtnlResourcesBtn.style.transform = "translate(-50%,-50%)";
  addtnlResourcesBtn.textContent = "Additional Resources";
  addtnlResourcesBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    changeState(false);
    if (getUserID() < 0) { // if user clears cookies, this ensures they're put back to login screen b/c they won't be able to access the db if they dont have session data
      createLoginScreen();
      return;
    }
    createAdditionalResourcesScreen();
  });
  background.appendChild(addtnlResourcesBtn);


  // prev goal history button
  var prevGoalButton = document.createElement("button");
  prevGoalButton.classList.add("canBeDisabled");
  prevGoalButton.style.width = "160px";
  prevGoalButton.style.position = "absolute";
  prevGoalButton.style.top = "95%";
  prevGoalButton.style.left = "15%";
  prevGoalButton.style.transform = "translate(-50%,-50%)";
  prevGoalButton.textContent = "View Goal History";
  prevGoalButton.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    changeState(false);
    if (getUserID() < 0) { // if user clears cookies, this ensures they're put back to login screen b/c they won't be able to access the db if they dont have session data
      createLoginScreen();
      return;
    }
    createGoalHistoryScreen();
  });
  background.appendChild(prevGoalButton);


  // health plot button
  var healthPlotButton = document.createElement("button");
  healthPlotButton.classList.add("canBeDisabled");
  healthPlotButton.style.width = "160px";
  healthPlotButton.style.position = "absolute";
  healthPlotButton.style.top = "95%";
  healthPlotButton.style.left = "50%";
  healthPlotButton.style.transform = "translate(-50%,-50%)";
  healthPlotButton.textContent = "View Health/Stress Plot";
  healthPlotButton.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    changeState(false);
    if (getUserID() < 0) { // if user clears cookies, this ensures they're put back to login screen b/c they won't be able to access the db if they dont have session data
      createLoginScreen();
      return;
    }
    createHealthPlotScreen();
  });
  background.appendChild(healthPlotButton);

  changeState(true);
}

function createOptionsScreen() {

  // first check if no user logged in (cookie data)
  if (getUserID() < 0) {
    createLoginScreen();
    return;
  }
  // if user logged in, continue w/ making this screen
  clearScreen();
  var curTheme = getThemeOption();
  if (curTheme < 0 || curTheme >= numThemes)
    curTheme = 0;
  var background = getBackgroundDOM(curTheme);
  var curUserName = getUsername();
  createMenuButton(background);

  // select a theme text
  var selectThemeMsg = document.createElement("div");
  selectThemeMsg.style.backgroundColor = textBackgroundColors[curTheme];
  selectThemeMsg.style.border = textBorders[curTheme];
  selectThemeMsg.style.borderColor = textBorderColors[curTheme];
  selectThemeMsg.style.padding = "30px";
  selectThemeMsg.style.textAlign = "center";
  selectThemeMsg.style.width = "66.6%";
  selectThemeMsg.textContent = 'Select a color theme, ' + curUserName;
  selectThemeMsg.style.whiteSpace = 'nowrap';
  selectThemeMsg.style.fontSize = "25px";
  selectThemeMsg.style.position = "absolute";
  selectThemeMsg.style.top = "35%";
  selectThemeMsg.style.left = "50%";
  selectThemeMsg.style.transform = "translate(-50%,-50%)";
  background.appendChild(selectThemeMsg);

  // white theme button
  var whiteThemeButton = document.createElement("button");
  whiteThemeButton.classList.add("canBeDisabled");
  whiteThemeButton.style.width = "100px";
  whiteThemeButton.style.position = "absolute";
  whiteThemeButton.style.padding = divPadding;
  whiteThemeButton.style.top = "50%";
  whiteThemeButton.style.left = "50%";
  whiteThemeButton.style.transform = "translate(-50%,-50%)";
  whiteThemeButton.textContent = "White";
  whiteThemeButton.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    changeState(false);
    if (getUserID() < 0) { // if user clears cookies, this ensures they're put back to login screen b/c they won't be able to access the db if they dont have session data
      createLoginScreen();
      return;
    }
    var logoutRequest = new XMLHttpRequest();
    logoutRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/changeThemeOption", true);
    logoutRequest.setRequestHeader('Content-Type', 'application/json');
    logoutRequest.addEventListener("load", function() {
      if (logoutRequest.status >= 200 && logoutRequest.status < 400) {
        createOptionsScreen();
        return;
      } else {
        console.log("Error in network request: " + logoutRequest.statusText);
      }
      changeState(true);
    });
    logoutRequest.send(JSON.stringify({
      "themeOption": 0
    }));
  });
  background.appendChild(whiteThemeButton);

  // dark theme button
  var darkThemeButton = document.createElement("button");
  darkThemeButton.classList.add("canBeDisabled");
  darkThemeButton.style.width = "100px";
  darkThemeButton.style.position = "absolute";
  darkThemeButton.style.padding = divPadding;
  darkThemeButton.style.top = "58%";
  darkThemeButton.style.left = "50%";
  darkThemeButton.style.transform = "translate(-50%,-50%)";
  darkThemeButton.textContent = "Dark";
  darkThemeButton.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    changeState(false);
    if (getUserID() < 0) { // if user clears cookies, this ensures they're put back to login screen b/c they won't be able to access the db if they dont have session data
      createLoginScreen();
      return;
    }
    var logoutRequest = new XMLHttpRequest();
    logoutRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/changeThemeOption", true);
    logoutRequest.setRequestHeader('Content-Type', 'application/json');
    logoutRequest.addEventListener("load", function() {
      if (logoutRequest.status >= 200 && logoutRequest.status < 400) {
        createOptionsScreen();
        return;
      } else {
        console.log("Error in network request: " + logoutRequest.statusText);
      }
      changeState(true);
    });
    logoutRequest.send(JSON.stringify({
      "themeOption": 1
    }));
  });
  background.appendChild(darkThemeButton);

  // colorful theme button
  var colorfulThemeButton = document.createElement("button");
  colorfulThemeButton.classList.add("canBeDisabled");
  colorfulThemeButton.style.width = "100px";
  colorfulThemeButton.style.position = "absolute";
  colorfulThemeButton.style.padding = divPadding;
  colorfulThemeButton.style.top = "66%";
  colorfulThemeButton.style.left = "50%";
  colorfulThemeButton.style.transform = "translate(-50%,-50%)";
  colorfulThemeButton.textContent = "Colorful";
  colorfulThemeButton.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    changeState(false);
    if (getUserID() < 0) { // if user clears cookies, this ensures they're put back to login screen b/c they won't be able to access the db if they dont have session data
      createLoginScreen();
      return;
    }
    var logoutRequest = new XMLHttpRequest();
    logoutRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/changeThemeOption", true);
    logoutRequest.setRequestHeader('Content-Type', 'application/json');
    logoutRequest.addEventListener("load", function() {
      if (logoutRequest.status >= 200 && logoutRequest.status < 400) {
        createOptionsScreen();
        return;
      } else {
        console.log("Error in network request: " + logoutRequest.statusText);
      }
      changeState(true);
    });
    logoutRequest.send(JSON.stringify({
      "themeOption": 2
    }));
  });
  background.appendChild(colorfulThemeButton);

  changeState(true);
}

function createAdditionalResourcesScreen() {

  // first check if no user logged in (cookie data)
  if (getUserID() < 0) {
    createLoginScreen();
    return;
  }
  // if user logged in, continue w/ making this screen
  clearScreen();
  var curTheme = getThemeOption();
  if (curTheme < 0 || curTheme >= numThemes)
    curTheme = 0;
  var background = getBackgroundDOM(curTheme);
  var curUserName = getUsername();
  createMenuButton(background);

  // say hi to user
  var helloUserMsg = document.createElement("div");
  helloUserMsg.style.backgroundColor = textBackgroundColors[curTheme];
  helloUserMsg.style.border = textBorders[curTheme];
  helloUserMsg.style.borderColor = textBorderColors[curTheme];
  helloUserMsg.style.padding = divPadding;
  helloUserMsg.style.textAlign = "left";
  helloUserMsg.textContent = curUserName + ", here are some helpful resources";
  helloUserMsg.style.fontSize = "25px";
  helloUserMsg.style.position = "absolute";
  helloUserMsg.style.top = "20.05%";
  helloUserMsg.style.left = "2%";
  helloUserMsg.style.textAlign = "left";
  //helloUserMsg.style.transform = "translate(-50%,-50%)";
  background.appendChild(helloUserMsg);

  // set up array of link urls and link text
  var linkURLstrings = [
    'https://suicidepreventionlifeline.org/',
    'https://www.psychologytoday.com/us/therapists',
    'https://healthfinder.gov/FindServices/SearchContext.aspx?topic=833',
    'https://smokefree.gov/',
    'https://www.samhsa.gov/find-help/national-helpline',
    'https://bettermoneyhabits.bankofamerica.com/en/saving-budgeting/creating-a-budget',
    'https://www.healthline.com/nutrition/how-to-lose-weight-as-fast-as-possible',
    'https://sleepfoundation.org/sleep-tools-tips/healthy-sleep-tips',
    'https://www.mayoclinic.org/diseases-conditions/high-blood-pressure/in-depth/high-blood-pressure/art-20046974',
    'https://www.livecareer.com/career/advice/jobs/15-excelling-work-tips'
  ];

  var linkTextStrings = [
    'Suicide Hotline',
    'Find a Therapist',
    'Find a Support Group',
    'Tobacco Cessation',
    'Substance Abuse Hotline',
    'How to Create a Budget',
    'Weight Loss',
    'Healthy Sleep Tips',
    'Blood Pressure Reduction',
    'Improve Work Performance'
  ];
  var linksTopPercentageStart = 27.55;
  var linksPercentageStep = 7.25;

  // create links
  var linkDivContainer;
  var linkElement;
  for (i = 0; i < linkURLstrings.length; i++) {
    linkDivContainer = document.createElement("div");
    linkDivContainer.style.backgroundColor = textBackgroundColors[curTheme];
    linkDivContainer.style.border = textBorders[curTheme];
    linkDivContainer.style.borderColor = textBorderColors[curTheme];
    linkDivContainer.style.padding = divPadding;
    linkDivContainer.style.textAlign = "left";
    linkDivContainer.style.fontSize = "22px";
    linkDivContainer.style.position = "absolute";
    linkDivContainer.style.whiteSpace = 'nowrap';
    linkDivContainer.style.top = (linksTopPercentageStart + i * linksPercentageStep) + '%';
    linkDivContainer.style.left = "2%";
    linkDivContainer.style.textAlign = "left";
    background.appendChild(linkDivContainer);
    linkElement = document.createElement("a");
    linkElement.style.color = linkTextColors[curTheme];
    linkElement.rel = 'nofollow';
    linkElement.target = '_blank';
    linkElement.href = linkURLstrings[i];
    linkElement.innerHTML = linkTextStrings[i];
    linkDivContainer.appendChild(linkElement);
  }

  changeState(true);
}

function createGoalHistoryScreen() {

  // first check if no user logged in (cookie data)
  if (getUserID() < 0) {
    createLoginScreen();
    return;
  }
  // if user logged in, continue w/ making this screen
  clearScreen();
  var curTheme = getThemeOption();
  if (curTheme < 0 || curTheme >= numThemes)
    curTheme = 0;
  changeState(true);
  var background = getBackgroundDOM(curTheme);
  var curUserName = getUsername();
  createMenuButton(background);
  /*
  general table format
  var goalTable = document.createElement("table");
  goalTable.style.border = "thick solid #000000";
  var newRow = document.createElement("tr");
  newRow.style.border = "thin solid #000000";
  var newTd = document.createElement("td");
  newTd.style.border = "thin solid #000000";
  newTd.textContent = [result];
  newRow.appendChild(newTd);
  goalTable.appendChild(newRow);
  background.appendChild(goalTable);
  */

  //post request
  var getGoalsRequest = new XMLHttpRequest();
  getGoalsRequest.open("POST", "http://flip3.engr.oregonstate.edu:" + portID + "/getGoals", false);
  getGoalsRequest.setRequestHeader('Content-Type', 'application/json');
  getGoalsRequest.send(JSON.stringify({}));

  if (getGoalsRequest.status >= 200 && getGoalsRequest.status < 400) {
    var returnData = JSON.parse(getGoalsRequest.responseText);
    var currentColor = document.getElementById("background");
    var element = window.getComputedStyle(currentColor, null).getPropertyValue("background-color");
    //console.log(element);

    var thickBorderColor = "2px solid #000000";
    var thinBorderColor = "thin solid #000000";
    if (element == "rgb(0, 0, 0)") {
      thickBorderColor = "thick solid #FFFFFF"
      thinBorderColor = "thin solid #FFFFFF"
      //console.log(element)
    }

    if (returnData.goals.length == 0) {
      edgeCase = document.createElement("div");
      edgeCase.style.fontSize = "18px";
      edgeCase.style.textAlign = "left";
      edgeCase.style.position = "absolute";
      edgeCase.style.top = "20.5%";
      edgeCase.style.left = "1%";
      edgeCase.style.padding = "10px";
      edgeCase.style.maxHeight = "20px";
      if (element == "rgb(173, 216, 230)") {
        edgeCase.style.background = "#FFA500";
      } else if (element == "rgb(0, 0, 0)") {
        edgeCase.style.background = "#808080";
      }
      edgeCase.textContent = "No current/past goals. Please go back to the home screen and enter a goal.";
      background.appendChild(edgeCase);
      return -1;
    }

    if (returnData.goals.length == 1) {
      edgeCase2 = document.createElement("div");
      edgeCase2.style.fontSize = "18px";
      edgeCase2.style.textAlign = "left";
      edgeCase2.style.position = "absolute";
      edgeCase2.style.top = "20.5%";
      edgeCase2.style.left = "1%";
      edgeCase2.style.padding = "10px";
      edgeCase2.style.maxHeight = "20px";
      if (element == "rgb(173, 216, 230)") {
        edgeCase2.style.background = "#FFA500";
      } else if (element == "rgb(0, 0, 0)") {
        edgeCase2.style.background = "#808080";
      }
      edgeCase2.textContent = "No past goals. Please go back to the home screen and enter more goals.";
      background.appendChild(edgeCase2);
      return -1;
    }

    var checkMax = returnData.goals.length - 2;
    if (checkMax < 0) {
      checkMax = 0;
    }
    //console.log(checkMax)
    var pastGoals = returnData.goals.length - 2;
    var changedPast = false;
    if (pastGoals >= 6) {
      pastGoals = 5;
      changedPast = true;
      var edgeRow = document.createElement("tr");
      edgeRow.style.border = thinBorderColor;
      var edgeTd = document.createElement("td");
      edgeTd.style.border = thinBorderColor;
      edgeTd.style.fontSize = "medium";
      edgeTd.textContent = "Past 6 goals."
    }
    var bottomMax = returnData.goals.length - 7;
    if (bottomMax < 1) {
      bottomMax = 0;
    //} else if (bottomMax > 7) {
    //  bottomMax = 7;
    }
    //console.log(bottomMax)
    var currentGoal = returnData.goals.length - 1;

    congratsContainer = document.createElement("div");
    congratsContainer.style.fontSize = "22px";
    congratsContainer.style.textAlign = "left";
    congratsContainer.style.position = "absolute";
    congratsContainer.style.top = "21%";
    congratsContainer.style.left = "5%";
    congratsContainer.style.bottom = "1%";
    congratsContainer.style.padding = "10px";
    congratsContainer.style.maxHeight = "28px";
    if (element == "rgb(173, 216, 230)") {
      congratsContainer.style.background = "#FFA500";
    } else if (element == "rgb(0, 0, 0)") {
      congratsContainer.style.background = "#808080";
    }
    congratsContainer.textContent = "Congrats, " + curUserName + ", you completed " + (returnData.goals.length - 1) + " goal";
    if (currentGoal == 1)
        congratsContainer.textContent += "!";
    else {
        congratsContainer.textContent += "s!"
    }
    background.appendChild(congratsContainer);


    //table being created here
    var goalTable = document.createElement("table");
    goalTable.style.border = thickBorderColor;
    goalTable.style.width = "90%";
    goalTable.style.position = "absolute";
    goalTable.style.top = "26%";
    goalTable.style.left = "1%";
    goalTable.style.margin = "25px";
    if (element == "rgb(173, 216, 230)") {
      goalTable.style.background = "#FFA500";
    } else if (element == "rgb(0, 0, 0)") {
      goalTable.style.background = "#808080";
    }
    if (returnData.errorCode > 0) {
      return -1;
    } else {
      var j;
      //console.log(returnData.goals.length)
      //for loop to iterate through the goals
      var newRow = document.createElement("tr");
      newRow.textContent = "Current Goal";
      newRow.style.fontSize = "small";
      newRow.style.textAlign = "left";
      goalTable.appendChild(newRow);

      var newRow = document.createElement("tr");
      newRow.style.border = thinBorderColor;
      var newTd = document.createElement("td");
      newTd.style.border = thinBorderColor;
      //here is the table data being grabbed
      newTd.textContent = returnData.goals[currentGoal].goal_text;
      newTd.style.fontSize = "medium";
      //append a new td element before adding to the row which adds to the table
      newRow.appendChild(newTd);
      goalTable.appendChild(newRow);
      
      var newRow = document.createElement("tr");
      newRow.style.fontSize = "small";
      newRow.style.textAlign = "left";
      goalTable.appendChild(newRow);

      var newRow = document.createElement("tr");
      //add 1 because 0 indexed
      newRow.textContent = "Past " + (pastGoals + 1) + " Goal";
      if (pastGoals > 0) {
        newRow.textContent += "s";
      }
      newRow.style.fontSize = "small";
      newRow.style.textAlign = "left";
      goalTable.appendChild(newRow);
      
      for (j = checkMax; j >= bottomMax; j--) {
        var newRow = document.createElement("tr");
        newRow.style.border = thinBorderColor;
        var newTd = document.createElement("td");
        newTd.style.border = thinBorderColor;
        newTd.style.fontSize = "medium";
        //here is the table data being grabbed
        newTd.textContent = returnData.goals[j].goal_text;
        //append a new td element before adding to the row which adds to the table
        newRow.appendChild(newTd);
        goalTable.appendChild(newRow);
      }
      //if (changedPast === true) {
      //  edgeRow.appendChild(edgeTd);
      //  goalTable.appendChild(edgeRow);
      //}

      background.appendChild(goalTable);
    }
  } else {
    console.log("Error in network request: " + getGoalsRequest.statusText);
    return -2;
  }
}

function createMenuButton(background) {
  var menuBtn = document.createElement("button");
  menuBtn.classList.add("canBeDisabled");
  menuBtn.style.width = "100px";
  menuBtn.style.position = "absolute";
  menuBtn.style.top = "17.5%";
  menuBtn.style.left = "80%";
  menuBtn.style.transform = "translate(-50%,-50%)";
  menuBtn.textContent = "Home";
  menuBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    changeState(false);
    if (getUserID() < 0) { // if user clears cookies, this ensures they're put back to login screen b/c they won't be able to access the db if they dont have session data
      createLoginScreen();
      return;
    }
    createHomeScreen();
  });
  background.appendChild(menuBtn);
}

// clears the webpage to just having the background div
function clearScreen() {
  removeAllChildren(document.getElementById('background'));
}

// removes all children from the given DOM node, but doesn't remove the supplied node
function removeAllChildren(node) {
  if (node.children.length === 0)
    return;
  while (node.children.length > 0) {
    removeAllChildren(node.children[0]);
    node.removeChild(node.children[0]);
  }
}

// changes all elements w/ class "canBeDisabled" to disabled when state is false
// and to enabled when state is true
function changeState(state) {

  var elems = document.getElementsByClassName("canBeDisabled");
  for (var j = 0; j < elems.length; j++) {
    if (state) {
      elems[j].disabled = false;
      elems[j].style.cursor = "default";
    } else {
      elems[j].disabled = true;
      elems[j].style.cursor = "wait";
    }
  }

  if (state) {
    document.body.style.cursor = null;
    document.styleSheets[0].cssRules[0].style.cursor = null;
  } else {
    document.body.style.cursor = "wait";
    document.styleSheets[0].cssRules[0].style.cursor = "wait";
  } // reference: https://www.w3.org/wiki/Dynamic_style_-_manipulating_CSS_with_JavaScript

}

// replace all of str1 with st2, set ignore = true to be case sensitive, source: https://stackoverflow.com/questions/2116558/fastest-method-to-replace-all-instances-of-a-character-in-a-string
String.prototype.replaceAll = function(str1, str2, ignore) {
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
}

//api boiler plater code
google.charts.load('current', {packages: ['corechart']});



function drawChart() {
      //theme colors for chart
      var curTheme = getThemeOption();
      var numThemes = 3;
      var backColors = ['white','black','lightblue'];
      var textBackgroundColors = ['white','dimgrey','orange'];
      var textColors = ['black','white','black'];
      var inputBackgrounds = ['#f7f7f7','dimgrey','white'];
      var textBorders = ['none','none','none'];
      var textBorderColors = ['white','white','white'];
      var placholderTextColors = ['#757575','#bababa','#757575'];
      var linkTextColors = ['blue','LightSteelBlue','DarkOrchid'];	

      // sets color of line to white if background is grey	
      var seriesColor = 'white';
      if (curTheme != 1) { 
        seriesColor = invertColor(colourNameToHex(textBackgroundColors[curTheme])); 
      }

      var healthData = getHealth();
      
      //google charts api requires data in [ [x1, y1], [x2, y2] ] format
      var entryData = [];
      for (i = 0; i < healthData.length; i++) {
         entryData[i] = [i.toString(), healthData[i]];
      }

      //google charts api requires axis titles at beginning of array
      chartData = entryData;
      chartData.unshift(['Entry', 'Health/Stress Score History']);
      
      //formatting for chart
      var data = new google.visualization.arrayToDataTable(chartData);	 
      var options = {
        title: 'Health/Stress Score History',
        pointSize: 7,
        gridlines: {
          color: backColors[curTheme]
        },
        series: {
          0: {
           color: seriesColor
          }
        },
        titleTextStyle: {
           color: textColors[curTheme]
        },
        curveType: 'none',
        legend: { 
          position: 'bottom',
          color: textColors[curTheme],
          textStyle: {
            color: textColors[curTheme]
            }
        },
        vAxis: {
          ticks: [0, 2, 4, 6, 8, 10],
          textStyle: {
            color: textColors[curTheme]
            },
          title: 'Health/Stress Score'
        },
        hAxis: {
          textStyle: {
            color: textColors[curTheme]
          },
          title: 'Chronological Score Entry'
        }, 
        backgroundColor: textBackgroundColors[curTheme],
        height: 400 
      }; 
	
      // Instantiate and draw the chart.
      var chart = new google.visualization.LineChart(document.getElementById('healthChart'));
      chart.draw(data, options); 

    }

function createHealthPlotScreen() {

  // first check if no user logged in (cookie data)
  if (getUserID() < 0) {
    createLoginScreen();
    return;
  }
  // if user logged in, continue w/ making this screen
  clearScreen();
  var curTheme = getThemeOption();
  if (curTheme < 0 || curTheme >= numThemes)
    curTheme = 0;
  changeState(true);
  var background = getBackgroundDOM(curTheme);
  createMenuButton(background);
	
	
  // if no health data has been entered
  var healthHist = getHealth();
    if (healthHist.length === 0) {

      var curUserName = getUsername();
      var helloUserMsg = document.createElement("div");
      helloUserMsg.style.backgroundColor = textBackgroundColors[curTheme];
      helloUserMsg.style.border = textBorders[curTheme];
      helloUserMsg.style.borderColor = textBorderColors[curTheme];
      helloUserMsg.style.padding = "10px 10px 10px 10px";
      helloUserMsg.style.margin = "10px";
      helloUserMsg.style.textAlign = "left";
      helloUserMsg.textContent = curUserName + ", you have not entered any health data yet.";
      helloUserMsg.style.fontSize = "22px";
      helloUserMsg.style.position = "absolute";
      helloUserMsg.style.top = "20.05%";
      helloUserMsg.style.left = "2%";
      helloUserMsg.style.textAlign = "left";
      background.appendChild(helloUserMsg);
      changeState(true);
      return;
  } 

  // outputs greeting at top of screen with most recent health rating
  var curUserName = getUsername();
  var recentHealth = healthHist[healthHist.length - 1]
  var helloUserMsg = document.createElement("div");
  helloUserMsg.style.backgroundColor = textBackgroundColors[curTheme];
  helloUserMsg.style.border = textBorders[curTheme];
  helloUserMsg.style.borderColor = textBorderColors[curTheme];
  helloUserMsg.style.padding = "10px 10px 10px 10px";
  helloUserMsg.style.margin = "10px";
  helloUserMsg.style.textAlign = "left";
  helloUserMsg.textContent = curUserName + ", your most recent health score is " + recentHealth + ".";
  helloUserMsg.style.fontSize = "22px";
  helloUserMsg.style.position = "absolute";
  helloUserMsg.style.top = "20.05%";
  helloUserMsg.style.left = "2%";
  helloUserMsg.style.textAlign = "left";
  background.appendChild(helloUserMsg);

  //both items below are to get proper spacing from text to chart
  var spacerDiv = document.createElement("div");
  spacerDiv.style.padding = divPadding;
  spacerDiv.style.position = "relative";
  background.appendChild(spacerDiv);
  var spacerBr = document.createElement("br");
  background.appendChild(spacerBr);
 
  //add chart to DOM
  var healthChart = document.createElement("div");
  healthChart.style.padding = "80px 0px 80px 0px"; 
  healthChart.setAttribute("id", "healthChart");
  background.appendChild(healthChart);
  google.charts.setOnLoadCallback(drawChart);
  drawChart();

  changeState(true);
}

// https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
// inverts color for better visibility
function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

// helper function for invertColor function
function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

//https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
//converts HTML color strings to hex for invertColor function
//dark grey had to be added as only grey is spelled gray in code below
function colourNameToHex(colour)
{
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32", "dimgrey":"#626262"};

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return colour;
}