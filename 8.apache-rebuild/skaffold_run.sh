#!/bin/bash

kubectl config set-context minikube --namespace=k8s-lampp-mac  

kubectl delete -f ./k8s-sv.yaml
skaffold run

