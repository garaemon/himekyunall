// downloader.js
var AMEBLO_START_YEAR = 2011;
var AMEBLO_START_MONTH = 12;    //start with 1
var END_YEAR = (new Date()).getFullYear();
var END_MONTH = (new Date()).getMonth() + 1;
var AMEBLO_ACCOUNT = "__AMEBLO_ACCOUNT";

// 1. first of all, get the imagelist page from month and year.
// 2. access the top image page
// 3. DL the image
// 4. go to the next page from the html at 2.
// 5. loop 3-4 til the end of the page

//(function(){var s2=document.createElement("script");s2.charset="UTF-8";s2.src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js";document.body.appendChild(s2);})()

var files_num = 0;

function clearAllEntity() {
  $("body").html("<ol></ol>");
}


function dispatchMouseEvents(opt) {
  var evt = document.createEvent('MouseEvents');
  evt.initMouseEvent(opt.type, opt.canBubble||true, opt.cancelable||true, opt.view||window, 
                     opt.detail||0, opt.screenX||0, opt.screenY||0, opt.clientX||0, opt.clientY||0, 
                     opt.ctrlKey||false, opt.altKey||false, opt.shiftKey||false, opt.metaKey||false, 
                     opt.button||0, opt.relatedTarget||null);
  opt.target.dispatchEvent(evt);
  return evt;
}
function getTopImagePage(cb) {
    var now = new Date();
    $.ajax({
        url: "http://ameblo.jp/" + AMEBLO_ACCOUNT + "/imagelist-" + noge.getFullYear()
            + ("0" + now.getMonth()).slice(-2) + "-" + index + ".html",
        error: function(e) {
            alert("something woring with getting top image list page");
        },
        success: function(data) {
            var link = $(data).find("#imageList li a").attr("href");
            cb(link);
        }
    });
};

function getFileLoop(target_link) {
    $.ajax({
        url: target_link,
        error: function(e) {
            alert("somethign wrong with getting " + target_link);
        },
        success: function(data) {
            var link = $(data).find("#orgImg").attr("src");
            var link = $(this).attr("src");
            $("ol").append('<li><a href="' + link + '">' + link + "</a></li>");
            Array.prototype.slice.call(document.querySelectorAll(
                'a[href$="' + link + '"]')).some(function(e) {
                    dispatchMouseEvents({ type:'click', altKey:true, target:e, button:0 });
                });
            files_num = files_num + 1;
            // get the next link
            var next_atag = $(data).find("#selectImg").parent().next().find("a");
            if (next_atag && next_atag.length > 0) {
                getFileLoop(next_atag.href("href"));
            }
            else {
                alert("done " + files_num);
            }
        }
    });
};

function main() {
    clearAllEntity();
    getTopImagePage(function(toplink) {
        getFileLoop(toplink);
    });
    //getFilesLoop(AMEBLO_START_YEAR, AMEBLO_START_MONTH, 1);
};

$(function() {
  main();
});
