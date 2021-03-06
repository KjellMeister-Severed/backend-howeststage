# Howest Stage Booker (Back-end)

Howest Stagebooker is a React-based application that allows HoWest Personal & students to sign on using their Microsoft account and book meetings with companies that they are interested where they could potentially get an internship.

> :exclamation: You are currently in the back-end section of the project. Note that you'll also need access to the [front-end](https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/react-app) if you want complete functionality.

## Requirements
- [Node.JS LTS](https://nodejs.org/en/download/) & NPM
- [Docker (Desktop)](https://www.docker.com/get-started)

## Available scripts
- `npm run start`: This container will create a **fully containerized version** of the application.
- `npm run start:local`: This command builds & deploys a MariaDB container image & start up a **local** express.js server as defined within the [.env](#env) file.
- `npm run rebuild`: This command will bring all containers offline and rebuild them. 
  > :question: **Why does this command exists?** You'll need this if you change an `env` variable, because the `start` command doesn't remove your containers, it only stops them.
# Configuration
## `.env`
|Key|Value explication|Value Example|
|---|---|---|
|`DATABASE_USER`|The database user designated for the application|Stage_Booker|
|`DATABASE_PASSWORD`|The database password of the user, used by the application|z$x%*V&z2^*baX|
|`DATABASE_PORT`|The database port that should be used for the deployed database.|*3306*|
|`DATABASE_NAME`|The database's name that should be used by the application|stagebooker|
|`DATABASE_HOST`|The database's host address, used by the application|localhost|
|`EXPRESS_PORT`|The port used by the application|8080|
|`AZURE_CLIENTSECRET`|A secret string that the application uses to prove its identity when requesting a token|eqB7Q~usJfWyLOP4YD9U8hDRRL21vboHoO3Ku|
|`AZURE_USERNAME`|The username of the Azure account that the back-end uses to do its API calls|backend@howeststageplatform.onmicrosoft.com|
|`AZURE_PASSWORD`|The password of the Azure account that the back-end uses to do its API calls|P4ssword15486|
|`EMAIL_SERVER`|The SMTP server that should be used for our mail client.|smtp.live.com|
|`EMAIL_USERNAME`|The email address you want to use to send mails.|noreply@howeststageplatform.onmicrosoft.com|
|`EMAIL_PASSWORD`|The password that should be used for our mail client.|P4ssword15486|
|`EMAIL_PORT`|The port used for the email server|587|


# Installation
## Production
> :bulb: If needed, the **Express.JS** team provides a handy [production best practices guide](https://expressjs.com/en/advanced/best-practice-performance.html) that we suggest keeping nearby.

> :exclamation: Still W.I.P. We'll first need to know which platform IT uses. But we're guessing that they might use [App Services](https://azure.microsoft.com/en-us/services/app-service/) on Azure, seeing as they do use a lot of Azure services.

## Development configuration
1. Clone the following projects to your local machine using `git clone`:
   - **[React App](https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/react-app):** [https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/react-app](https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/react-app)
   - **[Express Backend](https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/back-end)**: https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/back-end
2. In the `back-end` directory, create a `.env` file. The explication of each variable, you can find [here](#env), but here's a example:
    ```dotenv
    EXPRESS_PORT=3001

    DATABASE_HOST=127.0.0.1
    DATABASE_PORT=3306
    DATABASE_PASSWORD=TypescriptOnTop123!
    DATABASE_NAME=stagebooker
    DATABASE_USER=root

    AZURE_CLIENTSECRET=eaZ4O~usJLbgRHL1Y9MU8RPX2L72vb1H678Ku
    AZURE_USERNAME=adriaandesaeger@howeststageplatform.onmicrosoft.com
    AZURE_PASSWORD=NextJSyes

    EMAIL_SERVER=smtp.live.com
    EMAIL_PORT=587
    EMAIL_USERNAME=noreply@howeststageplatform.onmicrosoft.com
    EMAIL_PASSWORD=Test12345678
    ```
3. In the same directory, run the following command:
   - `npm run start` -> **Fully containerized**
   - `npm run start:local` -> **Local development**
    > :exclamation: Make sure that Docker (Desktop) is running!

:white_check_mark: **Done!** Normally you should be able to access the application on localhost:`<EXPRESS_PORT>`!

> :bulb: If you also want to configure the front-end, you should continue following the guide [here](https://git.ti.howest.be/TI/2021-2022/s5/project-iv/projects/group-13/react-app/README.md) from step 3.
