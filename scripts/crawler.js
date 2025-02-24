async function get_spaetzle_days() {
    const current_url = new URL(window.location)
    const key = current_url.searchParams.get("key");

    const keywords = ["Spätzle", "spätzle"];

    const url = `https://corsproxy.io/?${key ? "key=" + key + "&" : ""}url=https://www.studierendenwerk-muenchen-oberbayern.de/mensa/speiseplan/speiseplan_422_-de.html`;
    const response = await fetch(url);
    const content = await response.text();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(content, 'text/html');

    let found_spaetzle = [];

    Object.values(htmlDoc.getElementsByClassName("c-schedule__item")).forEach(
        (speiseplan_elem) => {
            let html_date = speiseplan_elem.getElementsByClassName("c-schedule__header")[0].getElementsByTagName("span")[0].innerHTML;
            let potential_spaetzle = Object.values(speiseplan_elem.getElementsByClassName("c-menu-dish__title")).map((elem) => elem.innerHTML);
            let spaetzle_dishes = [];
            potential_spaetzle.forEach((dish) => {
                for (const spaetzle of keywords) {
                    console.log(dish);
                    if (dish.includes(spaetzle)) {
                        // Yippie
                        spaetzle_dishes.push(dish);
                        break;
                    }
                }
            })
            if (spaetzle_dishes.length > 0) {
                found_spaetzle.push([html_date, spaetzle_dishes]);
            }
        }
    );

    console.log(found_spaetzle);
    document.getElementById("spaetzle-counter").innerHTML = found_spaetzle.map(([html_date, spaetzle_dishes]) => {
        return `<h1>${html_date}</h1><ul>${spaetzle_dishes.map((dish) => {return "<li>" + dish + "</li>"}).join("")}</ul>`
    }).join("<br>");
}