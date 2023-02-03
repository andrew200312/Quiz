import React from "react"
import Startpage from "./components/Startpage"
import Quizz from "./components/Quizz"
import {nanoid} from "nanoid"
import './App.css';


export default function App () {
    const [start, setStart] = React.useState(true)
    const [allQuestion, setAllQuestion] = React.useState([])
    const [checkedAnswers, setCheckedAnswers] = React.useState()
    function toggleStart() {
        setStart(!start)
    }
    let countCorrect = 0
    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then(res => res.json())
            .then(data => setAllQuestion(prevAllQuestion => data.results.map(componentData => {
                const arrCorrectAnswer = [componentData.correct_answer]
                const allAnswers = arrCorrectAnswer.concat(componentData.incorrect_answers)
                
                var j, temp;
                for(var i = allAnswers.length - 1; i > 0; i--){
                    j = Math.floor(Math.random()*(i + 1));
                    temp = allAnswers[j];
                    allAnswers[j] = allAnswers[i];
                    allAnswers[i] = temp;
                }
                const objAnswer = allAnswers.map(answer => {
                    return{
                        answer: answer,
                        id: nanoid(),
                        isHeld: false,
                        isCorrect: (componentData.correct_answer === answer) ? true : false,
                    }
                })
                // console.log(objAnswer)
                return {
                    question: componentData.question,
                    answers: objAnswer,
                    correct_answer: componentData.correct_answer
                }
            })))
    }, [])
    
    function toggle(id) {
        // console.log(id)
        setAllQuestion(prevAllQuestion => prevAllQuestion.map(element => {
            for (let i = 0; i < element.answers.length; i++){
                if (element.answers[i].id === id && !checkedAnswers){
                    element.answers[i].isHeld = !element.answers[i].isHeld
                    console.log("hjkl")
                }
            }
            return element
        }))
    }
    
    const styleChecked = {
        backgroundColor: "#D6DBF5",
        border: "none"
    }
    const style = {
        backgroundColor: "#F5F7FB"
    }
    const styleCorrect = {
        backgroundColor: "#94D7A2",
        border: "none"
    }
    const styleIncorrect = {
        backgroundColor: "#F8BCBC",
        border: "none"
    }
    
    const quizzElement = allQuestion.map(element => {
        const answers = element.answers.map(answer => {
            let styleElement
            if(answer.isHeld && !checkedAnswers) {
                styleElement = styleChecked
            } else if(!answer.isHeld && !checkedAnswers){
                styleElement = style
            } else if(checkedAnswers && answer.isCorrect){
                styleElement = styleCorrect
            } else if(answer.isHeld && checkedAnswers && !answer.isCorrect){
                styleElement = styleIncorrect
            }
            if(answer.isHeld && checkedAnswers && answer.isCorrect){
                countCorrect++
            }
            return (
                <div className="answer" 
                    style={styleElement} 
                    key={nanoid()} 
                    onClick={() => toggle(answer.id)}
                    >
                    {answer.answer}
                </div>
            )
        })
        return <Quizz key={nanoid()} question={element.question} answers={answers}/>
    })
    
    function checkAnswers() {
        if (checkedAnswers){
            setCheckedAnswers(!checkAnswers)
        }else {
            setCheckedAnswers(true)
        }
    }
    if (checkedAnswers === false){document.location.reload()}
     return(
        <main>
            {start 
            ? <Startpage toggleStart={toggleStart}/>
            : 
            <div className="quizz-page">
                {quizzElement}
                <center>
                    {checkedAnswers && <p className="finishCorrect">{`You scored ${countCorrect}/5 correct answers`}</p>}
                    <button onClick={checkAnswers}>{checkedAnswers ? "Play again" : "Check answers"}</button>
                </center>
            </div>
            }
        </main>
    )
}