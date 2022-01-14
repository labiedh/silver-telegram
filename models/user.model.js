let mongoose = require('mongoose');
let {isEmail}=require('validator');
let bcrypt=require('bcrypt');
let userSchema =new mongoose.Schema(
    {
        pseudo :{
            type:String,
            required:true,
            minlength:3,
            maxlength:55,
            unique:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique: true,
            lowercase: true,
            trim:true,
            validate: [isEmail]
        },
        password:{
            type:String,
            required:true,
            max:1024,
            minlength:6
        },
        picture:{
            type:String,
            default:"./uploads/profil/random-user.png"
        },
        bio:{
            type:String,
             max:1024,
            },
        followers:{
            type:[String]
        },
        following:{
            type:[String]
        },
        likes:{
            type:[String]
        }    
    },
    {
        timestamps:true
    }

)
// play function before save into display: 'block',
userSchema.pre("save",async function(next){
    const salt =await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
    next();
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email')
  };

  
module.exports = mongoose.model('user', userSchema)