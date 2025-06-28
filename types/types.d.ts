/**
 * A class to represent an EVE:Frontier World API client.
 */
export interface IClient {
  /**
   * Tells you if the World API is ok.
   *
   * @returns True, when the World API is healthy, false otherwise.
   */
  health(): Promise<Health>;

  /**
   * Get all the game types.
   *
   * @returns List of all game types.
   */
  types(): Promise<Type[]>;
}

/** The configuration bag to pass to the {@link IClient} constructor. */
export type Config = {
  /** Base URL endpoint of the EVE:Frontier World API. */
  baseUrl: string;
};

/** Return type of the {@link IClient#types} method. */
export type Type = {
  categoryId?: number;
  categoryName?: string;
  description?: string;
  groupId?: number;
  groupName?: string;
  iconUrl?: string;
  id?: number;
  mass?: number;
  name?: string;
  portionSize?: number;
  radius?: number;
  volume?: number;
};

/** Return type of the {@link IClient#health} method. */
export type Health = boolean;
