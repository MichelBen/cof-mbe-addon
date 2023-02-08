// import { registerSettings } from "./settings.js";

console.log("cof-mbe-addon =================");

// https://fontawesome.com/v4/cheatsheet/

class Cof_mbe_addon {
	static ID = 'cof-mbe-addon'; // nom du dossier
	static PATH_TEMPLATE = "modules/"+this.ID+"/templates";
	static HELP_CARACT_SETTING_NAME = "journalHelpCaract";
	static DEFAULT_JOURNAL_HELP_CARACT_PREFIX = Cof_mbe_addon.ID +"_helpcaract_";

	static changeActorSheet(sheet, page, p3) {
		this.applyChanges(sheet, page, p3, {"chat":"Y", "inventoryDetail":"Y"});
	}

	//===
	// sheet = CofActorShee
	// sheet.object.data = ActorData
	static applyChanges(sheet, page, p3, options={}) {
		// options have to be implemented
		if (options.chat === undefined) {options.chat = "Y";}
		if (options.inventoryDetail === undefined) {options.inventoryDetail = "Y";}
		let actorData = sheet.object.data;
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

		// add detail in inventory tab
		if (options.inventoryDetail === "Y") {
			// add detail to Inventory tab
			let inventoryHeaders = tabInventory.querySelectorAll('.inventory-list'); // Armure, Contact ...
			let divElem;
			inventoryHeaders.forEach(inventoryHeader => {
				// trt each header and its containt
				// add text to header
				let invType = inventoryHeader.dataset.category;
				let itemName = inventoryHeader.querySelector('.item-name');
				switch (true) {
					//if (invType === 'armor') {
					case invType === 'armor' || invType === 'shield':
						divElem  = this.buildDiv("item-detail", 'DEF', "border-left: 1px solid #c9c7b8;");
						itemName.after(divElem);
						break;
					//}
					//if (invType === 'melee' || invType === 'ranged') {
					case invType === 'melee' || invType === 'ranged' :
						divElem  = this.buildDiv("item-detail", 'DM', "");
						itemName.after(divElem);
						divElem  = this.buildDiv("item-detail", 'Mod', "");
						itemName.after(divElem);
						divElem  = this.buildDiv("item-detail", 'Critique', "");
						itemName.after(divElem);
						divElem  = this.buildDiv("item-detail", 'Usage', (invType === 'melee')? 'border-left: 1px solid #c9c7b8;':'');
						itemName.after(divElem);
					//}
						if (invType === 'ranged') {
							divElem  = this.buildDiv("item-detail", 'Portée', "border-left: 1px solid #c9c7b8;");
							itemName.after(divElem);
						}
				}
				// add info for each items of this header
				let items = inventoryHeader.querySelectorAll('.item');
				items.forEach(item => {
					let itemId=item.dataset.itemId;
					let itemObj     = sheet.actor.items.get(itemId);
					let itemName = item.querySelector('.item-name');
					//let divElem;
					let usage = ''; // one or 2 hands ..
					switch (true) {
						//if (invType === 'armor') {
						case invType === 'armor'  || invType === 'shield':
							divElem = this.buildDiv("item-detail", itemObj.data.data.def, 'border-left: 1px solid #c9c7b8;');
							itemName.after(divElem);
							itemName.after(this.builEmptyDetailDiv());
							itemName.after(this.builEmptyDetailDiv());
							itemName.after(this.builEmptyDetailDiv());
							itemName.after(this.builEmptyDetailDiv());
							break;
						//}
						
						//if (invType === 'melee' || invType === 'ranged') {
						case invType === 'melee' || invType === 'ranged' :
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
						//}
							switch (true) {
								//if (invType === 'melee') {
								case invType === 'melee' :
									divElem = this.buildDiv("item-detail", usage, 'border-left: 1px solid #c9c7b8;');
									itemName.after(divElem);
									itemName.after(this.builEmptyDetailDiv());
									break;
								//}
								//if (invType === 'ranged') {
								case invType === 'ranged' :
									divElem = this.buildDiv("item-detail", usage, '');
									itemName.after(divElem);
									divElem = this.buildDiv("item-detail", itemObj.data.data.range, 'border-left: 1px solid #c9c7b8');
									itemName.after(divElem);
									break;
								//}
							}
							break;
						default:
							itemName.after(this.builEmptyDetailDiv());
							itemName.after(this.builEmptyDetailDiv());
							itemName.after(this.builEmptyDetailDiv());
							itemName.after(this.builEmptyDetailDiv());
							itemName.after(this.builEmptyDetailDiv());
					}
				});
			});
		}
		
		
		// add tooltip on carac
		if ("character" == actorData.type) {
			//let actorNode = page[0].querySelector('div.actor');
			let xpath = 'div/div[2]/div[3]/section/div[2]/div[3]/div[2]/div[1]/div[1]'
			if (  page[0].outerHTML.substring(0, 5) != "<form") {
				xpath = 'section/form/' + xpath;
			}
			//let t = document.evaluate(xpath, actorNode, null, XPathResult.ANY_TYPE, null);
			let t = document.evaluate(xpath, page[0], null, XPathResult.ANY_TYPE, null);
			let divTextRecup = t.iterateNext();
			
			let divElem  = this.buildDiv("", "", "");
			divElem.setAttribute("data-" +Cof_mbe_addon.ID+ "_caract", "RP");
			let iElem = document.createElement("i");
			iElem.className = "fas fa-eye item-to-chat";
			divElem.onclick	= function(event) {
				Cof_mbe_addon.displayCaractTip(event, sheet);
			};
			divElem.appendChild(iElem);
			divTextRecup.appendChild(divElem);
		}

	}

	static getJournalOfCaractTipName(caract) {
		let journalPrefix = Cof_mbe_addon.DEFAULT_JOURNAL_HELP_CARACT_PREFIX;
		//let caract = event.currentTarget.getAttribute("data-" +Cof_mbe_addon.ID+ "_caract");
		let journalCaractName = journalPrefix + caract;
		return journalCaractName;
	}

	/**
    * Callback on render item actions : display caract help
    * @param event
	* @param sheet actor sheet
    * @private
    */	
	static async displayCaractTip(event, sheet) {
		let journalPrefix = Cof_mbe_addon.DEFAULT_JOURNAL_HELP_CARACT_PREFIX;
		let caract = event.currentTarget.getAttribute("data-" +Cof_mbe_addon.ID+ "_caract");
		let journalCaractName = journalPrefix + caract;
		let journalToDisplaySheet = "";
		try {

			journalToDisplaySheet = await this.getJournalOfCaractTipSheet(caract);
			journalToDisplaySheet.render(true);
		}catch (error) {
			console.error(error);
			let msg = "Journal not found : " + journalCaractName;
			ui.notifications.warn(msg);
			console.log(msg);
		}
	}
	


	static async getJournalOfCaractTipSheet(caract) {
		//let caract = event.currentTarget.getAttribute("data-" +Cof_mbe_addon.ID+ "_caract");
		let journalCaractName = this.getJournalOfCaractTipName(caract);
		let journalToDisplaySheet = "";
		try {
			let journalCaractSheet = await game.journal.getName(journalCaractName).sheet;
			// texte du journal
			let journalCaractSheetContent = journalCaractSheet.object.data.content;
			if ( journalCaractSheetContent.startsWith("<p>@JournalEntry")) {
				let matchResult = journalCaractSheetContent.match(/^.*@JournalEntry\[(.*)\]/);
				if (matchResult.length > 1) {
					let journalToDisplayId = matchResult[1];
					journalToDisplaySheet = await game.journal.get(journalToDisplayId).sheet;
				}
			}else{
				journalToDisplaySheet = journalCaractSheet;
			}
		}catch (error) {
			throw error;
		}
		return journalToDisplaySheet;
	}

	/**
    * Callback on render item actions : send description to chat
    * @param event
	* @param sheet actor sheet
    * @private
    */	
	static async toChat(event, sheet) {
		event.preventDefault();
		let entity = sheet.actor.items.get($(event.currentTarget).parents('.item').data("itemId"));

		// decription may begin by "<h1>Description</h1>", we suppress it
		let description = entity.data.data.description;
		if (description.startsWith("<h1>Description</h1>")) {
			description = description.substr(20);
		}
		const templateData = {
			itemName     : entity.data.name,
			description  : description,
			limited      : entity.data.data.limited,
			spell        : entity.data.data.spell,
			ranged       : entity.data.data.ranged,
			limitedUsage : entity.data.data.limitedUsage,
			save         : entity.data.data.save,
			activable    : entity.data.data.activable,
			heal         : entity.data.data.heal,
			attack       : entity.data.data.attack,
			buff         : entity.data.data.buff,
			useMacro     : entity.data.data.useMacro
		}

		const html = await renderTemplate(Cof_mbe_addon.PATH_TEMPLATE+"/chat.hbs", templateData);
		let chatData = {
			speaker: ChatMessage.getSpeaker(),
			content : html
		};
		ChatMessage.create(chatData,{});

	}

	// UTILS

	static consolelog(msg) {
		console.log(msg);
	}

	static buildDiv(classes="", innerHTML="", style="") {
		let divElem = document.createElement("div");
		if (classes!="") {
			divElem.className = classes;
		}
		if (innerHTML != "") {
			divElem.innerHTML = innerHTML;
		}
		if (style != "") {
			divElem.style = style;
		}
		return divElem;
	}
	
	static builEmptyDetailDiv() {
		return this.buildDiv("item-detail", '', 'border-left: 0px; border-right: 0px');
	}
	
}


Hooks.on("renderActorSheet",  (sheet, page, p3) => {
	Cof_mbe_addon.changeActorSheet(sheet, page, p3);
});


Hooks.once("init", () => {
	registerSettings();
});

Hooks.once("ready", () => {
	let valueDft = Cof_mbe_addon.DEFAULT_JOURNAL_HELP_CARACT_PREFIX;
	let value ="";
	try {
		value = game.settings.get(Cof_mbe_addon.ID, Cof_mbe_addon.HELP_CARACT_SETTING_NAME);
		if (value =="") {
			game.settings.set(Cof_mbe_addon.ID, Cof_mbe_addon.HELP_CARACT_SETTING_NAME, valueDft);
		}
	}catch (error) {
		console.error(error);
		value ="";
	}
});

function registerSettings() {

	let valueDft =  Cof_mbe_addon.DEFAULT_JOURNAL_HELP_CARACT_PREFIX;

	game.settings.register(Cof_mbe_addon.ID, Cof_mbe_addon.HELP_CARACT_SETTING_NAME, {
		name : 'Journal prefix used for attributes help ',
		hint : 'jouranl name exemple :  cof-mbe-addon_helpcaract_RP',
		scope: "world",
		label: "label COF MBE Settings",
		config:true,
		type: String,
		default: valueDft,
		//onChange: updateSystemProvider,
		onChange: value => { // value is the new value of the setting
			console.log(value);
		},
	});


}
