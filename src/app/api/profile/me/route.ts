import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("display_name, group")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json(null, { status: 500 });
  }

  return NextResponse.json(data);
}
