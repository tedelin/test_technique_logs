# 📮 Full Stack Logs App - Kubernetes Bonus

App full stack to store and search for logs built with FastAPI, OpenSearch React.

## Information

For this Kubernetes setup, I used Minikube with NodePort to expose the application. This is appropriate for local development and testing.  
In a real-world production scenario, I would use Ingress with proper domain names and TLS for better scalability, routing, and security.  
I opted not to use Ingress here to keep the local deployment simple and focused.

## Prerequisites

- Minikube
- Kubectl
- Helm

## ⚠️ Warning

The minikube ip may change you may need to edit the host value in logs-app/values.yaml.  
To get your minikube ip run :

```bash
minikube ip
```

## ⚙️ How to deploy

```bash
./deploy.sh
```

## How to access

If you are using default value you can navigate to `http://192.168.49.2:30000`
