# LaunchHub
LaunchHub is a centralized source to receive information on future rocket launches all around the world, aggregating location and weather data for each.

# APIs Used

## Launch Library API
  - [Documentation](http://launchlibrary.net/docs/1.4/api.html)

Serving as the core API of our application, we are pulling information about launches all over the world.

## backendless Country Flag API
  - [Documentation](https://backendless.com/)

This is used to pull flag data for different agency affiliations.

## Google Maps API
  - [Documentation](https://developers.google.com/maps/)

Using longitude and latitude provided by Launch Library, we are showing satellite view of the surrounding area

## DarkSky API
  - [Documentation](https://darksky.net/dev/docs)

Again, using longitude and latitude provided by Launch Library, we are providing current weather information about the site. 
This API has a strict limit of 1000 calls per day for free accounts, so our caching using redis is quite useful.

# Technologies Used
To accomplish this project, we are using multiple technologies to perform all the necessary requirements.

## Front-end Language: Angular 2
 - [Documentation](https://angular.io/docs)

Angular provides a number of benefits. Besides being easy to use and implement, it has some awesome features like AngularSPA (single page app), which allows our webapp to flow a bit better.

## Styling Framework(1): Material Design
 - [Documentation](https://material.io/)

A style sheet by Google, it allows for beautifully created web sites following their design language.

## Styling Framework(2): Angular Material
 - [Documentation](https://material.angularjs.org/)

A slightly less involved and easier to use version of Google's Material Design style sheet.

## Server-side Language: Node.js
 - [Documentation](https://nodejs.org/en/docs/)

Node.js has the benefit of just being easy to use JavaScript, without the extra bloat needed with Django. Plus, Django just has a lot of nice, but unnecessary functionality for this specific application.

## Webserver: Docker Cloud HAProxy
 - [Documentation](https://github.com/docker/dockercloud-haproxy/tree/master)

Docker Cloud's HAProxy is a fast, well-documented, well-known, and easily managed web load balancer perfect for our scalable application.

## Backend Datastore: Redis
 - [Documentation](https://redis.io/documentation)

Recommended by many all over, redis is being used as a caching componet so we don't have to constantly hit the APIs we are querying.

## Deployment Technology: Docker Compose
 - [Documentation](https://docs.docker.com/compose/)

What now seems to be the defacto deployment method, docker-compose allows us to build scalable, cross-platform, and easily replicated environments for both production and development purposes.

# Deploying the Application

## Environment Variables

The usage of DarkSky API requires the usage of an API key. Our docker-compose.yml file looks for an a file called ```.docker/webapp.env```. Store the api key using the following format:
```
WEATHERAPIKEY=XXXXXXXXXX
```

## Docker Compose

To deploy the full application, simply run the following:
```
$ docker-compose up
```
Then, to view the webpage, go to your browser and type in ```http://<server_address>```. If you would like to hide the output, simple add ```-d``` to your command.

If you don't want to map your local volume, please use the ```docker-compose.prod.yml``` override file.
```
$ docker-compose -f docker-compose.prod.yml up
```
If you would to scale the service out, you can certainly do so. Make sure to use the ```docker-compose.prod.yml``` override file so the containers don't fight over the npm install on the volume. See the docker-compose documentation [here](https://docs.docker.com/compose/reference/up/). Here is an example:
```
$ docker-compose -f docker-compose.prod.yml up --scale webapp=3
```

## Manual Docker Deployment

To run the webapp on its own, simply build the webapp and run it with a redis server using the below code. 
_Please note that the variable $PROJECTSOURCE serves as the absolute path of the project directory_
```
$ cd $PROJECTSOURCE
$ docker build -t webapp .
$ docker run -d --publish=6379 --name="rediscache" redis
$ docker run -d -p 8080:8080 -v $PROJECTSOURCE/site-code:/usr/src/app --link="rediscache:rediscache" --env-file=".docker/webapp.env" webapp
```
# Common Errors & Fixes
## No Such File or Directory
```
webapp_1      | standard_init_linux.go:190: exec user process caused "no such file or directory"
```
Your docker_start.sh is somehow invalid. Most likely, it is using Windows line endings instead of Unix. Easiest way to fix if you have dos2unix installed is to run:
```
$ dos2unix docker_start.sh
```
## Cannot start service webapp: "exec: \"/start.sh\": permission denied"
No execution rights for the '''docker_start.sh''' file. To fix:
```
$ chmod +x ./docker_start.sh
$ docker-compose build --no-cache
```
## Need to Reset Redis Cache
```
$ docker rm rediscache -f
$ docker-compose up
```
## Changes to docker_start.sh not working
This is because the docker build process caches each step. To ensure a clean build, use:
```
$ docker-compose build --no-cache
```
## Docker-Compose on Windows
```
PS> docker-compose up
Pulling lb (dockercloud/haproxy:)...
latest: Pulling from dockercloud/haproxy
1160f4abea84: Pull complete
b0df9c632afc: Pull complete
a49b18c7cd3a: Pull complete
Digest: sha256:040d1b321437afd9f8c9ba40e8340200d2b0ae6cf280a929a1e8549698c87d30
Status: Downloaded newer image for dockercloud/haproxy:latest
Starting rediscache ... done
Recreating isqa-4380finalproject_webapp_1 ... done
Creating isqa-4380finalproject_lb_1       ... error

ERROR: for isqa-4380finalproject_lb_1  Cannot create container for service lb: b'Mount denied:\nThe source path "\\\\var\\\\run\\\\docker.sock:/var/run/docker.sock"\nis not a valid Windows path'

ERROR: for lb  Cannot create container for service lb: b'Mount denied:\nThe source path "\\\\var\\\\run\\\\docker.sock:/var/run/docker.sock"\nis not a valid Windows path'
ERROR: Encountered errors while bringing up the project.
```
This is actually a bug in docker-compose, as this was working previously. You can view this wonderful gentleman's comment about it on [GitHub here](https://github.com/docker/for-win/issues/1829#issuecomment-376328022). The fix it to set an environment variable:
```
PS> $env:COMPOSE_CONVERT_WINDOWS_PATHS=1
```
## Any other weird docker issues
This will essentially nuke anything stored on your docker instance:
```
$ docker system prune -a
```