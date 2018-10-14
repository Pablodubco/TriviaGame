# TRIVIA GAME

A timed quiz "trivia" game constructed with the use of jQuery and timers with multiple configurable properties for the questions, answers, display, and scoring system. Allowing to change the theme and the target audience of the quiz.

[Try it here](https://pablodubco.github.io/TriviaGame/)

## Contents

* [Current implementation](#current-implementation)
* [Implementing](#implementing)
  + [Required HTML tags](#required-html-tags)
  + [Required variable names](#required-variable-names)
  + [Starting up the quiz](#starting-up-the-quiz)
* [Quiz object properties](#quiz-properties)
  + [Understanding the flow](#understanding-the-flow)
  + [General settings](#general-settings)
  + [Display settings](#display-settings)
  + [Dynamic properties](#dynamic-properties)
  + [Questions collection](#questions-collection)
  + [Methods](#methods) (Under construction)


## Current implementation

The current implementation has the following rules:

* A question and 4 possible answers will be shown to the player. Only 1 answer is correct.
* Each question has a 20 second timer to select an answer.
* If the player correctly answers the question, the remaining seconds will be added to the score.
* Consecutive correct answers increase the streak score, multiplying the score on the next correct answer by that amount (x2, x3, x4...).
* A wrong answer, or a time-out without answer, adds no score and resets the streak count to 0.
* The objective of the game is to get the highest possible score, by answering quickly, and answering right.
* The theme is _Animated Films_.

Select the number of questions to tackle from the dropdown, or play with all 50 included questions.

>**NOTE:** 
>* Many of these rules can be altered by changing strings or values in the [quiz object general settings](#general-settings).
>* The questions, including their displayed graphics, timeouts, etc, can be adjusted in the question object properties of the [questions collection](#questions-collection).

## Implementing

The game is self contained inside an object, but it's not completely independent from the HTML file layout:

* It uses the [Bootstrap v4]() css framework.
* It requires [jQuery]() libraries for dynamically generating DOM elements.
* The quiz object provides several properties for styling the dynamically generated elements.
* Anything that cannot be styled by changing classes or CSS (like parent and child elements), must be edited by alering the code.

**Contents**

  + [Required HTML tags](#required-html-tags)
  + [Required variable names](#required-variable-names)
  + [Starting up the quiz](#starting-up-the-quiz)

### Required HTML tags

Create the following 5 sections on your HTML file and assign them any desired ID or class to identify them:

1. A Bootstrap v4 column `<div>` for containing the question texts and their accompanying images.
1. A Bootstrap v4 row `<div>` for the option buttons.
1. A Bootstrap v4 column `<div>` for containing the score.
1. Optional, a Bootstrap v4 column `<div>` for containing the consecutive right guesses (streak). Adjust this requirement in the quiz object property **_[boolStreakScore](#general-settings)_**
1. A Bootstrap v4 row `<div>` for the digital clock.

Example

```html
<div class="container">
    <div class="row">
        <div class="col-12" id="colDivQuestion"> <!-- 1. Questions area -->
    </div>

    <div class="row" id="rowDivOptions"> <!-- 2. Options area -->
    </div>

    <div class="row">
        <div class="col-6" id="colDivScore"> <!-- 3. Score area-->
        </div>
        <div class="col-6" id="colDivStreak"> <!-- 4. Streak area-->
        </div>
    </div>

    <div class="row" id="rowDivClock"> <!-- 5. Digital clock area -->
    </div>
</div>
```

| [Implementing index](#implementing) | [Main index](#contents) |
| :---: | :---: |

### Required variable names

The quiz code looks for the following variable names, for controlling dynamic elements. In order:

1. **colDivQuestion:** variable to store the HTML parent element for displaying the question texts and their accompanying images.
1. **rowDivOptions:** variable to store the HTML parent element for displaying the option buttons.
1. **colDivScore:** variable to store the HTML parent element that displays the score.
1. **colDivStreak:** variable to store the HTML parent element that displays consecutive wins (streak).
1. **rowDivClock:** variable to store the HTML parent element that holds the digital clock.

Assign these variable names to your desired id's or classes to reference the HTML elements that will serve as containers for the dynamically generated DOM elements. 

Example:

```javascript
var colDivQuestion = $("#colDivQuestion");
var rowDivOptions = $("#rowDivOptions");
var colDivScore = $("#colDivScore");
var colDivStreak = $("#colDivStreak");
var rowDivClock = $("#rowDivClock");
```

Finally, the quiz object variable name _QuizObject_ should remain unchanged, least replacing it inside the object code as well.

>**NOTE:** The styling of dynamically generated elements can be altered by editing the [quiz object display settings](#display-settings). If the variable names are changed, replace them inside the quiz object code as well.

| [Implementing index](#implementing) | [Main index](#contents) |
| :---: | :---: |

### Starting up the quiz

Add a button, trigger, or any other tool, and call the object method **_mQuizStart([number of questions])_**. The argument determines the number of questions to fecth from the object's [question collection array](#questions-collection) for the current quiz.

Example:

```html
<div class="bg-darker py-5">
    <button type="button" class="btn btn-outline-danger w-50" id="btnPlay">Play! <i class="fa fa-play"></i></button>
</div>
```
```javascript
$("#btnPlay").on("click",function(){
    numberQuestions = $("#numberQuestions").val().trim();
    QuizObject.mQuizStart(numberQuestions);
});
```

| [Implementing index](#implementing) | [Main index](#contents) |
| :---: | :---: |

## Quiz properties

The quiz has multiple configurable settings in adition to a completely editable questions collection.

**Contents**

+ [Understanding the flow](#understanding-the-flow)
+ [General settings](#general-settings)
+ [Display settings](#display-settings)
+ [Dynamic properties](#dynamic-properties)
+ [Questions collection](#questions-collection)
+ [Methods](#methods) (Under constrction)

| [Back to main index](#contents) |
| :---: |

### Understanding the flow

1. When first launched, it populates a temporal array **_[arQuizQuestions](#general-settings)_** that will hold the quiz questions for the current session:
   * The default behavior is to select a number of questions from the master collection **_[arQuestions](#questions-collection)_** and shuffle them around.
   * If the quiz object property **_[boolOrderedQuestions](#general-settings)_** is set to _true_, it will instead select the questions whos ids are listed inside the **_[arOrderedQuestions](#general-settings)_** array and display them in the listed order. 
   * The number of questions selected is specified in the argument passed on to the **_[mQuizStart](#methods)_** method.
1. Once arrays are ready, the **_[mQuizRunQuestion](#methods)_** method is called. For each question object, a card will be constructed, displaying the question text, an optional image, the multiple-option answers, and a countdown timer.
   * The countdown timer is a collection of images from 0 to 9, the colons, and an optional background. The images used can be specified in the [display settings](#display-settings). The amount of seconds on the timer are specified in each [question's properties](#questions-collection). The timer runs by repeately calling the **_[mDisplayTimer](#methods)_** method with the number of seconds remaining.
   * The number of multiple-option answers available for each question is adjusted in the quiz property **_[intOptions](#general-settings)_**. 
   * The max number of right answers within the options is adjusted in the quiz property **_[intRightOptions](#general-settings)_**.
   * The program selects the minimum number between **_[intRightOptions](#general-settings)_** and **_[intOptions](#general-settings)_** answers from the **_arRightAnswers_** array property in the [question objects](#questions-collection). It's possible, then, to make a quiz where all answers are right answers, maybe for an informative promo material; or one where there are no right answers, for sadistic purposes.
1.  Once the question is displayed, and the timer running, one of 3 possible outcomes is possible:
   * The user selects a right answer, evaluated inside the on-click event of the button: calls the method **_[mQuizRightAnswer](#methods)_**.
   * The user selects a wrong answer, evaluated inside the on-click event of the button: an additional information card will be displayed with the right answer, notifying the user of an incorrect choice, with text and an (optional) image. Calls the method **_[mQuizWrongAnswer](#methods)_**. Calls the method **_[mQuizWrongAnswer](#methods)_**.
   * The timer runs out: an additional information card will be displayed with the right answer, notifying the user of the time out, with text and an (optional) image. Calls the method **_[mQuizWrongAnswer](#methods)_**.
1. The methods **_[mQuizWrongAnswer](#methods)_** and **_[mQuizRightAnswer](#methods)_** pass an argument to the method **_[mQuizDisplayInfo](#methods)_** indicating if the answer was _"right"_, _"wrong"_ or if the timer ran out _"timeup"_. An additional information card will be displayed, notifying the user if the coice was right, wrong or if the timer ran out, with text and an (optional) image.  
1. After a few seconds, specified in the **_intWait_** [general quiz settings](#general-settings) property the next question is displayed by increasing the question index **_intCurrentQuestion_** and calling the method **_[mQuizRunQuestion](#methods)_**. Repeating steps 3 - 5 until all questions in the **_arQuizQuestions_** array have been answered.  
1. Once no more questions remain, the **_[mQuizFinish](#methods)_** method is called, to display a finish image, text message, and the final score.  

| [Quiz properties index](#quiz-properties) | [Main index](#contents) |
| :---: | :---: |

### General settings

These affect the general behavior of the quiz, by affecting the parameters applied to all flow phases.

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| intOptions | integer | Defines the number of options shown to the user. Each option is constructed as a button. Buttons are shown in individual Bootstrap v4 divs with the _.col_ class, and are place one per row (4 options = 4 rows). |
| intRightOptions | integer | Defines the number of options containing a right answer shown to the user. If this value is equal or greater than the **_intOptions_** property value, all answers shown will be right answers. |
| boolTimeScore | boolean | When _true_, the score will depend on how many seconds were remaining when the player chose a correct answer, before the question's timer runs out. When _false_ each right answer increases the score by 1. |
| boolStreakScore | boolean | If set to true, the game will keep track of consecutive right answers and update the display with this number as a winning streak. |
| floatStreakScoreMult | number | The multiplier for each consecutive right answer for the score bonus. The score for each right answer uses the following formula: `score * (1 + floatStreakScoreMult * intStreakScore)`. If greater than 0, the score multiplier will be shown in parenthesis next to the winning streak display. Note that the score is an integer rounded down to the last "complete" natural number. |
| intQuizQuestions | integer | The total number of questions displayed to the user. |
| boolOrderedQuestions | boolean | If _false_, the questions will be selected at random from the [questions collection](#questions-collection). If _true_, the program gives an ordered list of questions specified in the **_arQuizQuestions_** array. |
| arOrderedQuestions | array | An array of string elements. Only used if boolOrderedQuestions is _true_, contains the unique identifiers **_strId_** of the questions to be presented in order. |
| intWait | integer | The number of seconds to wait before showing the next question, after an answer is selected or the timer ran out, while the additional info card is being displayed. |
| EasterEgg | boolean | Easter egg for the current implementation, that triggers the method to show all gifs in order, just for fun. |

| [Quiz properties index](#quiz-properties) | [Main index](#contents) |
| :---: | :---: |

### Display settings

Strings and classes that affect the dynamically generated UI elements and displayed texts

**General strings**

Change the displayed texts in the HTML file

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strQuestionSectionID | string | Id of the questions area, for changing the window focus when beginning the quiz. |
| strCorrect| string | String to display when choosing the right answer. Supports HTML tags. |
| strWrong | string | String to display when choosing the wrong answer. Supports HTML tags. |
| strTimeUp | string | String to display when time runs out before selecting an answer. Supports HTML tags. |
| strScore | string | String to display the "Score" title for the dynamic score `<div>`. |
| strStreak | string | String to display the "Streak" title for the dynamic streak `<div>`. |

**General display settings**

CSS and classes for styling the dynamically generated elements.

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strQuestionImgClass| string | Classes for styling the question image. |
| strQuestionTxtClass| string | Classes for styling the question text. |
| strOptionsClass| string | Classes for styling the question's option buttons. |
| strOptionsRightClass| string | Classes for styling the question's option buttons that contain a correct answer (after the choic was made, or the time runs up). |
| strInfoImgStyle| string | CSS Style of the image on the info screen after selecting an answer, |
| strScoresTitleClass| string | Classes for styling the div that holds the scores titles (includes streak). |
| strScoresNumberClass| string | Classes for styling the div that holds the scores numbers (includes streak). |
| strChoiceIcon| string | Icon class to accompany choice buttons. |
| strChoiceRightIcon| string | Icon class that is replaced in the choice buttons to show the right choice. |
| strChoiceWrongIcon| string | Icon class that is replaced in the choice buttons to show the wrong choice. |

**Quiz finish display settings**

Specific display settings for the final message when the quiz is done

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strQuizFinishImage | string | The path of the image to show when the quiz is done. |
| strQuizFinishScoreTxt | string | The text to display above the final score for the quiz. |
| strQuizFinishScoreTxtStyle | string | The CSS style to format the text to display above the final score. |
| strQuizFinishScoreStyle | string | The CSS style to format the final score number. |
| strQuizFinishScoreBtnClass | string | The class of the restart button when quiz is finished. |
| strQuizFinishRestartIconCLass | string | Class of the icon for the restart button. |

**Digital clock**

Specific display settings for the digital clock, mainly, the paths of the images it uses.

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strClockPath| string | General path where all the clock images are stored. |
| arClockImages| string | Array containing 10 individual clock digits image names, ordered from 0 to 9. |
| strClockBgImage| string | Background image for the digital clock. |
| strClockDotsImage| string | The image for the colons `:` that separate minutes and seconds. |
| strClockImageOff| string | The image for a dash `-` to represent "no score" when choosing wrong answer. |

**Questions**

Questions are a Bootstrap v4 _.card_ div with a title that specifies the number of question, an optional image, the question text, and buttons for posible answers.

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strClassQuestion | string | Classes for styling the question cards. |
| strClassOptions | string | Classes for styling the option buttons within the question card. |

| [Quiz properties index](#quiz-properties) | [Main index](#contents) |
| :---: | :---: |

### Dynamic properties

These are used as "variable" properties, that change during the course of the quiz, for example, to keep scores. Changing them does nothing, unless the quiz is already running and you want to mess with the game flow.

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| intScore| integer | The score. |
| intStreakScore| integer | The number of consecutive wins. |
| arQuizQuestions| array | The array containing the current quiz questions |
| intClockMinTens| integer | Digital clock: the digit for tens of minutes. |
| intClockMinUnits| integer | Digital clock: the digit for the units of minutes. |
| intClockSecTens| integer | Digital clock: the digit for the tens of seconds. |
| intClockSecUnits| integer | Digital clock: the the digit for units of seconds. |
| intCurrentQuestion| integer | Indicates the current running question. |
| arTimers| array | This array keeps track of all timers, to make it posible to clear all at once, just in case. |
| intQuestions| integer | Stores the last number of questions selected. |

| [Quiz properties index](#quiz-properties) | [Main index](#contents) |
| :---: | :---: |

### Questions collection

Questions
* The arQuestions game property is an array containing the collection of questions.
* Questions are objects contained inside the arQuestions array.
* Question objects have the following properties:

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strId | string | A unique string identifier for each question. If two or more questions share the same name, only the first one (lowest index) will be considered. |
| strQuestion | string | The text of the question to be displayed to the user. |
| arRightAnswers | array | An array of strings with different possible RIGHT answers to be displayed to the user. The number of right answers displayed as options is adjusted in the **_intRightOptions_** [quiz property](#general-settings). |
| arRightAnswersInfo | array | An array that contains strings. Each string represents the additional information text about the correct answers that is displayed whenever an answer is selected. The elements must match the number and order of the **_arRightAnswers_** array to expand on each correct anwer, otherwise, the first element is selected by default. |
| arWrongAnswers | array | An array of strings with different possible WRONG answers to be displayed to the user. The number of wrong options presented to the user is the difference between the **_intRightOptions_** and **_intOptions_** [quiz properties](#general-settings). |
| imgQuestion | string | The source of an optional image that accompanies the question. |
| strImgPosition | string | _"top"_ or _"bottom"_. The position of the question image with respect to the text of the question. |
| arImgRightAnswers | array | An array of string elements representing the source of an optional image that will be presented to the user whenever a right answer is selected. Must match the length and order of right answers, ot |
| arImgWrongAnswers | array | An array of string elements. Each string is the source of an image that will be presented to the user whenever a wrong answer is selected. |
| intSeconds | integer | Represents the number of seconds the user has to answer the question. |

| [Quiz properties index](#quiz-properties) | [Main index](#contents) |
| :---: | :---: |

### Methods

(under construction)

- [General utility methods](#general-utility-methods)
- [Quiz flow methods](#quiz-flow-methods) (under construction)
- [Display methods](#quiz-flow-methods) (under construction)


___________________________________________________________________

#### General utility methods

Used for array manipulation at several points in the code.

**mFindObject(array, property, value)**

Uses the .find() method to fetch the first object in an _array_ to match the condition _property_ = _value_. Returns _undefined_ if none of the objects match the condition.  
_returns: object_

| **Arguments** | **Format** | **Description** |
| --- | --- | --- |
| array | array | An array of objects |
| property | string | The name of the property that will have its value matched |
| value | string or number | The value against which to match the property's value |


**mReduceArray(array,elements)**

Removes random elements from a provided array until a specified number of elements remain.
If the provided array has less elements than the specified number, returns it intact.  
_returns: array_

| **Arguments** | **Format** | **Description** |
| --- | --- | --- |
| array | array | An array with any type of elements |
| elements | integer | A number that represents the maximum length of the reurned array |


**mShuffleArray(array)**

Switches the indexes of elements inside an array randomly.  
_returns: array_

| **Arguments** | **Format** | **Description** |
| --- | --- | --- |
| array | array | An array with any type of elements |

| [Methods index](#methods) | [Quiz properties index](#quiz-properties) |
| :---: | :---: |
_____________________________________________

(Under construction)