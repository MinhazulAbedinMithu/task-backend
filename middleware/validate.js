// middleware/validate.js

const { z } = require("zod");

// Schema for task creation
const taskCreationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  startDate: z.string(), // You might want to use a more specific type, like z.date()
  startTime: z.string(),
  endDate: z.string(), // You might want to use a more specific type, like z.date()
  endTime: z.string(),
  level: z.enum(["easy", "medium", "hard"]),
  status: z.enum(["todo", "in progress", "done"]),
  createdBy: z.string().refine((value) => {
    // Validate that the value is a valid ObjectId (or UUID, depending on your database)
    // Example regex for MongoDB ObjectId: /^[a-f\d]{24}$/i
    return /^[a-f\d]{24}$/i.test(value);
  }, "Invalid reference ID format"),
});

// Schema for task update
const taskUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  startDate: z.string().optional(), // You might want to use a more specific type, like z.date()
  startTime: z.string().optional(),
  endDate: z.string().optional(), // You might want to use a more specific type, like z.date()
  endTime: z.string().optional(),
  level: z.enum(["easy", "medium", "hard"]).optional(),
  status: z.enum(["todo", "in progress", "done"]).optional(),
  createdBy: z
    .string()
    .refine((value) => {
      // Validate that the value is a valid ObjectId (or UUID, depending on your database)
      // Example regex for MongoDB ObjectId: /^[a-f\d]{24}$/i
      return /^[a-f\d]{24}$/i.test(value);
    }, "Invalid reference ID format")
    .optional(),
});

module.exports = { taskCreationSchema, taskUpdateSchema };
