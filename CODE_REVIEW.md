list every bug, security issue, and performance problem, ranked by severity, with the fix. Then provide a corrected version.

1. Security issue
  i. The query for row is not using parameter
  ii. The query is open to SQL injection
  iii. The severity level is high
  iv.  'SELECT * FROM products WHERE supplier_id = $1 ORDER BY  $2', [supplierId],[sort]

  2. Performance
  i. The query does not have limit, so if there is a 1,000,000 or more records, the query will try to fetch it, this will keep the front-end waiting for a long time
  ii. Fix: const limit = req.query.limit || '50';
  iii.  'SELECT * FROM products WHERE supplier_id = $1 ORDER BY  $2 LIMIT $3', [supplierId],[sort], [limit]
  
    
const cache = {};
 
app.get('/api/suppliers/:id/stock', async (req, res) => {
  const supplierId = req.params.id;
  const sort = req.query.sort || 'quantity';
  cache[req.url] = cache[req.url] || [];
 
  const rows = await db.query(
    "SELECT * FROM inventory WHERE supplier_id = " + supplierId +
    " ORDER BY " + sort
  );
 
  const result = [];
  for (const row of rows) {
    const product = await db.query(
      'SELECT * FROM products WHERE id = $1', [row.product_id]);
    result.push({ ...row, product: product[0] });
  }
 
  cache[req.url].push(result);
  if (!result.length) res.status(404).send('Not found');
  res.json(result);
});
