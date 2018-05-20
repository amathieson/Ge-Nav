// hostedDir();
var server = "https://cityrunner-server.genav.ga/hosted_app-V2";
var routes = [
        {
            path: '/home/',
            url: 'index.html',
            options: {
                pushState: true
            }
        },
        {
            path: '/disruptions/',
            url: server + '/disruptions.php',
            options: {
                pushState: true
            }
        },
        {
            path: '/times/',
            url: server + '/times.php',
            options: {
                pushState: true
            }
        },
        {
            path: '/directions/',
            url: server + '/directions.php',
            options: {
                pushState: true
            }
        },
        {
            path: '/stop/',
            url: server + '/stop.php',
            options: {
                pushState: true
            }
        },
        {
            path: '/dep/',
            url: server + '/dep.php',
            options: {
                pushState: true
            }
        },
        {
            path: '/vdetails/',
            url: server + '/vdetails.php',
            options: {
                pushState: true
            }
        },
        {
            path: '/directionsRTN/',
            url: server + '/directionsRTN.php',
            options: {
                pushState: true
            }
        },
        {
            path: '/tickets/',
            url: 'pages/tickets.html',
            options: {
                pushState: true
            }
        },
        {
            path: '/favs/',
            url: 'pages/favs.html',
            options: {
                pushState: true
            }
        },
        {
            path: '/map/',
            url: 'pages/map.html',
            options: {
                pushState: true
            }
        },
        {
            path: '/maps/',
            url: 'pages/maps.html',
            options: {
                pushState: true
            }
        },
        {
            path: '/about/',
            url: 'pages/about.html',
            options: {
                pushState: true
            }
        },
        {
            path: '/help/',
            url: 'pages/help.html',
            options: {
                pushState: true
            }
        },
        // Default route (404 page). MUST BE THE LAST
        {
            path: '(.*)',
            url: './pages/404.html',
            options: {
                pushState: true
            }
        }
    ];
function hostedDir() {
    if (window.location.hostname == "adam.local") {
        server =  "../hosted_app-V2";
    } else {
        var img = document.body.appendChild(document.createElement("img"));
        img.style.display = "none";
        img.onload = function()
        {
            server = "https://cityrunner-server.genav.ga/hosted_app-V2";
            refreshRoutes();
        };
        img.onerror = function()
        {
            server = "https://genav-prod.herokuapp.com/hosted_app-V2";
            refreshRoutes();
        };
        img.src = "https://cityrunner-server.genav.ga/favIcons/favicon-16x16.png";
    }
    return server;

}
