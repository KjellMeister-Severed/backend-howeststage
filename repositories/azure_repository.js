const azureService = require("../services/azure_service");
const STAGEMARKT_BOOKING_BUSINESS = "HowestStagemarkt@howeststageplatform.onmicrosoft.com"; 

function addEmployee(company) {
    return azureService.fetchFromGraph("POST", 
    `bookingBusinesses/${STAGEMARKT_BOOKING_BUSINESS}/staffMembers`, {
        displayName: company.name,
        emailAddress: company.email,
        role: "externalGuest",
    });
}

function deleteEmployee(bookingsId) {
    return azureService.fetchFromGraph("DELETE",
    `bookingBusinesses/${STAGEMARKT_BOOKING_BUSINESS}/staffMembers/${bookingsId}`);
}

module.exports = { addEmployee, deleteEmployee };