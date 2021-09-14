#!/bin/bash

kubectl config set-context microk8s --namespace=k8s-lampp-mac  

skaffold run

