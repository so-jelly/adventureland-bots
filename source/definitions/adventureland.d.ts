/* eslint-disable @typescript-eslint/camelcase */
declare global {
  interface Window {
    close_merchant();
    distance(from: IPosition | PositionReal, to: IPosition | PositionReal): number;
    exchange(inventoryPosition: number);
    open_merchant(standInventoryPostion: number);

    character: CharacterEntity;
    chests: {
      [id: string]: ChestInfo;
    };
    entities: { [id: string]: Entity };
    next_skill: { [T in SkillName]?: Date };
    npcs: GMapsNPC[];
    party: { [T in string]: IPosition & {
      level: number;
      /** This number refers to the percent of gold you get when one of the party members loots a chest */
      share: number;
      type: CharacterType;
    } };
    /** Contains the name of every character in your party */
    party_list: string[];
    /** Contains a list of the last 40 ping response times */
    pings: number[];
    server_identifier: ServerIdentifier;
    server_region: ServerRegion;
    socket: SocketIO.Socket;
    S: { [T in MonsterType]?: IPosition & {
      map: string;
      live: boolean;
      hp: number;
      max_hp: number;
      /** The character name that the monster is currently attacking */
      target?: string;
    } } & {
      valentines?: boolean;
    };
  }

  function attack(target: Entity): Promise<any>
  // TODO: Figure out what this function returns
  function auto_craft(name: ItemName): any
  function bank_deposit(amount: number)
  function bank_store(inventoryPosition: number, pack?: BankPackType, packPosition?: number)
  function bank_withdraw(amount: number)
  function buy_with_gold(name: ItemName, quantity: number): Promise<any>
  //TODO: Figure out this function and its arguments...
  function can_move(x: any, y?: any)
  function can_move_to(location: PositionReal): boolean
  function can_move_to(x: number, y: number): boolean
  function can_transport(entity: Entity)
  /** Checks the class and cooldown */
  function can_use(skill: SkillName): boolean
  //TODO: Figure out this function and its arguments...
  function can_use_door(f: MapName, door: any, current_x: number, current_y: number)
  function can_walk(entity: Entity): boolean
  function change_server(region: ServerRegion, identifier: ServerIdentifier)
  function change_target(target: Entity, public: boolean)
  /** Clears all user made drawings */
  function clear_drawings()
  function compound(itemInventoryPosition1: number, itemInventoryPosition2: number, itemInventoryPosition3: number, scrollInventoryPosition: number, offeringInventoryPosition?: number): Promise<any>
  /** Feed this function a value like (character.apiercing - target.armor) and it spits out a multiplier so you can adjust your expected damage */
  function damage_multiplier(difference: number): number
  function distance(from: IPosition | PositionReal, to: IPosition | PositionReal): number
  /** Draws a circle on the map */
  function draw_circle(x: number, y: number, radius: number, size: number, color: number)
  function equip(inventoryPostion: number, slot?: SlotType)
  function exchange(inventoryPosition: number)
  function game_log(message: string, color?: string)
  function get_targeted_monster(): Entity
  function heal(target: Entity)
  /** Checks whether or not we can attack other players */
  function is_pvp(): boolean
  function is_transporting(entity: Entity): boolean
  /** 0 = normal, 1 = high, 2 = rare */
  function item_grade(item: ItemInfo): -1 | 0 | 1 | 2
  /** Returns the inventory position of the item, or -1 if it's not found */
  function locate_item(item: ItemName): number
  function move(x: number, y: number)
  function reduce_cooldown(skill: SkillName, ms: number): void
  function respawn()
  /** Quantity defaults to 1 if not set */
  function sell(inventoryPostion: number, quantity?: number)
  function send_cm(to: string, data: any)
  function send_gold(to: string, amount: number)
  function send_item(to: string, inventoryPostion: number, quantity?: number)
  function send_local_cm(to: string, data: any)
  /** If isRequest is set to true, it will send a party request */
  function send_party_invite(name: string, isRequest?: boolean)
  function send_party_request(name: string)
  function set_message(text: string, color?: string)
  function simple_distance(from: IPosition | PositionReal, to: IPosition | PositionReal): number
  function smart_move(destination: IPosition | MapName | MonsterType, callback?: () => void)
  function start_character(name: string, codeName?: string)
  function stop(action?: string)
  function stop_character(name: string)
  /** Swap the position of two items in the player's inventory */
  function swap(index1: number, index2: number)
  /** For buying things off players' merchants */
  function trade_buy(target: Entity, trade_slot: number)
  function transport(map: MapName, spawn?: number)
  function unequip(slot: SlotType)
  function upgrade(itemInventoryPosition: number, scrollInventoryPosition: number, offeringInventoryPosition?: number): Promise<any>
  function use_skill(name: "3shot" | "5shot", targets: Entity[]): Promise<any>[]
  /** For destination, it's an array of [x, y] */
  function use_skill(name: "blink", destination: number[])
  /** The string is the ID of the target, the number is how much mana to spend on the attack */
  function use_skill(name: "cburst", targets: [string, number][]): Promise<any>
  function use_skill(name: "energize", target: Entity, mp: number): Promise<any>
  function use_skill(name: "magiport", target: string): Promise<any>
  function use_skill(name: "throw", target: Entity, inventoryPostion: number): Promise<any>
  function use_skill(name: "town"): Promise<any>
  function use_skill(name: SkillName, target?: Entity, extraArg?: any): Promise<any>
  /** This function uses move() if it can, otherwise it uses smart_move() */
  function xmove(x: number, y: number)

  /** Contains information about smart_move() */
  let smart: IPosition & {
    /** If searching and false, we are still searching. If  */
    found: boolean;
    /** If .moving == true, we are moving or searching */
    moving: boolean;
    plot: PositionSmart[];
    /** If ().moving == false && .searching == true), we are searching for a path. */
    searching: boolean;
    start_x: number;
    start_y: number;
    /** A settable flag. If true, smart_move will use town teleports to move around */
    use_town: boolean;
  }

  let G: {
    base_gold: { [T in MonsterType]?: {
      /** The base amount of gold this monster drops if you kill it in the given map */
      [T in MapName]?: number
    } };
    classes: { [T in CharacterType]: {
      /** A list of items that the character can equip using both hands */
      doublehand: { [T in WeaponType]?: {
        /** Modifier on the given stat for equipping this type of item */
        [T in StatType]?: number
      } };
      /** A list of items that the character can equip in its mainhand */
      mainhand: { [T in WeaponType]?: {
        /** Modifier on the given stat for equipping this type of item */
        [T in StatType]?: number
      } };
      /** A list of items that the character can equip in its offhand */
      offhand: { [T in WeaponType]?: {
        /** Modifier on the given stat for equipping this type of item */
        [T in StatType]?: number
      } };
    } };
    conditions: { [T in ConditionName]: {
      /** Indicates whether the condition is a penalty or not */
      bad: boolean;
      buff: boolean;
      /** The length the condition lasts in ms */
      duration: number;
    } & {
        [T in StatType]?: number
      } };
    dismantle: { [T in ItemName]?: {
      /** The cost of dismantling the item */
      cost: number;
      /** A list of items you will get if you dismantle. If the number is < 1, it indicates the probability of getting that item. */
      items: [number, ItemName][];
    } };
    items: { [T in ItemName]: GItem };
    geometry: {
      [T in MapName]: {
        max_x: number;
        max_y: number;
        min_x: number;
        min_y: number;
        /* The line is from ([0], [1]) to ([0], [2]) */
        x_lines: [number, number, number][];
        /* The line is from ([1], [0]) to ([2], [0]) */
        y_lines: [number, number, number][];
      }
    };
    maps: { [T in MapName]: {
      /** The 7th position can be "locked" or "ulocked"? The 8th can be "complicated"? */
      doors: [number, number, number, number, MapName, number?, number?, string?, string?][];
      /** The name of the map, if this changes, the map layout probably changed. */
      key: string;
      instance: boolean;
      monsters: {
        count: number;
        boundary?: [number, number, number, number];
        boundaries?: [MapName, number, number, number, number][];
        type: MonsterType;
      }[];
      /** Not sure what this means. Might mean that only one character of the players can be here at a time. */
      mount: boolean;
      npcs: GMapsNPC[];
      ref: {
        [id: string]: IPosition & {
          map: MapName;
          in: MapName;
          id: string;
        };
      };
      /** x, y, direction to face character */
      spawns: [number, number, number?][];
    } };
    monsters: { [T in MonsterType]: GMonster };
    npcs: { [T in NPCType]: {
      id: NPCType;
      /** Full name of NPC */
      name: string;
      /** A list of places you can transport to with this NPC. The number is the spawn */
      places?: {
        [T in MapName]?: number
      };
      role: NPCRole;
    } };
    // TODO: Get list of quest names
    quests: { [T in string]: PositionReal & {
      id: NPCType;
    } };
    skills: { [T in SkillName]: {
      apiercing?: number;
      class?: CharacterType[];
      cooldown: number;
      cooldown_multiplier?: number;
      damage_multiplier?: number;
      level?: number;
      /** Can we use this skill on monsters? */
      monster?: boolean;
      /** MP Cost for skill */
      mp?: number;
      /** The name of the skill */
      name: string;
      range?: number;
      range_multiplier?: number;
      /** For MP use skills on the mage, 1 mp will equal this much damage */
      ratio?: number;
      /** The cooldown this skill shares with another skill */
      share?: SkillName;
      /** The item(s) required to use this skill */
      slot?: [SlotType, ItemName][];
      /** Does this skill require a single target? (Don't use an array) */
      target?: boolean;
      /** Does this skill require multiple targets? (Use an array) */
      targets?: boolean;
      /** The weapon type needed to use this skill */
      wtype?: WeaponType;
    } };
  }
}

// TODO: Get a better name for this.
// TODO: Get a better naming convention for G data
export type GMapsNPC = {
  id: NPCType;
  name?: string;
  position: [number, number];
}

export type GMonster = {
  attack: number;
  damage_type: DamageType;
  frequency: number;
  hp: number;
  range: number;
  speed: number;
  xp: number;
}

export type GItem = {
  buy?: boolean;
  /** Contains information about what stats the item will gain with each compound level. Set if the item is compoundable. */
  compound?: {
    [T in StatType]?: number
  };
  damage?: DamageType;
  /** Refers to how many items are needed to exchange (see .quest as well!) */
  e?: number;
  /** Cost of the item in gold, if an NPC were to sell this item */
  g: number;
  /** The first number refers to what level the item begins being "high" grade, the second for "rare" */
  grades?: [number, number];
  /** The full name of the item */
  name: string;
  id: ItemName;
  // TODO: Add a type for quests
  /** Indicates the "quest" that this item is needed to complete */
  quest: string;
  /** Indicates how many of this items you can stack. Set if the item is stackable. */
  s: number;
  /** Contains information about what stats the item will gain with each upgrade level. Set if the item is upgradable. */
  upgrade?: {
    [T in StatType]?: number
  };
  type: ItemType;
  wtype: WeaponType;
} & { [T in StatType]?: number }

/**
* For the current character
*/
export type CharacterEntity = Entity & {
  bank: {
    [T in BankPackType]: ItemInfo[]
  } & {
    gold: number;
  };
  /** Channeling actions */
  c: {
    town?: {
      ms: number;
    };
  };
  ctype: CharacterType;
  items: ItemInfo[];
  /** Amount of gold the player has in its inventory */
  gold: number;
  /** Gold multiplier */
  goldm: number;
  /** Luck multiplier. */
  luckm: number;
  ping: number;
  // TODO: Actually figure this out
  q: {
    compound?: {

    };
    upgrade?: {
      ms: number;
      len: number;
      num: number;
    };
    exchange?: {

    };
  };
  /** A bit of extra range that we can use to attack further monsters. It's variable. If you attack a monster using this extra range, it decreases for the next attack. */
  xrange: number;
}

export type Entity = PositionReal & {
  /** If set, attacks only do 1 damage */
  "1hp": number;
  /** Only set if the entity is a monster */
  aggro: number;
  apiercing: number;
  armor: number;
  attack: number;
  base: {
    "h": number;
    "v": number;
    "vn": number;
  };
  cooperative: boolean;
  ctype: CharacterType | NPCType;
  damage_type?: DamageType;
  /** A percent chance to avoid physical attacks */
  evasion: number;
  /** Related to attack speed, I think it's equal to attacks per second */
  frequency: number;
  going_x: number;
  going_y: number;
  hp: number;
  /** This value is also the key for the object in parent.entities */
  id: string;
  immune: boolean;
  /** When were the ms values last updated? */
  last_ms: Date;
  level: number;
  max_hp: number;
  max_mp: number;
  /** Is the character currently moving? */
  moving: boolean;
  mp: number;
  /** The MP cost for doing an attack */
  mp_cost: number;
  /** If the entity is a monster, it is set */
  mtype?: MonsterType;
  /** Contains the full name of the monster */
  name: string;
  /** Is set if the entity is an NPC, undefined otherwise */
  npc?: string;
  /** Attack range */
  range: number;
  real_x: number;
  real_y: number;
  resistance: number;
  /** Only set if the entity is a character. If true, the player is dead. */
  rip?: boolean;
  rpiercing: number;
  s: StatusInfo;
  /** Set if the entity is a player */
  slots: {
    [T in SlotType]: ItemInfo
  } & {
    [T in TradeSlotType]?: ItemInfo & {
      /** Number of minutes remaining for giveaway items */
      giveaway?: number;
      /** List of character IDs that are in the giveaway */
      list: string[];
      price: number;
      rid: string;
    }
  };
  speed: number;
  // TODO: Add the parameters to this object
  /** If set, the merchant has a stand open */
  standed?: any;
  /** Set if we are under the status effect "stoned" */
  stoned?: boolean;
  /** Set if the player or monster is targeting something */
  target: string;
  type: "character" | "monster";
  vx: number;
  vy: number;
}

export type ChestInfo = PositionReal & {
  alpha: number;
  skin: "chest3" | string;
}

export type ItemInfo = {
  /** If true, the entity is buying this item */
  b?: boolean;
  /** Set if the item is compoundable or upgradable */
  level?: number;
  name: ItemName;
  /** How many of this item we have. Set if the item is stackable. */
  q?: number;
  /** If set, name == placeholder, and we are upgrading or compounding something */
  p?: {
    chance: number;
    name: ItemName;
    level: number;
    scroll: ItemName;
    nums: number[];
  } | "shiny" | "glitched" | "superfast";
  /** If set, the item is for sale, or purchase */
  rid?: string;
}

export type StatusInfo = {
  [T in ConditionName]?: {
    /** How many ms left before this condition expires */
    ms: number;
  } } & {
    coop?: {
      id: string;
      p: number;
    };
    mluck?: {
      /** The ID of the merchant who cast mluck */
      f: string;
    };
    monsterhunt?: {
      /** The server ID where the monster hunt is valid */
      sn: string;
      /** Number of monsters remaining to kill */
      c: number;
      /** What monster we have to kill */
      id: MonsterType;
    };
    citizen0aura?: {
      luck: number;
    };
    citizen4aura?: {
      gold: number;
    };
  }

export type PositionReal = IPosition & {
  map: MapName;
  real_x?: number;
  real_y?: number;
}

export type PositionSmart = IPosition & {
  map: MapName;
  transport?: boolean;
  i?: number;
  s?: number;
}

export type IPosition = {
  /**
   * Contains the name of the map
   */
  map?: MapName;
  x: number;
  y: number;
}

// TODO: Get all types (from G?)
export type CharacterType =
  | "mage"
  | "merchant"
  | "paladin"
  | "priest"
  | "ranger"
  | "rogue"
  | "warrior"

// TODO: Get all types (from G?)
export type DamageType =
  | "magical"
  | "physical"

// TODO: Get all types
export type ItemType =
  | "box"
  | "cape"
  | "gem"
  | "material"
  | "misc"
  | "quest"

// TODO: Get all stat types
export type StatType =
  | "armor"
  | "attack"
  | "dex"
  | "for"
  | "frequency"
  | "gold"
  | "hp"
  | "int"
  | "lifesteal"
  | "luck"
  | "mp_cost"
  | "range"
  | "resistance"
  | "speed"
  | "str"
  | "vit"

export type WeaponType =
  | "axe"
  | "basher"
  | "bow"
  | "crossbow"
  | "dagger"
  | "dartgun"
  | "fist"
  | "mace"
  | "pmace"
  | "rapier"
  | "short_sword"
  | "spear"
  | "staff"
  | "stars"
  | "sword"
  | "wand"
  | "wblade"

export type MonsterType =
  | "arcticbee"
  | "armadillo"
  | "bat"
  | "bbpompom"
  | "bee"
  | "bigbird"
  | "bluefairy"
  | "boar"
  | "booboo"
  | "cgoo"
  | "chestm"
  | "crab"
  | "crabx"
  | "croc"
  | "d_wiz"
  | "dknight2"
  | "dragold"
  | "eelemental"
  | "ent"
  | "felemental"
  | "fireroamer"
  | "franky"
  | "frog"
  | "fvampire"
  | "ghost"
  | "goblin"
  | "goldenbat"
  | "goo"
  | "greenfairy"
  | "greenjr"
  | "grinch"
  | "gscorpion"
  | "hen"
  | "iceroamer"
  | "jr"
  | "jrat"
  | "kitty1"
  | "kitty2"
  | "kitty3"
  | "kitty4"
  | "ligerx"
  | "mechagnome"
  | "minimush"
  | "mole"
  | "mrgreen"
  | "mrpumpkin"
  | "mummy"
  | "mvampire"
  | "nelemental"
  | "nerfedmummy"
  | "oneeye"
  | "osnake"
  | "phoenix"
  | "pinkgoblin"
  | "pinkgoo"
  | "plantoid"
  | "poisio"
  | "porcupine"
  | "pppompom"
  | "prat"
  | "puppy1"
  | "puppy2"
  | "puppy3"
  | "puppy4"
  | "rat"
  | "redfairy"
  | "rooster"
  | "rudolph"
  | "scorpion"
  | "skeletor"
  | "snake"
  | "snowman"
  | "spider"
  | "squig"
  | "squigtoad"
  | "stompy"
  | "stoneworm"
  | "target"
  | "target_a500"
  | "target_a750"
  | "target_ar500red"
  | "target_ar900"
  | "target_r500"
  | "target_r750"
  | "tortoise"
  | "wabbit"
  | "welemental"
  | "wolf"
  | "wolfie"
  | "xscorpion"

export type BankPackType =
  | "gold"
  | "items0"
  | "items1"
  | "items2"
  | "items3"
  | "items4"
  | "items5"
  | "items6"
  | "items7"

export type SlotType =
  | "amulet"
  | "belt"
  | "cape"
  | "chest"
  | "earring1"
  | "earring2"
  | "elixir"
  | "gloves"
  | "helmet"
  | "mainhand"
  | "offhand"
  | "orb"
  | "pants"
  | "ring1"
  | "ring2"
  | "shoes"

export type TradeSlotType =
  | "trade1"
  | "trade2"
  | "trade3"
  | "trade4"
  | "trade5"
  | "trade6"
  | "trade7"
  | "trade8"
  | "trade9"
  | "trade10"
  | "trade11"
  | "trade12"
  | "trade13"
  | "trade14"
  | "trade15"
  | "trade16"

export type ConditionName =
  | "authfail"
  | "blink"
  | "burned"
  | "charging"
  | "charmed"
  | "darkblessing"
  | "easterluck"
  | "eburn"
  | "eheal"
  | "energized"
  | "fingered"
  | "frozen"
  | "fullguard"
  | "hardshell"
  | "holidayspirit"
  | "licenced"
  | "marked"
  | "mcourage"
  | "mlifesteal"
  | "mluck"
  | "monsterhunt"
  | "notverified"
  | "phasedout"
  | "poisoned"
  | "poisonous"
  | "power"
  | "reflection"
  | "rspeed"
  | "slowness"
  | "stack"
  | "stoned"
  | "stunned"
  | "sugarrush"
  | "tangled"
  | "warcry"
  | "weakness"
  | "withdrawal"
  | "xpower"
  | "xshotted"

export type ItemName =
  | "5bucks"
  | "ale"
  | "amuletofm"
  | "angelwings"
  | "apiercingscroll"
  | "apologybox"
  | "armorbox"
  | "armorring"
  | "armorscroll"
  | "ascale"
  | "axe3"
  | "bandages"
  | "basher"
  | "basketofeggs"
  | "bataxe"
  | "bcandle"
  | "bcape"
  | "beewings"
  | "bfang"
  | "bfur"
  | "blade"
  | "blue"
  | "bottleofxp"
  | "bow"
  | "bow4"
  | "bowofthedead"
  | "bronzeingot"
  | "bronzenugget"
  | "brownegg"
  | "btusk"
  | "bugbountybox"
  | "bunnyears"
  | "bunnyelixir"
  | "bwing"
  | "cake"
  | "candy0"
  | "candy0v2"
  | "candy0v3"
  | "candy1"
  | "candy1v2"
  | "candy1v3"
  | "candycane"
  | "candycanesword"
  | "candypop"
  | "cape"
  | "carrot"
  | "carrotsword"
  | "cclaw"
  | "cdarktristone"
  | "cdragon"
  | "charmer"
  | "chrysalis0"
  | "claw"
  | "coal"
  | "coat"
  | "coat1"
  | "cocoon"
  | "computer"
  | "confetti"
  | "cosmo0"
  | "cosmo1"
  | "cosmo2"
  | "cosmo3"
  | "cosmo4"
  | "crabclaw"
  | "critscroll"
  | "crossbow"
  | "cscale"
  | "cscroll0"
  | "cscroll1"
  | "cscroll2"
  | "cscroll3"
  | "cshell"
  | "ctristone"
  | "cupid"
  | "cxjar"
  | "dagger"
  | "daggerofthedead"
  | "darktristone"
  | "dartgun"
  | "dexamulet"
  | "dexbelt"
  | "dexearring"
  | "dexring"
  | "dexscroll"
  | "dragondagger"
  | "drapes"
  | "dreturnscroll"
  | "dstones"
  | "ecape"
  | "ectoplasm"
  | "eears"
  | "egg0"
  | "egg1"
  | "egg2"
  | "egg3"
  | "egg4"
  | "egg5"
  | "egg6"
  | "egg7"
  | "egg8"
  | "eggnog"
  | "electronics"
  | "elixirdex0"
  | "elixirdex1"
  | "elixirdex2"
  | "elixirint0"
  | "elixirint1"
  | "elixirint2"
  | "elixirluck"
  | "elixirstr0"
  | "elixirstr1"
  | "elixirstr2"
  | "elixirvit0"
  | "elixirvit1"
  | "elixirvit2"
  | "emptyheart"
  | "emptyjar"
  | "epyjamas"
  | "eslippers"
  | "espresso"
  | "essenceofether"
  | "essenceoffire"
  | "essenceoffrost"
  | "essenceoflife"
  | "essenceofnature"
  | "evasionscroll"
  | "fclaw"
  | "feather0"
  | "fierygloves"
  | "figurine"
  | "fireblade"
  | "firebow"
  | "firecrackers"
  | "firestaff"
  | "flute"
  | "forscroll"
  | "frankypants"
  | "frequencyscroll"
  | "frogt"
  | "frostbow"
  | "froststaff"
  | "frozenstone"
  | "fsword"
  | "ftrinket"
  | "funtoken"
  | "fury"
  | "gbow"
  | "gem0"
  | "gem1"
  | "gem2"
  | "gem3"
  | "gemfragment"
  | "ghatb"
  | "ghatp"
  | "gift0"
  | "gift1"
  | "glitch"
  | "gloves"
  | "gloves1"
  | "goldbooster"
  | "goldenegg"
  | "goldenpowerglove"
  | "goldingot"
  | "goldnugget"
  | "goldscroll"
  | "gphelmet"
  | "greenbomb"
  | "gslime"
  | "gum"
  | "hammer"
  | "handofmidas"
  | "harbringer"
  | "harmor"
  | "hboots"
  | "hbow"
  | "helmet"
  | "helmet1"
  | "hgloves"
  | "hhelmet"
  | "hotchocolate"
  | "hpamulet"
  | "hpants"
  | "hpbelt"
  | "hpot0"
  | "hpot1"
  | "hpotx"
  | "ijx"
  | "ink"
  | "intamulet"
  | "intbelt"
  | "intearring"
  | "intring"
  | "intscroll"
  | "jacko"
  | "jewellerybox"
  | "kitty1"
  | "lantern"
  | "lbelt"
  | "leather"
  | "ledger"
  | "licence"
  | "lifestealscroll"
  | "lostearring"
  | "lotusf"
  | "lspores"
  | "luckbooster"
  | "luckscroll"
  | "luckyt"
  | "maceofthedead"
  | "mageshood"
  | "manastealscroll"
  | "mcape"
  | "mcarmor"
  | "mcboots"
  | "mcgloves"
  | "mchat"
  | "mcpants"
  | "merry"
  | "mistletoe"
  | "mittens"
  | "mmarmor"
  | "mmgloves"
  | "mmhat"
  | "mmpants"
  | "mmshoes"
  | "molesteeth"
  | "monsterbox"
  | "monstertoken"
  | "mparmor"
  | "mpcostscroll"
  | "mpgloves"
  | "mphat"
  | "mpot0"
  | "mpot1"
  | "mpotx"
  | "mppants"
  | "mpshoes"
  | "mrarmor"
  | "mrboots"
  | "mrgloves"
  | "mrhood"
  | "mrnarmor"
  | "mrnboots"
  | "mrngloves"
  | "mrnhat"
  | "mrnpants"
  | "mrpants"
  | "mshield"
  | "mushroomstaff"
  | "mwarmor"
  | "mwboots"
  | "mwgloves"
  | "mwhelmet"
  | "mwpants"
  | "mysterybox"
  | "networkcard"
  | "nheart"
  | "offering"
  | "offeringx"
  | "oozingterror"
  | "orbg"
  | "orbofdex"
  | "orbofint"
  | "orbofsc"
  | "orbofstr"
  | "orbofvit"
  | "ornament"
  | "ornamentstaff"
  | "outputscroll"
  | "pants"
  | "pants1"
  | "partyhat"
  | "phelmet"
  | "pico"
  | "pinkie"
  | "placeholder"
  | "platinumingot"
  | "platinumnugget"
  | "pleather"
  | "pmace"
  | "poison"
  | "poker"
  | "powerglove"
  | "pstem"
  | "pumpkinspice"
  | "puppy1"
  | "puppyer"
  | "pvptoken"
  | "pyjamas"
  | "qubics"
  | "quiver"
  | "rabbitsfoot"
  | "rapier"
  | "rattail"
  | "redenvelope"
  | "redenvelopev2"
  | "redenvelopev3"
  | "rednose"
  | "reflectionscroll"
  | "resistancering"
  | "resistancescroll"
  | "rfangs"
  | "rfur"
  | "ringofluck"
  | "ringsj"
  | "rpiercingscroll"
  | "santasbelt"
  | "scroll0"
  | "scroll1"
  | "scroll2"
  | "scroll3"
  | "scroll4"
  | "seashell"
  | "shadowstone"
  | "shield"
  | "shoes"
  | "shoes1"
  | "slimestaff"
  | "smoke"
  | "smush"
  | "snakefang"
  | "snakeoil"
  | "snring"
  | "solitaire"
  | "spear"
  | "speedscroll"
  | "spidersilk"
  | "spores"
  | "sshield"
  | "sstinger"
  | "staff"
  | "staff2"
  | "staff3"
  | "staff4"
  | "staffofthedead"
  | "stand0"
  | "stand1"
  | "starkillers"
  | "stealthcape"
  | "stick"
  | "stinger"
  | "stonekey"
  | "stoneofgold"
  | "stoneofluck"
  | "stoneofxp"
  | "storagebox"
  | "stramulet"
  | "strbelt"
  | "strearring"
  | "strring"
  | "strscroll"
  | "suckerpunch"
  | "supermittens"
  | "svenom"
  | "swifty"
  | "swirlipop"
  | "sword"
  | "swordofthedead"
  | "t2bow"
  | "t2dexamulet"
  | "t2intamulet"
  | "t2quiver"
  | "t2stramulet"
  | "t3bow"
  | "talkingskull"
  | "test"
  | "test2"
  | "throwingstars"
  | "tracker"
  | "trinkets"
  | "tristone"
  | "troll"
  | "tshell"
  | "tshirt0"
  | "tshirt1"
  | "tshirt2"
  | "tshirt3"
  | "tshirt4"
  | "tshirt6"
  | "tshirt7"
  | "tshirt8"
  | "tshirt88"
  | "tshirt9"
  | "vblood"
  | "vitearring"
  | "vitring"
  | "vitscroll"
  | "wand"
  | "warmscarf"
  | "warpvest"
  | "watercore"
  | "wattire"
  | "wblade"
  | "wbook0"
  | "wbook1"
  | "wbreeches"
  | "wcap"
  | "weaponbox"
  | "wgloves"
  | "whiskey"
  | "whiteegg"
  | "wine"
  | "wingedboots"
  | "woodensword"
  | "wshield"
  | "wshoes"
  | "x0"
  | "x1"
  | "x2"
  | "x3"
  | "x4"
  | "x5"
  | "x6"
  | "x7"
  | "x8"
  | "xarmor"
  | "xboots"
  | "xbox"
  | "xgloves"
  | "xhelmet"
  | "xmashat"
  | "xmaspants"
  | "xmasshoes"
  | "xmassweater"
  | "xpants"
  | "xpbooster"
  | "xpscroll"
  | "xptome"
  | "xshield"
  | "xshot"

export type MapName =
  | "abtesting"
  | "arena"
  | "bank"
  | "batcave"
  | "cave"
  | "cgallery"
  | "cyberland"
  | "d2"
  | "d_a1"
  | "d_a2"
  | "d_b1"
  | "d_e"
  | "d_g"
  | "desertland"
  | "duelland"
  | "dungeon0"
  | "goobrawl"
  | "halloween"
  | "hut"
  | "jail"
  | "level1"
  | "level2"
  | "level2e"
  | "level2n"
  | "level2s"
  | "level2w"
  | "level3"
  | "level4"
  | "main"
  | "mansion"
  | "mtunnel"
  | "old_bank"
  | "old_main"
  | "original_main"
  | "resort"
  | "resort_e"
  | "shellsisland"
  | "ship0"
  | "spookytown"
  | "tavern"
  | "test"
  | "tunnel"
  | "winter_cave"
  | "winter_inn"
  | "winter_inn_rooms"
  | "winterland"
  | "woffice"

export type NPCName =
  | "Ace"
  | "Alia"
  | "Angel"
  | "Baron"
  | "Bean"
  | "Bobo"
  | "Caroline"
  | "Christie"
  | "Christina"
  | "Cole"
  | "Crun"
  | "Cue"
  | "Daisy"
  | "Divian"
  | "Ernis"
  | "Faith"
  | "Fredric"
  | "Gabriel"
  | "Gabriella"
  | "Gabrielle"
  | "Garwyn"
  | "Gn. Spence"
  | "Green"
  | "Grundur"
  | "Guard"
  | "Haila"
  | "Jane"
  | "Janet"
  | "Jaqk"
  | "Jayson"
  | "Kane"
  | "Kilgore"
  | "Landon"
  | "Ledia"
  | "Leo"
  | "Lidia"
  | "Lilith"
  | "Lucas"
  | "Lucy"
  | "Marven"
  | "Mine Heathcliff"
  | "Mr. Dworf"
  | "Mr. Rich"
  | "New Year Tree"
  | "Pete"
  | "Pink"
  | "Ponty"
  | "Princess"
  | "Purple"
  | "Reny"
  | "Ron"
  | "Rose"
  | "Santa"
  | "Scarf"
  | "Smith"
  | "Stewart"
  | "Timmy"
  | "Tricksy"
  | "Tristian"
  | "Twig"
  | "Violet"
  | "Warin"
  | "Witch"
  | "Wizard"
  | "Wogue"
  | "Wynifreed"
  | "Wyr"
  | "Xyn"
  | "Z"

export type NPCRole =
  | "announcer"
  | "blocker"
  | "bouncer"
  | "citizen"
  | "companion"
  | "compound"
  | "craftsman"
  | "cx"
  | "daily_events"
  | "exchange"
  | "funtokens"
  | "gold"
  | "guard"
  | "items"
  | "jailer"
  | "locksmith"
  | "lostandfound"
  | "lottery"
  | "mcollector"
  | "merchant"
  | "monstertokens"
  | "newupgrade"
  | "newyear_tree"
  | "petkeeper"
  | "premium"
  | "pvp_announcer"
  | "pvptokens"
  | "quest"
  | "repeater"
  | "resort"
  | "santa"
  | "secondhands"
  | "shells"
  | "ship"
  | "shrine"
  | "standmerchant"
  | "tavern"
  | "tease"
  | "thesearch"
  | "transport"
  | "witch"

export type NPCType =
  | "antip2w"
  | "appearance"
  | "armors"
  | "basics"
  | "bean"
  | "beans"
  | "bouncer"
  | "citizen0"
  | "citizen1"
  | "citizen10"
  | "citizen11"
  | "citizen12"
  | "citizen13"
  | "citizen14"
  | "citizen15"
  | "citizen2"
  | "citizen3"
  | "citizen4"
  | "citizen5"
  | "citizen6"
  | "citizen7"
  | "citizen8"
  | "citizen9"
  | "compound"
  | "craftsman"
  | "exchange"
  | "fancypots"
  | "firstc"
  | "fisherman"
  | "funtokens"
  | "gemmerchant"
  | "goldnpc"
  | "guard"
  | "holo"
  | "holo0"
  | "holo1"
  | "holo2"
  | "holo3"
  | "holo4"
  | "holo5"
  | "items0"
  | "items1"
  | "items2"
  | "items3"
  | "items4"
  | "items5"
  | "items6"
  | "items7"
  | "jailer"
  | "leathermerchant"
  | "lichteaser"
  | "locksmith"
  | "lostandfound"
  | "lotterylady"
  | "mcollector"
  | "mistletoe"
  | "monsterhunter"
  | "newupgrade"
  | "newyear_tree"
  | "ornaments"
  | "pete"
  | "pots"
  | "premium"
  | "princess"
  | "pvp"
  | "pvpblocker"
  | "pvptokens"
  | "pwincess"
  | "santa"
  | "scrolls"
  | "secondhands"
  | "shellsguy"
  | "ship"
  | "shrine"
  | "standmerchant"
  | "tavern"
  | "tbartender"
  | "thief"
  | "transporter"
  | "wbartender"
  | "weapons"
  | "witch"
  | "wizardrepeater"
  | "wnpc"

// TODO: Confirm that PVP is actually the identifier for PVP servers
export type ServerIdentifier =
  | "I"
  | "II"
  | "PVP"

export type ServerRegion =
  | "ASIA"
  | "US"
  | "EU"

export type SkillName =
  | "3shot"
  | "4fingers"
  | "5shot"
  | "absorb"
  | "agitate"
  | "alchemy"
  | "attack"
  | "blink"
  | "burst"
  | "cburst"
  | "charge"
  | "charm"
  | "cleave"
  | "curse"
  | "darkblessing"
  | "energize"
  | "entangle"
  | "esc"
  | "gm"
  | "hardshell"
  | "heal"
  | "huntersmark"
  | "interact"
  | "invis"
  | "light"
  | "magiport"
  | "mcourage"
  | "mentalburst"
  | "mluck"
  | "move_down"
  | "move_left"
  | "move_right"
  | "move_up"
  | "mshield"
  | "multi_burn"
  | "open_snippet"
  | "partyheal"
  | "pcoat"
  | "phaseout"
  | "piercingshot"
  | "poisonarrow"
  | "portal"
  | "power"
  | "pure_eval"
  | "quickpunch"
  | "quickstab"
  | "reflection"
  | "regen_hp"
  | "regen_mp"
  | "revive"
  | "rspeed"
  | "scare"
  | "self_healing"
  | "shadowstrike"
  | "sheal"
  | "snippet"
  | "stack"
  | "stomp"
  | "stone"
  | "stop"
  | "supershot"
  | "tangle"
  | "taunt"
  | "throw"
  | "toggle_character"
  | "toggle_code"
  | "toggle_inventory"
  | "toggle_run_code"
  | "toggle_stats"
  | "track"
  | "travel"
  | "use_hp"
  | "use_mp"
  | "use_town"
  | "warcry"
  | "warp"
  | "xpower"