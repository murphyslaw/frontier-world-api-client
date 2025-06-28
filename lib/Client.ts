import type { components } from "../types/world-api.schema.d.ts";
import {
  type HTTPResponse,
  type IRequestService,
  RequestService,
} from "./RequestService.ts";

/** The configuration bag to pass to the {@link IClient} constructor. */
export type Config = {
  /** Base URL endpoint of the EVE:Frontier World API. */
  baseUrl: string;
};

/**
 * A class to represent an EVE:Frontier World API client.
 */
export class Client {
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
    if (!config.baseUrl) {
      throw new Error("config parameter with `baseUrl` required");
    }

    this.#requestService = new RequestService();
    this.#baseUrl = config.baseUrl;
  }

  /**
   * Retrieve world contracts ABIs with some config.
   *
   * @returns ABI with some config.
   */
  public async ABIConfig(): Promise<components["schemas"]["routes.ABIConfig"]> {
    try {
      const response = await this.#get<
        components["schemas"]["routes.ABIConfig"]
      >("abis/config");

      if (!response.parsedBody) {
        throw new Error("response without parsed body");
      }

      return response.parsedBody;
    } catch (error) {
      throw new Error("could not fetch ABI config", { cause: error });
    }
  }

  /**
   * Retrieve all the config needed to connect to the World API services.
   *
   * @returns World API config.
   */
  public async config(): Promise<components["schemas"]["models.ChainConfig"]> {
    try {
      const response = await this.#get<
        components["schemas"]["models.ChainConfig"][]
      >("config");

      if (!response.parsedBody) {
        throw new Error("response without parsed body");
      }

      if (!response.parsedBody[0]) {
        throw new Error("response without config entry");
      }

      return response.parsedBody[0];
    } catch (error) {
      throw new Error("could not fetch config", { cause: error });
    }
  }

  /**
   * Tells you if the World API is ok.
   *
   * @returns True, when the World API is healthy, false otherwise.
   */
  public async health(): Promise<boolean> {
    try {
      const response = await this.#get<components["schemas"]["routes.heatlhy"]>(
        "health",
      );

      return response.status === 200 && Boolean(response.parsedBody?.ok);
    } catch (error) {
      throw new Error("could not fetch health", { cause: error });
    }
  }

  /**
   * Submit a meta transaction
   *   Only bringOnline, bringOffline and setEntityMetadata are allowed
   *
   * @param erc2771 ERC2771 Meta TX object
   */
  public async metatransaction(
    erc2771: components["schemas"]["v1.ERC2771"],
  ): Promise<void> {
    if (!erc2771) {
      throw new Error("erc2771 parameter required");
    }

    try {
      await this.#post<void>("metatransaction", erc2771);

      return;
    } catch (error) {
      throw new Error("could not submit metatransaction", { cause: error });
    }
  }

  /**
   * Retrieve fuels with some metadata.
   *
   * @returns List of all fuels with some metadata.
   */
  public async fuels(): Promise<components["schemas"]["v2.fuelResponse"][]> {
    try {
      const response = await this.#get<
        components["schemas"]["v2.fuelResponse"][]
      >("v2/fuels");

      if (!response.parsedBody) {
        throw new Error("response without parsed body");
      }

      return response.parsedBody;
    } catch (error) {
      throw new Error("could not fetch fuels", { cause: error });
    }
  }

  /**
   * Retrieve all killmails that have been saved to the chain.
   *
   * @returns List of all reported killmails.
   */
  public async killmails(): Promise<
    components["schemas"]["v2.killMailResponse"][]
  > {
    try {
      const response = await this.#paginated<
        components["schemas"]["v2.killMailResponse"]
      >("v2/killmails");

      return response;
    } catch (error) {
      throw new Error("could not fetch killmails", { cause: error });
    }
  }

  /**
   * Retrieve a single killmail by the given id.
   *
   * @param id ID of the requested killmail.
   * @param format Alternative "pod" format.
   * @returns A single killmail.
   */
  public async killmail(
    id: number,
  ): Promise<components["schemas"]["v2.killMailResponse"]>;
  public async killmail(
    id: number,
    format: "pod",
  ): Promise<components["schemas"]["pod.Pod"]>;
  public async killmail(
    id: number,
    format?: "pod",
  ): Promise<
    | components["schemas"]["v2.killMailResponse"]
    | components["schemas"]["pod.Pod"]
  > {
    if (!id) {
      throw new Error("id parameter required");
    }

    if (format && format !== "pod") {
      throw new Error("format parameter must be 'pod'");
    }

    try {
      let response: HTTPResponse<
        | components["schemas"]["v2.killMailResponse"]
        | components["schemas"]["pod.Pod"]
      >;

      if (format === "pod") {
        response = await this.#get<
          components["schemas"]["pod.Pod"]
        >(`v2/killmails/${id}?format=pod`);
      } else {
        response = await this.#get<
          components["schemas"]["v2.killMailResponse"]
        >(`v2/killmails/${id}?format=json`);
      }

      if (!response.parsedBody) {
        throw new Error("response without parsed body");
      }

      return response.parsedBody;
    } catch (error) {
      throw new Error(`could not fetch killmail with id "${id}"`, {
        cause: error,
      });
    }
  }

  /**
   * Verify a Provable Object Datatype object.
   *
   * @param pod A Provable Object Datatype object.
   * @return True, if pod is valid, false otherwise.
   */
  public async verify(pod: components["schemas"]["pod.Pod"]): Promise<boolean> {
    if (!pod) {
      throw new Error("pod parameter required");
    }

    try {
      const response = await this.#post<
        components["schemas"]["v2.verifyResponse"]
      >("v2/pod/verify", pod);

      if (!response.parsedBody) {
        throw new Error("response without parsed body");
      }

      if (response.parsedBody.isValid === undefined) {
        throw new Error("response without isValid entry");
      }

      return response.parsedBody.isValid;
    } catch (error) {
      throw new Error("could not verify pod", { cause: error });
    }
  }

  /**
   * Get all the smart assemblies currently in the World.
   *
   * @returns List of all smart assemblies currently in the world.
   */
  public async smartassemblies(): Promise<
    components["schemas"]["v2.smartAssemblyResponse"][]
  > {
    try {
      const response = await this.#paginated<
        components["schemas"]["v2.smartAssemblyResponse"]
      >("v2/smartassemblies");

      return response;
    } catch (error) {
      throw new Error("could not fetch types", { cause: error });
    }
  }

  /**
   * Retrieve a single killmail by the given id.
   *
   * @param id ID of the requested killmail.
   * @param format Alternative "pod" format.
   * @returns A single killmail.
   */
  public async smartassembly(
    id: number,
  ): Promise<components["schemas"]["v2.detailedSmartAssemblyResponse"]>;
  public async smartassembly(
    id: number,
    format: "pod",
  ): Promise<components["schemas"]["pod.Pod"]>;
  public async smartassembly(
    id: number,
    format?: "pod",
  ): Promise<
    | components["schemas"]["v2.detailedSmartAssemblyResponse"]
    | components["schemas"]["pod.Pod"]
  > {
    if (!id) {
      throw new Error("id parameter required");
    }

    if (format && format !== "pod") {
      throw new Error("format parameter must be 'pod'");
    }

    try {
      let response: HTTPResponse<
        | components["schemas"]["v2.detailedSmartAssemblyResponse"]
        | components["schemas"]["pod.Pod"]
      >;

      if (format === "pod") {
        response = await this.#get<
          components["schemas"]["pod.Pod"]
        >(`v2/smartassemblies/${id}?format=pod`);
      } else {
        response = await this.#get<
          components["schemas"]["v2.detailedSmartAssemblyResponse"]
        >(`v2/smartassemblies/${id}?format=json`);
      }

      if (!response.parsedBody) {
        throw new Error("response without parsed body");
      }

      return response.parsedBody;
    } catch (error) {
      throw new Error(`could not fetch smartassembly with id "${id}"`, {
        cause: error,
      });
    }
  }

  /**
   * Get all the smart characters currently in the world.
   *
   * @returns List of all smart characters currently in the world.
   */
  public async smartcharacters(): Promise<
    components["schemas"]["v2.smartCharacterResponse"][]
  > {
    try {
      const response = await this.#paginated<
        components["schemas"]["v2.smartCharacterResponse"]
      >("v2/smartcharacters");

      return response;
    } catch (error) {
      throw new Error("could not fetch smart characters", { cause: error });
    }
  }

  /**
   * Retrieve a single smartcharacter by the given address.
   *
   * @param address Address of the requested smartcharacter.
   * @param format Alternative "pod" format.
   * @returns A single smartcharacter.
   */
  public async smartcharacter(
    address: number,
  ): Promise<components["schemas"]["v2.detailedSmartCharacterResponse"]>;
  public async smartcharacter(
    address: number,
    format: "pod",
  ): Promise<components["schemas"]["pod.Pod"]>;
  public async smartcharacter(
    address: number,
    format?: "pod",
  ): Promise<
    | components["schemas"]["v2.detailedSmartCharacterResponse"]
    | components["schemas"]["pod.Pod"]
  > {
    if (!address) {
      throw new Error("id parameter required");
    }

    if (format && format !== "pod") {
      throw new Error("format parameter must be 'pod'");
    }

    try {
      let response: HTTPResponse<
        | components["schemas"]["v2.detailedSmartCharacterResponse"]
        | components["schemas"]["pod.Pod"]
      >;

      if (format === "pod") {
        response = await this.#get<
          components["schemas"]["pod.Pod"]
        >(`v2/smartcharacters/${address}?format=pod`);
      } else {
        response = await this.#get<
          components["schemas"]["v2.detailedSmartCharacterResponse"]
        >(`v2/smartcharacters/${address}?format=json`);
      }

      if (!response.parsedBody) {
        throw new Error("response without parsed body");
      }

      return response.parsedBody;
    } catch (error) {
      throw new Error(
        `could not fetch smartcharacter with address "${address}"`,
        {
          cause: error,
        },
      );
    }
  }

  /**
   * Get all the gate jumps that the current authenticated user made.
   *
   * @param bearer Access token to authenticate a user.
   * @returns List of all the gate jumps that the current authenticated user made.
   */
  public async jumps(
    bearer: string,
  ): Promise<components["schemas"]["v2.jumpResponse"][]> {
    if (!bearer) {
      throw new Error("bearer parameter required");
    }

    try {
      const response = await this.#paginated<
        components["schemas"]["v2.jumpResponse"]
      >("v2/smartcharacters/me/jumps", bearer);

      return response;
    } catch (error) {
      throw new Error("could not fetch jumps", { cause: error });
    }
  }

  /**
   * Retrieve a single jump.
   *
   * @param id ID of the requested jump.
   * @param bearer Access token to authenticate a user.
   * @param format Alternative "pod" format.
   * @returns A single jump.
   */
  public async jump(
    id: number,
    bearer: string,
  ): Promise<components["schemas"]["v2.jumpResponse"]>;
  public async jump(
    id: number,
    bearer: string,
    format: "pod",
  ): Promise<components["schemas"]["pod.Pod"]>;
  public async jump(
    id: number,
    bearer: string,
    format?: "pod",
  ): Promise<
    components["schemas"]["v2.jumpResponse"] | components["schemas"]["pod.Pod"]
  > {
    if (!id) {
      throw new Error("id parameter required");
    }

    if (!bearer) {
      throw new Error("bearer parameter required");
    }

    if (format && format !== "pod") {
      throw new Error("format parameter must be 'pod'");
    }

    try {
      let response: HTTPResponse<
        | components["schemas"]["v2.jumpResponse"]
        | components["schemas"]["pod.Pod"]
      >;

      if (format === "pod") {
        response = await this.#get<
          components["schemas"]["pod.Pod"]
        >(`v2/smartcharacters/me/jumps/${id}?format=pod`, bearer);
      } else {
        response = await this.#get<
          components["schemas"]["v2.jumpResponse"]
        >(`v2/smartcharacters/me/jumps/${id}?format=json`, bearer);
      }

      if (!response.parsedBody) {
        throw new Error("response without parsed body");
      }

      return response.parsedBody;
    } catch (error) {
      throw new Error(`could not fetch jump with id "${id}"`, {
        cause: error,
      });
    }
  }

  /**
   * Get all the scans that the current authenticated user saved.
   *
   * @param bearer Access token to authenticate a user.
   * @returns List of all the scans that the current authenticated user saved.
   */
  public async scans(
    bearer: string,
  ): Promise<components["schemas"]["v2.scanResponse"][]> {
    if (!bearer) {
      throw new Error("bearer parameter required");
    }

    try {
      const response = await this.#paginated<
        components["schemas"]["v2.scanResponse"]
      >("v2/smartcharacters/me/scans", bearer);

      return response;
    } catch (error) {
      throw new Error("could not fetch scans", { cause: error });
    }
  }

  /**
   * Retrieve a single scan.
   *
   * @param id ID of the requested scan.
   * @param bearer Access token to authenticate a user.
   * @param format Alternative "pod" format.
   * @returns A single scan.
   */
  public async scan(
    id: number,
    bearer: string,
  ): Promise<components["schemas"]["v2.scanResponse"]>;
  public async scan(
    id: number,
    bearer: string,
    format: "pod",
  ): Promise<components["schemas"]["pod.Pod"]>;
  public async scan(
    id: number,
    bearer: string,
    format?: "pod",
  ): Promise<
    components["schemas"]["v2.scanResponse"] | components["schemas"]["pod.Pod"]
  > {
    if (!id) {
      throw new Error("id parameter required");
    }

    if (!bearer) {
      throw new Error("bearer parameter required");
    }

    if (format && format !== "pod") {
      throw new Error("format parameter must be 'pod'");
    }

    try {
      let response: HTTPResponse<
        | components["schemas"]["v2.scanResponse"]
        | components["schemas"]["pod.Pod"]
      >;

      if (format === "pod") {
        response = await this.#get<
          components["schemas"]["pod.Pod"]
        >(`v2/smartcharacters/me/scans/${id}?format=pod`, bearer);
      } else {
        response = await this.#get<
          components["schemas"]["v2.scanResponse"]
        >(`v2/smartcharacters/me/scans/${id}?format=json`, bearer);
      }

      if (!response.parsedBody) {
        throw new Error("response without parsed body");
      }

      return response.parsedBody;
    } catch (error) {
      throw new Error(`could not fetch jump with id "${id}"`, {
        cause: error,
      });
    }
  }

  /**
   * Get all the solar systems currently in the world.
   *
   * @returns List of all solar systems currently in the world.
   */
  public async solarsystems(): Promise<
    components["schemas"]["v2.solarSystemResponse"][]
  > {
    try {
      const response = await this.#paginated<
        components["schemas"]["v2.solarSystemResponse"]
      >("v2/solarsystems");

      return response;
    } catch (error) {
      throw new Error("could not fetch solar systems", { cause: error });
    }
  }

  /**
   * Retrieve a single solar system by the given id.
   *
   * @param id ID of the requested solar system.
   * @param format Alternative "pod" format.
   * @returns A single solar system.
   */
  public async solarsystem(
    id: number,
  ): Promise<components["schemas"]["v2.detailedSolarSystemResponse"]>;
  public async solarsystem(
    id: number,
    format: "pod",
  ): Promise<components["schemas"]["pod.Pod"]>;
  public async solarsystem(
    id: number,
    format?: "pod",
  ): Promise<
    | components["schemas"]["v2.solarSystemResponse"]
    | components["schemas"]["pod.Pod"]
  > {
    if (!id) {
      throw new Error("id parameter required");
    }

    if (format && format !== "pod") {
      throw new Error("format parameter must be 'pod'");
    }

    try {
      let response: HTTPResponse<
        | components["schemas"]["v2.detailedSolarSystemResponse"]
        | components["schemas"]["pod.Pod"]
      >;

      if (format === "pod") {
        response = await this.#get<
          components["schemas"]["pod.Pod"]
        >(`v2/solarsystems/${id}?format=pod`);
      } else {
        response = await this.#get<
          components["schemas"]["v2.detailedSolarSystemResponse"]
        >(`v2/solarsystems/${id}?format=json`);
      }

      if (!response.parsedBody) {
        throw new Error("response without parsed body");
      }

      return response.parsedBody;
    } catch (error) {
      throw new Error(`could not fetch solar system with id "${id}"`, {
        cause: error,
      });
    }
  }

  /**
   * Get all the game types.
   *
   * @returns List of all game types.
   */
  public async types(): Promise<components["schemas"]["v2.typeResponse"][]> {
    try {
      const response = await this.#paginated<
        components["schemas"]["v2.typeResponse"]
      >("v2/types");

      return response;
    } catch (error) {
      throw new Error("could not fetch types", { cause: error });
    }
  }

  /**
   * Retrieve a single game type by the given id.
   *
   * @param id ID of the requested game type.
   * @param format Alternative "pod" format.
   * @returns A single game type.
   */
  public async type(
    id: number,
  ): Promise<components["schemas"]["v2.typeResponse"]>;
  public async type(
    id: number,
    format: "pod",
  ): Promise<components["schemas"]["pod.Pod"]>;
  public async type(
    id: number,
    format?: "pod",
  ): Promise<
    components["schemas"]["v2.typeResponse"] | components["schemas"]["pod.Pod"]
  > {
    if (!id) {
      throw new Error("id parameter required");
    }

    if (format && format !== "pod") {
      throw new Error("format parameter must be 'pod'");
    }

    try {
      let response: HTTPResponse<
        | components["schemas"]["v2.typeResponse"]
        | components["schemas"]["pod.Pod"]
      >;

      if (format === "pod") {
        response = await this.#get<
          components["schemas"]["pod.Pod"]
        >(`v2/types/${id}?format=pod`);
      } else {
        response = await this.#get<
          components["schemas"]["v2.typeResponse"]
        >(`v2/types/${id}?format=json`);
      }

      if (!response.parsedBody) {
        throw new Error("response without parsed body");
      }

      return response.parsedBody;
    } catch (error) {
      throw new Error(`could not fetch game type with id "${id}"`, {
        cause: error,
      });
    }
  }

  async #paginated<T>(
    path: string,
    bearer: string = "",
    limit: number = 100,
    offset: number = 0,
  ): Promise<T[]> {
    const results: T[] = [];

    try {
      const searchParams = new URLSearchParams();
      searchParams.append("limit", String(limit));
      searchParams.append("offset", String(offset));

      const response = await this.#get<
        components["schemas"]["v2.paginatedResponse"] & { data?: T[] }
      >(
        `${path}?${searchParams}`,
        bearer,
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
        results.push(
          ...await this.#paginated<T>(path, bearer, limit, offset + limit),
        );
      }

      return results;
    } catch (error) {
      throw new Error("could not fetch paginated results", { cause: error });
    }
  }

  #get<T>(path: string, bearer?: string): Promise<HTTPResponse<T>> {
    const headers: HeadersInit = {};

    if (bearer) {
      headers["Authorization"] = `Bearer ${bearer}`;
    }

    return this.#requestService.get<T>(`${this.#baseUrl}/${path}`, {
      method: "GET",
      headers,
    });
  }

  #post<T>(path: string, body: unknown) {
    return this.#requestService.post<T>(`${this.#baseUrl}/${path}`, body);
  }
}
