console.log("cof-mbe-addon =================");

class Cof_mbe_addon {
	static ID = 'cof-mbe-addon'; // nom du dossier

	/**
    * Callback on render item actions : send description to chat
    * @param event
	* @param sheet actor sheet
    * @private
    */	
	static toChat(event, sheet) {
		event.preventDefault();
		let entity = sheet.actor.items.get($(event.currentTarget).parents('.item').data("itemId"));

		// decription may begin by "<h1>Description</h1>", we suppress it
		let description = entity.data.data.description;
		if (description.startsWith("<h1>Description</h1>")) {
			description = description.substr(20);
		}
		let msg = '<h1>' +entity.data.name+ '</h1>' + description;
		
		if (entity.data.data.limited) { msg +='<span class="tag">' +game.i18n.localize("COF.ui.limited")+ ' | </span>';}
		if (entity.data.data.spell) { msg +='<span class="tag">' +game.i18n.localize("COF.ui.spell")+ ' | </span>';}
		if (entity.data.data.ranged) { msg +='<span class="tag">' +game.i18n.localize("COF.properties.ranged")+ ' | </span>';}                    
		if (entity.data.data.limitedUsage) { msg +='<span class="tag">' +game.i18n.localize("COF.ui.limitedUsage")+ ' | </span>';}
		if (entity.data.data.save) { msg +='<span class="tag">' +game.i18n.localize("COF.ui.save")+ ' | </span>';}
		if (entity.data.data.activable) { msg +='<span class="tag">' +game.i18n.localize("COF.properties.activable")+ ' | </span>';}
		if (entity.data.data.heal) { msg +='<span class="tag">' +game.i18n.localize("COF.ui.heal")+ ' | </span>';}
		if (entity.data.data.attack) { msg +='<span class="tag">' +game.i18n.localize("COF.ui.attack")+ ' | </span>';}
		if (entity.data.data.buff) { msg +='<span class="tag">' +game.i18n.localize("COF.ui.buff")+ ' | </span>';}
		if (entity.data.data.useMacro) { msg +='<span class="tag">' +game.i18n.localize("COF.capacity.useMacro")+ ' | </span>';}
		let chatData = {
			speaker: ChatMessage.getSpeaker(),
			content : msg
		};
		ChatMessage.create(chatData,{});

	}
}
// Hooks.on("renderCofBaseSheet", (sheet, page, p3) => {
// 	console.log(Cof_ItemToChat.ID + " HOOK renderCofBaseSheet ============");
// });


Hooks.on("renderActorSheet",  (sheet, page, p3) => {
	//console.log(Cof_mbe_addon.ID + "  HOOK renderActorSheet ============");
	let tabCapacities   =  page[0].querySelector('div.tab.capacities');
	let linesCapacities = tabCapacities.querySelectorAll('.item-list');
	let tabInventory    =  page[0].querySelector('div.tab.inventory');
	let linesInventory  = tabInventory.querySelectorAll('.item-list');
	let tabCombat       =  page[0].querySelector('div.tab.combat');
	let linesCombat     = tabCombat.querySelectorAll('.item-list');
	let lines = [...linesCapacities,...linesInventory,...linesCombat ];
	lines.forEach(line => {
		let items = line.querySelectorAll('.item-name');
		items.forEach(item => {
			let divElem = document.createElement("div");
			divElem.className = "item-controls ";
			divElem.className += Cof_mbe_addon.ID+'-button';
			divElem.style.top = "25%";
			divElem.style.position = "relative";
			let iElem = document.createElement("i");
			iElem.className = "fas fa-comments item-to-chat";
			divElem.appendChild(iElem);
			divElem.onclick	= function(event) {
				console.log("cliqué");
				console.log(event);
				Cof_mbe_addon.toChat(event, sheet);
			};
			item.appendChild(divElem);
		});
	});
});