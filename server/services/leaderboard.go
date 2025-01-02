package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/prkshayush/remindryt/models"
)

type LeaderboardService struct {
	aiServiceURL string
}

func NewLeaderboardService() *LeaderboardService {
	return &LeaderboardService{
		aiServiceURL: os.Getenv("BACKEND_AI_URL"),
	}
}

func (s *LeaderboardService) GetLeaderboard(groupID string) (*models.LeaderboardResponse, error){
	res, err := http.Get(fmt.Sprintf("%s/leaderboard/%s", s.aiServiceURL, groupID))
	if err != nil{
		return nil, err
	}

	defer res.Body.Close()

	var leaderboard models.LeaderboardResponse
	if err := json.NewDecoder(res.Body).Decode(&leaderboard); err != nil{
		return nil, err
	}

	return &leaderboard, nil
}