import React, {useState} from 'react';
import "./TinderCards.css";
import TinderCard from 'react-tinder-card';

function TinderCards() {
    const [people, setPeople]= useState([
        {
            name:"Elon musk",
            url:"https://www.biography.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTY2MzU3Nzk2OTM2MjMwNTkx/elon_musk_royal_society.jpg"
        },
        {
            name:"jeff bezos",
            url:"https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg"
        },

    ]);

    const swiped = (direction, nameToDelete)=>{
        console.log('removing'+ nameToDelete);
        //setLastDirection(direction);
    };

    const outOfFrame = (name)=>{
        console.log(name+ "left tge screnn");
    };

    return (
        <div className="tinderCards">
            <div className="tinderCards__cardContainer">
                {people.map((person)=> (
                    
                    <TinderCard 
                    className="swipe"
                    key={person.name}
                    preventSwipe={["dp","down"]}
                    onSwipe={(dir)=>swiped(dir,person.name)}
                    onCardLeftScreen={()=>outOfFrame(person.name)}
                    >
                        <div
                         style={{backgroundImage: `url(${person.url})`}}
                         className="card"  
                        >
                           <h3>{person.name}</h3>
                        </div>
                    </TinderCard>
                ))}
            </div>
        </div>
    )
}

export default TinderCards;
