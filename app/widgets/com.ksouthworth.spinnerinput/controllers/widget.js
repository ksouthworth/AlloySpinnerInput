var AUTO_CLOSE_MILLIS = 500;
var STYLES = {
  bigSpinner: $.createStyle({classes: 'bigSpinner'}),
  spinnerWindow: $.createStyle({classes: 'spinnerWindow'}),
  spinnerSeparator: $.createStyle({classes: 'spinnerSeparator'})
};
var _absolutePosition = null;
var _spinnerLastTouchedAt = null;
var _textFieldHasFocus = false;
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
  //delete args.__parentSymbol;
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

//-----------------------------
// Create Spinner Window
//-----------------------------
var _spinnerWindow = Ti.UI.createWindow(_.extend(STYLES.spinnerWindow, {
  width: '50dp',
  height: '100dp',
  layout: 'vertical'
}));
var _spinnerUp = Ti.UI.createLabel(_.extend(STYLES.bigSpinner, {
  text: '\uf077'
}));
var _spinnerDown = Ti.UI.createLabel(_.extend(STYLES.bigSpinner, {
  text: '\uf078'
}));
_spinnerUp.addEventListener('touchstart', function(e) { e.spinDirection = 'up'; bigSpinnerClick(e); });
_spinnerDown.addEventListener('touchstart', function(e) { e.spinDirection = 'down'; bigSpinnerClick(e); });
_spinnerWindow.add(_spinnerUp);
_spinnerWindow.add(Ti.UI.createView(STYLES.spinnerSeparator));
_spinnerWindow.add(_spinnerDown);
_spinnerWindow.addEventListener('blur', function() {
  Ti.API.debug('spinner ' + exports.id + ' -> window [blur]');
  _spinnerWindow.close();
});

/**
 * Apply TSS style properties to our widget
 *
 * @param  {[type]} properties [description]
 * @return {[type]}            [description]
 */
function applyProperties(properties) {
  properties = _.omit(properties, 'children');

  Ti.API.debug('spinner ' + exports.id + ' -> applyProperties : ' + JSON.stringify(properties));

  $.view.applyProperties(properties);

  if(properties.color) {
    var commonProps = {
      color: properties.color
    };
    $.textField.applyProperties(commonProps);
    // $.spinnerUp.applyProperties(commonProps);
    // $.spinnerDown.applyProperties(commonProps);
  }
}

function onPostLayout() {
  Ti.API.debug('spinner ' + exports.id + ' -> [postlayout]');

  if(_absolutePosition === null) {
    calculateAbsolutePosition();
  }

  // _spinnerWindow.applyProperties({
  //   top: ($.view.rect.y + 45 - 30),
  //   left: ($.view.rect.x + $.textField.rect.width),
  // });
}

function calculateAbsolutePosition() {
  var pos = {
    x: $.view.rect.x,
    y: $.view.rect.y
  };

  Ti.API.debug('calculateAbsolutePosition -> start = ' + JSON.stringify(pos));

  var parent = $.parent;
  // Ti.API.debug('calculateAbsolutePosition -> parent = ' + parent);
  while(parent) {
    // Ti.API.debug('calculateAbsolutePosition -> parent = ' + parent);

    pos.x = pos.x + parent.rect.x;
    pos.y = pos.y + parent.rect.y;

    parent = parent.parent;
  }

  Ti.API.debug('calculateAbsolutePosition -> end = ' + JSON.stringify(pos));

  _absolutePosition = pos;
}

function onTextFocus(e) {
  Ti.API.debug('spinner ' + exports.id + ' -> [textFocus]');
  _textFieldHasFocus = true;
  _spinnerWindow.close();
}

function onTextBlur(e) {
  Ti.API.debug('spinner ' + exports.id + ' -> [textBlur]');
  // _textFieldHasFocus = true;
  // _textFieldHasFocus = false;
  // closeSpinnerWindow();
  _spinnerWindow.close();
}

function setValue(value) {
  $.textField.value = value;
}

function spinUp(e) {
  setValue(parseFloat($.textField.value) + _spinnerStepValue);
}

function spinDown(e) {
  setValue(parseFloat($.textField.value) - _spinnerStepValue);
}

function onDone(e) {
  dismissKeyboard();
}

function dismissKeyboard(e) {
  $.textField.blur();
  _textFieldHasFocus = false;
  closeSpinnerWindow();
}

function gestureTouchStart(e) {
  // Ti.API.debug('spinner ' + exports.id + ' -> [gestureTouchStart] ' + e.x + ' , ' + e.y);
  _spinnerWindow.open({
    // top: ($.view.rect.y + $.parent.rect.y),
    // left: ($.view.rect.x + $.textField.rect.width),
    top: (_absolutePosition ? _absolutePosition.y : $.view.rect.y) - 50 + 18,
    left: (_absolutePosition ? _absolutePosition.x : $.view.rect.x) + $.textField.rect.width,
  });

  setTimeout(function() {
    closeSpinnerWindow();
  }, 2000);
}

function bigSpinnerClick(e) {
  // Ti.API.debug('[bigSpinnerClick] e: ' + JSON.stringify(e));
  _spinnerLastTouchedAt = new Date();
  if(e.spinDirection == 'up') {
    spinUp();
  } else if(e.spinDirection == 'down') {
    spinDown();
  }
}

function closeSpinnerWindow() {
  var now = new Date();

  var closeThresholdElapsed = ((now - _spinnerLastTouchedAt) >= AUTO_CLOSE_MILLIS);
  if(!_textFieldHasFocus && closeThresholdElapsed) {
    _spinnerWindow.close();
  } else {
    // check again later
    setTimeout(closeSpinnerWindow, 100);
  }
}