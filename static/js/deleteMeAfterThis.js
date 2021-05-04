let dateList =[{date:"2020-12-12",schedule:["party","sleep"], count:2},{date:"2020-12-04",schedule:["walking","breakfast"], count:2},{date:"2020-11-19",schedule:["doctor"], count:1},{date:"2020-11-11",schedule:["gym","doctor"], count:2}];
// let dateList = schedules;
function find(list, element) {
    var found = false;
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].date == element) {
            found = true;
            break;
        }
    }
    return {
        found: found,
        index: i
    };
}
let date = new Date();
let renderCalendar = () => {
    date.setDate(1);
    let monthName = document.querySelector(".date h1")
    let monthInLowerCase = (monthName.innerText).toLowerCase()
    let monthInNumber = date.getMonth(monthInLowerCase) + 1
    if (monthInNumber < 10) {
        monthInNumber = '0' + monthInNumber;
    }
    const monthDays = document.querySelector(".days");
    const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();
    const prevLastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        0
    ).getDate();
    const firstDayIndex = date.getDay();
    const lastDayIndex = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDay();
    let nextDays = 7 - lastDayIndex - 1;
    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    document.querySelector("#month").value = `${months[date.getMonth()]}`;
    document.querySelector(".date p").innerHTML = new Date().toDateString();
    let monthInput = document.querySelector("#month").value;
    let yearInput = document.querySelector("#year").value;
    if(date.getMonth() === 0){
        document.querySelector(".date h1").innerHTML = `January ${date.getFullYear()}`;
    }
    else{
        document.querySelector(".date h1").innerHTML = `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    let days = "";
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<a class="prev-date"><span> ${prevLastDay - x + 1} </span></a>`;
    }
    for (let i = 1; i <= lastDay; i++) {
        if (i < 10) {
            i = "0" + i
        }
        let urlForViewingSchedule = `${date.getFullYear()}-${monthInNumber}-${i}`
        let pageURL = $(location).attr("href");
        // console.log(pageURL)
        let splittedURL=pageURL.split("/")
        // console.log(splittedURL)
        let idOfCalendarForSecurityVehicleRecord=splittedURL[5]
        if (
            i === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear()
        ) {
            let found = find(dateList, urlForViewingSchedule);
            if (found['found'] == true) {
                let index = found['index'];
                let a = ``;
                for (let q = 0; q < dateList[index].count; q++) {
                    a += `<div  class="events-inside-date-box-in-calendar-itself">${dateList[index].schedule[q]}</div>`;
                }
                days +=
                    `<a  class="today clicked all-dates" href='${idOfCalendarForSecurityVehicleRecord}/${urlForViewingSchedule}' id=${idForViewingSchedule}>
                    <span>${i}</span>
                    ` + a + `
                    <div class="total-number-of-events-on-the-date">${dateList[index].count}</div>
                </a>`;
            } else {
                days += `<a  class="today clicked all-dates" href='${idOfCalendarForSecurityVehicleRecord}/${urlForViewingSchedule}' id=${idForViewingSchedule}>
                <span>${i}</span>
            </a>`;
            }
        } else {
            let found = find(dateList, urlForViewingSchedule);
            if (found['found'] == true) {
                let index = found['index'];
                let a = ``;
                for (let q = 0; q < dateList[index].count; q++) {
                    a += `<div class="events-inside-date-box-in-calendar-itself">${dateList[index].schedule[q]}</div>`;
                }
                days +=
                    `<a  class="other-Dates all-dates" href='${idOfCalendarForSecurityVehicleRecord}/${urlForViewingSchedule}' id=${idForViewingSchedule}>
                    <span>${i}</span>
                    ` + a + `
                    <div class="total-number-of-events-on-the-date">${dateList[index].count}</div>
                </a>`;
            } else {
                days += `<a  class="other-Dates all-dates" href='${idOfCalendarForSecurityVehicleRecord}/${urlForViewingSchedule}' id=${idForViewingSchedule}>
                <span>${i}</span>
            </a>`;
            }
        }
    }
    if (nextDays >= 1) {
        for (let j = 1; j <= nextDays; j++) {
            days += `<a class="next-date"><span>${j}</span></a>`;
            monthDays.innerHTML = days;
        }
    } else {
        for (let k = 0; k <= nextDays; k++) {
            days += `<a class="invisible"></a>`;
            monthDays.innerHTML = days;
        }
    }
};

let goToButton = document.querySelector(".button-to-load-page");

goToButton.addEventListener("click", (e) => {
    let monthInput = document.querySelector("#month").value;
    let yearInput = document.querySelector("#year").value;
    console.log(monthInput)
    console.log(yearInput)
    let myMonths = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    console.log(myMonths.indexOf(monthInput))
    date.setMonth(myMonths.indexOf(monthInput))
    date.setFullYear(yearInput)
    renderCalendar();
})
document.querySelector(".prev").addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1)
    console.log(date.getMonth())
    renderCalendar();

});
  
document.querySelector(".next").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});
renderCalendar();


//FOR RESTRICTING THE EVENT NAME TO SOME WORDS AND HAVE THESE "..."
let eventNameInsideDate = document.querySelectorAll(".events-inside-date-box-in-calendar-itself")
console.log(eventNameInsideDate[0].innerText.length)


// FOR CLICKING ON THE DATES TO MAKE THEM HAVE A BORDER
// let todaysDate=document.querySelector(".today")
function addingClickedProperties() {
    let allDates = document.querySelectorAll(".all-dates")
    for (i = 0; i < allDates.length; i++) {
        allDates[i].addEventListener("click", (e) => {
            console.log(e.target)
            if (e.target.classList.contains("clicked")) {
                console.log("have class")
            } else {
                let currentClicked = document.querySelector(".clicked");
                if (currentClicked == null) {} else {
                    currentClicked.classList.remove("clicked");
                }
                console.log("class added");
                e.target.classList.add("clicked")
            }
        })
    }
}
addingClickedProperties();
let nextArrow = document.querySelector(".next")
let prevArrow = document.querySelector(".prev")
nextArrow.addEventListener("click", () => {
    addingClickedProperties()
})
prevArrow.addEventListener("click", () => {
    addingClickedProperties();
})

// TIME PICKER
$('.timerange').on('click', function (e) {
    e.stopPropagation();
    var input = $(this).find('.time-input');
    var now = new Date();
    var hours = now.getHours();
    var period = "PM";
    if (hours < 12) {
        period = "AM";
    } else {
        hours = hours - 11;
    }
    var minutes = now.getMinutes();
    var range = {
        from: {
            hour: hours,
            minute: minutes,
            period: period
        },
        to: {
            hour: hours,
            minute: minutes,
            period: period
        }
    };
    if (input.val() !== "") {
        var timerange = input.val();
        var matches = timerange.match(
            /([0-9]{2}):([0-9]{2}) (\\bAM\b|\bPM\b)-([0-9]{2}):([0-9]{2}) (\bAM\b|\bPM\b)/);
        if (matches.length === 7) {
            range = {
                from: {
                    hour: matches[1],
                    minute: matches[2],
                    period: matches[3]
                },
                to: {
                    hour: matches[4],
                    minute: matches[5],
                    period: matches[6]
                }
            }
        }
    };
    console.log(range);
    var html = '<div class="timerangepicker-container">' +
        '<div class="timerangepicker-from">' +
        '<label class="timerangepicker-label">From:</label>' +
        '<div class="timerangepicker-display hour">' +
        '<span class="increment fa fa-angle-up"></span>' +
        '<span class="value">' + ('0' + range.from.hour).substr(-2) + '</span>' +
        '<span class="decrement fa fa-angle-down"></span>' +
        '</div>' +
        ':' +
        '<div class="timerangepicker-display minute">' +
        '<span class="increment fa fa-angle-up"></span>' +
        '<span class="value">' + ('0' + range.from.minute).substr(-2) + '</span>' +
        '<span class="decrement fa fa-angle-down"></span>' +
        '</div>' +
        ':' +
        '<div class="timerangepicker-display period">' +
        '<span class="increment fa fa-angle-up"></span>' +
        '<span class="value">PM</span>' +
        '<span class="decrement fa fa-angle-down"></span>' +
        '</div>' +
        '</div>' +
        '<div class="timerangepicker-to">' +
        '<label class="timerangepicker-label">To:</label>' +
        '<div class="timerangepicker-display hour">' +
        '<span class="increment fa fa-angle-up"></span>' +
        '<span class="value">' + ('0' + range.to.hour).substr(-2) + '</span>' +
        '<span class="decrement fa fa-angle-down"></span>' +
        '</div>' +
        ':' +
        '<div class="timerangepicker-display minute">' +
        '<span class="increment fa fa-angle-up"></span>' +
        '<span class="value">' + ('0' + range.to.minute).substr(-2) + '</span>' +
        '<span class="decrement fa fa-angle-down"></span>' +
        '</div>' +
        ':' +
        '<div class="timerangepicker-display period">' +
        '<span class="increment fa fa-angle-up"></span>' +
        '<span class="value">PM</span>' +
        '<span class="decrement fa fa-angle-down"></span>' +
        '</div>' +
        '</div>' +
        '</div>';
    $(html).insertAfter(this);
    $('.timerangepicker-container').on(
        'click',
        '.timerangepicker-display.hour .increment',
        function () {
            var value = $(this).siblings('.value');
            value.text(
                increment(value.text(), 12, 1, 2)
            );
        }
    );
    $('.timerangepicker-container').on(
        'click',
        '.timerangepicker-display.hour .decrement',
        function () {
            var value = $(this).siblings('.value');
            value.text(
                decrement(value.text(), 12, 1, 2)
            );
        }
    );
    $('.timerangepicker-container').on(
        'click',
        '.timerangepicker-display.minute .increment',
        function () {
            var value = $(this).siblings('.value');
            value.text(
                increment(value.text(), 59, 0, 2)
            );
        }
    );
    $('.timerangepicker-container').on(
        'click',
        '.timerangepicker-display.minute .decrement',
        function () {
            var value = $(this).siblings('.value');
            value.text(
                decrement(value.text(), 59, 0, 2)
            );
        }
    );
    $('.timerangepicker-container').on(
        'click',
        '.timerangepicker-display.period .increment, .timerangepicker-display.period .decrement',
        function () {
            var value = $(this).siblings('.value');
            var next = value.text() == "PM" ? "AM" : "PM";
            value.text(next);
        }
    );
});
$(document).on('click', e => {
    if (!$(e.target).closest('.timerangepicker-container').length) {
        if ($('.timerangepicker-container').is(":visible")) {
            var timerangeContainer = $('.timerangepicker-container');
            if (timerangeContainer.length > 0) {
                var timeRange = {
                    from: {
                        hour: timerangeContainer.find('.value')[0].innerText,
                        minute: timerangeContainer.find('.value')[1].innerText,
                        period: timerangeContainer.find('.value')[2].innerText
                    },
                    to: {
                        hour: timerangeContainer.find('.value')[3].innerText,
                        minute: timerangeContainer.find('.value')[4].innerText,
                        period: timerangeContainer.find('.value')[5].innerText
                    },
                };
                timerangeContainer.parent().find('.time-input').val(
                    timeRange.from.hour + ":" +
                    timeRange.from.minute + " " +
                    timeRange.from.period + "-" +
                    timeRange.to.hour + ":" +
                    timeRange.to.minute + " " +
                    timeRange.to.period
                );
                timerangeContainer.remove();
            }
        }
    }
});

function increment(value, max, min, size) {
    var intValue = parseInt(value);
    if (intValue == max) {
        return ('0' + min).substr(-size);
    } else {
        var next = intValue + 1;
        return ('0' + next).substr(-size);
    }
}

function decrement(value, max, min, size) {
    var intValue = parseInt(value);
    if (intValue == min) {
        return ('0' + max).substr(-size);
    } else {
        var next = intValue - 1;
        return ('0' + next).substr(-size);
    }
}


// FOR SIDE PANEL'S APPEARANCE
if (screen.width < 850) {
    // FOR SIDE-NAVBAR'S DISAPPEARANCE
    let bars = document.querySelector(".bars")
    let outermost = document.getElementById("outermost2")
    let sidebar = document.querySelector("#sidebar")
    bars.addEventListener("click", (e) => {
        if (outermost.classList.contains("shadowing")) {
            console.log("Shadwoing removed")
            outermost.classList.remove("shadowing")
        } else {
            outermost.classList += " shadowing"
            console.log("shadwoing added");
        }
    })
    outermost.addEventListener("click", (e) => {
        e.preventDefault();
        bars.className = "bars";
        sidebar.className = "sidebar-section";
        if (outermost.classList.contains("shadowing")) {
            console.log("Shadwoing removed")
            outermost.classList.remove("shadowing")
        } else {
            outermost.classList += " shadowing"
            console.log("shadwoing added");
        }
    })
    // FOR SIDE-NAVBAR'S APPEARANCE
    function navbarBelow850px(x) {
        x.classList.toggle("change");
        x.classList.toggle("border");
        $("#sidebar").toggleClass("show");
        // $("#outermost2").toggleClass("shadowing")
    }
}