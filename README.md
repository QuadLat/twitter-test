# twitter-test
Full-stack code for showing a requested twitter user's twitter feed, or allow the website user to search twitter and display results.
The front-end is written in AngularJS, and the back-end server is written in node.js. 
#### node.js back-end
The node.js server uses the following components

1. dispatch
  * Provides the ability to create regular expression based URL routing
  * Ability to create routes for multiple HTTP methods
2. Underscore
 * Helps with rejection of tweets that match one of the words from the banned list
3. twitter
 * Connect to twitter

The backend API is available at:

GET /tweets/{search}: Searches twitter for the search params, and retrieves the filtered list

GET /banned-words: Get banned words list

PUT /banned-words/{1}/{2}/....: Insert banned words to the list, to filter tweets

#### AngularJS front-end
The front-end uses $http to interface with the node.js provided REST APIs
