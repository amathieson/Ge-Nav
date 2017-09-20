function translatePage(language) {
    for (var key in translation_Lookup) {
        var translated = translation_Lookup[key];
        if (typeof translated!== 'undefined' && translated!== null && document.querySelector('[translateID="' + key + '"]')) {
            if (typeof translated[language] !== 'undefined' && translated[language] !== null) {
                var places = document.querySelectorAll('[translateID="' + key + '"]');
                [].forEach.call(places, function(place) {
                    place.innerHTML = translated[language];
                });

            } else {
                var places = document.querySelectorAll('[translateID="' + key + '"]');
                [].forEach.call(places, function(place) {
                    place.innerHTML = translated["EN"];
                });
            }
        } else {
            console.log(key + " is not an element!");
        }
    }

    // var file = "js/strings.js";
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.onreadystatechange = function () {
    //     if (this.readyState == 4 && this.status == 200) {
    //         var json = JSON.parse(this.responseText).translations;
    //         for (var i = 0; i < json.length; i++) {
    //             var obj = json[i];
    //             if (typeof obj[language] !== 'undefined' && obj[language] !== null) {
    //                 document.querySelector('[translateID="' + obj.translationID + '"]').innerHTML = obj[language];
    //             } else {
    //                 document.querySelector('[translateID="' + obj.translationID + '"]').innerHTML = obj["EN"];
    //             }
    //
    //         }
    //     }
    // };
    // xmlhttp.open("GET", file, true);
    // xmlhttp.send();
}


function translateStr(id, language) {
    var translated = translation_Lookup[id];

    if (typeof translated!== 'undefined' && translated!== null) {
        if (typeof translated[language] !== 'undefined' && translated[language] !== null) {
            return translated[language];
        } else {
            return translated["EN"];
        }
    } else {
        return "Not found";
    }


}