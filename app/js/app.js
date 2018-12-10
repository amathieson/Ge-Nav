// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'eu.mathieson.adam.genav', // App bundle ID
  name: 'G&eacute;Nav', // App name
  theme: 'auto', // Automatic theme detection
  // App routes
  routes: routes,
  // Enable panel left visibility breakpoint
  panel: {
    leftBreakpoint: 960,
  },
});

// Init/Create left panel view
var mainView = app.views.create('.view-left', {
  url: '/'
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/',
  pushState: true
});
if (location.protocol == 'https:' || window.location.hostname == "localhost") {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function loadHome() {
    app.dialog.progress();
    var votdDone = false;
    var disruptionsDone = false;
    var favsDone = false;
    $.get(rootURL + "/hosted_app-V2/processODAPI.php?disruptions", function (data) {
        var j = JSON.parse(data);
        document.getElementById("disurptionsHome").innerHTML = "";
        for (var i = 0; i < j.length; i++) {
            document.getElementById("disurptionsHome").innerHTML += "<li>\n" +
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
        disruptionsDone = true;
        if (votdDone && disruptionsDone && favsDone) {
            app.dialog.close();
        }
    });
    $.get(rootURL + "/hosted_app-V2/votm.php", function (data) {
        var j = JSON.parse(data);
        document.getElementById("iodt").src = j.image;
        document.getElementById("votd").innerHTML = j.Vehicle_number;
        votdDone = true;
        if (votdDone && disruptionsDone && favsDone) {
            app.dialog.close();
        }
    });
    $.get(rootURL + "/hosted_app-V2/users.php?favs&u=" + uid, function (data) {
        var j = JSON.parse(data);
        document.getElementById("favsHome").innerHTML = "";
        for (var i = 0; i < j.length; i++) {
            document.getElementById("favsHome").innerHTML += "<li class='swipeout'>\n" +
                "                        <a href=\"/stop/?s=" + j[i].stopCode + "\" onclick='currentStop = \"" + j[i].stopCode + "\";' class=\"item-link item-content swipeout-content\">\n" +
                "                            <div class=\"item-inner\">\n" +
                "                                <div class=\"item-title-row\">\n" +
                "                                    <div class=\"item-title\">" + j[i].stopName + "</div>\n" +
                "                                    <div class=\"item-after\"></div>\n" +
                "                                </div>\n" +
                "                                <div class=\"item-subtitle\">" + j[i].stopCode + "</div>\n" +
                "                                <div class=\"item-text tablet-only\">\n" + j[i].connections +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </a>\n" +
                "      <div class=\"swipeout-actions-right\">\n" +
                "        <a href=\"#\" class=\"swipeout-delete\" onclick='deleteFav(\"" + j[i].stopCode + "\");'>Delete</a>\n" +
                "      </div>" +
                "                    </li>"
        }
        favsDone = true;
        if (votdDone && disruptionsDone && favsDone) {
            app.dialog.close();
        }
    });
}
function addFav(stopCode) {
    $.get(rootURL + "/hosted_app-V2/users.php?addFav&s=" + stopCode + "&u=" + uid, function (data) {
        var j = JSON.parse(data);
        document.getElementById("favsHome").innerHTML = "";
        for (var i = 0; i < j.length; i++) {
            document.getElementById("favsHome").innerHTML += "<li class='swipeout'>\n" +
                "                        <a href=\"/stop/?s=" + j[i].stopCode + "\" onclick='currentStop = \"" + j[i].stopCode + "\";' class=\"item-link item-content swipeout-content\">\n" +
                "                            <div class=\"item-inner\">\n" +
                "                                <div class=\"item-title-row\">\n" +
                "                                    <div class=\"item-title\">" + j[i].stopName + "</div>\n" +
                "                                    <div class=\"item-after\"></div>\n" +
                "                                </div>\n" +
                "                                <div class=\"item-subtitle\">" + j[i].stopCode + "</div>\n" +
                "                                <div class=\"item-text tablet-only\">\n" + j[i].connections +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </a>\n" +
                "      <div class=\"swipeout-actions-right\">\n" +
                "        <a href=\"#\" class=\"swipeout-delete\" onclick='deleteFav(\"" + j[i].stopCode + "\");'>Delete</a>\n" +
                "      </div>" +
                "                    </li>"
        }
    });
}
function deleteFav(stopCode) {
    $.get(rootURL + "/hosted_app-V2/users.php?deleteFav&s=" + stopCode + "&u=" + uid, function (data) {
        var j = JSON.parse(data);
        document.getElementById("favsHome").innerHTML = "";
        for (var i = 0; i < j.length; i++) {
            document.getElementById("favsHome").innerHTML += "<li class='swipeout'>\n" +
                "                        <a href=\"/stop/?s=" + j[i].stopCode + "\" onclick='currentStop = \"" + j[i].stopCode + "\";' class=\"item-link item-content swipeout-content\">\n" +
                "                            <div class=\"item-inner\">\n" +
                "                                <div class=\"item-title-row\">\n" +
                "                                    <div class=\"item-title\">" + j[i].stopName + "</div>\n" +
                "                                    <div class=\"item-after\"></div>\n" +
                "                                </div>\n" +
                "                                <div class=\"item-subtitle\">" + j[i].stopCode + "</div>\n" +
                "                                <div class=\"item-text tablet-only\">\n" + j[i].connections +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </a>\n" +
                "      <div class=\"swipeout-actions-right\">\n" +
                "        <a href=\"#\" class=\"swipeout-delete\" onclick='deleteFav(\"" + j[i].stopCode + "\");'>Delete</a>\n" +
                "      </div>" +
                "                    </li>"
        }
    });
}
function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

function loop() {
    var pageName = app.views.main.router.currentPageEl.getAttribute('data-name');

    if (pageName == "stop") {
        $.get(rootURL + "/hosted_app-V2/processODAPI.php?stop&s=" + currentStop, function (data) {
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
        });
    } else if (pageName == "disruptions") {
        $.get(rootURL + "/hosted_app-V2/processODAPI.php?disruptions", function (data) {
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
        });
    } else if (pageName == "home") {
        $.get(rootURL + "/hosted_app-V2/processODAPI.php?disruptions", function (data) {
            var j = JSON.parse(data);
            document.getElementById("disurptionsHome").innerHTML = "";
            for (var i = 0; i < j.length; i++) {
                document.getElementById("disurptionsHome").innerHTML += "<li>\n" +
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
        });
        $.get(rootURL + "/hosted_app-V2/users.php?favs&u=" + uid, function (data) {
            var j = JSON.parse(data);
            document.getElementById("favsHome").innerHTML = "";
            for (var i = 0; i < j.length; i++) {
                document.getElementById("favsHome").innerHTML += "<li class='swipeout'>\n" +
                    "                        <a href=\"/stop/?s=" + j[i].stopCode + "\" onclick='currentStop = \"" + j[i].stopCode + "\";' class=\"item-link item-content swipeout-content\">\n" +
                    "                            <div class=\"item-inner\">\n" +
                    "                                <div class=\"item-title-row\">\n" +
                    "                                    <div class=\"item-title\">" + j[i].stopName + "</div>\n" +
                    "                                    <div class=\"item-after\"></div>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"item-subtitle\">" + j[i].stopCode + "</div>\n" +
                    "                                <div class=\"item-text tablet-only\">\n" + j[i].connections +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </a>\n" +
                    "      <div class=\"swipeout-actions-right\">\n" +
                    "        <a href=\"#\" class=\"swipeout-delete\" onclick='deleteFav(\"" + j[i].stopCode + "\");'>Delete</a>\n" +
                    "      </div>" +
                    "                    </li>"
            }
        });
    } else if (pageName == "departure") {
        $.get(rootURL + "/hosted_app-V2/processODAPI.php?dc=" + currentDeparture, function (data) {
            console.log(data);
            document.getElementById("depVCImg")  .setAttribute("src", data.vehicleImage);
            document.getElementById("depVCImg")  .style.background = "url('" + data.vehicleImageT + "')";
            document.getElementById("depStopImg").src = data.streetViewImage;
            document.getElementById("depStopMap").src = data.mapsImage;
            document.getElementById("depConnMap").src = data.platformImage;
            document.getElementById("nav").style.color = "#" + data.textCol;
            document.getElementById("nav").style.background = "#" + data.backCol;
            document.getElementById("nav").style.background = "#" + data.backCol;
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
                ],
                type: 'popup'
            });
            var virtualList = app.virtualList.create({
                // List Element
                el: '.virtual-list-Steps',
                // Pass array with items
                items: data.steps,
                // Custom search function for searchbar
                searchAll: function (query, items) {
                    var found = [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
                    }
                    return found; //return array with mathced indexes
                },
                // List item Template7 template
                itemTemplate:
                    '<li>' +
                    '<a href="/stop/?s={{stopCode}}" onclick="currentStop = \'{{stopCode}}\'" class="item-link item-content {{disabled}}">' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">{{stopName}} - {{stopCode}}</div>' +
                    '<div class="item-after">{{arrivalTime}}</div>' +
                    '</div>' +
                    '</div>' +
                    '</a>' +
                    '</li>',
                // Item height
                height: app.theme === 'ios' ? 63 : 73,
            });
            var virtualList2 = app.virtualList.create({
                // List Element
                el: '.virtual-list-Steps2',
                // Pass array with items
                items: data.steps,
                // Custom search function for searchbar
                searchAll: function (query, items) {
                    var found = [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
                    }
                    return found; //return array with mathced indexes
                },
                // List item Template7 template
                itemTemplate:
                    '<li>' +
                    '<a href="/stop/?s={{stopCode}}" onclick="currentStop = \'{{stopCode}}\'" class="item-link item-content {{disabled}}">' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">{{stopName}} - {{stopCode}}</div>' +
                    '<div class="item-after">{{time}}</div>' +
                    '</div>' +
                    '</div>' +
                    '</a>' +
                    '</li>',
                // Item height
                height: app.theme === 'ios' ? 63 : 73,
            });
        });
    }
    setTimeout(loop, 30000);
}
loop();
function showDisruption(disruptionEL) {
    app.dialog.alert(disruptionEL.childNodes[2].childNodes[3].innerHTML + "<br><br>" + disruptionEL.childNodes[2].childNodes[5].innerHTML, disruptionEL.childNodes[2].childNodes[1].childNodes[1].innerHTML);
}
function createMap(map) {
    document.getElementById("canvasContainer").innerHTML = "";
    document.getElementById("canvasContainer").innerHTML = "<canvas id=\"map\" style=\"width: 100%; height: 100%;\"></canvas>";
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetWidth * (1628/835);
    var ctx = canvas.getContext('2d');
    trackTransforms(ctx);
    function redraw(){

        // Clear the entire canvas
        var p1 = ctx.transformedPoint(0,0);
        var p2 = ctx.transformedPoint(canvas.width,canvas.height);
        ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.restore();

        ctx.drawImage(gkhead,0,0);

    }
    var zoom = function(clicks){
        var pt = ctx.transformedPoint(lastX,lastY);
        ctx.translate(pt.x,pt.y);
        var factor = Math.pow(scaleFactor,clicks);
        ctx.scale(factor,factor);
        ctx.translate(-pt.x,-pt.y);
        redraw();
    };

    var handleScroll = function(evt){
        var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(delta);
        return evt.preventDefault() && false;
    };

    redraw();

    var lastX=canvas.width/2, lastY=canvas.height/2;
    var dragStart,dragged;

    canvas.addEventListener('mousedown',function(evt){
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx.transformedPoint(lastX,lastY);
        dragged = false;
    },false);

    canvas.addEventListener('mousemove',function(evt){
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart){
            var pt = ctx.transformedPoint(lastX,lastY);
            ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
            redraw();
        }
    },false);

    canvas.addEventListener('mouseup',function(evt){
        dragStart = null;
        if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
    },false);

    var scaleFactor = 1.1;

    canvas.addEventListener('DOMMouseScroll',handleScroll,false);
    canvas.addEventListener('mousewheel',handleScroll,false);
    switch (map) {
        case "urban":
            gkhead.src = 'maps/urban_day.png';
            app.toolbar.setHighlight("#tab1");
            return;
        case "suburban":
            gkhead.src = 'maps/suburban_day.png';
            app.toolbar.setHighlight("#tab2");
            return;
        case "urbanNight":
            gkhead.src = 'maps/urban_night.png';
            app.toolbar.setHighlight("#tab3");
            return;
        case "suburbanNight":
            gkhead.src = 'maps/suburban_night.png';
            app.toolbar.setHighlight("#tab4");
            return;
    }

    // Adds ctx.getTransform() - returns an SVGMatrix
    // Adds ctx.transformedPoint(x,y) - returns an SVGPoint

    function trackTransforms(ctx) {
        var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        var xform = svg.createSVGMatrix();
        ctx.getTransform = function () {
            return xform;
        };

        var savedTransforms = [];
        var save = ctx.save;
        ctx.save = function () {
            savedTransforms.push(xform.translate(0, 0));
            return save.call(ctx);
        };

        var restore = ctx.restore;
        ctx.restore = function () {
            xform = savedTransforms.pop();
            return restore.call(ctx);
        };

        var scale = ctx.scale;
        ctx.scale = function (sx, sy) {
            xform = xform.scaleNonUniform(sx, sy);
            return scale.call(ctx, sx, sy);
        };

        var rotate = ctx.rotate;
        ctx.rotate = function (radians) {
            xform = xform.rotate(radians * 180 / Math.PI);
            return rotate.call(ctx, radians);
        };

        var translate = ctx.translate;
        ctx.translate = function (dx, dy) {
            xform = xform.translate(dx, dy);
            return translate.call(ctx, dx, dy);
        };

        var transform = ctx.transform;
        ctx.transform = function (a, b, c, d, e, f) {
            var m2 = svg.createSVGMatrix();
            m2.a = a;
            m2.b = b;
            m2.c = c;
            m2.d = d;
            m2.e = e;
            m2.f = f;
            xform = xform.multiply(m2);
            return transform.call(ctx, a, b, c, d, e, f);
        };

        var setTransform = ctx.setTransform;
        ctx.setTransform = function (a, b, c, d, e, f) {
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(ctx, a, b, c, d, e, f);
        };

        var pt = svg.createSVGPoint();
        ctx.transformedPoint = function (x, y) {
            pt.x = x;
            pt.y = y;
            return pt.matrixTransform(xform.inverse());
        }
    }
}