import mongoose from 'mongoose';
const ProjectSchema = new mongoose.Schema({ title: String, category: String, tags: [String], link: String });
export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
