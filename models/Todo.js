const mongoose = require('mongoose');
const slugify = require('slugify');

const TodoSchema = new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required:[true, 'Please add a title']
    },
    slug: { type: String},
    content:{
        type: String,
        trim: true,
        required:[true, 'Please add a content']
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    isActive:{
        type: Boolean,
        default: false
    },
    createAt:{
        type: Date,
        default: Date.now
    }
});

//create todo slug from the name
TodoSchema.pre('save', function(next){
    console.log('Slugify ran', this.title);
    this.slug = slugify(this.title, {lower: true});
    next();
  });

module.exports = mongoose.model('Todo', TodoSchema);