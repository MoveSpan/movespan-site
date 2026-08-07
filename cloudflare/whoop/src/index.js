const CLIENT_ID = "13267ed5-5bfc-41f8-ab7b-cddc6a04702b";
const REDIRECT_URI = "https://movespan.app/whoop-callback.html";
const WHOOP_AUTH_URL = "https://api.prod.whoop.com/oauth/oauth2/auth";
const WHOOP_TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";

const SCOPES = [
  "offline",
  "read:recovery",
  "read:cycles",
  "read:sleep",
  "read:workout",
  "read:profile",
  "read:body_measurement"
].join(" ");

function randomState() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  for (const part of cookie.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response("MoveSpan WHOOP OAuth backend is running.", {
        headers: { "Content-Type": "text/plain; charset=UTF-8" }
      });
    }

    if (url.pathname === "/connect") {
      const state = randomState();

      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: "code",
        scope: SCOPES,
        state
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: `${WHOOP_AUTH_URL}?${params.toString()}`,
          "Set-Cookie":
            `whoop_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
        }
      });
    }

    if (url.pathname === "/callback") {
      const error = url.searchParams.get("error");
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const savedState = getCookie(request, "whoop_oauth_state");

      if (error) {
        return new Response(`WHOOP authorization failed: ${error}`, {
          status: 400
        });
      }

      if (!code || !state) {
        return new Response("Missing WHOOP authorization code or state.", {
          status: 400
        });
      }

      if (!savedState || state !== savedState) {
        return new Response("Invalid OAuth state.", {
          status: 403
        });
      }

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: CLIENT_ID,
        client_secret: env.WHOOP_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI
      });

      const tokenResponse = await fetch(WHOOP_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("WHOOP token exchange failed:", tokenResponse.status, errorText);

        return new Response("WHOOP token exchange failed.", {
          status: 502
        });
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.access_token || !tokenData.refresh_token) {
        console.error("WHOOP returned an incomplete token response.");
        return new Response("WHOOP returned an incomplete token response.", {
          status: 502
        });
      }

      return new Response(
        "WHOOP authorization succeeded. Tokens received securely by MoveSpan backend.",
        {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=UTF-8",
            "Cache-Control": "no-store",
            "Set-Cookie":
              "whoop_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
          }
        }
      );
    }

    return new Response("Not found", { status: 404 });
  }
};
