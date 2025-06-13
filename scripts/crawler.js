function shareDish(dish, dateStr) {
	/// Vibe coded
    const shareText = `${dish} on ${dateStr}`;
    const shareUrl = window.location.href.split("?")[0]; 
    if (navigator.share) {
        navigator.share({
            title: shareText,
        }).then(() => {
            console.log("Shared successfully");
        }).catch((error) => {
            console.error("Error sharing:", error);
        });
    } else {
        alert("Sharing not supported in this browser.");
    }
}

function createGoogleCalendarLink(dateStr, dish) {
	/// Vibe coded
    const dateMatch = dateStr.match(/\d{2}\.\d{2}\.\d{4}/);
    if (!dateMatch) return "#";

    const [day, month, year] = dateMatch[0].split(".");
    const startDate = `${year}${month}${day}`;

    const end = new Date(`${year}-${month}-${day}`);
    end.setDate(end.getDate() + 1);
    const endDate = `${end.getFullYear()}${String(end.getMonth() + 1).padStart(2, '0')}${String(end.getDate()).padStart(2, '0')}`;

    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: dish,
        dates: `${startDate}/${endDate}`,
        details: `Spätzle dish available: ${dish}`
    });

    return `https://www.google.com/calendar/render?${params.toString()}`;
}

function createICSFile(dateStr, dish) {
	/// Vibe coded
    const dateMatch = dateStr.match(/\d{2}\.\d{2}\.\d{4}/);
    if (!dateMatch) return null;

    const [day, month, year] = dateMatch[0].split(".");
    const dateFormatted = `${year}${month}${day}`;

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:${dish}`,
        `DTSTART;VALUE=DATE:${dateFormatted}`,
        `DTEND;VALUE=DATE:${dateFormatted}`,
        `DESCRIPTION:Spätzle dish available: ${dish}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    return URL.createObjectURL(blob);
}

async function get_spaetzle_days() {
	const counterElement = document.getElementById("spaetzle-counter");
    counterElement.innerHTML = "Loading..."; 

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

	const spaetzle_container = document.getElementById("spaetzle-counter");

	if (found_spaetzle.length === 0) {
		spaetzle_container.innerHTML = "<p>No Spätzle dishes on the menu :(</p>";
		return;
	}

    console.log(found_spaetzle);
    spaetzle_container.innerHTML = found_spaetzle.map(([html_date, spaetzle_dishes]) => {
		console.log(html_date);
		const clean_date = html_date.replace(/<[^>]+>/g, '').trim();
        return `<h1>${html_date}</h1>
        <ul>
            ${spaetzle_dishes.map((dish) => {
				const gcalLink = createGoogleCalendarLink(html_date, dish);
                const icsLink = createICSFile(html_date, dish);
                return `
                    <li>${dish}</li>
					<li>
						Add to Calendar:
                        <a href="${icsLink}" download="${dish.replace(/\s+/g, "_")}.ics">
							ICS
                        </a>
						&nbsp;
						<a href="${gcalLink}" target="_blank" rel="noopener noreferrer">
							Google Calendar
						</a>
					</li>
					<li>
						<button onclick="shareDish('${dish}', '${clean_date}')">Share</button>
					</li>
                `;
            }).join("")}
        </ul>`;
    }).join("<br>");
}
