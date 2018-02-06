// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app = new Framework7({
    root: '#app', // App root element
    id: 'eu.mathieson.adam.genav', // App bundle ID
    name: 'GéNav', // App name
    theme: 'auto', // Automatic theme detection
    routes: routes,
    view: {
        pushState: true
    }
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
    url: '/'
});
var currentLang = "EN";

function title2TPGApp() {
    // document.getElementById("title").innerHTML = "GéNav";
    // document.getElementById("navbar").style.color = "#fff";
    // document.getElementById("navbar").style.backgroundColor = "#f44336";
    try {
        StatusBar.backgroundColorByHexString("#ba000d");
        window.plugins.headerColor.tint("#f44336");
    } catch (e) {
        console.error(e);
    }

}
function refreshDeps() {
    if (document.getElementsByClassName("page-current")[0].dataset.name == "stop") {
        app.preloader.show();
        setTimeout(function () {
            app.preloader.hide();
        }, 200);
        $.get(hostedDir() + "/stopsASYNC.php?stop=" + document.getElementById("currStopCode").innerHTML + "&off=0&len=50", function (data) {
            var depsVlist = app.virtualList.create({
                // List Element
                el: '.depsList',
                // Pass array with items
                items: JSON.parse(data),
                // Custom search function for searchbar
                searchAll: function (query, items) {
                    var found = [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].destination.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].line.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].wifi.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].USB.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
                    }
                    return found; //return array with mathceds indexes
                },

                // List item Template7 template
                itemTemplate:
                '<li style="background-color: #{{primCol}}; color: #{{txtCol}};">' +
                '<a href="/dep/?dc={{depCde}}&col={{primCol}}&colT={{txtCol}}&nav={{navBar}}" onclick="document.getElementById(\'currDepCode\').innerHTML = \'{{depCde}}\';' +
                'app.preloader.show(translateStr(\'loading\',currentLang));' +
                'setTimeout(function () {app.preloader.hide();}, 1000);' +
                'StatusBar.backgroundColorByHexString(\'#{{secCol}}\');' +
                'window.plugins.headerColor.tint(\'#{{promCol}}\');" class="item-link item-content">' +
                '<div class="item-inner">' +
                '<div class="item-title-row" style="position: relative; top: -5px;">' +
                '<div class="item-title">{{line}}&nbsp;&nbsp;<i style="position: relative; top: 4px;" class="f7-icons">arrow_right</i>&nbsp;&nbsp;{{destination}}&nbsp;<i class="material-icons wifi">{{wifi}}</i>&nbsp;<i class="material-icons wifi">{{USB}}</i>{{DATTO}}{{DATTM}}</div>' +
                '<div class="item-after"style="color: #{{txtCol}};">{{#if arrived}}<i class="material-icons blinker">directions_bus</i>{{else}}{{time}}{{/if}}</div>' +
                '</div>' +
                '</div>' +
                '</a>' +
                '</li>',
                // Item height
                height: app.theme === 'ios' ? 63 : 73,
                updatableScroll: true
            });
        });
        setTimeout(function () {
            refreshDeps();
        }, 30000);
    }
}

title2TPGApp();
// MD
app.on('pageInit', function (e) {
    // do something on page init
    if (e.name == "home") {
        title2TPGApp();
        $.get(hostedDir() + "/disruptions-home.php", function (data, status) {
                document.getElementsByClassName("homeDis")[0].innerHTML = data;
            }
        );
        $.get(hostedDir() + "/disruptions-home.php", function (data, status) {
            var els = document.getElementsByClassName("homeDis");

            Array.prototype.forEach.call(els, function (el) {
                // Do stuff here
                el.innerHTML = data;
            });
        });
    }
    if (e.name == "times") {
        var stopsVlist = app.virtualList.create({
            // List Element
            el: '.stops',
            // Pass array with items
            items: JSON.parse(document.getElementById("stops").innerHTML),
            // Custom search function for searchbar
            searchAll: function (query, items) {
                var found = [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].code.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].line.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].stopNoChars.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
                }
                return found; //return array with mathced indexes
            },

            // List item Template7 template
            itemTemplate:
            '<li>' +
            '<a href="/stop/?stop={{code}}&off=0&len=20" onclick="app.preloader.show(translateStr(\'loading\',currentLang));' +
            'setTimeout(function () {app.preloader.hide();}, 1000); ' +
            'document.getElementById(\'currStopCode\').innerHTML = \'{{code}}\';' +
            'document.getElementById(\'currStopName\').innerHTML = \'{{name}}\'" class="item-link item-content">' +
            '<div class="item-inner">' +
            '<div class="item-title-row">' +
            '<div class="item-title">{{name}}</div>' +
            '{{#if DATTM}}<span class="badge color-green">New Ticket Machine</span>{{else}}{{/if}} {{#if DATTO}}<span class="badge color-blue">Old Ticket Machine</span>{{else}}{{/if}}' +
            '</div>' +
            '<div class="item-subtitle">{{code}}</div>' +
            '</div>' +
            '</a>' +
            '</li>',
            // Item height
            height: app.theme === 'ios' ? 63 : 73,
            updatableScroll: true
        });
    }
    if (e.name == "dep") {
        var stopsVlist = app.virtualList.create({
            // List Element
            el: '.thermoList',
            // Pass array with items
            items: JSON.parse(document.getElementById("thermo").innerHTML),

            // List item Template7 template
            itemTemplate:
            '<li class="{{disabled}}">' +
            '<a href="/stop/?stop={{stopCode}}&off=0&len=20" onclick="app.preloader.show(translateStr(\'loading\',currentLang));' +
            'setTimeout(function () {app.preloader.hide();}, 1000); ' +
            'document.getElementById(\'currStopCode\').innerHTML = \'{{stopCode}}\';' +
            'document.getElementById(\'currStopName\').innerHTML = \'{{stopName}}\'" class="item-link item-content">' +
            '<div class="item-inner">' +
            '<div class="item-title-row">' +
            '<div class="item-title">{{stopName}} - {{stopCode}}</div>' +
            '<div class="item-after">{{#if bus}}<i class="blinker material-icons">directions_bus</i>{{else}}{{time}}{{/if}}{{#if mins}}&nbsp;<span translateID="mins">mins</span>{{/if}}</div>' +
            '</div>' +
            '</div>' +
            '</a>' +
            '</li>',
            // Item height
            height: app.theme === 'ios' ? 63 : 73,
            updatableScroll: true
        });
    }
    if (e.name == "stop") {
        var depsVlist = app.virtualList.create({
            // List Element
            el: '.depsList',
            // Pass array with items
            items: JSON.parse(document.getElementById("deps").value),
            // Custom search function for searchbar
            searchAll: function (query, items) {
                var found = [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].destination.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].line.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].wifi.toLowerCase().indexOf(query.toLowerCase()) >= 0 || items[i].USB.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
                }
                return found; //return array with mathceds indexes
            },

            // List item Template7 template
            itemTemplate:
            '<li style="background-color: #{{primCol}}; color: #{{txtCol}};">' +
            '<a href="/dep/?dc={{depCde}}&col={{primCol}}&colT={{txtCol}}&nav={{navBar}}" onclick="document.getElementById(\'currDepCode\').innerHTML = \'{{depCde}}\';' +
            'app.preloader.show(translateStr(\'loading\',currentLang));' +
            'setTimeout(function () {app.preloader.hide();}, 1000);' +
            'StatusBar.backgroundColorByHexString(\'#{{secCol}}\');' +
            'window.plugins.headerColor.tint(\'#{{promCol}}\');" class="item-link item-content">' +
            '<div class="item-inner">' +
            '<div class="item-title-row" style="position: relative; top: -5px;">' +
            '<div class="item-title">{{line}}&nbsp;&nbsp;<i style="position: relative; top: 4px;" class="f7-icons">arrow_right</i>&nbsp;&nbsp;{{destination}}&nbsp;<i class="material-icons wifi">{{wifi}}</i>&nbsp;<i class="material-icons wifi">{{USB}}</i>{{DATTO}}{{DATTM}}</div>' +
            '<div class="item-after"style="color: #{{#if pink}}ff00ff{{else}}{{txtCol}}{{/if}};">{{#if arrived}}<i class="material-icons blinker">directions_bus</i>{{else}}{{time}}{{/if}}</div>' +
            '</div>' +
            '</div>' +
            '</a>' +
            '</li>',
            // Item height
            height: app.theme === 'ios' ? 63 : 73,
            updatableScroll: true
        });
        refreshDeps();
    }
    if (e.name == "directionsRTN") {
        dirMap("HOME");
    }


});
function dirMap(id) {
    var a = document.getElementsByClassName("trajet-map");
    for (index = 0; index < a.length; ++index) {
        //console.log(a[index].src.replace("SCREENWIDTH", screen.width));
        a[index].src = a[index].src.replace("SCREENWIDTH", screen.width);
    }
    var a = document.getElementsByClassName("trajet-map");
    for (index = 0; index < a.length; ++index) {
        a[index] = a[index].setAttribute("hidden","hidden");
    }
    document.getElementById("journey_" + id).removeAttribute("hidden");
}
function submitDir() {
    var origin = document.getElementById("originDir");
    var desination = document.getElementById("destinationDir");
    var sub = document.getElementById("subDir");
    sub.setAttribute("href", "/directionsRTN/?origin=" + origin.value+ "&destination=" + desination.value);
}
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

