import { neon } from "@neondatabase/serverless";

const databaseUrl = import.meta.env.VITE_NEON_DATABASE_URL;

export const sql = neon(databaseUrl);
