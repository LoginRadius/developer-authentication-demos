package main

import (
	"encoding/json"
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

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(respCode)
	if errors != "" {
		log.Printf(errors)
		w.Write([]byte(errors))
		return
	}
	w.Write([]byte(res.Body))
}

func handlepost(c *gin.Context) {
	var w http.ResponseWriter = c.Writer
	var r *http.Request = c.Request
	var errors string
	respCode := 200

	cfg := lr.Config{
		ApiKey:    os.Getenv("APIKEY"),
		ApiSecret: os.Getenv("APISECRET"),
	}

	lrclient, err := lr.NewLoginradius(&cfg)
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
	uid := c.Request.URL.Query().Get("Uid")

	res, err := account.Loginradius(account.Loginradius{lrclient}).
		PutManageAccountUpdate(
			uid,
			data,
		)

	if err != nil {
		errors = errors + err.(lrerror.Error).OrigErr().Error()
		respCode = 500
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(respCode)
	if errors != "" {
		log.Printf(errors)
		log.Printf(uid)
		w.Write([]byte(errors))
		return
	}
	w.Write([]byte(res.Body))
}
