function mapIcons(context) {
  const keys = context.keys();
  const values = keys.map(context);
  const regex = /([\\/.*]+)([\w\s]+)\.(svg|ico)/;
  return keys.reduce((acc, key, index) => {
    const r = key.match(regex);
    return { ...acc, [r[2]]: values[index] };
  }, {});
}

function mapObject(obj, func) {
  let newObj = {};
  Object.entries(obj).forEach(([k, v]) => {
    if(typeof v === 'object') {
      newObj[k] = mapObject(v, func);
    } else {
      newObj[k] = func(k, v);
    }
  });
  return newObj;
}

export { mapIcons, mapObject };