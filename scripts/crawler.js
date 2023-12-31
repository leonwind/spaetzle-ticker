function getNextSpaetzleDay() {
    iterate_days_until_spaetzle()
        .then((dates) => {
            let concat_str = "";

            dates.forEach((date) => {
                let link = generate_mensa_link_date_str(date, false);
                concat_str += `<a href="${link}">${date}</a></br>`
            });

            document.getElementById("spaetzle-counter").innerHTML = concat_str;
        })
}


async function iterate_days_until_spaetzle() {
    let date = new Date();
    let spaetzle_days = []

    for (let i = 0; i < 30; i++) {
        //console.log(date)
        let url_string = generate_mensa_link(date);
        //console.log(url_string);

        let has_spaetzle_today = await visit_url(url_string);
        if (has_spaetzle_today) {
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
    
    let len = keywords.length;
    for (let i = 0; i < len; i++) {
        if (content.includes(keywords[i])) {
            return true;
        }
    }

    return false;
}


function generate_mensa_link(date, use_proxy=true) {
    return generate_mensa_link_date_str(generate_YYYY_MM_DD(date), use_proxy);
}



function generate_mensa_link_date_str(date, use_proxy=true) {
    const cors_proxy = "https://corsproxy.io/?"
    const url_prefix = "https://www.studierendenwerk-muenchen-oberbayern.de/mensa/speiseplan/speiseplan_";
    const url_suffix = "_422_-de.html";

    const url = url_prefix + date + url_suffix;

    if (use_proxy) {
        return cors_proxy + url;
    } 
    return url;
}


function generate_YYYY_MM_DD(date) {
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day; 
}