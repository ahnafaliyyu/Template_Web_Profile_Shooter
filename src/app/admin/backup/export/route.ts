import { NextResponse } from "next/server";
import { auth } from "@/auth";
import * as audit from "@/server/modules/audit/repo";
import { exportAll } from "@/server/modules/backup/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const s = await auth();
  if (!s?.login) return new NextResponse("Tidak diizinkan", { status: 401 });
  try {
    const data = await exportAll();
    await audit.log(s.login, "ekspor cadangan", "backup");
    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        "content-type": "application/json",
        "content-disposition": `attachment; filename="cadangan-portofolio-${data.exportedAt.slice(0, 10)}.json"`,
      },
    });
  } catch {
    return new NextResponse("Database belum terhubung", { status: 503 });
  }
}
