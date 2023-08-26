async function bulk(db) {
    try {
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
    } catch(err) {
        console.log(err.message);
    }
}

export default bulk;