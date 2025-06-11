package jokes

import (
	"math/rand"
	"time"
)

var jokeList = []string{
	"Why don’t scientists trust atoms? Because they make up everything!",
	"I told my wife she was drawing her eyebrows too high. She looked surprised.",
	"Why did the scarecrow win an award? Because he was outstanding in his field!",
	"Why don’t programmers like nature? It has too many bugs.",
	"Why do cows have hooves instead of feet? Because they lactose.",
}

func GetRandomJoke() string {
	rand.Seed(time.Now().UnixNano())
	return jokeList[rand.Intn(len(jokeList))]
}
