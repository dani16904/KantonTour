const mapDiv = document.getElementById("map");
const sightsContent = document.getElementById("sightsContent");
const findMeBtn = document.getElementById("findMe");
const showAllBtn = document.getElementById("showAll");
let map;
let markersLayer;

const kategorien = [
  {
    title: "Kirchen & Klöster",
    keys: [
      "Kathedrale St. Nikolaus (Freiburg)",
      "Kloster Hauterive (Posieux)",
      "Kapuzinerkloster Freiburg",
      "Augustinerkloster St. Moritz (Freiburg)",
      "Berner Münster",
    ],
  },
  {
    title: "Schlösser & Burgen",
    keys: [
      "Schloss Gruyères",
      "Schloss Bulle",
      "Schloss Chenaux (Estavayer-le-Lac)",
      "Schloss Thun",
      "Schloss Oberhofen",
      "Schloss Spiez",
      "Schloss Burgdorf",
    ],
  },
  {
    title: "Altstädte / Städte",
    keys: [
      "Altstadt Freiburg",
      "Murten (Morat)",
      "Estavayer-le-Lac",
      "Thun Altstadt",
      "Berner Altstadt",
    ],
  },
  {
    title: "Natur & Landschaft",
    keys: ["Mont Vully", "Schwarzsee"],
  },
  {
    title: "Museen & Kunst",
    keys: ["Zentrum Paul Klee"],
  },
];

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const sights = [
  {
    name: "Kathedrale St. Nikolaus (Freiburg)",
    lat: 46.8065,
    lon: 7.1627,
    image:
      "https://media.myswitzerland.com/image/fetch/c_lfill,g_auto,w_3200,h_1800/f_auto,q_80,fl_keep_iptc/https://www.myswitzerland.com/-/media/dam/resources/experience/c/a/cathedral%20of%20st%20nicholas/meta%20page%20image/23959_32001800.jpeg",
    description:
      "Die Kathedrale St. Nikolaus wurde 1283 im gotischen Stil begonnen und über mehrere Jahrhunderte erweitert.",
    history:
      "Sie gilt als eines der wichtigsten religiösen Bauwerke der Schweiz und prägt das Stadtbild von Freiburg. Der 74 Meter hohe Turm diente als Orientierungspunkt und Symbol kirchlicher Macht. Berühmt sind die Jugendstil-Glasfenster von Joseph de Mehoffer. Historisch war die Kathedrale Zentrum der katholischen Kirche und spielte eine Rolle während der Gegenreformation. Innen befinden sich Altäre, Grabmäler bedeutender Freiburger Familien und Kunstwerke aus mehreren Jahrhunderten. Heute ist sie sowohl für Gläubige als auch für Touristen ein Höhepunkt des Kantons.",
    kategorie: "Kanton Freiburg",
  },
  {
    name: "Altstadt Freiburg",
    lat: 46.8065,
    lon: 7.1619,
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    description:
      "Die Altstadt Freiburgs wurde 1157 vom Herzog Berthold IV. von Zähringen gegründet.",
    history:
      "Sie zählt zu den besterhaltenen mittelalterlichen Stadtbildern Europas. Über 200 gotische Fassaden, zahlreiche Brunnen und enge Gassen zeugen vom mittelalterlichen Leben. Stadtmauern, Wehrtürme und die Ober- und Unterstadt verdeutlichen die strategische Bedeutung. Historische Feste und Märkte spiegeln die Tradition und Kultur der Region wider. Die Laubengänge sind ein typisches Beispiel mittelalterlicher Stadtplanung. Historiker schätzen die Altstadt als anschauliches Zeugnis der urbanen Entwicklung des 13.–16. Jahrhunderts.",
    kategorie: "Kanton Freiburg",
  },
  {
    name: "Schloss Gruyères",
    lat: 46.5844,
    lon: 7.0821,
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    description:
      "Das Schloss Gruyères wurde im 13. Jahrhundert errichtet und war Sitz der Grafen von Greyerz.",
    history:
      "Es diente als Verteidigungsanlage und Verwaltungszentrum. Nach dem Niedergang der Grafen im 16. Jahrhundert ging das Schloss in den Besitz von Freiburg und Bern über. Innen zeigt es Sammlungen von Möbeln, Kunstwerken und Rüstungen aus dem Mittelalter. Strategisch auf einem Hügel gelegen, konnte es das umliegende Tal überwachen. Die Architektur kombiniert romanische, gotische und barocke Elemente. Historisch war das Schloss Zentrum politischer Macht und Gerichtsbarkeit. Heute ist es Museum und wichtiges touristisches Ziel.",
    kategorie: "Kanton Freiburg",
  },
  {
    name: "Murten (Morat)",
    lat: 46.9291,
    lon: 7.1166,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    description:
      "Murten wurde im 12. Jahrhundert als befestigte Stadt gegründet.",
    history:
      "Berühmt ist die Schlacht von Murten 1476, bei der die Eidgenossen Karl den Kühnen besiegten. Die Stadtmauern, Türme und Altstadt mit Laubengängen spiegeln das mittelalterliche Leben wider. Historisch war Murten ein bedeutender Handelsplatz für Fischerei, Landwirtschaft und Warenverkehr. Über Jahrhunderte entwickelte sich die Stadt als kulturelles Zentrum. Viele Gebäude stammen aus dem 15. bis 18. Jahrhundert und wurden sorgfältig erhalten. Heute verbindet Murten Tradition, Kultur und Tourismus. Historische Feste und Märkte erinnern an die Stadtgeschichte.",
    kategorie: "Kanton Freiburg",
  },
  {
    name: "Schloss Bulle",
    lat: 46.6179,
    lon: 7.0577,
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    description:
      "Das Schloss Bulle wurde im 13. Jahrhundert vom Bischof von Lausanne errichtet.",
    history:
      "Im 15. Jahrhundert kam es an Freiburg und wurde zum politischen und wirtschaftlichen Zentrum des Greyerzerlands. Historisch diente es auch als Gerichtssitz und Wehrbau. Die Architektur zeigt romanische und gotische Elemente. Innenräume beinhalten Exponate zur Regionalgeschichte. Über Jahrhunderte blieb das Schloss ein Symbol von Macht und Verwaltung. Heute ist es Museum und kultureller Treffpunkt der Stadt.",
    kategorie: "Kanton Freiburg",
  },
  {
    name: "Estavayer-le-Lac",
    lat: 46.8492,
    lon: 6.8486,
    image:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
    description:
      "Estavayer-le-Lac entwickelte sich im Mittelalter zu einem Handelszentrum am Neuenburgersee.",
    history:
      "Die Altstadt ist geprägt von engen Gassen, historischen Häusern und dem Schloss Chenaux. Historisch war der Seezugang entscheidend für Handel und Fischerei. Die Stadt florierte im 15. und 16. Jahrhundert als Markt- und Verwaltungszentrum. Viele Gebäude stammen aus dem 17. und 18. Jahrhundert. Estavayer-le-Lac war kulturelles Zentrum mit Kirchen, Klöstern und Bildungsinstitutionen. Heute verbindet die Stadt Tradition, Natur und Tourismus. Historische Feste beleben noch immer das Stadtbild.",
    kategorie: "Kanton Freiburg",
  },
  {
    name: "Mont Vully",
    lat: 46.9667,
    lon: 7.0833,
    image:
      "https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=400&q=80",
    description:
      "Mont Vully ist ein Hügelzug zwischen Murtensee und Neuenburgersee, der schon in keltischer Zeit besiedelt war.",
    history:
      "Ein Oppidum belegt die strategische Bedeutung für Handel und Verteidigung. Im Mittelalter entstanden Burgen und Weinbaugebiete. Historisch ist Mont Vully für seine Landwirtschaft und insbesondere den Weinbau bekannt. Die Region bot Aussichtspunkte für die Kontrolle der Umgebung. Über die Jahrhunderte blieb die Kulturlandschaft erhalten. Heute ist Mont Vully ein beliebtes Wander- und Ausflugsziel. Die Geschichte der Region spiegelt die Verbindung von Natur und menschlicher Besiedlung wider.",
    kategorie: "Kanton Freiburg",
  },
  {
    name: "Schwarzsee",
    lat: 46.6592,
    lon: 7.2872,
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    description:
      "Der Schwarzsee in den Freiburger Voralpen wurde historisch für Alpwirtschaft und Fischerei genutzt.",
    history:
      "Sagen erzählen von einem Riesen, der den See schwarz färbte. Seit dem 17. Jahrhundert wurde er von Freiburger Patriziern als Ausflugsziel geschätzt. Im 19. und 20. Jahrhundert entwickelte sich Schwarzsee zu einem touristischen Zentrum mit Wanderwegen, Badeplätzen und Wintersport. Die umliegende Natur blieb weitgehend unberührt, was den historischen Charakter bewahrt. Heute zieht der See Besucher durch Landschaft, Legenden und Freizeitmöglichkeiten an.",
    kategorie: "Kanton Freiburg",
  },
  {
    name: "Schloss Chenaux (Estavayer-le-Lac)",
    lat: 46.8492,
    lon: 6.8486,
    image:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
    description:
      "Das Schloss Chenaux entstand im 13. Jahrhundert und war Teil der Verteidigungsanlagen am Neuenburgersee.",
    history:
      "Es diente als Residenz lokaler Herrscherfamilien und zur Kontrolle des Seehandels. Im Mittelalter war es strategisch wichtig für den Zugang zu umliegenden Dörfern. Über die Jahrhunderte wurde es mehrfach umgebaut, um militärischen Anforderungen gerecht zu werden. Heute ist es Museum und Veranstaltungsort. Die Architektur vereint romanische und gotische Elemente. Historisch war das Schloss politisches und wirtschaftliches Zentrum der Region.",
    kategorie: "Kanton Freiburg",
  },
  {
    name: "Kloster Hauterive (Posieux)",
    lat: 46.7472,
    lon: 7.1167,
    image:
      "https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=400&q=80",
    description:
      "Das Zisterzienserkloster Hauterive wurde 1138 gegründet und war religiöses und landwirtschaftliches Zentrum.",
    history:
      "Die Mönche waren bekannt für ihre Schlichtheit und effiziente Bewirtschaftung der Almen. Hauterive spielte eine Rolle bei der Verbreitung des Zisterzienserordens in der Region. Es beherbergte Bibliotheken und leistete Bildungsarbeit für die Umgebung. Über Jahrhunderte war das Kloster wirtschaftlich und spirituell bedeutend. Die Architektur zeigt romanische und gotische Einflüsse. Heute ist das Kloster noch aktiv und ein Ort der Spiritualität und Erholung.",
    kategorie: "Kanton Freiburg",
  },
  {
    name: "Bundeshaus (Bern)",
    lat: 46.9465,
    lon: 7.4446,
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    description:
      "Das Bundeshaus in Bern wurde zwischen 1857 und 1902 erbaut und ist Sitz der Schweizer Regierung und des Parlaments.",
    history:
      "Es symbolisiert die Entstehung des modernen Bundesstaates. Historisch fanden hier wichtige politische Entscheidungen statt, die die Schweizer Demokratie prägten. Die Architektur vereint Neorenaissance- und Historismus-Elemente. Innenräume sind reich verziert und zeigen politische Geschichte. Das Bundeshaus ist sowohl politisches Zentrum als auch kulturelle Sehenswürdigkeit.",
    kategorie: "Kanton Bern",
  },
  {
    name: "Berner Altstadt",
    lat: 46.948,
    lon: 7.4474,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    description:
      "Die Altstadt Berns wurde 1191 gegründet und gehört seit 1983 zum UNESCO-Weltkulturerbe.",
    history:
      "Historisch war Bern ein Handels- und Verwaltungszentrum. Laubengänge, Brunnen, Türme und Gassen spiegeln das mittelalterliche Leben wider. Kirchen, öffentliche Gebäude und Märkte zeigen die religiöse und politische Geschichte. Über Jahrhunderte entwickelte sich die Altstadt kontinuierlich. Historische Feste und Märkte finden noch heute statt.",
    kategorie: "Kanton Bern",
  },
  {
    name: "Zytglogge (Bern)",
    lat: 46.9488,
    lon: 7.4474,
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    description:
      "Der Zytglogge-Turm wurde im 13. Jahrhundert als Stadttor und Wehrturm gebaut.",
    history:
      "Später erhielt er die astronomische Uhr und wurde zu einem Wahrzeichen Berns. Historisch diente er auch als Gefängnis. Die Uhrwerke aus dem 15. Jahrhundert gelten als Meisterwerke mittelalterlicher Technik. Die Figurenprozession ist seit Jahrhunderten Tradition. Der Turm dokumentiert Berns Entwicklung vom befestigten Markt zur modernen Stadt.",
    kategorie: "Kanton Bern",
  },
  {
    name: "Berner Münster",
    lat: 46.9479,
    lon: 7.4516,
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    description:
      "Das Münster Bern wurde 1421 begonnen und ist die größte spätgotische Kirche der Schweiz.",
    history:
      "Historisch war es religiöses Zentrum und Ort politischer Entscheidungen. Das Portal zeigt das „Jüngste Gericht“ in meisterhafter Steinmetzkunst. Es diente der Ausbildung von Handwerkern und Künstlern. Das Münster dokumentiert die Bedeutung der Kirche und Berns Macht im Mittelalter. Heute ist es Ort für Gottesdienste, Konzerte und kulturelle Veranstaltungen.",
    kategorie: "Kanton Bern",
  },
  {
    name: "Schloss Thun",
    lat: 46.757,
    lon: 7.6291,
    image:
      "https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=400&q=80",
    description: "Schloss Thun wurde um 1200 von den Zähringern erbaut.",
    history:
      "Es kontrollierte wichtige Handelswege und war Verwaltungssitz. Historisch prägte es die Stadtentwicklung von Thun. Innenräume zeigen Kunst, Möbel und regionale Geschichte. Die Architektur vereint romanische und gotische Elemente. Heute ist das Schloss Museum und beliebtes Touristenziel.",
    kategorie: "Kanton Bern",
  },
  {
    name: "Thun Altstadt",
    lat: 46.7512,
    lon: 7.6272,
    image:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
    description:
      "Die Altstadt Thun entwickelte sich rund um das Schloss im Mittelalter.",
    history:
      "Historisch war Thun Handelszentrum zwischen Alpen und Mittelland. Laubengänge, Brunnen und mittelalterliche Gebäude sind gut erhalten. Sie spiegeln die wirtschaftliche und kulturelle Entwicklung der Stadt wider. Historische Feste und Märkte werden noch heute veranstaltet.",
    kategorie: "Kanton Bern",
  },
  {
    name: "Schloss Oberhofen",
    lat: 46.7316,
    lon: 7.6632,
    image:
      "https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=400&q=80",
    description:
      "Schloss Oberhofen liegt malerisch am Thunersee und wurde im 13. Jahrhundert erbaut.",
    history:
      "Ursprünglich diente es als Wasserburg zur Kontrolle der Region und als Residenz für Adelsfamilien. Im 16. und 17. Jahrhundert wurde das Schloss erweitert und um barocke Elemente ergänzt. Historisch war es ein Verwaltungszentrum und hatte strategische Bedeutung für den Handel auf dem See. Innenräume zeigen Möbel, Kunstwerke und historische Sammlungen. Umgeben ist das Schloss von einem englischen Landschaftsgarten, der seit dem 19. Jahrhundert besteht. Heute beherbergt Schloss Oberhofen ein Museum für Kunst und Regionalgeschichte.",
    kategorie: "Kanton Bern",
  },
  {
    name: "Schloss Spiez",
    lat: 46.6867,
    lon: 7.6847,
    image:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
    description:
      "Schloss Spiez wurde im 10. Jahrhundert erstmals erwähnt und liegt direkt am Thunersee.",
    history:
      "Es diente sowohl als Burg zur Verteidigung als auch als Residenz der lokalen Herrscherfamilien. Im Laufe der Jahrhunderte wurde das Schloss mehrfach erweitert, um Wohn- und Verwaltungsräume unterzubringen. Historisch spielte es eine Rolle bei regionalen Konflikten und als Verwaltungszentrum. Innenräume zeigen Fresken, Möbel und Kunstwerke aus mehreren Jahrhunderten. Die Kapelle im Schloss ist ein Beispiel romanischer Baukunst. Heute ist Schloss Spiez Museum und kultureller Veranstaltungsort, der Geschichte, Architektur und Natur verbindet.",
    kategorie: "Kanton Bern",
  },
  {
    name: "Schloss Burgdorf",
    lat: 47.0597,
    lon: 7.6275,
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    description:
      "Schloss Burgdorf stammt aus dem 12. Jahrhundert und wurde von den Zähringern gegründet.",
    history:
      "Es diente als Verteidigungsanlage, Verwaltungssitz und Gerichtsstätte für die Region. Die strategische Lage auf einem Hügel ermöglichte Kontrolle über das Emmental. Historisch war das Schloss ein Zentrum der Macht und Verwaltung im Berner Oberland. Innenräume zeigen historische Möbel, Kunstwerke und regionale Sammlungen. Über die Jahrhunderte wurde das Schloss immer wieder umgebaut und modernisiert. Heute ist es Museum für Regionalgeschichte und kulturelle Veranstaltungen.",
    kategorie: "Kanton Bern",
  },
  {
    name: "Zentrum Paul Klee",
    lat: 46.9581,
    lon: 7.4746,
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    description:
      "Das Zentrum Paul Klee in Bern wurde 2005 eröffnet und ist dem weltberühmten Künstler Paul Klee gewidmet.",
    history:
      "Paul Klee, geboren 1879 in der Schweiz, gilt als einer der bedeutendsten Künstler des 20. Jahrhunderts. Historisch zeigt das Museum die Entwicklung der modernen Kunst in der Schweiz. Die Sammlung umfasst über 4.000 Werke Klees, darunter Gemälde, Zeichnungen und Aquarelle. Das Gebäude selbst ist architektonisch einzigartig und spiegelt moderne Gestaltungstrends wider. Das Zentrum dient auch der Forschung, Bildung und internationalen Ausstellung von Kunst. Es verbindet historische Wertschätzung des Künstlers mit zeitgenössischer Kultur. Besucher erleben hier Kunstgeschichte auf höchstem Niveau.",
    kategorie: "Kanton Bern",
  },
];

const kategorienMap = new Map(
  kategorien.map((kategorie) => [kategorie.title, kategorie.keys])
);

function createSightCard(sight) {
  return `
    <article class="sight-card">
      <img src="${sight.image}" alt="${sight.name}" loading="lazy" />
      <div>
        <span class="sight-meta">${sight.kategorie}</span>
        <h3>${sight.name}</h3>
        <p><strong>${sight.description}</strong></p>
        <p>${sight.history}</p>
      </div>
    </article>
  `;
}

function renderSights(list) {
  if (!list.length) {
    sightsContent.innerHTML =
      '<div class="notice">Keine Sehenswürdigkeiten im aktuellen Filter gefunden.</div>';
    return;
  }

  const blocks = kategorien
    .map((kategorie) => {
      const matches = list.filter((sight) =>
        kategorie.keys.includes(sight.name)
      );
      if (!matches.length) {
        return "";
      }
      return `
        <div class="category-block">
          <h2>${kategorie.title}</h2>
          ${matches.map(createSightCard).join("")}
        </div>
      `;
    })
    .filter(Boolean)
    .join("");

  sightsContent.innerHTML = blocks;
}

function ensureMap(lat, lon) {
  if (!map) {
    map = L.map("map").setView([lat, lon], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
  } else {
    map.setView([lat, lon], 12);
    markersLayer.clearLayers();
  }

  mapDiv.style.display = "block";
}

function addMarker(sight) {
  const popupHtml = `
    <div style="max-width:220px;">
      <img src="${sight.image}" alt="${sight.name}" style="width:100%;height:auto;border-radius:6px;margin-bottom:0.5rem;" />
      <strong>${sight.name}</strong><br />
      <em>${sight.description}</em>
    </div>
  `;

  L.marker([sight.lat, sight.lon]).addTo(markersLayer).bindPopup(popupHtml);
}

function showNearbySights(lat, lon) {
  const nearby = sights.filter(
    (sight) => getDistanceFromLatLonInKm(lat, lon, sight.lat, sight.lon) <= 50
  );

  renderSights(nearby);
  nearby.forEach(addMarker);
}

findMeBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    sightsContent.innerHTML =
      '<div class="notice">Geolokalisierung wird von deinem Browser nicht unterstützt.</div>';
    return;
  }

  sightsContent.innerHTML = '<div class="notice">Standort wird ermittelt...</div>';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      ensureMap(latitude, longitude);

      L.marker([latitude, longitude])
        .addTo(markersLayer)
        .bindPopup("Du bist hier!")
        .openPopup();

      showNearbySights(latitude, longitude);
    },
    () => {
      sightsContent.innerHTML =
        '<div class="notice">Dein Standort konnte nicht ermittelt werden.</div>';
    }
  );
});

showAllBtn.addEventListener("click", () => {
  renderSights(sights);
  ensureMap(46.8, 7.2);
  sights.forEach(addMarker);
});

renderSights(sights);
mapDiv.style.display = "none";