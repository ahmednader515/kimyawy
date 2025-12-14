import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      );
    }

    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecretKey) {
      console.error("RECAPTCHA_SECRET_KEY is not set");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verify reCaptcha token with Google
    const recaptchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${token}`;
    const recaptchaResponse = await fetch(recaptchaVerificationUrl, {
      method: "POST",
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return NextResponse.json(
        { success: false, error: "Invalid reCaptcha token" },
        { status: 400 }
      );
    }

    // Additional check: verify score if using reCaptcha v3 (optional)
    // For v2, we just check if success is true
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VERIFY_RECAPTCHA_GATE]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

