const path = require("path");
const userRepository = require("../repositories/user_repository");

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

module.exports = { editUserById, uploadCV };