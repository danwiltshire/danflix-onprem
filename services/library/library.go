package library

import (
	"fmt"
	"net/http"
)

type movie struct {
	id    int
	path  []string
	title string
	md5   string
}

type episode struct {
	id      int
	path    []string
	title   string
	episode int
	season  int
	md5     string
}

func GetLibrary(w http.ResponseWriter, req *http.Request) {

	fmt.Println("GetLibrary()")

	w.Header().Set("Content-Type", "application/json")

	switch req.Method {
	case "GET":
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message": "GET method requested"}`))
	default:
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"message": "Can't find method requested"}`))
	}
}
