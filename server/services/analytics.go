package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/prkshayush/remindryt/models"
)

type AnalyticsService struct {
	aiServiceURL string
}

func NewAnalyticsService() *AnalyticsService{
	return &AnalyticsService{
		aiServiceURL: os.Getenv("BACKEND_AI_URL"),
	}
}

func (s *AnalyticsService) GetGroupAnalytics(groupID string) (*models.AnalyticsResponse, error){
	res, err := http.Get(fmt.Sprintf("%s/analysis/%s", s.aiServiceURL, groupID))
	if err != nil{
		return nil, err
	}

	defer res.Body.Close()

	var analytics models.AnalyticsResponse
	if err := json.NewDecoder(res.Body).Decode(&analytics); err != nil{
		return nil, err
	}

	return &analytics, nil
}