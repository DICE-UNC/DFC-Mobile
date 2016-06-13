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

To Test:
iRODS Cloud Browser Mobile can be ran locally if hosted on a local HTTP Server.
To run local HTTP Server:

$ cd .../DFC-Mobile

$ python -m SimpleHTTPServer 8000

App will be hosted at 0.0.0.0:8000


### Directory Layout

    README.md        --> This file
    index.html       --> App entry point (login page)
    js/
      app.js         --> Angular main app.js
      controllers.js --> Angular app controllers
      directives.js  --> Angular app directives
      routes.js      --> Angular routing services
      services.js    --> Factory created servcies
    img/             --> Location for Images
    lib/             --> Ionic and Angular libraries
    templates/       --> HTML templates for views
      home.html
      login.html
      menu.html
      profile.html

