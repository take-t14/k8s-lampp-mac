#!/bin/bash

kubectl config set-context docker-desktop --namespace=k8s-lampp-mac  

skaffold run

