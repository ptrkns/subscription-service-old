import { customAlphabet } from "nanoid";

function PackageAssembler() {
  
    function calculatePrice(services) {
        let sum = 0;
        for (let i in services) {
            sum += services[i].price;
        }
        return sum;
    }

    const generateRandomID = customAlphabet('0123456789', 5);

    function assemblePackage(userID, isActive, services, price, duration, sDate, eDate) {
        const newPackage = {
            packageID: generateRandomID(),
            userId: userID,
            isActive: isActive,
            services: services,
            price: price,
            duration: duration,
            startDate: sDate,
            endDate: eDate
        };
        return newPackage;
    };

    function recreatePackage(packageID, userID, isActive, services, price, duration, sDate, eDate) {
        const newPackage = {
            packageID: packageID,
            userId: userID,
            isActive: isActive,
            services: services,
            price: price,
            duration: duration,
            startDate: sDate,
            endDate: eDate
        };
        return newPackage;
    };

    return {
        calculatePrice,
        assemblePackage,
        recreatePackage
    };
};

export default PackageAssembler;