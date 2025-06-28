import type { Config, Health, Type } from "../types/types.d.ts";
import type { components } from "../types/world-api.schema.d.ts";
import { type IRequestService, RequestService } from "./RequestService.ts";

type PaginatedResponse = components["schemas"]["v2.paginatedResponse"];
type HealthResponse = components["schemas"]["routes.heatlhy"];

export class Client {
  #requestService: IRequestService;
  #baseUrl: string;

  constructor(config: Config) {
    if (!config.baseUrl) throw new Error("baseUrl configuration required");

    this.#requestService = new RequestService();
    this.#baseUrl = config.baseUrl;
  }

  public async health(): Promise<Health> {
    try {
      const response = await this.#get<HealthResponse>("health");

      return response.status === 200 && Boolean(response.parsedBody?.ok);
    } catch (error) {
      console.error("could not fetch health", error);
      return false;
    }
  }

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
