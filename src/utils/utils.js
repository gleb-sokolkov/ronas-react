function mapIcons(context) {
  const keys = context.keys();
  const values = keys.map(context);
  const regex = /([\\/.*]+)(\w+)\.(svg|ico)/;
  return keys.reduce((acc, key, index) => {
    const r = key.match(regex);
    return { ...acc, [r[2]]: values[index] };
  }, {});
}

export { mapIcons };