
export enum GameRole {
  TOP = "Top",
  JUNGLE = "Jungle",
  MID = "Mid",
  ADC = "ADC",
  SUPPORT = "Support",
  UNKNOWN = "General"
}

export interface ComboStep {
  key: string; // Q, W, E, R, AA, Flash, etc.
  description?: string;
}

export interface Combo {
  name: string;
  difficulty: "Fácil" | "Medio" | "Difícil" | "Insano";
  sequence: string[]; // e.g. ["E", "Q", "AA", "R"]
  description: string;
  damageType: "Burst" | "Sustain" | "Poke" | "All-in";
}

export interface Item {
  name: string;
  id: string; // DataDragon ID
}

export interface ItemBuild {
  category: string; // "Core", "Botas", "Situacional"
  items: Item[];
  reason: string;
}

export interface RuneSetup {
  treeName: string;
  treeIcon: string; // Path part
  keystone: string;
  keystoneIcon: string; // Path part
  slots: string[];
}

export interface ChampionGuide {
  championName: string;
  championId: string; // DataDragon ID (e.g. MonkeyKing)
  title: string;
  role: string;
  playstyle: string;
  combos: Combo[];
  runes: {
    primary: RuneSetup;
    secondary: RuneSetup;
    shards: string[];
  };
  items: ItemBuild[];
  tips: string[];
}

export interface SearchState {
  query: string;
  loading: boolean;
  error: string | null;
  data: ChampionGuide | null;
}

export interface ChampionSummary {
  id: string;
  name: string;
  title: string;
  image: {
    full: string;
    sprite: string;
    group: string;
  };
}
