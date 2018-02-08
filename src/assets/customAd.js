/**
 * Boilerplate code required to hook into the ADTECH rich media library.
 *
 * For API documentation, please contact canvas-help@adtech.com
 */
(function(adConfig) {
  var requiresBreakout = false;
  if (!adConfig.overrides || adConfig.overrides.displayWindowTarget != self) {
    for (var id in adConfig.assetContainers) {
      if (adConfig.assetContainers.hasOwnProperty(id)) {
        var container = adConfig.assetContainers[id];
        if (container.type != 'inlineDiv' || container.isExpandable) {
          requiresBreakout = true;
          break;
        }
      }
    }
  }

  if (adConfig.overrides && adConfig.overrides.displayWindowTarget) {
    var displayWindowTarget = adConfig.overrides.displayWindowTarget;
    displayWindowTarget = (typeof adtechIframeHashArray != 'undefined' && self != top) ?
        displayWindowTarget.parent : displayWindowTarget;
  } else {
    var calculatedTarget = null;
    var currentWindow = parent;
    while (currentWindow != undefined) {
      try {
        var targetDoc = currentWindow.document;
        if (targetDoc) {
          calculatedTarget = currentWindow;
        }
      } catch(e) {}
      currentWindow = (currentWindow == top) ? null : currentWindow.parent;
    }
    var displayWindowTarget = calculatedTarget || top;
  }

  var targetIsFriendly = false;
  try {
    var targetDoc = displayWindowTarget.document;
    if (targetDoc) {
      targetIsFriendly = true;
    }
  } catch(e) {}

  var targetWindow = (requiresBreakout && (self != top && targetIsFriendly)) ?
          displayWindowTarget : self;

  targetWindow.com = targetWindow.com || {};
  targetWindow.com.adtech = targetWindow.com.adtech || {};

  targetWindow.com.adtech.AdtechCustomAd$AD_ID$ = function() {
    // Custom code class constructor.
  };

  targetWindow.com.adtech.AdtechCustomAd$AD_ID$.prototype = {

    /**
     * Entry point methods.
     *
     * Automatically invoked by the rich media library when the library API is
     * available to use, and the Advert instance has been instantiated.
     */
	preInit: function() {
	  window.com = com || {};
	  com.adtech = targetWindow.com.adtech;
		com.adtech.HtmlContent_$VERSION$.prototype.postMessageHandler = function(event) {
				if (!this.shouldAcceptMessage(event)) {
					return false;
				}
				this.adContentWindow = this.adContentWindow || event.source;
				var messageObj = this.constructMessageObject(event.data);
				switch (messageObj.cmd) {
					case com.adtech.HtmlContent_$VERSION$.CMD_TYPE_INIT:
						if (messageObj.payload) {
							this.setMessageFormat(messageObj.payload.format);
						}
						this.sendEnvironmentInfo();
						this.sendConfig();
						break;
					case com.adtech.HtmlContent_$VERSION$.CMD_TYPE_DISPATCH:
						if (this.contentIsOne) {
							messageObj.payload.type = this.getTypeEventFromMessage(messageObj.payload);
						}
						var event = new com.adtech.RichMediaEvent_$VERSION$(messageObj.payload.type);
						if (typeof messageObj.payload.meta == 'object') {
							event.meta = messageObj.payload.meta;
							console.log('click');
							event.suppressLogging = messageObj.payload.suppressLogging;
						}
						this.dispatchAdvertLevelEvent(event);
						break;
					case com.adtech.HtmlContent_$VERSION$.CMD_TYPE_EXEC:
						if (this.contentIsOne || messageObj.payload.method === 'timerAction') {
							messageObj.payload.params = this.getParamsFromMessage(messageObj.payload);
						}
						this[messageObj.payload.method].apply(this, messageObj.payload.params);
				}
				return true;
			};
    },

    init: function(advert) {
      if (!advert.richView) {
        // The backup client can not render the rich version of the advert.
        return;
      }
      
      // A few useful things to help you get started. Please delete as necessary!
      this.advert = advert;
	  this.utils = com.adtech.Utils_$VERSION$;
      this.globalEventBus = targetWindow.adtechAdManager_$VERSION$.globalEventBus;
      this.richMediaEvent = com.adtech.RichMediaEvent_$VERSION$;

      /*
       * This is how you listen for your custom events.
       * ADTECH.close() is actually just an alias of ADTECH.event('close').
       */
      advert.eventBus.addEventListener('close',
          this.utils.createClosure(this, this.closeHandler));

      /*
       * Want to wait until the DOM or the page has loaded? No problem!
       */
      if (this.globalEventBus.pageLoaded) {
        this.pageLoadHandler();
      } else {
        this.globalEventBus.addEventListener(this.richMediaEvent.PAGE_LOAD,
            this.utils.createClosure(this, this.pageLoadHandler));
      }
    },

    /*********************************************************
     *
     * Create your instance methods below.
     *
     * Please remember not to add a trailing comma to you last
     * method - IE will not like that!
     *
     *********************************************************/

    closeHandler: function() {
      /*
       * This will get invoked when the close event has been dispatched by any one
       * of your ad units.
       */
			try {
				targetWindow.mraid.close();
			} catch (e) {
				console.log('close failed');
			}
    },

    pageLoadHandler: function() {
      // The page has now loaded. Feel free to display an awesome advert.
			var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
			this.assignOrientationChangeHandler();
			if (iOS) {
				var self = this;
				var evtBus = this.advert.eventBus;
				
				targetWindow.addEventListener('deviceorientation', function(eventData) {
					var deviceOrientationEvent = new self.richMediaEvent('proxyDeviceOrientation');
					deviceOrientationEvent.meta = {gamma:eventData.gamma, beta: eventData.beta, alpha: eventData.alpha, absolute: eventData.absolute, timeStamp: eventData.timeStamp};
					evtBus.dispatchEvent(deviceOrientationEvent);
				}, false);
				
				targetWindow.addEventListener('devicemotion', function(eventData) {
					var deviceMotionEvent = new self.richMediaEvent('proxyDeviceMotion');
					deviceMotionEvent.meta = {rotationRate:eventData.rotationRate, portrait: eventData.portrait, landscape: eventData.landscape, orientation: eventData.orientation, timeStamp: eventData.timeStamp};
					evtBus.dispatchEvent(deviceMotionEvent);
				}, false);
				setTimeout(function() {
					self.onOrientationChange();
				}, 1000);
			}
			this.createLandscapeImage();
			this.onOrientationChange();
    }, 
		
		createLandscapeImage: function() {
			var floatContainerDiv = this.advert.getAssetContainer('main').div;
			var rotateWrapper = targetWindow.document.createElement('div');
			var defaultImg = targetWindow.document.createElement('img');
			defaultImg.alt = 'landscape rotate';
			defaultImg.src = this.advert.getFileUrl('rotate.jpg');
			defaultImg.style.width = '100%';
			rotateWrapper.id = 'landscapeRotate';
			rotateWrapper.appendChild(defaultImg);
			floatContainerDiv.appendChild(rotateWrapper);
			rotateWrapper.style.position = 'absolute';
			rotateWrapper.style.top = '0';
			rotateWrapper.style.left = '0';
			rotateWrapper.style.display = 'none';
			rotateWrapper.style.width = '100%';
      rotateWrapper.style.height = '100%';
      rotateWrapper.style.backgroundColor = 'black';
			this.rotateLandscape = rotateWrapper;
		},
		
		showLandscapeRotate: function() {
			var floatContainerDiv = this.advert.getAssetContainer('main').div;
			this.rotateLandscape.style.display = 'block';
			floatContainerDiv.children[0].style.display = 'none';
			// ADTECH.event('pause360');
		},
		
		hideLandscapeRotate: function() {
			var floatContainerDiv = this.advert.getAssetContainer('main').div;
			this.rotateLandscape.style.display = 'none';
			floatContainerDiv.children[0].style.display = 'block';
			// ADTECH.event('resume360');
		},
		
		assignOrientationChangeHandler: function() {
			var supportsOrientationChange = "onorientationchange" in window;
      var orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
			var _this = this;
      targetWindow.addEventListener(orientationEvent, function(event) {
				setTimeout(function() {
        _this.onOrientationChange(event);
				}, 700);
      }, false);
		},
		
		onOrientationChange:function(event){
      var floatContainer= this.advert.getAssetContainer('main');
			var viewportDims = this.utils.getViewportDims(this.advert.renderingInFiF);
			var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
			var selectedW = viewportDims.w;
			var selectedH = viewportDims.h;
			var isChromeTest = this.isChrome();
			if (isChromeTest) {
				var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
				selectedW = w;
				selectedH = h;
				// alert(h+ ' :maxW: ' + w);	
				
			} else {
				if (iOS) {
					selectedW = targetWindow.innerWidth;
					selectedH = targetWindow.innerHeight;
				}
				if (selectedH < 400) { // landscape mobile iOS
					selectedH = targetWindow.innerHeight - 30;
				}
			}
			
			if (targetWindow.orientation === 0 || targetWindow.orientation === 180) {
				if (selectedW > selectedH) {
					var tempSW = selectedW;
					var tempSH = selectedH;
					selectedW = tempSH;
					selectedH = tempSW;
				}
			}
			
			if (targetWindow.orientation === 90 || targetWindow.orientation === 270) {
				if (selectedW < selectedH) {
					var tempSW = selectedW;
					var tempSH = selectedH;
					selectedW = tempSH;
					selectedH = tempSW;
				}
			}
			
			
			// alert(isChromeTest);
			
			floatContainer.div.style.height = selectedH + 'px';
			floatContainer.div.style.width = selectedW + 'px';
			floatContainer.div.style.clip = 'auto';
			floatContainer.div.children[0].style.height = selectedH + 'px';
			floatContainer.div.children[0].style.width = selectedW + 'px';
			floatContainer.div.children[0].height = selectedH + 'px';
			floatContainer.div.children[0].width = selectedW + 'px';
			
			if (selectedH > selectedW) {	
				this.hideLandscapeRotate();
			} else {
				this.showLandscapeRotate();
			}
			// alert(window.scrollY);
			// alert(targetWindow.scrollY);
			setTimeout(function() {
				targetWindow.scrollTo(0, 0);
				window.scrollTo(0, 0);
				//alert('HEWR');
			}, 2300);
			targetWindow.scrollTo(1, 1);
			window.scrollTo(1, 1);
		},
		
		isChrome: function() {
			var isChromium = targetWindow.chrome,
				winNav = targetWindow.navigator,
				vendorName = winNav.vendor,
				isOpera = winNav.userAgent.indexOf("OPR") > -1,
				isIEedge = winNav.userAgent.indexOf("Edge") > -1,
				isIOSChrome = winNav.userAgent.match("CriOS");
			if (isIOSChrome) {
				return true;
			} else if (
				isChromium !== null &&
				typeof isChromium !== "undefined" &&
				vendorName === "Google Inc." &&
				isOpera === false &&
				isIEedge === false
			) {
				return true;
			} else { 
				return false;
			}
		}
  };

  targetWindow.adtechCallbackInstances = targetWindow.adtechCallbackInstances || [];
  var instanceIndex = targetWindow.adtechCallbackInstances.length;
  targetWindow.adtechCallbackInstances[instanceIndex] =
      new targetWindow.com.adtech.AdtechCustomAd$AD_ID$();

  targetWindow.adtechAdCallbacks = targetWindow.adtechAdCallbacks || {};
  targetWindow.adtechAdCallbacks[adConfig.adServerVars.uid] =
      targetWindow.adtechAdCallbacks[adConfig.adServerVars.uid] || [];
  targetWindow.adtechAdCallbacks[adConfig.adServerVars.uid].push(
      targetWindow.adtechCallbackInstances[instanceIndex]);
})(adtechAdConfig);
