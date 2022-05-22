import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable("drinks", (t) => {
    t.string("video_url");
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.alterTable("drinks", (t) => {
    t.dropColumn("video_url");
  });
}
