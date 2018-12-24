import { getJWT } from './jwt';
export interface ICellarApiResourceConfig {
  path: string;
}

export class CellarApiResource<T, U> {
  private domain: string = process.env.API_HOST;
  public resource: string = '';
  private headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getJWT()}`
  };
  constructor(config: ICellarApiResourceConfig) {
    if (!config && !config.path) {
      throw new Error('CellarApiResource: path must be defined');
    }
    this.setResourceString(config.path);
  }
  public async list(opts?: any): Promise<{ [resource: string]: U[] }> {
    const { url, headers } = this.buildRequestObject();
    const response = await fetch(url, {
      method: 'GET',
      headers
    });
    return response.json();
  }
  public async read(payload?: T, opts?: any): Promise<U> {
    const { url, method, headers } = this.buildRequestObject('GET', payload);

    const response = await fetch(url, {
      method,
      headers
    });
    return response.json();
  }
  public async create(payload: T, opts?: any): Promise<U> {
    const { url, method, body, headers } = this.buildRequestObject(
      'POST',
      payload
    );
    const response = await fetch(url, {
      method,
      body,
      headers
    });
    return response.json();
  }
  public async update(payload: T): Promise<U> {
    const { url, method, body, headers } = this.buildRequestObject(
      'PATCH',
      payload
    );
    const response = await fetch(url, {
      method,
      body,
      headers
    });
    return response.json();
  }
  public async remove(payload: T): Promise<U> {
    const { url, method, headers } = this.buildRequestObject('DELETE', payload);
    const response = await fetch(url, {
      method,
      headers
    });
    return response.json();
  }

  public buildRequestObject(
    method: string = 'GET',
    params: { [key: string]: any } = {}
  ): {
    url: string;
    body?: string;
    method: string;
    headers: {
      [key: string]: any;
    };
  } {
    const keys = Object.keys(params);
    let body: { [key: string]: any } = {};
    let url = this.resource;

    const query: string[] = [];

    if (keys.length === 0) {
      return {
        method,
        url: this.resource,
        headers: this.headers
      };
    }

    keys.forEach((key) => {
      const template = `:${key}`;
      const pattern = new RegExp(template);
      if (url.match(pattern)) {
        url = url.replace(template, params[key]);
      } else if (method === 'GET') {
        query.push(`${key}=${JSON.stringify(params[key])}`);
      } else {
        body[key] = params[key];
      }
    });

    if (query.length) {
      url = `${url}?${query.join('&')}`;
    }
    return {
      method,
      url,
      headers: this.headers,
      body: Object.keys(body).length ? JSON.stringify(body) : undefined
    };
  }

  private setResourceString(path: string): void {
    if (path.charAt(0) !== '/') {
      path = `/${path}`;
    }
    this.resource = this.domain + path;
  }
}
