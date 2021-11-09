const msal = require("@azure/msal-node");

const msalConfig = {
    auth: {
        clientId: "3d5139bf-dc6c-40d9-9f6e-64ce3b79b26b",
        clientSecret: "eqB7Q~usJfWyWHL1Y9MU8hDxRL72vboHoO3Ku    ",
        authority: "https://login.microsoftonline.com/223ba385-a78b-4bc2-825b-1c45a7d97afa",
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

async function getToken() {
    const usernamePasswordRequest = {
        scopes: ["Bookings.Manage.All", "Calendars.Read", "offline_access"],
        username: "adriaandesaeger@howeststageplatform.onmicrosoft.com",
        password: "Wachtwoord123",
    };

    pca.acquireTokenByUsernamePassword(usernamePasswordRequest).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });
}

module.exports = { getToken };