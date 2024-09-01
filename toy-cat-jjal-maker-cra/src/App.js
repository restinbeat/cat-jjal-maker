import './App.css';
import React from 'react';
import Title from './components/Title.js';
import MainCard from './components/MainCard.js';
import Form from './components/Form.js';

const jsonLocalStorage = {
    setItem: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
        return JSON.parse(localStorage.getItem(key));
    },
};

const fetchCat = async (text) => {
    const OPEN_API_DOMAIN = 'https://cataas.com';
    const response = await fetch(
        `${OPEN_API_DOMAIN}/cat/says/${text}?json=true`
    );
    const responseJson = await response.json();
    return `${OPEN_API_DOMAIN}/cat/${responseJson._id}/says/${text}`; // NOTE: API 스펙 변경으로 강의 영상과 다른 URL로 변경했습니다.
};

function CatItem(props) {
    return (
        <li>
            <img src={props.img} alt={props.alt} style={{ width: '150px' }} />
        </li>
    );
}

function Favorites({ favorites }) {
    if (favorites.length === 0) {
        return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
    }
    return (
        <ul className="favorites">
            {favorites.map((cat) => (
                <CatItem img={cat} key={cat} />
            ))}
        </ul>
    );
}

const App = () => {
    const CAT1 = 'https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react';

    // counterState initial value
    const [counter, setCounter] = React.useState(() => {
        return jsonLocalStorage.getItem('counter');
    });

    // same code
    // const counter = counterState[0];
    // const setCounter = counterState[1];

    const [mainCat, setMainCat] = React.useState(CAT1);

    const [favorites, setFavorites] = React.useState(() => {
        return jsonLocalStorage.getItem('favorites') || [];
    });

    async function setInitialCat() {
        const newCat = await fetchCat('First Cat');
        setMainCat(newCat);
    }

    React.useEffect(() => {
        setInitialCat();
    }, []);
    // useEffect {}, [value] <- value 변경시에만 업데이트

    const alreadyFavorite = favorites.includes(mainCat);

    async function updateMainCat(value) {
        const newCat = await fetchCat(value);
        setMainCat(newCat);

        setCounter((prev) => {
            const nextCounter = prev + 1;
            jsonLocalStorage.setItem('counter', nextCounter);
            return nextCounter;
        });
    }

    function handleHeartClick() {
        // ES6 spread operator
        const nextFavorites = [...favorites, mainCat];
        setFavorites(nextFavorites);
        jsonLocalStorage.setItem('favorites', nextFavorites);
    }

    const counterTitle = counter ? `${counter}번째` : '';

    return (
        <div>
            <Title>{counterTitle} 고양이 가라사대</Title>
            <Form updateMainCat={updateMainCat} />
            <MainCard
                img={mainCat}
                onHeartClick={handleHeartClick}
                alreadyFavorite={alreadyFavorite}
            />
            <Favorites favorites={favorites} />
        </div>
    );
};

export default App;
