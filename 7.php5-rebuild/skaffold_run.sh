#!/bin/bash

kubectl config set-context docker-desktop --namespace=k8s-lapp-mac

kubectl delete -f ./k8s-sv.yaml
skaffold run

