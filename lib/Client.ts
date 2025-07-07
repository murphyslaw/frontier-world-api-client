import type { ERC2771, Format, Pod } from "../types/types.d.ts";
import { type AbiConfig, AbiConfigAction } from "./AbiConfigAction.ts";
import { type Config, ConfigAction } from "./ConfigAction.ts";
import { type Fuels, FuelsAction } from "./FuelsAction.ts";
import { HealthAction } from "./HealthAction.ts";
import { type Jump, JumpAction } from "./JumpAction.ts";
import { type Jumps, JumpsAction } from "./JumpsAction.ts";
import { type Killmail, KillmailAction } from "./KillmailAction.ts";
import { type Killmails, KillmailsAction } from "./KillmailsAction.ts";
import { MetaTransactionAction } from "./MetaTransactionAction.ts";
import { type IRequestService, RequestService } from "./RequestService.ts";
import { type Scan, ScanAction } from "./ScanAction.ts";
import { type Scans, ScansAction } from "./ScansAction.ts";
import {
  type SmartAssemblies,
  SmartAssembliesAction,
} from "./SmartAssembliesAction.ts";
import {
  type SmartAssembly,
  SmartAssemblyAction,
} from "./SmartAssemblyAction.ts";
import {
  type SmartCharacter,
  SmartCharacterAction,
} from "./SmartCharacterAction.ts";
import {
  type SmartCharacters,
  SmartCharactersAction,
} from "./SmartCharactersAction.ts";
import { type SolarSystem, SolarSystemAction } from "./SolarSystemAction.ts";
import { type SolarSystems, SolarSystemsAction } from "./SolarSystemsAction.ts";
import { type Type, TypeAction } from "./TypeAction.ts";
import { type Types, TypesAction } from "./TypesAction.ts";
import { VerifyAction } from "./VerifyAction.ts";

/** The configuration bag to pass to the {@link IClient} constructor. */
export type ClientConfig = {
  /** Base URL endpoint of the EVE:Frontier World API. */
  base: string;
};

/**
 * A class to represent an EVE:Frontier World API client.
 */
export class Client {
  /** Service to issue http requests. */
  #requestService: IRequestService;

  /**
   * Create a EVE:Frontier World API client.
   *
   * @param config client configuration options
   */
  constructor(config: ClientConfig) {
    if (!config.base) {
      throw new Error("config parameter with `base` required");
    }

    this.#requestService = new RequestService(config.base);
  }

  /**
   * Retrieve world contracts ABIs with some config.
   *
   * @returns ABI with some config.
   */
  public ABIConfig(): Promise<AbiConfig> {
    const action = new AbiConfigAction(this.#requestService);

    return action.execute();
  }

  /**
   * Retrieve all the config needed to connect to the World API services.
   *
   * @returns World API config.
   */
  public async config(): Promise<Config> {
    const action = new ConfigAction(this.#requestService);

    const result = await action.execute();

    return result[0];
  }

  /**
   * Tells you if the World API is ok.
   *
   * @returns True, when the World API is healthy, false otherwise.
   */
  public async health(): Promise<boolean> {
    const action = new HealthAction(this.#requestService);

    const result = await action.execute();

    return result.ok ?? false;
  }

  /**
   * Submit a meta transaction
   *   Only bringOnline, bringOffline and setEntityMetadata are allowed
   *
   * @param erc2771 ERC2771 Meta TX object
   */
  public metatransaction(erc2771: ERC2771): Promise<void> {
    const action = new MetaTransactionAction(this.#requestService);

    return action.execute(erc2771);
  }

  /**
   * Retrieve fuels with some metadata.
   *
   * @returns List of all fuels with some metadata.
   */
  public fuels(): Promise<Fuels> {
    const action = new FuelsAction(this.#requestService);

    return action.execute();
  }

  /**
   * Retrieve all killmails that have been saved to the chain.
   *
   * @param limit Maximum number of results.
   * @param offset Starting index for paginated results.
   * @returns List of all reported killmails.
   */
  public killmails(
    limit: number = 100,
    offset: number = 0,
  ): Promise<Killmails> {
    const action = new KillmailsAction(this.#requestService, limit, offset);

    return action.execute();
  }

  /**
   * Retrieve a single killmail by the given id.
   *
   * @param id Killmail ID.
   * @param format JSON or POD format.
   * @returns A single killmail.
   */
  public killmail(id: number, format?: "json"): Promise<Killmail<"json">>;
  public killmail(id: number, format: "pod"): Promise<Killmail<"pod">>;
  public killmail(
    id: number,
    format: Format = "json",
  ): Promise<Killmail<Format>> {
    const action = new KillmailAction(this.#requestService, id, format);

    return action.execute();
  }

  /**
   * Verify a Provable Object Datatype object.
   *
   * @param pod A Provable Object Datatype object.
   * @return True, if pod is valid, false otherwise.
   */
  public async verify(pod: Pod): Promise<boolean> {
    const action = new VerifyAction(this.#requestService);

    const result = await action.execute(pod);

    return result.isValid ?? false;
  }

  /**
   * Get all the smart assemblies currently in the World.
   *
   * @param limit Maximum number of results.
   * @param offset Starting index for paginated results.
   * @returns List of all smart assemblies currently in the world.
   */
  public smartassemblies(
    limit: number = 100,
    offset: number = 0,
  ): Promise<SmartAssemblies> {
    const action = new SmartAssembliesAction(
      this.#requestService,
      limit,
      offset,
    );

    return action.execute();
  }

  /**
   * Retrieve a single smart assembly by the given id.
   *
   * @param id Smart assembly ID.
   * @param format JSON or POD format.
   * @returns A single smart assembly.
   */
  public smartassembly(
    id: string,
    format?: "json",
  ): Promise<SmartAssembly<"json">>;
  public smartassembly(
    id: string,
    format: "pod",
  ): Promise<SmartAssembly<"pod">>;
  public smartassembly(
    id: string,
    format: Format = "json",
  ): Promise<SmartAssembly<Format>> {
    const action = new SmartAssemblyAction(this.#requestService, id, format);

    return action.execute();
  }

  /**
   * Get all the smart characters currently in the world.
   *
   * @param limit Maximum number of results.
   * @param offset Starting index for paginated results.
   * @returns List of all smart characters currently in the world.
   */
  public smartcharacters(
    limit: number = 100,
    offset: number = 0,
  ): Promise<SmartCharacters> {
    const action = new SmartCharactersAction(
      this.#requestService,
      limit,
      offset,
    );

    return action.execute();
  }

  /**
   * Retrieve a single smartcharacter by the given address.
   *
   * @param address Smart character address.
   * @returns A single smartcharacter.
   */
  public smartcharacter(address: string): Promise<SmartCharacter> {
    const action = new SmartCharacterAction(this.#requestService, address);

    return action.execute();
  }

  /**
   * Get all the gate jumps that the current authenticated user made.
   *
   * @param bearer Access token to authenticate a user.
   * @param limit Maximum number of results.
   * @param offset Starting index for paginated results.
   * @returns List of all the gate jumps that the current authenticated user made.
   */
  public jumps(
    bearer: string,
    limit: number = 100000,
    offset: number = 0,
  ): Promise<Jumps> {
    const action = new JumpsAction(this.#requestService, bearer, limit, offset);

    return action.execute();
  }

  /**
   * Retrieve a single jump.
   *
   * @param id Jump ID.
   * @param bearer Access token to authenticate a user.
   * @param format JSON or POD format.
   * @returns A single jump.
   */
  public jump(
    id: number,
    bearer: string,
    format?: "json",
  ): Promise<Jump<"json">>;
  public jump(id: number, bearer: string, format: "pod"): Promise<Jump<"pod">>;
  public jump(
    id: number,
    bearer: string,
    format: Format = "json",
  ): Promise<Jump<Format>> {
    const action = new JumpAction(this.#requestService, bearer, id, format);

    return action.execute();
  }

  /**
   * Get all the scans that the current authenticated user saved.
   *
   * @param bearer Access token to authenticate a user.
   * @param limit Maximum number of results.
   * @param offset Starting index for paginated results.
   * @returns List of all the scans that the current authenticated user saved.
   */
  public scans(
    bearer: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<Scans> {
    const action = new ScansAction(this.#requestService, bearer, limit, offset);

    return action.execute();
  }

  /**
   * Retrieve a single scan.
   *
   * @param id Scan ID.
   * @param bearer Access token to authenticate a user.
   * @param format JSON or POD format.
   * @returns A single scan.
   */
  public scan(
    id: number,
    bearer: string,
    format?: "json",
  ): Promise<Scan<"json">>;
  public scan(id: number, bearer: string, format: "pod"): Promise<Scan<"pod">>;
  public scan(
    id: number,
    bearer: string,
    format: Format = "json",
  ): Promise<Scan<Format>> {
    const action = new ScanAction(this.#requestService, bearer, id, format);

    return action.execute();
  }

  /**
   * Get all the solar systems currently in the world.
   *
   * @param limit Maximum number of results.
   * @param offset Starting index for paginated results.
   * @returns List of all solar systems currently in the world.
   */
  public solarsystems(
    limit: number = 1000,
    offset: number = 0,
  ): Promise<SolarSystems> {
    const action = new SolarSystemsAction(this.#requestService, limit, offset);

    return action.execute();
  }

  /**
   * Retrieve a single solar system by the given id.
   *
   * @param id Solar system ID.
   * @param format JSON or POD format.
   * @returns A single solar system.
   */
  public solarsystem(id: number, format?: "json"): Promise<SolarSystem<"json">>;
  public solarsystem(id: number, format: "pod"): Promise<SolarSystem<"pod">>;
  public solarsystem(
    id: number,
    format: Format = "json",
  ): Promise<SolarSystem<Format>> {
    const action = new SolarSystemAction(this.#requestService, id, format);

    return action.execute();
  }

  /**
   * Get all the game types.
   *
   * @param limit Maximum number of results.
   * @param offset Starting index for paginated results.
   * @returns List of all game types.
   */
  public types(limit: number = 100, offset: number = 0): Promise<Types> {
    const action = new TypesAction(this.#requestService, limit, offset);

    return action.execute();
  }

  /**
   * Retrieve a single game type by the given id.
   *
   * @param id Game type ID.
   * @param format JSON or POD format.
   * @returns A single game type.
   */
  public type(id: number, format?: "json"): Promise<Type<"json">>;
  public type(id: number, format: "pod"): Promise<Type<"pod">>;
  public type(
    id: number,
    format: Format = "json",
  ): Promise<Type<Format>> {
    const action = new TypeAction(this.#requestService, id, format);

    return action.execute();
  }

  // async #paginated<T>(
  //   path: string,
  //   bearer: string = "",
  //   limit: number = 100,
  //   offset: number = 0,
  // ): Promise<T[]> {
  //   const results: T[] = [];

  //   try {
  //     const searchParams = new URLSearchParams();
  //     searchParams.set("limit", String(limit));
  //     searchParams.set("offset", String(offset));

  //     const response = await this.#get<
  //       components["schemas"]["v2.paginatedResponse"] & { data?: T[] }
  //     >(
  //       `${path}?${searchParams}`,
  //       bearer,
  //     );

  //     if (!response.parsedBody) {
  //       throw new Error("paginated response without parsed body");
  //     }

  //     const { data, metadata } = response.parsedBody;

  //     if (!data) throw new Error("paginated response without data");
  //     results.push(...data);

  //     if (!metadata) throw new Error("paginated response without metadata");
  //     if (!metadata.total) throw new Error("paginated response without total");

  //     const total = metadata.total;

  //     if (offset + limit < total) {
  //       results.push(
  //         ...await this.#paginated<T>(path, bearer, limit, offset + limit),
  //       );
  //     }

  //     return results;
  //   } catch (error) {
  //     throw new Error("could not fetch paginated results", { cause: error });
  //   }
  // }
}
