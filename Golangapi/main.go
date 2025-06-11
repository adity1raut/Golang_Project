package main

import (
	"encoding/json"
	"net/http"

	"Golangapi/jokes" // import your jokes package
)

func jokeHandler(w http.ResponseWriter, r *http.Request) {
	randomJoke := jokes.GetRandomJoke()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"joke": randomJoke,
	})
}

func main() {
	http.HandleFunc("/joke", jokeHandler)
	http.ListenAndServe(":8080", nil)
}
