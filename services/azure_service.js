const fetch = require("node-fetch");
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
            logLevel: msal.LogLevel.Warning,
        }
    }
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

async function getToken() {
    const usernamePasswordRequest = {
        scopes: ["Bookings.Manage.All", "Calendars.Read", "offline_access"],
        username: process.env.AZURE_USERNAME,
        password: process.env.AZURE_PASSWORD,
    };

    return new Promise((resolve, reject) => {
        pca.acquireTokenByUsernamePassword(usernamePasswordRequest).then((response) => {
            resolve(response.accessToken);
        }).catch((error) => {
            reject(error);
        });
    });
}

async function fetchFromGraph(method, endpoint, body) {
    let requestOptions = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getToken()}`
        },
    }

    if(body != null) {
        requestOptions.body = JSON.stringify(body);
    }

    return new Promise((resolve, reject) => {
        fetch(`https://graph.microsoft.com/beta/${endpoint}`, requestOptions)
        .then((response) => {
            if(response.status == 204) {
                return true;
            } else {
                return response.json();
            }
        }).then(data => resolve(data))
        .catch(err => {
            reject(err);
        });
    });
}

module.exports = { fetchFromGraph };