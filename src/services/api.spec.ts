require('dotenv').config();
import { CellarApiResource } from './api';
const globalAny: any = global;
beforeAll(() => {
  globalAny.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({ resource: [] })
    })
  );
});
describe('CellarApiResource', () => {
  const testPath = 'some/:test/path/:with/params';
  let req = new CellarApiResource<
    {
      [key: string]: any;
    },
    { resource: [] }
  >({
    path: testPath
  });
  it('should be defined', () => {
    expect(CellarApiResource).toBeDefined();
  });
  it('should create a resource', () => {
    expect(req).toBeDefined();
  });
  it('should set the resource string on init', () => {
    expect(req.resource).toBeDefined();
    expect(req.resource.indexOf(testPath)).toBeGreaterThan(-1);
  });
  describe('buildRequestObject', () => {
    it('should be defined', () => {
      expect(req.buildRequestObject).toBeDefined();
    });
    it('should return an object', () => {
      const obj = req.buildRequestObject('GET');
      expect(typeof obj).toEqual('object');
    });
    it('should set the method', () => {
      const obj = req.buildRequestObject('POST');
      expect(obj.method).toEqual('POST');
    });
    it('should normalize the path with a leading slash', () => {
      const obj = req.buildRequestObject('GET');
      expect(obj.url).toEqual(`${process.env.API_HOST}/${testPath}`);
    });
    it('should populate urls params when passed', () => {
      const obj = req.buildRequestObject('GET', {
        test: 'param'
      });
      expect(obj.url).toBe(
        `${process.env.API_HOST}/some/param/path/:with/params`
      );
    });
    it('should have no query params when passed no params for GET', () => {
      const obj = req.buildRequestObject('GET');
      expect(obj.body).toBeUndefined();
    });
    it('should have an empty body when passed params for GET', () => {
      const obj = req.buildRequestObject('GET', {
        test: 'value'
      });
      expect(obj.body).toBeUndefined();
    });
    it('should have a query string when passed params for GET', () => {
      const obj = req.buildRequestObject('GET', {
        missing: 'parameter2'
      });
      expect(obj.url.split('?').length).toEqual(2);
    });
    it('should return an empty body for non-GET requests with no params', () => {
      const obj = req.buildRequestObject('POST');
      expect(obj.body).toBeUndefined();
    });
    it('should return an empty body for non-GET requests with url params', () => {
      const obj = req.buildRequestObject('POST', {
        test: 'blah'
      });
      expect(obj.body).toBeUndefined();
    });
    it('should return a body for non-GET requests with params outside the url params', () => {
      const obj = req.buildRequestObject('POST', {
        missing: 'param'
      });
      expect(JSON.parse(obj.body)).toEqual({
        missing: 'param'
      });
    });
  });
  describe('list', () => {
    it('should be defined', () => {
      expect(req.list).toBeDefined();
    });
    it('should return an object', (done) => {
      req.list().then((response) => {
        expect(typeof response).toBe('object');
        expect(response.resource).toEqual([]);
        done();
      });
    });
  });
  describe('read', () => {
    it('should be defined', () => {
      expect(req.read).toBeDefined();
    });
    it('should return an object', (done) => {
      req.read().then((response) => {
        expect(typeof response).toBe('object');
        expect(response.resource).toEqual([]);
        done();
      });
    });
  });
  describe('create', () => {
    it('should be defined', () => {
      expect(req.create).toBeDefined();
    });
    it('should return an object', (done) => {
      req
        .create({
          test: 'param',
          other: 'param'
        })
        .then((response) => {
          expect(typeof response).toBe('object');
          expect(response.resource).toEqual([]);
          done();
        });
    });
  });
  describe('update', () => {
    it('should be defined', () => {
      expect(req.update).toBeDefined();
    });
    it('should return an object', (done) => {
      req
        .update({
          test: 'param',
          other: 'param'
        })
        .then((response) => {
          expect(typeof response).toBe('object');
          expect(response.resource).toEqual([]);
          done();
        });
    });
  });
  describe('remove', () => {
    it('should be defined', () => {
      expect(req.remove).toBeDefined();
    });
    it('should return undefined', (done) => {
      req
        .remove({
          test: 'param',
          other: 'param'
        })
        .then((response) => {
          expect(response).toBeUndefined();
          done();
        });
    });
  });
});
