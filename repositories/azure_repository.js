const azureService = require("../services/azure_service");
const companyRepository = require("./company_repository");
const STAGEMARKT_BOOKING_BUSINESS = "HowestStagemarkt@howeststageplatform.onmicrosoft.com"; 

async function getUserInfo(token) {
    return azureService.fetchFromGraph("GET", `me`, null, token);
}

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

    return appointments
    .filter(appointment => appointment.staffMemberIds.includes(bookingsId))
    .map(mapAppointmentObject);
}

async function listAppointmentsForUser(userPrincipalName) {
    let appointments = await azureService.fetchFromGraph("GET", 
    `bookingBusinesses/${STAGEMARKT_BOOKING_BUSINESS}/appointments`);
    appointments = appointments.value;

    return await Promise.all(appointments
    .filter(appointment => appointment.customerEmailAddress == userPrincipalName)
    .map(mapAppointmentObject));
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

async function mapAppointmentObject(appointment) {
    const company = await companyRepository.getCompanyByBookingsId(appointment.staffMemberIds[0]);
    
    return {
        id: appointment.selfServiceAppointmentId,
        startTime: appointment.start.dateTime,
        endTime: appointment.end.dateTime,
        company: {
            id: company.id,
            name: company.name
        },
        customer: {
            id: appointment.customerEmailAddress,
            name: appointment.customerName
        }
    };
}

module.exports = { getUserInfo, addEmployee, deleteEmployee, listAppointmentsForCompany, listAppointmentsForUser, cancelAppointment, getAppointment };