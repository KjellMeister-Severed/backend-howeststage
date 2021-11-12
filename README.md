# Howest Stage Booker (Back-end)

Howest Stagebooker is a React-based application that allows HoWest Personal & students to sign on using their Microsoft account and book meetings with companies that they are interested where they could potentially get an internship.

> :exclamation: You are currently in the back-end section of the project. Note that you'll also need access to the [front-end](https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/react-app) if you want complete functionality.

## Requirements
- [Node.JS LTS](https://nodejs.org/en/download/) & NPM
- [Docker (Desktop)](https://www.docker.com/get-started)

## Available scripts
- `npm run start`: This commands builds & deploys a MariaDB container image & start up the server as defined within the [.env](#env) file

# Configuration
## `.env`
|Key|Value explication|Value Example|
|---|---|---|
|`DATABASE_USER`|The database user designated for the application|Stage_Booker|
|`DATABASE_PASSWORD`|The database password of the user, used by the application|z$x%*V&z2^*baX|
|`DATABASE_PORT`|The database port that should be used for the deployed database.|*3306*|
|`DATABASE_NAME`|The database's name that should be used by the application|
|`DATABASE_HOST`|The database's host address, used by the application|localhost|
|`EXPRESS_PORT`|The port used by the application|8080|

# Installation
## Production
> :bulb: If needed, the **Express.JS** team provides a handy [production best practices guide](https://expressjs.com/en/advanced/best-practice-performance.html) that we suggest keeping nearby.

> :exclamation: Still W.I.P. We'll first need to know which platform IT uses. But we're guessing that they might use [App Services](https://azure.microsoft.com/en-us/services/app-service/) on Azure, seeing as they do use a lot of Azure services.

## Development
### Local-based development
1. Clone the following projects to your local machine using `git clone`:
   - **[React App](https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/react-app):** [https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/react-app](https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/react-app)
   - **[Express Backend](https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/back-end)**: https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/back-end
2. In the `back-end` directory, create a `.env` file. The explication of each variable, you can find [here](#env), but here's a example:
    ```dotenv
    DATABASE_PORT=3306
    DATABASE_PASSWORD=Friday13th!
    DATABASE_NAME=StageBooker
    DATABASE_USER=root
    DATABASE_HOST=localhost
    EXPRESS_PORT=8080
    ```
3. In the same directory, run the following command: `npm run start`.
    > :exclamation: Make sure that Docker (Desktop) is running!
4. Connect to the database with a GUI using:
    - The root username
    - The root password
    - The database port defined in `.env`
    > :exclamation: Docker uses localhost, so you can just connect with localhost.
5. Run the [`init_db.sql`](init_db.sql) file to construct the initial database
    > :sweat: Kinda annoying right? But don't worry, we're currently investigating running this **automatically** when you start the server!

:white_check_mark: **Done!** Normally you should be able to access the application on localhost:`<EXPRESS_PORT>`!

> :bulb: If you also want to configure the front-end, you should continue following the guide [here](https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/react-app/README.md) from step 3.

### Docker-based deployment

> :exclamation: This will be added on a later date. Currently, the back-end doesn't interact nicely with the database and we'll look into this on a later date.
