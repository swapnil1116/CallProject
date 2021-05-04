var scanner = new Instascan.Scanner({ video: document.getElementById('preview-qr-code'), scanPeriod: 5, mirror: false });
let cameraIconForQRScan = document.querySelector(".camera-icon-for-qr-scan")
let sectionForQRCodeScanning = document.querySelector(".section-for-qr-code-scanning")
let crossToHideFloatingSection = document.querySelector("#cross-to-hide-floating-section")
let outermost1 = document.getElementById("outermost1")
let switchCamera = document.querySelector(".switch-camera-image")
let num = 1
cameraIconForQRScan.addEventListener("click", (e) => {
    sectionForQRCodeScanning.classList += " now-visible"
    outermost1.classList += " shadowing"
    $(document.body).toggleClass("no-scrolling")
    scanner.addListener('scan', function(content) {
        //- alert(content);
        let newContent = JSON.parse(content)
        if (content !== "") {
            document.querySelector("#name-of-visitor").value = newContent.name
            document.querySelector("#contactNumberOfVisitor").value = newContent.number
            $(".section-for-qr-code-scanning").toggleClass("now-visible");
            $("#outermost1").toggleClass("shadowing")
            $(document.body).toggleClass("no-scrolling")
        }
        document.querySelector(".input-from-qr-code").innerText = newContent.name
            //window.location.href=content;
    });
    Instascan.Camera.getCameras().then(function(cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[1]);
            num = 1
            switchCamera.addEventListener("click", (e) => {
                if (num === 0) {
                    scanner.start(cameras[1]);
                    num = 1
                } else {
                    scanner.start(cameras[0]);
                    num = 0
                }
            })
        } else {
            console.error('No cameras found.');
            alert('No cameras found.');
        }
    }).catch(function(e) {
        console.error(e);
        alert(e);
    });
})
outermost1.addEventListener("click", (e) => {
    $(".section-for-qr-code-scanning").toggleClass("now-visible");
    $("#outermost1").toggleClass("shadowing")
    $(document.body).toggleClass("no-scrolling")
})
crossToHideFloatingSection.addEventListener("click", () => {
    $(".section-for-qr-code-scanning").toggleClass("now-visible");
    $("#outermost1").toggleClass("shadowing")
    $(document.body).toggleClass("no-scrolling")
})