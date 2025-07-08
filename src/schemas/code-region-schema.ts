export const CodeRegionSchema = {
  name: 'CodeRegion',
  primaryKey: 'code',
  properties: {
    code: 'int',
    state: 'string',
    city: 'string',
    lat: 'double',
    lng: 'double',
    sinlat: 'double',
    sinlng: 'double',
    coslat: 'double',
    coslng: 'double',
    distance: 'double',
  },
};
