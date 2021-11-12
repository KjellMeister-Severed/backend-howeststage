const azureService = require("../services/azure_service");
const STAGEMARKT_BOOKING_BUSINESS = "HowestStagemarkt@howeststageplatform.onmicrosoft.com"; 

async function addEmployee(company) {
    return await azureService.fetchFromGraph("POST", 
    `bookingBusinesses/${STAGEMARKT_BOOKING_BUSINESS}/staffMembers`, {
        displayName: company.name,
        emailAddress: company.email,
        role: "externalGuest",
    });
}

async function deleteEmployee(bookingsId) {
    return await azureService.fetchFromGraph("DELETE",
    `bookingBusinesses/${STAGEMARKT_BOOKING_BUSINESS}/staffMembers/${bookingsId}`);
}

async function listAppointmentsForCompany(bookingsId) {
    let appointments = await azureService.fetchFromGraph("GET", 
    `bookingBusinesses/${STAGEMARKT_BOOKING_BUSINESS}/appointments`);
    appointments = appointments.value;

    return appointments.filter(appointment => appointment.staffMemberIds.includes(bookingsId));
}

async function listAppointmentsForUser(userPrincipalName) {
    let appointments = await azureService.fetchFromGraph("GET", 
    `bookingBusinesses/${STAGEMARKT_BOOKING_BUSINESS}/appointments`);
    appointments = appointments.value;

    return appointments.filter(appointment => appointment.customerEmailAddress == userPrincipalName);
}

async function getAppointment(appointmentId) {
    return await azureService.fetchFromGraph("GET",
    `bookingBusinesses/${STAGEMARKT_BOOKING_BUSINESS}/appointments/${appointmentId}`);
}

async function cancelAppointment(appointmentId) {
    return await azureService.fetchFromGraph("POST",
    `bookingBusinesses/${STAGEMARKT_BOOKING_BUSINESS}/appointments/${appointmentId}/cancel`, {
        cancellationMessage: "Your appointment has been succesfully canceled."
    });
}

module.exports = { addEmployee, deleteEmployee, listAppointmentsForCompany, listAppointmentsForUser, cancelAppointment, getAppointment };