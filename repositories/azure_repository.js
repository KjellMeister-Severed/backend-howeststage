const azureService = require("../services/azure_service");

function addBusiness(company) {
    return azureService.fetchFromGraph("POST", "bookingBusinesses", {
        address: {
            city: company.city,
            street: company.address,
            postalCode: company.postalcode,
            countryOrRegion: "Belgium"
        },
        displayName: company.name,
        email: company.email,
        isPublished: true,
        phone: company.phonenumber,
        webSiteUrl: company.website
    });
}

function deleteBusiness() {
}

module.exports = { addBusiness }