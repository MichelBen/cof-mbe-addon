export function registerSettings() {
	// game.settings.registerMenu(Cof_mbe_addon.ID, "Cof_mbe_addon_settings", {
		// name: "COF MBE Settings",
		// label: "COF MBE Settings",
		// icon: "fas fa-users",
		// type: SystemProviderSettings,
		// restricted: true,
	// });
	// game.settings.register("party-overview", "EnablePlayerAccess", {
		// name: game.i18n.localize(`party-overview.EnablePlayerAccess.Name`),
		// hint: game.i18n.localize(`party-overview.EnablePlayerAccess.Hint`),
		// scope: "world",
		// default: true,
		// config: true,
		// type: Boolean,
	// });
	game.settings.register('cof-mbe-addon', "Cof_mbe_addon_settings", {
		name : 'name COF MBE Settings ',
		hint : 'hint COF MBE Settings ',
		scope: "world",
		label: "label COF MBE Settings",
		config:true,
		type: String,
		default: "AAA",
		//onChange: updateSystemProvider,
		onChange: value => { // value is the new value of the setting
			console.log(value);
		},
	});
}