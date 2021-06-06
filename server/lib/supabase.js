"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = supabase_js_1.createClient(process.env.SUPABASE_API_URL, process.env.SUPABASE_API_KEY);
exports.default = supabase;
//# sourceMappingURL=supabase.js.map