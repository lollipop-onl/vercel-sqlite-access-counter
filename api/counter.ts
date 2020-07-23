import { NowRequest, NowResponse } from '@vercel/node';
import { verbose } from 'sqlite3';

const sqlite3 = verbose();
const db = new sqlite3.Database(':memory:');

export default function(req: NowRequest, res: NowResponse) {
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS counter (count INT)');

    let count = 0;

    db.each('SELECT count FROM counter', (err, row) => {
      if (err) {
        console.error(err);

        return;
      }

      count = row.count + 1;
    });

    const stmt = db.prepare('UPDATE counter SET count = ?');

    stmt.run(count);

    stmt.finalize();

    const { name = 'World' } = req.query;

    res.send(`Hello ${name}! (count ${count})`);
  });
}
