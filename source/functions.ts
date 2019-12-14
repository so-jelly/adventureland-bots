import { ItemInfo, MonsterType, ItemName, IPosition, MapName, IEntity, IPositionReal, SkillName, BankPackType } from "./definitions/adventureland";
import { MyItemInfo, EmptyBankSlots, MonsterSpawnPosition } from "./definitions/bots";

export function isNPC(entity: IEntity) {
    return entity.npc ? true : false
}

export function isMonster(entity: IEntity) {
    return entity.type == "monster"
}

export function isPlayer(entity: IEntity) {
    return entity.type == "character" && !isNPC(entity)
}

/** Also works for NPCs! */
export function canSeePlayer(name: string) {
    return parent.entities[name] ? true : false
}

/** Returns the amount of ms we have to wait to use this skill */
export function getCooldownMS(skill: SkillName) {
    if (parent.next_skill[skill]) {
        let ms = parent.next_skill[skill].getTime() - Date.now();
        return ms < 0 ? 0 : ms;
    } else {
        return 0
    }
}

export function getEmptyBankSlots(): EmptyBankSlots[] {
    if (parent.character.map !== "bank") return; // We can only find out what bank slots we have if we're on the bank map.

    let emptySlots: EmptyBankSlots[] = []

    for (let store in parent.character.bank) {
        if (store == "gold") continue;
        for (let i = 0; i < 42; i++) {
            let item = parent.character.bank[store as BankPackType][i]
            if (!item) emptySlots.push({ pack: store as BankPackType, "index": i })
        }
    }

    return emptySlots;
}

export function isAvailable(skill: SkillName) {
    return parent.next_skill[skill] ? (Date.now() >= parent.next_skill[skill].getTime()) : true
}

/** Returns the entities we are being attacked by */
export function getAttackingEntities(): IEntity[] {
    let entitites: IEntity[] = []
    let isPVP = is_pvp();
    for (let id in parent.entities) {
        let entity = parent.entities[id]
        if (entity.target !== parent.character.id) continue; // Not being targeted by this entity
        if (isPlayer(entity) && !isPVP) continue; // Not PVP, ignore players

        entitites.push(entity)
    }
    return entitites;
}

export function determineGrade(itemName: ItemName, itemLevel: number) {
    let game_item = G.items[itemName];
    if (!game_item) {
        return -1;
    } else if (itemLevel >= game_item.grades[1]) {
        return 2;
    } else if (itemLevel >= game_item.grades[0]) {
        return 1;
    } else {
        return 0;
    }
}

export function sendMassCM(names: string[], data: any) {
    for (let name of names) {
        send_local_cm(name, data);
    }
}

export function getRandomMonsterSpawnPosition(type: MonsterType): MonsterSpawnPosition {
    let potentialLocations: IPositionReal[] = [];
    for (let id in G.maps) {
        let map = G.maps[id as MapName];
        if (map.instance) continue;
        for (let monster of map.monsters || []) {
            if (monster.type !== type) continue;
            if (monster.boundary) {
                potentialLocations.push({ "map": id as MapName, "x": (monster.boundary[0] + monster.boundary[2]) / 2, "y": (monster.boundary[1] + monster.boundary[3]) / 2 })
            } else if (monster.boundaries) {
                for (let boundary of monster.boundaries) {
                    potentialLocations.push({ "map": boundary[0], "x": (boundary[1] + boundary[3]) / 2, "y": (boundary[2] + boundary[4]) / 2 })
                }
            }
        }
    }

    return { ...potentialLocations[Math.floor(Math.random() * potentialLocations.length)], monster: type };
}

// TODO: Change this to a custom typed object instead of an array
export function getNearbyMonsterSpawns(position: IPosition, radius: number = 1000): MonsterSpawnPosition[] {
    let locations: MonsterSpawnPosition[] = [];
    let map = G.maps[position.map];
    if (map.instance) return;
    for (let monster of map.monsters || []) {
        if (monster.boundary) {
            let location = { "map": position.map as MapName, "x": (monster.boundary[0] + monster.boundary[2]) / 2, "y": (monster.boundary[1] + monster.boundary[3]) / 2 };
            if (distance(position, location) < radius) locations.push({ ...location, monster: monster.type })
        } else if (monster.boundaries) {
            for (let boundary of monster.boundaries) {
                if (boundary[0] !== position.map) continue;
                let location = { "map": position.map, "x": (boundary[1] + boundary[3]) / 2, "y": (boundary[2] + boundary[4]) / 2 }
                if (distance(position, location) < radius) locations.push({ ...location, monster: monster.type })
            }
        }
    }

    return locations;
}

export function buyAndUpgrade(itemName: ItemName, targetLevel: number = 9, targetQuantity: number = 1) {
    let foundNPCBuyer = false;
    for (let npc of parent.npcs.filter(npc => G.npcs[npc.id].role == "merchant")) {
        if (distance(parent.character, {
            x: npc.position[0],
            y: npc.position[1]
        }) < 350) {
            foundNPCBuyer = true;
            break;
        }
    }
    if (!foundNPCBuyer) return; // Can't buy things, nobody is near.

    let items = findItemsWithLevel(itemName, targetLevel)
    if (items.length >= targetQuantity) return; // We have enough

    items = findItems(itemName);
    if (items.length < Math.min(2, targetQuantity)) buy_with_gold(itemName, 1); // Buy more if we don't have any to upgrade
}

/** Returns the inventory for the player, with all empty slots removed. */
export function getInventory(inventory = parent.character.items): MyItemInfo[] {
    let items: MyItemInfo[] = [];
    for (let i = 0; i < 42; i++) {
        if (!inventory[i]) continue; // No item in this slot
        items.push({ ...inventory[i], index: i })
    }
    return items;
}

export function findItem(name: ItemName): MyItemInfo {
    for (let i = 0; i < 42; i++) {
        if (!parent.character.items[i]) continue; // No item in this slot
        if (parent.character.items[i].name != name) continue; // Item doesn't match.

        return { ...parent.character.items[i], index: i }
    }
}

export function findItems(name: ItemName): MyItemInfo[] {
    let items: MyItemInfo[] = [];
    for (let i = 0; i < 42; i++) {
        if (!parent.character.items[i]) continue; // No item in this slot
        if (parent.character.items[i].name != name) continue; // Item doesn't match.

        items.push({ ...parent.character.items[i], index: i });
    }
    return items;
}

export function findItemsWithLevel(name: ItemName, level: number): MyItemInfo[] {
    let items: MyItemInfo[] = [];
    for (let i = 0; i < 42; i++) {
        if (!parent.character.items[i]) continue; // No item in this slot
        if (parent.character.items[i].name != name) continue; // Item doesn't match.
        if (parent.character.items[i].level != level) continue; // Level doesn't match

        items.push({ ...parent.character.items[i], index: i });
    }
    return items;
}