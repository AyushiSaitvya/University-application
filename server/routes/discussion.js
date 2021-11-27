const path = require('path');
const express = require('express');
const Professor = require('../model/professors');
const Router = express.Router();

  Router.post(
    '/api/addProfessor',
    async (req, res) => {
      try {
        const { name, department,email } = req.body;
      
        const professor = new Professor({
           name,
           department,
           email
        });
        await professor.save();
        res.send('Professor added successfully.');
      } catch (error) {
        res.status(400).send('Error while adding professor. Try again later.');
      }
    },
    (error, req, res, next) => {
      if (error) {
        res.status(500).send(error.message);
      }
    }
  );
 
  Router.get('/api/getAllProfessors', async (req, res) => {
    try {
        const professors = await Professor.find({});
        res.send(professors);
      } catch (error) {
        res.status(400).send('Error while getting list of professors. Try again later.');
      }
  });

  


module.exports = Router;
