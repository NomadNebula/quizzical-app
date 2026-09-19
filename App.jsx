import { useState, useEffect } from "react"
import StartScreen  from "./StartScreen"
import QuizScreen from "./QuizScreen"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { decode } from "html-entities"
import { clsx } from "clsx"


export default function App() {
    
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizChecked, setIsQuizChecked] = useState(false); 
  const [triviaQuestions, setTriviaQuestions] = useState([]);
  const [quizKey, setQuizKey] = useState(0); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]= useState(null); 
  
   

  
  function handleStartGame() {
    setIsQuizStarted(true); 
  };
  
  function handleIsQuizChecked() {
    setIsQuizChecked(true); 
  }; 
  
  function handlePlayAgain() {
    setIsQuizChecked(false)
    setQuizKey(prevKey => prevKey + 1)
  }; 
  
  function handleGame() {
    if(isQuizStarted && isLoading) {
     return <FontAwesomeIcon icon={faSpinner} spinPulse size="2xl" />
    } else if (isQuizStarted) {
      return <QuizScreen 
           questions={questionElements}
           onCheck={handleIsQuizChecked}
           onPlayAgain={handlePlayAgain}
           score={score} 
           isQuizChecked={isQuizChecked} />
    } else {
      return <StartScreen onStart={handleStartGame} />
    }
  }
  
  
     function fetchQuestions() {
       setIsLoading(true) 
       fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        .then(res => res.json())
        .then(data => {   
            const decodedQuestions = data.results.map(question => {
            const combinedAnswers = [...question.incorrect_answers, question.correct_answer]
            const shuffled = combinedAnswers.sort(() => Math.random() - 0.5)
              
              return {
                ...question, 
                      question: decode(question.question),
                    correct_answer: decode(question.correct_answer), 
                  shuffledAnswers: shuffled.map(answer => decode(answer)), 
                selectedAnswer: null, 
              }
            })
            setTriviaQuestions(decodedQuestions)
            setIsLoading(false)
        })
            .catch(err => {
            setError(err.message)
            setIsLoading(false)
        }) 
  } 
     useEffect(() => {
    if (isQuizStarted) {
      fetchQuestions()
    }
    }, [isQuizStarted, quizKey])  
     
    
    
  function handleSelectAnswer(questionIndex, chosenAnswer) { 
    setTriviaQuestions(prevQuestions => 
    prevQuestions.map((q, index) => 
       index === questionIndex ? {...q, selectedAnswer: chosenAnswer} : q
        )    
    )
  }  
  
  
  const questionElements = triviaQuestions.map((question, qIndex) => {
           
  const answerElements = question.shuffledAnswers.map((answer, aIndex) => {
    
  const isSelected = question.selectedAnswer === answer;  
  const isCorrectAnswer = answer === question.correct_answer;
  const isWrongAnswer =  isSelected && answer !== question.correct_answer; 
  const isCorrectAndChecked = isCorrectAnswer && isQuizChecked; 
  const isNotSelectedAndIncorrect = !isSelected && !isCorrectAnswer;
  


   return (
      <button 
         className={clsx("trivia-btn", {
           selected: isSelected, 
             correct: isCorrectAndChecked, 
               incorrect: isWrongAnswer && isQuizChecked,
                  inValid: isNotSelectedAndIncorrect && isQuizChecked
             })}
                  key={aIndex}
                disabled={isQuizChecked}
              onClick={() => handleSelectAnswer(qIndex, answer)}>
          {answer}
      </button>
    )
  })

    return (
        <main key={qIndex}> 
          <section>
              {question.question}
          </section>
         
          <section>
              {answerElements}
          </section>
           <hr/>
        </main>
    
       
    )
})

const score = triviaQuestions.filter(question => question.correct_answer === question.selectedAnswer).length

return (
  <section>
     {handleGame()}
  </section>
  
);
}

