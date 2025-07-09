export interface Card {
  id: string;
  name: string;
  image_uris?: {
    normal: string;
  };
  card_faces?: Array<{
    name: string;
    image_uris?: {
      normal: string;
    };
  }>;
  mana_cost?: string;
  type_line?: string;
  rarity?: string;
}

export interface Combo {
  name: string;
  description: string;
  cards: string[];
} 