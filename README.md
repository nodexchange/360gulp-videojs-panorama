# Proflowers Feb 2017

> APX 3379 - Provide Commerce / Pro Flowers custom Header with 16 options tied to a Google Sheet. Allows client customization with Google Sheet and uses this as a database, returning JSON into our responsive header.
## Notes:

## Libraries used
  * #### JS / Utilities
    * [tweenmax@3.9.1](https://localtunnel.github.io/www/)
  * #### build tools
    * [gulp@3.9.1](https://www.npmjs.com/package/gulp)
    * [gulp-file-includer@1.0.0](https://www.npmjs.com/package/gulp-file-includer)

## Setup

  * ### 1. Requirements
    * nodejs@4.4.3
    * npm@3 (`$ npm i -g npm`)

  * ### 2. How to / Installation
    * `$ git clone ssh://git@stash.ops.aol.com:2022/pictela/techservices.git`
    * `$ cd techservices/clients/provideCommerce/`
    * `$ npm install`

    (Don't forget to add your remote origin: `$ git remote add origin https://stash.ops.aol.com/users/martinwojtala/repos/hackathon_2016_baltimore/browse`)

## Run
  * ### build
    * `$ gulp`
  * ### Visit
    * [URL](http://localhost:8080/dist/index_jeep.html)

### Learn more
* [Official Gulp website](https://www.npmjs.com/package/gulp)

## customAd.js changes
to enable macro replacement for the dynamic clickthrough. 


### init: function(advert) {
com.adtech.Advert_$VERSION$.prototype.generateClickUrl = function (identifier, overrideUrl) {
  var disableTracking = (typeof adtechDisableClickTracking != 'undefined') ? true : false;
  identifier = this.verifyClickIdentifier(identifier);
  if (typeof this.clickthroughs[identifier] != 'undefined') {
    var clk = this.clickthroughs[identifier];
    var clkId = clk.id;
    if (identifier == com.adtech.Advert_$VERSION$.BACKUP_CLICK) {
      clk = this.clickthroughs[com.adtech.Advert_$VERSION$.DEFAULT_CLICK];
      clkId = this.clickthroughs[com.adtech.Advert_$VERSION$.BACKUP_CLICK].id;
    }
    var dest = (typeof overrideUrl != 'undefined' && overrideUrl) ? overrideUrl : clk.dest;
    if (!disableTracking) {
      dest = this.addThirdPartyRedirectsToClickUrl(identifier, dest);
      dest = this.replaceServerMacros(dest); // THIS LINE WAS ADDED
      var redirectUrl = this.generateClickRedirectUrl({"id": clkId});
      if (redirectUrl) {
        dest = redirectUrl + escape(dest);
      }
      var clickRedirect = this.pubVars.clickRedirect;
      if (typeof clickRedirect != 'undefined' && clickRedirect) {
        dest = this.replaceServerMacros(clickRedirect) + dest;
      }
    }
    return dest;
  }
  return '';
}

      // A few useful things to help you get started. Please delete as necessary!
      this.advert = advert;
      this.advert.macroMap['%5BCACHEBUSTER%5D'] = new Date().getTime();
      this.advert.macroMap['[CACHEBUSTER]'] = new Date().getTime();
