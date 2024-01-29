import { User } from "@supabase/supabase-js";
import { atomWithStorage } from "jotai/utils";

export const authAtom = atomWithStorage<User | null>('authToken', null);