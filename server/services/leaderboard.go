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

func (s *LeaderboardService) GetLeaderboard(groupID string) (*models.LeaderboardResponse, error) {
    resp, err := http.Get(fmt.Sprintf("%s/leaderboard/%s", s.aiServiceURL, groupID))
    if err != nil {
        return nil, fmt.Errorf("failed to fetch leaderboard data: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("failed to fetch leaderboard data: status code %d", resp.StatusCode)
    }

    var leaderboardResponse models.LeaderboardResponse
    err = json.NewDecoder(resp.Body).Decode(&leaderboardResponse)
    if err != nil {
        return nil, fmt.Errorf("failed to parse leaderboard data: %w", err)
    }

    return &leaderboardResponse, nil
}