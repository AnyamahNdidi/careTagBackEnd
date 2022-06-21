const adminModel = require("../Model/AdminModel/adminModel")
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {validateUsers } = require("../utilis/validate")
const cloudinary = require("../utilis/cloudinary");
const { info } = require("console");

const transport = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "anyamahedwin@gmail.com",
		pass: "jzntihynbiivuleo",
	},
});

const default_url = "https://i.stack.imgur.com/l60Hf.png";


const Register = async (req, res) => {
  const {
      fullName, organizationName,organizationCode,location,email,password, phoneNumber,
      avatar,
      avatarID,
      verifiedToken,
      verified,
      status,
      agent
    } = req.body
    try{
        // const {error} = validateUsers(req.body)
        // if(error){
        //     return res.status(409).json({
        //         status:"failed to validate user",
        //         message:error.details[0].message
        //     })
        // }

        const checkEmail = await adminModel.findOne({email :req.body.email})
        if(checkEmail){
            return res.status(401).json({message : "email already register"})
        }

        const Image = await cloudinary.uploader.upload(default_url)
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const getToken = crypto.randomBytes(10).toString("hex");
		const token = jwt.sign({ getToken }, "ThisIsTheCode");

        const code = `organizationCode: ${token} ${getToken}`;

        const creatUser = await adminModel.create({
            fullName,
            organizationCode:code,
            organizationName,
            avatar: Image.secure_url,
            avatarID: Image.public_id,
            email,
            password:hash,
            verifiedToken:token,
            
        })

        const mailOptions = {
            from :"noreply@careTag.com",
            to:email,
            subject:"Account Verification",
            html: `
            <h3>
                This mail, is for account verification... Please use the <a
                href="http://localhost:3000/api/admin/${creatUser._id}/${token}"
                >Link to Finish</a> up your account creation 
            </h3>
            `,
        };

        transport.sendMail(mailOptions, (err, info)=>{
            if(err){
                console.log(err.message)
            }else{
               console.log(`message sent to your mail ${info.response}`)
            }
           
        })
        res.status(200).json({message :"please check your mail to continue"})

    }catch(error){
        res.status(400).json({message: error.message})
    }
}


const verifiedOrganization = async (req, res) =>{
 try{
     const user = await adminModel.findById(req.params.id);

     if(user.verifiedToken !== ""){
         await adminModel.findByIdAndUpdate(
             user._id,
             {
                verifiedToken:"",
                verified:true,
                code: user.organizationCode.split(" ")[2]
             },
             {new: true}
         )

     }
     res.status(200).json({
         message :"Account has been verifield , proceed to Sign In"
     })


 }catch(error){
    res.status(400).json({message : error.message})
 }
}


const SignIn = async (req, res)=>{

    try{
        const {email, password} = req.body
        const user = await adminModel.findOne({email})
    
        if(user){
            const checkUser = await bcrypt.compare(password, user.password)

            if(checkUser){
                if(user.verified && user.verifiedToken === ""){

                    const {password, ...info}  = user._doc

                    const token = jwt.sign(
                        {
                            _id:user._id,
                            verified:user.verified,
                            status:user.status
                        },
                        "ThisIsTheCode",
                        {expiresIn :"2d"}
                    )
                    res.status(200).json({
						message: `Welcome back ${user.fullName}`,
						data: { token, ...info },
					});


                }else{
                    const getToken = crypto.randomBytes(10).toString("hex")
                    const token = jwt.sign({getToken}, "ThisIsTheCode")

                    const code = `schoolCode: ${token} ${getToken}`;

                    const mailOptions = {
						from: "ajmarketplace52@gamil.com",
						to: email,
						subject: "Account re-Verification",
						html: `
                        <h3>
                      This mail, is for account verification... Please use the <a
                       href="http://localhost:2001/api/admin/${user._id}/${
							code.split(" ")[-1]
						}"
                        >Link to Finish</a> up your account creation 
                     </h3>
                             `,
					};

                    transport.sendMail(mailOptions, (err, info)=>{
                        if(err){
                            console.log(err.message)
                        }else{
                            console.log(`message sent to your mail ${info.response}`);
                        }
                    })
                    res.status(200).json({
                        message :"please go to your mail to verify your account"
                    })
                }

            }else{
                res.status(400).json({message :"wrong password"})
            }
    
        }else{
            res.status(400).json({message :"user is not register"})
        }

    }catch(error){
        res.status(400).json({message: error.message})
    }
  


    
}

module.exports ={
    Register,
    verifiedOrganization,
    SignIn
}