package default_module

import (
	"net/http"
	// "github.com/gorilla/mux"
)

func redirect(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://defcronyke.github.io/ts-camera-filter", http.StatusFound)
}

func init() {
	// r := mux.NewRouter()
	// r.PathPrefix("/").Handler(http.FileServer(http.Dir("./static/")))
	http.HandleFunc("/", redirect)
}
