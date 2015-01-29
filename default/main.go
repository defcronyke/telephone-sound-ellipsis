package default_module

import (
	"fmt"
    "net/http"
    "appengine"
    "github.com/gorilla/mux"
)

func init() {
    r := mux.NewRouter()
    r.PathPrefix("/").Handler(http.FileServer(http.Dir("./static/")))
    r.HandleFunc("/", MainHandler)
    http.Handle("/", r)
}

func MainHandler(w http.ResponseWriter, r *http.Request) {

    ctx := appengine.NewContext(r)
    _ = ctx

    fmt.Fprintf(w, "ImageMods Coming Soon")
}