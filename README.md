SocialGap
=========

SocialGap is a plugin intended to ease the integration of PhoneGap hybrid mobile apps with social networks.
It is modular, so it can be easily extended and it reduces overhead since you import only the modules you need.
This plugin has been developed as a proof of concept while developing Mmarazzu Mobile app.
This software is not intended for production usage as it is because of the following list of known needed modifications:

<ol>
	<li> 
		Facebook long-lived token support needs the app-secret. This should not be deployed on the clients. 
		In order to use the Facebook API as intended you need to transform short-lived token in long-lived 
		ones on your servers and then transport the tokens on the clients, where they will be stored.
	</li>
</ol>

Setup
-------

Develop an extension
---------------------

Run the example
-------
In order to make the example work follow these steps:
<ol>
	<li> Create a new PhoneGap app typing something similar to:<br>
   		<code>phonegap create YourApp/ com.whatever.yourapp YourApp</code></li>
		<li> Copy the files contained in the <i>example</i> folder into the <i>www</i> folder of the project you've just created</li>
		<li> Copy the folder <i>Social Gap</i> contained under the <i>lib</i> directory into the folder <i>www/js</i> of the project you have just created.</li>
		<li>Set the required settings in the modules (for instance in socialGap_facebook.js).</li>
		<li>Install the inAppBrowser plugin for your project, typing these commands:
			<pre><code>cd YourApp
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git</code></pre>			
		</li>
		<li> 
			Run the project for the platform you like most. <br>
			For instance type the following command from within <i>YourApp</i> directory:<br/>
   			<code>phonegap run android</code>
		</li>
</ol>
