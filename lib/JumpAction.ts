import type { Format } from "../types/types.d.ts";
import type { paths } from "../types/world-api.schema.d.ts";
import { Authenticated } from "./Authenticated.ts";
import { Formatted } from "./Formatted.ts";
import { Get } from "./Get.ts";
import type { IRequestService } from "./RequestService.ts";

export type Jump<F extends Format> = F extends "json"
  ? paths["/v2/smartcharacters/me/jumps/{id}"]["get"]["responses"]["200"][
    "content"
  ][
    "application/json"
  ]
  : paths["/v2/smartcharacters/me/jumps/{id}"]["get"]["responses"]["201"][
    "content"
  ][
    "application/json"
  ];

export class JumpAction<F extends Format>
  extends Authenticated(Formatted(Get))<Jump<F>> {
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

    super(requestService, `v2/smartcharacters/me/jumps/${id}`);

    this.bearer = bearer;
    this.format = format;
  }
}
