import type { paths } from "../types/world-api.schema.d.ts";
import { Post } from "./Post.ts";
import type { IRequestService } from "./RequestService.ts";

export type MetaTransaction =
  paths["/metatransaction"]["post"]["responses"]["201"]["content"];

export class MetaTransactionAction extends Post<void> {
  constructor(requestService: IRequestService) {
    super(requestService, `metatransaction`);
  }
}
