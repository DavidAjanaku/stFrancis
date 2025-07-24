import mongoose from 'mongoose';

const heroContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Your Donations Keep The',
  },
  titleHighlight: {
    type: String,
    required: true,
    default: 'Candles Lit',
  },
  paragraph1: {
    type: String,
    required: true,
    default: 'The Parish appreciates our donors for your many support in cash or kind.',
  },
  paragraph2: {
    type: String,
    required: true,
    default: 'With these contributions, we keep the activities of the parish going.',
  },
  paragraph3: {
    type: String,
    required: true,
    default: 'May the Lord bless your silent contributions, answer your private intentions, and meet',
  },
  paragraph4: {
    type: String,
    required: true,
    default: 'you at every point of your need. Amen!',
  },
  buttonText: {
    type: String,
    required: true,
    default: 'DONATE TO A CAUSE BELOW',
  },
}, {
  timestamps: true,
  minimize: false,
  versionKey: false,
});

heroContentSchema.statics.getHeroContent = async function () {
  let heroContent = await this.findOne();
  if (!heroContent) {
    heroContent = await this.create({});
  }
  return heroContent;
};

export default mongoose.model('HeroContent', heroContentSchema);