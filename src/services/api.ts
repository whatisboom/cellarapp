export interface ICellarApiResourceConfig {
  path: string;
}

export class CellarApiResource {
  private domain: string = 'https://api.beercellar.io';
  private path: string = '';
  private resource: string = '';
  constructor(config: ICellarApiResourceConfig) {
    if (!config && !config.path) {
      throw new Error('CellarApiResource: path must be defined');
    }
    this.setResourceString(config.path);
  }
  public async list() {}
  public async read(id: string) {}
  public async create(payload): Promise<any> {
    const url = this.parsePath(payload);
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
  public async update(payload) {}
  public async remove(id: string) {}
  private setResourceString(path: string): void {
    if (path.charAt(0) !== '/') {
      path = `/${path}`;
    }
    this.resource = this.domain + path;
  }
  private parsePath(params: { [key: string]: any }): string {
    if (this.resource.split(':').length === 2) {
      return this.resource;
    }
    let result = this.resource;
    Object.keys(params).forEach(key => {
      this.resource.replace(`:${key}`, params[key]);
    });
    return result;
  }
}
