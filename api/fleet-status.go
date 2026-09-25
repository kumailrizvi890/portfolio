// Package main implements Cluster Pulse: a small Go service that simulates
// fleet health telemetry the way a platform/infra team would monitor it
// (per-service status, p50/p99 latency, and a rollout risk score).
//
// This runs as a Vercel Go Serverless Function (one exported Handler per
// file, Vercel's Go runtime handles the rest). Data is simulated
// deterministically from the current time bucket so numbers move slowly and
// believably instead of jumping around on every refresh, and so two people
// hitting the demo in the same minute see the same fleet state.
package handler

import (
	"encoding/json"
	"math"
	"net/http"
	"time"
)

type serviceStatus struct {
	Name      string  `json:"name"`
	Region    string  `json:"region"`
	Status    string  `json:"status"`
	LatencyMs float64 `json:"latencyMs"`
	P99Ms     float64 `json:"p99Ms"`
	ErrorRate float64 `json:"errorRatePct"`
	Replicas  int     `json:"replicas"`
}

type fleetResponse struct {
	GeneratedAt     string          `json:"generatedAt"`
	ClusterCount    int             `json:"clusterCount"`
	DeployRiskScore int             `json:"deployRiskScore"`
	RiskBand        string          `json:"riskBand"`
	IncidentNote    *string         `json:"incidentNote"`
	Services        []serviceStatus `json:"services"`
}

var fleetServices = []struct {
	name     string
	region   string
	base     float64
	replicas int
}{
	{"api-gateway", "us-west-2", 42, 12},
	{"auth-service", "us-west-2", 38, 8},
	{"job-scheduler", "us-east-1", 61, 6},
	{"vector-index", "us-east-1", 88, 10},
	{"notification-bus", "eu-central-1", 54, 5},
	{"billing-ledger", "us-west-2", 47, 4},
}

// seededWave produces a smooth, deterministic pseudo-random wave in [0,1)
// so the demo feels alive without real infrastructure behind it.
func seededWave(seed int64, offset float64) float64 {
	x := math.Sin(float64(seed)*0.017 + offset*3.1)
	return (x + 1) / 2
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Cache-Control", "no-store")

	// Bucket time into 20-second windows so the "live" feed updates at a
	// human-readable cadence rather than every millisecond.
	bucket := time.Now().Unix() / 20

	// A visitor-triggered load-spike simulation: ?stress=1 biases latency and
	// error rate upward so the risk score and status dots visibly react to
	// something the person on the page just did, rather than only drifting on
	// their own. Still fully deterministic per time bucket, no real load is
	// generated anywhere.
	stress := r.URL.Query().Get("stress") == "1"
	stressMultiplier := 1.0
	if stress {
		stressMultiplier = 2.6
	}

	services := make([]serviceStatus, 0, len(fleetServices))
	riskAccumulator := 0.0
	incidentNote := (*string)(nil)

	for i, svc := range fleetServices {
		wave := seededWave(bucket, float64(i))
		jitter := seededWave(bucket+int64(i)*7, float64(i)*1.7) * stressMultiplier

		latency := svc.base + wave*22*stressMultiplier
		p99 := latency*1.9 + jitter*30
		errorRate := math.Round((jitter*0.6)*100) / 100

		status := "ok"
		if errorRate > 0.35 {
			status = "warn"
			riskAccumulator += 14
		}
		if errorRate > 0.55 {
			status = "down"
			riskAccumulator += 26
			note := svc.name + " is past its error-rate SLO in " + svc.region
			incidentNote = &note
		}

		services = append(services, serviceStatus{
			Name:      svc.name,
			Region:    svc.region,
			Status:    status,
			LatencyMs: math.Round(latency*10) / 10,
			P99Ms:     math.Round(p99*10) / 10,
			ErrorRate: errorRate,
			Replicas:  svc.replicas,
		})
	}

	riskScore := int(math.Min(96, math.Max(4, 18+riskAccumulator+seededWave(bucket, 9.9)*20)))
	riskBand := "low"
	if riskScore > 40 {
		riskBand = "elevated"
	}
	if riskScore > 70 {
		riskBand = "high"
	}

	resp := fleetResponse{
		GeneratedAt:     time.Now().UTC().Format(time.RFC3339),
		ClusterCount:    3,
		DeployRiskScore: riskScore,
		RiskBand:        riskBand,
		IncidentNote:    incidentNote,
		Services:        services,
	}

	json.NewEncoder(w).Encode(resp)
}
