import * as z from "zod";

// Sign in validation schema
const signInValidationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

// Sign up validation schema
const signUpValidationSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const profileValidationSchema = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});

// Post validation schema
const postValidationSchema = z.object({
  caption: z
    .string()
    .min(5, { message: "Caption must be at least 1 character long" })
    .max(2200, { message: "Caption must be less than 2200 characters long" }),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters long" })
    .max(100, { message: "Location must be less than 100 characters long" }),
  tags: z.string(),
});

export {
  signInValidationSchema,
  signUpValidationSchema,
  postValidationSchema,
  profileValidationSchema,
};
