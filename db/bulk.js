async function bulk(db) {
    await db.query(
      `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT,
          lastname TEXT,
          email TEXT,
          password TEXT
        );
      `
    );
}

export default bulk;