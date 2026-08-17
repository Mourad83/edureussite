const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const globalSearch = document.getElementById("globalSearch");
const searchButton = document.getElementById("searchButton");
const searchMessage = document.getElementById("searchMessage");
const resourceGrid = document.getElementById("resourceGrid");
const resourceCards = [...document.querySelectorAll(".resource-card")];
const filterChips = [...document.querySelectorAll(".filter-chip")];
const levelFilters = [...document.querySelectorAll(".resource-filter")];
const subjectFilters = [...document.querySelectorAll(".subject-filter")];
const resetFilters = document.getElementById("resetFilters");
const emptyState = document.getElementById("emptyState");
const resourceSubtitle = document.getElementById("resourceSubtitle");

let activeFilters = {
  query: "",
  type: "Tous",
  level: "",
  subject: ""
};

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function applyFilters() {
  let visibleCount = 0;

  resourceCards.forEach((card) => {
    const haystack = normalize(
      [
        card.dataset.title,
        card.dataset.level,
        card.dataset.subject,
        card.dataset.type,
        card.textContent
      ].join(" ")
    );

    const matchesQuery = !activeFilters.query || haystack.includes(normalize(activeFilters.query));
    const matchesType = activeFilters.type === "Tous" || card.dataset.type === activeFilters.type;
    const matchesLevel = !activeFilters.level || card.dataset.level === activeFilters.level;
    const matchesSubject = !activeFilters.subject || card.dataset.subject === activeFilters.subject;

    const visible = matchesQuery && matchesType && matchesLevel && matchesSubject;
    card.classList.toggle("hidden", !visible);

    if (visible) {
      visibleCount += 1;
    }
  });

  emptyState.style.display = visibleCount === 0 ? "block" : "none";

  const context = [];
  if (activeFilters.level) context.push(activeFilters.level);
  if (activeFilters.subject) context.push(activeFilters.subject);
  if (activeFilters.type !== "Tous") context.push(activeFilters.type);

  resourceSubtitle.textContent = context.length
    ? `${visibleCount} ressource(s) pour : ${context.join(" · ")}`
    : "Cours, exercices, corrigés et examens disponibles dans la plateforme.";

  searchMessage.textContent = activeFilters.query
    ? `${visibleCount} résultat(s) pour « ${activeFilters.query} »`
    : "";
}

function runSearch() {
  activeFilters.query = globalSearch.value.trim();
  applyFilters();
  document.getElementById("ressources").scrollIntoView({ behavior: "smooth" });
}

searchButton.addEventListener("click", runSearch);

globalSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runSearch();
  }
});

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    activeFilters.type = chip.dataset.type;

    filterChips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");

    applyFilters();
  });
});

levelFilters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilters.level = button.dataset.level;
    activeFilters.subject = "";
    activeFilters.query = "";
    globalSearch.value = "";
    applyFilters();
    document.getElementById("ressources").scrollIntoView({ behavior: "smooth" });
  });
});

subjectFilters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilters.subject = button.dataset.subject;
    activeFilters.level = "";
    activeFilters.query = "";
    globalSearch.value = "";
    applyFilters();
    document.getElementById("ressources").scrollIntoView({ behavior: "smooth" });
  });
});

resetFilters.addEventListener("click", () => {
  activeFilters = {
    query: "",
    type: "Tous",
    level: "",
    subject: ""
  };

  globalSearch.value = "";
  filterChips.forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.type === "Tous");
  });

  applyFilters();
});

document.getElementById("currentYear").textContent = new Date().getFullYear();

resourceGrid.addEventListener("click", (event) => {
  const link = event.target.closest("a");

  if (!link) {
    return;
  }

  if (link.getAttribute("href") === "#") {
    event.preventDefault();
    alert("Cette ressource est un exemple de la V1. Le PDF ou la page de cours sera ajouté à l'étape suivante.");
  }
});

const langSwitch=document.getElementById("langSwitch");
let currentLang="fr";

function setLanguage(lang){
  currentLang=lang;
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-fr][data-ar]").forEach(el=>{
    el.textContent=el.dataset[lang];
  });
  document.querySelectorAll("[data-placeholder-fr][data-placeholder-ar]").forEach(el=>{
    el.placeholder=lang==="ar"?el.dataset.placeholderAr:el.dataset.placeholderFr;
  });
  document.querySelector(".lang-fr")?.classList.toggle("active",lang==="fr");
  document.querySelector(".lang-ar")?.classList.toggle("active",lang==="ar");
}

langSwitch?.addEventListener("click",()=>setLanguage(currentLang==="fr"?"ar":"fr"));
setLanguage("fr");
