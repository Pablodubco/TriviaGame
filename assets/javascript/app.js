// Variables for DOM
var colDivQuestion = $("#colDivQuestion");
var colDivScore = $(".colDivScore");
var colDivStreak = $(".colDivStreak");
var rowDivClock = $("#rowDivClock");
var rowDivOptions = $("#rowDivOptions");

var buttonMess = [0,0,0,0];

window.onload = function(){
    $("#btnPlay").on("click",function(){
        numberQuestions = $("#numberQuestions").val().trim();
        console.log(numberQuestions);
        QuizObject.mQuizStart(numberQuestions);
    });

    $(".udBtnPlaceHolder").on("click",function(){
        var btn = $(this);
        var text = btn.text();
        var int = parseInt(btn.attr("data-value"))+1;
        if (buttonMess[btn.attr("data-value")] == 0){
            btn.text(text + " - I've been clicked!");
            buttonMess[btn.attr("data-value")]+=2;
        }
        else{
            btn.text("Option "+int+" - I've been clicked! (x"+buttonMess[btn.attr("data-value")]+")");
            buttonMess[btn.attr("data-value")]++;
        }
        if(buttonMess[btn.attr("data-value")] >= 20 && buttonMess[btn.attr("data-value")] < 50){
            btn.text("Option "+int+" - You must really enjoy clicking! (x"+buttonMess[btn.attr("data-value")]+")");
        }
        if(buttonMess[btn.attr("data-value")] >= 50 && buttonMess[btn.attr("data-value")] < 75){
            btn.text("Option "+int+" - Wonder how far you'll go... (x"+buttonMess[btn.attr("data-value")]+")");
        }
        if(buttonMess[btn.attr("data-value")] >= 75 && buttonMess[btn.attr("data-value")] < 100){
            btn.text("Option "+int+" - Seriously, there's nothing here. (x"+buttonMess[btn.attr("data-value")]+")");
        }
        if(buttonMess[btn.attr("data-value")] >= 100 && buttonMess[btn.attr("data-value")] < 125){
            btn.text("Option "+int+" - You're really determined, aren't you? (x"+buttonMess[btn.attr("data-value")]+")");
        }
        if(buttonMess[btn.attr("data-value")] >= 125 && buttonMess[btn.attr("data-value")] < 150){
            btn.text("Option "+int+" - "+(150-buttonMess[btn.attr("data-value")])+" clicks remaining to unlock SECRET (x"+buttonMess[btn.attr("data-value")]+")");
        }
        if(buttonMess[btn.attr("data-value")] >= 150 && buttonMess[btn.attr("data-value")] < 200){
            btn.text("Option "+int+" - Just kidding. There is no secret ingredient... (x"+buttonMess[btn.attr("data-value")]+")");
        }
        if(buttonMess[btn.attr("data-value")] >= 200){
            btn.html("<span style='font-size:x-small'>Right-click > Inspect. Type 'QuizObject.EasterEgg = true' on the console window, click 'Play'</span>");
        }
    });
}

var QuizObject = {

// General quiz settings______________________________________________________________
    intOptions: 4,              // Defines the number of options shown to the user for each question. Each option is constructed as a button. Buttons are shown in individual Bootstrap v4 divs with the .col class, side by side in sets of 2, ie, 2 on the first row, 2 on the second...
    intRightOptions: 1,         // Defines the number of options containing a right answer shown to the user. If this value is greater than the **_intOptions_** property value, all answers shown will be right answers.
    boolTimeScore: true,        // When true, the score will depend on how many seconds were remaining when the player chose a correct answer. 
    boolStreakScore: true,      // If set to true, the game will keep track of consecutive right answers and update the display with the number.
    floatStreakScoreMult: 1,    // The multiplier for each consecutive right answer for the score bonus. A value of 0 disables the multiplier. 
    boolOrderedQuestions:false, // When false, the questions will be selected at random. If true, the program gives an ordered list of questions specified in the arQuizQuestions array.
    EasterEgg: false,           // Easter egg. If true, skips quiz and shows all answer's gifs in sequence.
    arOrderedQuestions:[],      // An array of string elements. Only used if boolOrderedQuestions is 'true', contains the unique identifiers strId of the questions to be presented in order.
    intWait: 8,                // The number of seconds to wait before showing the next question, after an answer is selected or the timer runs out (while the additional info card is being displayed)

// General quiz strings________________________________________________________________
    strQuestionSectionID: "headerQuestions",                           // Id of the questions area, for changing the window focus when beginning the quiz.
    strCorrect: "<span style='color:goldenrod'>That's right!</span>",  // String to display when choosing the right answer.
    strWrong: "<span style='color:lightslategrey'>Wrong...</span>",    // String to display when choosing the wrong answer.
    strTimeUp: "<span style='color:orangered'>Time's up.</span>",      // String to display when time runs out before selecting an answer.
    strScore: "Score",                                                 // String to display the "Score" title.
    strStreak: "Streak",                                               // String to display the "Streak" title.

// Display settings
    // Styling classes
    strQuestionImgClass: "mx-auto my-auto",                     // Classes for styling the question image.
    strQuestionTxtClass: "text-white udResizeText",             // Classes for styling the question text.
    strOptionsClass: "btn-outline-danger w-100 text-left",      // Classes for styling the question's option buttons.
    strOptionsRightClass: "btn-outline-warning w-100 text-left",      // Classes for styling the question's option buttons that contain a correct answer (after the choic was made, or the time runs up).
    strInfoImgStyle: "max-width:100%;max-height:250px;width:auto;height:auto", // CSS Style of the image on the info screen after selecting an answer
    strScoresTitleClass: "text-center text-white bg-dark udResizeText",      // Classes for styling the div that holds the scores titles (includes streak)
    strScoresNumberClass: "text-center text-white bg-darker udResizeText",   // Classes for styling the div that holds the scores numbers (includes streak)
    strChoiceIcon: "fa fa-circle-o",            // Icon class to accompany choice buttons.
    strChoiceRightIcon: "fa fa-check-circle-o", // Icon class that is replaced in the choice buttons to show the right choice.
    strChoiceWrongIcon: "fa fa-times-circle-o", // Icon class that is replaced in the choice buttons to show the wrong choice.

    // Quiz finish display settings
    strQuizFinishImage: "assets/images/Thankyou.jpg",                               // The path of the image to show when the quiz is done.
    strQuizFinishScoreTxt: "Your total score is",                                   // The text to display above the final score for the quiz.
    strQuizFinishScoreTxtStyle: "color:white",                                      // The CSS style to format the text to display above the final score.
    strQuizFinishScoreStyle: "color:goldenrod;font-weight:bold;font-size:larger",   // The CSS style to format the final score number.
    strQuizFinishScoreBtnClass: "btn-danger",                                       // The class of the restart button when quiz is finished
    strQuizFinishRestartIconCLass: "fa fa-repeat",                                  // The class of the icon for the restart button.

    // Digital clock.
    strClockPath: "assets/images/clock/",                   //Path of the numbered images for the digital clock
    arClockImages: ["0.jpg","1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg"], // Array containing 9 individual clock digits image names, ordered from 0 to 9.
    strClockBgImage: "clockbg.jpg",                         // Background image for the digital clock
    strClockDotsImage: "dots_on.jpg",                       // The image displaying dots ":" that separate minutes and seconds.
    strClockImageOff: "dash.jpg",                           // The image displaying a dash "-" to represent "no score" when choosing wrong image.

// Dynamic properties_________________________________________________________________
    intScore: 0,            // The score.
    intStreakScore: 0,      // The number of consecutive wins.
    arQuizQuestions: [],    // The array containing the current quiz questions
    intClockMinTens: 0,     // Digital clock: the digit for tens of minutes.
    intClockMinUnits: 0,    // Digital clock: the digit for the units of minutes.
    intClockSecTens: 0,     // Digital clock: the digit for the tens of seconds.
    intClockSecUnits: 0,    // Digital clock: the the digit for units of seconds.
    intCurrentQuestion: 0,  // Indicates the current running question.
    arTimers: [],           // This array keeps track of all timers, to make it posible to clear all at once, just in case.
    intQuestions: 0,        // Stores the last number of questions selected

// Questions collection________________________________________________________________
    arQuestions:[
        {
            strId: "Toystory01",
            strQuestion: "Toy Story's main character, Woody, wasn't originally a cowboy in the first draft. What was he?",
            arRightAnswers: ["Ventriloquist dummy"],
            arRightAnswersInfo: ["The original Woody was a <span style='color:brown;font-weight:bold'>ventriloquist's dummy</span>. Executives at Disney, which co-produced the film, requested that he be changed to something else, as ventriloquist's dummies were usually associated with horror movies"],
            arWrongAnswers: ["Teddy bear","Marionette","Wooden soldier","Ragg doll","Sock puppet"],
            imgQuestion: "assets/images/ToyStory.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/ToyStory_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/ToyStory_03.gif"],
            intSeconds: 20,
        },
        {
            strId: "Toystory02",
            strQuestion: "What company turned down the toy license for the Toy Story franchise?",
            arRightAnswers: ["Hasbro","Mattel"],
            arRightAnswersInfo: ["Both, <span style='color:brown;font-weight:bold'>Hasbro</span> and <span style='color:brown;font-weight:bold'>Mattel</span>, turned down the toy license for the Toy Story franchise, believing that they wouldn't have enough time to put a toy line together in the 11 months they had before the film came out."],
            arWrongAnswers: ["Lego","Nintendo","Fisher Price","Toys R Us","Toy Biz","Playmobil","Playskool","Bandai"],
            imgQuestion: "assets/images/ToyStory.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/ToyStory_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/ToyStory_03.gif"],
            intSeconds: 20,
        },
        {
            strId: "Toystory03",
            strQuestion: "What was the original proposed format of the sequel, Toy Story 2?",
            arRightAnswers: ["DVD"],
            arRightAnswersInfo: ["Disney originally wanted Toy Story 2 to bypass a theatrical release and go directly to <span style='color:brown;font-weight:bold'>DVD</span>. However, during production it became clear that Toy Story 2 was good enough for a full feature film."],
            arWrongAnswers: ["TV Series","TV Movie","Full feature film"],
            imgQuestion: "assets/images/ToyStory.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/ToyStory_02.gif"],
            arImgWrongAnswers: ["assets/images/animated/ToyStory_02.gif"],
            intSeconds: 20,
        },
        {
            strId: "Ratatouille01",
            strQuestion: "After the release of this movie, brittish sales for a particular pet went up by 50%.",
            arRightAnswers: ["Ratatouille"],
            arRightAnswersInfo: ["According to the British pet chain Pets at Home, their rat sales shot up by 50 percent following <span style='color:brown;font-weight:bold'>Ratatouille's</span> release."],
            arWrongAnswers: ["Finding Nemo","Shark Slayer","101 Dalmatians","Lady and the Tramp","Aristocats","Secret Life of Pets","Isle of Dogs"],
            imgQuestion: "assets/images/PetShop.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Ratatouille_02.gif"],
            arImgWrongAnswers: ["assets/images/animated/Ratatouille_05.gif"],
            intSeconds: 20,
        },
        {
            strId: "Ratatouille02",
            strQuestion: "Near the end of Ratatouille, the main character... err rat, prepares a dish for the food critic. What is the name of the dish?",
            arRightAnswers: ["Confit byaldi"],
            arRightAnswersInfo: ["The dish prepared by Remy is an alternate ratatouille variation, called <span style='color:brown;font-weight:bold'>confit byaldi</span>. The major difference is that the vegetables used are sliced thinly and baked, instead of cooking them in the pot."],
            arWrongAnswers: ["Ratatouille","Sablé breton","Volaille basquaise","Estouffade"],
            imgQuestion: "assets/images/Ratatouille.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Ratatouille_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/Ratatouille_01.gif"],
            intSeconds: 20,
        },
        {
            strId: "Ratatouille03",
            strQuestion: "In the movie Ratatouille, what part of the human anatomy is missing from the human characters?",
            arRightAnswers: ["Toes"],
            arRightAnswersInfo: ["To save time and memory when animating the movie, human characters were designed and animated without <span style='color:brown'>toes</span>."],
            arWrongAnswers: ["Armpits","Shoulders","Chest hair","Knees","Collar bone"],
            imgQuestion: "assets/images/Ratatouille.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Ratatouille_04.gif"],
            arImgWrongAnswers: ["assets/images/animated/Ratatouille_04.gif"],
            intSeconds: 20,
        },
        {
            strId: "Ratatouille04",
            strQuestion: "The average person has 110 thousand hairs. In Ratatouille, how many hairs were rendered for the female co-lead, Colette?",
            arRightAnswers: ["115 thousand"],
            arRightAnswersInfo: ["Colette has <span style='color:brown;font-weight:bold'>115 thousand</span> hairs rendered. On a side note, Remy the rat has 1.15 million hairs rendered."],
            arWrongAnswers: ["33 thousand","55 thousand","85 thousand","150 thousand","more than 200 thousand"],
            imgQuestion: "assets/images/Ratatouille.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Ratatouille_04.gif"],
            arImgWrongAnswers: ["assets/images/animated/Ratatouille_04.gif"],
            intSeconds: 20,
        },
        {
            strId: "Incredibles01",
            strQuestion: "This Pixar movie used 4 times as many locations as any other had before.",
            arRightAnswers: ["The Incredibles"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>The Incredibles</span> used 4 times as many locations as any other Pixar movie. It also featured 781 visual effects shots and, at 121 minutes, it's the longest Pixar movie to date."],
            arWrongAnswers: ["A Bug's Life","Cars","Ratatouille","Toy Story 3","Wall-E"],
            imgQuestion: "assets/images/Locations.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/TheIncredibles_02.gif"],
            arImgWrongAnswers: ["assets/images/animated/TheIncredibles_03.gif"],
            intSeconds: 20,
        },
        {
            strId: "Incredibles02",
            strQuestion: "For the production of this Pixar movie, the crew had to review medical text books.",
            arRightAnswers: ["The Incredibles"],
            arRightAnswersInfo: ["While producing <span style='color:brown;font-weight:bold'>The Incredibles</span>, copies of the medical school text Gray's Anatomy were given to the digital sculptors to help them figure out how the human body moves."],
            arWrongAnswers: ["Up","Wall-E","Inside Out","Moana"],
            imgQuestion: "assets/images/MedicalText.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/TheIncredibles_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/TheIncredibles_01.gif"],
            intSeconds: 20,
        },
        {
            strId: "InsideOut01",
            strQuestion: "In order to reach the widest international audience possible, animation studios regularly make tweaks to their films. What was tweaked in Pixar's Inside Out?",
            arRightAnswers: ["Food","Sports"],
            arRightAnswersInfo: ["One example is <span style='color:brown;font-weight:bold'>food</span>: the veggies Riley finds distasteful in Japan, instead of broccoli, she refuses to eat green bell peppers. Another change is the <span style='color:brown;font-weight:bold'>sport</span> being played in Riley's dad's head; it's changed to soccer instead of hockey in some countries."],
            arWrongAnswers: ["Parent's Job","Locations","Clothes","Vehicles","Weather seasons"],
            imgQuestion: "assets/images/InsideOut.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/InsideOut_02.gif"],
            arImgWrongAnswers: ["assets/images/animated/InsideOut_02.gif"],
            intSeconds: 20,
        },
        {
            strId: "InsideOut02",
            strQuestion: "In Pixar's Inside Out, which character was by far the most expensive to bring to the screen?",
            arRightAnswers: ["Joy"],
            arRightAnswersInfo: ["Production designer Ralph Eggleston said <span style='font-style: italic'>'We worked on the idea of <span style='color:brown;font-weight:bold'>Joy</span> being effervescent or sparkly, for about eight months. It got to the point where none of the other characters had it, because we just couldn't afford it</span>'."],
            arWrongAnswers: ["Anger","Fear","Sadness","Disgust","Riley"],
            imgQuestion: "assets/images/InsideOut.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/InsideOut_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/InsideOut_01.gif"],
            intSeconds: 20,
        },
        {
            strId: "Nemo01",
            strQuestion: "The release of this motion picture brought about an excesive decline in the population of an animal species.",
            arRightAnswers: ["Finding Nemo"],
            arRightAnswersInfo: ["Following the release of <span style='color:brown;font-weight:bold'>Finding Nemo</span>, the demand for clownfish as pets instantly skyrocketed. Excessive capture and sale led to a steep decline in the organic population. The waters surrounding Vanuatu saw a 75 percent drop in clownfish numbers."],
            arWrongAnswers: ["Madagascar","Isle of Dogs","Ratatouille","Happy Feet","Over the Hedge"],
            imgQuestion: "assets/images/Endangered.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Nemo_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/Nemo_01.gif"],
            intSeconds: 20,
        },
        {
            strId: "Cars01",
            strQuestion: "For this animated movie, a new lighting technique was developed, changing the standard for future films.",
            arRightAnswers: ["Cars"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>Cars</span> was the first film to utilize a technique known as 'ray tracing', which properly renders the way light interacts with surfaces. It enables artists to accurately depict reflections without 'painting' them individually."],
            arWrongAnswers: ["Happy Feet","Up","Ratatouille","Inside Out","Wall-E"],
            imgQuestion: "assets/images/Lighting.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Cars_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/Cars_01.gif"],
            intSeconds: 20,
        },
        {
            strId: "Up01",
            strQuestion: "In the animated feature film, Up, what was the final balloon count?",
            arRightAnswers: ["Over 10,000"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>10,297</span> balloons were rendered for Up. Fx technical director Jon Reisch recalled <span style='font-style=italic'>'We didn't just simulate the outer shell, beneath the outer layer of balloons are several more layers, each as carefully animated as the first.'</span>"],
            arWrongAnswers: ["Over 2,000","Over 5,000","About 15,000","More than 20,000"],
            imgQuestion: "assets/images/Up.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Up_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/Up_01.gif"],
            intSeconds: 20,
        },
        {
            strId: "WallE01",
            strQuestion: "The tech company, Apple, was involved in the design of this movie.",
            arRightAnswers: ["WALL-E: Character design"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>EVE from WALL-E</span>, was co-designed by Apple's Senior Vice President of Industrial Design Jonathan Ive, the man responsible for the design of Apple devices."],
            arWrongAnswers: ["Incredibles: Gadget design","LEGO Movie: Special effects.","Big Hero Six: Tech design","Robots: Character design"],
            imgQuestion: "assets/images/Apple.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Walle_02.gif"],
            arImgWrongAnswers: ["assets/images/animated/Walle_02.gif"],
            intSeconds: 20,
        },
        {
            strId: "WallE02",
            strQuestion: "The production team watched every single Charlie Chaplin movie for the making of this film.",
            arRightAnswers: ["WALL-E"],
            arRightAnswersInfo: ["For the production of <span style='color:brown;font-weight:bold'>Wall-E</span>, Andrew Stanton and the Pixar team watched every single Charles Chaplin and Buster Keaton movie during lunch for about a year and a half; to inspire the possibilities of pure visual storytelling."],
            arWrongAnswers: ["Incredibles","LEGO Movie","Madagascar","Up","Toy Story","Antz"],
            imgQuestion: "assets/images/CharlieChaplin.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Walle_03.gif"],
            arImgWrongAnswers: ["assets/images/animated/Walle_03.gif"],
            intSeconds: 20,
        },
        {
            strId: "WallE03",
            strQuestion: "The voice of WALL-E was played by the same actor as this other character.",
            arRightAnswers: ["Star Wars: R2-D2"],
            arRightAnswersInfo: ["The voice of WALL-E is legendary sound designer Ben Burtt. Burtt is best known for his work on Star Wars, making <span style='color:brown;font-weight:bold'>R2-D2's</span> distinctive chatter. He's worked on films like E.T. and the Indiana Jones series as well."],
            arWrongAnswers: ["Big Hero Six: Baymax","Robots: Wonderbot","The Iron Giant","Lost in Space: Robot"],
            imgQuestion: "assets/images/Walle.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Walle_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/Walle_01.gif"],
            intSeconds: 20,
        },
        {
            strId: "Monsters01",
            strQuestion: "The final theatrical release of Monsters Inc. was different from the original script. What was the original pitch?",
            arRightAnswers: ["A grown man haunted by monsters"],
            arRightAnswersInfo: ["Monsters Inc. director, Pete Docter, recounted that his original pitch was about a <span style='color:brown;font-weight:bold'>30-year-old man being haunted by monsters</span>. Nobody else can see them. He thinks he's starting to go crazy... these monsters are fears that he never dealt with as a kid."],
            arWrongAnswers: ["Children being kidnapped by monsters","The monster world on the brink of destruction","Parents turning into monsters","A methaphor about anyone becoming a monster"],
            imgQuestion: "assets/images/MonstersInc.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/MonstersInc_05.gif"],
            arImgWrongAnswers: ["assets/images/animated/MonstersInc_05.gif"],
            intSeconds: 20,
        },
        {
            strId: "Zootopia01",
            strQuestion: "In Zootopia, the movie begins with a case of a missing animal. This is a reference to a classic animated feature called...",
            arRightAnswers: ["Emmet Otter's Jug Band Christmas"],
            arRightAnswersInfo: ["The movie begins when Emmet Otterton is reported missing. The writers are quietly concluding the story of the star of <span style='color:brown;font-weight:bold'>Emmet Otter's Jug Band Christmas</span>, a children's book published in 1977, and adapted into a TV special with help from Jim Henson."],
            arWrongAnswers: ["Charlotte's Web","Babar","An American Tail","The Jungle Book","The Fox and The Hound"],
            imgQuestion: "assets/images/Zootopia.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/EmmetOtterton.gif"],
            arImgWrongAnswers: ["assets/images/animated/EmmetOtterton.gif"],
            intSeconds: 20,
        },
        {
            strId: "LionKing01",
            strQuestion: "What was the original title of Disney's classic 'The Lion King'?",
            arRightAnswers: ["King of The Jungle"],
            arRightAnswersInfo: ["The name of the movie seems pretty straightforward, but its original title was actually '<span style='color:brown'>King of the Jungle</span>'. Marketing materials and merchandise had even been made before the studio realized... lions don't live in the jungle."],
            arWrongAnswers: ["Simba's Journey","The Circle of Life","The Prince of Africa","The Lion Legend","The Kingdom of the Savannah"],
            imgQuestion: "assets/images/TheLionKing.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/LionKing_03.gif"],
            arImgWrongAnswers: ["assets/images/animated/LionKing_03.gif"],
            intSeconds: 20,
        },
        {
            strId: "LionKing02",
            strQuestion: "Who was the first Disney character to fart onscreen?",
            arRightAnswers: ["Pumba from The Lion King"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>Pumba</span> is the first Disney character to ever fart onscreen. But we're sure plenty of other Disney characters fart in private."],
            arWrongAnswers: ["Goofy from A Goofy Movie","Roger from Who Framed Roger Rabbit","Baloo from The Jungle Book","Tramp from Lady and the Tramp"],
            imgQuestion: "assets/images/Disney.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Pumba.gif"],
            arImgWrongAnswers: ["assets/images/animated/Pumba.gif"],
            intSeconds: 20,
        },
        {
            strId: "LionKing03",
            strQuestion: "Who was the artist originally intended for the music of The Lion King?",
            arRightAnswers: ["Abba"],
            arRightAnswersInfo: ["The group <span style='color:brown;font-weight:bold'>Abba</span> was originally intended to do the music for The Lion King, but they weren't available, so Disney went with Elton John."],
            arWrongAnswers: ["Paul McCartney","Billy Joel","Wings","Rod Stewart","Phil Collins"],
            imgQuestion: "assets/images/TheLionKing.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Abba.gif"],
            arImgWrongAnswers: ["assets/images/animated/Abba.gif"],
            intSeconds: 20,
        },
        {
            strId: "General01",
            strQuestion: "What was the world's first ever animated film?",
            arRightAnswers: ["El Apostol"],
            arRightAnswersInfo: ["The the world's very first animated feature film was the now-lost '<span style='color:brown;font-weight:bold'>El Apostol</span>', made in Argentina in 1917, directed and produced by Quirino Cristiani and Federico Valle. The film was made with cardboard cut-outs, and consisted of a total of 58,000 frames played over 70 minutes (14 FPS)."],
            arWrongAnswers: ["Snow White and the Seven Dwarfs","Steamboat Willie","Mickey Steps Out","Pinocchio","Saludos Amigos"],
            imgQuestion: "assets/images/OldCartoon.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/ElApostol.jpg"],
            arImgWrongAnswers: ["assets/images/ElApostol.jpg"],
            intSeconds: 20,
        },
        {
            strId: "General02",
            strQuestion: "When was the first Academy Award for Best Animated Feature awarded?",
            arRightAnswers: ["2002"],
            arRightAnswersInfo: ["The Academy Award for Best Animated Feature was first awarded in <span style='color:brown;font-weight:bold'>2002</span>. An animated feature is defined by the Academy as having a running time of more than 40 minutes where no less than 75% of it is animated, and a significant number of the major characters are animated."],
            arWrongAnswers: ["1996","2000","2006","1990"],
            imgQuestion: "assets/images/OldCartoon.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/AcademyAwards.gif"],
            arImgWrongAnswers: ["assets/images/animated/AcademyAwards.gif"],
            intSeconds: 20,
        },
        {
            strId: "General03",
            strQuestion: "What was the most expensive animated film ever made?",
            arRightAnswers: ["Tangled"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>Tangled</span> spent six years in production at an estimated cost of $260 million, one of the most expensive films of all time. The film employed a unique artistic style by blending together CGI, traditional animation, and non-photorealistic rendering to create the impression of a painting."],
            arWrongAnswers: ["Cars","Nightmare Before Christmas","Final Fantasy: The Spirits Within","Coraline","The Incredibles"],
            imgQuestion: "assets/images/Cash.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Tangled.gif"],
            arImgWrongAnswers: ["assets/images/animated/Tangled_02.gif"],
            intSeconds: 20,
        },
        {
            strId: "Nightmare01",
            strQuestion: "Who directed The Nightmare Before Christmas?",
            arRightAnswers: ["Henry Selick"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>Henry Selick</span> is the director, and spent more time on the set and production than Tim Burton. Burton wrote most of the script and created the characters, but he was too busy directing Batman Returns and in pre-production of Ed Wood at the time."],
            arWrongAnswers: ["Tim Burton","Danny Elfman","Michael McDowell"],
            imgQuestion: "assets/images/NightmareBeforeChristmas.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Nightmare.gif"],
            arImgWrongAnswers: ["assets/images/animated/Nightmare.gif"],
            intSeconds: 20,
        },
        {
            strId: "Nightmare02",
            strQuestion: "What was the first Disney animated film to be released under their adult label.",
            arRightAnswers: ["The Nightmare Before Christmas"],
            arRightAnswersInfo: ["Disney decided to release <span style='color:brown;font-weight:bold'>The Nightmare Before Christmas</span> under its adult film label 'Touchstone Pictures' because they thought the film would be too dark and scary for kids; they marketed the film as Tim Burton's The Nightmare Before Christmas."],
            arWrongAnswers: ["Fantasia","Coraline","Alice in Wonderland","The Hunchback of Notre Dame"],
            imgQuestion: "assets/images/Disney.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Nightmare_02.gif"],
            arImgWrongAnswers: ["assets/images/animated/Nightmare_02.gif"],
            intSeconds: 20,
        },
        {
            strId: "Disney01",
            strQuestion: "In which of these Disney movies, do both parents stay alive during the course of the film?",
            arRightAnswers: ["101 Dalmatians","Peter Pan","Lady and the Tramp","Mulan"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>101 Dalmatians</span>, <span style='color:brown;font-weight:bold'>Peter Pan</span>, <span style='color:brown;font-weight:bold'>Lady and the Tramp</span>, and <span style='color:brown;font-weight:bold'>Mulan</span> are the only animated Disney films where both parents are present and don't die."],
            arWrongAnswers: ["Fantasia","The Adventures of Ichabod and Mr. Toad","Alice in Wonderland","The Hunchback of Notre Dame"],
            imgQuestion: "assets/images/Disney.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Dalmatians.gif","assets/images/animated/PeterPan.gif","assets/images/animated/LadyTramp.gif","assets/images/animated/Mulan.gif"],
            arImgWrongAnswers: ["assets/images/animated/Dalmatians.gif","assets/images/animated/PeterPan.gif","assets/images/animated/LadyTramp.gif","assets/images/animated/Mulan.gif"],
            intSeconds: 20,
        },
        {
            strId: "Disney02",
            strQuestion: "This is the last Disney animated film to use pure hand drawn animation",
            arRightAnswers: ["Winnie the Pooh"],
            arRightAnswersInfo: ["Though <span style='color:brown;font-weight:bold'>Winnie the Pooh</span> is the last Disney animated film to use pure hand drawn animation, some later films like Moana (2016) do use brief scenes of Traditional Animation."],
            arWrongAnswers: ["Mulan","Princess and the Frog","The Emperor’s New Groove","Treasure Planet","Lilo & Stitch"],
            imgQuestion: "assets/images/HandDrawing.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/WinniePooh.gif"],
            arImgWrongAnswers: ["assets/images/animated/WinniePooh.gif"],
            intSeconds: 20,
        },
        {
            strId: "Aladdin01",
            strQuestion: "What famous person served as the base for Disney's character Aladdin?",
            arRightAnswers: ["Tom Cruise","MC Hammer"],
            arRightAnswersInfo: ["Aladdin's appearance was modeled after <span style='color:brown;font-weight:bold'>Tom Cruise</span>. His movements were modeled after <span style='color:brown;font-weight:bold'>MC Hammer</span>."],
            arWrongAnswers: ["Michael J Fox","Mark Harmon","Steve Carell","Dustin Hoffman"],
            imgQuestion: "assets/images/Aladdin.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/TomCruise.gif","assets/images/animated/MCHammer.gif"],
            arImgWrongAnswers: ["assets/images/animated/TomCruise.gif","assets/images/animated/MCHammer.gif"],
            intSeconds: 20,
        },
        {
            strId: "Lilo01",
            strQuestion: "The actress that plays Lilo's voice in Lilo & Stitch also stars in this other movie.",
            arRightAnswers: ["The Ring"],
            arRightAnswersInfo: ["Daveigh Elizabeth Chase-Schwallier won the lead role as the voice of Lilo Pelekai. In 2002, Chase starred in the role of <span style='color:brown;font-weight:bold'>Samara Morgan</span> in the feature film, <span style='color:brown;font-weight:bold'>The Ring</span>."],
            arWrongAnswers: ["The Room","Inside Out","Taken","The Imaginarium of Dr. Paranssus"],
            imgQuestion: "assets/images/LiloStitch.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/TheRing.gif"],
            arImgWrongAnswers: ["assets/images/animated/TheRing.gif"],
            intSeconds: 20,
        },
        {
            strId: "PrincessFrog01",
            strQuestion: "After the release of this film, several children were hospitalized.",
            arRightAnswers: ["The Princess and The Frog"],
            arRightAnswersInfo: ["Over 50 children were hospitalized with salmonella after the release of <span style='color:brown;font-weight:bold'>The Princess and the Frog</span>. They all became ill after kissing frogs."],
            arWrongAnswers: ["The Incredibles","Cars","Big Hero Six","Kung Fu Panda"],
            imgQuestion: "assets/images/Hospital.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/PrincessFrog.gif"],
            arImgWrongAnswers: ["assets/images/animated/PrincessFrog.gif"],
            intSeconds: 20,
        },
        {
            strId: "Fantasia01",
            strQuestion: "This was the first american film without credits.",
            arRightAnswers: ["Fantasia"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>Fantasia</span> was the first American film to be released with no credits at all shown on-screen except for the intermission title card, not even the customary 'Walt Disney presents'."],
            arWrongAnswers: ["Steamboat Willie","The Three Caballeros","The Reluctant Dragon","Make Mine Music"],
            imgQuestion: "assets/images/MovieSet.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Fantasia_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/Fantasia_03.gif"],
            intSeconds: 20,
        },
        {
            strId: "SnowWhite01",
            strQuestion: "What was the highest grossing animated film of all time?",
            arRightAnswers: ["Snow White and the Seven Dwarfs"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>Snow White and the Seven Dwarfs</span> was the 10th highest grossing film of all time in the US, the highest among films not nominated at the Academy Awards, and the highest from any animated film... if adjusted for inflation."],
            arWrongAnswers: ["Toy Story","WALL-E","Cars","The Nightmare Before Christmas","Dumbo","The Little Mermaid"],
            imgQuestion: "assets/images/Cash.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/SnowWhite_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/SnowWhite_02.gif"],
            intSeconds: 20,
        },
        {
            strId: "Shrek01",
            strQuestion: "During the making of Shrek, what activity did the effects department engage in?",
            arRightAnswers: ["Mud showers"],
            arRightAnswersInfo: ["Shrek showering in mud was one of the hardest things to animate in the movie. The effects department actually took <span style='color:brown;font-weight:bold'>mud showers</span> to study how to portray them in the film."],
            arWrongAnswers: ["Lucha Libre","Making balloon animals","Wearing fat suits","Carry torches and pitchforks"],
            imgQuestion: "assets/images/Shrek.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/ShrekMud.gif"],
            arImgWrongAnswers: ["assets/images/animated/ShrekMud.gif"],
            intSeconds: 20,
        },
        {
            strId: "IceAge01",
            strQuestion: "The children of the animators were invited to incorporate their own drawings for the making of this film.",
            arRightAnswers: ["Ice Age"],
            arRightAnswersInfo: ["The drawings of characters during the end credit roll of <span style='color:brown;font-weight:bold'>Ice Age</span> were all done by the animators' kids. The same is true of the picture that Sid draws of himself on a cave wall."],
            arWrongAnswers: ["Meet the Robbinsons","Robots","Toy Story","Madagascar"],
            imgQuestion: "assets/images/KidsDrawings.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/IceAgeCredits.jpg"],
            arImgWrongAnswers: ["assets/images/IceAgeCredits.jpg"],
            intSeconds: 20,
        },
        {
            strId: "IceAge02",
            strQuestion: "A prehistoric extinct animal was named in honor of this Ice Age character.",
            arRightAnswers: ["Scrat"],
            arRightAnswersInfo: ["In 2009, scientists in Argentina unearthed the remains of a small mammal resembling a shrew with long fangs. This animal was named 'Cronopio Dentiacutus', in tribute to <span style='color:brown;font-weight:bold'>Scrat</span>."],
            arWrongAnswers: ["Manny","Sid","Diego","Roshan","Zeke"],
            imgQuestion: "assets/images/IceAge.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/IceAge_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/IceAge_05.gif"],
            intSeconds: 20,
        },
        {
            strId: "IceAge03",
            strQuestion: "In the feature film, Ice Age, how many nicknames does Manny the mammoth have?",
            arRightAnswers: ["5"],
            arRightAnswersInfo: ["In the movie, Manny is referred to as that neeny weeny mammoth, Manny the Moody Mammoth, Manny the Melancholy, Jumbo, and Fat Hair Boy. <span style='color:brown;font-weight:bold'>5 nicknames</span> in total."],
            arWrongAnswers: ["2","3","7"],
            imgQuestion: "assets/images/IceAge.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/IceAge_03.gif"],
            arImgWrongAnswers: ["assets/images/animated/IceAge_02.gif"],
            intSeconds: 20,
        },
        {
            strId: "KFPanda01",
            strQuestion: "What is the first Dreamworks movie to be released in IMAX?",
            arRightAnswers: ["Kung Fu Panda"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>Kung Fu Panda</span> was the first DreamWorks Animation film to be released in IMAX. The animators took a six-hour kung fu class to get an idea of the film's action."],
            arWrongAnswers: ["Antz","Shrek","Madagascar","Bee Movie","Monsters VS Aliens"],
            imgQuestion: "assets/images/Dreamworks.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/KungFuPanda_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/KungFuPanda_01.gif"],
            intSeconds: 20,
        },
        {
            strId: "KFPanda02",
            strQuestion: "In Kung Fu Panda, the main character 'Po' was named after which popular martial arts feature?",
            arRightAnswers: ["Kung Fu"],
            arRightAnswersInfo: ["The name of 'Po' was chosen as an homage to the television series, <span style='color:brown;font-weight:bold'>Kung Fu</span> (1972), and the blind Master Po, as played by Keye Luke."],
            arWrongAnswers: ["Fist of Fury","Enter the Dragon","The Master","Double Dragon"],
            imgQuestion: "assets/images/KungFuPanda.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/KungFuPanda_02.gif"],
            arImgWrongAnswers: ["assets/images/animated/KungFuPanda_02.gif"],
            intSeconds: 20,
        },
        {
            strId: "LegoMovie01",
            strQuestion: "What was the first animated film starring Morgan Freeman?",
            arRightAnswers: ["The Lego Movie"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>The Lego Movie</span> is the first animated film for Morgan Freeman."],
            arWrongAnswers: ["Shark Slayer","Antz","Shrek","Madagascar","Bee Movie"],
            imgQuestion: "assets/images/MorganFreeman.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/LegoMovie_02.gif"],
            arImgWrongAnswers: ["assets/images/animated/LegoMovie_01.gif"],
            intSeconds: 20,
        },
        {
            strId: "LittleMermaid01",
            strQuestion: "According to Greek mythology, who is Ariel's uncle?",
            arRightAnswers: ["Hercules"],
            arRightAnswersInfo: ["Ariel is the daughter of Triton, who is the son of Poseidon. Poseidon is the brother of Zeus, who is father to <span style='color:brown;font-weight:bold'>Hercules</span>. That makes him Ariel's uncle."],
            arWrongAnswers: ["Triton","Poseidon","Ares","Atlantean"],
            imgQuestion: "assets/images/LittleMermaid.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Hercules_02.gif"],
            arImgWrongAnswers: ["assets/images/animated/Hercules_02.gif"],
            intSeconds: 20,
        },
        {
            strId: "Madagascar01",
            strQuestion: "In Madagascar, the lemurs hold court inside an airplane. Who did the airplane belong to?",
            arRightAnswers: ["Amelia Earhart"],
            arRightAnswersInfo: ["The airplane that the Lemurs hold court in is a Lockheed Electra, the same airplane <span style='color:brown;font-weight:bold'>Amelia Earhart</span> disappeared in, on July 2, 1937."],
            arWrongAnswers: ["Howard Hughes","Noel Wien","Robert A. Hoover","Erich Hartmann"],
            imgQuestion: "assets/images/Madagascar.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Madagascar_02.gif"],
            arImgWrongAnswers: ["assets/images/animated/Madagascar_02.gif"],
            intSeconds: 20,
        },
        {
            strId: "Madagascar02",
            strQuestion: "The penguins of Madagascar were originally designed to star in another project based on...",
            arRightAnswers: ["A Rock Band"],
            arRightAnswersInfo: ["The penguins originated from a film the director, Eric Darnell, was developing, called 'Rockumentary'. It was about The Beatles-like <span style='color:brown;font-weight:bold'>rock quartet</span>; however, the project was cancelled."],
            arWrongAnswers: ["The A-Team","The Beegees","World War II","The Three Musketeers"],
            imgQuestion: "assets/images/Madagascar.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Madagascar_03.gif"],
            arImgWrongAnswers: ["assets/images/animated/Madagascar_03.gif"],
            intSeconds: 20,
        },
        {
            strId: "IsleDogs01",
            strQuestion: "This is director Wes Andreson's second stop-motion film.",
            arRightAnswers: ["Isle of Dogs"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>Isle of Dogs</span> was director Wes Anderson's second stop-motion film."],
            arWrongAnswers: ["The Fantastic Mr. Fox","Antz","The Jungle Book"],
            imgQuestion: "assets/images/WesAnderson.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/IsleOfDogs_03.gif"],
            arImgWrongAnswers: ["assets/images/animated/IsleOfDogs_02.gif"],
            intSeconds: 20,
        },
        {
            strId: "IsleDogs02",
            strQuestion: "How many still photographs were taken for Isle of Dog's production?",
            arRightAnswers: ["130 thousand"],
            arRightAnswersInfo: ["The movie was filmed with a team of 670 people who did <span style='color:brown;font-weight:bold'>130,000</span> still photographs. Most of this team worked previously in Fantastic Mr. Fox."],
            arWrongAnswers: ["50 thousand","more than 200 thousand","90 thousand"],
            imgQuestion: "assets/images/IsleOfDogs.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/IsleOfDogs_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/IsleOfDogs_02.gif"],
            intSeconds: 20,
        },
        {
            strId: "Coraline01",
            strQuestion: "This is the first animated stop-motion film to be shot entirely in 3D.",
            arRightAnswers: ["Coraline"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>Coraline</span> is the first stop-motion animated feature to be shot entirely in 3D. It also marks the first time that a stop-motion morphing sequence has ever been accomplished."],
            arWrongAnswers: ["Isle of Dogs","Corpse Bride","Frankenwennie","Paranorman"],
            imgQuestion: "assets/images/3D.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Coraline_03.gif"],
            arImgWrongAnswers: ["assets/images/animated/Coraline_03.gif"],
            intSeconds: 20,
        },
        {
            strId: "Coraline02",
            strQuestion: "Which character from the feature film Coraline is not in the original novel?",
            arRightAnswers: ["Wybie"],
            arRightAnswersInfo: ["The character <span style='color:brown;font-weight:bold'>Wybie Lovat</span> is not in Neil Gaiman's novel. He was created so Coraline wouldn't have to talk to herself."],
            arWrongAnswers: ["Mr. Bobinsky","April","Miriam","Mrs. Lovat"],
            imgQuestion: "assets/images/Coraline.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Coraline_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/Coraline_01.gif"],
            intSeconds: 20,
        },
        {
            strId: "Coraline03",
            strQuestion: "Besides Coraline, there is just one more stop-motion animated film to break the 1 hour and 40 minutes duration record.",
            arRightAnswers: ["Kubo and the Two Strings"],
            arRightAnswersInfo: ["Coraline was the longest stop-motion film, until <span style='color:brown;font-weight:bold>Kubo and the Two Strings</span> (2016). Both films were made by Laika."],
            arWrongAnswers: ["The Nightmare Before Christmas","Isle of Dogs","Corpse Bride","Chicken Run"],
            imgQuestion: "assets/images/Coraline.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/Kubo_02.gif"],
            arImgWrongAnswers: ["assets/images/animated/Kubo_01.gif"],
            intSeconds: 20,
        },
        {
            strId: "FinalFantasy01",
            strQuestion: "This is the first ever CGI film with photo-realistic characters.",
            arRightAnswers: ["Final Fantasy: The Spirits Within"],
            arRightAnswersInfo: ["<span style='color:brown;font-weight:bold'>Final Fantasy: The Spirits Within</span> (2001) was the first computer-generated animated motion picture with photo-realistic characters. All backgrounds are hand painted."],
            arWrongAnswers: ["WALL-E","The Animatrix","Avatar","The Jungle Book (2016)"],
            imgQuestion: "assets/images/PlaceHolder.jpg",
            strImgPosition: "top",
            arImgRightAnswers: ["assets/images/animated/FinalFantasy_01.gif"],
            arImgWrongAnswers: ["assets/images/animated/FinalFantasy_01.gif"],
            intSeconds: 20,
        },
    ],

// METHODS_________________________________________________________________________

// General utility methods. For array manipulation--------------------------------------------------
    mFindObject: function(array = [],property = "", value){ //Uses find method to return first object from [array] to match [property] == [value] condition
        var returnObject = array.find(function(object){
            if(object[property] !== undefined) return object[property] == value;
        });
        return returnObject;
    },

    mReduceArray: function(array = [], elements = 0){//Removes random elements from the [array] until a maximum of [elements] remain
        var tempArray = array;
        var loopMax = array.length;
        if (loopMax > elements){ //Checks wether the array has more elements than [elements]
            for (var i = elements; i < loopMax; i++ ){
                var tempint = tempArray.length;
                tempArray.splice(Math.floor(Math.random()*tempint),1); //Removes a random element from the array
            }
        }
        return tempArray; //Return the copied array with a legth of [elements]
    },

    mShuffleArray: function(array = new Array){ // Switches the indexes of elements inside an array randomly
        var newPosition = 0;
        for (var i=0; i < array.length; i++){
            newPosition = Math.floor(Math.random()*array.length);
            var newElement = array[newPosition];
            array[newPosition] = array[i];
            array[i] = newElement;
        }
        return array;
    },

// Quiz flow methods. Those that control each phase of the quiz ---------------------------------------------------

    mQuizStart: function(questions = 0){ // Sets initial conditions
    //Jump the window view to the question area
        this.intQuestions = questions;
        if (navigator.userAgent.match(/Chrome|AppleWebKit/)) window.location.href = "#"+this.strQuestionSectionID; 
        else window.location.hash = this.strQuestionSectionID;
        var quiz = this;
        if (this.arTimers.length>0){
            console.log(this.arTimers);
            for (var i = 0; i < this.arTimers.length; i++){
                clearInterval(quiz.arTimers[i]);
                clearTimeout(quiz.arTimers[i]);
            }
            this.arTimers = [];
        }
        if (this.EasterEgg){
            this.mEasterEgg();
        }
        else{
        // Fills a list of questions to answer
            if (this.arOrderedQuestions.length > 0 && this.boolOrderedQuestions) { // Fills the quiz questions array with thee provided ordered list
                for (var i = 0; i < this.arOrderedQuestions.length; i++){
                    if (i <= questions){ // Only fills the selected number of questions
                        var question = this.mFindObject(this.arQuestions,"strId",this.arOrderedQuestions[i]);
                        this.arQuizQuestions.push(question);
                    }
                }
            }
            else{ // Chooses random questions from the master collection
                $.extend(quiz.arQuizQuestions,quiz.arQuestions);
                this.arQuizQuestions = this.mReduceArray(quiz.arQuizQuestions,questions);
                this.arQuizQuestions = this.mShuffleArray(this.arQuizQuestions);
            }
            this.intCurrentQuestion = 0; // Sets question index to 0.
            this.intStreakScore = 0;
            this.intScore = 0;
            this.mDisplayScores(this.intScore,this.intStreakScore); // Resets score.
            this.mQuizRunQuestion(this.intCurrentQuestion); // Runs the quiz, starting from question index 0.
        }
    },
    
    mQuizRunQuestion:function(questionIndex = 0){ // Sets the question display, buttons, and timer.
        var quiz = this;
        var questionObject = this.arQuizQuestions[questionIndex];
        this.mDisplayQuestion(questionObject); // Creates the question display (image and text)
    // Digital clock:
        var seconds = questionObject.intSeconds;
        quiz.mDisplayDigitalClock(rowDivClock,seconds);
        var countdown = setInterval(
            function(){
                if (seconds <= 0){
                    var tempint = quiz.arTimers.indexOf(countdown);
                    quiz.arTimers.splice(tempint,1);
                    clearInterval(countdown);
                    quiz.mDisplayDigitalClock(rowDivClock,seconds);
                    var iconClassWrong = quiz.strChoiceWrongIcon;
                    $("i[udanswer]").removeClass();
                    $("i[udanswer]").addClass(iconClassWrong);
                    quiz.mDisplayOptionIcons(questionObject);
                    quiz.mQuizWrongAnswer(questionObject,"",seconds);
                }
                else {
                    seconds--;
                    quiz.mDisplayDigitalClock(rowDivClock,seconds);
                }
            },
        1000);
        this.arTimers.push(countdown);
    // Options buttons:
        var arQuestionOptions = new Array; // An array of possible options
        for (var i = 0; i < this.intRightOptions; i++){ // Fill array with right answers (up to a maximum of intOptions)
            // Create a temporary array with the possible right answers and shuffle it to avoid always placing the answers in order.
            var tempArray = new Array;
            $.extend(tempArray,questionObject.arRightAnswers);
            this.mShuffleArray(tempArray);
            // Pushes specified right answers into the options array:
            if (tempArray[i] !== undefined && i <= this.intOptions) arQuestionOptions.push(tempArray[i]);
        }
        var remainingOptions = this.intOptions - arQuestionOptions.length;
        if (remainingOptions > 0){ // Fill array with wrong answers (if there's space remaining in the array)
            for (var i = 0; i < remainingOptions; i++){
                arQuestionOptions.push(questionObject.arWrongAnswers[i]);
            }
        }
        arQuestionOptions = this.mShuffleArray(arQuestionOptions); // Shuffle the options array
        rowDivOptions.empty(); // Empties the options section
        for (var i = 0; i < arQuestionOptions.length; i++){ // Creates buttons
            this.mDisplayOptionButton(rowDivOptions,arQuestionOptions[i]);
        }
        //On-click events for options buttons
        $("button[udtype=optionBtn]").on("click",function(){
            var tempint = quiz.arTimers.indexOf(countdown);
            quiz.arTimers.splice(tempint,1);
            clearInterval(countdown);
            var btn = $(this);
            var answer = btn.attr("udanswer");
            if (questionObject.arRightAnswers.includes(answer)) quiz.mQuizRightAnswer(questionObject,answer,seconds);
            else quiz.mQuizWrongAnswer(questionObject,answer,seconds);
            $("button[udtype=optionBtn]").attr("disabled",""); //Disables buttons to avoid further clicking
            $("button[udtype=optionBtn]").off(); //Disables buttons to avoid further clicking
        // Update the display by highlighting the right answer
            var iconClassWrong = quiz.strChoiceWrongIcon;
            $("i[udanswer]").removeClass(); 
            $("i[udanswer]").addClass(iconClassWrong);
            quiz.mDisplayOptionIcons(questionObject);
        });
    },
    
    mQuizRightAnswer:function(questionObject = new Object,answer = "",remainingSeconds = 0){
        var quiz = this;
    // Adjust score
        if (this.boolTimeScore){
            var finalScore = this.intScore + Math.floor(remainingSeconds*(1 + this.floatStreakScoreMult*this.intStreakScore));
            quiz.mAnimateScore(finalScore,remainingSeconds); // Animates increasing score by seconds at 10x speed
            var countScore = setInterval(
                function(){ // Animate countdown reducing at 10x speed
                    if (remainingSeconds <= 0) {
                        var tempint = quiz.arTimers.indexOf(countScore);
                        quiz.arTimers.splice(tempint,1);
                        clearInterval(countScore);
                    }
                    else{
                        remainingSeconds--;
                        quiz.mDisplayDigitalClock(rowDivClock,remainingSeconds);
                    }
                },
            100);
            this.arTimers.push(countScore);
        }
        else {
            this.intScore++;
        }
        if (this.boolStreakScore) this.intStreakScore++; // Update streak score if enabled
        this.mDisplayScores(this.intScore,this.intStreakScore); // Update scores display
    // Display aditional info
        this.mDisplayInfo(questionObject,answer,"right",Math.round(remainingSeconds/10));
    },
    
    mQuizWrongAnswer:function(questionObject = new Object,answer = "",remainingSeconds = 0){
        if (this.boolStreakScore) this.intStreakScore = 0; // Resets streak score if enabled
        this.mDisplayScores(this.intScore,this.intStreakScore); // Update scores display
        this.mDisplayDigitalClock(rowDivClock,0,"off"); // Shows digital clock "off"
        if(remainingSeconds == 0) {
            this.mDisplayInfo(questionObject,answer,"timeup",0); // Display aditional info
        }
        else {
            this.mDisplayInfo(questionObject,answer,"wrong",0); // Display aditional info
        }
    },
    
    mQuizFinish:function(){ // Runs when there are no more questions
        rowDivClock.empty(); // Clears the digital clock display
        rowDivOptions.empty(); // Clears the option buttons
        colDivQuestion.empty(); // Clears the image and text display for the question
        var img = this.strQuizFinishImage;
        var txt = this.strQuizFinishScoreTxt;
        var txtStyle = this.strQuizFinishScoreTxtStyle;
        var score = this.intScore;
        var scoreStyle = this.strQuizFinishScoreStyle;
        var scoreBtnClass = this.strQuizFinishScoreBtnClass;
        var iconClassRestart = this.strQuizFinishRestartIconCLass;
        var divImg = $("<img>",{class:"card-img text-center",src:img});
        var divText = $("<p>",{style:txtStyle,text:txt});
        var divScore = $("<p>",{style:scoreStyle,text:score});
        colDivQuestion.append(divImg,divText,divScore);
        colDivQuestion.append($("<button>",{class:"btn mx-1 "+scoreBtnClass,text:" Restart",udbtnrestart:""}).prepend($("<i>",{class:iconClassRestart})));
        var quiz = this;
        var questions = this.intQuestions;
        var btnRestart = $("button[udbtnrestart]");
        btnRestart.on("click",function(){
            quiz.mQuizStart(questions);
        });
    },

// Display methods. Those that modify the UI--------------------------------------------------------------

    mDisplayQuestion: function(questionObject = new Object){ // Updates display with current question information
    // Image image and text:
        colDivQuestion.empty(); // Clears the image and text display for the question
        var img = questionObject.imgQuestion;
        var text = questionObject.strQuestion;
        if (questionObject.strImgPosition !== "top" && questionObject.strImgPosition !== "bottom") var imgPosition = "top";
        else var imgPosition = questionObject.strImgPosition;
        var imgClass = this.strQuestionImgClass;
        var txtClass = this.strQuestionTxtClass;
        var divImg = $("<img>",{class:"card-img-"+imgPosition+" "+imgClass,src:img});
        var divText = $("<p>",{class:txtClass,text:text});
        if (imgPosition = "bottom") colDivQuestion.append(divText,divImg);
        else colDivQuestion.append(divImg,divText);
    },
    
    mDisplayOptionButton:function(HtmlElement,option = ""){ // Creates an option button
        var quiz = this;
        var optionButton = $("<div>",{class:"col-12"}).append(
            $("<button>",{class:"btn "+quiz.strOptionsClass,text:" "+option,udType:'optionBtn',udAnswer:option}).prepend(
                $("<i>",{class:quiz.strChoiceIcon+" udOptionIcon",udAnswer:option})
            )
        );
        HtmlElement.append(optionButton);
    },
    
    mDisplayOptionIcons:function(questionObject = new Object){ // Updates options' colors and icons to highlight correct answer
        for(var i = 0; i < questionObject.arRightAnswers.length;i++){
            var rightAnswer = questionObject.arRightAnswers[i];
            var iconClassRight = this.strChoiceRightIcon;
            var btnClassDefault = this.strOptionsClass;
            var btnClassRight = this.strOptionsRightClass;
            $("button[udtype=optionBtn][udanswer='"+rightAnswer+"']").removeClass(btnClassDefault);
            $("button[udtype=optionBtn][udanswer='"+rightAnswer+"']").addClass(btnClassRight);
            $("i[udanswer='"+rightAnswer+"']").removeClass();
            $("i[udanswer='"+rightAnswer+"']").addClass(iconClassRight);
        }
    },
    
    mDisplayScores:function(score = 0, streak = 0){ // Updates the scores display.
        var txtScore = this.strScore;
        var txtStreak = this.strStreak;
        var classTitles = this.strScoresTitleClass;
        var classNumbers = this.strScoresNumberClass;
        colDivScore.empty();
        var scoreDivTitle = $("<div>",{class:classTitles,text:txtScore});
        var scoreDivNumber = $("<div>",{class:classNumbers,text:score,udId:"udScore"});
        colDivScore.append(scoreDivTitle,scoreDivNumber);
        if (this.boolStreakScore){ // If streak is enabled, update streak display.
            colDivStreak.empty();
            if (this.floatStreakScoreMult > 0) var streakNumberTxt = streak+" (x"+Math.floor(1+this.floatStreakScoreMult*streak)+")";
            var streakDivTitle = $("<div>",{class:classTitles,text:txtStreak});
            var streakDivNumber = $("<div>",{class:classNumbers,text:streakNumberTxt});
            colDivStreak.append(streakDivTitle,streakDivNumber);
        }
    },
    
    mDisplayInfo: function(questionObject = new Object, answer = "", choiceResult = "", remainingTime = 0){ // Updates display with correct answer information
        colDivQuestion.empty(); // Clears the image and text display for the question
        var quiz = this;
        var answerIndex = questionObject.arRightAnswers.indexOf(answer);
        var txtClass = this.strQuestionTxtClass;
        var divText = $("<p>",{class:txtClass});
        var imgStyle = this.strInfoImgStyle;
        if(choiceResult == "right") {
            if(questionObject.arImgRightAnswers[answerIndex] === undefined) var img = questionObject.arImgRightAnswers[0];
            else var img = questionObject.arImgRightAnswers[answerIndex];
            if (questionObject.arRightAnswersInfo[answerIndex] === undefined) var htmlInfo = quiz.strCorrect+" "+questionObject.arRightAnswersInfo[0];
            else var htmlInfo = quiz.strCorrect+" "+questionObject.arRightAnswersInfo[answerIndex];
        }
        else {
            var random = Math.floor(Math.random()* questionObject.arRightAnswers.length);
            var img = questionObject.arImgWrongAnswers[random];
            var leadtext = "";
            if (choiceResult == "timeup") leadtext = quiz.strTimeUp;
            if (choiceResult == "wrong") leadtext = quiz.strWrong;
            if (questionObject.arRightAnswersInfo[random] === undefined) var htmlInfo = leadtext+" "+questionObject.arRightAnswersInfo[0];
            else var htmlInfo = leadtext+" "+questionObject.arRightAnswersInfo[random];
        }
        var divImg = $("<img>",{class:"card-img text-center",style:imgStyle,src:img});
        divText.html(htmlInfo);
        colDivQuestion.append(divText,divImg);
        var wait = this.intWait*1000;
        var time = Math.max(remainingTime*100,wait);
        var timeout = setTimeout(function(){
            if(quiz.intCurrentQuestion+1 >= quiz.arQuizQuestions.length){
                quiz.mQuizFinish();
            }
            else {
                quiz.intCurrentQuestion++;
                quiz.mQuizRunQuestion(quiz.intCurrentQuestion);
            }
            var tempint = quiz.arTimers.indexOf(timeout);
            quiz.arTimers.splice(tempint,1);
            clearTimeout(timeout);
        },time);
        quiz.arTimers.push(timeout);
    },
    
    mAnimateScore:function(finalScore=0,seconds){ // Animates score going up depending on remaining seconds
        var quiz = this;
        var stepScore = (finalScore - quiz.intScore)/(seconds);
        var animateScore = setInterval(
            function(){
                if (quiz.intScore >= finalScore) {
                    var tempint = quiz.arTimers.indexOf(animateScore);
                    quiz.arTimers.splice(tempint,1);
                    clearInterval(animateScore);
                    quiz.intScore = finalScore;
                }
                else{
                    quiz.intScore += stepScore;
                    quiz.mDisplayScores(quiz.intScore,quiz.intStreakScore); // Update scores display
                }
            },
        100);
        this.arTimers.push(animateScore);
    },

    mDisplayDigitalClock: function(HtmlElement, seconds=0,mode = ""){ // Converts a given number of seconds into digits and updates the digital clock accordingly
        var minTen = Math.floor(Math.floor(seconds/60)/10);
        var minUnit = Math.floor(seconds/60)%10;
        var secTen = Math.floor((seconds%60)/10);
        var secUnit = (seconds%60)%10;
        var minTenImage = this.strClockPath+this.arClockImages[minTen];
        var minUnitImage = this.strClockPath+this.arClockImages[minUnit];
        var secTenImage = this.strClockPath+this.arClockImages[secTen];
        var secUnitImage = this.strClockPath+this.arClockImages[secUnit];
        var dotsOnImage = this.strClockPath+this.strClockDotsImage;
        var background = this.strClockPath+this.strClockBgImage;
        if (mode === "off"){
            minTenImage = this.strClockPath+this.strClockImageOff;
            minUnitImage = this.strClockPath+this.strClockImageOff;
            secTenImage = this.strClockPath+this.strClockImageOff;
            secUnitImage = this.strClockPath+this.strClockImageOff;
        }
        var minTenDiv = $("<div>",{class:"col-2",style:"background:url("+background+")"}).append(
            $("<img>",{src:minTenImage})
        );
        var minUnitDiv = $("<div>",{class:"col-2",style:"background:url("+background+")"}).append(
            $("<img>",{src:minUnitImage})
        );
        var secTenDiv = $("<div>",{class:"col-2",style:"background:url("+background+")"}).append(
            $("<img>",{src:secTenImage})
        );
        var secUnitDiv = $("<div>",{class:"col-2",style:"background:url("+background+")"}).append(
            $("<img>",{src:secUnitImage})
        );
        var dotsDiv = $("<div>",{class:"col-1",style:"background:url("+background+")"}).append(
            $("<img>",{src:dotsOnImage})
        );
        HtmlElement.empty();
        HtmlElement.append(minTenDiv,minUnitDiv,dotsDiv,secTenDiv,secUnitDiv);
    },

// Miscellaneous. The easter egg -------------------------------------------------------------------------

    mEasterEgg:function(){
        console.log("------Easter Egg------");
        rowDivClock.empty(); // Clears the digital clock display
        rowDivOptions.empty(); // Clears the option buttons
        colDivQuestion.empty(); // Clears the image and text display for the question
        colDivScore.addClass("d-none"); // Hides Scores
        colDivStreak.addClass("d-none");  // Hides Streaks
        var quiz = this;
    // Creates an array of all the questions gifs, then removes duplicates, finally, shuffles it.
        var gifArray = new Array;
        for (var i = 0; i < this.arQuestions.length; i++){
            for (var j = 0; j < this.arQuestions[i].arImgRightAnswers.length; j++){
                gifArray.push(this.arQuestions[i].arImgRightAnswers[j]);
            }
            for (var j = 0; j < this.arQuestions[i].arImgWrongAnswers.length; j++){
                gifArray.push(this.arQuestions[i].arImgWrongAnswers[j]);
            }
        }
        for (var i = 0; i < gifArray.length; i++){
            for (var j = i; j < gifArray.length; j++){
                if(gifArray[i]===gifArray[j]){
                    gifArray.splice(j,1);
                }
            }
        }
        this.mShuffleArray(gifArray);
    // Creates gif viewing area with first gif playing
        var maxGifIndex = gifArray.length-1;
        var currentGifIndex = 0;
        colDivQuestion.append($("<p>",{class:"text-center",style:"color:goldenrod;font-size:larger",text:"Enjoy!"}));
        colDivQuestion.append($("<button>",{class:"btn btn-outline-warning mx-1",udBtnEasterEggGo:"easterEgg",text:"GO"}));
        colDivQuestion.append($("<button>",{class:"btn btn-outline-danger mx-1",udBtnEasterEggStop:"easterEgg",text:"STOP"}));
        colDivQuestion.append($("<img>",{class:"card-img",style:"max-width:100%;height:auto",src:gifArray[currentGifIndex],alt:"Animated gif",udEasterEgg:"easterEgg"}));
        currentGifIndex++;
        var gifPlay = setInterval(function(){
            if (currentGifIndex >= maxGifIndex){
                currentGifIndex = 0;
                colDivQuestion.append($("<p>",{class:"text-center",style:"color:white;",text:"That was it! Go again? Or... reload page to play the trivia"}));
                var tempint = quiz.arTimers.indexOf(gifPlay);
                quiz.arTimers.splice(tempint,1);
                clearInterval(gifPlay);
            }
            else{
                $("img[udeasteregg]").remove();
                colDivQuestion.append($("<img>",{class:"card-img",style:"max-width:100%;height:auto",src:gifArray[currentGifIndex],alt:"Animated gif",udEasterEgg:"easterEgg"}));
                currentGifIndex++;
            }
        },3000);
        this.arTimers.push(gifPlay);
        $("button[udbtneastereggstop]").on("click",function(){ // Stops playback (in case they want to download the gif)
            var tempint = quiz.arTimers.indexOf(gifPlay);
            quiz.arTimers.splice(tempint,1);
            clearInterval(gifPlay);
        });
        $("button[udbtneasteregggo]").on("click",function(){ // Begins playback of all gifs. 5s per gif.
            var tempint = quiz.arTimers.indexOf(gifPlay);
            quiz.arTimers.splice(tempint,1);
            clearInterval(gifPlay);
            gifPlay = setInterval(function(){
                if (currentGifIndex >= maxGifIndex){
                    currentGifIndex = 0;
                    colDivQuestion.append($("<p>",{class:"text-center",style:"color:white;",text:"That was it! Go again? Or... reload page to play the trivia"}));
                    clearInterval(gifPlay);
                }
                else{
                    $("img[udeasteregg]").remove();
                    colDivQuestion.append($("<img>",{class:"card-img",style:"max-width:100%;height:auto",src:gifArray[currentGifIndex],alt:"Animated gif",udEasterEgg:"easterEgg"}));
                    currentGifIndex++;
                }
            },3000);
            quiz.arTimers.push(gifPlay);
        });
    }

}
