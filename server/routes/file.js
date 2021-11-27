const path = require('path');
const express = require('express');
const multer = require('multer');
const File = require('../model/file');
const Router = express.Router();
const Professor = require('../model/professors');
const Assignment=require('../model/assignments');
const Solution=require('../model/solutions');
const app = express();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './files');
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 1000000 // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
        )
      );
    }
    cb(undefined, true); // continue with upload
  }
});

Router.post(
  '/api/upload',
  upload.single('file'),
  async (req, res) => {
    try {
      const { title,code } = req.body;
      const { path, mimetype } = req.file;
      const assi = await Assignment.findOne({code:code}).exec();
      if(assi!==null)
     {
          let assign = assi.assignment.find(o => o.title === title);
          console.log(assign);
          if(!assign)
          {
            assi.assignment.push({
              title,
              file_path: path,
              file_mimetype: mimetype
              
          });
            
          }
          else
          {
            assign.file_mimetype=mimetype,
            assign.file_path=path
          }
          
      await assi.save();
    }
    else
    {
      const assignment=new Assignment({
             code,
             assignment:{
              title,
              file_path: path,
              file_mimetype: mimetype
            }
      })
      await assignment.save();
    }

      res.send('file uploaded successfully.');
    } catch (error) {
      res.status(400).send('Error while uploading file. Try again later.');
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
);

Router.post(
  '/api/uploadSolution',
  upload.single('file'),
  async (req, res) => {
    try {
      const {regCode,assiCode } = req.body;
      const { path, mimetype } = req.file;
      var regexp = new RegExp(assiCode);
      const soln = await Solution.find({ assiCode: { $regex:regexp } });
     
   
      if(soln.length)
     {
      soln.forEach(async function(sol) {
       
        let so = sol.solution.find(o => o.regCode === regCode);

        if(!so)
        {
        sol.solution.push({
              regCode,
              file_path: path,
              file_mimetype: mimetype
              
          });
        }
        else{
       
          so.file_mimetype=mimetype;
          so.file_path=path
        }
      await sol.save();
      });
    }
    else
    {
      const solution=new Solution({
             assiCode,
             solution:{
              regCode,
              file_path: path,
              file_mimetype: mimetype
            }
      })
      await solution.save();
    }

      res.send('file uploaded successfully.');
    } catch (error) {
      res.status(400).send('Error while uploading file. Try again later.');
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
);


Router.get('/api/getAllFiles', async (req, res) => {
  try {
    const files = await File.find({});
    const sortedByCreationDate = files.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.send(sortedByCreationDate);
  } catch (error) {
    res.status(400).send('Error while getting list of files. Try again later.');
  }
});

Router.get(`/api/download/:assiCode/:regCode`, async (req, res) => {
  try {
     
    const assiCode=req.params.assiCode;
    const regCode=req.params.regCode;
    console.log(assiCode+regCode);

    const soln = await Solution.findOne({assiCode});
    const file=soln.solution.find(obj=>obj.regCode==regCode);
   
    res.set({
      'Content-Type': file.file_mimetype
    });
    res.sendFile(path.join(__dirname, '..', file.file_path));
  } catch (error) {
    res.status(400).send('Error while downloading file. Try again later.');
  }
});

Router.get(`/api/downloadAssignment/:code/:assiId`, async (req, res) => {
  try {
    const assignments = await Assignment.findOne({code:req.params.code});
    console.log(assignments.assignment);
    const file=assignments.assignment.find(obj=>obj._id==req.params.assiId);
    res.set({
      'Content-Type': file.file_mimetype
    });
    res.sendFile(path.join(__dirname, '..', file.file_path));
  } catch (error) {
    res.status(400).send('Error while downloading file. Try again later.');
  }
});

Router.get(`/api/viewSubmissions/:id`, async (req, res) => {
  try {
    const soln = await Solution.findOne({assiCode:req.params.id});
    var solutionsMap=[];

    if(soln)
    {
      soln.solution.forEach(function(soln) {
      solutionsMap.push(soln)
        
    });
   }
    const sortedByRegNo = solutionsMap.sort(
      (a, b) => b.regCode - a.regCode
    );
    res.send(sortedByRegNo);
  } catch (error) {
    res.status(400).send('Error while downloading file. Try again later.');
  }
});

Router.get(`/api/getAllAssignments/:id`, async (req, res) => {
  try {
    var regexp = new RegExp(req.params.id);
    const assignments = await Assignment.find({ code: { $regex:regexp } });
    var assignmentList=[];
   

    assignments.forEach(function(assign) {
      assign.assignment.forEach(function(assi){
        assignmentList.push({
                _id:assi._id,
                year:assign.code.substr(0,4),
                course:assign.code.substr(4,2),
                branch:assign.code.substr(6,3),
                submissionDate:new Date(assign.createdAt.getTime()+1000*86400*7).toISOString().substring(0, 10),
                title:assi.title,
                file_path:assi.file_path,
                file_mimetype:assi.file_mimetype
        });
        
      })
    });
    res.send(assignmentList);
  } catch (error) {
    res.status(400).send('Error while downloading file. Try again later.');
  }
});

Router.delete(`/api/deleteAssignment/:code/:id`, async (req, res) => {
  
  try {
    Assignment.findOneAndUpdate({code: req.params.code}, {$pull: {assignment: {_id: req.params.id}}}, function(err, data){
     
    });

    try {
          const solution = await Solution.findOne({assiCode:req.params.id});
          if(solution)
              solution.deleteOne();
      } catch (error) {
        res.status(400).send('Error while deleting solutions. Try again later.');
      }
    res.status(200).send('Successful');
      return;

  } catch (error) {
    res.status(400).send('Error while deleting assignment. Try again later.');
    return;

  }

});

Router.delete(`/api/deleteSolution/:assiCode/:id`, async (req, res) => {
  
  try {
     Solution.findOneAndUpdate({assiCode: req.params.assiCode}, {$pull: {solution: {_id: req.params.id}}}, function(err, data){
     
    });
    res.status(200).send('Successful');
      return;

  } catch (error) {
    res.status(400).send('Error while deleting assignment. Try again later.');
    return;

  }

});




module.exports = Router;
