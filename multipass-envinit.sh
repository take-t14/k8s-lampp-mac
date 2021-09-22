#!/bin/zsh

# Dockerの向きをmicrok8sの仮想環境へ向ける
export DOCKER_HOST=tcp://multipass-host:2376
# kubectlの向きをmicrok8sの仮想環境へ向ける
export KUBECONFIG=~/.kube/microk8s.kubeconfig
# skaffoldの向きをmicrok8sの仮想環境へ向ける
skaffold config unset insecure-registries
skaffold config set insecure-registries multipass-host:32000
skaffold config unset default-repo
skaffold config set default-repo multipass-host:32000