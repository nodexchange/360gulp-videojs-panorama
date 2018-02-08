/*
window.onload = function() {
	if (window.DeviceOrientationEvent) {
	 alert('inner frame .deviceOrientationEvent supported');
	}
	
	if (window.DeviceMotionEvent) {
  	console.log("inner DeviceMotionEvent supported");
	} 
};
*/

var receivedMotion = true;
var receivedOrientation = true;
var receivedError = false;
var lastAlpha = 0;

setTimeout(function () {
  //receivedMotion = false;
  //receivedOrientation = false;
}, 1000);
ADTECH.ready(initProxyEventHandlers);

function initProxyEventHandlers() {
  // ADTECH.event('proxyDeviceOrientation');
  // ADTECH.event('proxyDeviceMotion');
  ADTECH.addEventListener('proxyDeviceOrientation', proxyDeviceOrientationHandler);
  ADTECH.addEventListener('proxyDeviceMotion', proxyDeviceMotionHandler);
}

function proxyDeviceOrientationHandler(event) {
  if (!receivedOrientation) {
    receivedOrientation = true;
    //alert('proxyDeviceOrientationHandler : ' +event.meta.gamma);
  }
  var deviceEvent = event.meta;
  var event = new Event('deviceorientation');
  event.absolute = deviceEvent.absolute;
  event.gamma = deviceEvent.gamma;
  event.beta = deviceEvent.beta;
  event.alpha = deviceEvent.alpha;
  event.timeStamp = deviceEvent.timeStamp;
  window.dispatchEvent(event);
}

function proxyDeviceMotionHandler(event) {
  if (!receivedMotion) {
    receivedMotion = true;
    //	alert('proxyDeviceMotionHandler : ' + event.meta.type);
  }
  var deviceEvent = event.meta;
  var event = new Event('devicemotion');
  event.acceleration = deviceEvent.acceleration;
  event.accelerationIncludingGravity = deviceEvent.accelerationIncludingGravity;
  event.rotationRate = deviceEvent.rotationRate;
  event.portrait = deviceEvent.portrait;
  event.landscape = deviceEvent.landscape;
  event.orientation = deviceEvent.orientation;
  event.timeStamp = deviceEvent.timeStamp;
  window.dispatchEvent(event);
}

function proxyMouseClick(event) {
  console.log(event.meta);
}

window.onerror = function (msg, url, lineNo, columnNo, error) {
  if (receivedError) {
    return;
  }
  receivedError = true;

  var string = msg.toLowerCase();
  var substring = "script error";

  if (string.indexOf(substring) > -1) {
    alert('Script Error: See Browser Console for Detail');
  } else {
    var message = [
      'Message: ' + msg,
      'URL: ' + url,
      'Line: ' + lineNo,
      'Column: ' + columnNo,
      'Error object: ' + JSON.stringify(error)
    ].join(' - ');

    // alert(message);
  }

  return false;
};
