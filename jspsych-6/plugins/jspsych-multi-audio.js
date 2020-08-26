/**
 * jspsych-multi-audio
 * Becky Gilbert, July 2019
 *
 * plugin for playing a set of audio stimuli
 *
 * adapted from jspsych-multi-stim-multi-response by Josh de Leeuw
 *
 **/


jsPsych.plugins["multi-audio"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('multi-audio', 'stimuli', 'audio');

  plugin.info = {
    name: 'multi-audio',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Stimuli',
        default: undefined,
        array: true,
        description: 'Array of audio files to be played.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: "",
        description: 'Any content here will be displayed on the screen.'
      },
      gap_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Gap duration',
        default: 0,
        array: false,
        description: 'Duration of the silent gap between stimuli.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long before trial ends.'
      },
      trial_ends_after_audio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Trial ends after audio',
        default: false,
        description: 'If true, then the trial will end as soon as the last audio file finishes playing.'
      },
      timing_post_trial: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Timing post trial',
        default: 0,
        description: 'How long to wait after this trial ends before starting the next one.'
      },
    }
  };

  plugin.trial = function(display_element, trial) {

    // default parameters
    trial.gap_duration = trial.gap_duration || plugin.info.parameters.gap_duration.default; 
    trial.trial_duration = trial.trial_duration || plugin.info.parameters.trial_duration.default; 
    trial.trial_ends_after_audio = trial.trial_ends_after_audio || plugin.info.parameters.trial_ends_after_audio.default;
    trial.timing_post_trial = (typeof trial.timing_post_trial === 'undefined') ? plugin.info.parameters.timing_post_trial.default : trial.timing_post_trial;
    trial.prompt = (typeof trial.prompt === 'undefined') ? plugin.info.parameters.prompt.default : trial.prompt;

    var audio_count = 0;
    var audio_start_times = [];
    var audio_end_times = [];
    var audio_durations = [];
    
    // get audio method
    var source, audio, method;
    var context = jsPsych.pluginAPI.audioContext();
    if (context !== null) {
      method = "web_audio";
    } else {
      method = "html_audio";
    }

    var html = '<div id="prompt">';
    //show prompt
    if (trial.prompt !== null) {
      html += trial.prompt;
    }
    html += '</div>';

    display_element.innerHTML = html;

    // function to end trial when it is time
    var end_trial = function() {

      // stop the audio file if it is playing
      // remove end event listeners if they exist
      if (context !== null) {
        source.stop();
        source.onended = function() { };
      } else {
        audio.pause();
        audio.removeEventListener('ended', end_trial);
      }

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "stimuli": JSON.stringify(trial.stimuli),
        "timing_post_trial": trial.timing_post_trial
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);

    };

    // create the audio onended function (helper function)
    function create_onended_fn(is_last_stim) {
      var onended_fn;
      if (!is_last_stim) {
        onended_fn = function() {
          setTimeout(play_next, trial.gap_duration);
        };
      } else {
        onended_fn = function() {
          setTimeout(end_trial, trial.gap_duration);
        };
      }
      return onended_fn; 
    }

    // function to start next audio
    function play_next() {
      
      // is this the last of the audio choices?
      var is_last_stim = false;
      if (audio_count+1 >= trial.stimuli.length) {
        is_last_stim = true;
      }
      // create the on_ended function for this stim
      var curr_onended_fn = create_onended_fn(is_last_stim);

      // set up and play next audio
      if (method == "web_audio") {
        source = context.createBufferSource();
        source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.stimuli[audio_count]);
        source.connect(context.destination);
        source.onended = curr_onended_fn;
        startTime = context.currentTime;
        source.start(startTime);
      } else { // HTML audio
        audio = jsPsych.pluginAPI.getAudioBuffer(trial.stimuli[audio_count]);
        audio.currentTime = 0;
        audio.addEventListener('ended', curr_onended_fn);
        audio.play();
      }

      audio_count++;
    }

    // start time
    var start_time = Date.now();

    // start first audio
    play_next();

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();