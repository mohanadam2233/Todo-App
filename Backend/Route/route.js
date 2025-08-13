import express from 'express';
import Todo from "../models/Todomodels.js";

const router = express.Router();
//get all todos
router.get('/',async (req, res) => {
    try {
        const Todos= await Todo.find();
        res.status(200).json(Todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos' });
    }

})

//add a new todo
router.post("/",async (req, res) => {
  const todo= new Todo({
    text : req.body.text,
  })
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: 'Error creating todo' });
    
  }
})

//update a todo
router.patch("/:id",async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id)
    if (!todo)
    return res.status(404).json({ message: 'Todo not found' });
    
    if (req.body.text !==undefined) 
      todo.text = req.body.text;

    if (req.body.completed !==undefined) 
     todo.completed = req.body.completed;
    
    const updatedTodo = await todo.save();
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: 'Error updating todo' });
    
  }
})


//delete a todo
router.delete("/:id",async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo)
      return res.status(404).json({ message: 'Todo not found' });
    
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo' });
  }
})

export default router;