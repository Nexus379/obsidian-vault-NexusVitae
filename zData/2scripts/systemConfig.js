const DEFAULT_CONFIG_PATH = "zData/4values/NexusVitae_SystemConfig.json";

async function load(app, configPath = DEFAULT_CONFIG_PATH) {
  try {
    if (!(await app.vault.adapter.exists(configPath))) return defaults();
    const raw = await app.vault.adapter.read(configPath);
    return Object.assign(defaults(), JSON.parse(raw));
  } catch (error) {
    console.warn("[NexusVitae] Could not load system config.", error);
    return defaults();
  }
}

function defaults() {
  return {
    version: 1,
    roots: {
      calendar: "0_Calendar",
      stars: "1_Stars",
      areas: "2_Areas",
      projects: "3_Projects",
      tasks: "4_Tasks",
      notes: "5_Notes",
      resources: "6_Resources",
      atlas: "0_Atlas",
      archive: "yArchive",
      system: "zData"
    },
    router: [],
    templates: {
      root: "zData/1tmpl",
      plans: {}
    },
    values: {
      taxonomy: "zData/yaml tags organization.md"
    },
    entities: {
      home: "6_Resources/_Entities/Home",
      travel: "6_Resources/_Entities/Travel"
    },
    areas: {
      root: "2_Areas",
      mainPlans: {}
    },
    generated: {},
    metaBind: {}
  };
}

function root(config, key, fallback = "") {
  return config?.roots?.[key] || fallback;
}

function areaPlan(config, key, fallback = "") {
  return config?.areas?.mainPlans?.[key] || fallback;
}

function templateRoot(config) {
  return config?.templates?.root || "zData/1tmpl";
}

function systemConfig() {
  return {
    DEFAULT_CONFIG_PATH,
    load,
    defaults,
    root,
    areaPlan,
    templateRoot
  };
}

module.exports = systemConfig;
