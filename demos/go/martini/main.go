package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	lr "github.com/LoginRadius/go-sdk"
	lrauthentication "github.com/LoginRadius/go-sdk/api/authentication"
	"github.com/LoginRadius/go-sdk/lrerror"
	"github.com/go-martini/martini"
	"github.com/joho/godotenv"
)

type Output struct {
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
	Status  string      `json:"status"`
}

func main() {

	app := martini.Classic()
	//env files
	err := godotenv.Load("config.env")

	if err != nil {
		log.Fatal("Error loading env files")
	}

	app.Use(martini.Static("../../../theme"))

	app.Get("/api/profile", handleget)   //Get request
	app.Post("/api/profile", handlepost) //Post Request

	app.Run()
}

func handleget(w http.ResponseWriter, r *http.Request) {
	var errors string
	var out Output
	out.Message = "an error occoured"
	out.Status = "error"

	token := r.URL.Query().Get("token")
	respCode := 200

	cfg := lr.Config{
		ApiKey:    os.Getenv("APIKEY"),
		ApiSecret: os.Getenv("APISECRET"),
	}
	lrclient, err := lr.NewLoginradius(
		&cfg,
		map[string]string{"token": token},
	)
	if err != nil {
		errors = errors + err.(lrerror.Error).OrigErr().Error()
		respCode = 500
	}

	res, err := lrauthentication.Loginradius(lrauthentication.Loginradius{lrclient}).GetAuthReadProfilesByToken()
	if err != nil {
		errors = errors + err.(lrerror.Error).OrigErr().Error()
		respCode = 500
	}

	var data map[string]interface{}
	er := json.Unmarshal([]byte(res.Body), &data)
	if er != nil {
		//panic(err)
	}
	if data["Uid"] != nil {
		out.Data = data
		out.Message = "Profile fetched"
		out.Status = "success"
	} else {
		out.Message = "Account does not exist."
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(respCode)
	if errors != "" {
		log.Printf(errors)
		w.Write([]byte(errors))
	}
	b, e := json.Marshal(out)
	if e != nil {
		//panic(err)
	}
	w.Write([]byte(b))
}

func handlepost(w http.ResponseWriter, r *http.Request) {
	var errors string
	respCode := 200
	var out Output
	out.Message = "an error occoured"
	out.Status = "error"

	cfg := lr.Config{
		ApiKey:    os.Getenv("APIKEY"),
		ApiSecret: os.Getenv("APISECRET"),
	}
	token := r.URL.Query().Get("token")

	lrclient, err := lr.NewLoginradius(
		&cfg,
		map[string]string{"token": token},
	)
	if err != nil {
		errors = errors + err.(lrerror.Error).OrigErr().Error()
		respCode = 500
	}

	data := struct {
		FirstName string
		LastName  string
		About     string
	}{}

	b, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(b, &data)

	response, err := lrauthentication.Loginradius(lrauthentication.Loginradius{lrclient}).PutAuthUpdateProfileByToken(
		data,
	)

	if err != nil {
		errors = errors + err.(lrerror.Error).OrigErr().Error()
		respCode = 500
	} else {
		var data map[string]interface{}
		er := json.Unmarshal([]byte(response.Body), &data)
		if er != nil {
			//panic(err)
		}
		if data["IsPosted"] == true {
			out.Message = "Profile has been updated successfully."
			out.Status = "success"
			out.Data = data["Data"]
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(respCode)
	if errors != "" {
		log.Printf(errors)
		w.Write([]byte(errors))
		return
	}
	b, e := json.Marshal(out)
	if e != nil {
		//panic(err)
	}
	w.Write([]byte(b))
}
