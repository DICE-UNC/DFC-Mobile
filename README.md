Cloud Browser Mobile Guide
======================================

Developed by Matthew Krause/DICE-UNC. 2016.
This app was developed using Onsen UI, Cordova, & Node.js.

DFC Cloud Browser Mobile v1.0.1

The Cloud Browser Mobile is a lightweight, mobile version of the DFC iRODS Cloud Browser (http://irods.org/2015/12/dfc-irods-cloud-browser-v1-0-0-released/).

Use the Cloud Browser Mobile to access your iRODS data grid from your mobile device, to quickly upload data objects on the go, and access/add metadata.

Apple and Android App Store Locations
======================================
Apple iOS App Store:
  https://itunes.apple.com/us/app/cloud-browser-mobile/id1086770384?ls=1&mt=8

Google Play Android App Market:
  https://play.google.com/store/apps/details?id=io.cordova.iRODS&hl=en







## Requirement

 * Node.js  - [Install Node.js](http://nodejs.org)
 * Cordova  - Install by `npm install cordova`
 * Onsen UI - Install by `$ bower install onsenui`


### Directory Layout

    README.md     --> This file
    gulpfile.js   --> Gulp tasks definition
    www/          --> Asset files for app
      index.html  --> App entry point (login page)
      app.html    --> Main App
      img/        --> Images and Icons Used 
      js/
      styles/
      lib/onsen/
        stylus/   --> Stylus files for onsen-css-components.css
        js/       --> JS files for Onsen UI
        css/      --> CSS files for Onsen UI
    platforms/    --> Cordova platform directory
    plugins/      --> Cordova plugin directory
    merges/       --> Cordova merge directory
    hooks/        --> Cordova hook directory


