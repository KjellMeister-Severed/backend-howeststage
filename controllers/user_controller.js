const path = require("path");
const userRepository = require("../repositories/user_repository");
const azureRepository = require("../repositories/azure_repository");

async function getAzureUserInfo(token) {
    return await azureRepository.getUserInfo(token);
}

async function getAppointmentsForUser(userPrincipalName) {
    return await azureRepository.listAppointmentsForUser(userPrincipalName);
}

async function getUserById(id) {
    return await userRepository.getUserById(id);
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

    if(userId != appointment.customerEmailAddress) {
        throw "HELABA DA KAN HIER NI HE IEMAND ANDERS ZIJN APPOINTMENT CANCELLEN";
    }
    
    await azureRepository.cancelAppointment(appointmentId);

    return true;
}

module.exports = { getAzureUserInfo, getUserById, editUserById, uploadCV, getAppointmentsForUser, cancelAppointmentForUser };