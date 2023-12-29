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
    rollno,
    leave:0,
    half:0,full:0
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
  if(mark==1){
     updateu= ({
       $inc: { leave: 1 } 
    })
  }else if(mark==2){
     updateu= ({ $inc: { half: 1 } })
  }else{
     updateu= ({ $inc: { full: 1 } })
  }
  await studentModel.updateOne({ _id }, updateu);

  res.json({ message: 'Success' });

});

app.post('/data',async (req, res) => {
  const { currentyear,currentMonth} = req.body;

  const userData = await studentModel.aggregate([
    {
      $lookup: {
        from: "attendances",
        let: { studentId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$student_id", "$$studentId"] },
                  {
                    $or: [
                      { $eq: ["$year", currentyear] },
                      { $eq: ["$month", currentMonth] }
                    ]
                  }
                ]
              }
            }
          }
        ],
        as: "attendances"
      }
    },
    {
      $addFields: {
        attendances: {
          $ifNull: ["$attendances", []]
        }
      }
    }
  ]);
console.log(userData);
  res.json({ message: 'Data from Express',userData });
});



app.get('/list', async (req, res) => {
  try {
    const userData = await studentModel.find();
    res.json({ message: 'Success', userData });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
