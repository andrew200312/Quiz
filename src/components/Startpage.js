import React from "react"

export default function Startpage(props) {
    return (
        <div className="start-page">
            <h1>Quizzical</h1>
            <p>Some description if needed</p>
            <button
                onClick={() => props.toggleStart()}
            >
            Start quiz
            </button>
        </div>
    )
}