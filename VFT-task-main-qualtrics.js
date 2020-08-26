var task_github = "https://baaple.github.io/VFT/";

// requiredResources must include all the JS files that the VFT task uses.
var requiredResources = [
    task_github + "jspsych-6/jspsych.js",
    task_github + "jspsych-6/plugins/jspsych-html-keyboard-response.js",
	task_github + "jspsych-6/plugins/jspsych-image-audio-response_new.js",
    task_github + "rt-task_main.js"
];

function loadScript(idx) {
    console.log("Loading ", requiredResources[idx]);
    jQuery.getScript(requiredResources[idx], function () {
        if ((idx + 1) < requiredResources.length) {
            loadScript(idx + 1);
        } else {
            initExp();
        }
    });
}

if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
    loadScript(0);
}

// Retrieve Qualtrics object and save in qthis
var qthis = this;

// Hide buttons
qthis.hideNextButton();

// define the site that hosts stimuli images
// usually https://<your-github-username>.github.io/<your-experiment-name>/
var repo_site = "https://baaple.github.io/VFT/";
 
 // Define variable with images to preload
  var images = [repo_site + 'img/F.png' , repo_site + 'img/animals.png']; 

  // Make participant's browser fullscreen
  var fullscreen = {
    type: 'fullscreen',
    fullscreen_mode: true
  }

    // define welcome/letter trial message 
    var instructions_letter = {
      type: "html-keyboard-response",
      stimulus: "<p><strong>Verbal Fluency Task</strong></p><p>In this task, you will be given a <strong>letter</strong> of the alphabet.</p><p>Your job is to come up with <strong>as many words as you can think of</strong> in 1 minute that begin with that letter.<br>For instance, if you were given the letter 'c' valid answers could include 'cat,' 'calm,' calculate' etc.</p><p>You may only use each word once. You are not allowed to use proper nouns like names of people or places.<br>In addition, words that have the same root (e.g., 'random,' 'randomize' etc.) may only be used once.</p><p>When you proceed to the next screen, you will be shown a letter and may begin speaking out loud, as your computer will record your voice.<br>When 1 minute is up, the screen will end.</p><p><strong>Please speak loud and clear.</strong></p><p>Press the '<strong>s</strong>' key when you are ready to begin.</p>" ,
      choices: ['s'] 
    };

    // define category trial message 
    var instructions_category = {
      type: "html-keyboard-response",
      stimulus: "<p><strong>Verbal Fluency Task</strong></p><p>Great job! In the second part of this task, you will be given a <strong>category</strong>.</p><p>Your job is to come up with <strong>as many items as you can think of</strong> that fall into that category within 1 minute.<br>For instance, if you were given the category 'food' valid answers could include 'pizza,' 'banana,' chocolate' etc. </p><p>You may only use each item once, and they may begin with any letter.</p><p>When you proceed to the next screen, you will be shown a category and may begin speaking out loud, as your computer will record your voice.<br>When 1 minute is up, the screen will end.</p><p><strong>Please speak loud and clear.</strong></p><p>Press the '<strong>q</strong>' key when you are ready to begin.</p>" ,
      choices: ['q'] 
    };

    // Define letter trial
    var letter_trial = {
        type: "image-audio-response_new" ,
        stimulus: repo_site + 'img/F.png' ,
        buffer_length: 60000 ,
        allow_playback: false ,
        prompt: "<p><strong>Recording</strong>: speak now</p>" ,
        wait_for_mic_approval: true 
    }

     // Define category trial
     var category_trial = {
        type: "image-audio-response_new" ,
        stimulus: repo_site + "img/animals.png" ,
        buffer_length: 60000 ,
        allow_playback: false ,
        prompt: "<p><strong>Recording</strong>: speak now</p>" ,
        wait_for_mic_approval: true 
     }