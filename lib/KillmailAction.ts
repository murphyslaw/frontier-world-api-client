import type { Format } from "../types/types.d.ts";
import type { paths } from "../types/world-api.schema.d.ts";
import { Formatted } from "./Formatted.ts";
import { Get } from "./Get.ts";
import type { IRequestService } from "./RequestService.ts";

export type Killmail<F extends Format> = F extends "json"
  ? paths["/v2/killmails/{id}"]["get"]["responses"]["200"]["content"][
    "application/json"
  ]
  : paths["/v2/killmails/{id}"]["get"]["responses"]["201"]["content"][
    "application/json"
  ];

export class KillmailAction<F extends Format>
  extends Formatted(Get)<Killmail<F>> {
  constructor(requestService: IRequestService, id: number, format: F) {
    if (!id) {
      throw new Error("id parameter required");
    }

    if (!format) {
      throw new Error("format parameter required");
    }

    super(requestService, `v2/killmails/${id}`);

    this.format = format;
  }
}
