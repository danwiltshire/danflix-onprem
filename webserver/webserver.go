package webserver

import (
	"net/http"
	"fmt"
)

func Start() {
	http.HandleFunc("/hello", hello)

	http.ListenAndServe(":8090", nil)
}

func hello(w http.ResponseWriter, req *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	switch req.Method {
    case "GET":
      w.WriteHeader(http.StatusOK)
      w.Write([]byte(`{"message": "GET method requested"}`))
    case "POST":
        w.WriteHeader(http.StatusCreated)
		w.Write([]byte(`{"message": "POST method requested"}`))
		fmt.Fprintf(w, "The id is: %v", req.FormValue("id"))
    default:
        w.WriteHeader(http.StatusNotFound)
        w.Write([]byte(`{"message": "Can't find method requested"}`))
    }
}