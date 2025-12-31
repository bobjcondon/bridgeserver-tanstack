import { seed, reset } from "drizzle-seed";
import { sql } from 'drizzle-orm';
import { db } from "@/lib/db";
import * as schema from "@/models/schema";

async function main() {

    console.log("Seeding database...");
    await reset(db, schema);
    await seed(db, schema, { count: 50 });

    const users = await db.query.users.findMany();
    console.log(`Seeded ${users.length} users (counted via ORM)`);

    // After seeding, adjust sequences -- this feels like a workaround for a bug.
    await db.execute(sql`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users)+1)`);
    await db.execute(sql`SELECT setval('locations_id_seq', (SELECT MAX(id) FROM locations)+1)`);
    await db.execute(sql`SELECT setval('tournaments_id_seq', (SELECT MAX(id) FROM tournaments)+1)`);
    await db.execute(sql`SELECT setval('registrations_id_seq', (SELECT MAX(id) FROM registrations)+1)`);

    console.log("Seeding completed.");

}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
