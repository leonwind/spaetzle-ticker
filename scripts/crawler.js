function getNextSpaetzleDay() {
    iterate_days_until_spaetzle()
        .then((date) => {
            document.getElementById("spaetzle-counter").innerHTML = date;
        })
}

async function iterate_days_until_spaetzle() {
    let date = new Date();
    let spaetzle_days = []

    for (let i = 0; i < 30; i++) {
        console.log(date)
        let url_string = generate_mensa_link(date);
        console.log(url_string);

        let has_spaetzle_today = await visit_url(url_string);
        if (has_spaetzle_today) {
            console.log("EARYL RETURN");
            spaetzle_days.push(generate_YYYY_MM_DD(date));
        }
        
        date.setDate(date.getDate() + 1);
        // Skip weekends
        while (date.getDay() === 0 || date.getDay() === 6) {
            date.setDate(date.getDate() + 1);
        }
    }

    return spaetzle_days;
}

async function visit_url(url) {
    const keywords = ["Spätzle", "spätzle"];

    const response = await fetch(url);
    const content = await response.text();
    
    var arrayLength = keywords.length;
for (var i = 0; i < arrayLength; i++) {
    if (content.includes(keywords[i])) {
        return true;
    }
    //Do something
}    

    return false;
    //return content.includes("spätzle");

    /*
    let found_key = false;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true); 
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== XMLHttpRequest.DONE || xhr.status !== 200) {
            return;
        }
        
        let response = xhr.responseText;
        let key = "spätzle"; 
    
        if (response.includes(key)) {
            console.log("FOUND " + key);
            this.found_key = true;
        } 
    };
    
    xhr.send();
    xhr.wa
    console.log("KEY exist: " + found_key);
    return found_key;
    */
}

function generate_mensa_link(date) {
    date_format = generate_YYYY_MM_DD(date);
    const cors_proxy = "https://corsproxy.io/?"
    const url_prefix = "https://www.studierendenwerk-muenchen-oberbayern.de/mensa/speiseplan/speiseplan_";
    const url_suffix = "_422_-de.html";
    return cors_proxy + url_prefix + date_format + url_suffix;
}

function generate_YYYY_MM_DD(date) {
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day; 
}