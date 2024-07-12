
const DateHandler = () => {
  
    function getCurrentDate() {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth());
        return currentDate;
    };

    function getEndDate(duration) {
        const currentDate = getCurrentDate();
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + duration);
        return newDate;
    };

    function formatDate(date, action) {
        switch(action){
            case "format": {
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                return `${year}.${month}.${day}`;
            }
            case "string": {
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                return JSON.stringify(`${year}.${month}.${day}`);
            }
            case "date": {
                    const values = date.split('.');
                    
                    const year = Number(values[0]);
                    const month = Number(values[1])-1;
                    const day = Number(values[2]);
                    //console.log("Parsed values:", year, month, day);
                    
                    const newDate = new Date(year, month, day);
                    //console.log("newDate:", newDate);
    
                    return newDate;
            }
            default:{break;}
        }
    };

    return {
        getCurrentDate,
        getEndDate,
        formatDate,
    };
};

export default DateHandler;