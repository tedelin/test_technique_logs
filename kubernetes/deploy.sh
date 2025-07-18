#!/bin/bash

# You need to install kubectl and minikube

export KUBECONFIG=$HOME/.kube/config

# Load local images
docker build -t logs-app-frontend:latest ../frontend
docker build -t logs-app-backend:latest ../backend
minikube delete --all
minikube start
minikube image load logs-app-frontend:latest
minikube image load logs-app-backend:latest

# Apply configs files 
kubectl apply -f config/
kubectl apply -f deployments/
kubectl apply -f services/