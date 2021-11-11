# Howest Stage Booker (Back-end)

Howest Stagebooker is a React-based application that allows HoWest Personal & students to sign on using their Microsoft account and book meetings with companies that they are interested where they could potentially get an internship.

> :exclamation: You are currently in the back-end section of the project. Note that you'll also need access to the [front-end](https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/react-app) if you want complete functionality

## Requirements
- [Node.JS LTS](https://nodejs.org/en/download/) & NPM
- [Docker (Desktop)](https://www.docker.com/get-started)

## Available scripts
- `npm run start`: This commands builds & deploys a MariaDB container image & start up the server as defined within the [.env](#.env) file

# Configuration
## `.env`
|Key|Value Explication|Value Example|
|---|---|---|
|`DATABASE_USER`|The database user designated for the application|Stage_Booker|
|`DATABASE_PASSWORD`|The database password of the user, used by the application|z$x%*V&z2^*baX|
|`DATABASE_PORT`|The database port that should be used for the deployed database.|*3306*|
|`DATABASE_NAME`|The database's name that should be used by the application|
|`DATABASE_HOST`|The database's host address, used by the application|localhost|
|`EXPRESS_PORT`|The port used by the application|8080|


