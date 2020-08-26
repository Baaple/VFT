/**
 * jspsych-survey-text
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 * edited by Becky Gilbert to autofocus into the first response box
 * also added the option to make each question required
 * this version is compatible with jsPsych v 6.0.5
 *
 */

jsPsych.plugins['survey-text-autofocus'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'survey-text-autofocus',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        default: undefined,
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Prompt for the subject to response'
          },
          value: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Value',
            default: '',
            description: 'The string will be used to populate the response field with editable answer.'
          },
          rows: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Rows',
            default: 1,
            description: 'The number of rows for the response text box.'
          },
          columns: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Columns',
            default: 40,
            description: 'The number of columns for the response text box.'
          },
          required: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Required',
            default: false,
            description: 'Subject will be required to enter a value for the question.'
          },
        }
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: '',
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Next',
        description: 'The text that appears on the button to finish the trial.'
      }
    }
  };

  plugin.trial = function(display_element, trial) {

    // set default values
    trial.preamble = typeof trial.preamble == 'undefined' ? plugin.info.parameters.preamble.default : trial.preamble;
    trial.button_label = typeof trial.button_label === 'undefined' ? plugin.info.parameters.button_label.default : trial.button_label;

    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].rows == 'undefined') {
        trial.questions[i].rows = plugin.info.parameters.questions.nested.rows.default;
      }
      if (typeof trial.questions[i].columns == 'undefined') {
        trial.questions[i].columns = plugin.info.parameters.questions.nested.columns.default;
      }
      if (typeof trial.questions[i].value == 'undefined') {
        trial.questions[i].value = plugin.info.parameters.questions.nested.value.default;
      }
      if (typeof trial.questions[i].required == 'undefined') {
        trial.questions[i].required = plugin.info.parameters.questions.nested.required.default;
      }
    }

    // add form element (so that the required attibute works for input/textarea)
    var html = '<form id="jspsych-survey-text-autofocus-form">';

    // show preamble text
    html += '<div id="jspsych-survey-text-preamble" class="jspsych-survey-text-preamble">'+trial.preamble+'</div>';

    // add questions
    for (var i = 0; i < trial.questions.length; i++) {
      var autofocus = i === 0 ? "autofocus" : "";
      var required = (trial.questions[i].required) ? "required" : "";
      html += '<div id="jspsych-survey-text-"' + i + '" class="jspsych-survey-text-question" style="margin: 2em 0em;">';
      html += '<p class="jspsych-survey-text">' + trial.questions[i].prompt + '</p>';
      if (trial.questions[i].rows == 1) {
        html += '<input ' + autofocus + ' type="text" name="#jspsych-survey-text-response-' + i + '" size="' + trial.questions[i].columns + '" ' + required + ' >' + trial.questions[i].value + '</input>';
      } else {
        html += '<textarea ' + autofocus + ' name="#jspsych-survey-text-response-' + i + '" cols="' + trial.questions[i].columns + '" rows="' + trial.questions[i].rows + '" ' + required + ' >' + trial.questions[i].value + '</textarea>';
      }
      html += '</div>';
    }

    // add submit button
    html += '<input type="submit" id="jspsych-survey-text-next" class="jspsych-btn jspsych-survey-text" value="' + trial.button_label + '"></input></form>';

    display_element.innerHTML = html;

    display_element.querySelector('#jspsych-survey-text-autofocus-form').addEventListener('submit', function(event) {

      event.preventDefault();

      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      var matches = display_element.querySelectorAll('div.jspsych-survey-text-question');
      for(var index=0; index<matches.length; index++){
        var id = "Q" + index;
        var val = matches[index].querySelector('textarea, input').value;
        var obje = {};
        obje[id] = val;
        Object.assign(question_data, obje);
      }
      // save data
      var trialdata = {
        "rt": response_time,
        "responses": JSON.stringify(question_data)
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
