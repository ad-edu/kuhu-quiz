(function () {

    var app = angular.module('myQuiz', []);

    app.controller('QuizController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

        $scope.quizes = null;

        $http.get('quizes.json').then(function (testData) {
            $scope.quizes = testData.data;
        });

        $scope.selectQuiz = function (selectedQuiz) {

            $scope.score = 0;
            $scope.activeQuestion = -1;
            $scope.sectionIndex = 0;
            $scope.percentage = 0;
            $scope.quizTitle = '';
            $scope.quizStartStatus = false;

            $scope.currentMCQQuestion = 0;
            $scope.currentOneWordQuestion = 0;
            $scope.currentFillBlankQuestion = 0;

            $scope.totalMCQQuestions = 0;
            $scope.totalOneWordQuestions = 0;
            $scope.totalFillBlankQuestions = 0;
            $scope.totalQuestions = 0;
            $scope.totalAttemptedQuestions = 0;

            $http.get(selectedQuiz).then(function (quizData) {
                $scope.sections = quizData.data.sections;
                $scope.quizTitle = quizData.data.quizTitle;
                $scope.mcqQuestions = quizData.data.mcqQuestions;
                $scope.oneWordQuestions = quizData.data.oneWordQuestions;
                $scope.fillBlankQuestions = quizData.data.fillBlankQuestions;

                if ($scope.mcqQuestions != undefined) {
                    $scope.totalMCQQuestions = $scope.mcqQuestions.length;
                    $scope.totalQuestions = $scope.totalQuestions + $scope.totalMCQQuestions;
                }

                if ($scope.oneWordQuestions != undefined) {
                    $scope.totalOneWordQuestions = $scope.oneWordQuestions.length;
                    $scope.totalQuestions = $scope.totalQuestions + $scope.totalOneWordQuestions;
                }

                if ($scope.fillBlankQuestions != undefined) {
                    $scope.totalFillBlankQuestions = $scope.fillBlankQuestions.length;
                    $scope.totalQuestions = $scope.totalQuestions + $scope.totalFillBlankQuestions;
                    $scope.fillBlankQuestions.forEach(function splitQuestion(value, index, array) {
                        const myArr = value.question.split("[]");
                        $scope.fillBlankQuestions[index].questionPart1 = myArr[0];
                        $scope.fillBlankQuestions[index].questionPart2 = myArr[1];
                    });
                }

            });

        }

        $scope.startTest = function () {
            $scope.activeQuestion = 0;
            $scope.quizStartStatus = true;
        }

        $scope.selectMCQAnswer = function (qIndex, aIndex) {
            var questionState = $scope.mcqQuestions[qIndex].questionState;

            if (questionState != 'answered') {
                $scope.mcqQuestions[qIndex].selectedAnswer = aIndex;
                var correctAnswer = $scope.mcqQuestions[qIndex].correct;
                $scope.mcqQuestions[qIndex].correctAnswer = correctAnswer;

                if (aIndex === correctAnswer) {
                    $scope.mcqQuestions[qIndex].correctness = 'correct';
                    $scope.score += 1;
                }
                else {
                    $scope.mcqQuestions[qIndex].correctness = 'incorrect';
                }
                $scope.mcqQuestions[qIndex].questionState = 'answered';
            }
            $scope.currentMCQQuestion = $scope.currentMCQQuestion + 1;
            $scope.percentage = (($scope.score / $scope.totalQuestions) * 100).toFixed(1);
        }

        $scope.isMCQSelected = function (qIndex, aIndex) {
            return $scope.mcqQuestions[qIndex].selectedAnswer === aIndex;
        }

        $scope.isMCQCorrect = function (qIndex, aIndex) {
            return $scope.mcqQuestions[qIndex].correctAnswer === aIndex;
        }

        $scope.selectMCQContinue = function () {

            if ($scope.totalMCQQuestions === $scope.currentMCQQuestion) {
                $scope.sectionIndex += 1;
                $scope.activeQuestion = -1;
            }
            $scope.totalAttemptedQuestions += 1;
            return $scope.activeQuestion += 1;
        }

        $scope.selectOneWordAnswer = function (qIndex, answer) {
            var questionState = $scope.oneWordQuestions[qIndex].questionState;

            if (questionState != 'answered') {
                $scope.oneWordQuestions[qIndex].selectedAnswer = answer;

                var correctAnswer = $scope.oneWordQuestions[qIndex].answer;
                $scope.oneWordQuestions[qIndex].correctAnswer = correctAnswer;

                const possibleAnswers = angular.lowercase(correctAnswer).split("|");

                console.log(possibleAnswers);
                console.log(angular.lowercase(answer));

                if (possibleAnswers.includes(angular.lowercase(answer))) {
                    $scope.oneWordQuestions[qIndex].correctness = 'correct';
                    $scope.score += 1;
                }
                else {
                    $scope.oneWordQuestions[qIndex].correctness = 'incorrect';
                }
                $scope.oneWordQuestions[qIndex].questionState = 'answered';
            }
            $scope.currentOneWordQuestion = $scope.currentOneWordQuestion + 1;
            $scope.percentage = (($scope.score / $scope.totalQuestions) * 100).toFixed(1);
        }

        $scope.selectOneWordContinue = function () {

            if ($scope.totalOneWordQuestions === $scope.currentOneWordQuestion) {
                $scope.sectionIndex += 1;
                $scope.activeQuestion = -1;
            }
            $scope.totalAttemptedQuestions += 1;
            return $scope.activeQuestion += 1;
        }

        $scope.selectFillBlankAnswer = function (qIndex, answer) {
            var questionState = $scope.fillBlankQuestions[qIndex].questionState;

            if (questionState != 'answered') {
                $scope.fillBlankQuestions[qIndex].selectedAnswer = answer;

                var correctAnswer = $scope.fillBlankQuestions[qIndex].answer;
                $scope.fillBlankQuestions[qIndex].correctAnswer = correctAnswer;

                const possibleAnswers = angular.lowercase(correctAnswer).split("|");
                
                if (possibleAnswers.includes(angular.lowercase(answer))) {

                    $scope.fillBlankQuestions[qIndex].correctness = 'correct';
                    $scope.score += 1;
                }
                else {
                    $scope.fillBlankQuestions[qIndex].correctness = 'incorrect';
                }
                $scope.fillBlankQuestions[qIndex].questionState = 'answered';
            }
            $scope.currentFillBlankQuestion = $scope.currentFillBlankQuestion + 1;
            $scope.percentage = (($scope.score / $scope.totalQuestions) * 100).toFixed(1);
        }

        $scope.selectfillBlankContinue = function () {
            if ($scope.totalFillBlankQuestions === $scope.currentFillBlankQuestion) {
                $scope.sectionIndex += 1;
                $scope.activeQuestion = -1;
            }
            $scope.totalAttemptedQuestions += 1;
            return $scope.activeQuestion += 1;
        }

    }]);
})();