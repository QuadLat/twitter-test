# twitter-test
Full-stack code for showing a requested twitter user's twitter feed, or allow the website user to search twitter and display results.
The front-end is written in AngularJS, and the back-end server is written in node.js. 
#### node.js back-end
The node.js server uses the following components
1. dispatch
  * Provides the ability to create regular expression based URL routing
  * Ability to create routes for multiple HTTP methods
  * Works with quip and Connect to help with quick prototyping
2. quip
  * Quick prototyping
  * Works as a Connect plugin
3. Connect
  * Extends node.js' HTTP capabilities by plugging in middleware, e.g., compression, sending headers, etc.

#### AngularJS front-end
The front-end uses $http to interface with the node.js provided REST APIs
