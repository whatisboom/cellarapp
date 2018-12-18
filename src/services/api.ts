import { getJWT } from './jwt';
export interface ICellarApiResourceConfig {
  path: string;
}

export class CellarApiResource<T, U> {
  private domain: string = process.env.API_HOST;
  private resource: string = '';
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
    const url = this.getPath();
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers
    });
    return response.json();
  }
  public async read(payload?: T, opts?: any): Promise<U> {
    const url = this.getPath(payload);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers
    });
    return response.json();
  }
  public async create(payload: T, opts?: any): Promise<U> {
    const url = this.getPath(payload);
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: this.headers
    });
    return response.json();
  }
  public async update(payload: T): Promise<U> {
    const url = this.getPath(payload);
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: this.headers
    });
    return response.json();
  }
  public async remove(payload: T): Promise<U> {
    const url = this.getPath(payload);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.headers
    });
    return response.json();
  }
  private setResourceString(path: string): void {
    if (path.charAt(0) !== '/') {
      path = `/${path}`;
    }
    this.resource = this.domain + path;
  }
  private getPath(params?: { [key: string]: any }): string {
    if (!params || this.resource.split(':').length === 2) {
      return this.resource;
    }
    let result = this.resource;
    const queryString: string[] = [];
    Object.keys(params).forEach((key) => {
      const pattern = new RegExp(`:${key}`);
      if (result.match(pattern)) {
        result = result.replace(`:${key}`, params[key]);
      } else {
        queryString.push(`${key}=${params[key]}`);
      }
    });
    return queryString.length > 0
      ? `${result}?${queryString.join('&')}`
      : result;
  }
}
