const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const { studentModel,attendanceModel } = require("./model/studentmodel");

const port = process.env.PORT || 5000;

mongoose.connect('mongodb://127.0.0.1:27017/codemeattendance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.post('/addstudent', async (req, res) => {
  const { name, rollno } = req.body;
  const student = new studentModel({
    name,
    rollno
  });
  await student.save();
  res.json({ message: 'Data from Express' });
});

app.post('/markattendance', async (req, res) => {
  const { _id} = req.body.selecteduser;
  const { mark,currentMonth,date,year} = req.body;
  const attendance = new attendanceModel({
    student_id:_id,
    status:mark,
    month:currentMonth,
    date,
    year
  });
  await attendance.save();
  res.json({ message: 'Success' });

});

app.post('/data',async (req, res) => {
  // const userData = await studentModel.find();
  const { currentyear,currentMonth} = req.body;
  const userData = await studentModel.aggregate([
    {
      $lookup: {
        from: "attendances",
        localField: "_id",
        foreignField: "student_id",
        as: "attendances"
      }
    }
    // {
    //   $match: {
    //     $or: [
    //       { "studentdata.year": currentyear },
    //       { "studentdata.month": currentMonth },
          
    //     ]
    //   }
    // }
    
  ]);
console.log(userData);
  res.json({ message: 'Data from Express',userData });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
