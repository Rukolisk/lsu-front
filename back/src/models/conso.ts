import { Schema, model, Document } from 'mongoose';

export interface Iconso extends Document {
  produit: string;
  sucre: number;
  cafeine: number;
  calories: number;
  temps?: Date;
  lieu?: string;
  notes?: string;
  barcode?: string;
  user: Schema.Types.ObjectId;
}

const ConsoSchema = new Schema<Iconso>({
  produit: { type: String, required: true },
  sucre: { type: Number, required: true },
  cafeine: { type: Number, required: true },
  calories: { type: Number, required: true },
  barcode: { type: String },
  lieu: { type: String },
  notes: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'users', required: true }
}, { timestamps: true });

ConsoSchema.index({ barcode: 1, createdAt: -1 });
ConsoSchema.index({ user: 1, createdAt: -1 });
ConsoSchema.index({ createdAt: -1 });
ConsoSchema.index({ produit: 1 });

export default model<Iconso>('conso', ConsoSchema);
