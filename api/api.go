package api

import (
	"net/http"

	"github.com/danwiltshire/danflix-onprem/services/library"
)

func Start() {
	http.HandleFunc("/library", library.GetLibrary)

	http.ListenAndServe(":8090", nil)
}
