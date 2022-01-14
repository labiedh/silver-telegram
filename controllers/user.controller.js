const UserModel= require("../models/user.model");
const ObjectID=require("mongoose").Types.ObjectId;

const getAllUsers=async(req,res)=>{
    const users =await UserModel.find().select('-password');
    res.status(200).json(users);
}

const userInfo=async(req,res)=>{
    
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknowm : '+ req.params.id)
    
    UserModel.findById(req.params.id,(err,docs)=>{
        if(!err) res.send(docs);
        else console.log('ID unknowm : '+ err)
    }).select('-password');

};

const updateUser=async(req,res)=>{
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknowm : '+ req.params.id)
    
    try{
        console.log(req.params.id)
        await UserModel.findOneAndUpdate(
            {_id : req.params.id },
            {
                $set : {
                        bio : req.body.bio
                }
            },
            {   
                new: true,
                upsert: true,
                setDefaultsOnInsert :true                 
            },
            (err,docs)=>{
                if(!err) return res.send(docs);
                console.log('ID unknowm 1 : '+ err)
                if(err) return res.status(500).send({message : err});
            }
        )
    }
    catch (err) {
        console.log('ID unknowm 2: '+ err)
       return res.status(500).json({message : err});
      } 
};

const deleteUser =async(req,res) =>{
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknowm : '+ req.params.id)
        try{
            await UserModel.findByIdAndRemove(
                {
                  _id :req.params.id
                }).exec();
            res.status(200).json({ message: "deleted successfully"})
        } 
        catch(err){
            return res.status(500).json({message : err});  
        } 
}

const follow =async(req,res)=>{
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
    return res.status(400).send('ID unknowm : '+ req.params.id)
    try{
        
        // ajouter à la liste des abonnés
        await UserModel.findByIdAndUpdate(
           
            req.params.id,
            {$addToSet: {following :req.body.idToFollow}},
            {new:true, upsert:true},
            (err,docs)=>{
                console.log("1 : "+ err)
                if(!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        )
        // add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            {$addToSet: {followers :req.params.id}},
            {new:true, upsert:true},
            (err,docs)=>{
                console.log("2 : "+ err)
            if (err) return res.status(400).json(err);
            }
        )

    } 
    catch(err){
        return res.status(500).json({message : err});  
    }
}

const unfollow =async(req,res)=>{
    console.log("2  ")
    console.log("req.params.id "+ ObjectID.isValid(req.params.id))
    console.log("req.body.idToUnFollow  "+ ObjectID.isValid(req.body.idToUnFollow))
    console.log("RES "+ (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnFollow))) 
   
    if (
        !ObjectID.isValid(req.params.id) ||
        !ObjectID.isValid(req.body.idToUnfollow)
      )
        return res.status(400).send("ID unknown : " + req.params.id);
    
      try {
        await UserModel.findByIdAndUpdate(
          req.params.id,
          { $pull: { following: req.body.idToUnfollow } },
          { new: true, upsert: true },
          (err, docs) => {
            if (!err) res.status(201).json(docs);
            else return res.status(400).jsos(err);
          }
        );
        // remove to following list
        await UserModel.findByIdAndUpdate(
          req.body.idToUnfollow,
          { $pull: { followers: req.params.id } },
          { new: true, upsert: true },
          (err, docs) => {
            // if (!err) res.status(201).json(docs);
            if (err) return res.status(400).jsos(err);
          }
        );
      } catch (err) {
        return res.status(500).json({ message: err });
      }
}


module.exports ={getAllUsers,userInfo,updateUser,deleteUser,follow,unfollow}