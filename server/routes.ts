import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { spaces, memories } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Spaces endpoints
  app.get("/api/spaces", async (_req, res) => {
    const allSpaces = await db.query.spaces.findMany({
      with: { memories: true },
    });
    res.json(allSpaces);
  });

  app.post("/api/spaces", async (req, res) => {
    const { name, description } = req.body;
    const space = await db.insert(spaces).values({ name, description }).returning();
    res.json(space[0]);
  });

  // Memories endpoints
  app.get("/api/memories", async (req, res) => {
    const { spaceId } = req.query;
    const query = spaceId
      ? db.query.memories.findMany({ where: eq(memories.spaceId, Number(spaceId)) })
      : db.query.memories.findMany();
    const allMemories = await query;
    res.json(allMemories);
  });

  app.post("/api/memories", async (req, res) => {
    const { title, content, type, url, metadata, spaceId } = req.body;
    const memory = await db
      .insert(memories)
      .values({ title, content, type, url, metadata, spaceId })
      .returning();
    res.json(memory[0]);
  });

  const httpServer = createServer(app);
  return httpServer;
}
