#!/bin/bash

# You need to install kubectl, minikube and helm

export KUBECONFIG=$HOME/.kube/config

# Load local images
docker build -t logs-app-frontend:latest ./frontend
docker build -t logs-app-backend:latest ./backend
minikube delete --all
minikube start
minikube image load logs-app-frontend:latest
minikube image load logs-app-backend:latest

# Deploy using helm 
helm upgrade --install logs-app ./logs-app --values ./logs-app/values.yaml