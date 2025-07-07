import type { paths } from "../types/world-api.schema.d.ts";
import { Get } from "./Get.ts";
import { Paginated } from "./Paginated.ts";
import type { IRequestService } from "./RequestService.ts";

export type Killmails =
  paths["/v2/killmails"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

export class KillmailsAction extends Paginated(Get)<Killmails> {
  constructor(requestService: IRequestService, limit: number, offset: number) {
    if (!limit) {
      throw new Error("limit parameter required");
    }

    if (offset === undefined) {
      throw new Error("offset parameter required");
    }

    super(requestService, "v2/killmails");

    this.limit = limit;
    this.offset = offset;
  }
}
