function decreaseByaMin(time) {

    let startTime = stringTotime(time);
    if (startTime['min'] > 0) {
        startTime['min'] = startTime['min'] - 1;
    } else if (startTime['min'] == 0) {
        startTime['hour'] = startTime['hour'] - 1;
        startTime['min'] = 59;
    }
    let convertVariable = convertIntoPaddedString(startTime);
    return convertVariable
}

function increaseByaMin(time) {
    let startTime = stringTotime(time);
    if (startTime['min'] < 59) {
        startTime['min'] = startTime['min'] + 1;
    } else if (startTime['min'] == 59) {
        startTime['hour'] = startTime['hour'] + 1;
        startTime['min'] = 0;
    }
    return convertIntoPaddedString(startTime);
}
function dateToString(time){
    let timeString = time.getHour() +":"+ time.getMinute();
    return timeString

}
function convertIntoPaddedString(time) {
    if (time['hour'] > 9 && time['min'] > 9) {
        return time['hour'] + ":" + time['min'];
    } else if (time['hour'] < 10 && time['min'] < 10) {
        return "0" + time['hour'] + ":" + "0" + time['min'];
    } else if (time['hour'] < 10) {
        return "0" + time['hour'] + ":" + time['min'];
    } else if (time['min'] < 10) {
        return time['hour'] + ":" + "0" + time['min'];
    }
}

function stringTotime(time) {
    let startTime = time.split(':');
    startTime[0] = parseInt(startTime[0]);
    startTime[1] = parseInt(startTime[1]);
    return {
        hour: startTime[0],
        min: startTime[1]
    };
}

function calculateFreeTimeList(freeTime, start, end) {
    startint = stringTotime(start);
    endint = stringTotime(end);
    for (i = 0; i < freeTime.length; i++) {
        var elemStart = stringTotime(freeTime[i].start);
        var elemEnd = stringTotime(freeTime[i].end);
        if (startint >= elemStart && endint <= elemEnd) {
            freeTime.splice(i, 1, {
                start: convertIntoPaddedString(elemStart),
                end: start
            }, {
                start: end,
                end: convertIntoPaddedString(elemEnd)
            });
            break;
        }
    }
    return freeTime;
}
module.exports = {
    decreaseByaMin,
    increaseByaMin,
    dateToString,
    calculateFreeTimeList
}