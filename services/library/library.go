package library

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
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

func WalkMatch(root, pattern string) ([]string, error) {
	var matches []string
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		if matched, err := filepath.Match(pattern, filepath.Base(path)); err != nil {
			return err
		} else if matched {
			matches = append(matches, path)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return matches, nil
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
