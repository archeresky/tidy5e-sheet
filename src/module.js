import { Tidy5eSettingsGmOnlySetup, Tidy5eUserSettings } from "./scripts/app/settings";
import {
  Tidy5eExhaustionCreateActiveEffect,
  Tidy5eExhaustionDeleteActiveEffect,
  Tidy5eExhaustionDnd5eRestCompleted,
} from "./scripts/app/tidy5e-exhaustion";
import { Tidy5eHBUpcastFreeSpellsDnd5ePreItemUsageConsumption } from "./scripts/app/tidy5e-hb-upcast-free-spell";
import { debug, warn } from "./scripts/app/tidy5e-logger-util";
import { preloadTidy5eHandlebarsTemplates } from "./scripts/app/tidy5e-templates";
import { Tidy5eSheetItemInitialize } from "./scripts/tidy5e-item";
import { Tidy5eSheetNPCInitialize } from "./scripts/tidy5e-npc";
import {
  Tidy5eSheet,
  Tidy5eSheetApplyActiveEffect,
  Tidy5eSheetCreateActiveEffect,
  Tidy5eSheetDeleteActiveEffect,
  Tidy5eSheetInitialize,
  Tidy5eSheetRenderAbilityUseDialog,
  Tidy5eSheetUpdateActiveEffect,
} from "./scripts/tidy5e-sheet";
import { Tidy5eSheetVehicleInitialize } from "./scripts/tidy5e-vehicle";

Hooks.once("init", async () => {
  // init user settings menu
  Tidy5eUserSettings.init();
  debug(`module | init | start`);
  // Preload tidy5e Handlebars Templates
  preloadTidy5eHandlebarsTemplates();

  Tidy5eSheetInitialize();
  Tidy5eSheetNPCInitialize();
  Tidy5eSheetVehicleInitialize();
  Tidy5eSheetItemInitialize();
  debug(`module | init | end`);
});

Hooks.once("ready", async (app, html, data) => {
  debug(`module | ready | start`);
  if (!game.modules.get("colorsettings")?.active && game.user?.isGM) {
    let word = "install and activate";
    if (game.modules.get("colorsettings")) word = "activate";
    const errorText =
      `module | I'ts advisable to install the 'colorsettings' module for a better behaviour. Please ${word} it.`.replace(
        "<br>",
        "\n"
      );
    warn(errorText);
  }
  debug(`module | ready | end`);
});

/** perform some necessary operations on character sheet **/
Hooks.on(`dnd5e.restCompleted`, (actorEntity, data) => {
  Tidy5eExhaustionDnd5eRestCompleted(actorEntity, data);
});

Hooks.on("applyActiveEffect", (actor, effect, options) => {
  Tidy5eSheetApplyActiveEffect(actor, effect, options);
});

Hooks.on(`createActiveEffect`, (activeEffect, _config, options) => {
  Tidy5eSheetCreateActiveEffect(activeEffect, _config, options);
  Tidy5eExhaustionCreateActiveEffect(activeEffect, _config, options);
});

Hooks.on("updateActiveEffect", (activeEffect, _config, options) => {
  Tidy5eSheetUpdateActiveEffect(activeEffect, _config, options);
});

Hooks.on(`deleteActiveEffect`, (activeEffect, _config, options) => {
  Tidy5eSheetDeleteActiveEffect(activeEffect, _config, options);
  Tidy5eExhaustionDeleteActiveEffect(activeEffect, _config, options);
});

Hooks.on("renderTidy5eUserSettings", () => {
  Tidy5eSettingsGmOnlySetup();
});

Hooks.on("dnd5e.preItemUsageConsumption", (item, config, options) => {
  Tidy5eHBUpcastFreeSpellsDnd5ePreItemUsageConsumption(item, config, options);
});

Hooks.on("renderAbilityUseDialog", (app, html, options) => {
  Tidy5eSheetRenderAbilityUseDialog(app, html, options);
});
