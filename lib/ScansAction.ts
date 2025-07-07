import type { paths } from "../types/world-api.schema.d.ts";
import { Authenticated } from "./Authenticated.ts";
import { Get } from "./Get.ts";
import { Paginated } from "./Paginated.ts";
import type { IRequestService } from "./RequestService.ts";

export type Scans =
  paths["/v2/smartcharacters/me/scans"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

export class ScansAction extends Authenticated(Paginated(Get))<Scans> {
  constructor(
    requestService: IRequestService,
    bearer: string,
    limit: number,
    offset: number,
  ) {
    if (!bearer) {
      throw new Error("bearer parameter required");
    }

    if (!limit) {
      throw new Error("limit parameter required");
    }

    if (offset === undefined) {
      throw new Error("offset parameter required");
    }

    super(requestService, "v2/smartcharacters/me/scans");

    this.bearer = bearer;
    this.limit = limit;
    this.offset = offset;
  }
}
