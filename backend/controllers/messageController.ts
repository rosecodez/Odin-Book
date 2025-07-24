import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/prisma";

exports.message_new_post = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req.session as any).user as { id: number };
      const { text, conversation_id } = req.body as {
        text?: string;
        conversation_id?: string;
      };

      if (!text || !conversation_id) {
        res.status(400).json({ message: "text and conversation_id are required" });
        return;
      }

      const newMessage = await prisma.message.create({
        data: {
          content: text.trim(),
          conversation_id,
          sender_id: user.id,
        },
      });

      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  }
);
