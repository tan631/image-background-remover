import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const SECRET_PHRASE = "谭超真帅";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get("image") as File | null;
  const phrase = formData.get("phrase") as string | null;

  if (!image) {
    return NextResponse.json({ error: "请上传图片" }, { status: 400 });
  }

  if (phrase?.trim() !== SECRET_PHRASE) {
    return NextResponse.json({ error: "暗语不对，无法去除背景" }, { status: 403 });
  }

  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "服务未配置" }, { status: 500 });
  }

  const body = new FormData();
  body.append("image_file", image);
  body.append("size", "auto");

  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": apiKey },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Remove.bg 错误: ${err}` }, { status: res.status });
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": "inline; filename=removed-bg.png",
    },
  });
}
