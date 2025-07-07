import type { HTTPResponse, IRequestService } from "./RequestService.ts";

export abstract class Action<T> {
  protected init: RequestInit = {};
  protected _searchParams: URLSearchParams = new URLSearchParams();

  constructor(
    protected requestService: IRequestService,
    protected _path: string,
  ) {}

  protected get path(): string {
    return this._path + "?" + this.searchParams.toString();
  }

  protected get searchParams(): URLSearchParams {
    return this._searchParams;
  }

  protected handleResponse(response: HTTPResponse<T>): T {
    if (!response.parsedBody) {
      throw new Error("response without parsed body");
    }

    return response.parsedBody;
  }

  protected handleError(error: unknown): never {
    throw new Error(`could not fetch "${this.path}"`, { cause: error });
  }
}
