const adminModel = require("../Model/AdminModel/adminModel")
const agentModel = require("../Model/AgentModel/Agent")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const cloudinary = require("../utilis/cloudinary");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


const default_url = "https://i.stack.imgur.com/l60Hf.png";

const createAgent = async (req, res) =>
{
    try
    {
        const { agentName, password, organizationCode,dlocation} = req.body
        const getAgentCode = await adminModel.findOne({ organizationCode })
        
        if (getAgentCode)
        {
            const getToken = crypto.randomBytes(2).toString("hex");
            const getOrganization = await adminModel.findById(getAgentCode._id)

           

            const Image = await cloudinary.uploader.upload(default_url)
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)

            const emailData = getOrganization.organizationName.split(" ")[0]
            const emailData1 = agentName.replace(/[" "]/g, "")

            if (getOrganization.organizationCode === organizationCode)
            {
                const newAgent = new agentModel({
                    agentName,
                    dlocation,
                    organizationName:getOrganization.organizationName,
                    email: `${emailData1}@${emailData}.com`,
                    password: hash,
                    verifiedToken: getOrganization.organizationCode,
                    avatar: Image.secure_url,
                    avatarID: Image.public_id,
                    agentCode: getToken,
                    organizationCode: getOrganization.organizationCode
                })

                newAgent.organizaton = getOrganization
                newAgent.save()

                getOrganization.agent.push(mongoose.Types.ObjectId(newAgent._id))
                getOrganization.save()

                res.status(200).json({ message: "You can now sign in", data: newAgent  })
            } else
            {
                res.status(400).json({message : "data filed are incorrect"})
            }

            
        } else
        {
            res.status(400).json({message :"Wrong Organization Code "})
        }
        
    } catch (error)
    {
        res.status(400).json({message: error.message})
    }
}



const LogInAgent = async (req, res) =>
{
    try
    {
        const { email, password } = req.body
        const user = await agentModel.findOne({ email })
        
        if (user)
        {
            const check = await bcrypt.compare(password, user.password);
            if (check)
            {
                const { password, ...info } = user._doc
                const token = jwt.sign(
                    {
                        _id: user._id,
                        verified: user.verified,
                        status: user.status
                    },
                    "ThisIsTheCode",
                    { expiresIn: "2d" }
                );

                res.status(200).json({
                    message: `welcome agent ${user.agentName}`,
                    data: {token, ...info}
                })
                
            } else
            {
                res.status(400).json({message:"password is not correct"})
            }
            
        } else
        {
            res.status(400).json({message:"agent is not found"})
        }
        
    } catch (error)
    {
        res.status(400).json({message :error.message})
    }
}

const getSingleAgent = async (req, res) =>
{
    try
    {
        const getOneAgrnt = await agentModel.findById(req.params.id)
        res.status(200).json({message:"one data", getOneAgrnt})
    } catch (error)
    {
        res.status(400).json({message: error.message})
    }
}

const deleteAgent = async (req, res) =>
{
    try
    {
        const adminUser = await adminModel.findById(req.params.id)
        const deleteAgent = await agentModel.findByIdAndRemove(req.params.agents)

        adminUser.agent.pull(deleteAgent)
        adminUser.save()

        res.status(201).json({
            message: "agent has been deleted",
            adminUser,
        })


        
        
    } catch (error)
    {
        res.status(400).json({message:error.message})
    }
}

module.exports ={
    createAgent,
    LogInAgent,
    getSingleAgent,
    deleteAgent
}