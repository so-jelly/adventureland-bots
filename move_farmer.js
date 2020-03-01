const target = "bee"
const merchant = "earthMer"

function getCooldownMS(skill) {
    if (parent.next_skill && parent.next_skill[skill]) {
        const ms = parent.next_skill[skill].getTime() - Date.now()
        return ms < parent.character.ping ? parent.character.ping : ms
    } else {
        return parent.character.ping
    }
}

function getEntities({
    canAttackUsWithoutMoving,
    isAttacking,
    isAttackingParty,
    isAttackingUs,
    isCtype,
    isMonster,
    isMonsterType,
    isMoving,
    isNPC,
    isPartyMember,
    isPlayer,
    isRIP,
    isWithinDistance
}) {
    const entities = []

    const isPVP = is_pvp()

    for (const id in parent.entities) {
        const entity = parent.entities[id]
        const d = distance(parent.character, entity)

        // Can attack us without moving
        if (canAttackUsWithoutMoving === true && entity.range > d) continue // The distance between us and it is greater than their attack range

        // Attacking
        if (isAttacking === true && entity.type == "monster" && !entity.target) continue // No target == not attacking anything
        if (isAttacking === false && entity.type == "monster" && entity.target) continue // Has target == attacking something
        if (isAttacking === true && entity.type == "character" && !entity.target) continue // NOTE: This isn't guaranteed to be set if a player is attacking something, because they don't need to set_target in order to attack.

        // Attacking someone in our party
        if (isAttackingParty === true && entity.type == "monster" && !parent.party_list.includes(entity.target)) continue // Not attacking a party member
        if (isAttackingParty === false && entity.type == "monster" && parent.party_list.includes(entity.target)) continue // Attacking a party member
        if (isAttackingParty === true && entity.type == "character" && !isPVP) continue // Not PVP == can't attack us
        if (isAttackingParty === true && entity.type == "character" && parent.party_list.includes(id)) continue // Can't (shouldn't?) attack us, they're in our party
        if (isAttackingParty === true && parent.character.name == "Wizard") continue // Assume Wizard won't attack us
        // TODO: See if there's a way we can tell if a player is attacking in PVP. Until then, assume they are.

        // Attacking us
        if (isAttackingUs === true && entity.type == "monster" && entity.target != parent.character.name) continue // Not targeting us
        if (isAttackingUs === false && entity.type == "monster" && entity.target == parent.character.name) continue // Is targeting us
        if (isAttackingUs === true && entity.type == "character" && !isPVP) continue // Not PVP == can't attack us
        if (isAttackingUs === true && entity.type == "character" && parent.party_list.includes(id)) continue // Can't (shouldn't?) attack us, they're in our party
        if (isAttackingUs === true && parent.character.name == "Wizard") continue // Assume Wizard won't attack us

        // TODO: See if there's a way we can tell if a player is attacking in PVP. Until then, assume they are.

        // Is of character type
        if (isCtype !== undefined && !entity.ctype) continue
        if (isCtype !== undefined && entity.ctype != isCtype) continue

        // Is Monster
        if (isMonster === true && entity.type != "monster") continue
        if (isMonster === false && entity.type == "monster") continue

        // Is Monster Type
        if (isMonsterType !== undefined && !entity.mtype) continue
        if (isMonsterType !== undefined && entity.mtype != isMonsterType) continue

        // Is Moving
        if (isMoving === true && !entity.moving) continue
        if (isMoving === false && entity.moving) continue

        // Is NPC
        if (isNPC === true && entity.type != "character") continue
        if (isNPC === true && entity.type == "character" && !entity.npc) continue

        // Is party member
        if (isPartyMember === true && !parent.party_list.includes(id)) continue
        if (isPartyMember === false && parent.party_list.includes(id)) continue

        // Is Player
        if (isPlayer === true && entity.type != "character") continue
        if (isPlayer === true && entity.npc) continue

        // Is dead
        if (isRIP === true && !entity.rip) continue
        if (isRIP === false && entity.rip) continue

        // Within Distance
        if (isWithinDistance !== undefined && d > isWithinDistance) continue // Further than said distance

        entities.push(entity)
    }
    return entities
}

function getInventory(inventory = parent.character.items) {
    const items = []
    for (let i = 0; i < 42; i++) {
        if (!inventory[i]) continue // No item in this slot
        items.push({
            ...inventory[i],
            index: i
        })
    }
    return items
}

function transferItemsToMerchant(merchantName, itemsToKeep) {
    const merchant = parent.entities[merchantName]
    if (!merchant) return // No merchant nearby
    if (distance(parent.character, merchant) > 250) return // Merchant is too far away to trade

    const itemsToKeepSet = new Set(itemsToKeep)

    for (let i = 0; i < parent.character.items.length; i++) {
        const item = parent.character.items[i]
        if (!item) continue // Empty slot
        if (itemsToKeepSet.has(item.name)) {
            // We want to keep this item, but we only need to keep one slot worth of this item, let's keep the first item found
            itemsToKeepSet.delete(item.name)
            continue
        }

        if (item.q) {
            send_item(merchantName, i, item.q)
        } else {
            send_item(merchantName, i, 1)
        }
    }
}

function mainLoop() {
    try {
        loot()
        transferItemsToMerchant(merchant, ["tracker"])
    } catch (e) {

    }
    setTimeout(() => {
        mainLoop()
    }, Math.max(250, parent.character.ping))
}

async function attackLoop() {
    try {
        let attacking = getEntities({
            isMonster: true,
            isAttackingUs: true,
            isRIP: false
        })
        if (attacking.length) {
            let then = Date.now()
            await attack(attacking[0])
            reduce_cooldown("attack", (Date.now() - then) * 0.4)
        } else {
            let notAttacking = getEntities({
                isMonster: true,
                isRIP: false,
                isWithinDistance: parent.character.range
            })
            if (notAttacking.length) {
                let then = Date.now()
                await attack(notAttacking[0])
                reduce_cooldown("attack", (Date.now() - then) * 0.4)
            }
        }
    } catch (e) {

    }
    setTimeout(() => {
        attackLoop()
    }, getCooldownMS("attack"))
}

function healLoop() {
    try {
        let hpRatio = parent.character.hp / parent.character.max_hp
        let mpRatio = parent.character.mp / parent.character.max_mp
        if (parent.character.rip) {
            respawn()
        } else if (hpRatio < mpRatio && hpRatio != 1) {
            use("use_hp")
        } else if (mpRatio != 1) {
            use("use_mp")
        }
    } catch (e) {

    }
    setTimeout(() => {
        healLoop()
    }, getCooldownMS("use_hp"))
}

function moveLoop() {
    try {
        if (!smart.moving) {
            // #1: Check for targets within attack range
            let closeEntities = getEntities({
                isMonsterType: target,
                isWithinDistance: parent.character.range,
                isRIP: false
            })
            if (closeEntities.length) {
                stop()
            } else {
                // #2: Check for visible targets
                let entities = getEntities({
                    isMonsterType: target,
                    isRIP: false
                })
                if (entities.length) {
                    entities.sort((a, b) => {
                        return distance(parent.character, a) > distance(parent.character, b) ? 1 : -1
                    })
                    xmove(entities[0].real_x, entities[0].real_y)
                } else {
                    // #3: Move to target spawn
                    smart_move(target)
                }
            }
        }
    } catch (e) {

    }
    setTimeout(() => {
        moveLoop()
    }, Math.min(250, parent.character.ping))
}

function infoLoop() {
    try {
        send_cm(merchant, {
            "message": "info",
            "info": {
                "lastSeen": new Date(),
                "shouldSwitchServer": false,
                "monsterHuntTargets": [],
                "items": getInventory(),
                "attack": parent.character.attack,
                "frequency": parent.character.frequency,
                "goldm": parent.character.goldm,
                "last_ms": parent.character.last_ms,
                "luckm": parent.character.luckm,
                "map": parent.character.map,
                "x": parent.character.real_x,
                "y": parent.character.real_y,
                "s": parent.character.s
            }
        })
    } catch (e) {

    }
    setTimeout(() => {
        infoLoop()
    }, 10000)
}

mainLoop()
attackLoop()
healLoop()
moveLoop()
infoLoop()