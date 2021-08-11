#!/bin/bash

kubectl config set-context docker-desktop --namespace=k8s-lampp-mac  

kubectl delete -f ./k8s-sv.yaml
skaffold run
