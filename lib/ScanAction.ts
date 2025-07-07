import type { Format } from "../types/types.d.ts";
import type { paths } from "../types/world-api.schema.d.ts";
import { Formatted } from "./Formatted.ts";
import { Get } from "./Get.ts";
import type { IRequestService } from "./RequestService.ts";

export type Scan<F extends Format> = F extends "json"
  ? paths["/v2/smartcharacters/me/scans/{id}"]["get"]["responses"]["200"][
    "content"
  ][
    "application/json"
  ]
  : paths["/v2/smartcharacters/me/scans/{id}"]["get"]["responses"]["201"][
    "content"
  ][
    "application/json"
  ];

export class ScanAction<F extends Format> extends Formatted(Get)<Scan<F>> {
  constructor(
    requestService: IRequestService,
    bearer: string,
    id: number,
    format: F,
  ) {
    if (!bearer) {
      throw new Error("bearer parameter required");
    }

    if (!id) {
      throw new Error("id parameter required");
    }

    if (!format) {
      throw new Error("format parameter required");
    }

    super(requestService, `v2/smartcharacters/me/scans/${id}`);

    this.format = format;
  }
}
