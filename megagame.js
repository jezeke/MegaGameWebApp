var autoSizeText;

autoSizeText = function() {
  var el, elements, _i, _len, _results;
  elements = $('.resize');
  if (elements.length < 0) {
    return;
  }
  _results = [];
  for (_i = 0, _len = elements.length; _i < _len; _i++) {
    el = elements[_i];
    _results.push((function(el) {
      var resizeText, _results1;
      resizeText = function() {
        var elNewFontSize;
        elNewFontSize = (parseInt($(el).css('font-size').slice(0, -2)) - 1) + 'px';
        return $(el).css('font-size', elNewFontSize);
      };
      _results1 = [];
      while (el.scrollHeight > el.offsetHeight) {
        _results1.push(resizeText());
      }
       return _results1;
    })(el));
  }
  return _results;
};

//above code is from https://stackoverflow.com/a/24377168


//note ship stat lookup tables stored separetly in statsLookup.js
//constants; indices for each ui state
var INVALID = -99;
var STEPMIN = 0;
var ATK = 0;
var ATKALIEN = 1;
var ATKHUMAN = 2;
var ATKAUTOGUN = 3
var ATKCOLOR = 4;
var DEF = 5;
var DEFALIEN = 6;
var DEFHUMAN = 7;
var DEFCOLOR = 8;
var OUTPUT = 9;
var STEPMAX = 9;

//constants: indices for each ui elements functions
var TITLE = 0; //title template
var OPTIONS = 1; //middle buttons template
var NAVBTNS = 2; //bottom buttons template
var PROC = 3; //calculation / processing function. not a template

//uses above two constants (ui state, ui elements) . .
//stores templates for each ui element for each states
var stepTemplates = [
  [ //ATK
    function() { return title("Select Attacker's Faction"); }, //TITLE
    function() { return setOptionButtons(['Human', 'Alien'], "atk"); }, //OPTIONS
    function() { return nextBtnOnly(a("atk", "alien", "ATKALIEN", "ATKHUMAN")); }, //NAVBTNS
    function() { return selectOptionMatch(atk) } //PROC
  ], //note for future code explorers: yeah i know == '' ? INVALID is messed up. a() is my apology. i forgot to implement catches for no input before i designed this elegant modular UI so this hack is what you're stuck with sorry
  [ //ATKALIEN
    function() { return title("Select Attacker's Ship Type"); }, //TITLE
    function() { return setOptionButtons(['Cruiser', 'Battleship', 'Destroyer', 'Submarine', 'Transport', 'Carrier'], "atkType"); }, //OPTIONS
    function() { return backNext(ATK, b("atkType", "ATKCOLOR")); }, //NAVBTNS
    function() { return selectOptionMatch(atkType) } //PROC
  ],
  [ //ATKHUMAN
    function() { return title("Select Attacker's Attack Type"); }, //TITLE
    function() { return setOptionButtons(['Fighter', 'Bomber', 'Nuke'], "atkType"); }, //OPTIONS
    function() { return backNext(ATK, b("atkType", "ATKAUTOGUN")); }, //NAVBTNS
    function() { return selectOptionMatch(atkType) } //PROC
  ],
  [ //ATKAUTOGUN
    function() { return title("Does the Attacker have the <b>'Automatic Weapons'</b> research?"); }, //TITLE
    function() { return setOptionButtons(['Yes', 'No'], "atkAutogun"); }, //OPTIONS
    function() { return backNext(ATKHUMAN, b("atkAutogun", "ATKCOLOR")); }, //NAVBTNS
    function() { return selectOptionMatch(atkAutogun) } //PROC
  ],
  [ //ATKCOLOR
    function() { return title("Select Attacker's Upgrade Level"); }, //TITLE
    function() { return setOptionButtons(['Orange', 'Green', 'White', 'Black', 'Purple', 'Brown'], "atkColor"); }, //OPTIONS
    function() { return backNext(a("atk", "alien", "ATKALIEN", "ATKAUTOGUN"), b("atkColor", "DEF")); }, //NAVBTNS
    function() { return selectOptionMatch(atkColor) } //PROC
  ],
  [ //DEF
    function() { return title("Select Defender's Faction"); }, //TITLE
    function() { return setOptionButtons(['Human', 'Alien'], "def"); }, //OPTIONS
    function() { return backNext(ATKCOLOR, a("def", "alien", "DEFALIEN", "DEFHUMAN")); }, //NAVBTNS
    function() { return selectOptionMatch(def) } //PROC
  ],
  [ //DEFALIEN
    function() { return title("Select Defender's Ship Type"); }, //TITLE
    function() { return setOptionButtons(['Cruiser', 'Battleship', 'Destroyer', 'Submarine', 'Transport', 'Carrier'], "defType"); }, //OPTIONS
    function() { return backNext(DEF, b("defType", "DEFCOLOR")); }, //NAVBTNS
    function() { return selectOptionMatch(defType) } //PROC
  ],
  [ //DEFHUMAN
    function() { return title("Select Defender's Attack Type"); }, //TITLE
    function() { return setOptionButtons(['Fighter', 'Bomber'], "defType"); }, //OPTIONS
    function() { return backNext(DEF, b("defType", "DEFCOLOR")); }, //NAVBTNS
    function() { return selectOptionMatch(defType) } //PROC
  ],
  [ //DEFCOLOR
    function() { return title("Select Defender's Upgrade Level"); }, //TITLE
    function() { return setOptionButtons(['Orange', 'Green', 'White', 'Black', 'Purple', 'Brown'], "defColor"); }, //OPTIONS
    function() { return backNext(a("def", "alien", "DEFALIEN", "DEFHUMAN"), b("defColor", "OUTPUT")); }, //NAVBTNS
    function() { return selectOptionMatch(defColor) } //PROC
  ],
  [ //OUTPUT
    nop, //TITLE
    outputBody, //OPTIONS
    function() { return backRestart(DEFCOLOR); }, //NAVBTNS
    nop //PROC
  ]
];

var titleDiv = document.getElementById('title');
var optionsDiv = document.getElementById('options');
var navBtnsDiv = document.getElementById('navBtns');

//global state variables
var atk = ''; // 'alien' or 'human'
var def = ''; // 'alien' or 'human'
var atkType = ''; // 'cruiser' 'battleship' 'destroyer' 'submarine' 'transport' 'carrier' 'fighter' 'bomber' or 'nuke'
var defType = ''; // 'cruiser' 'battleship' 'destroyer' 'submarine' 'transport' 'carrier' 'fighter' or 'bomber'
var atkColor = ''; // 'orange' 'green'  'white' 'black' 'purple' or 'brown'
var defColor = ''; // 'orange' 'green' 'white' 'black' 'purple' or 'brown'
var atkAutogun = ''; // 'yes' or 'no'

var step = ATK; //initial state
var items = 0; //used in updateUI() and set by
updateUI();

//general functions
function modifyStep(newStep)
{ //called by onclick
  if(newStep == INVALID)
  {
    alert("You must make a selection before proceeding.");
  }
  else
  {
    step = newStep;

    if(step > STEPMAX)
    { //check oob
      step = STEPMAX;
    }

    if(step < STEPMIN)
    {
      step = STEPMIN;
    }

    updateUI();
  }
}

function restart()
{
  atk = '';
  def = '';
  atkType = '';
  defType = '';
  atkColor = '';
  defColor = '';

  step = ATK;

  updateUI();
}

function updateUI()
{
  //clear ui
  titleDiv.innerHTML = '';
  optionsDiv.innerHTML = '';
  navBtnsDiv.innerHTML = '';

  //repopulate from templates
  titleDiv.insertAdjacentHTML('afterbegin', stepTemplates[step][TITLE]());
  optionsDiv.insertAdjacentHTML('afterbegin', stepTemplates[step][OPTIONS]());
  navBtnsDiv.insertAdjacentHTML('afterbegin', stepTemplates[step][NAVBTNS]());
  stepTemplates[step][PROC]();

  optionsDiv.style.width = Math.min(4 * (optionsDiv.clientHeight / Math.ceil(items/2)), window.innerWidth) + 'px';

  if(items == 0)
  {
    optionsDiv.style.width = window.innerWidth;
  }

  fixText();
}

//stepTemplates functions
function nop()
{ //used when no return is wanted / needed
  return '';
}

function title(titleText)
{
  return `
    <div class="flag">
      <svg class="w-100 h-100 d-block" viewBox="0 0 2 3" preserveAspectRatio="none">
        <polygon class="flagSvg" points="0 0, 2 0, 2 2, 1 3, 0 2"/>
      </svg>
      <span class="flagText svgText resize">${titleText}</h1>
    </div>
  `;
}

function optionsBtnTemplate(text, onclick)
{
  return `
    <div class="col-6 d-flex my-auto mx-auto">
      <a class="mx-auto my-auto d-block svgParent" style="max-width:50vw" onclick="${onclick}">
        <svg class="w-100 my-auto mx-auto d-block" viewBox="0 0 100 50">
          <polygon class="optBtnSvg" points="0 25, 20 0, 80 0, 100 25, 80 50, 20 50"/>
        </svg>
        <span class="w-75 optText svgText">${text}</span>
      </a>
    </div>
  `;
}

function setOptionButtons(text, variable)
{
  out = '';

  items = text.length;

  for(var i = 0; i < items; i++)
  {
    out += optionsBtnTemplate(text[i], `${variable}=this.innerText.toLowerCase();selectOptionMatch(this.innerText)`);
  }

  return out;
}

function outputBody()
{
  items = 0;

  var atkTypeIndice = scan(ships, atkType);
  var defTypeIndice = scan(ships, defType);
  var atkColorIndice = scan(colors, atkColor);
  var defColorIndice = scan(colors, defColor);

  var atkAcc = acc[atkTypeIndice][atkColorIndice];
  var atkPen = pen[atkTypeIndice][atkColorIndice];
  var defSize = size[defTypeIndice][defColorIndice];
  var defTough = size[defTypeIndice][defColorIndice];

  var toHitMin = toHit[defSize][atkAcc];
  var toDestroyMin = toDestroy[defTough][atkPen];

  var hitRoll = Math.floor(Math.random() * 20) + 1;
  var destroyRoll = Math.floor(Math.random() * 20) + 1;

  var out1;
  var out2;

  var toHitMsg;
  var toDestroyMsg;

  if(hitRoll >= toHitMin)
  {
    toHitMsg = "ACCURATE ENOUGH TO HIT!";

    if(destroyRoll >= toDestroyMin)
    {
      toDestroyMsg = "STRONG ENOUGH TO DESTROY!";

      out1 = "A STRONG SHOT AND A HIT!";
      out2 = "DEFENDER DESTROYED!!";
    }
    else
    {
      toDestroyMsg = "NOT STRONG ENOUGH TO DESTROY!";

      out1 = "A HIT, BUT A WEAK SHOT!";
      out2 = "DEFENDER NOT DESTROYED";
    }
  }
  else
  {
    toHitMsg = "NOT ACCURATE ENOUGH TO HIT!";

    if(destroyRoll >= toDestroyMin)
    {
      toDestroyMsg = "STRONG ENOUGH TO DESTROY!";

      out1 = "A STRONG SHOT, BUT A MISS!";
      out2 = "DEFENDER NOT DESTROYED";
    }
    else
    {
      toDestroyMsg = "NOT STRONG ENOUGH TO DESTROY!";

      out1 = "A WEAK SHOT AND A MISS!";
      out2 = "DEFENDER NOT DESTROYED";
    }
  }

  return `
    <div class="outputBody">
      <div class="toHit resize d-block">
        <div class="text-center"><span class="outputTitle">To Hit:</span></div>
        <div class="justify-content-center d-flex"><span class="col-6 text-right">Accuracy: ${atkAcc} </span>|<span class="col-6 text-left"> Size: ${defSize}</span></div>
        <div class="justify-content-center d-flex"><span class="col-6 text-right">To Hit: ${toHitMin} </span>|<span class="col-6 text-left"> Roll: ${hitRoll}</span></div>
        <div class="text-center" style="text-shadow: 0px 1px #ddd;"><u><b>${toHitMsg}</b></u></div>
      </div>

      <div class="toDestroy resize d-block">
        <div class="text-center"><span class="outputTitle">To Destroy:</span></div>
        <div class="justify-content-center d-flex"><span class="col-6 text-right">Penetration: ${atkPen} </span>|<span class="col-6 text-left"> Toughness: ${defTough}</span></div>
        <div class="justify-content-center d-flex"><span class="col-6 text-right">To Destroy: ${toDestroyMin} </span>|<span class="col-6 text-left"> Roll: ${destroyRoll}</span></div>
        <div class="text-center" style="text-shadow: 0px 1px #ddd;"><u><b>${toDestroyMsg}</b></u></div>
      </div>

      <div class="message resize text-center">
          <div>
            <span>
              ${out1}
            </span>
          </div>
          <div>
            <u>
              <b>
                <span style="text-shadow: 0px 1px #ddd">
                  ${out2}
                </span>
              </b>
            </u>
          </div>
      </div>
    </div>
  `;
}

function selectOptionMatch(text)
{ //gives the "selected" CSS class to option button with matching body text. removes it from any others with it
  //this is used to indicate to user their previous selections still apply when hitting 'back'

  $(".optText").each(function () {
    if(this.innerText.toLowerCase() == text.toLowerCase())
    {
      this.previousElementSibling.firstElementChild.classList.add("selected");
      this.previousElementSibling.classList.add("selectedParent");
    }
    else
    {
      this.previousElementSibling.firstElementChild.classList.remove("selected");
      this.previousElementSibling.classList.remove("selectedParent");
    }
  });
}

function navBtnTemplate(text, onclick)
{
  return `
    <div class="col-6 h-100 d-flex">
      <a class="h-100 mx-auto my-auto d-block svgParent" onclick="${onclick}">
        <svg class="h-100 my-auto mx-auto d-block" viewBox="0 0 100 50">
          <polygon class="navBtnSvg" points="0 10, 0 45, 10 50, 80 50, 100 40, 100 5, 90 0, 20 0"/>
        </svg>
        <span class="navText resize w-100 svgText">${text}</span>
      </a>
    </div>
  `;
}

function nextBtnOnly(nextStep)
{
  return `<div class="col-6"></div>` + navBtnTemplate("Next", `modifyStep(${nextStep})`);
}

function backNext(backStep, nextStep)
{
  return navBtnTemplate("Back", `modifyStep(${backStep})`) + navBtnTemplate("Next", `modifyStep(${nextStep})`);
}

function backRestart(backStep)
{
  return navBtnTemplate("Back", `modifyStep(${backStep})`) + navBtnTemplate("Restart", `restart()`);
}

//lets you turn nextBtnOnly("atk == '' ? INVALID : (atk == 'alien' ? ATKALIEN : ATKHUMAN) into nextBtnOnly(a("atk", "alien", "ATKALIEN", "ATKHUMAN")). barely better, i know
function a(variable, test, yes, no)
{
  return `${variable} == '' ? INVALID : (${variable} == '${test}' ? ${yes} : ${no})`;
}

function b(variable, yes)
{ //i have realized now that i have almost reimplemented C preprocessing in javascript. i am as disgusted as you are.
  return `${variable} == '' ? INVALID : ${yes}`;
}

function scan(arr, str)
{
  var i = 0;

  while(i < arr.length)
  {
    if(arr[i] == str)
    {
      return i;
    }

    i++;
  } //if loop terminates, str not found. should never happen

  alert(`Critical error: Failed to find ${str}. Please refresh the page and restart.`);
}

function fixText()
{
  var optTexts = $(".optText");
  var navTexts = $(".navText");
  var flagText = $(".flagText");

  optTexts.each(function() {
    $(this).css('font-size', $(this).width() / 6);
  });

  navTexts.each(function() {
    $(this).css('font-size', $(this).width() / 5);
  });

  autoSizeText(); //fixes text for flag text
}

window.addEventListener("resize", updateUI); //force a redraw of text to fix sizing
