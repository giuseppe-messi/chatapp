## Developer Documentation & Reference

The `Chatapp` codebase is divided into 2 main directories:

- `/client`
- `/server`

### the **`/server` directory**:

This is where the APIs and server code lives.

It's a `Node` application.

Uses `Express` framework along with `Typescript`.

`prisma` as ORM and `PostgreSQL` as database.

---

`prisma` is installed as dev dep as it is used to run prisma CLI commands, e.g. `prisma generate` or `prisma migrate`. Whereas `@prisma/client` is installed as a normal dependency.

`npx prisma init --db --output ../generated/prisma` to create the prisma project and schema file in the --output location. the `--db` flag will spin up a new postgre cloud db via prisma. a `.env` with db connection string is created and that db is linked in the schema.

You'll see the new project in the prisma console in the website.

Added a simple User model in the schema.

`npx prisma migrate dev --name init` to map data model to db schema (SQL), `migrations` directory was created, as also a `generated` direcotry at the top level which is actually what it is used to talk to the DB.

`npx prisma studio` to check DB in a localhost browser window.

To send queries to your database, an instance of Prisma Client needs to be created.

installing prisma client: `npm install @prisma/client`

then `npx prisma generate` to read Prisma schema and generates the Prisma Client.

Now you can now import the PrismaClient constructor from the `@prisma/client` package to create an instance of Prisma Client.

Whenever you make changes to your Prisma schema file, you also need to update the Prisma Client with the geneate command from above.

Whenever you update your Prisma schema, you will have to update your database schema using either `prisma migrate dev` or `prisma db push`. This will keep your database schema in sync with your Prisma schema. These commands will also run `prisma generate` under the hood to re-generate your Prisma Client.

differences between these 2 commands. [DOCS](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/install-prisma-client-typescript-postgresql)
