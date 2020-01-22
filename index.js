const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

server.use((req, res, next) => {
  countRequests++;
  console.count("Quantidade requisições");
  next();
});

function checkProjectExists(req, res, next){

  const { id } = req.params;
  const project = projects.filter(project => project.id === id);

  if(!project)
  {
    return res.status(400).json({ message: "Project does not exists."});
  }

  return next();
}

function requestValidation(req, res, next){
    const { title } = req.body;

    if(!title){
      return res.status(400).json({ message: "the title is required" });
    }

    return next();
}

server.post("/projects", requestValidation, (req, res) => {
  const { id, title} = req.body;
  
  const project = { 
    id,
    title,
    tasks:[]
  }
  projects.push(project);

  return res.json(projects);
})


server.get("/projects", (req, res) => {
  return res.json(projects);
})

server.get("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const project = projects.filter(project => project.id === id);

  return res.json(project);
})

server.put("/projects/:id", requestValidation, checkProjectExists, (req, res) => {
  const { id } = req.params;

  const { title } = req.body;

  const project = projects.filter(project => project.id === id);
  
  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(project=> project.id === id);

  projects.splice(index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", requestValidation, checkProjectExists,  (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const index = projects.findIndex(project=> project.id === id);
  projects[index].tasks.push(title);
  return res.json(projects[index]);
});


server.listen(3000);