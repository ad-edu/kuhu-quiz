(function () {

    var app = angular.module('myQuiz', []);

    app.controller('QuizController', ['$scope', '$http', '$sce', '$timeout', function ($scope, $http, $sce, $timeout) {

        $scope.quizes = null;

        $http.get('qbank/quizes.json').then(function (testData) {
            $scope.quizes = testData.data;
        });

        $scope.selectQuiz = function (selectedQuiz) {
            $scope.counter = 0;
            $scope.timeLeft = '';
            $scope.score = 0;
            $scope.activeQuestion = -1;
            $scope.sectionIndex = 0;
            $scope.percentage = 0;
            $scope.quizTitle = '';
            $scope.quizTime = 10;
            $scope.quizStartStatus = false;
            $scope.quizTimeExpired = false;

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
                $scope.quizTime = quizData.data.quizTime;
                if ($scope.quizTime != undefined) {
                    $scope.counter = $scope.quizTime * 60;
                    $scope.minutes = Math.floor($scope.counter / 60);
                    $scope.seconds = (($scope.counter % 60));
                    $scope.timeLeft ='['+ $scope.minutes + ':' + $scope.seconds+']';
                }


                $scope.mcqQuestions = quizData.data.mcqQuestions;
                $scope.oneWordQuestions = quizData.data.oneWordQuestions;
                $scope.fillBlankQuestions = quizData.data.fillBlankQuestions;

                if ($scope.mcqQuestions != undefined && $scope.sections.includes("mcqQuestions")) {
                    $scope.totalMCQQuestions = $scope.mcqQuestions.length;
                    $scope.totalQuestions = $scope.totalQuestions + $scope.totalMCQQuestions;
                }

                if ($scope.oneWordQuestions != undefined && $scope.sections.includes("oneWordQuestions")) {
                    $scope.totalOneWordQuestions = $scope.oneWordQuestions.length;
                    $scope.totalQuestions = $scope.totalQuestions + $scope.totalOneWordQuestions;
                }

                if ($scope.fillBlankQuestions != undefined && $scope.sections.includes("fillBlankQuestions")) {
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

            if (!$scope.quizStartStatus && $scope.counter >0 ) {

                $scope.countdown();
            }
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


        $scope.countdown = function () {
            stopped = $timeout(function () {
                $scope.minutes = Math.floor($scope.counter / 60);
                $scope.seconds = (($scope.counter % 60));
                $scope.timeLeft ='['+ $scope.minutes + ':' + $scope.seconds+']';
                $scope.counter--;
                $scope.countdown();
            }, 1000);
            if ($scope.counter <= -1) {
                $timeout.cancel(stopped);
                $scope.quizTimeExpired = true;
            }
        };

    }]);
})();