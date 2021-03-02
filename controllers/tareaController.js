const Tarea=require('../models/Tarea');
const Proyecto=require('../models/Proyecto');
const {validationResult}=require('express-validator');
//Crea una nueva tarea
exports.crearTarea=async(req,res)=>{
    //Revisar si hay errores
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errores:errors.array()})
    }
    //Extraer el proyecto y comprobar si existe

    try {
        const {proyecto}=req.body
        const existeProyecto=await Proyecto.findById(proyecto)
        if(!existeProyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'})
        }
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString()!==req.usuario.id){
            return res.status(401).json({msg:'No autorizado'})
        }

        //Creamos la tarea
        const tarea=new Tarea(req.body);
        await tarea.save();
        res.json({tarea});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

//Obtiene las tareas por proyecto
exports.obtenerTareas=async(req,res)=>{
    try {
        //Extraemos el proyecto
        const {proyecto}=req.query
        const existeProyecto=await Proyecto.findById(proyecto)
        if(!existeProyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'})
        }
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString()!==req.usuario.id){
            return res.status(401).json({msg:'No autorizado'})
        }
        //Obtener las tareas por poryecto
        const tareas=await Tarea.find({proyecto}).sort({creado:-1})
        res.json({tareas})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }

}

//Actualizar una tarea
exports.actualizarTarea=async(req,res)=>{
    try {
        //Extraemos el proyecto
        const {proyecto, nombre, estado}=req.body

        //Revisar si la tarea existe o no
        let tareaExiste=await Tarea.findById(req.params.id);

        if(!tareaExiste){
            return res.status(404).json({msg:'No existe esa tarea'})
        }
        //extraer proyecto
        const existeProyecto=await Proyecto.findById(proyecto)

        if(existeProyecto.creador.toString()!=req.usuario.id){
            return res.status(401).json({msg:'No autorizado'})
        }

        //Crear un objeto con la nueva infomracion
        const nuevaTarea={};
        nuevaTarea.nombre=nombre;
        nuevaTarea.estado=estado;

        //Guardar la tarea
        tarea=await Tarea.findOneAndUpdate({_id:req.params.id},nuevaTarea,{new:true})
        res.json({tarea})
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}


//Elimina tarea
exports.eliminaTarea=async(req,res)=>{
    try {
        //Extraemos el proyecto
        const {proyecto}=req.query

        //Revisar si la tarea existe o no
        let tareaExiste=await Tarea.findById(req.params.id);

        if(!tareaExiste){
            return res.status(404).json({msg:'No existe esa tarea'})
        }
        //extraer proyecto
        const existeProyecto=await Proyecto.findById(proyecto)

        if(existeProyecto.creador.toString()!=req.usuario.id){
            return res.status(401).json({msg:'No autorizado'})
        }
        //Eliminar
        await Tarea.findOneAndRemove({_id:req.params.id})
        res.json({msg:'Tarea eliminada'})
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}