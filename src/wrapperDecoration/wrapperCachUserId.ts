export default function cachingDecoration(func: (...arg0: any) => any) {
  const cache = new Map();
  return async function (...args: any) {
    const [req, res, next] = args;
    const id = (req.params) ? req.params.userId : req.user?._id;
    if (cache.has(id)) {
      return res.send({ data: cache.get(id) });
    }
    const result = await func(req, res, next);

    if (result) cache.set(id, result);

    return result;
  };
}
