import { SignJWT, jwtVerify } from "jose";
import env from "dotenv";
import { getAllApiKeys } from "./database.js";
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
    return res.status(403).json({ message: "Forbidden" });
  }
}

export async function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const apiKey = req.params.apiKey;

  if (authHeader) {
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
      return res.sendStatus(403); // present token invalid
    }
  } else if (apiKey) {
    try {
      await verifyAPIKey(apiKey);
      return next();
    } catch {
      return res.sendStatus(403); // API Key invalid
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" }); // no credentials
  }
}

async function verifyAPIKey(apiKey) {
  const apiKeys = await getAllApiKeys();
  const validKey = apiKeys.find((k) => k.key === apiKey);
  if (!validKey) {
    throw new Error("Invalid API Key");
  }
}

async function verifyToken(token) {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });
  return payload;
}
