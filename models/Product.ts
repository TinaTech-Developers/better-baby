import mongoose, { Schema, Document, model } from "mongoose";

/* ---------------- TYPES ---------------- */

export type ProductColor =
  | "Red"
  | "Blue"
  | "Black"
  | "White"
  | "Brown"
  | "Beige"
  | "Silver"
  | "Rose Gold"
  | "Dark Blue";

export interface IProduct extends Document {
  name: string;
  price: number;
  currency: string;
  description: string;
  category: string;
  sizes: string[];
  colors: ProductColor[];
  images: Record<ProductColor, string[]>; // Map of color -> array of image URLs
  createdAt: Date;
  updatedAt: Date;
}

/* ---------------- COLORS ---------------- */

export const ALL_COLORS: ProductColor[] = [
  "Red",
  "Blue",
  "Black",
  "White",
  "Brown",
  "Beige",
  "Silver",
  "Rose Gold",
  "Dark Blue",
];

/* ---------------- SCHEMA ---------------- */

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    description: { type: String, default: "" },
    category: { type: String, default: "Uncategorized", trim: true },
    sizes: { type: [String], default: [] },
    colors: { type: [String], enum: ALL_COLORS, default: [] },
    images: {
      type: Map,
      of: [String],
      default: {}, // e.g., { Red: ["url1","url2"], Blue: ["url3"] }
    },
  },
  { timestamps: true }
);

/* ---------------- MODEL ---------------- */

const Product =
  mongoose.models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
