var express 		= require('express');
var router 			= express.Router();

var http            = require('http');
var request         = require('request');
var config          = require('../config/config');

var allQuestions = [];
var questions = [];
var questionsEnAttente = null;
var questionsEnvoyes = [];
var questionsTraites = [];


router.route('/')

	/*******************************
	Affichage de la question
	********************************/
	.get(function(req, res){
    res.render('../views/form.html');
	})


	/*******************************
	Récupération de la question lors du submit
	********************************/
	.post(function(req, res){

		var idQuestion = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        idQuestion += possible.charAt(Math.floor(Math.random() * possible.length));

			// il fauda verifier dans le tableau que l'idQuestion n est jamais utilisée

		var uneQuestion = {
			'idQuestion':idQuestion,
			'question':req.body.question,
			'answer' : null
		}
		allQuestions.push(uneQuestion);
		questions.push(uneQuestion);




/*
		//envoie de la question au systeme expert
		request.post(
		    'http://localhost:5000/systeme-expert/answer',
		    { json: { uneQuestion } },
		    function (error, response, body) {
					//si success = true, il y a une reponse sinon non
					console.log(response);
					if(response.body.success)
					{
						console.log(response.body.answer);
					}else{
						console.log('non reponse');
					}
		    }
		);
*/




		 res.redirect('http://localhost:7000/api/home/questionSent');

	});


	router.route('/questionSent')
		/*******************************
		Affichage de la page qui confirme que la question a été envoyé
		********************************/
		.get(function(req, res){
	    res.render('../views/questionSent.html');
		});



		router.route('/listQuestions')
			/*******************************
			Affichage de la liste des questions
			********************************/

			.get(function(req, res){


		    res.render('../views/listQuestions.html', {data: allQuestions});
			});





	router.route('/getAnswer/:id')
		/*******************************
		Récupérer une question
		********************************/
		.get(function(req, res){

			var idQuestion = req.params.id;
			var questionExiste = false;

			var infos = {
				answer : null
			};

			//on check dans le tableau des question répondues si il y a la question avec cet id
			for(var i=0; i<questionsTraites.length;i++)
			{
				console.log(questionsTraites[i]);
				if(idQuestion == questionsTraites[i].idQuestion)
				{
						questionExiste = true;
						infos.answer = questionsTraites[i].answer;
				}
			}
			// si la question existe mais que le si n'a pas su répondre
			if(questionExiste)
			{
				if(infos.answer == null)
				{
					infos.answer = "Nous n'avons pas pu répondre à votre question";
					res.render('../views/answerQuestion.html', {data: infos.answer});
				}else{
					res.render('../views/answerQuestion.html', {data: infos.answer});
				}
			}


			//si la question n'existe pas
			if(!questionExiste){

				//on check si l id n a pas ete truque
				var questionPosee = false;
				for(var j =0; j<allQuestions.length;j++)
				{
					if(idQuestion == allQuestions[j].idQuestion)
					{
						questionPosee = true;
					}
				}

				if(questionPosee){
					infos.answer = "La réponse à cette question n'est pas disponible.";
					res.render('../views/answerQuestion.html', {data: infos.answer});

				}else{
					res.redirect('http://localhost:7000/api/home/listQuestions');
				}

			}



		});







		//est récupéré toutes les 15secondes par le systeme expert
		router.route('/getQuestionSI')

			.get(function(req, res){

				//on met la premier equestion en attente, si on peut en ajouter une on l envoi sinon  on renvoi qu'il n'y en a plus
				if(questions.length>0)
				{
						questionsEnAttente = questions[0];
						questions.shift();

						res.send({success:true, question:questionsEnAttente});
						questionsEnvoyes.push(questionsEnAttente);
						questionsEnAttente = null;
				}else{
					res.send({success:false});
				}

			});



	router.route('/addAnswer')
		/*******************************
		Récupération d'une reponse du systeme expert
		********************************/
		.post(function(req, res){

			console.log(req.body);

			questionsTraites.push(req.body.infosQuestion.question);

			res.send({success:true});



		});



module.exports = router;
