import { ItemName } from "./definitions/adventureland";
import { findItems } from "./functions";
let defaultItemsToGiveToMerchant: ItemName[] = ["monstertoken",
    "gem0", "gem1", "lostearring", "candycane", "candy0", "candy1", "seashell", "leather", // Tradables
    "coat1", "shoes1", "pants1", "gloves1", "helmet1", "cape", "handofmidas", // Wearables
    "bataxe", "sshield", "shield", "fireblade", // Weapons
    "shoes", "helmet", "coat", "gloves", "pants", // Common clothing
    "dexamulet", "intamulet", "stramulet", // Amulets
    "strring", "intring", "dexring", // Rings
    "strearring", "intearring", "dexearring", // Rings
    "dexbelt", "strbelt", "intbelt", // Belts
    "wbook0", "quiver", // Offhands
    "orbg", // Orbs
    "whiteegg", "beewings", "bfur", "rattail", "spores", "poison", "carrot", "smush", "gslime", "cscale", "snakefang", "essenceoffrost", "crabclaw", "ascale", "spidersilk", "shadowstone" // Things monsters drop
];
let defaultItemsToSell: ItemName[] = ["hpamulet", "hpbelt", // HP stuff
    "vitring", "vitearring", // Vit stuff
    "slimestaff", "ringsj", "cclaw", "spear", "throwingstars", "gphelmet", "phelmet", "maceofthedead", // Common things
    "wattire", "wshoes", "wbreeches", "wgloves", "wcap" // Wanderer clothing
];

export function sellUnwantedItems(itemsToSell: ItemName[] = defaultItemsToSell) {
    let foundNPCBuyer = false;
    for (let npc of parent.npcs.filter(npc => G.npcs[npc.id].role == "merchant")) {
        if (distance(character, {
            x: npc.position[0],
            y: npc.position[1]
        }) < 350) {
            foundNPCBuyer = true;
            break;
        }
    }
    if (!foundNPCBuyer) return; // Can't sell things, nobody is near.

    for (let itemName of itemsToSell) {
        for (let [i, item] of findItems(itemName)) {
            if (item.q) {
                sell(i, item.q);
            } else {
                sell(i, 1);
            }
        }
    }
}

export function transferItemsToMerchant(merchantName: string, itemsToTransfer: ItemName[] = defaultItemsToGiveToMerchant, itemsToSell: ItemName[] = defaultItemsToSell) {
    let merchant = parent.entities[merchantName];
    if (!merchant) return; // No merchant nearby
    if (distance(character, merchant) > 250) return; // Merchant is too far away to trade

    for (let itemName of itemsToTransfer) {
        let items = findItems(itemName);
        for (let [i, item] of items) {
            if (item.q) {
                send_item(merchantName, i, item.q)
            } else {
                send_item(merchantName, i, 1)
            }
        }
    }

    for (let itemName of itemsToSell) {
        let items = findItems(itemName);
        for (let [i, item] of items) {
            if (item.q) {
                send_item(merchantName, i, item.q)
            } else {
                send_item(merchantName, i, 1)
            }
        }
    }
}

export function transferGoldToMerchant(merchantName: string, minimumGold: number = 0) {
    if (parent.character.gold <= minimumGold) return; // Not enough gold
    let merchant = parent.entities[merchantName];
    if (!merchant) return; // No merchant nearby
    if (distance(parent.character, merchant) > 250) return; // Merchant is too far away to trade

    send_gold(merchantName, parent.character.gold - minimumGold);
}

// TODO: Add check for shells
// TODO: Add check for earrings
export function exchangeItems(exchangeItems: ItemName[] = ["gem0", "gem1", "armorbox", "weaponbox", "candy0", "candy1", "candycane"]) {
    let foundUpgrade = false;
    for (let npc of parent.npcs) {
        if (npc.id == "exchange" && distance(character, {
            x: npc.position[0],
            y: npc.position[1]
        }) < 250) {
            foundUpgrade = true;
            break;
        }
    }
    if (!foundUpgrade) return; // Can't exchange, nobody is near.


    if (parent.character.q && parent.character.q["exchange"]) return; // Already exchanging

    for (let itemName of exchangeItems) {
        let items = findItems(itemName)
        if (items.length > 0) {
            parent.socket.emit("exchange", {
                item_num: items[0][0],
                q: items[0][1].q
            });
            return;
        }
    }
}

export function buyPots(hpPotName: ItemName, hpPotQuantity: number, mpPotName: ItemName, mpPotQuantity: number) {

}