export default function StartScreen({ onStart }) {
    return (
           <main className={"start-container"}>
                <section>
                    <h1>Quizzical</h1>
                       <p>Answer all the questions and find out your score!</p>
                    <button className={"start-btn"} onClick={onStart}>Start quiz</button>
                </section>
           </main>
    )
 
}