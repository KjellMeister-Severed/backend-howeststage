const path = require("path");
const userRepository = require("../repositories/user_repository");
const roleRepository = require("../repositories/role_repository");
const azureRepository = require("../repositories/azure_repository");

async function getAzureUserInfo(token) {
    return await azureRepository.getUserInfo(token);
}

async function getAppointmentsForUser(userPrincipalName) {
    return await azureRepository.listAppointmentsForUser(userPrincipalName);
}

async function getUserById(id) {
    const user = await userRepository.getUserById(id);
    user.roles = await getRoles(id);

    return user;
}

async function editUserById(id, editUser) {
    return await userRepository.editUserById(id, editUser);
}

async function uploadCV(userId, file) {
    if(!file) {
        throw "File not found.";
    }

    const extension = path.extname(file.name).toLowerCase();
    if(extension != ".pdf") {
        throw "The file needs to be PDF file.";
    }

    file.mv(`./private/cv/${userId + extension}`);
    return true;
}

function getProfilefile(userId) {
    const filenames = fs.readdirSync(config.profilefilePath, {withFileTypes: true});
    const profilefile = filenames.map(file => file.name)
    .filter(name => name.startsWith(userId))[0];

    if(profilefile != null) {
        return `${config.profilefilePath}/${profilefile}`;
    } else {
        return `${config.profilefilePath}/default.jpg`;
    }
}

async function cancelAppointmentForUser(userId, appointmentId) {
    const appointment = await azureRepository.getAppointment(appointmentId);

    if(userId != appointment.customers[0].emailAddress) {
        throw "HELABA DA KAN HIER NI HE IEMAND ANDERS ZIJN APPOINTMENT CANCELLEN";
    }
    
    await azureRepository.cancelAppointment(appointmentId);

    return true;
}

async function getRoles(userId) {
    const roles = await roleRepository.getUserRoles(userId);

    if(roles == null) return false;

    return roles.map(role => role.name);
}

async function hasRole(userId, role) {
    const roles = await roleRepository.getUserRoles(userId);

    if(roles == null) return false;

    const roleNames = roles.map(role => role.name);
    return roleNames.includes(role);
}

module.exports = { getAzureUserInfo, getUserById, editUserById, uploadCV, getAppointmentsForUser, cancelAppointmentForUser, hasRole };