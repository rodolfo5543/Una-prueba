const Usuario=require('../MODELS/Usuario')
const bcryptjs=require('bcryptjs')
const {validationResult}=require('express-validator')
const jwt=require('jsonwebtoken');

exports.crearUsuario=async(req,res)=>{


    //REVISAR SI HAY ERRORES
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errores:errors.array()})
    }
    //extraer email y password
    const{email,password}=req.body;
    try {
        //Revisar que el usuario registrado sea unico 
        let usuario=await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({msg:'El usuario ya existe'});
        }
        

        //crea nuevo usuario
        usuario=new Usuario(req.body)

        //Hasear el password
        const salt =await bcryptjs.genSalt(10);
        usuario.password=await bcryptjs.hash(password,salt);

        //Guardar usuario
        await usuario.save();
        

        //Crear y firmar en JWT
        const payload={
            usuario:{
                id:usuario.id
            }
        };
        //Firmar el JWT
        jwt.sign(payload,process.env.SECRETA,{
            expiresIn:3600 //1 hora
        },(error,token )=>{
            if(error)throw error;
            
            //Mensaje de confirmacion
            res.json({token})
        })

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}
