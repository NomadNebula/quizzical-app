export default function QuizScreen({ questions, onCheck, score, isQuizChecked, onPlayAgain }) {
    
    return (
      <main className={"quiz-container"}>
          <section className={"trivia"}>{questions}
             </section>
               
             <section className={"check-btn-container"}>
                 {isQuizChecked && <p>You scored {score}/5 correct answers</p>}
                  <button onClick={isQuizChecked ? onPlayAgain : onCheck}  className={"check-btn"}>
                 {isQuizChecked ? "Play Again" : "Check Answers"}</button> 
             </section>
        </main>
    )
}