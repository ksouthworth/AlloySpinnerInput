if(arguments[0]) {
  var args = arguments[0];

  if (args.id) {
    exports.id = args.id;
    delete args.id;
  }
  delete args.__parentSymbol;
  delete args.__itemTemplate;
  delete args['$model'];
  delete args.children;

  // if(OS_IOS) {
  //   attachToolbar();
  // }

  applyProperties(arguments[0]);

  if(args.value) {
    $.textField.value = args.value;
  }

  // $.spinnerUp.addEventListener('click', function() {
  //   Ti.API.debug('[click] UP');
  // });
  // $.spinnerUp.addEventListener('touchstart', function() {
  //   Ti.API.debug('[touchstart] UP');
  // });
  // $.spinnerUp.addEventListener('touchend', function() {
  //   Ti.API.debug('[touchend] UP');
  // });
  // $.spinnerUp.addEventListener('singletap', function() {
  //   Ti.API.debug('[singletap] UP');
  // });
  // $.spinnerUp.addEventListener('longpress', function() {
  //   Ti.API.debug('[longress] UP');
  // });
}

/**
 * Apply TSS style properties to our widget
 *
 * @param  {[type]} properties [description]
 * @return {[type]}            [description]
 */
function applyProperties(properties) {
  properties = _.omit(properties, 'children');

  console.log('applyProperties : ' + JSON.stringify(properties));

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

function setValue(value) {
  $.textField.value = value;
}

function spinUp(e) {
  setValue(parseFloat($.textField.value) + 1);
}

function spinDown(e) {
  setValue(parseFloat($.textField.value) - 1);
}

function onSliderChanged(e) {
  setValue(parseInt(e.value, 10));
}

function dismissKeyboard(e) {
  $.textField.blur();
}

function touchStart(e) {
  Ti.API.debug('[touchStart] ' + e.x + ' , ' + e.y);
}

function touchEnd(e) {
  Ti.API.debug('[touchEnd] ' + e.x + ' , ' + e.y);
}

function touchMove(e) {
  Ti.API.debug('[touchMove] ' + e.x + ' , ' + e.y);
}