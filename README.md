# LaunchHub
LaunchHub is a centralized source to receive information on recent and future rocket launches all around the world, aggregating location and weather data for each.

## Technologies Used
To accomplish this project, we are using multiple APIs and technologies to perform all the necessary requirements.

### Front-end Language: Angular
 - [Documentation](https://angular.io/docs)

Angular provides a number of benefits. Besides being easy to use and implement, it has some awesome features like AngularSPA (single page app), which allows our webapp to flow a bit better.

### Styling Framework(1): Material Design
 - [Documentation](http://materializecss.com/)

A style sheet by Google, it allows for beautifully created web sites following their design language.

### Styling Framework(2): MaterializeCSS
 - [Documentation](http://materializecss.com/)

While Material Design is nice, some of the features are difficult and clunky to implement. MaterializeCSS is a beta product designed to fix those issues.

### Server-side Language: Node.js
 - [Documentation](https://nodejs.org/en/docs/)

Node.js has the benefit of just being easy to use JavaScript, without the extra bloat needed with Django. Plus, Django just has a lot of nice, but unnecessary functionality for this specific application.

### Webserver: Nginx
 - [Documentation](https://docs.nginx.com/)

Nginx is a fast, well-documented, well-known, and easily managed web server that can act as a load balancer for our scaleable application.

### Backend Datastore: Redis
 - [Documentation](https://redis.io/documentation)

Recommended by many all over, redis is being used as a caching componet so we don't have to constantly hit the APIs we are querying.

### Deployment Technology: Docker Compose
 - [Documentation](https://docs.docker.com/compose/)

What now seems to be the defacto deployment method, docker-compose allows us to build scalable, cross-platform, and easily replicated environments for both production and development purposes.

# Deploying the Application

To deploy the full application, simply run the following:
```
$ docker-compose up
```
Then, to view the webpage, go to your browser and type in ```http://127.0.0.1:8080```

To run the webapp on its own, simply build the container and run it using the below code. 
_Please note that the variable $PROJECTSOURCE is the root directory of this project_
```
$ cd $PROJECTSOURCE
$ docker build -t webapp .
$ docker run -d -p 8080:8080 -v $PROJECTSOURCE/site-code:/usr/src/app webapp
```