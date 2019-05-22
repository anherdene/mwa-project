const Joi = require('joi');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');
const Profile = require('../models/profile.model');
const ObjectId = require('mongodb').ObjectId;


module.exports = {
    getAllQuestions,
    deleteQuestion,
    deleteAnswer,
    getAllAnswers
};

async function getAllQuestions(userId) {
    const project = {_id: 1, title: 1, topic: 1, createdAt:1};

    let questionIds = await Profile.findOne({'user._id':new ObjectId(userId)}, {questions:1});

    let questions = [];
    let id = '';
    let question = null;
    for (let i = 0; i < questionIds.questions.length; i++) {
        id = questionIds.questions[i];
        question = await Question.findById(id, project);
        questions.push(question);
    }

    return questions;
}
async function getAllAnswers(userId) {

    const project = {_id:1,body:1,createdAt:1,downvote:1,isPublic:1,picture:1,upvote:1,username:1}
    let answerIds = await Profile.findOne({'user._id':new ObjectId(userId)},{answers:1});

    let answers = [];
    let id ='';
    let answer = null;
    for (let i= 0;i<answerIds.answers.length ;i++){
        id = answerIds.answers[i];
        answer = await Answer.findById(id,project);
        answers.push(answer);
    }
    return answers;
}
async function deleteQuestion(userId,questionId) {
    console.log(userId,questionId);
 let questionsIds = await Profile.findOne({'user._id':new ObjectId(userId)} );
console.log(questionsIds);

 for(let i =0 ; i<questionsIds.questions.length ; i++){
     if(questionId == questionsIds.questions[i]){
         await Question.findOneAndRemove({_id:questionId});

     }
     questionsIds.questions = questionsIds.questions.pull(questionId);
     await Profile(questionsIds).save();

 }

}
async function deleteAnswer(userId,answerId) {
    let answersIds = await  Profile.findOne({'user._id':new ObjectId(userId)});
    for(let i=0 ; i<answersIds.answers.length;i++){
        if(answerId == answersIds.answers[i]){
            await Answer.findOneAndRemove({_id:answerId});
        }
        answersIds.answers = answersIds.answers.pull(answerId);
        await Profile(answersIds).save();
    }

}

