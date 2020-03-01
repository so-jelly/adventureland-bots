let target = "poisio"

function getEntities({
    canAttackUsWithoutMoving,
    isAttacking,
    isAttackingParty,
    isAttackingUs,
    isCtype,
    isMonster,
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
        // TODO: See if there's a way we can tell if a player is attacking in PVP. Until then, assume they are.

        // Attacking us
        if (isAttackingUs === true && entity.type == "monster" && entity.target != parent.character.name) continue // Not targeting us
        if (isAttackingUs === false && entity.type == "monster" && entity.target == parent.character.name) continue // Is targeting us
        if (isAttackingUs === true && entity.type == "character" && !isPVP) continue // Not PVP == can't attack us
        if (isAttackingUs === true && entity.type == "character" && parent.party_list.includes(id)) continue // Can't (shouldn't?) attack us, they're in our party
        if (isAttackingUs === true && parent.character.name == "Wizard") continue // Assume Wizard won't attack us

        // TODO: See if there's a way we can tell if a player is attacking in PVP. Until then, assume they are.

        // Is of character type
        if (isCtype !== undefined && entity.ctype != isCtype) continue

        // Is Monster
        if (isMonster === true && entity.type != "monster") continue
        if (isMonster === false && entity.type == "monster") continue

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

function mainLoop() {
    try {
        let entities = getEntities
    } catch (e) {

    }
    setTimeout(() => {
        mainLoop()
    }, Math.max(250, parent.character.ping))
}

function attackLoop() {
    try {
        let attacking = getEntities({
            isMonster: true,
            isAttackingUs: true
        })
        if (attacking.length) {
            await attack(attacking[0])
        } else {
            let notAttacking = getEntities({
                isMonster: true
            })
            if (notAttacking.length) {
                await attack(attacking[0])
            }
        }
    } catch (e) {

    }
    setTimeout(() => {
        attackLoop()
    }, Math.max(250, parent.character.ping))
}

function healLoop() {
    try {

    } catch (e) {

    }
    setTimeout(() => {
        mainLoop()
    }, Math.max(250, parent.character.ping))
}

mainLoop()
attackLoop()
healLoop()