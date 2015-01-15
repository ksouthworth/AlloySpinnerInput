// var AUTO_CLOSE_MILLIS = 500;
// var STYLES = {
//   controlsContainer: $.createStyle({classes: 'controlsContainer'}),
//   bigSpinner: $.createStyle({classes: 'bigSpinner'}),
//   topSpinner: $.createStyle({classes: 'bigSpinner topSpinner'}),
//   bottomSpinner: $.createStyle({classes: 'bigSpinner bottomSpinner'}),
//   spinnerWindow: $.createStyle({classes: 'spinnerWindow'}),
//   spinnerSeparator: $.createStyle({classes: 'spinnerSeparator'})
// };

var _spinnerStepValue = 1;

//-----------------------------
// Process args / styles
//-----------------------------
if(arguments[0]) {
  var args = arguments[0];

  if (args.id) {
    exports.id = args.id;
    delete args.id;
  }
  delete args.__itemTemplate;
  delete args['$model'];
  delete args.children;

  applyProperties(arguments[0]);

  if(args.value) {
    $.textField.value = args.value;
  }
  if(args.stepValue) {
    _spinnerStepValue = parseFloat(args.stepValue);
  }
}


/**
 * Apply TSS style properties to our widget
 *
 * @param  {[type]} properties [description]
 * @return {[type]}            [description]
 */
function applyProperties(properties) {
  properties = _.omit(properties, 'children');

  // Ti.API.debug('spinner ' + exports.id + ' -> applyProperties : ' + JSON.stringify(properties));

  $.view.applyProperties(properties);

  if(properties.color) {
    var commonProps = {
      color: properties.color
    };
    $.textField.applyProperties(commonProps);
  }
}

function onKeyboardDone(e) {
  //Ti.API.debug('spinner ' + exports.id + ' -> [keyboard done]');

  $.textField.blur();
}

function onSpinUp(e) {
  setValue(parseFloat($.textField.value) + _spinnerStepValue);
}

function onSpinDown(e) {
  setValue(parseFloat($.textField.value) - _spinnerStepValue);
}

function getValue(value) {
  return $.textField.value;
}
function setValue(value) {
  $.textField.value = value;
}
Object.defineProperty($, "value", {
    get: getValue,
    set: setValue
});