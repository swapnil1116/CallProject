// DELETING AND CONFIRMING THE AUCTION
let deleteAuctionButton=document.getElementsByClassName("delete-auction");
let completeWrapper1OfPage=document.getElementById("wrapper1")
// let deleteAuctionSection=document.querySelectorAll(".delete-auction-section")
let doNotDeleteAuction=document.querySelectorAll(".doNotDeleteAuction")


for(var i=0;i<deleteAuctionButton.length;i++){
  deleteAuctionButton[i].addEventListener("click",function (e){
    deleteAuctionSection=e.target.nextElementSibling;
    deleteAuctionSection.style.display="flex"
    completeWrapper1OfPage.classList+=" shadowing"     
    
  })
  
}
for(i=0;i<deleteAuctionButton.length;i++){
    doNotDeleteAuction[i].addEventListener("click",(e)=>{
      for(var i=0;i<deleteAuctionButton.length;i++){
          doNotDeleteAuction[i].parentNode.parentNode.style.display="none"
          completeWrapper1OfPage.classList.remove("shadowing")
      }  
    })
}  



var realLinksInSidebarDashboard = document.getElementsByClassName("real-links-in-sidebar");
// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < realLinksInSidebarDashboard.length; i++) {
  realLinksInSidebarDashboard[i].addEventListener("click", function(e) {
    console.log(e.target)
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    e.target.className += " active";
  });
}

// FOR SIDE PANEL'S APPEARANCE
if(screen.width<850){
  // FOR SIDE-NAVBAR'S DISAPPEARANCE
  let bars=document.querySelector(".bars")
  let outermost= document.getElementById("outermost2")
  let sidebar=document.querySelector("#sidebar")
  
    outermost.addEventListener("click",(e)=>{
      e.preventDefault();
      bars.className="bars"
      sidebar.className="sidebar-section"
      outermost.classList.remove("shadowing")
    })
  // FOR SIDE-NAVBAR'S APPEARANCE
  function navbarBelow850px(x) {
    x.classList.toggle("change");
    x.classList.toggle("border");
    $("#sidebar").toggleClass("show");
    $("#outermost2").toggleClass("shadowing")
  }
}
// FOR APPEARANCE OF SEARCH BAR IN 980px
let aloneSeacrhIconToUseAfter980px=document.querySelector(".alone-seacrh-icon-to-use-after-980px-inside-nav-contents");
let searchBar=document.getElementById("search-bar");
let buttonHavingCrossToCutSearchBar = document.querySelector(".button-having-cross-to-cut-search-bar");
console.log(aloneSeacrhIconToUseAfter980px);
console.log(searchBar)
aloneSeacrhIconToUseAfter980px.addEventListener("click",(e)=>{
  e.preventDefault();
  searchBar.classList += " visible-search-bar-in-980px"
})
buttonHavingCrossToCutSearchBar.addEventListener("click",(e)=>{
  searchBar.classList.remove("visible-search-bar-in-980px")
})


// FOR COLORING AND ROTATING THE ARROW DOWN OF MAIN FULL SCREEN NAVBAR AND ALSO DISPLAYING THE LIST ITEMS
let anchorTagOfMainNavbar=document.getElementsByClassName("main-anchor-tags-having-dropdown-links");
let arrowsOfMainNavbar=document.getElementsByClassName("arrows-in-main-navbar");
let nameOfItemsOfMainNavbar=document.getElementsByClassName("name-of-item-in-navbar-span");

if(screen.width>1050){
  for(i=0;i<anchorTagOfMainNavbar.length;i++){

    anchorTagOfMainNavbar[i].addEventListener("mouseenter",(event)=>{
      event.target.nextElementSibling.classList.add("visibility-class-in-main-navbar")
      event.target.children[1].children[0].classList.add("colored-and-rotated-arrow-inside-main-navbar");
      event.target.classList.add("class-for-color-padding")
      event.target.nextElementSibling.addEventListener("mouseenter",(e)=>{
        event.target.classList.add("class-for-color-padding")
        event.target.nextElementSibling.classList.add("visibility-class-in-main-navbar")
        event.target.children[1].children[0].classList.add("colored-and-rotated-arrow-inside-main-navbar");
      })
      event.target.nextElementSibling.addEventListener("mouseleave",(e)=>{
        event.target.classList.remove("class-for-color-padding")
        event.target.children[1].children[0].classList.remove("colored-and-rotated-arrow-inside-main-navbar");
        event.target.nextElementSibling.classList.remove("visibility-class-in-main-navbar")
      })
    })
  }
  for(i=0;i<anchorTagOfMainNavbar.length;i++){
    anchorTagOfMainNavbar[i].addEventListener("mouseleave",(event)=>{
      event.target.classList.remove("class-for-color-padding")
      event.target.nextElementSibling.classList.remove("visibility-class-in-main-navbar")
      event.target.children[1].children[0].classList.remove("colored-and-rotated-arrow-inside-main-navbar");
    })
  }  
}


function showAddNewCalendarFormFunction(x) {
  inputDateInFloatingForm=document.querySelector("#date")
  monthName=document.querySelector(".date h1")
  dateClicked=document.querySelector(".clicked")
  $(".add-new-calendar-form").toggleClass("visible-contact-form");
  $("#outermost2").toggleClass("shadowing")
  $(document.body).toggleClass("no-scrolling")
}

// TO HIDE THE FLOATING FORM
outermost2=document.getElementById("outermost2")
outermost2.addEventListener("click",(e)=>{
  $(".floating-contact-for-section").removeClass("visible-contact-form");
  $("#outermost2").removeClass("shadowing")
  $(document.body).removeClass("no-scrolling")
  console.log(e.target)
})
crossToHideFloatingReminderForm=document.querySelector(".cross-in-reminder-form")
crossToHideFloatingReminderForm.addEventListener("click",(e)=>{
  console.log(e.target)
  $(".add-new-calendar-form").removeClass("visible-contact-form");
  $("#outermost2").removeClass("shadowing")
  $(document.body).removeClass("no-scrolling")
})
