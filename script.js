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
      "https://fribourg.ch/wp-content/uploads/2021/08/06339-1536x864.jpg",
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
      "https://www.discoverwalks.com/blog/wp-content/uploads/2022/09/1920px-12_chateau_de_gruyeres_photo_by_giles_laurent.jpg",
    description:
      "Das Schloss Gruyères wurde im 13. Jahrhundert errichtet und war Sitz der Grafen von Greyerz.",
    history:
       `Schloss Gruyères wirkt märchenhaft, hoch über dem gleichnamigen Städtchen.<br><br><strong>Die Grafen von Gruyères</strong><br>• Entstehung: 13. Jahrhundert<br>• Sitz der Grafen von Gruyères, eines der ältesten Adelsgeschlechter der Region<br>• Kontrolle wichtiger Alpenübergänge und Handelswege<br><br>Doch Macht kostet Geld – und davon hatten sie irgendwann zu wenig.<br><br><strong>Der grosse Absturz</strong><br>Im 16. Jahrhundert: Schulden explodieren, 1554 folgt der Bankrott.<br>Das Schloss wird übernommen:<br>• Erst von Bern<br>• Dann von Freiburg<br><br>Ein klassisches Beispiel dafür, wie mittelalterlicher Adel an neuen politischen und wirtschaftlichen Realitäten scheitert.<br><br><strong>Kunst statt Krieg</strong><br>Ab dem 19. Jahrhundert wird das Schloss von Künstlern entdeckt. Historismus, Romantik und Mittelalter-Sehnsucht prägen die Inszenierung als Mythos-Ort.<br><br>Heute ist es Museum, Kunstort und ein Beispiel dafür, wie Geschichte neu erzählt und romantisiert wird.`,
    kategorie: "Kanton Freiburg",
  },
  {
    name: "Murten (Morat)",
    lat: 46.9291,
    lon: 7.1166,
    image:
      "https://tse4.mm.bing.net/th/id/OIP.4HiaQ0SzSwX_KhXeELb3LwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
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
      "https://live.staticflickr.com/3807/10429552695_3d802c51c6_b.jpg",
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
      "https://fribourg.ch/wp-content/uploads/2022/11/Tour-Carree-Chateau-Estavayer-Automne-%C2%A9-Pierre-Cuony-Fotographies-2021-5.jpg",
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
      "https://media.myswitzerland.com/image/fetch/c_lfill,g_auto,w_3200,h_1800/f_auto,q_80,fl_keep_iptc/https://www.myswitzerland.com/-/media/celum%20connect/2022/12/01/15/59/54/vully-vineyards.jpg",
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
      "https://www.ourswissexperience.com/wp-content/uploads/2020/05/Wandern-mit-Kindern-Schwarzsee-G%C3%BCger-2-1.jpg",
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
      "https://fribourg.ch/wp-content/uploads/2024/01/Vue-aerienne-Chateau-Estavayer-Automne-%C2%A9-Pierre-Cuony-Photographies-2021-9.jpg",
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
      "https://live.staticflickr.com/65535/52148452108_ab61c0b70e.jpg",
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
      "https://thumbs.dreamstime.com/b/bundeshaus-bern-switzerland-swiss-capital-building-84783608.jpg",
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
      "https://tse1.mm.bing.net/th/id/OIP.S4KCL-Ifdpw-A1z61kH7agHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",
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
      "https://thumbs.dreamstime.com/b/zytglogger-turm-bern-schweiz-zytglogge-ist-ein-bedeutender-mittelalterlicher-uhrturm-stadt-166233480.jpg",
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
      "https://www.wifag-areal.ch/uploads/transformationen/Lageplan-Stocks/_1000xAUTO_fit_center-center_85_none/Lageplan_Berner_Muenster.jpg",
    description:
      "Das Berner Münster wurde 1421 begonnen und ist die größte spätgotische Kirche der Schweiz. Doch es ist weit mehr als ein Gotteshaus. Das Berner Münster ist nicht nur die größte Kirche der Schweiz, sondern auch ein echtes Geschichtsbuch aus Stein.",
    history:
      `Das Berner Münster ist nicht nur die größte Kirche der Schweiz, sondern auch ein echtes Geschichtsbuch aus Stein.<br><br><strong>Entstehung &amp; Bedeutung</strong><br>• Baubeginn: 1421 – mitten im Aufstieg Berns zur mächtigen Stadtstaat-Republik<br>• Bauzeit: über 400 Jahre (der Turm wurde erst 1893 vollendet)<br>• Stil: Spätgotik, bewusst monumental – Bern wollte zeigen: Wir sind wer.<br><br>Die Kirche war nie nur religiöses Zentrum, sondern auch politisches Symbol. Der Stadtrat sass oft im Münster, wichtige Entscheidungen wurden im Schatten des Chors getroffen.<br><br><strong>Das Weltgericht am Portal</strong><br>Das absolute Highlight ist das Weltgerichtsportal:<br>• Über 230 Figuren, original aus dem 15. Jahrhundert<br>• Es zeigt drastisch:<br>&nbsp;&nbsp;• Die Seligen auf der einen Seite<br>&nbsp;&nbsp;• Die Verdammten auf der anderen<br>• Für die Menschen des Mittelalters war das keine Kunst, sondern Warnung: Dein Leben entscheidet über Himmel oder Hölle.<br><br>Gerade in einer Zeit ohne Bücher war das Portal so etwas wie ein visuelles Glaubensgesetz.<br><br><strong>Reformation &amp; Bruch</strong><br>1530er-Jahre: Bern wird reformiert.<br>• Altäre werden zerstört<br>• Bilder entfernt<br>• Das Münster wird vom katholischen Prunkraum zur nüchternen Predigtkirche<br><br>Ein stiller, aber radikaler Wandel – und das Münster steht genau im Zentrum dieser Zeitenwende.`,
    kategorie: "Kanton Bern",
  },
  {
    name: "Schloss Thun",
    lat: 46.757,
    lon: 7.6291,
    image:
      "https://th.bing.com/th/id/R.c785f1f0d4abf371acf05269df19352e?rik=OnLwJVCKaApMdg&riu=http%3a%2f%2fimg.fotocommunity.com%2fschloss-thun-f31f2760-3be5-46c4-818d-911d21ec5729.jpg%3fheight%3d1080&ehk=jB4f8iX0H7xdqqcJthvU8ahbmVAMM3plyRb%2fY34e80c%3d&risl=&pid=ImgRaw&r=0",
    description: "Schloss Thun wurde um 1200 von den Zähringern erbaut.",
    history:
      `Entstehung & Bedeutung: Der Baubeginn fiel in eine Zeit, in der Bern sich vom regionalen Zentrum zur mächtigen Stadtstaat-Republik entwickelte. Der Bau dauerte über 400 Jahre – der markante Turm wurde erst 1893 vollendet. Der spätgotische Stil ist bewusst monumental gewählt, um Berns Macht zu zeigen. Historisch war das Münster religiöses Zentrum und politisches Symbol; der Stadtrat versammelte sich oft im Münster. Es diente außerdem als Ausbildungsort für Handwerker und Künstler. Das Weltgerichtsportal zeigt über 230 Figuren aus dem 15. Jahrhundert mit Seligen und Verdammten als eindrückliche Warnung. In den 1530er-Jahren brachte die Reformation einen Bruch: Altäre wurden zerstört, Bilder entfernt, und das Münster wandelte sich zur schlichten Predigtkirche. Heute ist es Ort für Gottesdienste, Konzerte und kulturelle Veranstaltungen und dokumentiert eindrucksvoll die Bedeutung von Kirche und Politik im Mittelalter.`,
    kategorie: "Kanton Bern",
  },
  {
    name: "Thun Altstadt",
    lat: 46.7512,
    lon: 7.6272,
    image:
      "https://th.bing.com/th/id/R.2d5a04c4d5a28e0ea26865763bd49c1f?rik=cEswIFqlNuZ%2fqw&pid=ImgRaw&r=0",
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
      "https://img.fotocommunity.com/schloss-oberhofen-thuner-see-ch-1d0d05d1-7140-49f2-abaf-93ec02af8c93.jpg?height=1080",
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
      "https://img.fotocommunity.com/schloss-spiez-am-thunersee-e087f0ff-f0b7-4cd6-ab1e-3b8198600af2.jpg?height=1080",
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
      "https://schloss-burgdorf.ch/wp-content/uploads/2019/03/Home_Schloss-Burgdorf_Sommerabend_2750x1160px-1200x515.jpg",
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
      "https://i.pinimg.com/originals/40/6e/fd/406efdf691f3af241deb5af5d09f4f9a.jpg",
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