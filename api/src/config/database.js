import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("").select("*").limit(1);
    if (error && error.code !== "PGRST116") {
      throw error;
    }
    console.log("✅ Supabase connection successful");
    return true;
  } catch (error) {
    console.error("❌ Supabase connection failed:", error.message);
    return false;
  }
};

export const db = {
  select: (table) => supabase.from(table).select("*"),

  selectColumns: (table, columns) => supabase.from(table).select(columns),

  insert: (table, data) => supabase.from(table).insert(data).select(),

  update: async (table, data, condition) => {
    console.log(`📊 DB Update on table ${table}:`, { data, condition });
    return supabase.from(table).update(data).match(condition).select();
  },

  delete: (table, condition) =>
    supabase.from(table).delete().match(condition).select(),

  findOne: (table, condition) =>
    supabase.from(table).select("*").match(condition).single(),

  count: (table, condition = {}) =>
    supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .match(condition),
};

export { supabase };
export default supabase;
