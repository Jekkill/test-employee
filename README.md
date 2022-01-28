# test-employee
<h3> This is a sample test application that consist of:</h3>
<ul>
    <li> Server side with NodeJS, Express and PostgreSQL </li>
    <li> Client side with Angular and Angular Material </li>
</ul>

<h4> To run the application you need: </h4>
<ol> 
    <li> Create a database from the database file. You can find it in a database folder</li>
    <li> Run npm i command for installing node_modules in the server folder </li>
    <li> Configure file in server/config/db.sample.js. Use your configuration than rename file to config.js</li>
    <li> Run node index.js in server folder to run the server. </li>
    <li> Run npm i command for installing node_modules in the client folder. </li>
    <li> Run ng serve from the cli. </li>
    <li> Your application will be available at http://localhost:4200/ </li>
</ol>

Some points that will be implemented later:
<ul>
    <li> Add nodemon lib for hot reloading server application </li>
    <li> Improve styles </li>
    <li> Add filtering, pagination, sorting for data in table </li>
    <li> Refactor code -> implement common component </li>
    <li> Add authorization </li>
    <li> Add tests </li>
</ul>