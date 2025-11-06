import { pool } from '../helper/db.js'
import { Router } from 'express'
import { auth } from '../helper/auth.js'
import { getTasks } from '../controllers/TaskController.js'

const router = Router()
//const port = process.env.PORT  //EN TIEDÄ TARVIIKO

router.get('/', getTasks)

/*router.get('/', (req, res, next) => {          //VANHA, KORVATTU getTasks:lla
 pool.query('SELECT * FROM task', (err, result) => {
 if (err) {
 return next(err)
 }
 res.status(200).json(result.rows || [])
 })
})*/

/*
router.listen(port, () => {
 console.log(`Server is running on http://localhost:${port}`)
})
 */

router.post('/create', auth,(req, res, next) => {
 const { task } = req.body

    if (!task) {
 return res.status(400).json({error: 'Task is required'})
 }

 pool.query('insert into task (description) values ($1) returning *', [task.description],
    (err, result) => {
    if (err) {
 return next (err)
 }

 res.status(201).json({id: result.rows[0].id, description: task.description})
 })

})

router.delete('/delete/:id', auth,(req, res, next) => {
 const { id } = req.params

 console.log(`Deleting task with id: ${id}`)
 pool.query('delete from task WHERE id = $1',
 [id], (err, result) => {
 if (err) {
 return next(err)
 }

 if (result.rowCount === 0) {
 return res.status(404).json({error: 'Task not found'})
 }
 
 return res.status(200).json({id:id})
 })
})

export default router