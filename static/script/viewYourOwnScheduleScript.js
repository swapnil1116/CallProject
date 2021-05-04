 date = new Date();

function showContactFormForEventFunction(x) {
  inputDateInFloatingForm=document.querySelector("#date")
  monthName=document.querySelector(".date h1")
  dateClicked=document.querySelector(".clicked")
  $(".event-form").toggleClass("visible-contact-form");
  $("#outermost2").toggleClass("shadowing")
  $(document.body).toggleClass("no-scrolling")
}
// TO HIDE THE FLOATING FORM
outermost2=document.getElementById("outermost2")
outermost2.addEventListener("click",(e)=>{
  $(".floating-contact-for-section").removeClass("visible-contact-form");
  $("#outermost2").removeClass("shadowing");
  $(document.body).removeClass("no-scrolling");
})
crossToHideFloatingEventForm=document.querySelector(".cross-in-event-form")
crossToHideFloatingEventForm.addEventListener("click",(e)=>{
    $(".event-form").toggleClass("visible-contact-form");
    $("#outermost2").toggleClass("shadowing")
    $(document.body).toggleClass("no-scrolling")
})

// TIME PICKER
$('.timerange').on('click', function(e) {
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
      var matches = timerange.match(/([0-9]{2}):([0-9]{2}) (\bAM\b|\bPM\b)-([0-9]{2}):([0-9]{2}) (\bAM\b|\bPM\b)/);
      if( matches.length === 7) {
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

    var html = '<div class="timerangepicker-container">'+
      '<div class="timerangepicker-from">'+
      '<label class="timerangepicker-label">From:</label>' +
      '<div class="timerangepicker-display hour">' +
          '<span class="increment fa fa-angle-up"></span>' +
          '<span class="value">'+('0' + range.from.hour).substr(-2)+'</span>' +
          '<span class="decrement fa fa-angle-down"></span>' +
      '</div>' +
      ':' +
      '<div class="timerangepicker-display minute">' +
          '<span class="increment fa fa-angle-up"></span>' +
          '<span class="value">'+('0' + range.from.minute).substr(-2)+'</span>' +
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
          '<span class="value">'+('0' + range.to.hour).substr(-2)+'</span>' +
          '<span class="decrement fa fa-angle-down"></span>' +
      '</div>' +
      ':' +
      '<div class="timerangepicker-display minute">' +
          '<span class="increment fa fa-angle-up"></span>' +
          '<span class="value">'+('0' + range.to.minute).substr(-2)+'</span>' +
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
      function(){
        var value = $(this).siblings('.value');
        value.text(
          increment(value.text(), 12, 1, 2)
        );
      }
    );

    $('.timerangepicker-container').on(
      'click',
      '.timerangepicker-display.hour .decrement',
      function(){
        var value = $(this).siblings('.value');
        value.text(
          decrement(value.text(), 12, 1, 2)
        );
      }
    );

    $('.timerangepicker-container').on(
      'click',
      '.timerangepicker-display.minute .increment',
      function(){
        var value = $(this).siblings('.value');
        value.text(
          increment(value.text(), 59, 0 , 2)
        );
      }
    );

    $('.timerangepicker-container').on(
      'click',
      '.timerangepicker-display.minute .decrement',
      function(){
        var value = $(this).siblings('.value');
        value.text(
          decrement(value.text(), 59,0, 2)
        );
      }
    );

    $('.timerangepicker-container').on(
      'click',
      '.timerangepicker-display.period .increment, .timerangepicker-display.period .decrement',
      function(){
        var value = $(this).siblings('.value');
        var next = value.text() == "PM" ? "AM" : "PM";
        value.text(next);
      }
    );

  });

  $(document).on('click', e => {

    if(!$(e.target).closest('.timerangepicker-container').length) {
      if($('.timerangepicker-container').is(":visible")) {
        var timerangeContainer = $('.timerangepicker-container');
        if(timerangeContainer.length > 0) {
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
            timeRange.from.hour+":"+
            timeRange.from.minute+" "+    
            timeRange.from.period+"-"+
            timeRange.to.hour+":"+
            timeRange.to.minute+" "+
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


//   // FOR COLORING AND ROTATING THE ARROW DOWN OF MAIN FULL SCREEN NAVBAR AND ALSO DISPLAYING THE LIST ITEMS
//  anchorTagOfMainNavbar=document.getElementsByClassName("main-anchor-tags-having-dropdown-links");
//  arrowsOfMainNavbar=document.getElementsByClassName("arrows-in-main-navbar");
//  nameOfItemsOfMainNavbar=document.getElementsByClassName("name-of-item-in-navbar-span");

// if(screen.width>1050){
//   for(i=0;i<anchorTagOfMainNavbar.length;i++){

//     anchorTagOfMainNavbar[i].addEventListener("mouseenter",(event)=>{
//       event.target.nextElementSibling.classList.add("visibility-class-in-main-navbar")
//       event.target.children[1].children[0].classList.add("colored-and-rotated-arrow-inside-main-navbar");
//       event.target.classList.add("class-for-color-padding")
//       event.target.nextElementSibling.addEventListener("mouseenter",(e)=>{
//         event.target.classList.add("class-for-color-padding")
//         event.target.nextElementSibling.classList.add("visibility-class-in-main-navbar")
//         event.target.children[1].children[0].classList.add("colored-and-rotated-arrow-inside-main-navbar");
//       })
//       event.target.nextElementSibling.addEventListener("mouseleave",(e)=>{
//         event.target.classList.remove("class-for-color-padding")
//         event.target.children[1].children[0].classList.remove("colored-and-rotated-arrow-inside-main-navbar");
//         event.target.nextElementSibling.classList.remove("visibility-class-in-main-navbar")
//       })
//     })
//   }
//   for(i=0;i<anchorTagOfMainNavbar.length;i++){
//     anchorTagOfMainNavbar[i].addEventListener("mouseleave",(event)=>{
//       event.target.classList.remove("class-for-color-padding")
//       event.target.nextElementSibling.classList.remove("visibility-class-in-main-navbar")
//       event.target.children[1].children[0].classList.remove("colored-and-rotated-arrow-inside-main-navbar");
//     })
//   }  
// }