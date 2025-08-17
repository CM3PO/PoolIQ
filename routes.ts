import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertQuoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          error: "Validation error", 
          details: error.errors 
        });
      }
      res.status(500).json({ 
        success: false, 
        error: "Failed to submit contact form" 
      });
    }
  });

  // Quote request submission
  app.post("/api/quote", async (req, res) => {
    try {
      const validatedData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(validatedData);
      res.json({ success: true, quote });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          error: "Validation error", 
          details: error.errors 
        });
      }
      res.status(500).json({ 
        success: false, 
        error: "Failed to submit quote request" 
      });
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch contacts" 
      });
    }
  });

  // Get all quotes (for admin purposes)
  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getQuotes();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch quotes" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
