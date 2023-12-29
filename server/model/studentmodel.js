const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name:String,
  rollno:String,
  leave:Number,
  half:Number,
  full:Number
});
const attendanceSchema = new mongoose.Schema({
    student_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', 
        required: true,
    },
    status:Number,
    month:Number,
    date:Number,
    year:Number
});



const studentModel = mongoose.model('student', studentSchema);
const attendanceModel = mongoose.model('attendance', attendanceSchema);



module.exports = {studentModel,attendanceModel}
