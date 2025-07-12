import { Card } from "../types";

export const getCardImage = (card: Card) => {
  if (card.image_uris?.normal) {
    return card.image_uris.normal;
  }
  if (card.card_faces?.[0]?.image_uris?.normal) {
    return card.card_faces[0].image_uris.normal;
  }
  return null;
};

export const getCardName = (card: Card) => {
  if (card.card_faces && card.card_faces.length > 0) {
    return card.card_faces[0].name;
  }
  return card.name;
};

export const fetchCardByName = async (cardName: string): Promise<Card> => {
  const response = await fetch(
    `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch card: ${cardName}`);
  }
  return response.json();
};
