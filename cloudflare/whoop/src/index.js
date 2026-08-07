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


const FIREBASE_PROJECT_ID = "movewell-system";

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

async function verifyFirebaseIdToken(request) {
  const auth = request.headers.get("Authorization") || "";

  if (!auth.startsWith("Bearer ")) {
    throw new Error("Missing Firebase ID token.");
  }

  const token = auth.slice(7);
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid Firebase token.");
  }

  const header = JSON.parse(
    new TextDecoder().decode(decodeBase64Url(parts[0]))
  );

  const payload = JSON.parse(
    new TextDecoder().decode(decodeBase64Url(parts[1]))
  );

  if (
    header.alg !== "RS256" ||
    !header.kid ||
    payload.aud !== FIREBASE_PROJECT_ID ||
    payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}` ||
    !payload.sub
  ) {
    throw new Error("Invalid Firebase token claims.");
  }

  const now = Math.floor(Date.now() / 1000);

  if (
    typeof payload.exp !== "number" ||
    typeof payload.iat !== "number" ||
    payload.exp <= now ||
    payload.iat > now + 60
  ) {
    throw new Error("Expired Firebase token.");
  }

  const jwksResponse = await fetch(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
    { cf: { cacheTtl: 3600, cacheEverything: true } }
  );

  if (!jwksResponse.ok) {
    throw new Error("Unable to load Firebase signing keys.");
  }

  const jwks = await jwksResponse.json();
  const jwk = jwks.keys?.find(key => key.kid === header.kid);

  if (!jwk) {
    throw new Error("Firebase signing key not found.");
  }

  const publicKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256"
    },
    false,
    ["verify"]
  );

  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    decodeBase64Url(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
  );

  if (!verified) {
    throw new Error("Invalid Firebase token signature.");
  }

  return payload;
}

async function getValidWhoopToken(env, firebaseUid) {
  const key = `firebase:${firebaseUid}`;
  let stored = await env.WHOOP_TOKENS.get(key, { type: "json" });

  if (!stored || !stored.access_token || !stored.refresh_token) {
    throw new Error("WHOOP tokens are missing.");
  }

  const refreshEarlyMs = 5 * 60 * 1000;

  if (
    stored.expires_at &&
    Date.now() < stored.expires_at - refreshEarlyMs
  ) {
    return stored.access_token;
  }

  const refreshBody = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: stored.refresh_token,
    client_id: CLIENT_ID,
    client_secret: env.WHOOP_CLIENT_SECRET,
    scope: "offline"
  });

  const refreshResponse = await fetch(WHOOP_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: refreshBody
  });

  if (!refreshResponse.ok) {
    const errorText = await refreshResponse.text();
    console.error(
      "WHOOP token refresh failed:",
      refreshResponse.status,
      errorText
    );
    throw new Error("WHOOP token refresh failed.");
  }

  const refreshed = await refreshResponse.json();

  stored = {
    ...stored,
    access_token: refreshed.access_token,
    refresh_token: refreshed.refresh_token || stored.refresh_token,
    expires_at: Date.now() + (refreshed.expires_in * 1000),
    scope: refreshed.scope || stored.scope,
    token_type: refreshed.token_type || stored.token_type
  };

  await env.WHOOP_TOKENS.put(key, JSON.stringify(stored));

  return stored.access_token;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const allowedOrigin = "https://movespan.app";
    const origin = request.headers.get("Origin");

    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") {
      if (origin !== allowedOrigin) {
        return new Response(null, { status: 403 });
      }

      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (url.pathname === "/") {
      return new Response("MoveSpan WHOOP OAuth backend is running.", {
        headers: { "Content-Type": "text/plain; charset=UTF-8" }
      });
    }

    if (url.pathname === "/summary") {
      let firebaseUser;

      try {
        firebaseUser = await verifyFirebaseIdToken(request);
      } catch (error) {
        return new Response("Unauthorized.", {
          status: 401,
          headers: corsHeaders
        });
      }

      const firebaseUid = firebaseUser.sub;

      const stored = await env.WHOOP_TOKENS.get(
        `firebase:${firebaseUid}`,
        { type: "json" }
      );

      if (!stored) {
        return Response.json(
          { connected: false },
          {
            status: 404,
            headers: {
              "Cache-Control": "no-store",
              ...corsHeaders
            }
          }
        );
      }

      let accessToken;

      try {
        accessToken = await getValidWhoopToken(env, firebaseUid);
      } catch (error) {
        console.error(error);
        return new Response("WHOOP authorization needs to be renewed.", {
          status: 401,
          headers: corsHeaders
        });
      }

      const recoveryResponse = await fetch(
        "https://api.prod.whoop.com/developer/v2/recovery?limit=1",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const sleepResponse = await fetch(
        "https://api.prod.whoop.com/developer/v2/activity/sleep?limit=1",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!recoveryResponse.ok || !sleepResponse.ok) {
        return new Response(
          `WHOOP API error. Recovery: ${recoveryResponse.status}, Sleep: ${sleepResponse.status}`,
          {
            status: 502,
            headers: corsHeaders
          }
        );
      }

      const recovery = await recoveryResponse.json();
      const sleep = await sleepResponse.json();

      return Response.json({
        connected: true,
        user_id: stored.whoop_user_id,
        recovery,
        sleep
      }, {
        headers: {
          "Cache-Control": "no-store",
          ...corsHeaders
        }
      });
    }

    if (url.pathname === "/connect") {
      let firebaseUser;

      try {
        firebaseUser = await verifyFirebaseIdToken(request);
      } catch (error) {
        return new Response("Unauthorized.", {
          status: 401,
          headers: corsHeaders
        });
      }

      const state = randomState();

      await env.WHOOP_TOKENS.put(
        `oauth:${state}`,
        firebaseUser.sub,
        { expirationTtl: 600 }
      );

      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: "code",
        scope: SCOPES,
        state
      });

      return Response.json(
        {
          auth_url: `${WHOOP_AUTH_URL}?${params.toString()}`
        },
        {
          headers: {
            "Cache-Control": "no-store",
            ...corsHeaders
          }
        }
      );
    }

    if (url.pathname === "/callback") {
      const error = url.searchParams.get("error");
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const firebaseUid = state
        ? await env.WHOOP_TOKENS.get(`oauth:${state}`)
        : null;

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

      if (!firebaseUid) {
        return new Response("Invalid or expired OAuth state.", {
          status: 403
        });
      }

      await env.WHOOP_TOKENS.delete(`oauth:${state}`);

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

      const profileResponse = await fetch(
        "https://api.prod.whoop.com/developer/v2/user/profile/basic",
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`
          }
        }
      );

      if (!profileResponse.ok) {
        console.error("WHOOP profile request failed:", profileResponse.status);
        return new Response("WHOOP profile request failed.", { status: 502 });
      }

      const profile = await profileResponse.json();
      const userId = String(profile.user_id);

      await env.WHOOP_TOKENS.put(
        `firebase:${firebaseUid}`,
        JSON.stringify({
          whoop_user_id: userId,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: Date.now() + (tokenData.expires_in * 1000),
          scope: tokenData.scope,
          token_type: tokenData.token_type
        })
      );

      return new Response(
        "WHOOP connected successfully to MoveSpan.",
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
