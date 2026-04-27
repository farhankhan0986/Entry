import crypto from "crypto";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !file.size) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const folder    = "entry-blogs";
    const timestamp = Math.round(Date.now() / 1000);

    // Signed upload: SHA-1("folder=...&timestamp=...{apiSecret}")
    const sigStr  = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(sigStr).digest("hex");

    const upload = new FormData();
    upload.append("file", file);
    upload.append("folder", folder);
    upload.append("timestamp", timestamp);
    upload.append("api_key", apiKey);
    upload.append("signature", signature);

    const res  = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: upload }
    );
    const data = await res.json();

    if (!res.ok) {
      console.error("Cloudinary error:", data);
      return Response.json({ error: data?.error?.message || "Upload failed" }, { status: 500 });
    }

    return Response.json({ url: data.secure_url });
  } catch (err) {
    console.error("Upload route error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
