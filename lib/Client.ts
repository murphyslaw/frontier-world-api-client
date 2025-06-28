import type { Config, Health, IClient, Type } from "../types/types.d.ts";
import type { components } from "../types/world-api.schema.d.ts";
import { type IRequestService, RequestService } from "./RequestService.ts";

type PaginatedResponse = components["schemas"]["v2.paginatedResponse"];
type HealthResponse = components["schemas"]["routes.heatlhy"];

/**
 * A class to represent an EVE:Frontier World API client.
 */
export class Client implements IClient {
  /** Service to issue http requests. */
  #requestService: IRequestService;

  /** Base URL endpoint of the EVE:Frontier World API. */
  #baseUrl: string;

  /**
   * Create a EVE:Frontier World API client.
   *
   * @param config client configuration options
   */
  constructor(config: Config) {
    if (!config.baseUrl) throw new Error("baseUrl configuration required");

    this.#requestService = new RequestService();
    this.#baseUrl = config.baseUrl;
  }

  /**
   * Tells you if the World API is ok.
   *
   * @returns True, when the World API is healthy, false otherwise.
   */
  public async health(): Promise<Health> {
    try {
      const response = await this.#get<HealthResponse>("health");

      return response.status === 200 && Boolean(response.parsedBody?.ok);
    } catch (error) {
      console.error("could not fetch health", error);
      return false;
    }
  }

  /**
   * Get all the game types.
   *
   * @returns List of all game types.
   */
  public async types(): Promise<Type[]> {
    try {
      return await this.#paginated<Type>("v2/types");
    } catch (error) {
      throw new Error("could not fetch types", { cause: error });
    }
  }

  async #paginated<T>(
    path: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<T[]> {
    const results: T[] = [];

    try {
      const searchParams = new URLSearchParams();
      searchParams.append("limit", String(limit));
      searchParams.append("offset", String(offset));

      const response = await this.#get<PaginatedResponse & { data?: T[] }>(
        `${path}?${searchParams}`,
      );

      if (!response.parsedBody) {
        throw new Error("paginated response without parsed body");
      }

      const { data, metadata } = response.parsedBody;

      if (!data) throw new Error("paginated response without data");
      results.push(...data);

      if (!metadata) throw new Error("paginated response without metadata");
      if (!metadata.total) throw new Error("paginated response without total");

      const total = metadata.total;

      if (offset + limit < total) {
        results.push(...await this.#paginated<T>(path, limit, offset + limit));
      }

      return results;
    } catch (error) {
      throw new Error("could not fetch paginated results", { cause: error });
    }
  }

  #get<T>(path: string) {
    return this.#requestService.get<T>(`${this.#baseUrl}/${path}`);
  }
}
