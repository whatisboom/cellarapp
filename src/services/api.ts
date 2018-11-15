import { getJWT } from './jwt';
export interface ICellarApiResourceConfig {
  path: string;
}

export interface IResourcePayload {
  // should use a generic type here
  [key: string]: string;
}

export class CellarApiResource {
  private domain: string = 'https://api.beercellar.io';
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
  public async list(opts?: any): Promise<any> {
    const url = this.getPath();
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers
    });
    return response.json();
  }
  public async read(payload?: IResourcePayload, opts?: any): Promise<any> {
    const url = this.getPath(payload);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers
    });
    return response.json();
  }
  public async create(payload: IResourcePayload, opts?: any): Promise<any> {
    const url = this.getPath(payload);
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: this.headers
    });
    return response.json();
  }
  public async update(payload: IResourcePayload) {}
  public async remove(id: string) {}
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
    Object.keys(params).forEach(key => {
      this.resource.replace(`:${key}`, params[key]);
    });
    return result;
  }
}
