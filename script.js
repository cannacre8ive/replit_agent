const systems = [
  {
    name: "BLAZE",
    monthlyCost: 650,
    setupCost: 1200,
    features: ["Ecommerce", "Loyalty", "Delivery", "API", "MultiStore", "Hardware"],
    compliance: ["Metrc", "OLCC", "Manifest", "Tax", "Audit"],
  },
  {
    name: "Dutchie",
    monthlyCost: 700,
    setupCost: 1500,
    features: ["Ecommerce", "Loyalty", "Delivery", "API", "MultiStore"],
    compliance: ["Metrc", "OLCC", "Tax", "Audit"],
  },
  {
    name: "Cova",
    monthlyCost: 580,
    setupCost: 1100,
    features: ["Ecommerce", "Loyalty", "API", "MultiStore", "Hardware"],
    compliance: ["Metrc", "OLCC", "Tax", "Audit"],
  },
  {
    name: "IndicaOnline",
    monthlyCost: 420,
    setupCost: 600,
    features: ["Ecommerce", "Loyalty", "API", "Hardware"],
    compliance: ["Metrc", "OLCC", "Tax"],
  },
  {
    name: "Flowhub",
    monthlyCost: 560,
    setupCost: 1000,
    features: ["Ecommerce", "Loyalty", "API", "MultiStore", "Hardware"],
    compliance: ["Metrc", "OLCC", "Tax", "Audit"],
  },
  {
    name: "Treez",
    monthlyCost: 740,
    setupCost: 1800,
    features: ["Ecommerce", "Loyalty", "Delivery", "API", "MultiStore"],
    compliance: ["Metrc", "OLCC", "Manifest", "Tax", "Audit"],
  },
  {
    name: "Green Bits",
    monthlyCost: 520,
    setupCost: 900,
    features: ["Ecommerce", "Loyalty", "API", "Hardware"],
    compliance: ["Metrc", "OLCC", "Tax", "Audit"],
  },
].map((item) => ({
  ...item,
  complianceScore: item.compliance.length,
  featureCount: item.features.length,
}));

const state = {
  query: "",
  maxPrice: null,
  compliance: "",
  feature: "",
  sortBy: "name",
  sortDirection: "asc",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const el = {
  searchInput: document.getElementById("searchInput"),
  maxPrice: document.getElementById("maxPrice"),
  complianceFilter: document.getElementById("complianceFilter"),
  featureFilter: document.getElementById("featureFilter"),
  sortBy: document.getElementById("sortBy"),
  resetBtn: document.getElementById("resetBtn"),
  dashboardBody: document.getElementById("dashboardBody"),
  visibleCount: document.getElementById("visibleCount"),
  avgMonthly: document.getElementById("avgMonthly"),
};

function getFilteredSystems() {
  const filtered = systems.filter((system) => {
    const matchesQuery = system.name.toLowerCase().includes(state.query);
    const matchesMaxPrice = state.maxPrice == null || system.monthlyCost <= state.maxPrice;
    const matchesCompliance = !state.compliance || system.compliance.includes(state.compliance);
    const matchesFeature = !state.feature || system.features.includes(state.feature);

    return matchesQuery && matchesMaxPrice && matchesCompliance && matchesFeature;
  });

  return filtered.sort((a, b) => {
    const direction = state.sortDirection === "asc" ? 1 : -1;

    if (state.sortBy === "name") {
      return a.name.localeCompare(b.name) * direction;
    }

    return (a[state.sortBy] - b[state.sortBy]) * direction;
  });
}

function badges(items) {
  return `<div class="badges">${items
    .map((item) => `<span class="badge">${item}</span>`)
    .join("")}</div>`;
}

function renderTable() {
  const rows = getFilteredSystems();

  el.dashboardBody.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td><strong>${row.name}</strong></td>
        <td>${formatCurrency(row.monthlyCost)}</td>
        <td>${formatCurrency(row.setupCost)}</td>
        <td><span class="score">${row.complianceScore}/5</span></td>
        <td>${row.featureCount}</td>
        <td>${badges(row.features)}</td>
        <td>${badges(row.compliance)}</td>
      </tr>`
    )
    .join("");

  const average =
    rows.length === 0
      ? 0
      : Math.round(rows.reduce((sum, item) => sum + item.monthlyCost, 0) / rows.length);

  el.visibleCount.textContent = rows.length;
  el.avgMonthly.textContent = formatCurrency(average);
}

function updateSort(sortBy) {
  if (state.sortBy === sortBy) {
    state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
  } else {
    state.sortBy = sortBy;
    state.sortDirection = sortBy === "name" ? "asc" : "asc";
  }

  el.sortBy.value = state.sortBy;
  renderTable();
}

el.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim().toLowerCase();
  renderTable();
});

el.maxPrice.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  state.maxPrice = Number.isFinite(value) && value > 0 ? value : null;
  renderTable();
});

el.complianceFilter.addEventListener("change", (event) => {
  state.compliance = event.target.value;
  renderTable();
});

el.featureFilter.addEventListener("change", (event) => {
  state.feature = event.target.value;
  renderTable();
});

el.sortBy.addEventListener("change", (event) => {
  state.sortBy = event.target.value;
  state.sortDirection = event.target.value === "name" ? "asc" : "asc";
  renderTable();
});

document.querySelectorAll(".sort-btn").forEach((button) => {
  button.addEventListener("click", () => updateSort(button.dataset.sort));
});

el.resetBtn.addEventListener("click", () => {
  state.query = "";
  state.maxPrice = null;
  state.compliance = "";
  state.feature = "";
  state.sortBy = "name";
  state.sortDirection = "asc";

  el.searchInput.value = "";
  el.maxPrice.value = "";
  el.complianceFilter.value = "";
  el.featureFilter.value = "";
  el.sortBy.value = "name";

  renderTable();
});

renderTable();
