var uid;
var currentStop;
var PbDepConnMap;
var currentDeparture;
var formData;
var currentVehicle;
var gkhead = new Image;
var city = "Geneva";
var rootURL = "https://cityrunner-server.genav.ch";
// var rootURL = "..";
routes = [
  {
    path: '/',
    url: './index.html',
    on: {
        pageInit: function (e, page) {
            if (uid == null) {
                if (getCookie("uid") == "") {
                    app.dialog.progress();
                    $.get(rootURL + "/hosted_app-V2/users.php?getUID" + "&_=" + new Date().getTime(), function (data) {
                        setCookie("uid", JSON.parse(data).uid,36525);
                        uid = getCookie("uid");
                        app.dialog.close();
                        loadHome();
                    });
                } else {
                    uid = getCookie("uid");
                    loadHome();
                }
            } else {
                loadHome();
            }
        }
    }
  },
  {
    path: '/stops/',
    url: './pages/stops.html',
    on: {pageInit: function (e, page) {
            app.dialog.progress();
            $.get(rootURL + "/hosted_app-V2/processODAPI.php?stops" + "&_=" + new Date().getTime(), function (data) {
                var j = JSON.parse(data);
                var virtualList = app.virtualList.create({
                    // List Element
                    el: '.virtual-list',
                    // Pass array with items
                    items: j,
                    // Custom search function for searchbar
                    searchAll: function (query, items) {
                        var found = [];
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].stopName.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].stopCode.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].linesT.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].stopNameNoChars.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
                        }
                        if (query.toLowerCase() == "genavstaff") {
                            window.open("../staff/app/");
                        }
                        return found; //return array with matched indexes
                    },
                    // List item Template7 template
                    itemTemplate:
                    '<li>' +
                    '<a href="/stop/?s={{stopCode}}" onclick="currentStop = \'{{stopCode}}\'" class="item-link item-content">' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">{{stopName}}</div>' +
                    '</div>' +
                    '<div class="item-subtitle">{{stopCode}}</div>' +
                    '<div class="item-text tablet-only">{{linesP}}</div>' +
                    '</div>' +
                    '</a>' +
                    '</li>',
                    // Item height
                    height: app.theme === 'ios' ? 95 : 105,
                });
                app.dialog.close();
            });
        }
    }
  },
  {
    path: '/vehicleInfo/',
    url: './pages/vehicleInfo.html',
    on: {
        pageInit: function (e, page) {
            app.dialog.progress();
            setTimeout(function () {
                $.get(rootURL + "/hosted_app-V2/processODAPI.php?vehicleInfo&v=" + currentVehicle + "&_=" + new Date().getTime(), function (data) {
                    console.log(data);
                    for (var i = 0; i < data.pictures.images.length; i++) {
                        $("#images").append("<div class=\"swiper-slide vinfo-slides\"><img style=\"display: block; margin: auto; width: 100%; max-width: 1080px; vertical-align: middle;\" src=\"" + data.pictures.images[i] + "\"/></div>");
                    }
                    var swiper = app.swiper.create('.swiper-container', {});
                    $("#brand")[0].innerHTML = data.Brand;
                    $("#model")[0].innerHTML = data.Model;
                    $("#owner")[0].innerHTML = data.Owner;
                    $("#lines")[0].innerHTML = data.lines;
                    $("#seats")[0].innerHTML = data.Pax_seated;
                    $("#standing")[0].innerHTML = data.Pax_Standing;
                    $("#pax")[0].innerHTML = data.Pax_total;
                    $("#plate")[0].innerHTML = data.Licence_plate;
                    $("#introduction")[0].innerHTML = data.Year_of_introduction;
                    $("#constroction")[0].innerHTML = data.Year_of_construction_if_found;
                    $("#comment")[0].innerHTML = data.Comment;
                    $("#vehicle")[0].innerHTML = currentVehicle;
                    var vinfoPB = app.photoBrowser.create({
                        photos : data.pictures.images,
                        type: 'popup'
                    });
                    $$('.vinfo-slides').on('click', function () {
                        vinfoPB.open();
                    });
                    app.dialog.close();
                });
            }, 10);
        }
    }
  },
  {
    path: '/directions/',
    url: './pages/directions.html',
    on: {
        pageInit: function (e, page) {
            var today = new Date();
            var pickerInline = app.picker.create({
                inputEl: '#picker-date',
                toolbar: true,
                rotateEffect: true,
                value: [
                    today.getDate(),
                    today.getMonth()+1 < 10 ? '0' + today.getMonth()+1 : today.getMonth()+1,
                    today.getFullYear(),
                    today.getHours(),
                    today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
                ],
                formatValue: function (values, displayValues) {
                    return displayValues[0] + '-' + values[1] + '-' + values[2] + ' ' + values[3] + ':' + values[4];
                },
                width: 532,
                cols: [
                    // Days
                    {
                        values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
                        width: 64
                    },
                    // Months
                    {
                        values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),
                        displayValues: ('January February March April May June July August September October November December').split(' '),
                        textAlign: 'left',
                        width: 180
                    },
                    // Years
                    {
                        values: (function () {
                            var arr = [];
                            for (var i = 1950; i <= 2030; i++) { arr.push(i); }
                            return arr;
                        })(),
                        width: 108
                    },
                    // Space divider
                    {
                        divider: true,
                        content: '&nbsp;&nbsp;',
                        width: 25
                    },
                    // Hours
                    {
                        values: (function () {
                            var arr = [];
                            for (var i = 0; i <= 23; i++) { arr.push(i < 10 ? '0' + i : i); }
                            return arr;
                        })(),
                        width: 64
                    },
                    // Divider
                    {
                        divider: true,
                        content: ':',
                        width: 25
                    },
                    // Minutes
                    {
                        values: (function () {
                            var arr = [];
                            for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                            return arr;
                        })(),
                        width: 64
                    }
                ],
                on: {
                    change: function (picker, values, displayValues) {
                        var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
                        if (values[1] > daysInMonth) {
                            picker.cols[1].setValue(daysInMonth);
                        }
                    },
                }
            });
            app.dialog.progress();
            $.get(rootURL + "/hosted_app-V2/processODAPI.php?stops" + "&_=" + new Date().getTime(), function (data) {
                var j = JSON.parse(data);
                var list = "<option value=\"\" disabled selected>Please Select A Stop</option>";
                for (var i = 0; i < j.length; i++) {
                    list += "<option value=\"" + j[i].stopCode + "\">" + j[i].stopName + " - " + j[i].stopCode + "</option>\n";
                }
                document.getElementById("orrList").innerHTML = list;
                document.getElementById("destList").innerHTML = list;
                $$('form.form-ajax-submit').on('formajax:success', function (e) {
                    var xhr = e.detail.xhr; // actual XHR object

                    var data = e.detail.data; // Ajax response from action file
                    // do something with response data
                    alert ("done" + xhr);
                });
                app.dialog.close();
            });
        }
    }
  },
  {
    path: '/directionsRTN/',
    url: './pages/directionsRTN.html',
    on: {
        pageInit: function (e, page) {
            app.dialog.progress();
            // $.get(rootURL + "/hosted_app-V2/getDirections.php?Origin=CHLA&Destination=SGGA&time=8-11-2018%2020%3A04", function (data) {
            console.log(formData);
            $.get(rootURL + "/hosted_app-V2/getDirections.php?" + $('#directionForm').serialize() + "&_=" + new Date().getTime(), function (data) {
                var j = (data);
                $("#directionsMap").attr("src", j.initMap);
                for (var i = 0; i < j.routes.length; i++) {
                    var steps = "";
                    for (var ii = 0; ii < j.routes[i].steps.length; ii++ ) {
                        var intermediates = "";
                        // console.log(j.routes[i].steps[ii]);
                        for (var iii = 0; iii < j.routes[i].steps[ii].passList.length; iii++) {
                            intermediates = intermediates + "<li>\n" +
                                "      <a href=\"/stop/?s=" + j.routes[i].steps[ii].passList[iii].stopCode + "\" onclick=\"currentStop = '" + j.routes[i].steps[ii].passList[iii].stopCode + "'\" class=\"item item-content\">\n" +
                                "        <div class=\"item-inner\">\n" +
                                "          <div class=\"item-title\">" + j.routes[i].steps[ii].passList[iii].stopName + " - " + j.routes[i].steps[ii].passList[iii].stopCode + "</div>\n" +
                                "          <div class=\"item-after\">" + j.routes[i].steps[ii].passList[iii].uTimestamp + "</div>\n" +
                                "        </div>\n" +
                                "      </a>\n" +
                                "    </li>";
                        }
                        steps = steps + "<li class=\"accordion-item\"><a href=\"#\" class=\"item-content item-link\">\n" +
                        "                      <div class=\"item-inner\">\n" +
                        "                          <div class=\"item-title\">" + j.routes[i].steps[ii].line + "<i style=\"position: relative; top: 4px;\" class=\"f7-icons\">arrow_right</i>&nbsp;" + j.routes[i].steps[ii].destination + " to " + j.routes[i].steps[ii].to + "</div>\n" +
                        "                          <div class='item-after'>" + j.routes[i].steps[ii].time + "</div>" +
                        "                      </div></a>\n" +
                        "                      <div class=\"accordion-item-content\">\n" +
                        "                          <div class=\"block\"><div class=\"list links-list\">\n" +
                        "              <ul>\n" +
                        "                              " + intermediates +  "\n" +
                        "                          </ul>" +
                        "</div></div>\n" +
                        "                      </div>\n" +
                        "                  </li>";
                    }
                    $("#directionsSteps").append("<li class=\"accordion-item\"><a onclick='$(\"#directionsMap\").attr(\"src\", \"" + j.routes[i].map + "\");' href=\"#\" class=\"item-content item-link\">\n" +
                    "                      <div class=\"item-inner\">\n" +
                    "                          <div class=\"item-title\">" + j.routes[i].stops + "</div>\n" +
                    "                          <div class='item-after'>" + j.routes[i].time + "</div>" +
                    "                      </div></a>\n" +
                    "                      <div class=\"accordion-item-content\">\n" +
                    "                          <div class=\"block\"><div class=\"list accordion-list\">\n" +
                        "              <ul>\n" +
                    "                              " + steps + "\n" +
                    "                          </ul>" +
                        "</div></div>\n" +
                    "                      </div>\n" +
                    "                  </li>");
                    app.dialog.close();
                }
            });
        }
    }
  },
  {
    path: '/disruptions/',
    url: './pages/disruptions.html',
    on: {
        pageInit: function (e, page) {
            app.dialog.progress();
            $.get(rootURL + "/hosted_app-V2/processODAPI.php?disruptions" + "&_=" + new Date().getTime(), function (data) {
                var j = JSON.parse(data);
                document.getElementById("disurptions").innerHTML = "";
                for (var i = 0; i < j.length; i++) {
                    document.getElementById("disurptions").innerHTML += "<li>\n" +
                        "                    <a href=\"#\" onclick='showDisruption(this)' class=\"item-link item-content\">\n" +
                        "                        <div class=\"item-inner\">\n" +
                        "                            <div class=\"item-title-row\">\n" +
                        "                                <div class=\"item-title\">" + j[i].title + "</div>\n" +
                        "                                <div class=\"item-after\">" + j[i].time + "</div>\n" +
                        "                            </div>\n" +
                        "                            <div class=\"item-subtitle\">" + j[i].text + "</div>\n" +
                        "                            <div class=\"item-text\">" + j[i].line + "</div>\n" +
                        "                        </div>\n" +
                        "                    </a>\n" +
                        "                </li>";
                }
                app.dialog.close();
            });
        }
    }
  },
  {
    path: '/departure/',
    url: './pages/departure.html',
    on: {
        pageInit: function (e, page) {
            app.dialog.progress();
            var query = window.location.hash.split("?")[1];
            if (query == null) {
                if (getCookie("lastDeparture") != null) {
                    currentDeparture = getCookie("lastDeparture");
                }
            } else {
                var qs = parse_query_string(query);
                if (qs.d == null) {
                    if (getCookie("lastDeparture") != null) {
                        currentDeparture = getCookie("lastDeparture");
                    }
                } else {
                    currentDeparture = qs.d;
                }
            }
            // $.get("http://cityrunner-server.genav.ga/TPG/?dc=" + currentDeparture, function (data) {
            $.get(rootURL + "/hosted_app-V2/processODAPI.php?dc=" + currentDeparture + "&_=" + new Date().getTime(), function (data) {
                setCookie("lastDeparture", currentDeparture, 18250);
                console.log(data);
                document.getElementById("depVCImg")  .setAttribute("src", data.vehicleImage);
                document.getElementById("depVCImg")  .style.background = "url('" + data.vehicleImageT + "')";
                document.getElementById("depConnMap").src = data.platformImage;
                if (document.getElementById("nav") != null) {
                    document.getElementById("nav").style.color = "#" + data.textCol;
                    document.getElementById("nav").style.background = "#" + data.backCol;
                    document.getElementById("nav").style.background = "#" + data.backCol;
                }
                document.getElementById("title").innerHTML = data.lineCode + " &nbsp;&nbsp;<i style=\"position: relative; top: 4px;\" class=\"f7-icons\">arrow_right</i>&nbsp;&nbsp; " + data.destination;
                document.getElementById("vehicleNo").innerHTML = data.vehicle;
                document.getElementById("platformNo").innerHTML = data.platformNo;
                document.getElementById("time").innerHTML = data.arrivalTime;
                document.getElementById("destinationName").innerHTML = data.destination;
                document.getElementById("stopDATT").innerHTML = data.stopDATT;
                document.getElementById("vcDATT").innerHTML = data.vcDATT;
                var backBtn = window.btoa("<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z' fill='#" + data.textCol + "'/></svg>");
                document.getElementById("backNav").style.backgroundImage = "url('data:image/svg+xml;base64," + backBtn + "')";
                PbDepConnMap = app.photoBrowser.create({
                    photos : [
                        data.platformImage,
                        data.vehicleImage
                    ],
                    type: 'popup'
                });
                $$('#depConnMap').on('click', function () {
                    PbDepConnMap.open();
                });
                var template = $$('#depsList1').html();

// compile it with Template7
                var compiledTemplate = Template7.compile(template);

// Now we may render our compiled template by passing required context
                var html = compiledTemplate(data);
                $$('#depsList1Container').html(html);
                template = $$('#depsList2').html();

// compile it with Template7
                compiledTemplate = Template7.compile(template);

// Now we may render our compiled template by passing required context
                html = compiledTemplate(data);
                $$('#depsList2Container').html(html);
                app.dialog.close();
            });
        }
    }
  },
  {
    path: '/Fstops/',
    url: './pages/Fstops.html',
    on: {
        pageInit: function (e, page) {
            app.dialog.progress();
            $.get(rootURL + "/hosted_app-V2/processODAPI.php?Fstops&u=" + uid + "&_=" + new Date().getTime(), function (data) {
                var j = JSON.parse(data);
                var virtualList = app.virtualList.create({
                    // List Element
                    el: '.virtual-list-Fstops',
                    // Pass array with items
                    items: j,
                    // Custom search function for searchbar
                    searchAll: function (query, items) {
                        var found = [];
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].stopName.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].stopCode.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].linesT.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
                        }
                        return found; //return array with mathced indexes
                    },
                    // List item Template7 template
                    itemTemplate:
                    '<li>' +
                    '<a href="/stop/?s={{stopCode}}" onclick="currentStop = \'{{stopCode}}\'" class="item-link item-content">' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">{{stopName}}</div>' +
                    '</div>' +
                    '<div class="item-subtitle">{{stopCode}}</div>' +
                    '<div class="item-text tablet-only">{{linesP}}</div>' +
                    '</div>' +
                    '</a>' +
                    '</li>',
                    // Item height
                    height: app.theme === 'ios' ? 95 : 105,
                });
                app.dialog.close();
            });
        }
    }
  },
  {
    path: '/stop/',
    url: './pages/stop.html',
    on: {
        pageInit: function (e, page) {
            app.dialog.progress();
            var query = window.location.hash.split("?")[1];
            if (query == null) {
                if (getCookie("lastStop") != null) {
                    currentStop = getCookie("lastStop");
                }
            } else {
                var qs = parse_query_string(query);
                if (qs.s == null) {
                    if (getCookie("lastStop") != null) {
                        currentStop = getCookie("lastStop");
                    }
                } else {
                    currentStop = qs.s;
                }
            }
            // var query = getQueryParams(document.location.search);
            $.get(rootURL + "/hosted_app-V2/processODAPI.php?stop&s=" + currentStop + "&_=" + new Date().getTime(), function (data) {
                setCookie("lastStop",currentStop, 18250);
                var j = JSON.parse(data);
                document.getElementById("stopTitle").innerHTML = j.stop.stopName + " - " + j.stop.stopCode;
                var virtualList = app.virtualList.create({
                    // List Element
                    el: '.depsVirtual-list',
                    // Pass array with items
                    items: j.departures,
                    // Custom search function for searchbar
                    searchAll: function (query, items) {
                        var found = [];
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].line.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].destination.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].vehicle.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
                        }
                        return found; //return array with mathced indexes
                    },
                    // List item Template7 template
                    itemTemplate:
                    '<li style="color: #{{txtCol}}; background: #{{primCol}};">' +
                    '<a href="/departure/?d={{depCde}}" onclick="' + "currentDeparture = '{{depCde}}'" + '"  class="item-link item-content">' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row" style="position: relative; top: -5px;">' +
                    '<div class="item-title">{{line}}&nbsp;&nbsp;<i style="position: relative; top: 4px;" class="f7-icons">arrow_right</i>&nbsp;&nbsp;{{destination}}&nbsp;<span onclick="event.preventDefault(); vehiclePopover({{vehicle}}, event); return false;" class="badge color-{{#if pink}}pink{{else}}red{{/if}}">{{vehicle}}</span>&nbsp;<i class="material-icons wifi">{{wifi}}</i>&nbsp;<i class="material-icons wifi">{{USB}}</i>{{DATTO}}{{DATTM}}</div>' +
                    '<div class="item-after"style="color: #{{txtCol}};">{{#if arrived}}<i class="material-icons blinker">directions_bus</i>{{else}}{{time}}{{/if}}</div>' +
                    '</div>' +
                    '</div>' +
                    '</a>' +
                    '</li>',
                    // Item height
                    height: app.theme === 'ios' ? 63 : 73,
                });
                console.log(j);
                app.dialog.close();
            });
            $.get(rootURL + "/hosted_app-V2/users.php?u=" + uid + "&isFav&s=" + currentStop + "&_=" + new Date().getTime(), function (data) {
               if (data == "true") {
                   $("#favButton").click(function () {
                       $.get(rootURL + "/hosted_app-V2/users.php?u=" + uid + "&deleteFav&s=" + currentStop, function () {

                       });
                   });
                   $("#favButton").innerHTML = "<i class=\"icon f7-icons\">heart_fill</i>";
               } else {
                   $("#favButton").click(function () {
                       $.get(rootURL + "/hosted_app-V2/users.php?u=" + uid + "&addFav&s=" + currentStop, function () {

                       });
                   });
                   $("#favButton").innerHTML = "<i class=\"icon f7-icons\">heart</i>";
               }
            });
        }
    }
  },
  {
    path: '/about/',
    url: './pages/about.html',
  },
  {
    path: '/supportUs/',
    url: './pages/suportUS.html',
  },
  {
    path: '/tickets/',
    url: './pages/tickets.html',
  },
  {
    path: '/maps/',
    url: './pages/maps.html',
    on: {
        pageInit: function (e, page) {

        }
    }
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
