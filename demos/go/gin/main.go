package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	lr "github.com/LoginRadius/go-sdk"
	account "github.com/LoginRadius/go-sdk/api/account"
	lrauthentication "github.com/LoginRadius/go-sdk/api/authentication"
	"github.com/LoginRadius/go-sdk/lrerror"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

var router *gin.Engine

type Output struct {
	Data    interface{} `json:"data"`
	Message string `json:"message"`
	Status  string `json:"status"`
}

func main() {
	//env files
	err := godotenv.Load("config.env")

	if err != nil {
		log.Fatal("Error loading env files")
	}
	// Set the router as the default one shipped with Gin
	router := gin.Default()

	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("../../../theme", true)))

	router.GET("/api", func(c *gin.Context) { //api routing
		c.JSON(http.StatusOK, gin.H{
			"message": "Successfully started",
		})
	})
	router.GET("/api/profile", handleget)   //Get request
	router.POST("/api/profile", handlepost) //Post Request
	// Start and run the server
	router.Run(":3000")

}
func handleget(c *gin.Context) {
	var w http.ResponseWriter = c.Writer
	var errors string
	var out Output
	out.Message = "an error occoured"
	out.Status = "error"

	token := c.Request.URL.Query().Get("token")
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

func handlepost(c *gin.Context) {
	var w http.ResponseWriter = c.Writer
	var errors string
	respCode := 200
	var out Output
	out.Message = "an error occoured"
	out.Status = "error"

	cfg := lr.Config{
		ApiKey:    os.Getenv("APIKEY"),
		ApiSecret: os.Getenv("APISECRET"),
	}
	token := c.Request.URL.Query().Get("token")

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

	var datauser map[string]interface{}
	er := json.Unmarshal([]byte(res.Body), &datauser)
	if er != nil {
		//panic(err)
	}
	uid := fmt.Sprintf("%v", datauser["Uid"])

	data := struct {
		FirstName string
		LastName  string
		About     string
	}{}

	b, _ := ioutil.ReadAll(c.Request.Body)
	json.Unmarshal(b, &data)

	response, err := account.Loginradius(account.Loginradius{lrclient}).
		PutManageAccountUpdate(
			uid,
			data,
		)

	if err != nil {
		errors = errors + err.(lrerror.Error).OrigErr().Error()
		respCode = 500
	} else {
		out.Message = "Profile has been updated successfully."
		out.Status = "success"
		out.Data = response.Body
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
