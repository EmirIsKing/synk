import mongoose, { Document, Model } from 'mongoose';

export interface IRep {
  name: string;
  indexNumber: string;
  password: string;
  ipAddress?: string;
  programme?: string;
  group?: string;
  attendanceStatus: boolean;
}

export interface RepDocument extends IRep, Document {}

const repSchema = new mongoose.Schema<RepDocument>(
  {
    name: { type: String, required: true },
    indexNumber: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    ipAddress: { type: String },
    programme: { type: String },
    group: { type: String },
    attendanceStatus: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const RepModel: Model<RepDocument> =
  (mongoose.models.Rep as Model<RepDocument>) || mongoose.model<RepDocument>('Rep', repSchema);

export default RepModel;
//export type { RepDocument };
