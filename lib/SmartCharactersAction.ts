import type { paths } from "../types/world-api.schema.d.ts";
import { Get } from "./Get.ts";
import { Paginated } from "./Paginated.ts";
import type { IRequestService } from "./RequestService.ts";

export type SmartCharacters =
  paths["/v2/smartcharacters"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

export class SmartCharactersAction extends Paginated(Get)<SmartCharacters> {
  constructor(requestService: IRequestService, limit: number, offset: number) {
    if (!limit) {
      throw new Error("limit parameter required");
    }

    if (offset === undefined) {
      throw new Error("offset parameter required");
    }

    super(requestService, "v2/smartcharacters");

    this.limit = limit;
    this.offset = offset;
  }
}
