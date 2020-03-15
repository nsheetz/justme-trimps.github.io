document.body.innerHTML +=`<style>
#Explorer, #queueContainer, #Supershield, #Shield, .NoticesMessage, #saveGame { display: none }
#buyContainer { height: calc(99vh - 11vw - 110px); }
#Trap, #Hut, #House, #Mansion, #Hotel, #Resort, #Gateway, #Collector, #Tribute, #Gym, #Warpstation, #Gigastation { height: 1px; width: 1px; overflow: hidden; position: absolute; margin-top: -10px; }
#Trap      { left: 20px; }
#Hut       { left: 30px; }
#House     { left: 40px; }
#Mansion   { left: 50px; }
#Hotel     { left: 60px; }
#Resort    { left: 70px; }
#Gateway   { left: 80px; }
#Collector { left: 90px; }
#Tribute   { left: 100px; }
#Warpstation { left: 110px; }
#Gigastation { left: 20px; margin-top: -20px; }

#Gym       { right: 20px; }

#Wormhole { display: none }

#topRow .playerGather { font-size: 0.7vw !important; }

#fragments, #gems { display: none }
#buildingsTitleDiv { display: none }

.resourceRow > div { width: 25%; padding-left: 5px; padding-right: 0; height: 50%; }
.resourceRow .progress > div > span { font-size: 0.7vw }
.resourceRow { height: 99.8% }
.resourceRow .collectRow .col-xs-6 { width: 92% }

#topRow { }

#buyCol { margin-top: -9vw; }

.thing { font-size: 0.65vw; }

#outerBuyContainer {
    background: rgba(151,151,153,0.5);
}

#Warpstation { color: yellow }
</style>`;

var trimpsIntervals = [];

setTimeout(function() {

	var firstResourceRow = document.getElementById("food").parentNode.parentNode;
	var secondResourceRow = document.getElementById("metal").parentNode.parentNode;

	firstResourceRow.appendChild(document.getElementById("metal").parentNode);
	firstResourceRow.appendChild(document.getElementById("science").parentNode);

	secondResourceRow.parentNode.removeChild(secondResourceRow);

}, 2000);

setTimeout(function() {

	var findZoneNumber = function() { 
		var zoneNumber = 0; 
		if (document.getElementById("worldNumber") && document.getElementById("worldName") && document.getElementById("worldName").offsetParent !== null && document.getElementById("worldName") && document.getElementById("worldName").innerHTML.indexOf("Zone") > -1) { 
			zoneNumber = parseInt(document.getElementById("worldNumber").innerHTML); 
		} 
		return zoneNumber; 
	}

	setTimeout(function() {
		var findZoneNumber = function() { 
			var zoneNumber = 0; 
			if (document.getElementById("worldNumber")) { 
				zoneNumber = parseInt(document.getElementById("worldNumber").innerHTML); 
			} 
			return zoneNumber; 
		};

		var checkHeliumPerHour = function() {
			var hph = getHeliumPerHour();
			
			if (hph > maxHeliumPerHour || findZoneNumber() === 1) {
				console.log("new max hph. zone " + findZoneNumber() + ": " + hph);
				maxHeliumPerHour = hph;
			}
			
			if (!voidMapsFinished || hph > maxHeliumPerHour * minHeliumPerHourPercent) {
				//console.log("!voidMapsFinished || hph > maxHeliumPerHour * " + minHeliumPerHourPercent + " " + (!voidMapsFinished) + " " + (hph > maxHeliumPerHour * minHeliumPerHourPercent));
				setTimeout(function() { checkHeliumPerHour(); }, 15000);
				return;
			}
			
			console.log("hph lower - portal: " + hph + " < " + maxHeliumPerHour + " * " + minHeliumPerHourPercent + "(" + (maxHeliumPerHour * minHeliumPerHourPercent) + ")");
			console.log(((new Date() - new Date(game.global.portalTime)) / 1000 / 60) + " minutes");

			if (autoPortal) {
				buyGeneratorUpgrade("Supply");
				buyGeneratorUpgrade("Overclocker")
				buyGeneratorUpgrade("Capacity")
				buyGeneratorUpgrade("Efficiency")
				findPortal();
			} else {
				console.log("PORTAL TIME");
			}
		}
		
		var findPortal = function() { 
			if (document.getElementById("portalBtn") && document.getElementById("portalBtn").offsetParent !== null) {
				document.getElementById("portalBtn").click();
				setTimeout(function() {
					console.log("Portal in zone " + game.global.world + " cell " + game.global.lastClearedCell);
					console.log("---");
					document.getElementById("activatePortalBtn").click(); 
					setTimeout(function() {
						activatePortal();
						setTimeout(function() {
							pressFight();
							setTimeout(function() { 
								lastItems = 0;
								autoBelow20 = true;
								maxHeliumPerHour = 0;
								voidMapsFinished = false;
								abandonForced = false;
								restartOnZone = initialRestartZone;
								abandons = initialAbandons.slice();
								gaSecs = 45;
								perksSet = false;
								autoPerked = 0;
								itemsAction(); 
							}, 10000);
							setTimeout(function() { checkHeliumPerHour(); }, 15000);
							setTimeout(function() {
								if (document.getElementById("pauseFight") && document.getElementById("pauseFight").innerHTML.indexOf("AutoFight Off") > -1) {
									document.getElementById("pauseFight").click(); 
								}
							}, 30000);
						}, 3000);
					}, 1000);
				}, 1000);
			}
		}
		
		var pressFight = function() {
			if (document.getElementById("cell" + (game.global.lastClearedCell + 1)) == null && game.global.lastClearedCell == -1) {
				setTimeout(function() { pressFight(); }, 500);
			} else {
				document.getElementById("fightBtn").click();
			}
		}

		var getHeliumPerHour = function() {
			var perHour = 0.0;
			
			if (voidMapsFinished) {
				var perHourString = document.getElementById("heliumPh").innerHTML.split('/')[0];
				if (perHourString) {
					if (parseFloat(perHourString) > perHour) {
						perHour = parseFloat(perHourString) / 1000000.0;
						if (perHourString[perHourString.length - 1] == "K") {
							perHour = perHour * 1000;
						}
						if (perHourString[perHourString.length - 1] == "M") {
							perHour = perHour * 1000 * 1000;
						}
						if (perHourString[perHourString.length - 1] == "B") {
							perHour = perHour * 1000 * 1000 * 1000;
						}
						if (perHourString[perHourString.length - 1] == "T") {
							perHour = perHour * 1000 * 1000 * 1000 * 1000;
						}
						if (perHourString.length > 2 && perHourString.substring(perHourString.length - 2) == "Qa") {
							perHour = perHour * 1000 * 1000 * 1000 * 1000 * 1000;
						}
					}
				}
				if (perHour > 1) {
					perHour = Math.round(perHour);
				}
			}
			return perHour;
		}

		var findDoa = function() { 
			var maps = document.getElementsByClassName("onMapName");
			
			//console.log("Found " + maps.length + " maps");
			
			if (!maps.length || maps[0].offsetParent === null) {
				setTimeout(function() { findDoa(); }, 1000);
				return;
			}
			
			for (var i = 0; i < maps.length; i++) {
				if (maps[i].innerHTML == "Dimension of Anger") {
					//console.log("Found DOA");
					voidMapsFinished = true;
				}
			}
			
			if (document.getElementById("mapsBtn") && document.getElementById("mapsBtn").offsetParent !== null && document.getElementById("mapsBtn").innerHTML.indexOf("World") > -1) {
				document.getElementById("mapsBtn").click();
			} else {
				setTimeout(function() { findDoa(); }, 1000);
			}
		}

		var startVoidMap = function() { 
			//console.log("startVoidMap")
			var maps = document.getElementsByClassName("voidMap");
			if (!maps.length || maps[0].offsetParent === null) {
				setTimeout(function() { startVoidMap(); }, 1000);
				return;
			}
			
			maps[0].click();
			
			setTimeout(function() { 
				document.getElementById("selectMapBtn").click();
				
				setTimeout(function() { 
					var formationId = "formation2";
					if (document.getElementById(formationId) && document.getElementById(formationId).offsetParent !== null && autoFormation) {
						document.getElementById(formationId).click();	
					}
					findDoa();
				}, 1000);
			}, 1000);
		}

		var waitForMap = function() { 
			var desiredRepeatUntil = "";
		
			if (document.getElementById("togglerepeatUntil") && document.getElementById("togglerepeatUntil").offsetParent !== null) {
				if (!document.getElementById("GambesOP") || document.getElementById("GambesOP").offsetParent == null) {
					desiredRepeatUntil = "Repeat for Items";
				}
				
				if (game.global.world >= restartOnZone - actionZones || game.global.world == 400) {
					desiredRepeatUntil = "Repeat to 10";
				}
				
				if (document.getElementById("GambesOP") && document.getElementById("GambesOP").offsetParent != null) {
					desiredRepeatUntil = "Repeat Forever";
				}
			}
			
			if (desiredRepeatUntil && document.getElementById("togglerepeatUntil").innerHTML.indexOf(desiredRepeatUntil) == -1) {
				document.getElementById("togglerepeatUntil").click();
			}
			
			if (document.getElementById("toggleexitTo") && document.getElementById("toggleexitTo").offsetParent !== null && document.getElementById("toggleexitTo").innerHTML.indexOf("Exit to Maps") == -1) {
				document.getElementById("toggleexitTo").click();
			}
			if (document.getElementById("repeatBtn") && document.getElementById("repeatBtn").offsetParent !== null && document.getElementById("repeatBtn").innerHTML.indexOf("Repeat On") == -1) {
				document.getElementById("repeatBtn").click();
			}
			
			if (document.getElementById("mapsBtn") && document.getElementById("mapsBtn").offsetParent !== null && document.getElementById("mapsBtn").innerHTML.indexOf("World") > -1) {
				if (restartOnZone <= lastItems) {
					setTimeout(function() { findVoidMap(); }, 1000)
				} else {
					document.getElementById("mapsBtn").click();
					setTimeout(function() { itemsAction(); }, 3000)
				}
				return;
			}
			setTimeout(function() { waitForMap(); }, 1000)
		}

		var startMap = function() { 
			//console.log("startMap")
			var maps = document.getElementsByClassName("mapElementSelected");
			
			if (!maps.length || maps[0].offsetParent === null) {
				setTimeout(function() { startMap(); }, 1000);
				return;
			}
			
			maps[0].click();
			
			setTimeout(function() { 
				document.getElementById("selectMapBtn").click();
				
				setTimeout(function() { 
					var formationId = "formation4";
					if (document.getElementById(formationId) && document.getElementById(formationId).offsetParent !== null && autoFormation) {
						//document.getElementById(formationId).click();	
					}
					waitForMap();
				}, 1000);
			}, 1000);
		}

		var findVoidMap = function() { 
			var maps = document.getElementById("voidMapsBtn");
			if (!maps) {
				setTimeout(function() { findVoidMap(); }, 1000);
				return;
			}
			
			maps.click();
			startVoidMap();
		}

		var abandonNeeded = function() {
			for (var i = 0; i < abandons.length; i++) {
				if (abandons[i] == game.global.world) {
					abandons[i] = -1;
					return true;
				}
			}
			return false;
		}
		
		var createItemsMap = function() {
			if (!voidMapsFinished 
				&& game.global.world === restartOnZone 
				&& game.global.lastClearedMapCell === -1 
				&& game.global.lastClearedCell > 80 
				&& !abandonForced 
				&& document.getElementById("mapsBtn")
				&& document.getElementById("mapsBtn").offsetParent !== null
				&& document.getElementById("mapsBtn").innerHTML.indexOf("Abandon Soldiers") > - 1) {
				console.log("Abandon! " + game.global.totalVoidMaps + " void maps after " + Math.floor((new Date() - new Date(game.global.portalTime)) / 1000 / 60) + " minutes");
				abandonForced = true;
				document.getElementById("mapsBtn").click();
			}

			if (!voidMapsFinished 
				&& game.global.lastClearedMapCell === -1 
				&& game.global.lastClearedCell > 5 
				&& game.global.mapBonus < 2
				&& document.getElementById("mapsBtn")
				&& document.getElementById("mapsBtn").offsetParent !== null
				&& document.getElementById("mapsBtn").innerHTML.indexOf("Abandon Soldiers") > - 1
				&& abandonNeeded()) {
				console.log("Abandon" + game.global.world + ". Time " + Math.floor((new Date() - new Date(game.global.portalTime)) / 1000 / 60) + " minutes");
				document.getElementById("mapsBtn").click();
			}
		
			//console.log("Create maps " + lastItems);
			if (document.getElementById("selectMapBtn") && document.getElementById("selectMapBtn").innerHTML.indexOf("Continue") > -1 && document.getElementById("recycleMapBtn") && document.getElementById("recycleMapBtn").offsetParent !== null) {
				//console.log("Recycling map");
				document.getElementById("recycleMapBtn").click();
			}
		
			var newMapNeeded = true;
		
			if (game && game.global && game.global.mapsOwnedArray) {
				for (var i = 0; i < game.global.mapsOwnedArray.length; i++) { 
					var map = game.global.mapsOwnedArray[i];
					if (map.location != "Void" && map.location != "Bionic" && map.level == game.global.world) {
						//console.log("Already have map lvl " + game.global.world + ". No new map needed.");
						newMapNeeded = false;
					}
				} 
			}
		
			var createMap = document.getElementById("mapCreateBtn");
			if (!createMap || createMap.offsetParent === null) {
				var zone = findZoneNumber();
				if (zone > 0) {
					lastItems = zone;
				}
				//console.log("No create map button " + lastItems);
				setTimeout(function() { createItemsMap(); }, 100);
				return;
			}
			
			if (autoRecycle) {
				recycleBelow(true);
			}
			
			document.getElementById("lootAdvMapsRange").value = 9;
			adjustMap('loot', 9);
			document.getElementById("biomeAdvMapsSelect").value = "Plentiful";
			if (game.global.world % 10 == 0 || game.global.world % 10 > 5 || blacksmithZones > game.global.world) {
				incrementMapLevel(-1);
				incrementMapLevel(-1);
				incrementMapLevel(-1);
			}

			setTimeout(function() {
				if (newMapNeeded) {
					create20Map();
				}
				
			}, 100);
		}
		
		var create20Map = function() {
			document.getElementById("mapCreateBtn").click();
			setTimeout(function() {
				if (game.global.mapsOwnedArray.length < 90 && (game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].size != 20 || game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].loot < 1.84)) {
					if (document.getElementsByClassName("mapThing").length) {
						document.getElementsByClassName("mapThing")[0].click();
						if (document.getElementById("recycleMapBtn").offsetParent != null) {
							document.getElementById("recycleMapBtn").click();
						}
					}

					create20Map();
				} else {
					startMap();
				}
			}, 50);
		}

		var itemsAction = function() {
			var actionNeeded = false;
			
			if (autoBelow20) {
				if (findZoneNumber() < 30 && findZoneNumber() > 0 && (((new Date() - new Date(game.global.portalTime)) / 1000 / 60) > autoBelow20Time)) {
					console.log("autoBelow20 on map " + findZoneNumber() + " after " + (new Date() - new Date(game.global.portalTime)) / 1000 / 60);
					autoBelow20 = false;
					actionNeeded = true;
					setTimeout(function() { document.getElementById("mapsBtn").click(); }, 3000)
				}
			}
			
			if (findZoneNumber() >= restartOnZone - actionZones) {
				//console.log("findZoneNumber() >= " + restartOnZone + " - " + actionZones);
				if (game.global.mapBonus < 10 || findZoneNumber() >= restartOnZone) {
					actionNeeded = true;
				} else {
					//console.log("MAP FIGHT NOT NEEDED - fought 10 times in this zone already")
				}
			}
			
			if (findZoneNumber() == 460 && restartOnZone == 465 && game.global.lastClearedCell > 90) {
				actionNeeded = true;
			}
			
			if (findZoneNumber() == 400) {
				//console.log("findZoneNumber() >= " + restartOnZone + " - " + actionZones);
				if (game.global.mapBonus < 10) {
					actionNeeded = true;
				}
			}
			
			if (findZoneNumber() > lastItems && findZoneNumber() >= itemsStart) {
				if ((findZoneNumber() % 10 <= 5) && (findZoneNumber() % 10 >= 1)) {
					//console.log("findZoneNumber() % 10 <= 5) && (findZoneNumber() % 10 >= 1): " + findZoneNumber());
					actionNeeded = true;
				}
				
				if (document.getElementById("GambesOP") && document.getElementById("GambesOP").offsetParent != null) {
					//console.log("GambesOP: " + findZoneNumber());
					actionNeeded = true;
				}
			}
			
			if (actionNeeded){
				//console.log("itemsAction " + findZoneNumber());
				document.getElementById("mapsBtn").click();
				//console.log("maps clicked " + findZoneNumber());
				lastItems = game.global.world;
				setTimeout(function() { createItemsMap(); }, 1000);
			} else {
				//console.log("no need to buy items in zone " + findZoneNumber() + ". Last items zone " + lastItems + ". Restart on " + restartOnZone);
				setTimeout(function() { itemsAction(); }, 3000)
			}
		}

		setTimeout(function() { itemsAction(); }, 3000)
		setTimeout(function() { checkHeliumPerHour(); }, 3000)
		
		if (typeof (autohire) !== "undefined") autohire();
		
	}, 3000);


	trimpsIntervals.push(setInterval(function() { 
		if (findZoneNumber() > 0 && findZoneNumber() >= restartOnZone - nurseryZones) {
			if (document.getElementById("Nursery") && document.getElementById("Nursery").offsetParent != null && autoNursery) {
				numTab('3'); 
				document.getElementById("Nursery").click();
				numTab('6');
			}
		}
	}, autoNurseryInterval));


	trimpsIntervals.push(setInterval(function() { 
		var formationId;
		var GeneticistassistSetting;
		
		if (game.global.world == 400) {
			formationId = "formation1";
		} else {
			if ((findZoneNumber() > 0 && findZoneNumber() < restartOnZone - dominanceFormationZones) && findZoneNumber() > dominanceStartZones) {
				formationId = "formation4";
			} else if (findZoneNumber() > 0 && (findZoneNumber() >= restartOnZone - dominanceFormationZones || (dominanceStartZones))) {
				formationId = "formation2";
			}
		}
		
		if (findZoneNumber() > 0 && findZoneNumber() < restartOnZone - gaSecsZones) {
			if (autoAssistant && document.getElementById("GeneticistassistSetting") && document.getElementById("GeneticistassistSetting").offsetParent != null && document.getElementById("GeneticistassistSetting").innerHTML.indexOf("1 Second")== -1) {
				document.getElementById("GeneticistassistSetting").click();
			}
		} else if (findZoneNumber() > 0 && findZoneNumber() >= restartOnZone - gaSecsZones) {
			if (autoAssistant && document.getElementById("GeneticistassistSetting") && document.getElementById("GeneticistassistSetting").offsetParent != null && document.getElementById("GeneticistassistSetting").innerHTML.indexOf(gaSecs + " Seconds")== -1) {
				document.getElementById("GeneticistassistSetting").click();
			}
		}
		
		if (document.getElementById(formationId) && document.getElementById(formationId).offsetParent !== null && autoFormation) {
			document.getElementById(formationId).click();	
		}

		if (autoMetal) {
			if (game.global.world > 200) {
				if (document.getElementById("metalCollectBtn") && document.getElementById("metalCollectBtn").offsetParent !== null && collectMetal) {
					document.getElementById("metalCollectBtn").click();	
				}
			} else {
				if (document.getElementById("scienceCollectBtn") && document.getElementById("scienceCollectBtn").offsetParent !== null && collectMetal) {
					document.getElementById("scienceCollectBtn").click();	
				}
			}
		}
			
		if (findZoneNumber() > 0) {
			if (maxFuel) {
				if (restartOnZone - 10 <= game.global.world) {
					if (document.getElementById("generatorPassiveBtn") && document.getElementById("generatorPassiveBtn").offsetParent != null) {
						document.getElementById("generatorPassiveBtn").click();
					}
				} else if (document.getElementById("generatorActiveBtn") && document.getElementById("generatorActiveBtn").offsetParent != null) {
					document.getElementById("generatorActiveBtn").click();
				}
			} else {
				if (findZoneNumber() > 230 + miStartZones && findZoneNumber() <= 230 + miStartZones + fuelZones) {
					if (document.getElementById("generatorActiveBtn") && document.getElementById("generatorActiveBtn").offsetParent != null) {
						document.getElementById("generatorActiveBtn").click();
					}
				} else {
					if (document.getElementById("generatorPassiveBtn") && document.getElementById("generatorPassiveBtn").offsetParent != null) {
						document.getElementById("generatorPassiveBtn").click();
					}
				}
			}
		}
		
		if (upgradeSupply) buyGeneratorUpgrade("Supply");
		if (upgradeEfficiency) buyGeneratorUpgrade("Efficiency")
		if (upgradeCapacity) buyGeneratorUpgrade("Capacity")
		if (upgradeOverclocker) buyGeneratorUpgrade("Overclocker")
		
	}, 3000));

	trimpsIntervals.push(setInterval(function() {  
		if (set01) {
			if (document.getElementById("tab6") && document.getElementById("tab6").offsetParent !== null) {
				numTab('6'); 
				setMax(0.1);
			}
		} 
	}, 3000));

	function upgradeAndClick(upgrade, click) {
		if (document.getElementById(upgrade)) {
			document.getElementById(upgrade).click();
			setTimeout(function() {
				if (document.getElementById(click)) {
					numTab(1);
					document.getElementById(click).click();
					numTab('6');
				}
			},100);
		}
		if (document.getElementById(upgrade)) {
			document.getElementById(upgrade).click();
		}
	}
	
	trimpsIntervals.push(setInterval(function() {
		if (forcefastUpgrade || (fastUpgrade && document.getElementById("autoPrestigeBtn") && document.getElementById("autoPrestigeBtn").innerHTML.indexOf("AutoPrestige All") > -1)) {
			upgradeAndClick("Dagadder", "Dagger");
			upgradeAndClick("Bootboost", "Boots");
			upgradeAndClick("Megamace", "Mace");
			upgradeAndClick("Hellishmet", "Helmet");
			upgradeAndClick("Polierarm", "Polearm");
			upgradeAndClick("Pantastic", "Pants");
			upgradeAndClick("Axeidic", "Battleaxe");
			upgradeAndClick("Smoldershoulder", "Shoulderguards");
			upgradeAndClick("Greatersword", "Greatsword");
			upgradeAndClick("Bestplate", "Breastplate");
			upgradeAndClick("Harmbalest", "Arbalest");
			upgradeAndClick("GambesOP", "Gambeson");
			if (autoCoordinationUpgrade) {
				if (document.getElementById("Coordination")) document.getElementById("Coordination").click();
			}
		}
	},100));

		var buyEquipment = function(arbalestNumber, onlyWhenOne) {
			checkAndBuy("Arbalest", "ArbalestOwned", arbalestNumber, onlyWhenOne);
			checkAndBuy("Arbalest", "ArbalestOwned", arbalestNumber, onlyWhenOne);
			checkAndBuy("Greatsword", "GreatswordOwned", arbalestNumber - 2, onlyWhenOne);
			checkAndBuy("Battleaxe", "BattleaxeOwned", arbalestNumber - 1, onlyWhenOne);
			checkAndBuy("Polearm", "PolearmOwned", arbalestNumber - 1, onlyWhenOne);
			checkAndBuy("Mace", "MaceOwned", arbalestNumber, onlyWhenOne);
			checkAndBuy("Dagger", "DaggerOwned", arbalestNumber + 2, onlyWhenOne);
		}

		var buyArm = function(gambesonNumber, onlyWhenOne) {
			checkAndBuy("Gambeson", "GambesonOwned", gambesonNumber, onlyWhenOne);
			checkAndBuy("Gambeson", "GambesonOwned", gambesonNumber, onlyWhenOne);
			checkAndBuy("Breastplate", "BreastplateOwned", gambesonNumber - 2, onlyWhenOne);
			checkAndBuy("Shoulderguards", "ShoulderguardsOwned", gambesonNumber - 2, onlyWhenOne);
			checkAndBuy("Pants", "PantsOwned", gambesonNumber - 2, onlyWhenOne);
			checkAndBuy("Helmet", "HelmetOwned", gambesonNumber - 1, onlyWhenOne);
			checkAndBuy("Boots", "BootsOwned", gambesonNumber - 1, onlyWhenOne);
		}
		
		var checkAndBuy = function(buttonId, ownedId, max, onlyWhenOne) { 
			var button = document.getElementById(buttonId);
			var click = false;
			if (button && button.getAttribute("class").indexOf("thingColorCanAfford") > -1) {
				if (ownedId && max) {
					var owned = document.getElementById(ownedId);
					if (owned) {
						var value = parseInt(owned.innerHTML.match(/[0-9]+/)[0]);
						if (onlyWhenOne) {
							if (value == 1 || value == 2) {
								click = true;
							}
						} else if (max > value) {
							click = true;
						}
					}
				} else {
					click = true;
				}
			}
			
			if (click) {
				button.click();
				if (onlyWhenOne) {
					button.click();
				}
				document.getElementById("buildingsTitleDiv").click();
			}
		}
		
		trimpsIntervals.push(setInterval(function() { checkAndBuy("Tribute"); }, 200));
		trimpsIntervals.push(setInterval(function() { checkAndBuy("Magmamancer"); }, 200));
		trimpsIntervals.push(setInterval(function() { checkAndBuy("Hut", "HutOwned", 200); }, 200));
		trimpsIntervals.push(setInterval(function() { checkAndBuy("House", "HouseOwned", 200); }, 200));
		trimpsIntervals.push(setInterval(function() { checkAndBuy("Mansion", "MansionOwned", 230); }, 200));
		trimpsIntervals.push(setInterval(function() { checkAndBuy("Hotel", "HotelOwned", 250); }, 200));
		trimpsIntervals.push(setInterval(function() { checkAndBuy("Resort", "ResortOwned", 280); }, 200));
		trimpsIntervals.push(setInterval(function() { checkAndBuy("Collector", "CollectorOwned", 830); }, 200));
		trimpsIntervals.push(setInterval(function() { checkAndBuy("Gateway", "GatewayOwned", 150); }, 200));
		trimpsIntervals.push(setInterval(function() { checkAndBuy("Warpstation", "WarpstationOwned", 350); }, 200));
		trimpsIntervals.push(setInterval(function() { checkAndBuy("Gym", "GymOwned", 1650); }, 200));

		var checkStorage = function(buttonId, timerId, resourceId) { 
			var button = document.getElementById(buttonId);
			var click = false;
			if (button && button.getAttribute("class").indexOf("thingColorCanAfford") > -1) {
				if (timerId) {
					var timer = document.getElementById(timerId);
					if (timer) {
						if (timer.innerHTML.match(/^[0-9]+ Sec(s)?$/) 
							|| timer.innerHTML.match(/^[0-9]+ Min(s)? [0-9]+ Secs$/) 
							|| timer.innerHTML.match(/^[0-2] Year(s)? [0-9]+ Days$/) 
							|| timer.innerHTML.match(/^[0-9] Day(s)? [0-9]+ Hours$/) 
							|| timer.innerHTML.match(/^[0-9]+ Day(s)? [0-9]+ Hours$/) 
							|| timer.innerHTML.match(/^[0-9]+ Hour(s)? [0-9]+ Mins$/)) {
							click = true;
						}
					}
				}

				if (!click && document.getElementById(resourceId)) {
					if (document.getElementById(resourceId).getElementsByClassName("percentColorYellow").length > 0 || document.getElementById(resourceId).getElementsByClassName("percentColorRed").length > 0 || document.getElementById(resourceId).getElementsByClassName("percentColorOrange").length > 0) {
						click = true;
					}
				}
			}
			
			if (click) {
				button.click();
			}
		}
		
		trimpsIntervals.push(setInterval(function() { checkStorage("Barn", "foodTimeToFill", "food"); }, 2000));
		trimpsIntervals.push(setInterval(function() { checkStorage("Shed", "woodTimeToFill", "wood"); }, 2000));
		trimpsIntervals.push(setInterval(function() { checkStorage("Forge", "metalTimeToFill", "metal"); }, 2000));

		setTimeout(function() {

			trimpsIntervals.push(setInterval(function() { 
				if (!autoGolden) return;

				if (document.getElementById("VoidGolden") && document.getElementById("VoidGolden").offsetParent !== null) { 
					if (document.getElementById("goldenVoidOwned").innerHTML.indexOf("5") != 0 || document.getElementById("goldenHeliumOwned").innerHTML.indexOf("0") != 0) {
						if (document.getElementById("VoidGolden").getAttribute("class").indexOf("thingColorCanNotAfford") == -1) {
							if (autoGoldenVoid) {
								console.log("VoidGolden: " + (parseInt(document.getElementById("goldenVoidOwned").innerHTML) + 1));
								document.getElementById("VoidGolden").click(); 
								return;
							}
						}
					}
					
					if (autoGoldenHelium) {
						if (document.getElementById("HeliumGolden") && document.getElementById("HeliumGolden").offsetParent !== null && document.getElementById("HeliumGolden").getAttribute("class").indexOf("thingColorCanNotAfford") == -1) { 
							console.log("HeliumGolden: " + (parseInt(document.getElementById("goldenHeliumOwned").innerHTML) + 1));
							document.getElementById("HeliumGolden").click(); 
							return;
						}
					}
					
					if (autoGoldenBattle) {
						if (document.getElementById("BattleGolden") && document.getElementById("BattleGolden").offsetParent !== null && document.getElementById("BattleGolden").getAttribute("class").indexOf("thingColorCanNotAfford") == -1) {
							console.log("BattleGolden: " + (parseInt(document.getElementById("goldenBattleOwned").innerHTML) + 1));								
							document.getElementById("BattleGolden").click(); 
							return;
						}
					}
				}
			}, 500));
		}, 100);	
		
		trimpsIntervals.push(setInterval(function() {
			if ((findZoneNumber() % 10 > 6 && !document.getElementById("GambesOP")) || voidMapsFinished) {
				buyEquipment(20);
				buyArm(50);
			}
			if (restartOnZone <= lastItems) {
				buyEquipment(lastZoneEquipment);
			}
			if (game.global.world == 400) {
				buyEquipment(lastZoneEquipment);
				buyArm(lastZoneEquipment + 20);
			}
			if (autoEquip) {
				buyEquipment(autoEquipNumber);
			}
			if (findZoneNumber() % 10 > 0 && findZoneNumber() % 10 < 7) {
				buyEquipment(20, true);
				buyArm(50, true);
			}
		},1500));
		
		trimpsIntervals.push(setInterval(function() {
			if (game && game.global && game.global.totalVoidMaps && game.global.totalVoidMaps == 1 && game.global.lastClearedMapCell > 70) {
				console.log("LAST VOID MAP ROW! BUY ARMS! " + game.global.lastClearedMapCell);
				buyArm(100);
			}
		}, 500));
		
		trimpsIntervals.push(setInterval(function() {
			if (document.getElementsByClassName("eggCell").length && document.getElementsByClassName("eggCell")[0].offsetParent != null) {
				document.getElementsByClassName("eggCell")[0].click();
				setTimeout(function() {
					if (document.getElementsByClassName("eggMessage").length && document.getElementsByClassName("eggMessage")[document.getElementsByClassName("eggMessage").length - 1].innerText != lastEggMessage) {
						lastEggMessage = document.getElementsByClassName("eggMessage")[document.getElementsByClassName("eggMessage").length - 1].innerText;
						if (lastEggMessage.indexOf("food!") === -1 && lastEggMessage.indexOf("wood!") === -1 && lastEggMessage.indexOf("metal!") === -1) {
							console.log(lastEggMessage);
						}
					}
				}, 1000);
			}
		}, 1000));

	}, 1000);

var myAutoUpgrades = ["Potency", "Efficiency", "Megaminer", "Megalumber", "Megafarming", "Megascience", "TrainTacular", "Supershield", "Gymystic", "Speedminer", "Speedlumber", "Speedscience", "Speedfarming"];

var myAutoUpgradeInterval = setInterval(function() {
	if (myAutoUpgrade) {
		for (var i = 0; i < myAutoUpgrades.length; i++) {
			if (document.getElementById(myAutoUpgrades[i]) && document.getElementById(myAutoUpgrades[i]).offsetParent !== null) document.getElementById(myAutoUpgrades[i]).click()
		}
	}
}, 100);
trimpsIntervals.push(myAutoUpgradeInterval);


trimpsIntervals.push(setInterval(function() { if (document.getElementById("Gigastation") && document.getElementById("Gigastation").offsetParent !== null) {
	document.getElementById("Gigastation").click();	
}; }, 1000 * 25));

trimpsIntervals.push(setInterval(function() { 
    if (document.getElementsByClassName("shriekStateDisabled")[0] && document.getElementsByClassName("shriekStateDisabled")[0].offsetParent !== null) {
		if (game.global.world % 5 == 0) {
			document.getElementsByClassName("shriekStateDisabled")[0].click();
		}
    }

}, 1000 * 5));

trimpsIntervals.push(setInterval(function() {
	if (upgradeNatureStack) {
		naturePurchase('stackTransfer', 'Poison');
		naturePurchase('stackTransfer', 'Wind');
		//naturePurchase('stackTransfer', 'Ice');
	}
	if (upgradeNature) {
		naturePurchase('upgrade', 'Poison');
		naturePurchase('upgrade', 'Wind');
		//naturePurchase('upgrade', 'Ice');
	}
}, 1000 * 5));

var showSettingsRow = function() {
	document.getElementById("settingsRow").setAttribute("style", "display: block! important");
}

var hideSettingsRow = function() {
	document.getElementById("settingsRow").setAttribute("style", "display: none! important");
}

var clearAllIntervals = function() {
	if (trimpsIntervals) {
		for (var i = 0; i < trimpsIntervals.length; i++) {
			clearInterval(trimpsIntervals[i]);
		}
	}
}

var autohire = function() {	
	var hire = function(who) {
		var seconds = 0;
		
		if (document.getElementById("trimpsTimeToFill") 
			&& document.getElementById("trimpsTimeToFill").innerHTML
			&& document.getElementById("trimpsTimeToFill").innerHTML.match(/[0-9]+/)[0]
			&& document.getElementById("trimpsTimeToFill").innerHTML.match(/[0-9]+/))
			
		seconds = parseInt(document.getElementById("trimpsTimeToFill").innerHTML.match(/[0-9]+/)[0]);
		
		if (seconds < 5 && document.getElementById(who)) {
			document.getElementById(who).click();
		} 
	}

	trimpsIntervals.push(setInterval(function() {
		var unit = "";
		var jobsTitleUnemployed = document.getElementById("jobsTitleUnemployed");
		if (jobsTitleUnemployed) {
			var unemployed = jobsTitleUnemployed.innerHTML;
			if (unemployed && unemployed.indexOf("M ") > -1) {
				return;
			}
		}
		setMax(0.25);
		if (game.global.world < 100) {
			hire("Scientist"); 
		} else {
			hire("Miner"); 
		}
		setMax(0.1);

	}, 300));
	trimpsIntervals.push(setInterval(function() { 
		if (game.global.world < hireNotMinersZones) {
			hire("Farmer"); 
		}
	}, 30000));
	trimpsIntervals.push(setInterval(function() { 
		if (game.global.world < hireNotMinersZones) {
			hire("Lumberjack"); 
		}
	}, 50000));
	trimpsIntervals.push(setInterval(function() { hire("Trainer"); }, 30000));
	trimpsIntervals.push(setInterval(function() { 
		if (game.global.world < hireNotMinersZones) {
			hire("Scientist"); 
		}
	}, 120000));
}

var startPerkUpgrades = function() {
	var upgradePerk = function() {
		var button = document.getElementById("Looting_II");
		if (button && button.getAttribute("class").indexOf("perkColorOn") > -1) {
			for (var i = 0; i < 10; i++) {
				button.click();
			}
			autoPerked += 10;
			setTimeout(upgradePerk, 1);
		} else {
			console.log("Autoperked: " + autoPerked);
			activateClicked();
		}
	}
	
	if (game.global.world > 301 && !perksSet && autoPerk) {
		perksSet = true;
		viewPortalUpgrades();
		setTimeout(upgradePerk, 300);
	}
}

trimpsIntervals.push(setInterval(startPerkUpgrades, 150000));

var perksSet = false;
var autoPerk = true;
var autoPerked = 0;
var gaSecs = 45;
var restartOnZone = 450;
var initialRestartZone = 450;
var itemsStart = 430; //382;
var lastItems = 0;
var autoNursery = true;
var autoFormation = true;
var autoAssistant = true;
var set01 = true;
var collectMetal = true;
var autoEquip = true;
var autoEquipNumber = 100;
var fuelZones = 70;
var miStartZones = 10;
var maxHeliumPerHour = 0.0;
var voidMapsFinished = false;
var minHeliumPerHourPercent = 0.95;
var fastUpgrade = true;
var dominanceFormationZones = 41;
var gaSecsZones = 41;
var lastZoneEquipment = 120;
var actionZones = 11;
var autoPortal = true;
var nurseryZones = 10;
var upgradeSupply = false;
var upgradeEfficiency = true;
var upgradeCapacity = true;
var upgradeOverclocker = true;
var abandonForced = false;
var lastEggMessage = "";
var autoGolden = true;
var autoBelow20 = true;
var autoBelow20Time = 9;
var autoMetal = true;
var forcefastUpgrade = false;
var autoCoordinationUpgrade = true;
var myAutoUpgrade = true;
var autoRecycle = true;
var autoNurseryInterval = 3000;
var autoGolden = true;
var autoGoldenVoid = true;
var autoGoldenHelium = true;
var autoGoldenBattle = false;
var upgradeNature = true;
var upgradeNatureStack = false;
var hireNotMinersZones = 370;
var maxFuel = true;
var dominanceStartZones = 0;
var initialAbandons = [454,/*457,*/458,459,460,/*462,*/463,464];
var abandons = initialAbandons.slice();
var blacksmithZones = 459;

// -----------------------------

restartOnZone = 456;
initialRestartZone = 456;
dominanceFormationZones = 0;
actionZones = 17;
minHeliumPerHourPercent = 0.996;
dominanceStartZones = 470;

restartOnZone = 465
initialRestartZone = 465
actionZones = 28
minHeliumPerHourPercent = 0.98
nurseryZones = 15

gaSecsZones = 60

// 2017 10 25 autoPerk

challenge2 = true;
gogogo = false;

if (gogogo) {
	restartOnZone = 515
	autoGoldenVoid = false;
	autoGoldenHelium = false;
	autoGoldenBattle = true;
	gaSecsZones = 60
	nurseryZones = 0
	// maxFuel = false; disable after needed
}

 
if (challenge2) {
    //autoEquip = false;
	restartOnZone = 500;
	autoNursery = false;
	autoGoldenVoid = false;
	autoGoldenHelium = false;
	autoGoldenBattle = true;
	gaSecsZones = 90;
	autoFormation = false;
	abandons.push(471);
	abandons.push(472);
	abandons.push(473);
	abandons.push(474);
	abandons.push(475);
	abandons.push(487);
	abandons.push(488);
	abandons.push(489);
	abandons.push(490);
}
