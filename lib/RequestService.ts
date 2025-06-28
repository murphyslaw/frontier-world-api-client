import { delay } from "@std/async";

export interface IRequestService {
  get<T>(path: string, args?: RequestInit): Promise<HTTPResponse<T>>;
  post<T>(
    path: string,
    body: unknown,
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

interface HTTPResponse<T> extends Response {
  parsedBody?: T;
}

export class RequestService {
  #options: IRequestServiceOptions = {
    intervalMilliseconds: 0,
    requestsPerInterval: Number.MAX_SAFE_INTEGER,
  };

  #queue: IRequestEntity[] = [];

  constructor(options?: Partial<IRequestServiceOptions>) {
    if (!options) return;

    this.#options = Object.assign({}, this.#options, options);
  }

  async get<T>(
    path: string,
    args: RequestInit = { method: "GET" },
  ): Promise<HTTPResponse<T>> {
    return await this.#http<T>(new Request(path, args));
  }

  async post<T>(
    path: string,
    body: unknown,
    args: RequestInit = { method: "POST", body: JSON.stringify(body) },
  ): Promise<HTTPResponse<T>> {
    return await this.#http<T>(new Request(path, args));
  }

  async put<T>(
    path: string,
    body: unknown,
    args: RequestInit = { method: "PUT", body: JSON.stringify(body) },
  ): Promise<HTTPResponse<T>> {
    return await this.#http<T>(new Request(path, args));
  }

  async delete<T>(
    path: string,
    args: RequestInit = { method: "DELETE" },
  ): Promise<HTTPResponse<T>> {
    return await this.#http<T>(new Request(path, args));
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
