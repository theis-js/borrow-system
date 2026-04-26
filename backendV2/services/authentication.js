import { SignJWT, jwtVerify } from "jose";
import env from "dotenv";
import { verifyAPIKeyDB } from "./database.js";
import { checkIfServiceIsActive2 } from "./functions.js";
env.config();

const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
  throw new Error("Missing SECRET_KEY environment variable");
}
const secret = new TextEncoder().encode(secretKey);

export async function generateToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

export async function authenticateAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const [scheme, token] = authHeader.split(" ");
  if (!/^Bearer$/i.test(scheme) || !token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = await verifyToken(token);
    if (!payload?.admin) {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }
    req.user = payload;
    return next();
  } catch {
    return res.status(403).json({ message: "Forbidden 403" });
  }
}

export async function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const apiKey = req.params.key;

  if (authHeader) {
    const serviceActive = await checkIfServiceIsActive2("User Frontend");
    if (!serviceActive) {
      return res
        .status(503)
        .json({ message: "User Frontend is currently unavailable." });
    }

    const parts = authHeader.split(" ");
    const scheme = parts[0];
    const token = parts[1];

    if (!/^Bearer$/i.test(scheme) || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const payload = await verifyToken(token);
      req.user = payload;
      return next();
    } catch {
      return res.status(403).json({ message: "Present token invalid" }); // present token invalid
    }
  } else if (apiKey) {
    const serviceActive = await checkIfServiceIsActive2("API");
    if (!serviceActive) {
      return res
        .status(503)
        .json({ message: "API Service is currently unavailable." });
    }

    try {
      await verifyAPIKey(apiKey);
      return next();
    } catch {
      return res.status(403).json({ message: "API Key invalid" }); // fix: don't chain after sendStatus
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" }); // no credentials
  }
}

async function verifyAPIKey(apiKey) {
  const result = await verifyAPIKeyDB(apiKey);

  if (result.valid) {
    return;
  } else {
    throw new Error("Invalid API Key");
  }
}

async function verifyToken(token) {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });
  return payload;
}
