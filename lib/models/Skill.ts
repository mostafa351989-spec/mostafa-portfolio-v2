import mongoose from 'mongoose';
const SkillSchema = new mongoose.Schema({ name: String });
export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
