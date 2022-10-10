console.log("cof-mbe-addon =================");

class Cof_mbe_addon {
	static ID = 'cof-mbe-addon'; // nom du dossier

	static changeActorSheet(sheet, page, p3) {
		this.applyChanges(sheet, page, p3, {"chat":"Y", "inventoryDetail":"Y"});
	}

	//===
	static applyChanges(sheet, page, p3, options={}) {
		// options have to be implemented
		if (options.chat === undefined) {options.chat = "Y";}
		if (options.inventoryDetail === undefined) {options.inventoryDetail = "Y";}
		let tabCapacities   = page[0].querySelector('div.tab.capacities');
		let linesCapacities = tabCapacities.querySelectorAll('.item-list');
		let tabInventory    = page[0].querySelector('div.tab.inventory');
		let linesInventory  = tabInventory.querySelectorAll('.item-list');
		let tabCombat       = page[0].querySelector('div.tab.combat');
		let linesCombat     = tabCombat.querySelectorAll('.item-list');
		let lines = [...linesCapacities,...linesInventory,...linesCombat ];
		// add tochat button
		if (options.chat === "Y") {
			lines.forEach(line => {
				let items = line.querySelectorAll('.item-name');
				items.forEach(item => {
					let divElem  = this.buildDiv("item-controls "+this.ID+'-button', "", "top:25%; position:relative;");
					let iElem = document.createElement("i");
					iElem.className = "fas fa-comments item-to-chat";
					divElem.appendChild(iElem);
					divElem.onclick	= function(event) {
						Cof_mbe_addon.toChat(event, sheet);
					};
					item.appendChild(divElem);
				});
			});
		}
		if (options.inventoryDetail === "Y") {
			// add detail to Inventory tab
			let inventoryHeaders = tabInventory.querySelectorAll('.inventory-list'); // Armure, Contact ...
			inventoryHeaders.forEach(inventoryHeader => {
				// trt each header and its containt
				// add text to header
				let invType = inventoryHeader.dataset.category;
				let itemName = inventoryHeader.querySelector('.item-name');
				if (invType === 'armor') {
					let divElem  = this.buildDiv("item-detail", 'DEF', "border-left: 1px solid #c9c7b8;");
					itemName.after(divElem);
				}
				if (invType === 'melee' || invType === 'ranged') {
					let divElem  = this.buildDiv("item-detail", 'DM', "");
					itemName.after(divElem);
					divElem  = this.buildDiv("item-detail", 'Mod', "");
					itemName.after(divElem);
					divElem  = this.buildDiv("item-detail", 'Critique', "");
					itemName.after(divElem);
					divElem  = this.buildDiv("item-detail", 'Usage', (invType === 'melee')? 'border-left: 1px solid #c9c7b8;':'');
					itemName.after(divElem);
				}
				if (invType === 'ranged') {
					let divElem  = this.buildDiv("item-detail", 'Portée', "border-left: 1px solid #c9c7b8;");
					itemName.after(divElem);
				}
				// add info for each items of this header
				let items = inventoryHeader.querySelectorAll('.item');
				items.forEach(item => {
					let itemId=item.dataset.itemId;
					let itemObj     = sheet.actor.items.get(itemId);
					let itemName = item.querySelector('.item-name');
					let divElem;
					if (invType === 'armor') {
						divElem = this.buildDiv("item-detail", itemObj.data.data.def, 'border-left: 1px solid #c9c7b8;');
						itemName.after(divElem);
						itemName.after(this.builEmptyDetailDiv());
						itemName.after(this.builEmptyDetailDiv());
						itemName.after(this.builEmptyDetailDiv());
						itemName.after(this.builEmptyDetailDiv());
					}
					let usage = ''; // one or 2 hands ..
					if (invType === 'melee' || invType === 'ranged') {
						if (itemObj.data.data.slot === "hand") {
							if (itemObj.data.data.properties["2H"]) {
								usage = '<i class="fas fa-hand-paper"></i><i class="fas fa-hand-paper"></i>';
							}else{
								usage = '<i class="fas fa-hand-paper"></i>';
							}
						}
						divElem = this.buildDiv("item-detail", itemObj.data.data.dmg, "");
						itemName.after(divElem);
						divElem = this.buildDiv("item-detail", itemObj.data.data.mod, "");
						itemName.after(divElem);
						divElem = this.buildDiv("item-detail", itemObj.data.data.critrange, "");
						itemName.after(divElem);
					}
					if (invType === 'melee') {
						divElem = this.buildDiv("item-detail", usage, 'border-left: 1px solid #c9c7b8;');
						itemName.after(divElem);
						itemName.after(this.builEmptyDetailDiv());
					}
					if (invType === 'ranged') {
						divElem = this.buildDiv("item-detail", usage, '');
						itemName.after(divElem);
						divElem = this.buildDiv("item-detail", itemObj.data.data.range, 'border-left: 1px solid #c9c7b8');
						itemName.after(divElem);
					}
		
				});
			});
		}
	}


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
		// let buttonDisplay = `
		// <button type='button' class='cof-mbe-addon-open flex0' title='open view'>
        // 	XXX<i class='fas fa-edit'></i>
      	// </button>`;
		let chatData = {
			speaker: ChatMessage.getSpeaker(),
			content : msg
		};
		ChatMessage.create(chatData,{});

	}

	// static addClickToChat(chatMessage, f, p) {
	// 	let button = f[0].querySelector('.cof-mbe-addon-open');
	// 	//let content = chatMessage.data.content;
	// 	button.onclick = 'Cof_mbe_addon.consolelog("dd")';
	// }


	// UTILS

	static consolelog(msg) {
		console.log(msg);
	}

	static buildDiv(classes="", innerHTML="", style="") {
		let divElem = document.createElement("div");
		divElem.className = classes;
		divElem.innerHTML = innerHTML;
		divElem.style = style
		return divElem;
	}
	static builEmptyDetailDiv() {
		return this.buildDiv("item-detail", '', 'border-left: 0px; border-right: 0px');
	}
}

// html.on('click', '.cof-mbe-addon-open', (event) => {
// 	console.log('cof-mbe-addon-ope');
// });


// Hooks.on('preCreateChatMessage', (chatMessage, p1, p2) => {
// 	console.log('preCreateChatMessage');
// 	 //Cof_mbe_addon.addClickToChat(chatMessage, p);
//  });
 
//  Hooks.on('createChatMessage', (chatMessage, p1, p2) => {
// 	 console.log('createChatMessage');
// 	  //Cof_mbe_addon.addClickToChat(chatMessage, p);
// });

// Hooks.on('renderChatLog', (app, html,data) => {
// 	console.log('renderChatLog');
// 	 //Cof_mbe_addon.addClickToChat(chatMessage, p);
// });

// Hooks.on("renderCofBaseSheet", (sheet, page, p3) => {
// 	console.log(Cof_ItemToChat.ID + " HOOK renderCofBaseSheet ============");
// });

// Hooks.on('createChatMessage', (chatMessage, p) => {
// 	Cof_mbe_addon.addClickToChat(chatMessage, p);
// });

// Hooks.on('renderChatLog', (chatMessage, f, p) => {
// 	Cof_mbe_addon.addClickToChatLog(chatMessage, f, p);
// });

Hooks.on("renderActorSheet",  (sheet, page, p3) => {
	Cof_mbe_addon.changeActorSheet(sheet, page, p3);
});

// Hooks.on("getCofActorSheetHeaderButtons", (cofActorSheet, arr) => {
// 	// 0: {label: 'Close', class: 'close', icon: 'fas fa-times', onclick: ƒ}
// 	console.log('Hooks.on("getCofActorSheetHeaderButtons"');
// });

// Hooks.on("getCofBaseSheetHeaderButtons", (cofActorSheet, arr) => {
// 	// 0: {label: 'Close', class: 'close', icon: 'fas fa-times', onclick: ƒ}
// 	console.log('Hooks.on("getCofBaseSheetHeaderButtons"');
// });

// Hooks.on("getActorSheetHeaderButtons", (cofActorSheet, arr) => {
// 	// 0: {label: 'Close', class: 'close', icon: 'fas fa-times', onclick: ƒ}
// 	console.log('Hooks.on("getActorSheetHeaderButtons"');
// });

// Hooks.on("renderCofActorSheet", (cofActorSheet, f, p) => {
// 	// S.fn.init(1)
// 	//   div#actor-l8LSySWCqxxapQ8m.app.window-app.cof.sheet.actor ...
// 	// {...}
// 	//   {cssClass: 'editable', editable: true, document: CofActor, data: {…}, limited: false, …}
// 	console.log('Hooks.on("renderCofActorSheet"');
// });

// Hooks.on("renderCofBaseSheet", (cofActorSheet, f, p) => {
// 	// S.fn.init(1)
// 	//   div#actor-l8LSySWCqxxapQ8m.app.window-app.cof.sheet.actor ...
// 	// {...}
// 	//   {cssClass: 'editable', editable: true, document: CofActor, data: {…}, limited: false, …}
// 	console.log('Hooks.on("renderCofBaseSheet"');
// });

// Hooks.on("renderActorSheet", (cofActorSheet, f, p) => {
// 	// S.fn.init(1)
// 	//   div#actor-l8LSySWCqxxapQ8m.app.window-app.cof.sheet.actor ...
// 	// {...}
// 	//   {cssClass: 'editable', editable: true, document: CofActor, data: {…}, limited: false, …}
// 	console.log('Hooks.on("renderCofBaseSheet"');
// });

