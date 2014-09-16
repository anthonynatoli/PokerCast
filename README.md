PokerCast Receiver
=========

Setup (for development)
------
<ol>
  <li>Install NodeJS (http://nodejs.org/)</li>
  <li>Clone this repo:
    <pre><code>$ git clone https://github.com/anthonynatoli/PokerCast.git</code></pre>
  </li>
   <li>In the root directory of this project, install express:
        <pre><code>$ npm install express</code></pre>
    </li>
</ol>

How To Run Locally
------
<ol>
  <li>Make sure you already followed the instructions <b>Setup (for development)</b></li>
  <li>In the root directory of the project,
      <pre><code>$ npm start</code></pre>
  </li>
  <li>Visit <b>http://localhost:9999</b> in your browser</li>
</ol>

Setup (for deployment)
-------
<ol>
  <li>Install Heroku Toolbelt (http://toolbelt.heroku.com)</li>
  <li>Make sure you are in the directory that you clone this repo into</li>
  <li>Login to Heroku:
    <pre><code>$ heroku login</code></pre>
  </li>
  <li>Add Heroku remote:
    <pre><code>$ heroku git:remote -a pokercast</code></pre>
  </li>
</ol>

How To Deploy
------
<ol>
  <li>Make sure you already followed the instructions <b>Setup (for development)</b> and <b>Setup (for deployment)</b></li>
  <li>Login to Heroku:
    <pre><code>$ heroku login</code></pre>
  </li>
  <li>In the root directory of the project, push to Heroku:
      <pre><code>$ git push heroku master</code></pre>
  </li>
  <li>Visit <b>http://pokercast.herokuapp.com</b> in your browser</li>
</ol>
