routes = [
    {
        path: '/home/',
        url: 'index.html',
        options: {
            pushState: true
        }
    },
    {
        path: '/disruptions/',
        url: hostedDir() + '/disruptions.php',
        options: {
            pushState: true
        }
    },
    {
        path: '/times/',
        url: hostedDir() + '/times.php',
        options: {
            pushState: true
        }
    },
    {
        path: '/directions/',
        url: hostedDir() + '/directions.php',
        options: {
            pushState: true
        }
    },
    {
        path: '/stop/',
        url: hostedDir() + '/stop.php',
        options: {
            pushState: true
        }
    },
    {
        path: '/dep/',
        url: hostedDir() + '/dep.php',
        options: {
            pushState: true
        }
    },
    {
        path: '/vdetails/',
        url: hostedDir() + '/vdetails.php',
        options: {
            pushState: true
        }
    },
    {
        path: '/directionsRTN/',
        url: hostedDir() + '/directionsRTN.php',
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
        return "../hosted_app-V2";
    } else {
        return "https://cityrunner-server.genav.ga/hosted_app-V2";
    }

}
