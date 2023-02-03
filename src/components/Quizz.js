import React from "react"

export default function Quizz (props) {
    return (
        <div className="quizz">
            <h1 className="question">{props.question}</h1>
            <div className="answers">
                {props.answers}
            </div>
            <hr />
        </div>
    )
}