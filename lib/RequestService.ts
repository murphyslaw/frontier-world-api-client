import { delay } from "@std/async";

export interface IRequestService {
  base: string;
  get<T>(
    path: string,
    args?: RequestInit,
  ): Promise<HTTPResponse<T>>;
  post<T>(
    path: string,
    body: unknown,
    args?: RequestInit,
  ): Promise<HTTPResponse<T>>;
  put<T>(
    path: string,
    body: unknown,
    args?: RequestInit,
  ): Promise<HTTPResponse<T>>;
  delete<T>(
    path: string,
    args?: RequestInit,
  ): Promise<HTTPResponse<T>>;
}

interface IRequestEntity {
  request: RequestInfo;
  resolve: (value: Response) => void;
  reject: (value: Error) => void;
}

interface IRequestServiceOptions {
  intervalMilliseconds: number;
  requestsPerInterval: number;
}

export interface HTTPResponse<T> extends Response {
  parsedBody?: T;
}

export class RequestService implements IRequestService {
  /** Base URL endpoint of the EVE:Frontier World API. */
  public base: string;

  #options: IRequestServiceOptions = {
    intervalMilliseconds: 0,
    requestsPerInterval: Number.MAX_SAFE_INTEGER,
  };

  #queue: IRequestEntity[] = [];

  constructor(base: string, options?: Partial<IRequestServiceOptions>) {
    if (!base) {
      throw new Error("parameter 'base' missing");
    }

    this.base = base;

    if (options) {
      this.#options = Object.assign({}, this.#options, options);
    }
  }

  async get<T>(
    path: string,
    args: RequestInit = {},
  ): Promise<HTTPResponse<T>> {
    const input: URL = new URL(path, this.base);
    const init: RequestInit = { ...args, method: "GET" };
    return await this.#http<T>(new Request(input, init));
  }

  async post<T>(
    path: string,
    body: unknown,
    args: RequestInit = {},
  ): Promise<HTTPResponse<T>> {
    const input: URL = new URL(path, this.base);
    const init: RequestInit = {
      ...args,
      method: "POST",
      body: JSON.stringify(body),
    };
    return await this.#http<T>(new Request(input, init));
  }

  async put<T>(
    path: string,
    body: unknown,
    args: RequestInit = {},
  ): Promise<HTTPResponse<T>> {
    const input: URL = new URL(path, this.base);
    const init: RequestInit = {
      ...args,
      method: "PUT",
      body: JSON.stringify(body),
    };
    return await this.#http<T>(new Request(input, init));
  }

  async delete<T>(
    path: string,
    args: RequestInit = {},
  ): Promise<HTTPResponse<T>> {
    const input: URL = new URL(path, this.base);
    const init: RequestInit = { ...args, method: "DELETE" };
    return await this.#http<T>(new Request(input, init));
  }

  async #loop<T>(): Promise<void> {
    while (true) {
      await delay(this.#options.intervalMilliseconds);
      const entities = this.#queue.splice(0, this.#options.requestsPerInterval);

      if (!entities.length) break;

      for (const entity of entities) {
        let response: HTTPResponse<T>;

        try {
          response = await fetch(entity.request);
        } catch (error) {
          entity.reject(new Error("fetch failed", { cause: error }));
          continue;
        }

        try {
          response.parsedBody = await response.json();
        } catch (_error) {
          // ignore empty body
        }

        if (!response.ok) {
          const error = new Error(response.statusText, {
            cause: {
              request: entity.request,
              response: response.parsedBody,
              status: response.status,
            },
          });

          entity.reject(error);
          continue;
        }

        entity.resolve(response);
      }
    }
  }

  #http<T>(request: RequestInfo): Promise<HTTPResponse<T>> {
    const promise = new Promise<HTTPResponse<T>>((resolve, reject) => {
      this.#queue.push({
        request,
        resolve,
        reject,
      });
    });

    if (this.#queue.length > 0) this.#loop<T>();

    return promise;
  }
}
