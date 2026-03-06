import { connect, type Table } from "@lancedb/lancedb";
import { join } from "path";

let table: Table | null = null;

export async function getTable(): Promise<Table> {
  if (!table) {
    const db = await connect(join(import.meta.dir, "../../db"));
    table = await db.openTable("documents");
  }
  return table;
}
