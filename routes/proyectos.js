const express=require('express');
const router=express.Router();
const proyectoController=require('../controllers/proyectoController')
const authController =require('../controllers/authController')
const auth=require('../middleware/auth');
const {check}=require('express-validator');

//Crea proyectos
//api/proyectos
router.post('/',
    auth,
    [
        check('nombre','El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
)
//Obtener todos los proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
)

//Actualizar proyectos via ID
router.put('/:id',
    auth,
    [
        check('nombre','El nombre de proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
)
//eLIMINAR UN PROYECTO
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
)
module.exports =router;